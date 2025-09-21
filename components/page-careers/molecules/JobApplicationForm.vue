<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useJobApplicationForm } from '~/composables/page-careers'
  import FileUpload from '~/components/molecules/FileUpload.vue'
  import ButtonLoader from '~/components/atoms/ButtonLoader.vue'

  interface Props {
    showSuccess?: boolean
  }

  withDefaults(defineProps<Props>(), { showSuccess: false })

  const emit = defineEmits<{ (e: 'submitted'): void }>()

  const { t } = useI18n()

  const AREA_KEYS = [
    'careers.areas.0',
    'careers.areas.1',
    'careers.areas.2',
    'careers.areas.3',
    'careers.areas.4',
    'careers.areas.5',
    'careers.areas.6',
    'careers.areas.7',
  ] as const

  const areasOfInterest = computed<string[]>(() => AREA_KEYS.map((k) => t(k)))

  const {
    formData,
    errors,
    isSubmitting,
    hasError,
    isFormComplete,
    submitForm,
    formatPhone,
    uploadProgress,
  } = useJobApplicationForm()

  function handlePhoneInput(event: Event): void {
    const target = event.target as HTMLInputElement
    const formatted = formatPhone(target.value)
    formData.phone = formatted
    target.value = formatted
  }

  async function handleSubmit(): Promise<void> {
    const success = await submitForm()
    if (success) emit('submitted')
  }

  const CSS_CLASSES = {
    formGroup: 'mb-2 flex flex-col max-md:mb-1.5',
    formLabel: 'mb-0.75 text-sm font-medium text-primary-text max-md:mb-0.5',
    formInput:
      'w-full px-1.25 py-0.5 border-2 border-secondary-text rounded-sm focus:border-accent-color focus:outline-none transition-colors duration-200 text-sm max-md:px-1 max-md:py-0.375',
    formTextarea:
      'w-full px-1.25 py-0.5 border-2 border-secondary-text rounded-sm focus:border-accent-color focus:outline-none transition-colors duration-200 text-sm resize-vertical min-h-[120px] max-md:min-h-[100px] max-md:px-1 max-md:py-0.375',
    formSelect:
      'w-full px-1.25 py-0.5 border-2 border-secondary-text rounded-sm focus:border-accent-color focus:outline-none transition-colors duration-200 text-sm bg-body-bg-dark max-md:px-1 max-md:py-0.375',
    errorText: 'text-xs text-accent-color mt-0.5',
    checkboxWrapper:
      'flex items-start gap-0.75 mb-2 max-md:gap-0.5 max-md:mb-1.5',
    checkboxInput:
      "appearance-none w-4 h-4 min-w-[16px] min-h-[16px] border-2 border-gray-400 rounded-sm bg-white cursor-pointer flex-shrink-0 mt-0.5 max-md:mt-0.25 max-md:w-[14px] max-md:h-[14px] max-md:mt-[1px] relative transition-colors duration-200 hover:border-accent-color focus:outline-none focus:ring-3 focus:ring-accent-color/10 checked:bg-accent-color checked:border-accent-color checked:after:content-['✓'] checked:after:absolute checked:after:top-[-2px] checked:after:left-[1px] checked:after:text-white checked:after:text-xs checked:after:font-bold max-md:checked:after:text-[10px] max-md:checked:after:top-[-1px] max-md:checked:after:left-[1px]",
    checkboxLabel:
      'text-xs text-primary-text leading-relaxed cursor-pointer select-none',
    submitButton:
      'common-button w-full text-base font-medium !min-h-[48px] mt-1.5 disabled:opacity-50 disabled:cursor-not-allowed max-md:!min-h-[42px] max-md:mt-1',
  } as const
</script>

