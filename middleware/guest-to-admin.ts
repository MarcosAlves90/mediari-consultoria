/**
 * Middleware para redirecionar usuários autenticados da página de login.
 * Se o usuário já estiver logado na página /admin, redireciona para /admin/candidaturas.
 * Caso contrário, permite o acesso à página de login.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // Executa apenas para a página de login, incluindo variações com prefixo de locale
  // Exemplos válidos: /admin, /admin/, /en-us/admin, /pt-br/admin
  const isAdminPath =
    to.path === '/admin' ||
    to.path === '/admin/' ||
    /^(?:\/[a-z]{2}-[a-z]{2})\/admin(?:\/|$)/i.test(to.path);

  if (!isAdminPath) return;

  try {
    const res = await $fetch('/api/session');
    if (res && res.authenticated) {
      // Usa o composable seguro que lida com a ausência do helper auto-importado
      const { useLocalePathSafe } = await import(
        '~/composables/useLocalePathSafe'
      );
      const localePath = useLocalePathSafe();
      return navigateTo(localePath('/admin/candidaturas'));
    }
  } catch {
    // Ignora erros — permite que o usuário veja o login
  }
});
