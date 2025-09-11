import { initFirebaseAdmin } from '~/server/utils/firebaseAdmin'

/**
 * Handler de API para fazer logout do usuário.
 * Tenta revogar tokens de atualização no servidor para invalidar sessões existentes.
 * Sempre limpa o cookie de sessão, independentemente de erros.
 */
export default defineEventHandler(async (event) => {
  // Tenta revogar tokens de atualização no servidor se puder identificar a sessão
  try {
    const cookie = getCookie(event, 'mediari_session')
    if (cookie) {
      const admin = initFirebaseAdmin()
      if (admin) {
        try {
          // verifySessionCookie para obter uid
          const decoded = await admin.auth().verifySessionCookie(cookie, true)
          if (decoded && decoded.uid) {
            // Revoga tokens de atualização para que cookies de sessão existentes se tornem inválidos na verificação
            await admin.auth().revokeRefreshTokens(decoded.uid)
          }
        } catch (e) {
          // ignora erros de verificação — ainda limpa o cookie
          // eslint-disable-next-line no-console
          console.warn('[session.delete] não pôde verificar cookie de sessão antes de revogar', e)
        }
      }
    }
  } catch (e) {
    // ignora erros durante tentativa de revogação
    // eslint-disable-next-line no-console
    console.warn('[session.delete] tentativa de revogação falhou', e)
  }

  // Limpa cookie
  const sameSite = (process.env.NUXT_SESSION_SAMESITE || 'strict') as any
  setCookie(event, 'mediari_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite,
    path: '/',
    maxAge: 0,
  })

  return { ok: true }
})
