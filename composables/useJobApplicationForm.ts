import { ref, reactive } from "vue";
import { useI18n } from "vue-i18n";

export const useJobApplicationForm = () => {
    const { t } = useI18n();

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
    const hasError = ref(false);

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
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
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

    const submitForm = async (): Promise<boolean> => {
        if (!validateForm()) {
            return false;
        }

        isSubmitting.value = true;
        hasError.value = false;

        try {
            // Here you would typically send the form data to your backend
            await new Promise((resolve) => setTimeout(resolve, 2000));
            return true;
        } catch (error) {
            console.error("Error submitting form:", error);
            hasError.value = true;
            return false;
        } finally {
            isSubmitting.value = false;
        }
    };

    return {
        formData,
        errors,
        isSubmitting,
        hasError,
        validateForm,
        submitForm,
        formatPhone,
    };
};
