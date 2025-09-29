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

  let actor: Record<string, unknown> | null = null;

  try {
    const decoded = await admin.auth().verifySessionCookie(cookie, true);
    const claims = decoded as unknown as Record<string, unknown>;
    actor = claims;
    if (!claims.admin)
      return createError({ statusCode: 403, statusMessage: 'forbidden' });
    // Usuários com claim 'restrictedAdmin' não podem deletar outros administradores
    if (claims.restrictedAdmin)
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

  // Impedir que um usuário delete sua própria conta
  if (actor && actor.uid === uid) {
    return createError({
      statusCode: 403,
      statusMessage: 'cannot delete own account',
    });
  }

  try {
    // Verifica claims do usuário alvo: não permitir deletar superAdmin
    const target = await admin.auth().getUser(uid);
    const targetClaims = target.customClaims || {};
    if (targetClaims.superAdmin) {
      return createError({
        statusCode: 403,
        statusMessage: 'cannot delete super admin',
      });
    }

    // Deletar o usuário do Firebase Auth
    await admin.auth().deleteUser(uid);

    // Auditoria: gravação no Firestore
    try {
      const db = admin.firestore();
      await db.collection('admin_audit_logs').add({
        action: 'delete_admin',
        actorUid: actor?.uid ?? null,
        actorEmail: actor?.email ?? null,
        targetUid: target.uid,
        targetEmail: target.email ?? null,
        details: { targetClaims: target.customClaims || null },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch (auditErr) {
      console.warn('[admin audit] failed to write delete log', auditErr);
    }

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
