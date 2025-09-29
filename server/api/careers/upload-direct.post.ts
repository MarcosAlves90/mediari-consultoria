import { initFirebaseAdmin } from '~/server/utils/firebaseAdmin';
import type { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
  const admin = initFirebaseAdmin();
  if (!admin) {
    return createError({
      statusCode: 500,
      statusMessage: 'firebase-admin not initialized',
    });
  }

  // Verificar se estamos no modo emulator
  if (!process.env.FIREBASE_STORAGE_EMULATOR_HOST) {
    return createError({
      statusCode: 400,
      statusMessage: 'endpoint apenas para emulator',
    });
  }

  try {
    const formData = await readMultipartFormData(event);
    if (!formData || formData.length === 0) {
      return createError({
        statusCode: 400,
        statusMessage: 'nenhum arquivo encontrado',
      });
    }

    const file = formData[0];
    if (!file.filename) {
      return createError({
        statusCode: 400,
        statusMessage: 'nome do arquivo requerido',
      });
    }

    const fileName = file.filename;
    const filePath = `candidates/temp/${Date.now()}-${fileName}`;

    // Upload direto para o Storage Emulator usando Admin SDK
    const bucket = admin.storage().bucket();
    const storageFile = bucket.file(filePath);

    await storageFile.save(file.data, {
      metadata: {
        contentType: file.type || 'application/octet-stream',
      },
    });

    console.log('[upload-direct] Arquivo salvo:', filePath);

    return {
      success: true,
      storagePath: filePath,
      fileName: fileName,
    };
  } catch (e) {
    console.error('[upload-direct] Erro:', e);
    return createError({
      statusCode: 500,
      statusMessage: 'falha no upload',
    });
  }
});