<template>
  <div class="job-application-form">
    <!-- Mensagem de sucesso -->
    <div
      v-if="showSuccess"
      class="mb-1 p-1 bg-green-100 border-2 border-green-500 text-green-700 rounded-sm text-center"
      role="status"
      aria-live="polite"
    >
      <strong class="sr-only">{{ t('careers.form.success_title') }}</strong>
      {{ t('careers.form.success_message') }}
    </div>

    <!-- Mensagem de erro -->
    <div
      v-if="hasError"
      class="mb-1 p-1 bg-red-100 border-2 border-accent-color text-accent-color rounded-sm text-center"
      role="alert"
      aria-live="assertive"
    >
      <strong class="sr-only">{{ t('careers.error_message') }}</strong>
      {{ t('careers.error_message') }}
    </div>

    <form
      @submit.prevent="handleSubmit"
      class="careers__form-container grid gap-0 max-md:grid-cols-1"
      novalidate
      aria-labelledby="careers-form-title"
    >
      <h2 id="careers-form-title" class="sr-only">
        {{ t('careers.form.title') }}
      </h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 max-lg:gap-0">
        <!-- Nome completo -->
        <div :class="CSS_CLASSES.formGroup">
          <label for="fullName" :class="CSS_CLASSES.formLabel">
            {{ t('careers.form.full_name') }}
            <span class="text-accent-color">*</span>
          </label>
          <input
            id="fullName"
            autocomplete="name"
            v-model="formData.fullName"
            type="text"
            :class="[
              CSS_CLASSES.formInput,
              errors.fullName ? 'border-accent-color' : '',
            ]"
            :placeholder="t('careers.form.full_name_placeholder')"
            :aria-invalid="errors.fullName ? 'true' : 'false'"
            aria-required="true"
            :aria-describedby="errors.fullName ? 'fullName-error' : ''"
            required
          />
          <span
            v-if="errors.fullName"
            :id="'fullName-error'"
            :class="CSS_CLASSES.errorText"
            role="alert"
          >
            {{ errors.fullName }}
          </span>
        </div>

        <!-- Email -->
        <div :class="CSS_CLASSES.formGroup">
          <label for="email" :class="CSS_CLASSES.formLabel">
            {{ t('careers.form.email') }}
            <span class="text-accent-color">*</span>
          </label>
          <input
            id="email"
            autocomplete="email"
            v-model="formData.email"
            type="email"
            :class="[
              CSS_CLASSES.formInput,
              errors.email ? 'border-accent-color' : '',
            ]"
            :placeholder="t('careers.form.email_placeholder')"
            :aria-invalid="errors.email ? 'true' : 'false'"
            aria-required="true"
            :aria-describedby="errors.email ? 'email-error' : ''"
            required
          />
          <span
            v-if="errors.email"
            :id="'email-error'"
            :class="CSS_CLASSES.errorText"
            role="alert"
          >
            {{ errors.email }}
          </span>
        </div>
      </div>

      <!-- Linha 2: Telefone e Área de Interesse -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 max-lg:gap-0">
        <!-- Telefone -->
        <div :class="CSS_CLASSES.formGroup">
          <label for="phone" :class="CSS_CLASSES.formLabel">
            {{ t('careers.form.phone') }}
            <span class="text-accent-color">*</span>
          </label>
          <input
            id="phone"
            autocomplete="tel"
            v-model="formData.phone"
            type="tel"
            inputmode="tel"
            :class="[
              CSS_CLASSES.formInput,
              errors.phone ? 'border-accent-color' : '',
            ]"
            :placeholder="t('careers.form.phone_placeholder')"
            @input="handlePhoneInput"
            maxlength="15"
            :aria-invalid="errors.phone ? 'true' : 'false'"
            aria-required="true"
            :aria-describedby="errors.phone ? 'phone-error' : ''"
            required
          />
          <span
            v-if="errors.phone"
            :id="'phone-error'"
            :class="CSS_CLASSES.errorText"
            role="alert"
          >
            {{ errors.phone }}
          </span>
        </div>

        <!-- Área de Interesse -->
        <div :class="CSS_CLASSES.formGroup">
          <label for="areaOfInterest" :class="CSS_CLASSES.formLabel">
            {{ t('careers.form.area_of_interest') }}
            <span class="text-accent-color">*</span>
          </label>
          <select
            id="areaOfInterest"
            v-model="formData.areaOfInterest"
            :class="[
              CSS_CLASSES.formSelect,
              errors.areaOfInterest ? 'border-accent-color' : '',
            ]"
            aria-required="true"
            :aria-invalid="errors.areaOfInterest ? 'true' : 'false'"
            :aria-describedby="
              errors.areaOfInterest ? 'areaOfInterest-error' : ''
            "
            required
          >
            <option value="">
              {{ t('careers.form.area_of_interest_placeholder') }}
            </option>
            <option v-for="area in areasOfInterest" :key="area" :value="area">
              {{ area }}
            </option>
          </select>
          <span
            v-if="errors.areaOfInterest"
            :id="'areaOfInterest-error'"
            :class="CSS_CLASSES.errorText"
            role="alert"
          >
            {{ errors.areaOfInterest }}
          </span>
        </div>
      </div>

      <!-- Experiência -->
      <div :class="CSS_CLASSES.formGroup">
        <label for="experience" :class="CSS_CLASSES.formLabel">
          {{ t('careers.form.experience') }}
          <span class="text-accent-color">*</span>
        </label>
        <textarea
          id="experience"
          v-model="formData.experience"
          :class="[
            CSS_CLASSES.formTextarea,
            errors.experience ? 'border-accent-color' : '',
          ]"
          :placeholder="t('careers.form.experience_placeholder')"
          :aria-invalid="errors.experience ? 'true' : 'false'"
          aria-required="true"
          :aria-describedby="errors.experience ? 'experience-error' : ''"
          required
        ></textarea>
        <span
          v-if="errors.experience"
          :id="'experience-error'"
          :class="CSS_CLASSES.errorText"
          role="alert"
        >
          {{ errors.experience }}
        </span>
      </div>

      <!-- Envio de currículo -->
      <div :class="CSS_CLASSES.formGroup">
        <FileUpload
          id="resume"
          :label="t('careers.form.resume')"
          v-model="formData.resume"
          accept=".pdf,.doc,.docx"
          :error-message="errors.resume"
          required
          aria-required="true"
          :aria-describedby="errors.resume ? 'resume-error' : ''"
          @error="(message) => (errors.resume = message)"
        />
        <span
          v-if="errors.resume"
          id="resume-error"
          :class="CSS_CLASSES.errorText"
          role="alert"
        >
          {{ errors.resume }}
        </span>
      </div>

      <!-- Carta de apresentação -->
      <div :class="CSS_CLASSES.formGroup">
        <label for="coverLetter" :class="CSS_CLASSES.formLabel">
          {{ t('careers.form.cover_letter') }}
        </label>
        <textarea
          id="coverLetter"
          autocomplete="off"
          v-model="formData.coverLetter"
          :class="CSS_CLASSES.formTextarea"
          :placeholder="t('careers.form.cover_letter_placeholder')"
          :aria-describedby="'coverLetter-help'"
        ></textarea>
        <span id="coverLetter-help" class="sr-only">{{
          t('careers.form.cover_letter_help')
        }}</span>
      </div>

      <!-- Consentimento de privacidade -->
      <div :class="CSS_CLASSES.checkboxWrapper">
        <input
          id="privacyConsent"
          v-model="formData.privacyConsent"
          type="checkbox"
          :class="[
            CSS_CLASSES.checkboxInput,
            errors.privacyConsent ? 'border-accent-color' : '',
          ]"
          :aria-invalid="errors.privacyConsent ? 'true' : 'false'"
          aria-required="true"
          required
        />
        <label for="privacyConsent" :class="CSS_CLASSES.checkboxLabel">
          {{ t('careers.form.privacy_consent') }}
          <span class="text-accent-color">*</span>
        </label>
      </div>
      <span
        v-if="errors.privacyConsent"
        id="privacyConsent-error"
        :class="CSS_CLASSES.errorText"
        role="alert"
        >{{ errors.privacyConsent }}</span
      >

      <!-- Botão de envio -->
      <div
        v-if="uploadProgress > 0"
        class="mb-2"
        role="group"
        aria-labelledby="upload-progress-label"
      >
        <div id="upload-progress-label" class="sr-only">
          {{ t('careers.form.upload_progress') }}
        </div>
        <div
          class="w-full bg-gray-200 rounded h-2 overflow-hidden"
          role="progressbar"
          :aria-valuenow="uploadProgress"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuetext="`${uploadProgress}%`"
        >
          <div
            :style="{ width: `${uploadProgress}%` }"
            class="bg-accent-color h-2 transition-width"
          ></div>
        </div>
        <div class="text-xs text-secondary-text mt-1" aria-hidden="true">
          {{ uploadProgress }}%
        </div>
      </div>
      <button
        type="submit"
        :class="CSS_CLASSES.submitButton"
        :disabled="isSubmitting || !isFormComplete"
      >
        <span
          v-if="isSubmitting"
          class="flex items-center justify-center gap-2"
        >
          <ButtonLoader />
          {{ t('careers.form.submitting') }}
        </span>
        <span v-else>{{ t('careers.form.submit_button') }}</span>
      </button>
    </form>
  </div>
