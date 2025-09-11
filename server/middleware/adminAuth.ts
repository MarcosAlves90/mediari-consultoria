import { initFirebaseAdmin } from '~/server/utils/firebaseAdmin'

/**
 * Middleware do lado do servidor para autenticação de rotas administrativas.
 * Verifica o cookie de sessão do Firebase para proteger rotas /admin.
 * Se o cookie for inválido ou ausente, redireciona para a página de login.
 * Permite acesso público à página de login para evitar loop de redirecionamento.
 */
export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  // Protege apenas rotas admin (mas permite a página de login `/admin` em si)
  if (!url.pathname.startsWith('/admin')) return
  // Permite que a página de login (raiz /admin) seja pública para evitar loop de redirecionamento
  if (url.pathname === '/admin' || url.pathname === '/admin/') return

  const cookie = getCookie(event, 'mediari_session')
  if (!cookie) {
    // Redireciona para login
    return sendRedirect(event, '/admin')
  }

  const admin = initFirebaseAdmin()
  if (!admin) return sendRedirect(event, '/admin')

  try {
    const decoded = await admin.auth().verifySessionCookie(cookie, true)
      // Anexa o usuário ao contexto do evento (usa any para evitar problemas de parsing/TS)
      ; (event.context as any).auth = { uid: decoded.uid }
  } catch (e) {
    // Cookie inválido
    return sendRedirect(event, '/admin')
  }
})
