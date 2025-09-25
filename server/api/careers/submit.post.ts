import { initFirebaseAdmin } from '~/server/utils/firebaseAdmin';
import { z } from 'zod';
import type { Bucket, File } from '@google-cloud/storage';

const PayloadSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  positionApplied: z.string().optional(),
  experience: z.string().optional(),
  coverLetter: z.string().optional(),
  storagePath: z.string().optional(),
  requestId: z.string().optional(),
});

type PayloadData = z.infer<typeof PayloadSchema>;

const createCandidateDoc = (data: PayloadData, isEmulator: boolean) => {
  const timestamp = isEmulator
    ? new Date().toISOString()
    : initFirebaseAdmin()!.firestore.FieldValue.serverTimestamp();

  return {
    firstName: data.firstName,
    lastName: data.lastName || null,
    email: data.email,
    phone: data.phone || null,
    positionApplied: data.positionApplied || null,
    experience: data.experience || null,
    coverLetter: data.coverLetter || null,
    status: 'submitted',
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

const createAttachment = (
  name: string,
  path: string,
  isEmulator: boolean,
  metadata?: Record<string, unknown>
) => ({
  name,
  storagePath: path,
  uploadedAt: isEmulator ? new Date().toISOString() : new Date(),
  ...(isEmulator && { emulatorMode: true }),
  ...metadata,
});

const moveFile = async (
  bucket: Bucket,
  originalPath: string,
  finalPath: string
) => {
  const file = bucket.file(originalPath);
  const destFile = bucket.file(finalPath);

  const [exists] = await file.exists();
  if (!exists) throw new Error('Arquivo não encontrado');

  // Tenta usar move() se disponível
  const fileWithMove = file as File & { move?: (dest: File) => Promise<void> };
  if (typeof fileWithMove.move === 'function') {
    await fileWithMove.move(destFile);
  } else {
    // Fallback: copy + delete
    await file.copy(destFile);
    try {
      await file.delete();
    } catch (delErr) {
      console.warn('Falha ao deletar arquivo original:', delErr);
    }
  }
};

export default defineEventHandler(async (event) => {
  const admin = initFirebaseAdmin();
  if (!admin) {
    throw createError({
      statusCode: 500,
      message: 'Firebase Admin não inicializado',
    });
  }

  const body = await readBody(event);
  const parseResult = PayloadSchema.safeParse(body);

  if (!parseResult.success) {
    throw createError({
      statusCode: 400,
      message: 'Payload inválido',
      data: parseResult.error.issues,
    });
  }

  const data = parseResult.data;
  const isEmulator = !!process.env.FIREBASE_STORAGE_EMULATOR_HOST;

  try {
    const db = admin.firestore();
    const candidateRef = db.collection('candidates').doc();

    // Salvar candidato
    const candidateDoc = createCandidateDoc(data, isEmulator);
    await candidateRef.set(candidateDoc);

    // Processar arquivo se existir
    if (data.storagePath) {
      const originalPath = data.storagePath.replace(/^\//, '');
      const originalName = originalPath.split('/').pop() || 'file';

      if (isEmulator) {
        // Modo emulator - apenas registrar
        const attachments = [
          createAttachment(originalName, data.storagePath, true),
        ];
        await candidateRef.update({ attachments });
      } else {
        // Modo produção - mover arquivo
        try {
          const bucket = admin.storage().bucket();
          const finalPath = `candidates/${candidateRef.id}/${originalName}`;

          await moveFile(bucket, originalPath, finalPath);

          const attachments = [
            createAttachment(originalName, finalPath, false, { moved: true }),
          ];
          await candidateRef.update({ attachments });
        } catch (fileError) {
          console.error('Erro ao mover arquivo:', fileError);

          // Registrar arquivo no local original em caso de erro
          const attachments = [
            createAttachment(originalName, data.storagePath, false, {
              moveFailed: true,
            }),
          ];
          await candidateRef.update({ attachments });
        }
      }
    }

    return { candidateId: candidateRef.id };
  } catch (error) {
    console.error('Erro na submissão:', error);
    throw createError({
      statusCode: 500,
      message: 'Falha ao processar candidatura',
      data: { error: error instanceof Error ? error.message : String(error) },
    });
  }
});
