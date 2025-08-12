<template>
    <div class="admin-layout min-h-screen bg-body-bg">
        <!-- Admin Navigation -->
        <nav class="sticky top-0 z-50 bg-body-bg border-accent-color border-b-2">
            <div class="max-w-7xl mx-auto px-0.5 300:px-0.75 500:px-1 870:px-1.5">
                <div class="flex justify-between items-start 500:items-center min-h-[70px] 500:h-5 py-1 500:py-0 gap-1 500:gap-0">
                    <!-- Logo e título -->
                    <div class="flex items-center flex-shrink-0 group">
                        <NuxtLink to="/" class="flex items-center transition-transform duration-200 hover:scale-105">
                              <Icon name="my-icon:mediari-logo" size="40" class="w-auto mr-1 500:mr-1.5 transition-all duration-200 filter drop-shadow-sm" />
                            <div class="flex flex-col">
                                <span class="text-lg 500:text-xl font-medium text-gray-900 tracking-tight">
                                    Mediari
                                </span>
                                <span class="text-xs 500:text-sm font-medium text-accent-color -mt-0.5">
                                    Painel Administrativo
                                </span>
                            </div>
                        </NuxtLink>
                    </div>

                    <!-- Container de navegação e ações -->
                    <div class="flex items-center gap-1 500:gap-2">
                        <!-- Desktop Navigation -->
                        <div v-if="screenWidth >= 500" class="flex flex-col 300:flex-row gap-0.5 300:gap-1">
                            <!-- Admin Menu -->
                            <NuxtLink
                                to="/admin/candidaturas"
                                class="border-2 border-accent-color bg-accent-color px-0.5 py-0.5 rounded-sm cursor-pointer flex justify-center items-center gap-0.5 text-body-bg hover:bg-accent-color-2 hover:text-accent-color hover:border-accent-color-2 transition duration-200 min-h-[45px] min-w-[45px]"
                            >
                                <span class="relative flex items-center justify-center 500:justify-start">
                                    <Icon name="mdi:account-group" class="w-1 h-1 mr-0.5 500:mr-1" />
                                    {{ t("admin.nav.candidates") }}
                                </span>
                            </NuxtLink>

                            <!-- Logout Button -->
                            <button
                                @click="handleLogout"
                                :disabled="isLoggingOut"
                                class="common-button"
                            >
                                <Icon
                                    :name="isLoggingOut ? 'mdi:loading' : 'mdi:logout'"
                                    :class="[
                                        'w-1 h-1 500:w-1.25 500:h-1.25 mr-0.75 z-10',
                                        isLoggingOut ? 'animate-spin' : ''
                                    ]"
                                />
                                <span class="z-10 hidden 300:inline">{{ isLoggingOut ? t("admin.nav.logging_out") : t("admin.nav.logout") }}</span>
                                <span class="z-10 300:hidden">{{ isLoggingOut ? "..." : "Sair" }}</span>
                            </button>
                        </div>

                        <!-- Mobile Hamburger Menu -->
                        <button v-if="screenWidth < 500" class="common-button text-[1.5rem]"
                            :class="{ 'bg-accent-color-2': hamburguerMenuOpen }"
                            @click="toggleHamburguerMenu"
                            :aria-label="hamburguerMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'">
                            <Transition name="icon-morph" mode="out-in">
                                <Icon v-if="!hamburguerMenuOpen" class="w-[30px] aspect-square"
                                    name="mdi:menu" key="menu" />
                                <Icon v-else class="w-[30px] aspect-square" name="mdi:close"
                                    key="close" />
                            </Transition>
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Mobile Navigation Menu -->
        <Transition name="slide-fade-nav">
            <nav v-show="screenWidth < 500 && hamburguerMenuOpen"
                class="admin-mobile-nav flex absolute top-[100px] left-0 right-0 flex-col gap-1 p-1 overflow-hidden border-b-2 backdrop-blur-sm max-h-[500px] opacity-100 visible bg-body-bg border-accent-color z-40"
            >
                <!-- Admin Menu Mobile -->
                <NuxtLink
                    to="/admin/candidaturas"
                    @click="hamburguerMenuOpen = false"
                    class="box-border w-full rounded-sm border-2 border-accent-color px-1 py-0.5 text-center text-base no-underline hover:bg-accent-color-2 flex items-center justify-center gap-0.5"
                >
                    <Icon name="mdi:account-group" class="w-1 h-1 mr-0.5" />
                    {{ t("admin.nav.candidates") }}
                </NuxtLink>

                <!-- Logout Button Mobile -->
                <button
                    @click="handleLogout(); hamburguerMenuOpen = false"
                    :disabled="isLoggingOut"
                    class="box-border w-full rounded-sm border-2 border-accent-color px-1 py-0.5 text-center text-base hover:bg-accent-color-2 flex items-center justify-center gap-0.5 bg-transparent"
                >
                    <Icon
                        :name="isLoggingOut ? 'mdi:loading' : 'mdi:logout'"
                        :class="[
                            'w-1 h-1 mr-0.5',
                            isLoggingOut ? 'animate-spin' : ''
                        ]"
                    />
                    {{ isLoggingOut ? t("admin.nav.logging_out") : t("admin.nav.logout") }}
                </button>
            </nav>
        </Transition>

        <!-- Main Content -->
        <main class="flex-1 relative">
            <!-- Content container -->
            <div class="relative z-10">
                <slot />
            </div>
        </main>

        <!-- Admin Footer -->
        <footer class="bg-accent-color py-1.5 500:py-2">
            <div class="max-w-7xl mx-auto px-1 300:px-1.5 500:px-2 870:px-3">
                <div class="flex flex-col 500:flex-row items-center justify-between gap-1 500:gap-0">
                    <div class="text-center 500:text-left text-xs 500:text-sm text-body-bg">
                        <span class="font-medium">© {{ currentYear }} Mediari Consultoria</span>
                        <span class="hidden 500:inline mx-1">•</span>
                        <span class="text-body-bg">
                            <span class="hidden 500:inline">{{ t("admin.footer.admin_panel") }}</span>
                            <span class="500:hidden">Admin Panel</span>
                        </span>
                    </div>

                    <!-- Status indicator -->
                    <div class="flex items-center text-xs text-body-bg">
                        <div class="w-0.5 h-0.5 bg-green-500 rounded mr-0.5 animate-pulse shadow-sm"></div>
                        <span class="font-medium">Sistema Online</span>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useScreenWidth } from '@/utils/useScreenWidth';

