/**
 * Middleware para proteger rotas administrativas.
 * Verifica se o usuário está autenticado antes de permitir acesso às rotas admin.
 * Se não estiver autenticado, redireciona para a página de login.
 */
export default defineNuxtRouteMiddleware(async (to) => {
    // Permite que a página de login seja pública
    if (to.path === '/admin' || to.path === '/admin/') return

    try {
        // Consulta o endpoint do servidor que valida o cookie de sessão httpOnly
        const res = await $fetch('/api/session')
        if (!res || !res.authenticated) {
            return navigateTo('/admin')
        }
    } catch (e) {
        // Se ocorrer qualquer erro, redireciona para o login
        return navigateTo('/admin')
    }
})
