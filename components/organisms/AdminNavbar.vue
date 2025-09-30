<template>
  <nav
    class="bg-body-bg/90 backdrop-blur-sm shadow-md border-b border-body-bg-dark fixed top-0 left-0 right-0 z-50"
  >
    <div class="max-w-7xl mx-auto px-1 870:px-1.5">
      <div class="flex items-center justify-between h-4">
        <!-- Logo/Brand -->
        <div class="flex items-center">
          <div class="flex-shrink-0 flex items-center">
            <Icon
              class="text-[2.9em] transition-[font-size] duration-200 text-accent-color"
              name="my-icon:mediari-logo"
            />
          </div>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden 870:flex items-center space-x-2">
          <div class="flex items-center space-x-1">
            <NuxtLink
              :to="localePath('/admin/candidaturas')"
              class="py-0.5 px-1 text-sm font-medium text-accent-color border-2 border-accent-color transition-colors duration-200 no-underline rounded hover:bg-accent-color/20"
              active-class="!bg-accent-color !text-accent-text-color !font-semibold"
            >
              {{ t('admin.nav.candidates') }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('/admin/administradores')"
              class="py-0.5 px-1 text-sm font-medium text-accent-color border-2 border-accent-color transition-colors duration-200 no-underline rounded hover:bg-accent-color/20"
              active-class="!bg-accent-color !text-accent-text-color !font-semibold"
            >
              {{ t('admin.nav.users') }}
            </NuxtLink>
          </div>

          <!-- User Menu Desktop -->
          <div
            class="flex items-center ml-2 pl-2 border-l-2 border-accent-color"
          >
            <div class="flex items-center space-x-1">
              <div class="text-secondary-text text-sm">
                <span class="font-medium text-primary-text">{{
                  currentUser?.name ||
                  currentUser?.email ||
                  t('admin.nav.admin_default')
                }}</span>
              </div>
              <button
                @click="handleLogout"
                :disabled="isLoggingOut"
                class="flex items-center py-0.5 px-1 text-sm cursor-pointer font-medium text-accent-color border-2 border-accent-color transition-colors duration-200 no-underline rounded hover:bg-accent-color/20"
              >
                <Icon
                  name="heroicons-outline:logout"
                  class="inline-block mr-0.5"
                />
                {{ logoutLabel }}
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="870:hidden">
          <button
            @click="toggleHamburguerMenu"
            :aria-label="hamburgerAriaLabel"
            class="text-accent-color hover:bg-accent-color-2 p-0.5 rounded border-2 border-accent-color transition-colors duration-200"
          >
            <Transition name="icon-morph" mode="out-in">
              <svg
                v-if="!hamburguerMenuOpen"
                class="h-1.5 w-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                v-else
                class="h-1.5 w-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Transition>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Menu -->
    <Transition name="slide-fade-nav">
      <div
        v-if="hamburguerMenuOpen"
        class="870:hidden bg-body-bg border-t border-body-bg-dark"
      >
        <div class="px-1 300:px-1.5 500:px-2 pt-1 pb-1.5 space-y-0.5">
          <!-- User Info Mobile -->
          <div class="border-b border-body-bg-dark pb-1 mb-1">
            <div class="flex items-center justify-between">
              <div class="text-primary-text">
                <div class="font-medium text-sm">
                  {{ currentUser?.name || t('admin.nav.admin_default') }}
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation Links Mobile -->
          <div class="space-y-0.25">
            <NuxtLink
              :to="localePath('/admin/candidaturas')"
              @click="hamburguerMenuOpen = false"
              class="block py-0.75 px-1 text-sm font-medium text-accent-color border-2 border-accent-color rounded transition-colors duration-200 no-underline"
              active-class="!bg-accent-color !text-body-bg !font-semibold"
            >
              {{ t('admin.nav.candidates') }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('/admin/administradores')"
              @click="hamburguerMenuOpen = false"
              class="block py-0.75 px-1 text-sm font-medium text-accent-color border-2 border-accent-color rounded transition-colors duration-200 no-underline"
              active-class="!bg-accent-color !text-body-bg !font-semibold"
            >
              {{ t('admin.nav.users') }}
            </NuxtLink>
          </div>

          <!-- Logout Mobile -->
          <div class="pt-1 border-t border-body-bg-dark">
            <button
              @click="handleLogoutAndClose"
              :disabled="isLoggingOut"
              class="w-full block py-0.75 px-1 text-sm font-medium text-accent-color border-2 border-accent-color rounded transition-colors duration-200 no-underline"
            >
              <Icon
                name="heroicons-outline:logout"
                class="inline-block h-4 w-4 mr-0.5"
              />
              {{ logoutLabelShort }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'

  /**
   * @file AdminNavbar.vue
   * @description Componente de barra de navegação para a área administrativa.
   * Inclui links de navegação, informações do usuário e funcionalidade de logout.
   * É responsivo, adaptando-se a layouts de desktop e mobile.
   */

  const { t } = useI18n()

  // Usa composable centralizado para obter path preservando locale (tenta useLocalePath, depois fallback)
  import { useLocalePathSafe } from '~/composables/useLocalePathSafe'
  const localePath = useLocalePathSafe()

  /**
   * @description Controla o estado de carregamento durante o processo de logout.
   * @type {ref<boolean>}
   */
  const isLoggingOut = ref(false)

  /**
   * @description Controla a visibilidade do menu de navegação mobile (hambúrguer).
   * @type {ref<boolean>}
   */
  const hamburguerMenuOpen = ref(false)

  /**
   * @description Define o tipo para os dados do usuário atual.
   */
  type CurrentUser = {
    id: string
    email: string | null
    name: string | null
  } | null

  /**
   * @description Armazena os dados do usuário logado.
   * @type {ref<CurrentUser>}
   */
  const currentUser = ref<CurrentUser>(null)

  /**
   * @description Hook executado após a montagem do componente.
   * Busca os dados da sessão do usuário no servidor para exibir informações
   * como nome e email na barra de navegação.
   */
  onMounted(async () => {
    try {
      const res = await $fetch(`/api/session?ts=${Date.now()}`)
      if (res && (res as Record<string, unknown>).authenticated) {
        const s = res as Record<string, unknown>
        currentUser.value = {
          id: String(s.uid ?? ''),
          email: (s.email as string) || null,
          name: (s.name as string) || null,
        }
      }
    } catch (e: unknown) {
      console.warn('[components/AdminNavbar] falha ao buscar sessão', e)
    }
  })

  /**
   * @description Alterna a visibilidade do menu de navegação mobile.
   */
  const toggleHamburguerMenu = () => {
    hamburguerMenuOpen.value = !hamburguerMenuOpen.value
  }

  /**
   * @description Propriedade computada para o texto do botão de logout.
   * Retorna 'Saindo...' durante o processo de logout ou 'Sair' em estado normal.
   * @returns {string}
   */
  const logoutLabel = computed(() =>
    isLoggingOut.value ? t('admin.nav.logging_out') : t('admin.nav.logout')
  )

  /**
   * @description Propriedade computada para a versão curta do texto do botão de logout (mobile).
   * Retorna 'Saindo...' ou 'Sair'.
   * @returns {string}
   */
  const logoutLabelShort = computed(() =>
    isLoggingOut.value
      ? t('admin.nav.logging_out_short')
      : t('admin.nav.logout_short')
  )

  /**
   * @description Propriedade computada para o `aria-label` do botão do menu hambúrguer.
   * Melhora a acessibilidade ao indicar a ação do botão (abrir ou fechar o menu).
   * @returns {string}
   */
  const hamburgerAriaLabel = computed(() =>
    hamburguerMenuOpen.value
      ? t('admin.nav.close_menu')
      : t('admin.nav.open_menu')
  )

  /**
   * @description Manipula o logout e fecha o menu mobile.
   * Garante que o menu seja fechado antes de iniciar o processo de logout.
   */
  const handleLogoutAndClose = async () => {
    hamburguerMenuOpen.value = false
    await handleLogout()
  }

  /**
   * @description Executa o processo de logout do usuário.
   * Define o estado de `isLoggingOut`, limpa a sessão no servidor e localmente,
   * e redireciona o usuário para a página de login.
   */
  const handleLogout = async () => {
    isLoggingOut.value = true
    hamburguerMenuOpen.value = false
    try {
      // Solicita ao servidor para limpar o cookie de sessão
      try {
        await $fetch('/api/session', { method: 'DELETE' })
      } catch {
        // ignorar
      }

      // Limpa qualquer sessão local de fallback, se presente
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.removeItem('mediari-admin-session')
        } catch {
          // Ignora erros durante a limpeza da sessão
        }
      }

      // Simula um atraso
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Redireciona para o login preservando locale (localePath é seguro)
      await navigateTo(localePath('/admin'))
    } finally {
      isLoggingOut.value = false
    }
  }
</script>

<style scoped>
  .slide-fade-nav-enter-active,
  .slide-fade-nav-leave-active {
    transition:
      opacity 0.3s,
      max-height 0.3s,
      transform 0.3s;
    will-change: opacity, max-height, transform;
  }

  .slide-fade-nav-enter-from,
  .slide-fade-nav-leave-to {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
  }

  .slide-fade-nav-enter-to,
  .slide-fade-nav-leave-from {
    opacity: 1;
    max-height: 500px;
    transform: translateY(0);
  }

  .icon-morph-enter-active,
  .icon-morph-leave-active {
    transition:
      opacity 0.2s,
      filter 0.2s,
      border-radius 0.2s,
      transform 0.2s;
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
