<script setup lang="ts">
import { ref, reactive } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

// SEO Meta tags
useSeoMeta({
    title: `${t("careers.page_title")} - Mediari Consultoria`,
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

// Profile test data
const profileTestAnswers = reactive<Record<number, number>>({});
const currentStep = ref<'form' | 'test' | 'completed'>('form');
const isSubmittingTest = ref(false);

// Profile test questions (using translation keys)
const profileQuestions = computed(() => {
    const questions = t('careers.profile_test.questions', { returnObjects: true });
    return Array.isArray(questions) ? questions : [];
});

const scaleOptions = [
    { value: 1, label: t('careers.profile_test.scale.strongly_disagree') },
    { value: 2, label: t('careers.profile_test.scale.disagree') },
    { value: 3, label: t('careers.profile_test.scale.neutral') },
    { value: 4, label: t('careers.profile_test.scale.agree') },
    { value: 5, label: t('careers.profile_test.scale.strongly_agree') }
];

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
        processFile(file);
    }
};

const processFile = (file: File) => {
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        errors.resume = t("careers.form.file_too_large");
        if (fileInput.value) {
            fileInput.value.value = "";
        }
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
        if (fileInput.value) {
            fileInput.value.value = "";
        }
        return;
    }

    formData.resume = file;
    errors.resume = "";
};

const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer!.dropEffect = "copy";
};

const onDragLeave = (event: DragEvent) => {
    event.preventDefault();
};

const onDrop = (event: DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
        const file = files[0];
        processFile(file);
        
        // Update the hidden input
        if (fileInput.value) {
            const dt = new DataTransfer();
            dt.items.add(file);
            fileInput.value.files = dt.files;
        }
    }
};

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Instead of showing success message, transition to profile test
        currentStep.value = 'test';
    } catch (error) {
        console.error("Error submitting form:", error);
        hasError.value = true;
    } finally {
        isSubmitting.value = false;
    }
};

const submitProfileTest = async () => {
    // Validate that all questions are answered
    const totalQuestions = profileQuestions.value.length;
    const answeredQuestions = Object.keys(profileTestAnswers).length;
    
    if (answeredQuestions !== totalQuestions) {
        hasError.value = true;
        return;
    }

    isSubmittingTest.value = true;
    hasError.value = false;

    try {
        // Here you would send both form data and profile test answers to backend
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        // Show completion message
        currentStep.value = 'completed';
    } catch (error) {
        console.error("Error submitting profile test:", error);
        hasError.value = true;
    } finally {
        isSubmittingTest.value = false;
    }
};

