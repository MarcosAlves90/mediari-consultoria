<!--
    @fileoverview Componente de Login do Administrador
    @description Componente responsável pela autenticação de usuários administradores.
    Inclui validação de credenciais, exibição de mensagens de erro personalizadas,
    persistência de sessão e redirecionamento automático para o dashboard.

    @features
    - Autenticação de usuário administrador
    - Validação de formulário em tempo real
    - Exibição de mensagens de erro localizadas
    - Persistência de sessão no sessionStorage
    - Redirecionamento automático após login bem-sucedido
    - Suporte completo à internacionalização (i18n)
    - Interface responsiva com design moderno

    @author Mediari Consultoria
    @version 1.0.0
-->
<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";

/**
 * Composable para internacionalização
 * Fornece acesso às traduções da aplicação
 */
const { t } = useI18n();

/**
 * Interface para definir a estrutura dos dados do usuário administrador
 */
interface AdminUser {
    /** Identificador único do administrador */
    id: string;
    /** E-mail do administrador */
    email: string;
    /** Nome completo do administrador */
    name: string;
    /** Nível de acesso do administrador */
    role: string;
    /** Timestamp do último login */
    lastLogin: string;
}

/**
 * Tipos de erro possíveis durante o processo de login
 */
type LoginErrorType = "INVALID_CREDENTIALS" | "SERVER_ERROR" | null;

// ==================== ESTADO REATIVO ====================

/**
 * E-mail inserido pelo usuário no formulário de login
 */
const email = ref<string>("");

/**
 * Senha inserida pelo usuário no formulário de login
 */
const password = ref<string>("");

/**
 * Estado de carregamento durante o processo de autenticação
 */
const isLoading = ref<boolean>(false);

/**
 * Armazena o tipo de erro ocorrido durante o login
 */
const error = ref<LoginErrorType>(null);

/**
 * Controla a visibilidade da senha no campo de input
 */
const showPassword = ref<boolean>(false);

// ==================== PROPRIEDADES COMPUTADAS ====================

/**
 * Verifica se existe algum erro a ser exibido
 * @returns {boolean} True se houver erro, false caso contrário
 */
const hasError = computed((): boolean => error.value !== null);

/**
 * Retorna a mensagem de erro traduzida baseada no tipo de erro
 * @returns {string} Mensagem de erro localizada ou string vazia
 */
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

// ==================== MÉTODOS ====================

/**
 * Realiza a autenticação do administrador
 *
 * @description Este método executa o fluxo completo de login:
 * 1. Valida os campos obrigatórios
 * 2. Verifica as credenciais contra os dados configurados
 * 3. Persiste a sessão no sessionStorage em caso de sucesso
 * 4. Redireciona para o dashboard administrativo
 * 5. Exibe mensagens de erro apropriadas em caso de falha
 *
 * @async
 * @function
 * @returns {Promise<void>}
 *
 * @throws {Error} Pode lançar erro durante a navegação para o dashboard
 *
 * @example
 * ```typescript
 * // Chamado automaticamente no submit do formulário
 * await handleLogin();
 * ```
 */
const handleLogin = async (): Promise<void> => {
    console.log('handleLogin: Iniciando processo de login');

    // Previne múltiplas tentativas simultâneas
    if (isLoading.value) return;

    // Limpa erros anteriores para nova tentativa
    error.value = null;

    // Validação de campos obrigatórios
    if (!email.value || !password.value) {
        console.log('handleLogin: Falha na validação - campos vazios');
        error.value = "INVALID_CREDENTIALS";
        return;
    }

    console.log('handleLogin: Tentativa de login para:', {
        email: email.value,
        passwordLength: password.value.length
    });

    // Verificação de credenciais (configuração hardcoded para demonstração)
    const isValidCredentials =
        email.value.toLowerCase() === 'admin@mediari.com.br' &&
        password.value === 'mediari2025';

    if (isValidCredentials) {
        console.log('handleLogin: Credenciais válidas, iniciando redirecionamento');
        isLoading.value = true;

        try {
            // Criação e persistência da sessão do administrador
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

            // Simula delay para melhor experiência do usuário
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Redirecionamento para o dashboard administrativo
            console.log('handleLogin: Redirecionando para dashboard');
            await navigateTo('/admin/candidaturas');

        } catch (err) {
            // Tratamento de erro durante navegação
            console.error('handleLogin: Erro na navegação:', err);
            error.value = "SERVER_ERROR";
            isLoading.value = false;
        }
    } else {
        // Credenciais inválidas
        console.log('handleLogin: Credenciais inválidas fornecidas');
        error.value = "INVALID_CREDENTIALS";
    }
};
</script>

