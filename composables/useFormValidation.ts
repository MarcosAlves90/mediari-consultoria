/**
 * Composable para validação de formulários
 * Fornece validadores comuns e gerenciamento de estado de validação
 */

import { ref, readonly } from 'vue';

export interface ValidationRule {
  message: string;
  validator: (value: unknown) => boolean;
}

export interface ValidationState {
  isValid: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

export function useFormValidation() {
  const validationState = ref<ValidationState>({
    isValid: true,
    errors: {},
    touched: {},
  });

  /**
   * Validadores comuns
   */
  const validators = {
    required: (message = 'Este campo é obrigatório'): ValidationRule => ({
      message,
      validator: (value: unknown) => {
        if (typeof value === 'string') return value.trim().length > 0;
        if (value === null || value === undefined) return false;
        return String(value).trim().length > 0;
      },
    }),

    email: (message = 'Digite um e-mail válido'): ValidationRule => ({
      message,
      validator: (value: unknown) => {
        if (!value) return true;
        const v = String(value);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(v);
      },
    }),

    phone: (message = 'Digite um telefone válido'): ValidationRule => ({
      message,
      validator: (value: unknown) => {
        if (!value) return true;
        const v = String(value);
        const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        return phoneRegex.test(v);
      },
    }),

    minLength: (min: number, message?: string): ValidationRule => ({
      message: message || `Mínimo de ${min} caracteres`,
      validator: (value: unknown) => {
        if (!value) return true;
        return String(value).length >= min;
      },
    }),

    fileSize: (maxSizeMB: number, message?: string): ValidationRule => ({
      message: message || `Arquivo deve ter no máximo ${maxSizeMB}MB`,
      validator: (file: unknown) => {
        if (!file) return true;
        if (file instanceof File) return file.size <= maxSizeMB * 1024 * 1024;
        return true;
      },
    }),

    fileType: (allowedTypes: string[], message?: string): ValidationRule => ({
      message: message || `Tipo de arquivo não suportado`,
      validator: (file: unknown) => {
        if (!file) return true;
        if (file instanceof File) return allowedTypes.includes(file.type);
        return true;
      },
    }),
  };

  /**
   * Valida um campo específico
   */
  function validateField(
    fieldName: string,
    value: unknown,
    rules: ValidationRule[]
  ): boolean {
    validationState.value.touched[fieldName] = true;

    for (const rule of rules) {
      if (!rule.validator(value)) {
        validationState.value.errors[fieldName] = rule.message;
        return false;
      }
    }

    delete validationState.value.errors[fieldName];
    return true;
  }

  /**
   * Valida um formulário completo
   */
  function validateForm(
    formData: Record<string, unknown>,
    validationRules: Record<string, ValidationRule[]>
  ): boolean {
    let isFormValid = true;

    for (const [fieldName, rules] of Object.entries(validationRules)) {
      const isFieldValid = validateField(fieldName, formData[fieldName], rules);
      if (!isFieldValid) {
        isFormValid = false;
      }
    }

    validationState.value.isValid = isFormValid;
    return isFormValid;
  }

  /**
   * Reseta o estado de validação
   */
  function resetValidation(): void {
    validationState.value = {
      isValid: true,
      errors: {},
      touched: {},
    };
  }

  /**
   * Verifica se um campo tem erro
   */
  function hasError(fieldName: string): boolean {
    return (
      fieldName in validationState.value.errors &&
      validationState.value.touched[fieldName]
    );
  }

  /**
   * Obtém a mensagem de erro de um campo
   */
  function getError(fieldName: string): string {
    return validationState.value.errors[fieldName] || '';
  }

  return {
    validationState: readonly(validationState),
    validators,
    validateField,
    validateForm,
    resetValidation,
    hasError,
    getError,
  };
}