const goToHome = () => {
    navigateTo('/');
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
const form_group = "mb-2 flex flex-col max-md:mb-1.5";
const form_label = "mb-0.75 text-sm font-medium text-primary-text max-md:mb-0.5";
const form_input =
    "w-full px-1.5 py-0.75 border-2 border-secondary-text rounded-sm focus:border-accent-color focus:outline-none transition-colors duration-200 text-sm max-md:px-1 max-md:py-0.5";
const form_textarea =
    "w-full px-1.5 py-0.75 border-2 border-secondary-text rounded-sm focus:border-accent-color focus:outline-none transition-colors duration-200 text-sm resize-vertical min-h-[150px] max-md:min-h-[120px] max-md:px-1 max-md:py-0.5";
const form_select =
    "w-full px-1.5 py-0.75 border-2 border-secondary-text rounded-sm focus:border-accent-color focus:outline-none transition-colors duration-200 text-sm bg-body-bg-dark max-md:px-1 max-md:py-0.5";
const error_text = "text-xs text-accent-color mt-0.5";
const checkbox_wrapper = "flex items-center gap-0.75 mb-2 max-md:gap-0.5 max-md:mb-1.5";
const checkbox_input = "accent-accent-color scale-110 max-md:scale-100 max-md:mt-0.25";
const checkbox_label = "text-xs text-primary-text leading-relaxed";
const submit_button =
    "common-button w-full text-base font-medium !min-h-[60px] mt-1.5 disabled:opacity-50 disabled:cursor-not-allowed max-md:!min-h-[50px] max-md:mt-1";

// Profile test styles
const profile_container = "max-w-70 w-full";
const profile_description = "text-sm text-secondary-text text-center mb-2 max-md:text-xs";
const question_container = "mb-1.5 p-1.5 bg-body-bg-light rounded-sm border border-gray-600 max-md:mb-1 max-md:p-1";
const question_text = "text-sm font-medium text-primary-text mb-1 max-md:text-xs";
const scale_container = "flex justify-between items-center gap-0.5 max-md:flex-col max-md:gap-0.75";
const scale_option = "flex flex-col items-center cursor-pointer transition-all duration-200 p-0.5 rounded hover:bg-accent-color/10 max-md:flex-row max-md:gap-0.5";
const scale_radio = "w-4 h-4 accent-accent-color max-md:w-3.5 max-md:h-3.5";
const scale_label = "text-xs text-secondary-text text-center mt-0.25 max-md:text-xs max-md:mt-0";
const progress_bar = "w-full bg-gray-700 rounded-full h-1 mb-2";
const progress_fill = "bg-accent-color h-1 rounded-full transition-all duration-300";
const completion_container = "text-center py-2";
const completion_title = "text-2xl text-primary-text mb-1 max-md:text-xl";
const completion_message = "text-base text-secondary-text mb-2 max-md:text-sm";
const home_button = "common-button mx-auto px-2 py-0.75";
</script>

<template>
    <main class="careers-page">
        <!-- Hero Section -->
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
                    {{ currentStep === 'test' ? t("careers.profile_test.subtitle") : t("careers.section_subtitle") }}
                </p>
                <h1 id="careers-heading" :class="section_title">
                    {{ currentStep === 'test' ? t("careers.profile_test.title") : t("careers.section_title") }}
                </h1>
                <p id="careers-description" :class="section_description">
                    {{ currentStep === 'test' ? t("careers.profile_test.description") : t("careers.section_description") }}
                </p>
            </div>
        </section>

        <!-- Main Content Section -->
        <section
            class="careers__form w-full flex justify-center items-center bg-body-bg-dark"
            role="region"
            aria-labelledby="form-heading"
        >
            <div
                :class="[
                    container_classes,
                    currentStep === 'test' ? profile_container : 'careers__form-content max-w-70 w-full',
                ]"
            >
                <!-- Job Application Form -->
                <div v-if="currentStep === 'form'">
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
                        @submit.prevent="submitForm"
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
                            
                            <!-- Custom File Upload Area -->
                            <div 
                                class="file-upload-area"
                                :class="[
                                    'relative border-2 border-dashed rounded-sm p-1.5 text-center cursor-pointer transition-all duration-200',
                                    errors.resume ? 'border-accent-color border-solid' : 'border-secondary-text',
                                    formData.resume ? 'border-accent-color border-solid file-selected' : '',
                                    'hover:border-accent-color hover:border-solid hover:shadow-md hover:-translate-y-0.5'
                                ]"
                                @click="() => fileInput?.click()"
                                @dragover.prevent="onDragOver"
                                @dragleave.prevent="onDragLeave"
                                @drop.prevent="onDrop"
                            >
                                <!-- Cloud Upload Icon -->
                                <div class="flex flex-col items-center justify-center py-1">
                                    <svg 
                                        class="w-6 h-6 mb-0.5"
                                        :class="formData.resume ? 'text-white' : 'text-secondary-text'"
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            stroke-linecap="round" 
                                            stroke-linejoin="round" 
                                            stroke-width="2" 
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                        />
                                    </svg>
                                    
                                    <!-- Upload Text -->
                                    <div v-if="!formData.resume" class="text-sm text-primary-text">
                                        <span class="font-medium">Clique para enviar</span>
                                        <span class="text-secondary-text"> ou arraste o arquivo aqui</span>
                                    </div>
                                    
                                    <!-- File Selected -->
                                    <div v-else class="text-sm">
                                        <div class="font-medium text-white mb-0.5">
                                            ✓ Arquivo selecionado
                                        </div>
                                        <div class="text-white">
                                            {{ formData.resume.name }}
                                        </div>
                                        <div class="text-xs text-gray-200 mt-0.25">
                                            {{ formatFileSize(formData.resume.size) }}
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Hidden File Input -->
                                <input
                                    id="resume"
                                    ref="fileInput"
                                    type="file"
                                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    accept=".pdf,.doc,.docx"
                                    @change="onFileChange"
                                    required
                                />
                            </div>
                            
                            <span class="text-xs text-secondary-text mt-0.5 block">
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

                        <!-- Proceed Button -->
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

                <!-- Profile Test -->
                <div v-else-if="currentStep === 'test'">
                    <!-- Progress Bar -->
                    <div :class="progress_bar">
                        <div 
                            :class="progress_fill" 
                            :style="{ width: `${(Object.keys(profileTestAnswers).length / profileQuestions.length) * 100}%` }"
                        ></div>
                    </div>
                    
                    <div class="text-center mb-2">
                        <span class="text-sm text-secondary-text">
                            {{ Object.keys(profileTestAnswers).length }} de {{ profileQuestions.length }} questões respondidas
                        </span>
                    </div>

                    <!-- Error Message -->
                    <div
                        v-if="hasError"
                        class="mb-2 p-1 bg-red-100 border-2 border-accent-color text-accent-color rounded-sm text-center"
                    >
                        Por favor, responda todas as questões antes de finalizar.
                    </div>

                    <!-- Instructions -->
                    <div class="text-center mb-2">
                        <p :class="profile_description">
                            {{ t("careers.profile_test.instruction") }}
                        </p>
                    </div>

                    <!-- Questions -->
                    <div class="space-y-1.5 mb-2">
                        <div 
                            v-for="(question, index) in profileQuestions" 
                            :key="index"
                            :class="question_container"
                        >
                            <p :class="question_text">
                                {{ index + 1 }}. {{ question }}
                            </p>
                            
                            <div :class="scale_container">
                                <label 
                                    v-for="option in scaleOptions" 
                                    :key="option.value"
                                    :class="[
                                        scale_option,
                                        profileTestAnswers[index] === option.value ? 'bg-accent-color/20' : ''
                                    ]"
                                >
                                    <input
                                        v-model="profileTestAnswers[index]"
                                        :value="option.value"
                                        type="radio"
                                        :name="`question-${index}`"
                                        :class="scale_radio"
                                    />
                                    <span :class="scale_label">
                                        {{ option.label }}
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Submit Test Button -->
                    <button
                        @click="submitProfileTest"
                        :class="submit_button"
                        :disabled="isSubmittingTest || Object.keys(profileTestAnswers).length !== profileQuestions.length"
                    >
                        <span
                            v-if="isSubmittingTest"
                            class="flex items-center justify-center gap-0.75"
                        >
                            <Loader />
                            {{ t("careers.profile_test.submitting") }}
                        </span>
                        <span v-else>{{ t("careers.profile_test.submit") }}</span>
                    </button>
                </div>

                <!-- Completion Message -->
                <div v-else-if="currentStep === 'completed'" :class="completion_container">
                    <div class="mb-2">
                        <svg class="w-16 h-16 text-green-500 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    
                    <h2 :class="completion_title">
                        {{ t("careers.profile_test.completion_title") }}
                    </h2>
                    
                    <p :class="completion_message">
                        {{ t("careers.profile_test.completion_message") }}
                    </p>
                    
                    <button
                        @click="goToHome"
                        :class="home_button"
                    >
                        {{ t("careers.profile_test.return_home") }}
                    </button>
                </div>
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

