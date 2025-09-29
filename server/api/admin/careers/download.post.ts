import { initFirebaseAdmin } from '~/server/utils/firebaseAdmin';
import { z } from 'zod';
import type { H3Event } from 'h3';

// Protegido por middleware adminAuth via server middleware (ver server/middleware/adminAuth.ts)
const Payload = z.object({ storagePath: z.string() });

export default defineEventHandler(async (event: H3Event) => {
  const admin = initFirebaseAdmin();
  if (!admin)
    return createError({
      statusCode: 500,
      statusMessage: 'firebase-admin not initialized',
    });

  // Verificação defensiva de autenticação: verificar cookie de sessão
  const cookie = getCookie(event, 'mediari_session');
  if (!cookie)
    return createError({ statusCode: 401, statusMessage: 'unauthenticated' });

  try {
    const decoded = await admin.auth().verifySessionCookie(cookie, true);
    // Checar claim custom 'admin' (deve estar presente para permitir acesso)
    const claims = decoded as unknown as Record<string, unknown>;
    if (!claims.admin)
      return createError({ statusCode: 403, statusMessage: 'forbidden' });
  } catch (e) {
    console.warn('[admin download] invalid session cookie', e);
    return createError({ statusCode: 401, statusMessage: 'unauthenticated' });
  }

  const body = await readBody(event);
  const parse = Payload.safeParse(body);
  if (!parse.success)
    return createError({ statusCode: 400, statusMessage: 'invalid payload' });

  const { storagePath } = parse.data;

  try {
    const bucket = admin.storage().bucket();
    const file = bucket.file(storagePath.replace(/^\//, ''));
    // Gera signed URL para download por tempo limitado
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 1000 * 60 * 10,
    });
    return { downloadUrl: url };
  } catch (e) {
    console.error('admin download url error', e);
    return createError({
      statusCode: 500,
      statusMessage: 'failed to create download url',
    });
  }
});
