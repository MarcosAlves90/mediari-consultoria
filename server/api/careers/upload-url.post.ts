import { initFirebaseAdmin } from '~/server/utils/firebaseAdmin';
import type { H3Event } from 'h3';
import type { GetSignedUrlConfig } from '@google-cloud/storage';

export default defineEventHandler(async (event: H3Event) => {
  const admin = initFirebaseAdmin();
  if (!admin)
    return createError({
      statusCode: 500,
      statusMessage: 'firebase-admin not initialized',
    });

  const body = (await readBody(event)) as {
    fileName?: string;
    contentType?: string;
  };
  const { fileName = 'upload.bin', contentType = 'application/octet-stream' } =
    body;

  try {
    const bucket = admin.storage().bucket();
    const filePath = `candidates/temp/${Date.now()}-${fileName}`;
    const file = bucket.file(filePath);

    const opts: GetSignedUrlConfig = {
      action: 'write',
      expires: Date.now() + 1000 * 60 * 10, // 10 minutes
      contentType,
    };

    const [url] = await file.getSignedUrl(opts);

    return { uploadUrl: url, storagePath: filePath };
  } catch (e) {
    console.error('upload-url error', e);
    return createError({
      statusCode: 500,
      statusMessage: 'failed to create signed url',
    });
  }
});
