<template>
    <div class="job-application-form">
        <!-- Success Message -->
        <div
            v-if="showSuccess"
            class="mb-1 p-1 bg-green-100 border-2 border-green-500 text-green-700 rounded-sm text-center"
        >
            Dados salvos com sucesso! Você será redirecionado para o teste de perfil comportamental.
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
                            v-for="area in t('careers.areas')"
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
            <FileUpload
                id="resume"
                :label="t('careers.form.resume')"
                v-model="formData.resume"
                accept=".pdf,.doc,.docx"
                :error-message="errors.resume"
                required
                @error="(message) => errors.resume = message"
            />

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
                    Processando...
                </span>
                <span v-else>Proceder para Teste de Perfil</span>
            </button>
        </form>
    </div>
</template>

<script setup lang="ts">
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
const form_input = "w-full px-1.5 py-0.75 border-2 border-secondary-text rounded-sm focus:border-accent-color focus:outline-none transition-colors duration-200 text-sm max-md:px-1 max-md:py-0.5";
const form_textarea = "w-full px-1.5 py-0.75 border-2 border-secondary-text rounded-sm focus:border-accent-color focus:outline-none transition-colors duration-200 text-sm resize-vertical min-h-[150px] max-md:min-h-[120px] max-md:px-1 max-md:py-0.5";
const form_select = "w-full px-1.5 py-0.75 border-2 border-secondary-text rounded-sm focus:border-accent-color focus:outline-none transition-colors duration-200 text-sm bg-body-bg-dark max-md:px-1 max-md:py-0.5";
const error_text = "text-xs text-accent-color mt-0.5";
const checkbox_wrapper = "flex items-center gap-0.75 mb-2 max-md:gap-0.5 max-md:mb-1.5";
const checkbox_input = "accent-accent-color scale-110 max-md:scale-100 max-md:mt-0.25";
const checkbox_label = "text-xs text-primary-text leading-relaxed";
const submit_button = "common-button w-full text-base font-medium !min-h-[60px] mt-1.5 disabled:opacity-50 disabled:cursor-not-allowed max-md:!min-h-[50px] max-md:mt-1";
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
}
</style>
