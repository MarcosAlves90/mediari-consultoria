<template>
    <div class="admin-layout min-h-screen bg-gray-50">
        <!-- Admin Navigation -->
        <nav class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-0.5 300:px-0.75 500:px-1 870:px-1.5">
                <div class="flex flex-col 500:flex-row justify-between items-start 500:items-center min-h-[60px] 500:h-4 py-0.5 500:py-0 gap-0.5 500:gap-0">
                    <!-- Logo e título -->
                    <div class="flex items-center flex-shrink-0">
                        <NuxtLink to="/" class="flex items-center">
                            <Icon name="my-icon:mediari-logo" class="h-1.5 500:h-2 w-auto mr-0.5 500:mr-0.75" />
                            <span class="text-base 500:text-lg font-semibold text-gray-900">
                                Mediari Admin
                            </span>
                        </NuxtLink>
                    </div>

                    <!-- Container de navegação e ações -->
                    <div class="flex flex-col 500:flex-row items-stretch 500:items-center w-full 500:w-auto gap-0.5 500:gap-1">
                        <!-- Admin Menu -->
                        <div class="flex flex-col 500:flex-row 500:space-x-0.25 gap-0.25 500:gap-0">
                            <NuxtLink
                                to="/admin/candidaturas"
                                class="px-0.75 py-0.5 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors text-center 500:text-left"
                                active-class="bg-gray-100 text-gray-900"
                            >
                                {{ t("admin.nav.candidates") }}
                            </NuxtLink>
                        </div>

                        <!-- User Info & Actions -->
                        <div class="flex flex-col 500:flex-row items-stretch 500:items-center gap-0.5 500:gap-0.75">
                            <!-- User greeting -->
                            <div v-if="currentUser" class="text-xs 500:text-sm text-gray-600 text-center 500:text-left py-0.25 500:py-0">
                                {{ t("admin.nav.welcome") }}, {{ currentUser.name }}
                            </div>

                            <!-- Action buttons container -->
                            <div class="flex flex-col 300:flex-row gap-0.25 300:gap-0.5">
                                <!-- Logout Button -->
                                <button
                                    @click="handleLogout"
                                    :disabled="isLoggingOut"
                                    class="inline-flex items-center justify-center px-0.75 py-0.5 border border-red-300 shadow-sm text-xs 500:text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 disabled:opacity-50 transition-colors min-h-[36px]"
                                >
                                    <Icon
                                        :name="isLoggingOut ? 'mdi:loading' : 'mdi:logout'"
                                        :class="[
                                            'w-0.75 h-0.75 500:w-1 500:h-1 mr-0.5',
                                            isLoggingOut ? 'animate-spin' : ''
                                        ]"
                                    />
                                    <span class="hidden 300:inline">{{ isLoggingOut ? t("admin.nav.logging_out") : t("admin.nav.logout") }}</span>
                                    <span class="300:hidden">{{ isLoggingOut ? "..." : "Sair" }}</span>
                                </button>

                                <!-- Return to main site -->
                                <NuxtLink
                                    to="/"
                                    class="inline-flex items-center justify-center px-0.75 py-0.5 border border-gray-300 shadow-sm text-xs 500:text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accent-color min-h-[36px]"
                                >
                                    <Icon name="mdi:arrow-left" class="w-0.75 h-0.75 500:w-1 500:h-1 mr-0.5" />
                                    <span class="hidden 300:inline">{{ t("admin.nav.back_to_site") }}</span>
                                    <span class="300:hidden">Site</span>
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <main class="flex-1">
            <slot />
        </main>

        <!-- Admin Footer -->
        <footer class="bg-white border-t border-gray-200 py-0.75 500:py-1">
            <div class="max-w-7xl mx-auto px-0.5 300:px-0.75 500:px-1 870:px-1.5">
                <div class="text-center text-xs 500:text-sm text-gray-500">
                    {{ t("admin.footer.copyright") }} {{ currentYear }} Mediari Consultoria -
                    <span class="hidden 500:inline">{{ t("admin.footer.admin_panel") }}</span>
                    <span class="500:hidden">Admin</span>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const currentYear = computed(() => new Date().getFullYear());
const isLoggingOut = ref(false);

// Get current user from session storage
const currentUser = ref<any>(null);
if (process.client) {
    const session = sessionStorage.getItem('mediari-admin-session');
    if (session) {
        currentUser.value = JSON.parse(session);
    }
}

const handleLogout = async () => {
    isLoggingOut.value = true;
    try {
        // Clear session
        if (process.client) {
            sessionStorage.removeItem('mediari-admin-session');
        }

        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Redirect to login
        await navigateTo('/admin');
    } finally {
        isLoggingOut.value = false;
    }
};
</script>

<style scoped>
.admin-layout {
    display: flex;
    flex-direction: column;
}

/* Melhorias para navegação responsiva */
@media (max-width: 499px) {
    nav {
        position: sticky;
        top: 0;
        backdrop-filter: blur(8px);
        background-color: rgba(255, 255, 255, 0.95);
    }
}

/* Otimizações para telas muito pequenas */
@media (max-width: 300px) {
    .admin-layout {
        font-size: 14px;
    }
}
</style>
