<script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useSessionStorage } from '~/composables/useSessionStorage'
  import {
    CareersHero,
    JobApplicationForm,
    ProfileTest,
    CompletionScreen,
  } from '~/components/page-trabalhe-conosco'

  const { t } = useI18n()

  useSeoMeta({
    title: `${t('careers.page_title')} - Mediari Consultoria`,
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
  onMounted(() => {
    isClient.value = true
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
