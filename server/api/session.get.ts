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
    // decoded pode conter email, nome e claims/custom claims dependendo do provedor
    // Em tokens do Firebase as custom claims podem aparecer no próprio objeto decoded
    // (por exemplo `decoded.admin === true`) ou em campos nomeados differently.
    // Para garantir que o front receba os claims (admin/restrictedAdmin/superAdmin)
    // retornamos todo o objeto decoded como `customClaims` para que useCurrentUser
    // possa acessar `claims.admin` / `claims.superAdmin` corretamente.
    const decodedAsRecord = decoded as Record<string, unknown>;

    return {
      authenticated: true,
      uid: decoded.uid,
      email: decoded.email || null,
      name: decoded.name || decoded.email || null,
      // Retorna o objeto completo com claims (compatível com outras partes do código)
      customClaims: decodedAsRecord || null,
    };
  } catch {
    return { authenticated: false };
  }
});
