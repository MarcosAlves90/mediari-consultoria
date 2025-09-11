/**
 * Middleware para redirecionar usuários autenticados da página de login.
 * Se o usuário já estiver logado na página /admin, redireciona para /admin/candidaturas.
 * Caso contrário, permite o acesso à página de login.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // Executa apenas na página de login
  if (to.path !== '/admin' && to.path !== '/admin/') return

  try {
    const res = await $fetch('/api/session')
    if (res && res.authenticated) {
      return navigateTo('/admin/candidaturas')
    }
  } catch (e) {
    // Ignora erros — permite que o usuário veja o login
  }
})
