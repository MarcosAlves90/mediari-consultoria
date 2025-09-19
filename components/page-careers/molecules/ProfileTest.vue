<script setup lang="ts">
  // TODO: Deixar responsivo no mobile

  import { useProfileTest } from '~/composables/page-careers'
  import { useI18n } from 'vue-i18n'
  import { ref, onMounted, watch } from 'vue'
  import ButtonLoader from '~/components/atoms/ButtonLoader.vue'
  import createShuffle from '~/composables/page-careers/useShuffle'

  interface Emits {
    (e: 'completed'): void
  }

  const emit = defineEmits<Emits>()
  const { t } = useI18n()

  const {
    profileTestAnswers,
    isSubmittingTest,
    hasError,
    progress,
    isTestComplete,
    submitProfileTest,
    GROUPS,
  } = useProfileTest()

  const handleSubmit = async () => {
    const success = await submitProfileTest()
    if (success) emit('completed')
  }

  // usar composable para shuffle
  const shuffle = createShuffle()

  // matriz com as opções de cada grupo já embaralhadas
  const shuffledOptions = ref<Array<Array<{ key: string; label: string }>>>([])

  const buildShuffledOptions = () => {
    if (typeof window === 'undefined') return
    const groups = (GROUPS || []) as Array<Record<string, string>>
    shuffledOptions.value = shuffle.getShuffled(groups, 'profile-test')
  }

  onMounted(buildShuffledOptions)
  // evitar execução no servidor: o onMounted já chama a versão client-side
  watch(
    () => GROUPS,
    () => {
      if (typeof window !== 'undefined') buildShuffledOptions()
    }
  )

  const progress_bar = 'w-full bg-accent-color-2 rounded h-1 mb-2'
  const progress_fill =
    'bg-accent-color h-1 rounded transition-all duration-300'
  const question_container =
    'mb-1.5 p-1.25 bg-body-bg-light rounded-sm border-2 border-gray-600 max-md:mb-1 max-md:p-1'
  const scale_container = 'grid grid-cols-4 gap-0.5 items-stretch'
  const scale_option =
    'flex flex-col items-center cursor-pointer transition-all duration-200 p-0.5 rounded text-center'
  const scale_radio = 'sr-only'
  const scale_label = 'text-xs font-semibold text-primary-text'
  const submit_button =
    'common-button w-full text-base font-medium !min-h-[48px] mt-1.5 disabled:opacity-50 disabled:cursor-not-allowed max-md:!min-h-[42px] max-md:mt-1'
</script>

<template>
  <div class="profile-test">
    <div :class="progress_bar">
      <div :class="progress_fill" :style="{ width: `${progress}%` }"></div>
    </div>

    <div class="text-center mb-2">
      <span class="text-sm text-secondary-text">
        {{
          t('careers.profile_test.progress_text', {
            answered: Object.keys(profileTestAnswers).length,
            total: (GROUPS || []).length,
          })
        }}
      </span>
    </div>

    <div
      v-if="hasError"
      class="mb-2 p-1 bg-red-100 border-2 border-accent-color text-accent-color rounded-sm text-center"
    >
      {{ t('careers.profile_test.incomplete') }}
    </div>

    <div class="space-y-1.5 mb-2">
      <div
        v-for="(_, index) in GROUPS"
        :key="index"
        :class="question_container"
      >
        <div :class="scale_container">
          <label
            v-for="option in shuffledOptions[index] || []"
            :key="option.key"
            :class="[
              'scale-option',
              scale_option,
              profileTestAnswers[index] === option.key ? 'selected' : '',
            ]"
          >
            <input
              :name="`group-${index}`"
              :value="option.key"
              type="radio"
              v-model="profileTestAnswers[index]"
              :class="scale_radio"
            />
            <div class="radio-indicator"></div>
            <span :class="scale_label">{{ option.label }}</span>
          </label>
        </div>
      </div>
    </div>

    <button
      @click="handleSubmit"
      :class="submit_button"
      :disabled="isSubmittingTest || !isTestComplete"
    >
      <span
        v-if="isSubmittingTest"
        class="flex items-center justify-center gap-2"
      >
        <ButtonLoader /> {{ t('careers.profile_test.submitting') }}
      </span>
      <span v-else>{{ t('careers.profile_test.submit') }}</span>
    </button>
  </div>
</template>

<style scoped>
  .scale-option {
    transition: all 0.15s ease;
    position: relative;
    border: 2px solid transparent;
  }
  .scale-option:hover {
    transform: translateY(-2px);
  }
  .scale-option.selected {
    background-color: rgba(var(--color-accent-color-rgb), 0.1);
    border-color: var(--color-accent-color);
    border-radius: 4px;
  }
  .radio-indicator {
    width: 16px;
    height: 16px;
    border: 2px solid var(--color-secondary-text);
    border-radius: 50%;
    margin-bottom: 4px;
    transition: all 0.2s ease;
    position: relative;
  }
  .scale-option.selected .radio-indicator {
    border-color: var(--color-accent-color);
    background-color: var(--color-accent-color);
  }
  .scale-option.selected .radio-indicator::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 6px;
    background-color: var(--color-accent-text-color);
    border-radius: 50%;
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
