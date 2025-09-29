import { initFirebaseAdmin } from '~/server/utils/firebaseAdmin';
import { z } from 'zod';

const Payload = z.object({
  candidateId: z.string().optional(),
  answers: z.record(z.string(), z.string()),
});

export default defineEventHandler(async (event) => {
  const admin = initFirebaseAdmin();
  if (!admin)
    return createError({
      statusCode: 500,
      message: 'firebase-admin not initialized',
    });

  const body = await readBody(event);
  const parse = Payload.safeParse(body);
  if (!parse.success)
    return createError({ statusCode: 400, message: 'invalid payload' });

  const data = parse.data;
  const isEmulator = process.env.FIREBASE_STORAGE_EMULATOR_HOST;

  try {
    const db = admin.firestore();

    if (data.candidateId) {
      const candidateRef = db.collection('candidates').doc(data.candidateId);
      const profileRef = candidateRef.collection('profileTests').doc();

      await profileRef.set({
        answers: data.answers,
        createdAt: isEmulator
          ? new Date().toISOString()
          : admin.firestore.FieldValue.serverTimestamp(),
      });

      return { ok: true };
    }

    // Se não há candidateId, grava em coleção genérica para posterior associação
    const genericRef = db.collection('profileTests').doc();
    await genericRef.set({
      answers: data.answers,
      createdAt: isEmulator
        ? new Date().toISOString()
        : admin.firestore.FieldValue.serverTimestamp(),
    });

    return { ok: true };
  } catch (e) {
    console.error('profile submit error', e);
    return createError({
      statusCode: 500,
      message: 'failed to submit profile test',
    });
  }
});
