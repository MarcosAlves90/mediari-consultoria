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
    console.warn('[admin users] invalid session cookie', e);
    return createError({ statusCode: 401, statusMessage: 'unauthenticated' });
  }

  // Paginação: aceitar 'nextPageToken' como query
  const url = getRequestURL(event);
  const nextPageToken = url.searchParams.get('nextPageToken') || undefined;

  try {
    // listUsers retorna até 1000 por chamada, usaremos 100 por segurança
    const listResult = await admin.auth().listUsers(100, nextPageToken);

    const users = listResult.users.map((u) => {
      return {
        uid: u.uid,
        email: u.email || null,
        displayName: u.displayName || null,
        disabled: !!u.disabled,
        customClaims: u.customClaims || null,
        createdAt: u.metadata?.creationTime || null,
        lastSignInAt: u.metadata?.lastSignInTime || null,
      };
    });

    return {
      users,
      nextPageToken: listResult.pageToken || null,
    };
  } catch (e) {
    console.error('[admin users] list error', e);
    return createError({
      statusCode: 500,
      statusMessage: 'failed to list users',
    });
  }
});