</template>

<style scoped>
  /**
 * Job Application Form Styles
 *
 * Professional styling with responsive design and accessibility features.
 */

  /* Form Container */
  .careers__form-container {
    padding: 2rem;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  /* Focus states for accessibility */
  .careers__form-container input:focus,
  .careers__form-container select:focus,
  .careers__form-container textarea:focus {
    box-shadow: 0 0 0 3px rgba(var(--color-accent-color-rgb), 0.1);
  }

  /* Checkbox specific styles */
  .careers__form-container input[type='checkbox'] {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 16px;
    height: 16px;
    border: 2px solid #888888;
    border-radius: 3px;
    background-color: white;
    cursor: pointer;
    position: relative;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .careers__form-container input[type='checkbox']:checked {
    background-color: var(--color-accent-color);
    border-color: var(--color-accent-color);
  }

  .careers__form-container input[type='checkbox']:checked::after {
    content: '✓';
    position: absolute;
    top: -2px;
    left: 1px;
    color: white;
    font-size: 12px;
    font-weight: bold;
  }

  .careers__form-container input[type='checkbox']:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(var(--color-accent-color-rgb), 0.1);
  }

  .careers__form-container input[type='checkbox']:hover {
    border-color: var(--color-accent-color);
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .careers__form-container {
      padding: 1.5rem;
    }
  }

  @media (max-width: 768px) {
    .careers__form-container {
      padding: 1rem;
      background: transparent;
      border: none;
    }

    .careers__form-container input[type='checkbox'] {
      width: 14px;
      height: 14px;
      margin-top: 1px;
    }

    .careers__form-container input[type='checkbox']:checked::after {
      font-size: 10px;
      top: -1px;
      left: 1px;
    }
  }
</style>
