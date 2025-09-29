/**
 * Middleware para proteger rotas administrativas.
 * Verifica se o usuário está autenticado antes de permitir acesso às rotas admin.
 * Se não estiver autenticado, redireciona para a página de login.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // Permite que a página de login seja pública
  if (to.path === '/admin' || to.path === '/admin/') return;

  try {
    // Consulta o endpoint do servidor que valida o cookie de sessão httpOnly
    const res = await $fetch('/api/session');
    if (!res || !res.authenticated) {
      // usa composable seguro
      try {
        // Import dinâmico aqui dentro do middleware (evita erro quando não existir)
        const { useLocalePathSafe } = await import(
          '~/composables/useLocalePathSafe'
        );
        const lp = useLocalePathSafe();
        return navigateTo(lp('/admin'));
      } catch {
        // Fallback simples: permanece em /admin sem prefixo
        return navigateTo('/admin');
      }
    }
  } catch {
    // Se ocorrer qualquer erro, tenta redirecionar preservando locale quando possível
    try {
      const { useLocalePathSafe } = await import(
        '~/composables/useLocalePathSafe'
      );
      const lp = useLocalePathSafe();
      return navigateTo(lp('/admin'));
    } catch {
      // Fallback simples: permanece em /admin sem prefixo
      return navigateTo('/admin');
    }
  }
});