const { t } = useI18n();
const screenWidth = useScreenWidth();

const currentYear = computed(() => new Date().getFullYear());
const isLoggingOut = ref(false);
const hamburguerMenuOpen = ref(false);

// Get current user from session storage
const currentUser = ref<any>(null);
if (process.client) {
    const session = sessionStorage.getItem('mediari-admin-session');
    if (session) {
        currentUser.value = JSON.parse(session);
    }
}

const toggleHamburguerMenu = () => {
    hamburguerMenuOpen.value = !hamburguerMenuOpen.value;
};

const handleLogout = async () => {
    isLoggingOut.value = true;
    hamburguerMenuOpen.value = false; // Fecha o menu ao fazer logout
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
.slide-fade-nav-enter-active,
.slide-fade-nav-leave-active {
    transition: opacity 0.2s, max-height 0.2s;
    will-change: opacity, max-height;
}

.slide-fade-nav-enter-from,
.slide-fade-nav-leave-to {
    opacity: 0;
    max-height: 0;
}

.slide-fade-nav-enter-to,
.slide-fade-nav-leave-from {
    opacity: 1;
    max-height: 500px;
}

.icon-morph-enter-active,
.icon-morph-leave-active {
    transition: opacity 0.2s, filter 0.2s, border-radius 0.2s, transform 0.2s;
}

.icon-morph-enter-from,
.icon-morph-leave-to {
    opacity: 0;
    filter: blur(6px);
    border-radius: 50%;
    transform: scale(0.7) rotate(-90deg);
}

.icon-morph-enter-to,
.icon-morph-leave-from {
    opacity: 1;
    filter: blur(0);
    border-radius: 0;
    transform: scale(1) rotate(0deg);
}
</style>
