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
  const isEmulator = process.env.FIREBASE_STORAGE_EMULATOR_HOST;

  try {
    const db = admin.firestore();
    const candidatesCol = db.collection('candidates');
    const candidateRef = candidatesCol.doc();

    const candidateDoc = {
      firstName: data.firstName,
      lastName: data.lastName || null,
      email: data.email,
      phone: data.phone || null,
      positionApplied: data.positionApplied || null,
      status: 'submitted',
      createdAt: isEmulator
        ? new Date().toISOString()
        : admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: isEmulator
        ? new Date().toISOString()
        : admin.firestore.FieldValue.serverTimestamp(),
    } as Record<string, unknown>;

    console.log('[submit] Salvando documento candidato...');
    await candidateRef.set(candidateDoc);
    console.log('[submit] Documento candidato salvo');

    if (data.storagePath) {
      console.log('[submit] Processando arquivo:', data.storagePath);

      const originalPath = data.storagePath.replace(/^\//, '');
      const originalName = originalPath.split('/').pop() || 'file';

      if (isEmulator) {
        console.log('[submit] Modo emulator - registrando arquivo sem mover');

        const attachments = [
          {
            name: originalName,
            storagePath: data.storagePath,
            uploadedAt: new Date().toISOString(),
            emulatorMode: true,
          },
        ];

        console.log('[submit] Atualizando documento com attachments...');
        await candidateRef.update({ attachments });
        console.log('[submit] Attachments adicionados');
      } else {
        // Lógica de produção - mover arquivo
        try {
          const bucket = admin.storage().bucket();
          const finalPath = `candidates/${candidateRef.id}/${originalName}`;

          console.log('[submit] Movendo arquivo:', { originalPath, finalPath });

          const file = bucket.file(originalPath);
          const destFile = bucket.file(finalPath);

          // Verificar se o arquivo existe antes de tentar mover
          const [exists] = await file.exists();
          if (!exists) {
            throw new Error('Arquivo não encontrado');
          }

          // Tenta usar move() quando suportado pelo wrapper
          const maybeFileWithMove = file as unknown as {
            move?: (dest: unknown) => Promise<void>;
          };
          if (typeof maybeFileWithMove.move === 'function') {
            console.log('[submit] Usando método move()');
            await maybeFileWithMove.move(destFile);
          } else {
            // fallback: copy + delete
            console.log('[submit] Usando método copy+delete');
            await file.copy(destFile);
            try {
              await file.delete();
            } catch (delErr) {
              console.warn('failed to delete original file after copy', delErr);
            }
          }

          console.log('[submit] Arquivo movido com sucesso');

          const attachments = [
            {
              name: originalName,
              storagePath: finalPath,
              uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
              moved: true,
            },
          ];

          await candidateRef.update({ attachments });
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
          await candidateRef.update({ attachments });
        }
      }
    }

    return { candidateId: candidateRef.id };
  } catch (e) {
    console.error('submit error', e);
    return createError({
      statusCode: 500,
      statusMessage: 'failed to submit candidate',
      data: { error: e instanceof Error ? e.message : String(e) },
    });
  }
});
