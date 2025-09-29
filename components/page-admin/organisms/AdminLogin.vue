<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useFirebaseAuth } from '~/composables/page-admin/useFirebaseAuth'
  import { mapFirebaseAuthError } from '~/utils/mapFirebaseAuthError'

  const { t } = useI18n()

  // caminho da home preservando locale quando possível (composable reutilizável)
  import { useLocalePathSafe } from '~/composables/useLocalePathSafe'
  const localePathSafe = useLocalePathSafe()
  const homePath = localePathSafe('/')

  type LoginErrorType =
    | 'INVALID_CREDENTIALS'
    | 'USER_DISABLED'
    | 'TOO_MANY_REQUESTS'
    | 'SESSION_ERROR'
    | 'NETWORK_ERROR'
    | 'SERVER_ERROR'
    | null

  const email = ref('')
  const password = ref('')
  const isLoading = ref(false)
  const error = ref<LoginErrorType>(null)
  const showPassword = ref(false)

  const { signIn } = useFirebaseAuth()

  const hasError = computed(() => !!error.value)

  const errorMessage = computed(() => {
    if (!error.value) return ''
    const keys: Record<NonNullable<LoginErrorType>, string> = {
      INVALID_CREDENTIALS: 'admin.login.invalid_credentials',
      USER_DISABLED: 'admin.login.user_disabled',
      TOO_MANY_REQUESTS: 'admin.login.too_many_requests',
      SESSION_ERROR: 'admin.login.session_error',
      NETWORK_ERROR: 'admin.login.network_error',
      SERVER_ERROR: 'admin.login.server_error',
    }
    return t(keys[error.value as NonNullable<LoginErrorType>])
  })

  const mapSessionError = (err: unknown): LoginErrorType => {
    const e = err as Record<string, unknown> | null
    const status =
      e &&
      (e.status ??
        (e.response && (e.response as Record<string, unknown>).status))
    if (status === 401 || status === 403) return 'SESSION_ERROR'
    const raw = String(err ?? '')
    if (
      raw.toLowerCase().includes('network') ||
      raw.toLowerCase().includes('failed')
    )
      return 'NETWORK_ERROR'
    return 'SERVER_ERROR'
  }

  const handleLogin = async (): Promise<void> => {
    if (isLoading.value) return
    error.value = null
    if (!email.value || !password.value) {
      error.value = 'INVALID_CREDENTIALS'
      return
    }

    isLoading.value = true
    try {
      const user = await signIn(email.value, password.value).catch(
        (e: unknown) => {
          const mapped = mapFirebaseAuthError(e as unknown) as LoginErrorType
          error.value = mapped ?? 'SERVER_ERROR'

          console.error('[AdminLogin] auth error', e)
          return null
        }
      )

      if (!user) return

      try {
        const idToken = await user.getIdToken()
        await $fetch('/api/session', { method: 'POST', body: { idToken } })

        // Preserva locale ao redirecionar usando o composable seguro
        await navigateTo(localePathSafe('/admin/candidaturas'))
      } catch (sessErr: unknown) {
        error.value = mapSessionError(sessErr)

        console.error('[AdminLogin] session error', sessErr)
      }
    } finally {
      isLoading.value = false
    }
  }
</script>

<template>
  <div
    class="login-card w-full max-w-5xl bg-white rounded overflow-hidden max-lg:max-w-none max-lg:w-full lg:p-0.5"
  >
    <div class="login-container flex min-h-[600px]">
      <div
        class="login-left rounded flex-1 relative overflow-hidden flex flex-col justify-center items-end p-4 text-white max-lg:hidden"
      >
        <!-- imagem de fundo otimizada + overlay de gradiente (reaproveita variáveis do hero) -->
        <NuxtImg
          class="login-left-image absolute inset-0 w-full h-full object-cover object-center"
          src="/banner-background_acqeef_rgmwey.webp"
          provider="cloudinary"
          width="1200"
          height="800"
          sizes="lg:50vw md:100vw"
          preload
          fit="cover"
          :alt="t('banner.aria.background_alt')"
          loading="eager"
          decoding="async"
          fetchpriority="high"
        />

        <div
          class="login-left-gradient absolute inset-0"
          aria-hidden="true"
        ></div>

        <div class="relative z-10 w-full mt-auto text-center">
          <Icon
            class="text-[15em] transition-[font-size] duration-200"
            name="my-icon:mediari-logo"
          />
        </div>

        <div class="relative z-10 w-full mt-auto text-center">
          <h1 class="text-3xl font-bold mb-1 leading-tight">
            {{ t('admin.login.welcome_back') }}
          </h1>
          <p class="text-base opacity-90 leading-relaxed">
            {{ t('admin.login.welcome_message') }}
          </p>
        </div>
      </div>

      <div
        class="login-right flex-1 flex flex-col justify-center items-center p-4 bg-white max-lg:p-2 relative"
      >
        <NuxtLink
          :to="homePath"
          class="absolute top-1 right-1 lg:top-0.5 lg:right-0.5 gap-1 flex items-center justify-center p-0.5 text-accent-color transition duration-200 rounded border-2 border-accent-color hover:bg-accent-color/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-color"
          :aria-label="t('error.back_home_aria')"
          role="button"
          tabindex="0"
        >
          <Icon
            name="mdi:arrow-left"
            class="text-[1.2em]"
            aria-hidden="true"
            focusable="false"
          />
          <span class="font-bold text-sm pr-0.5">{{ t('navbar.home') }}</span>
        </NuxtLink>

        <div class="w-full max-w-md">
          <div class="text-center mb-2">
            <h2 class="text-2xl font-bold text-primary-text">
              {{ t('admin.login.title') }}
            </h2>
          </div>

          <div
            v-if="hasError"
            class="mb-2 p-1.25 bg-accent-color-2 border-2 border-accent-color rounded"
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
                  {{ t('admin.login.error_title') }}
                </h3>
                <p class="mt-0.25 text-sm text-accent-color">
                  {{ errorMessage }}
                </p>
              </div>
            </div>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-1.5" novalidate>
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-primary-text mb-0.5"
              >
                {{ t('admin.login.email') }}
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none"
                >
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
                {{ t('admin.login.password') }}
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none"
                >
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
                  :aria-label="
                    showPassword
                      ? t('admin.login.hide_password')
                      : t('admin.login.show_password')
                  "
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
                :aria-label="
                  isLoading
                    ? t('admin.login.logging_in')
                    : t('admin.login.sign_in')
                "
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
                  {{
                    isLoading
                      ? t('admin.login.logging_in')
                      : t('admin.login.sign_in')
                  }}
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
  .login-left-image {
    opacity: 0.65; /* alinhado com o hero original */
    transform-origin: center;
    z-index: 1;
  }

  .login-left-gradient {
    /* gradiente invertido: secundária no topo, accent em direção ao rodapé */
    background: var(--color-accent-color);
    opacity: 0.6; /* garante contraste com conteúdo branco */
    z-index: 2;
  }

  .login-left > .relative.z-10 {
    z-index: 3; /* conteúdo acima da imagem e do overlay */
  }
</style>