/* File upload area styling */
.file-upload-area {
    min-height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.file-upload-area:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.file-upload-area.file-selected {
    box-shadow: 0 0 0 1px var(--color-accent-color), 0 2px 8px rgba(0, 0, 0, 0.15);
    background: linear-gradient(135deg, var(--color-accent-color), rgba(var(--color-accent-color-rgb), 0.8));
}

.file-upload-area.dragover {
    border-color: var(--color-accent-color);
    border-style: solid;
    transform: scale(1.02);
    box-shadow: 0 0 0 3px rgba(var(--color-accent-color-rgb), 0.1), 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Custom file input styling */
input[type="file"]::file-selector-button {
    background-color: var(--color-accent-color);
    color: white;
    border: none;
    padding: 0.5rem 0.75rem;
    border-radius: 0.125rem;
    cursor: pointer;
    margin-right: 0.75rem;
    transition: background-color 0.2s;
    font-size: 0.875rem;
}

input[type="file"]::file-selector-button:hover {
    background-color: var(--color-accent-dark-color);
}

/* Profile test specific styles */
.profile-test-container {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 2rem;
}

/* Question styling */
.question-card {
    transition: all 0.2s ease;
}

.question-card:hover {
    background: rgba(255, 255, 255, 0.05);
}

/* Scale options styling */
.scale-option {
    flex: 1;
    max-width: 120px;
}

.scale-option input[type="radio"]:checked + .scale-label {
    color: var(--color-accent-color);
    font-weight: 600;
}

/* Progress bar animation */
.progress-fill {
    transition: width 0.3s ease-in-out;
}

/* Completion screen styling */
.completion-container {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 3rem 2rem;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
    .careers__form-container,
    .profile-test-container,
    .completion-container {
        padding: 1.5rem;
    }
}

@media (max-width: 768px) {
    .careers__hero {
        padding-top: 60px;
    }

    .careers__form-container,
    .profile-test-container,
    .completion-container {
        padding: 1rem;
        background: transparent;
        border: none;
    }

    .file-upload-area {
        min-height: 70px;
        padding: 0.75rem;
    }

    .file-upload-area svg {
        width: 1.25rem;
        height: 1.25rem;
    }

    input[type="file"]::file-selector-button {
        padding: 0.25rem 0.5rem;
        margin-right: 0.5rem;
        font-size: 0.75rem;
    }

    /* Mobile adjustments for profile test */
    .scale-container {
        gap: 0.5rem;
    }
    
    .scale-option {
        max-width: none;
        padding: 0.75rem 0.5rem;
        border-radius: 0.25rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .scale-option:hover,
    .scale-option:has(input:checked) {
        background: rgba(var(--color-accent-color-rgb), 0.2);
        border-color: var(--color-accent-color);
    }
}

/* Animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.question-card {
    animation: fadeInUp 0.3s ease-out;
}

/* Enhanced accessibility */
.scale-option:focus-within {
    outline: 2px solid var(--color-accent-color);
    outline-offset: 2px;
}

input[type="radio"]:focus {
    outline: none;
}
</style>
