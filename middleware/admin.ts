export default defineNuxtRouteMiddleware((to) => {
    // Only run on client side
    if (import.meta.server) return;

    // Allow access to login page
    if (to.path === '/admin' || to.path === '/admin/') {
        return; // Allow access to login page
    }

    // For other admin pages, check session storage directly
    if (process.client) {
        const session = sessionStorage.getItem('mediari-admin-session');
        if (!session) {
            // Not authenticated, redirect to login
            return navigateTo('/admin');
        }
    }
});
