import { initFirebaseAdmin } from '~/server/utils/firebaseAdmin';

export default defineEventHandler(async (event) => {
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
    const claims = decoded as unknown as Record<string, unknown>;
    if (!claims.admin)
      return createError({ statusCode: 403, statusMessage: 'forbidden' });
  } catch (e) {
    console.warn('[admin users delete] invalid session cookie', e);
    return createError({ statusCode: 401, statusMessage: 'unauthenticated' });
  }

  // Obter o UID do usuário a ser deletado
  const body = await readBody(event);
  const { uid } = body;

  if (!uid || typeof uid !== 'string') {
    return createError({
      statusCode: 400,
      statusMessage: 'uid is required and must be a string',
    });
  }

  try {
    // Deletar o usuário do Firebase Auth
    await admin.auth().deleteUser(uid);

    return {
      success: true,
      message: 'Usuário deletado com sucesso',
    };
  } catch (e) {
    console.error('[admin users delete] error deleting user:', e);
    return createError({
      statusCode: 500,
      statusMessage: 'Erro ao deletar usuário',
    });
  }
});
