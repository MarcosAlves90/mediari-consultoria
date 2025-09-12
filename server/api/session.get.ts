import { initFirebaseAdmin } from '~/server/utils/firebaseAdmin';
import type { DecodedIdToken } from 'firebase-admin/auth';

/**
 * Handler de API para verificar o status de autenticação da sessão.
 * Verifica o cookie de sessão e retorna informações do usuário se autenticado.
 * Retorna { authenticated: false } se não houver cookie ou se for inválido.
 */
export default defineEventHandler(async (event) => {
  const cookie = getCookie(event, 'mediari_session');
  if (!cookie) return { authenticated: false };

  const admin = initFirebaseAdmin();
  if (!admin) return { authenticated: false };

  try {
    const decoded: DecodedIdToken = await admin
      .auth()
      .verifySessionCookie(cookie, true);
    // decoded pode conter email e nome dependendo do provedor
    return {
      authenticated: true,
      uid: decoded.uid,
      email: decoded.email || null,
      name: decoded.name || decoded.email || null,
    };
  } catch {
    return { authenticated: false };
  }
});
