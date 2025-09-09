<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

interface AdminUser {
    id: string;
    email: string;
    name: string;
    role: string;
    lastLogin: string;
}

type LoginErrorType = "INVALID_CREDENTIALS" | "SERVER_ERROR" | null;

const email = ref<string>("");
const password = ref<string>("");
const isLoading = ref<boolean>(false);
const error = ref<LoginErrorType>(null);
const showPassword = ref<boolean>(false);

const hasError = computed((): boolean => error.value !== null);

const errorMessage = computed((): string => {
    if (!error.value) return "";

    switch (error.value) {
        case "INVALID_CREDENTIALS":
            return t("admin.login.invalid_credentials");
        case "SERVER_ERROR":
            return t("admin.login.server_error");
        default:
            return t("admin.login.server_error");
    }
});

const handleLogin = async (): Promise<void> => {
    console.log('handleLogin: Iniciando processo de login');

    if (isLoading.value) return;

    error.value = null;

    if (!email.value || !password.value) {
        console.log('handleLogin: Falha na validação - campos vazios');
        error.value = "INVALID_CREDENTIALS";
        return;
    }

    console.log('handleLogin: Tentativa de login para:', {
        email: email.value,
        passwordLength: password.value.length
    });

    const isValidCredentials =
        email.value.toLowerCase() === 'admin@mediari.com.br' &&
        password.value === 'mediari2025';

    if (isValidCredentials) {
        console.log('handleLogin: Credenciais válidas, iniciando redirecionamento');
        isLoading.value = true;

        try {
            if (process.client) {
                const adminUser: AdminUser = {
                    id: "admin-1",
                    email: "admin@mediari.com.br",
                    name: "Administrador",
                    role: "Super Admin",
                    lastLogin: new Date().toISOString()
                };

                sessionStorage.setItem('mediari-admin-session', JSON.stringify(adminUser));
                console.log('handleLogin: Sessão salva no sessionStorage');
            }

            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('handleLogin: Redirecionando para dashboard');
            await navigateTo('/admin/candidaturas');

        } catch (err) {
            console.error('handleLogin: Erro na navegação:', err);
            error.value = "SERVER_ERROR";
            isLoading.value = false;
        }
    } else {
        console.log('handleLogin: Credenciais inválidas fornecidas');
        error.value = "INVALID_CREDENTIALS";
    }
};
</script>

<template>
    <div class="login-card w-full max-w-5xl bg-white rounded overflow-hidden max-lg:max-w-none max-lg:w-full">
        <div class="login-container flex min-h-[600px]">

            <div class="login-left flex-1 relative overflow-hidden bg-gradient-to-br from-accent-color via-accent-dark-color to-accent-color flex flex-col justify-center items-start p-4 text-white max-lg:hidden">
                <div class="relative z-10 max-w-md">
                    <h1 class="text-3xl font-bold mb-1 leading-tight">
                        {{ t("admin.login.welcome_back") }}
                    </h1>
                    <p class="text-base opacity-90 leading-relaxed">
                        {{ t("admin.login.welcome_message") }}
                    </p>
                </div>
            </div>

            <div class="login-right flex-1 flex flex-col justify-center items-center p-4 bg-white max-lg:p-2">
                <div class="w-full max-w-md">

                    <div class="text-center mb-2">
                        <h2 class="text-2xl font-bold text-primary-text">
                            {{ t("admin.login.title") }}
                        </h2>
                    </div>

                    <div
                        v-if="hasError"
                        class="mb-2 p-1.25 bg-accent-color-2 border border-accent-color rounded-lg"
                        role="alert"
                        aria-live="polite"
                    >
                        <div class="flex items-start">
                            <Icon
                                name="mdi:alert-circle"
                                class="w-1.25 h-1.25 mr-0.75 text-accent-color flex-shrink-0 mt-0.125"
                                aria-hidden="true"
                            />
                            <div class="flex-1">
                                <h3 class="text-sm font-semibold text-accent-color">
                                    {{ t("admin.login.error_title") }}
                                </h3>
                                <p class="mt-0.25 text-sm text-accent-color">
                                    {{ errorMessage }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <form
                        @submit.prevent="handleLogin"
                        class="space-y-1.5"
                        novalidate
                    >
                        <div>
                            <label
                                for="email"
                                class="block text-sm font-medium text-primary-text mb-0.5"
                            >
                                {{ t("admin.login.email") }}
                            </label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                                    <Icon
                                        name="mdi:email"
                                        class="h-1.25 w-1.25 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </div>
                                <input
                                    id="email"
                                    v-model="email"
                                    type="email"
                                    required
                                    autocomplete="username"
                                    class="w-full pl-3 pr-1 py-0.75 border-2 border-gray-300 rounded focus:border-accent-color focus:outline-none transition-colors duration-200 text-primary-text"
                                    placeholder="mediari@gmail.com"
                                    :disabled="isLoading"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                for="password"
                                class="block text-sm font-medium text-primary-text mb-0.5"
                            >
                                {{ t("admin.login.password") }}
                            </label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                                    <Icon
                                        name="mdi:lock"
                                        class="h-1.25 w-1.25 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </div>
                                <input
                                    id="password"
                                    v-model="password"
                                    :type="showPassword ? 'text' : 'password'"
                                    required
                                    autocomplete="current-password"
                                    class="w-full pl-3 pr-3 py-0.75 border-2 border-gray-300 rounded focus:border-accent-color focus:outline-none transition-colors duration-200 text-primary-text"
                                    :placeholder="t('admin.login.password_placeholder')"
                                    :disabled="isLoading"
                                />
                                <button
                                    type="button"
                                    @click="showPassword = !showPassword"
                                    class="absolute cursor-pointer inset-y-0 right-0 pr-0.75 flex items-center text-gray-400 hover:text-primary-text transition-colors duration-200"
                                    :aria-label="showPassword ? t('admin.login.hide_password') : t('admin.login.show_password')"
                                    :disabled="isLoading"
                                >
                                    <Icon
                                        :name="showPassword ? 'mdi:eye-off' : 'mdi:eye'"
                                        class="h-1.25 w-1.25"
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                :disabled="isLoading || !email || !password"
                                class="w-full bg-accent-color text-white border-2 border-accent-color hover:bg-accent-dark-color hover:border-accent-dark-color disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] rounded transition-all duration-200 flex items-center justify-center gap-0.5 font-semibold cursor-pointer text-sm"
                                :aria-label="isLoading ? t('admin.login.logging_in') : t('admin.login.sign_in')"
                            >
                                <Icon
                                    v-if="isLoading"
                                    name="mdi:loading"
                                    class="h-1.25 w-1.25 animate-spin"
                                    aria-hidden="true"
                                />
                                <Icon
                                    v-else
                                    name="mdi:login"
                                    class="h-1.25 w-1.25"
                                    aria-hidden="true"
                                />
                                <span>
                                    {{ isLoading ? t("admin.login.logging_in") : t("admin.login.sign_in") }}
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.login-left {
    background-size: cover;
    background-position: center;
}

@media (max-width: 1024px) {
    .login-left {
        display: none;
    }

    .login-right {
        flex: 1;
        width: 100%;
    }
}

.login-right input:focus {
    box-shadow: 0 0 0 3px rgba(var(--accent-color-rgb), 0.1);
}

.login-right button:focus-visible {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
}
</style>
