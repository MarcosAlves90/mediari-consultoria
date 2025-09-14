import { initFirebaseAdmin } from '~/server/utils/firebaseAdmin';
import { z } from 'zod';

const Payload = z.object({
  firstName: z.string().min(1),
  lastName: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  positionApplied: z.string().optional(),
  storagePath: z.string().optional(), // path no Storage para curriculum
  requestId: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  const admin = initFirebaseAdmin();
  if (!admin)
    return createError({
      statusCode: 500,
      statusMessage: 'firebase-admin not initialized',
    });

  const body = await readBody(event);
  const parse = Payload.safeParse(body);
  if (!parse.success)
    return createError({ statusCode: 400, statusMessage: 'invalid payload' });

  const data = parse.data;

  try {
    const db = admin.firestore();
    const candidatesCol = db.collection('candidates');
    const candidateRef = candidatesCol.doc();

    const batch = db.batch();

    const candidateDoc = {
      firstName: data.firstName,
      lastName: data.lastName || null,
      email: data.email,
      phone: data.phone || null,
      positionApplied: data.positionApplied || null,
      status: 'submitted',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    } as Record<string, unknown>;

    batch.set(candidateRef, candidateDoc);

    if (data.storagePath) {
      // mover arquivo de temp para caminho definitivo: candidates/{candidateId}/{filename}
      const bucket = admin.storage().bucket();
      const originalPath = data.storagePath.replace(/^\//, '');
      const originalName = originalPath.split('/').pop() || 'file';
      const finalPath = `candidates/${candidateRef.id}/${originalName}`;

      try {
        const file = bucket.file(originalPath);
        const destFile = bucket.file(finalPath);

        // Tenta usar move() quando suportado pelo wrapper
        const maybeFileWithMove = file as unknown as {
          move?: (dest: unknown) => Promise<void>;
        };
        if (typeof maybeFileWithMove.move === 'function') {
          await maybeFileWithMove.move(destFile);
        } else {
          // fallback: copy + delete
          await file.copy(destFile);
          try {
            await file.delete();
          } catch (delErr) {
            console.warn('failed to delete original file after copy', delErr);
          }
        }

        const attachments = [
          {
            name: originalName,
            storagePath: finalPath,
            uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
            moved: true,
          },
        ];

        batch.update(candidateRef, { attachments });
      } catch (err) {
        console.error('file move error', err);
        const attachments = [
          {
            name: originalName,
            storagePath: data.storagePath,
            uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
            moveFailed: true,
          },
        ];
        batch.update(candidateRef, { attachments });
      }
    }

    await batch.commit();

    return { candidateId: candidateRef.id };
  } catch (e) {
    console.error('submit error', e);
    return createError({
      statusCode: 500,
      statusMessage: 'failed to submit candidate',
    });
  }
});
