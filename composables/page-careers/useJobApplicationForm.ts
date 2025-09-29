/**
 * Composable para gerenciamento completo do formulário de candidatura
 *
 * Features: validação, formatação, persistência, i18n e submissão
 * @author Mediari Consultoria
 */

import { ref, reactive, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSessionStorage } from './useSessionStorage';
import { useCandidateService } from './useCandidateService';
import type { JobApplication } from '~/types/candidates';

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

interface SerializableFormData {
  fullName: string;
  email: string;
  phone: string;
  areaOfInterest: string;
  experience: string;
  coverLetter: string;
  privacyConsent: boolean;
  resumeFileName?: string;
}

export const useJobApplicationForm = () => {
  const { t } = useI18n();

  // Persistência de dados
  const [persistedFormData, setPersistedFormData, clearPersistedFormData] =
    useSessionStorage<SerializableFormData>('mediari-job-application-form', {
      fullName: '',
      email: '',
      phone: '',
      areaOfInterest: '',
      experience: '',
      coverLetter: '',
      privacyConsent: false,
    });

  // Estado reativo
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

  const errors = reactive<FormErrors>({
    fullName: '',
    email: '',
    phone: '',
    areaOfInterest: '',
    experience: '',
    resume: '',
    privacyConsent: '',
  });

  const isSubmitting = ref(false);
  const hasError = ref(false);
  const uploadProgress = ref(0);

  // Sincronização automática com sessionStorage
  watch(
    () => ({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      areaOfInterest: formData.areaOfInterest,
      experience: formData.experience,
      coverLetter: formData.coverLetter,
      privacyConsent: formData.privacyConsent,
      ...(formData.resume?.name && { resumeFileName: formData.resume.name }),
    }),
    setPersistedFormData,
    { deep: true }
  );

  // Validadores
  const validators = {
    email: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
    phone: (phone: string) => /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(phone),
    required: (value: string | boolean | File | null) => {
      if (typeof value === 'boolean') return value;
      if (value === null) return false;
      return value.toString().trim().length > 0;
    },
  };

  // Formatação de telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 6)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    }
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  // Limpeza de erros
  const clearErrors = () => {
    Object.keys(errors).forEach((key) => {
      errors[key as keyof FormErrors] = '';
    });
  };

  // Validação de campo específico
  const validateField = (field: keyof FormData, value: unknown): string => {
    switch (field) {
      case 'fullName':
      case 'areaOfInterest':
      case 'experience':
        return !validators.required(value as string)
          ? t('careers.form.required_field')
          : '';

      case 'email':
        if (!validators.required(value as string))
          return t('careers.form.required_field');
        return !validators.email(String(value))
          ? t('careers.form.invalid_email')
          : '';

      case 'phone':
        if (!validators.required(value as string))
          return t('careers.form.required_field');
        return !validators.phone(String(value))
          ? t('careers.form.invalid_phone')
          : '';

      case 'resume':
        return !validators.required(value as File | null)
          ? t('careers.form.required_field')
          : '';

      case 'privacyConsent':
        return !validators.required(value as boolean)
          ? t('careers.form.required_field')
          : '';

      default:
        return '';
    }
  };

  // Validação completa do formulário
  const validateForm = (): boolean => {
    let isValid = true;
    clearErrors();

    const fieldsToValidate: (keyof FormData)[] = [
      'fullName',
      'email',
      'phone',
      'areaOfInterest',
      'experience',
      'resume',
      'privacyConsent',
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

  // Submissão do formulário
  const submitForm = async (): Promise<boolean> => {
    if (!validateForm()) return false;

    isSubmitting.value = true;
    hasError.value = false;

    const { submitApplication } = useCandidateService();

    try {
      // O formulário contém apenas 'fullName'. Enviar o nome completo em 'fullName'.
      const application: JobApplication = {
        fullName: formData.fullName || '',
        email: formData.email,
        phone: formData.phone,
        positionApplied: formData.areaOfInterest,
        experience: formData.experience,
        coverLetter: formData.coverLetter,
        status: 'submitted',
      };

      const resumeFile = formData.resume ?? undefined;
      const result = await submitApplication(
        application,
        resumeFile as File | undefined,
        (progress: number) => {
          uploadProgress.value = progress;
        }
      );

      if (result?.candidateId && typeof window !== 'undefined') {
        window.sessionStorage.setItem(
          'mediari-candidate-id',
          result.candidateId
        );
      }

      clearFormData();
      uploadProgress.value = 0;
      return true;
    } catch (error) {
      console.error('Erro durante submissão da candidatura:', error);
      hasError.value = true;
      return false;
    } finally {
      isSubmitting.value = false;
    }
  };

  // Limpeza completa dos dados
  const clearFormData = () => {
    Object.assign(formData, {
      fullName: '',
      email: '',
      phone: '',
      areaOfInterest: '',
      experience: '',
      coverLetter: '',
      resume: null,
      privacyConsent: false,
    });

    clearPersistedFormData();
    clearErrors();
  };

  // Reset do formulário
  const resetForm = (preservePrivacyConsent = true) => {
    const currentPrivacyConsent = formData.privacyConsent;

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
          (formData[field] as string) = '';
      }
    });

    if (preservePrivacyConsent) {
      formData.privacyConsent = currentPrivacyConsent;
    }

    clearErrors();
    hasError.value = false;
  };

  // Formulário completo
  const isFormComplete = computed(
    () =>
      formData.fullName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phone.trim() !== '' &&
      formData.areaOfInterest.trim() !== '' &&
      formData.experience.trim() !== '' &&
      formData.resume !== null &&
      formData.privacyConsent === true
  );

  return {
    // Estado
    formData,
    errors,
    isSubmitting,
    hasError,
    isFormComplete,
    uploadProgress,

    // Métodos
    validateForm,
    validateField,
    submitForm,
    resetForm,
    formatPhone,
    clearErrors,
    clearFormData,
  };
};
