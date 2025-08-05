<script setup lang="ts">
import { ref, reactive } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

// SEO Meta tags
useSeoMeta({
    title: `${t("careers.section_title")} - Mediari Consultoria`,
    description: t("careers.section_description"),
    ogTitle: `${t("careers.section_title")} - Mediari Consultoria`,
    ogDescription: t("careers.section_description"),
    ogImage: "/mediari-logo.svg",
});

// Form data
const formData = reactive({
    fullName: "",
    email: "",
    phone: "",
    areaOfInterest: "",
    experience: "",
    coverLetter: "",
    resume: null as File | null,
    privacyConsent: false,
});

// Form validation
const errors = reactive({
    fullName: "",
    email: "",
    phone: "",
    areaOfInterest: "",
    experience: "",
    resume: "",
    privacyConsent: "",
});

// Form state
const isSubmitting = ref(false);
const showSuccess = ref(false);
const hasError = ref(false);

// File input ref
const fileInput = ref<HTMLInputElement | null>(null);

// Validation functions
const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return phoneRegex.test(phone);
};

const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 6)
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10)
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(
            6
        )}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
        7,
        11
    )}`;
};

const onPhoneInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const formatted = formatPhone(target.value);
    formData.phone = formatted;
    target.value = formatted;
};

const onFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            errors.resume = t("careers.form.file_too_large");
            target.value = "";
            return;
        }

        // Validate file type
        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        if (!allowedTypes.includes(file.type)) {
            errors.resume = t("careers.form.invalid_file_type");
            target.value = "";
            return;
        }

        formData.resume = file;
        errors.resume = "";
    }
};

const validateForm = (): boolean => {
    let isValid = true;

    // Reset errors
    Object.keys(errors).forEach((key) => {
        errors[key as keyof typeof errors] = "";
    });

    // Full name validation
    if (!formData.fullName.trim()) {
        errors.fullName = t("careers.form.required_field");
        isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
        errors.email = t("careers.form.required_field");
        isValid = false;
    } else if (!validateEmail(formData.email)) {
        errors.email = t("careers.form.invalid_email");
        isValid = false;
    }

    // Phone validation
    if (!formData.phone.trim()) {
        errors.phone = t("careers.form.required_field");
        isValid = false;
    } else if (!validatePhone(formData.phone)) {
        errors.phone = t("careers.form.invalid_phone");
        isValid = false;
    }

    // Area of interest validation
    if (!formData.areaOfInterest) {
        errors.areaOfInterest = t("careers.form.required_field");
        isValid = false;
    }

    // Experience validation
    if (!formData.experience.trim()) {
        errors.experience = t("careers.form.required_field");
        isValid = false;
    }

    // Resume validation
    if (!formData.resume) {
        errors.resume = t("careers.form.required_field");
        isValid = false;
    }

    // Privacy consent validation
    if (!formData.privacyConsent) {
        errors.privacyConsent = t("careers.form.required_field");
        isValid = false;
    }

    return isValid;
};

const submitForm = async () => {
    if (!validateForm()) {
        return;
    }

    isSubmitting.value = true;
    showSuccess.value = false;
    hasError.value = false;

    try {
        // Here you would typically send the form data to your backend
        // For now, we'll simulate a successful submission
        await new Promise((resolve) => setTimeout(resolve, 2000));

        showSuccess.value = true;

        // Reset form
        formData.fullName = "";
        formData.email = "";
        formData.phone = "";
        formData.areaOfInterest = "";
        formData.experience = "";
        formData.coverLetter = "";
        formData.resume = null;
        formData.privacyConsent = false;

        if (fileInput.value) {
            fileInput.value.value = "";
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        hasError.value = true;
    } finally {
        isSubmitting.value = false;
    }
};

// CSS classes following the site's design system
const container_classes =
    "py-4.5 px-4 max-lg:py-3.5 max-xl:px-2 max-md:py-2 max-md:px-1";
const section_title =
    "text-4xl text-primary-text max-md:text-center max-md:text-2xl";
const section_subtitle =
    "font-scheherazade text-xl font-bold text-accent-color max-md:text-center max-md:text-lg";
const section_description =
    "mt-0.5 text-base text-secondary-text max-md:text-justify max-md:text-sm";
const form_group = "mb-1 flex flex-col";
const form_label = "mb-0.5 text-base font-medium text-primary-text";
const form_input =
    "w-full px-1 py-0.5 border-2 border-secondary-text rounded-sm focus:border-accent-color focus:outline-none transition-colors duration-200 text-base";
const form_textarea =
    "w-full px-1 py-0.5 border-2 border-secondary-text rounded-sm focus:border-accent-color focus:outline-none transition-colors duration-200 text-base resize-vertical min-h-[120px]";
const form_select =
    "w-full px-1 py-0.5 border-2 border-secondary-text rounded-sm focus:border-accent-color focus:outline-none transition-colors duration-200 text-base bg-body-bg-dark";
const form_file =
    "w-full px-1 py-0.5 border-2 border-secondary-text rounded-sm focus:border-accent-color focus:outline-none transition-colors duration-200 text-base file:mr-1 file:py-0.25 file:px-0.5 file:rounded-sm file:border-0 file:bg-accent-color file:text-white file:cursor-pointer";
const error_text = "text-sm text-accent-color mt-0.25";
const checkbox_wrapper = "flex items-start gap-0.5 mb-1";
const checkbox_input = "mt-0.25 accent-accent-color";
const checkbox_label = "text-sm text-primary-text";
const submit_button =
    "common-button w-full text-lg font-medium !min-h-[55px] disabled:opacity-50 disabled:cursor-not-allowed";
</script>

<template>
    <main class="careers-page">
        <section
            class="careers__hero w-full flex justify-center items-center"
            role="region"
            aria-labelledby="careers-heading"
            aria-describedby="careers-description"
        >
            <div
                :class="[
                    container_classes,
                    'careers__hero-content max-w-85 w-full text-center',
                ]"
            >
                <p id="careers-subtitle" :class="section_subtitle">
                    {{ t("careers.section_subtitle") }}
                </p>
                <h1 id="careers-heading" :class="section_title">
                    {{ t("careers.section_title") }}
                </h1>
                <p id="careers-description" :class="section_description">
                    {{ t("careers.section_description") }}
                </p>
            </div>
        </section>

        <section
            class="careers__form w-full flex justify-center items-center bg-body-bg-dark"
            role="region"
            aria-labelledby="form-heading"
        >
            <div
                :class="[
                    container_classes,
                    'careers__form-content max-w-[600px] w-full',
                ]"
            >
                <!-- Success Message -->
                <div
                    v-if="showSuccess"
                    class="mb-1 p-1 bg-green-100 border-2 border-green-500 text-green-700 rounded-sm text-center"
                >
                    {{ t("careers.success_message") }}
                </div>

                <!-- Error Message -->
                <div
                    v-if="hasError"
                    class="mb-1 p-1 bg-red-100 border-2 border-accent-color text-accent-color rounded-sm text-center"
                >
                    {{ t("careers.error_message") }}
                </div>

                <form
                    @submit.prevent="submitForm"
                    class="careers__form-container"
                >
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
                            :placeholder="
                                t('careers.form.full_name_placeholder')
                            "
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
                                errors.areaOfInterest
                                    ? 'border-accent-color'
                                    : '',
                            ]"
                            required
                        >
                            <option value="">
                                {{
                                    t(
                                        "careers.form.area_of_interest_placeholder"
                                    )
                                }}
                            </option>
                            <option
                                v-for="area in t('careers.areas')"
                                :key="area"
                                :value="area"
                            >
                                {{ area }}
                            </option>
                        </select>
                        <span
                            v-if="errors.areaOfInterest"
                            :class="error_text"
                            >{{ errors.areaOfInterest }}</span
                        >
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
                            :placeholder="
                                t('careers.form.experience_placeholder')
                            "
                            required
                        ></textarea>
                        <span v-if="errors.experience" :class="error_text">{{
                            errors.experience
                        }}</span>
                    </div>

                    <!-- Resume Upload -->
                    <div :class="form_group">
                        <label for="resume" :class="form_label">
                            {{ t("careers.form.resume") }}
                            <span class="text-accent-color">*</span>
                        </label>
                        <input
                            id="resume"
                            ref="fileInput"
                            type="file"
                            :class="[
                                form_file,
                                errors.resume ? 'border-accent-color' : '',
                            ]"
                            accept=".pdf,.doc,.docx"
                            @change="onFileChange"
                            required
                        />
                        <span class="text-xs text-secondary-text mt-0.25">
                            Formatos aceitos: PDF, DOC, DOCX (máx. 5MB)
                        </span>
                        <span v-if="errors.resume" :class="error_text">{{
                            errors.resume
                        }}</span>
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
                            :placeholder="
                                t('careers.form.cover_letter_placeholder')
                            "
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
                                errors.privacyConsent
                                    ? 'border-accent-color'
                                    : '',
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
                            class="flex items-center gap-0.5"
                        >
                            <Loader />
                            Enviando...
                        </span>
                        <span v-else>{{ t("careers.form.submit") }}</span>
                    </button>
                </form>
            </div>
        </section>
    </main>
</template>

<style scoped>
.careers-page {
    min-height: 100vh;
}

.careers__hero {
    padding-top: calc(88px + 44.8px); /* Account for header height */
}

.careers__form {
    padding-bottom: 2rem;
}

/* Focus states for accessibility */
.careers__form-container input:focus,
.careers__form-container select:focus,
.careers__form-container textarea:focus {
    box-shadow: 0 0 0 3px rgba(var(--color-accent-color-rgb), 0.1);
}

/* Custom file input styling */
input[type="file"]::file-selector-button {
    background-color: var(--color-accent-color);
    color: white;
    border: none;
    padding: 0.25rem 0.5rem;
    border-radius: 0.125rem;
    cursor: pointer;
    margin-right: 0.5rem;
    transition: background-color 0.2s;
}

input[type="file"]::file-selector-button:hover {
    background-color: var(--color-accent-dark-color);
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .careers__hero {
        padding-top: 60px;
    }

    .careers__form-container {
        padding: 0;
    }
}
</style>
