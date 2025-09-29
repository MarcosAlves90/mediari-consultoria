import { initFirebaseAdmin } from '~/server/utils/firebaseAdmin';

/**
 * Middleware do lado do servidor para autenticação de rotas administrativas.
 * Verifica o cookie de sessão do Firebase para proteger rotas /admin.
 * Se o cookie for inválido ou ausente, redireciona para a página de login.
 * Permite acesso público à página de login para evitar loop de redirecionamento.
 */
export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  // Protege apenas rotas admin (mas permite a página de login `/admin` em si)
  if (!url.pathname.startsWith('/admin')) return;
  // Permite que a página de login (raiz /admin) seja pública para evitar loop de redirecionamento
  if (url.pathname === '/admin' || url.pathname === '/admin/') return;

  const cookie = getCookie(event, 'mediari_session');
  if (!cookie) {
    // Redireciona para login preservando possível prefixo de locale
    const segments = url.pathname.split('/').filter(Boolean);
    if (segments.length && /^[a-z]{2}-[a-z]{2}$/i.test(segments[0])) {
      return sendRedirect(event, `/${segments[0]}/admin`);
    }
    return sendRedirect(event, '/admin');
  }

  const admin = initFirebaseAdmin();
  if (!admin) return sendRedirect(event, '/admin');

  try {
    const decoded = await admin.auth().verifySessionCookie(cookie, true);
    // Anexa o usuário ao contexto do evento com tipagem segura
    (event.context as unknown as { auth?: { uid: string } }).auth = {
      uid: decoded.uid,
    };
  } catch (e: unknown) {
    console.warn('[adminAuth] sessão inválida ou erro de verificação', e);
    const segments = url.pathname.split('/').filter(Boolean);
    if (segments.length && /^[a-z]{2}-[a-z]{2}$/i.test(segments[0])) {
      return sendRedirect(event, `/${segments[0]}/admin`);
    }
    return sendRedirect(event, '/admin');
  }
});
