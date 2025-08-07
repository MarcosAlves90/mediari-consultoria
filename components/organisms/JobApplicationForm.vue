<template>
    <div class="job-application-form">
        <!-- Success Message -->
        <div
            v-if="showSuccess"
            class="mb-1 p-1 bg-green-100 border-2 border-green-500 text-green-700 rounded-sm text-center"
        >
            {{ t("careers.form.success_title") }} {{ t("careers.form.success_message") }}
        </div>

        <!-- Error Message -->
        <div
            v-if="hasError"
            class="mb-1 p-1 bg-red-100 border-2 border-accent-color text-accent-color rounded-sm text-center"
        >
            {{ t("careers.error_message") }}
        </div>

        <form
            @submit.prevent="handleSubmit"
            class="careers__form-container grid gap-0 max-md:grid-cols-1"
        >
            <!-- Row 1: Full Name and Email -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 max-lg:gap-0">
                <!-- Full Name -->
                <div :class="form_group">
                    <label for="fullName" :class="form_label">
                        {{ t("careers.form.full_name") }}
                        <span class="text-accent-color">*</span>
                    </label>
                    <input
                        id="fullName"
                        v-model="formData.fullName"
                        type="text"
                        :class="[
                            form_input,
                            errors.fullName ? 'border-accent-color' : '',
                        ]"
                        :placeholder="t('careers.form.full_name_placeholder')"
                        required
                    />
                    <span v-if="errors.fullName" :class="error_text">{{
                        errors.fullName
                    }}</span>
                </div>

                <!-- Email -->
                <div :class="form_group">
                    <label for="email" :class="form_label">
                        {{ t("careers.form.email") }}
                        <span class="text-accent-color">*</span>
                    </label>
                    <input
                        id="email"
                        v-model="formData.email"
                        type="email"
                        :class="[
                            form_input,
                            errors.email ? 'border-accent-color' : '',
                        ]"
                        :placeholder="t('careers.form.email_placeholder')"
                        required
                    />
                    <span v-if="errors.email" :class="error_text">{{
                        errors.email
                    }}</span>
                </div>
            </div>

            <!-- Row 2: Phone and Area of Interest -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 max-lg:gap-0">
                <!-- Phone -->
                <div :class="form_group">
                    <label for="phone" :class="form_label">
                        {{ t("careers.form.phone") }}
                        <span class="text-accent-color">*</span>
                    </label>
                    <input
                        id="phone"
                        v-model="formData.phone"
                        type="tel"
                        :class="[
                            form_input,
                            errors.phone ? 'border-accent-color' : '',
                        ]"
                        :placeholder="t('careers.form.phone_placeholder')"
                        @input="onPhoneInput"
                        maxlength="15"
                        required
                    />
                    <span v-if="errors.phone" :class="error_text">{{
                        errors.phone
                    }}</span>
                </div>

                <!-- Area of Interest -->
                <div :class="form_group">
                    <label for="areaOfInterest" :class="form_label">
                        {{ t("careers.form.area_of_interest") }}
                        <span class="text-accent-color">*</span>
                    </label>
                    <select
                        id="areaOfInterest"
                        v-model="formData.areaOfInterest"
                        :class="[
                            form_select,
                            errors.areaOfInterest ? 'border-accent-color' : '',
                        ]"
                        required
                    >
                        <option value="">
                            {{ t("careers.form.area_of_interest_placeholder") }}
                        </option>
                        <option
                            v-for="area in areasOfInterest"
                            :key="area"
                            :value="area"
                        >
                            {{ area }}
                        </option>
                    </select>
                    <span v-if="errors.areaOfInterest" :class="error_text">{{
                        errors.areaOfInterest
                    }}</span>
                </div>
            </div>

            <!-- Experience -->
            <div :class="form_group">
                <label for="experience" :class="form_label">
                    {{ t("careers.form.experience") }}
                    <span class="text-accent-color">*</span>
                </label>
                <textarea
                    id="experience"
                    v-model="formData.experience"
                    :class="[
                        form_textarea,
                        errors.experience ? 'border-accent-color' : '',
                    ]"
                    :placeholder="t('careers.form.experience_placeholder')"
                    required
                ></textarea>
                <span v-if="errors.experience" :class="error_text">{{
                    errors.experience
                }}</span>
            </div>

            <!-- Resume Upload -->
            <div :class="form_group">
                <FileUpload
                    id="resume"
                    :label="t('careers.form.resume')"
                    v-model="formData.resume"
                    accept=".pdf,.doc,.docx"
                    :error-message="errors.resume"
                    required
                    @error="(message) => errors.resume = message"
                />
            </div>

            <!-- Cover Letter -->
            <div :class="form_group">
                <label for="coverLetter" :class="form_label">
                    {{ t("careers.form.cover_letter") }}
                </label>
                <textarea
                    id="coverLetter"
                    v-model="formData.coverLetter"
                    :class="form_textarea"
                    :placeholder="t('careers.form.cover_letter_placeholder')"
                ></textarea>
            </div>

            <!-- Privacy Consent -->
            <div :class="checkbox_wrapper">
                <input
                    id="privacyConsent"
                    v-model="formData.privacyConsent"
                    type="checkbox"
                    :class="[
                        checkbox_input,
                        errors.privacyConsent ? 'border-accent-color' : '',
                    ]"
                    required
                />
                <label for="privacyConsent" :class="checkbox_label">
                    {{ t("careers.form.privacy_consent") }}
                    <span class="text-accent-color">*</span>
                </label>
            </div>
            <span v-if="errors.privacyConsent" :class="error_text">{{
                errors.privacyConsent
            }}</span>

            <!-- Submit Button -->
            <button
                type="submit"
                :class="submit_button"
                :disabled="isSubmitting"
            >
                <span
                    v-if="isSubmitting"
                    class="flex items-center justify-center gap-0.75"
                >
                    <Loader />
                    {{ t("careers.form.submitting") }}
                </span>
                <span v-else>{{ t("careers.form.submit_button") }}</span>
            </button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useJobApplicationForm } from "~/composables/useJobApplicationForm";
