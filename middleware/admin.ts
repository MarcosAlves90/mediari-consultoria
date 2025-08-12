export default defineNuxtRouteMiddleware((to) => {
    /**
     * Middleware de proteção das rotas administrativas.
     * Executa apenas no lado do cliente e verifica se o usuário está autenticado via sessionStorage.
     * Caso não esteja autenticado, redireciona para a página de login.
     */

    // Executa apenas no lado do cliente
    if (import.meta.server) return;

    // Permite acesso à página de login do admin
    if (to.path === '/admin' || to.path === '/admin/') {
        return;
    }

    // Para demais páginas administrativas, verifica autenticação
    if (import.meta.client) {
        const session = sessionStorage.getItem('mediari-admin-session');
        if (!session) {
            // Usuário não autenticado, redireciona para login
            return navigateTo('/admin');
        }
    }
});
