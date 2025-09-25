import { initFirebaseAdmin } from '~/server/utils/firebaseAdmin';
import type { H3Event } from 'h3';
import type { GetSignedUrlConfig } from '@google-cloud/storage';

interface UploadUrlRequest {
  fileName?: string;
  contentType?: string;
}

interface UploadUrlResponse {
  uploadUrl: string;
  storagePath: string;
  emulatorMode?: boolean;
  fileName?: string;
}

const DEFAULT_FILE_NAME = 'upload.bin';
const DEFAULT_CONTENT_TYPE = 'application/octet-stream';

export default defineEventHandler(
  async (event: H3Event): Promise<UploadUrlResponse> => {
    const admin = initFirebaseAdmin();

    if (!admin) {
      throw createError({
        statusCode: 500,
        message: 'Firebase Admin not initialized',
      });
    }

    const body = await readBody<UploadUrlRequest>(event);
    const { fileName = DEFAULT_FILE_NAME, contentType = DEFAULT_CONTENT_TYPE } =
      body;

    try {
      const filePath = generateFilePath(fileName);
      const isEmulatorMode = isRunningInEmulator();

      if (isEmulatorMode) {
        return handleEmulatorUpload(filePath, fileName);
      }

      return await handleProductionUpload(admin, filePath, contentType);
    } catch (error) {
      console.error('[upload-url] Error creating signed URL:', error);
      throw createError({
        statusCode: 500,
        message: 'Failed to create signed URL',
        data: { error: error instanceof Error ? error.message : String(error) },
      });
    }
  }
);

function generateFilePath(fileName: string): string {
  return `candidates/temp/${Date.now()}-${fileName}`;
}

function isRunningInEmulator(): boolean {
  return Boolean(process.env.FIREBASE_STORAGE_EMULATOR_HOST);
}

function handleEmulatorUpload(
  filePath: string,
  fileName: string
): UploadUrlResponse {
  console.log('[upload-url] Emulator mode - redirecting to direct upload');

  return {
    uploadUrl: '/api/careers/upload-direct',
    storagePath: filePath,
    emulatorMode: true,
    fileName,
  };
}

async function handleProductionUpload(
  admin: NonNullable<ReturnType<typeof initFirebaseAdmin>>,
  filePath: string,
  contentType: string
): Promise<UploadUrlResponse> {
  const bucketName = process.env.FIREBASE_STORAGE_BUCKET;

  if (!bucketName) {
    console.error('[upload-url] FIREBASE_STORAGE_BUCKET not defined');
    throw createError({
      statusCode: 500,
      message: 'Storage bucket not configured',
    });
  }

  const bucket = admin.storage().bucket(bucketName);
  const file = bucket.file(filePath);

  const signedUrlConfig: GetSignedUrlConfig = {
    action: 'write',
    expires: Date.now() + 1000 * 60 * 10, // 10 minutes
    contentType,
  };

  const [signedUrl] = await file.getSignedUrl(signedUrlConfig);

  return {
    uploadUrl: signedUrl,
    storagePath: filePath,
  };
}
