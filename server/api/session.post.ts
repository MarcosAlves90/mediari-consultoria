import { readBody, sendError } from 'h3';
import { initFirebaseAdmin } from '~/server/utils/firebaseAdmin';

/**
 * Handler de API para criar uma sessão de usuário.
 * Recebe um idToken do Firebase, verifica sua validade e cria um cookie de sessão.
 * O cookie é configurado como httpOnly para segurança.
 * Retorna o UID do usuário se bem-sucedido.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const idToken = body?.idToken;

  if (!idToken) {
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: 'idToken obrigatório' })
    );
  }

  const admin = initFirebaseAdmin();
  if (!admin) {
    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: 'falha na inicialização do firebase-admin',
      })
    );
  }

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);

    // Cria cookie de sessão. TTL configurável via env NUXT_SESSION_TTL_HOURS (padrão 24)
    const ttlHours = Number(process.env.NUXT_SESSION_TTL_HOURS || 24);
    const expiresIn = 60 * 60 * 1000 * Math.max(1, ttlHours);
    const sessionCookie = await admin
      .auth()
      .createSessionCookie(idToken, { expiresIn });

    // Define cookie httpOnly. sameSite configurável via env NUXT_SESSION_SAMESITE (strict|lax|none).
    const sameSite = (process.env.NUXT_SESSION_SAMESITE || 'strict') as
      | 'strict'
      | 'lax'
      | 'none';
    setCookie(event, 'mediari_session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite,
      path: '/',
      maxAge: expiresIn / 1000,
    });

    return { ok: true, uid: decoded.uid };
  } catch (e) {
    console.error('[session.post] erro', e);
    return sendError(
      event,
      createError({ statusCode: 401, statusMessage: 'idToken inválido' })
    );
  }
});