import FileUpload from "~/components/molecules/FileUpload.vue";
import Loader from "~/components/atoms/Loader.vue";

interface Props {
    showSuccess?: boolean;
}

interface Emits {
    (e: 'submitted'): void;
}

withDefaults(defineProps<Props>(), {
    showSuccess: false,
});

const emit = defineEmits<Emits>();

const { t } = useI18n();

// Professional mirror array for areas of interest - Static keys for reliability
const AREAS_OF_INTEREST_KEYS = [
    'careers.areas.0', // Direito Civil
    'careers.areas.1', // Direito Penal
    'careers.areas.2', // Direito Trabalhista
    'careers.areas.3', // Direito do Consumidor
    'careers.areas.4', // Direito Bancário
    'careers.areas.5', // Contratos
    'careers.areas.6', // Consultivo
    'careers.areas.7'  // Administrativo
] as const;

// Computed property para carregar as áreas de interesse usando chaves individuais
const areasOfInterest = computed(() => {
    return AREAS_OF_INTEREST_KEYS.map(key => t(key));
});

const {
    formData,
    errors,
    isSubmitting,
    hasError,
    submitForm,
    formatPhone,
} = useJobApplicationForm();

const onPhoneInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const formatted = formatPhone(target.value);
    formData.phone = formatted;
    target.value = formatted;
};

const handleSubmit = async () => {
    const success = await submitForm();
    if (success) {
        emit('submitted');
    }
};

// CSS classes
const form_group = "mb-2 flex flex-col max-md:mb-1.5";
const form_label = "mb-0.75 text-sm font-medium text-primary-text max-md:mb-0.5";
const form_input = "w-full px-1.25 py-0.5 border-2 border-secondary-text rounded-sm focus:border-accent-color focus:outline-none transition-colors duration-200 text-sm max-md:px-1 max-md:py-0.375";
const form_textarea = "w-full px-1.25 py-0.5 border-2 border-secondary-text rounded-sm focus:border-accent-color focus:outline-none transition-colors duration-200 text-sm resize-vertical min-h-[120px] max-md:min-h-[100px] max-md:px-1 max-md:py-0.375";
const form_select = "w-full px-1.25 py-0.5 border-2 border-secondary-text rounded-sm focus:border-accent-color focus:outline-none transition-colors duration-200 text-sm bg-body-bg-dark max-md:px-1 max-md:py-0.375";
const error_text = "text-xs text-accent-color mt-0.5";
const checkbox_wrapper = "flex items-start gap-0.75 mb-2 max-md:gap-0.5 max-md:mb-1.5";
const checkbox_input = "appearance-none w-4 h-4 min-w-[16px] min-h-[16px] border-2 border-gray-400 rounded-sm bg-white cursor-pointer flex-shrink-0 mt-0.5 max-md:mt-0.25 max-md:w-[14px] max-md:h-[14px] max-md:mt-[1px] relative transition-colors duration-200 hover:border-accent-color focus:outline-none focus:ring-3 focus:ring-accent-color/10 checked:bg-accent-color checked:border-accent-color checked:after:content-['✓'] checked:after:absolute checked:after:top-[-2px] checked:after:left-[1px] checked:after:text-white checked:after:text-xs checked:after:font-bold max-md:checked:after:text-[10px] max-md:checked:after:top-[-1px] max-md:checked:after:left-[1px]";
const checkbox_label = "text-xs text-primary-text leading-relaxed cursor-pointer select-none";
const submit_button = "common-button w-full text-base font-medium !min-h-[48px] mt-1.5 disabled:opacity-50 disabled:cursor-not-allowed max-md:!min-h-[42px] max-md:mt-1";
</script>

<style scoped>
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
.careers__form-container input[type="checkbox"] {
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

.careers__form-container input[type="checkbox"]:checked {
    background-color: var(--color-accent-color);
    border-color: var(--color-accent-color);
}

.careers__form-container input[type="checkbox"]:checked::after {
    content: '✓';
    position: absolute;
    top: -2px;
    left: 1px;
    color: white;
    font-size: 12px;
    font-weight: bold;
}

.careers__form-container input[type="checkbox"]:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(var(--color-accent-color-rgb), 0.1);
}

.careers__form-container input[type="checkbox"]:hover {
    border-color: var(--color-accent-color);
}

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

    .careers__form-container input[type="checkbox"] {
        width: 14px;
        height: 14px;
        margin-top: 1px;
    }

    .careers__form-container input[type="checkbox"]:checked::after {
        font-size: 10px;
        top: -1px;
        left: 1px;
    }
}
</style>
