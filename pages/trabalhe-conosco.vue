<script setup lang="ts">
  import { ref, computed, watch, onMounted, nextTick } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useSessionStorage } from '~/composables/page-careers/useSessionStorage'
  import {
    CareersHero,
    JobApplicationForm,
    ProfileTest,
    CompletionScreen,
  } from '~/components/page-careers'

  const { t } = useI18n()

  useSeoMeta({
    title: `${t('careers.page_title')}`,
    description: t('careers.section_description'),
    ogTitle: `${t('careers.section_title')} - Mediari Consultoria`,
    ogDescription: t('careers.section_description'),
    ogImage: '/mediari-logo.svg',
  })

  interface PersistedState {
    currentStep: 'form' | 'test' | 'completed'
    showSuccess: boolean
  }

  const [persistedState, setPersistedState, clearPersistedState] =
    useSessionStorage<PersistedState>('mediari-careers-state', {
      currentStep: 'form',
      showSuccess: false,
    })

  const currentStep = ref<'form' | 'test' | 'completed'>(
    persistedState.value.currentStep
  )
  const showSuccess = ref(persistedState.value.showSuccess)

  // Evita mismatch entre SSR e CSR: renderizar a área do formulário apenas no cliente
  const isClient = ref(false)
  // detecta se o usuário prefere reduzir animações
  const prefersReducedMotion = ref(false)

  onMounted(() => {
    isClient.value = true
    if (typeof window !== 'undefined' && 'matchMedia' in window) {
      prefersReducedMotion.value = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches
    }
  })

  watch(
    () => ({
      currentStep: currentStep.value,
      showSuccess: showSuccess.value,
    }),
    (newState) => {
      setPersistedState(newState)
    },
    { deep: true }
  )

  // Rola a página para o topo quando o conteúdo principal mudar (ex.: mudança de etapa)
  // Espera o próximo tick para garantir que o DOM foi atualizado antes de rolar.
  const scrollToTop = async (): Promise<void> => {
    if (!isClient.value) return

    // Aguarda o próximo tick e um frame de pintura para garantir que
    // qualquer alteração de layout foi aplicada antes de rolar.
    try {
      await nextTick()
      await new Promise((resolve) =>
        requestAnimationFrame(() => resolve(undefined))
      )

      const behavior = prefersReducedMotion.value ? 'auto' : 'smooth'
      // Tenta rolagem moderna
      window.scrollTo({ top: 0, behavior })
      // Garantia adicional para navegadores/ambientes que não aplicarem o comportamento acima
      if (document.documentElement) {
        document.documentElement.scrollTop = 0
      }
      if (document.body) {
        document.body.scrollTop = 0
      }
    } catch (_e) {
      // fallback simples
      try {
        window.scrollTo(0, 0)
      } catch (_err) {
        /* noop */
      }
    }
  }

  // Observa mudanças que causam alteração do conteúdo exibido
  // Usamos flush: 'post' para garantir que o watch execute *após* as atualizações do DOM
  // (mais confiável que nextTick em alguns cenários com componentes filhos).
  watch([currentStep, showSuccess], scrollToTop, { flush: 'post' })

  const heroTitle = computed(() => {
    switch (currentStep.value) {
      case 'test':
        return t('careers.profile_test.title')
      case 'completed':
        return t('careers.profile_test.completion_title')
      default:
        return t('careers.section_title')
    }
  })

  const heroSubtitle = computed(() => {
    switch (currentStep.value) {
      case 'test':
        return t('careers.profile_test.subtitle')
      default:
        return t('careers.section_subtitle')
    }
  })

  const heroDescription = computed(() => {
    switch (currentStep.value) {
      case 'test':
        return t('careers.profile_test.description')
      default:
        return t('careers.section_description')
    }
  })

  const onFormSubmitted = (): void => {
    showSuccess.value = true
    currentStep.value = 'test'
  }

  const onTestCompleted = (): void => {
    currentStep.value = 'completed'
    clearAllPersistedData()
  }

  const clearAllPersistedData = (): void => {
    clearPersistedState()
  }

  const container_classes =
    'py-4.5 px-4 max-lg:py-3.5 max-xl:px-2 max-md:py-2 max-md:px-1'
  const profile_container = 'max-w-70 w-full'
</script>

<template>
  <main class="careers-page">
    <CareersHero
      :title="heroTitle"
      :subtitle="heroSubtitle"
      :description="heroDescription"
    />

    <section
      v-if="isClient"
      class="careers__form w-full flex justify-center items-center bg-body-bg-dark"
      role="region"
      aria-labelledby="form-heading"
    >
      <div
        :class="[
          container_classes,
          currentStep === 'test'
            ? profile_container
            : 'careers__form-content max-w-70 w-full',
        ]"
      >
        <JobApplicationForm
          v-if="currentStep === 'form'"
          :show-success="showSuccess"
          @submitted="onFormSubmitted"
        />

        <ProfileTest
          v-else-if="currentStep === 'test'"
          @completed="onTestCompleted"
        />

        <CompletionScreen v-else-if="currentStep === 'completed'" />
      </div>
    </section>
  </main>
</template>

<style scoped>
  /**
 * Estilos específicos do componente
 * Garante que a página ocupe pelo menos a altura completa da viewport
 */
  .careers-page {
    min-height: 100vh;
  }
</style>
