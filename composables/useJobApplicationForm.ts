import { ref, reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useSessionStorage } from "./useSessionStorage";

interface FormData {
    fullName: string;
    email: string;
    phone: string;
    areaOfInterest: string;
    experience: string;
    coverLetter: string;
    resume: File | null;
    privacyConsent: boolean;
}

interface FormErrors {
    fullName: string;
    email: string;
    phone: string;
    areaOfInterest: string;
    experience: string;
    resume: string;
    privacyConsent: string;
}

// Interface para dados serializáveis (sem File)
interface SerializableFormData {
    fullName: string;
    email: string;
    phone: string;
    areaOfInterest: string;
    experience: string;
    coverLetter: string;
    privacyConsent: boolean;
    resumeFileName?: string; // Armazenar apenas o nome do arquivo
}

export const useJobApplicationForm = () => {
    const { t } = useI18n();

    // Configurar sessionStorage para dados do formulário
    const [persistedFormData, setPersistedFormData, clearPersistedFormData] = useSessionStorage<SerializableFormData>(
        'mediari-job-application-form',
        {
            fullName: "",
            email: "",
            phone: "",
            areaOfInterest: "",
            experience: "",
            coverLetter: "",
            privacyConsent: false,
        }
    );

    // Form data with proper typing
    const formData = reactive<FormData>({
        fullName: persistedFormData.value.fullName,
        email: persistedFormData.value.email,
        phone: persistedFormData.value.phone,
        areaOfInterest: persistedFormData.value.areaOfInterest,
        experience: persistedFormData.value.experience,
        coverLetter: persistedFormData.value.coverLetter,
        resume: null,
        privacyConsent: persistedFormData.value.privacyConsent,
    });

    // Form validation errors
    const errors = reactive<FormErrors>({
        fullName: "",
        email: "",
        phone: "",
        areaOfInterest: "",
        experience: "",
        resume: "",
        privacyConsent: "",
    });

    // Observar mudanças no formData e sincronizar com sessionStorage
    watch(
        () => ({
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            areaOfInterest: formData.areaOfInterest,
            experience: formData.experience,
            coverLetter: formData.coverLetter,
            privacyConsent: formData.privacyConsent,
            ...(formData.resume?.name && { resumeFileName: formData.resume.name })
        }),
        (newData) => {
            setPersistedFormData(newData);
        },
        { deep: true }
    );

    // Form state management
    const isSubmitting = ref(false);
    const hasError = ref(false);

    // Validation utilities
    const validators = {
        email: (email: string): boolean => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email.trim());
        },

        phone: (phone: string): boolean => {
            const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
            return phoneRegex.test(phone);
        },

        required: (value: string | boolean | File | null): boolean => {
            if (typeof value === 'boolean') return value;
            if (value === null) return false;
            return value.toString().trim().length > 0;
        }
    };

    // Phone formatting utility
    const formatPhone = (value: string): string => {
        const numbers = value.replace(/\D/g, "");

        if (numbers.length === 0) return "";
        if (numbers.length <= 2) return `(${numbers}`;
        if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
        if (numbers.length <= 10) {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
        }
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    };

    // Clear all validation errors
    const clearErrors = (): void => {
        Object.keys(errors).forEach((key) => {
            errors[key as keyof FormErrors] = "";
        });
    };

    // Validate individual field
    const validateField = (field: keyof FormData, value: any): string => {
        switch (field) {
            case 'fullName':
                return !validators.required(value) ? t("careers.form.required_field") : "";

            case 'email':
                if (!validators.required(value)) {
                    return t("careers.form.required_field");
                }
                return !validators.email(value) ? t("careers.form.invalid_email") : "";

            case 'phone':
                if (!validators.required(value)) {
                    return t("careers.form.required_field");
                }
                return !validators.phone(value) ? t("careers.form.invalid_phone") : "";

            case 'areaOfInterest':
            case 'experience':
                return !validators.required(value) ? t("careers.form.required_field") : "";

            case 'resume':
                return !validators.required(value) ? t("careers.form.required_field") : "";

            case 'privacyConsent':
                return !validators.required(value) ? t("careers.form.required_field") : "";

            default:
                return "";
        }
    };

    // Validate entire form
    const validateForm = (): boolean => {
        let isValid = true;
        clearErrors();

        // Validate each required field
        const fieldsToValidate: (keyof FormData)[] = [
            'fullName', 'email', 'phone', 'areaOfInterest',
            'experience', 'resume', 'privacyConsent'
        ];

        fieldsToValidate.forEach((field) => {
            const error = validateField(field, formData[field]);
            if (error && field in errors) {
                errors[field as keyof FormErrors] = error;
                isValid = false;
            }
        });

        return isValid;
    };

    // Submit form with proper error handling
    const submitForm = async (): Promise<boolean> => {
        if (!validateForm()) {
            return false;
        }

        isSubmitting.value = true;
        hasError.value = false;

        try {
            // Simulate API call - replace with actual implementation
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Here you would typically send the form data to your backend
            // const response = await $fetch('/api/job-applications', {
            //     method: 'POST',
            //     body: formData
            // });

            // Limpar dados persistidos após envio bem-sucedido
            clearFormData();

            return true;
        } catch (error) {
            console.error("Error submitting job application:", error);
            hasError.value = true;
            return false;
        } finally {
            isSubmitting.value = false;
        }
    };

    // Função para limpar os dados do formulário
    const clearFormData = () => {
        // Limpar dados reativos
        Object.assign(formData, {
            fullName: "",
            email: "",
            phone: "",
            areaOfInterest: "",
            experience: "",
            coverLetter: "",
            resume: null,
            privacyConsent: false,
        });

        // Limpar dados persistidos
        clearPersistedFormData();

        // Limpar erros
        Object.assign(errors, {
            fullName: "",
            email: "",
            phone: "",
            areaOfInterest: "",
            experience: "",
            resume: "",
            privacyConsent: "",
        });
    };

    // Reset form to initial state
    const resetForm = (preservePrivacyConsent = true): void => {
        const currentPrivacyConsent = formData.privacyConsent;

        // Reset all form fields
        Object.keys(formData).forEach((key) => {
            const field = key as keyof FormData;
            switch (typeof formData[field]) {
                case 'boolean':
                    (formData[field] as boolean) = false;
                    break;
                case 'object':
                    (formData[field] as File | null) = null;
                    break;
                default:
                    (formData[field] as string) = "";
            }
        });

        // Preserve privacy consent if requested
        if (preservePrivacyConsent) {
            formData.privacyConsent = currentPrivacyConsent;
        }

        clearErrors();
        hasError.value = false;
    };

    return {
        // Form data and state
        formData,
        errors,
        isSubmitting,
        hasError,

        // Form methods
        validateForm,
        validateField,
        submitForm,
        resetForm,
        formatPhone,
        clearErrors,
        clearFormData,
    };
};