<template>
    <!-- Container principal do cartão de login -->
    <div class="login-card w-full max-w-5xl bg-white rounded overflow-hidden max-lg:max-w-none max-lg:w-full">
        <div class="login-container flex min-h-[600px]">

            <!-- Seção Esquerda - Painel de Boas-vindas -->
            <div class="login-left flex-1 relative overflow-hidden bg-gradient-to-br from-accent-color via-accent-dark-color to-accent-color flex flex-col justify-center items-start p-4 text-white max-lg:hidden">
                <!-- Conteúdo de boas-vindas -->
                <div class="relative z-10 max-w-md">
                    <h1 class="text-3xl font-bold mb-1 leading-tight">
                        {{ t("admin.login.welcome_back") }}
                    </h1>
                    <p class="text-base opacity-90 leading-relaxed">
                        {{ t("admin.login.welcome_message") }}
                    </p>
                </div>
            </div>

            <!-- Seção Direita - Formulário de Login -->
            <div class="login-right flex-1 flex flex-col justify-center items-center p-4 bg-white max-lg:p-2">
                <div class="w-full max-w-md">

                    <!-- Cabeçalho do formulário -->
                    <div class="text-center mb-2">
                        <h2 class="text-2xl font-bold text-primary-text">
                            {{ t("admin.login.title") }}
                        </h2>
                    </div>

                    <!-- Painel de mensagem de erro -->
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

                    <!-- Formulário de autenticação -->
                    <form
                        @submit.prevent="handleLogin"
                        class="space-y-1.5"
                        novalidate
                    >
                        <!-- Campo de E-mail -->
                        <div>
                            <label
                                for="email"
                                class="block text-sm font-medium text-primary-text mb-0.5"
                            >
                                {{ t("admin.login.email") }}
                            </label>
                            <div class="relative">
                                <!-- Ícone de e-mail -->
                                <div class="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                                    <Icon
                                        name="mdi:email"
                                        class="h-1.25 w-1.25 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </div>
                                <!-- Input de e-mail -->
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

                        <!-- Campo de Senha -->
                        <div>
                            <label
                                for="password"
                                class="block text-sm font-medium text-primary-text mb-0.5"
                            >
                                {{ t("admin.login.password") }}
                            </label>
                            <div class="relative">
                                <!-- Ícone de cadeado -->
                                <div class="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                                    <Icon
                                        name="mdi:lock"
                                        class="h-1.25 w-1.25 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </div>
                                <!-- Input de senha -->
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
                                <!-- Botão para mostrar/ocultar senha -->
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

                        <!-- Botão de Submissão -->
                        <div>
                            <button
                                type="submit"
                                :disabled="isLoading || !email || !password"
                                class="w-full bg-accent-color text-white border-2 border-accent-color hover:bg-accent-dark-color hover:border-accent-dark-color disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] rounded transition-all duration-200 flex items-center justify-center gap-0.5 font-semibold cursor-pointer text-sm"
                                :aria-label="isLoading ? t('admin.login.logging_in') : t('admin.login.sign_in')"
                            >
                                <!-- Ícone de carregamento ou login -->
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
                                <!-- Texto do botão -->
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
/**
 * Estilos específicos do componente de login
 * Define a aparência visual do painel de boas-vindas
 */

/**
 * Estilização da seção esquerda com gradient
 * Aplica background com cobertura completa e posicionamento centralizado
 */
.login-left {
    background-size: cover;
    background-position: center;
}

/**
 * Responsividade para dispositivos móveis
 * Em telas pequenas, o painel de boas-vindas é ocultado
 * e o formulário ocupa toda a largura disponível
 */
@media (max-width: 1024px) {
    .login-left {
        display: none;
    }

    .login-right {
        flex: 1;
        width: 100%;
    }
}

/**
 * Estados de hover e focus para melhor acessibilidade
 * Garante que elementos interativos tenham feedback visual adequado
 */
.login-right input:focus {
    box-shadow: 0 0 0 3px rgba(var(--accent-color-rgb), 0.1);
}

.login-right button:focus-visible {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
}
</style>
