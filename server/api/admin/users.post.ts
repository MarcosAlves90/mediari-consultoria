import { initFirebaseAdmin } from '~/server/utils/firebaseAdmin';

export default defineEventHandler(async (event) => {
  const admin = initFirebaseAdmin();
  if (!admin) {
    return createError({
      statusCode: 500,
      statusMessage: 'firebase-admin not initialized',
    });
  }

  // Verificação de autenticação
  const cookie = getCookie(event, 'mediari_session');
  if (!cookie) {
    return createError({ statusCode: 401, statusMessage: 'unauthenticated' });
  }

  let actor: Record<string, unknown> | null = null;

  try {
    const decoded = await admin.auth().verifySessionCookie(cookie, true);
    const claims = decoded as unknown as Record<string, unknown>;
    actor = claims;
    if (!claims.admin) {
      return createError({ statusCode: 403, statusMessage: 'forbidden' });
    }
    // Usuários com claim 'restrictedAdmin' não podem criar outros administradores
    if (claims.restrictedAdmin) {
      return createError({ statusCode: 403, statusMessage: 'forbidden' });
    }
  } catch (e) {
    console.warn('[admin users] invalid session cookie', e);
    return createError({ statusCode: 401, statusMessage: 'unauthenticated' });
  }

  // Lê o corpo da requisição
  const body = await readBody(event);

  if (!body.email || typeof body.email !== 'string') {
    return createError({
      statusCode: 400,
      statusMessage: 'email é obrigatório',
    });
  }

  if (!body.password || typeof body.password !== 'string') {
    return createError({
      statusCode: 400,
      statusMessage: 'password é obrigatório',
    });
  }

  // Validações básicas
  if (body.password.length < 6) {
    return createError({
      statusCode: 400,
      statusMessage: 'A senha deve ter pelo menos 6 caracteres',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(body.email)) {
    return createError({
      statusCode: 400,
      statusMessage: 'Email inválido',
    });
  }

  try {
    // Cria o usuário no Firebase Auth
    const userRecord = await admin.auth().createUser({
      email: body.email,
      password: body.password,
      displayName: body.displayName || null,
      disabled: false,
    });

    // Define claims conforme role
    const role = body.role === 'super' ? 'super' : 'restricted';
    const claimsToSet: Record<string, unknown> = { admin: true };
    if (role === 'super') claimsToSet.superAdmin = true;
    else claimsToSet.restrictedAdmin = true;

    await admin.auth().setCustomUserClaims(userRecord.uid, claimsToSet);

    // Auditoria: gravação no Firestore
    try {
      const db = admin.firestore();
      await db.collection('admin_audit_logs').add({
        action: 'create_admin',
        actorUid: actor?.uid ?? null,
        actorEmail: actor?.email ?? null,
        targetUid: userRecord.uid,
        targetEmail: userRecord.email ?? null,
        role: role,
        details: { claims: claimsToSet },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch (auditErr) {
      console.warn('[admin audit] failed to write create log', auditErr);
    }

    // Retorna as informações do usuário criado
    return {
      success: true,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        createdAt: userRecord.metadata.creationTime,
        disabled: userRecord.disabled,
        customClaims: claimsToSet,
      },
    };
  } catch (error: unknown) {
    console.error('[admin users] error creating user:', error);

    // Mapeia erros do Firebase para mensagens amigáveis
    let message = 'Erro interno do servidor';

    if (error && typeof error === 'object' && 'code' in error) {
      const firebaseError = error as { code: string };

      if (firebaseError.code === 'auth/email-already-exists') {
        message = 'Este email já está sendo usado por outro usuário';
      } else if (firebaseError.code === 'auth/invalid-email') {
        message = 'Email inválido';
      } else if (firebaseError.code === 'auth/weak-password') {
        message = 'A senha é muito fraca';
      }
    }

    return createError({
      statusCode: 400,
      statusMessage: message,
    });
  }
});
