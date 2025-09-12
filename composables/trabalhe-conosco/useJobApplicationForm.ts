/**
 * @fileoverview Composable para Gerenciamento de Formulário de Candidatura
 * @description Composable Vue 3 responsável pelo controle completo do estado, validação,
 * formatação e persistência de dados do formulário de candidatura a vagas de emprego.
 * Oferece funcionalidades avançadas como validação em tempo real, formatação automática
 * de campos, sincronização com sessionStorage e suporte completo à internacionalização.
 *
 * @features
 * - Gerenciamento reativo do estado do formulário
 * - Validação completa com mensagens de erro personalizadas
 * - Persistência automática no sessionStorage (exceto arquivos)
 * - Formatação automática de telefone brasileiro
 * - Validação de e-mail com expressões regulares
 * - Controle de estado de submissão com loading
 * - Limpeza segura de dados após operações
 * - Suporte total à internacionalização (i18n)
 * - Interface TypeScript fortemente tipada
 *
 * @author Mediari Consultoria
 * @version 1.0.0
 * @since 2025-01-01
 */

import { ref, reactive, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSessionStorage } from '../useSessionStorage';

/**
 * Interface principal dos dados do formulário de candidatura
 * @description Define a estrutura completa dos dados coletados do candidato
 */
interface FormData {
  /** Nome completo do candidato (obrigatório) */
  fullName: string;
  /** Endereço de e-mail para contato (obrigatório) */
  email: string;
  /** Número de telefone formatado no padrão brasileiro (obrigatório) */
  phone: string;
  /** Área de interesse ou cargo pretendido (obrigatório) */
  areaOfInterest: string;
  /** Nível de experiência profissional (obrigatório) */
  experience: string;
  /** Carta de apresentação do candidato (opcional) */
  coverLetter: string;
  /** Arquivo do currículo em PDF, DOC ou DOCX (obrigatório) */
  resume: File | null;
  /** Consentimento para tratamento de dados pessoais (obrigatório) */
  privacyConsent: boolean;
}

/**
 * Interface para mensagens de erro de validação
 * @description Mapeia cada campo do formulário para sua respectiva mensagem de erro
 */
interface FormErrors {
  /** Mensagem de erro para o campo nome completo */
  fullName: string;
  /** Mensagem de erro para o campo e-mail */
  email: string;
  /** Mensagem de erro para o campo telefone */
  phone: string;
  /** Mensagem de erro para o campo área de interesse */
  areaOfInterest: string;
  /** Mensagem de erro para o campo experiência */
  experience: string;
  /** Mensagem de erro para o campo currículo */
  resume: string;
  /** Mensagem de erro para o campo consentimento de privacidade */
  privacyConsent: string;
}

/**
 * Interface para dados serializáveis no sessionStorage
 * @description Versão dos dados do formulário que pode ser persistida no navegador.
 * Exclui o objeto File que não é serializável nativamente pelo JSON.
 */
interface SerializableFormData {
  /** Nome completo do candidato */
  fullName: string;
  /** Endereço de e-mail para contato */
  email: string;
  /** Número de telefone formatado */
  phone: string;
  /** Área de interesse ou cargo pretendido */
  areaOfInterest: string;
  /** Nível de experiência profissional */
  experience: string;
  /** Carta de apresentação do candidato */
  coverLetter: string;
  /** Consentimento para tratamento de dados pessoais */
  privacyConsent: boolean;
  /** Nome do arquivo de currículo (apenas referência) */
  resumeFileName?: string;
}

/**
 * Composable principal para gerenciamento do formulário de candidatura
 *
 * @description Este composable oferece uma solução completa para:
 * - Controle de estado reativo do formulário
 * - Validação em tempo real com feedback imediato
 * - Formatação automática de campos (telefone)
 * - Persistência automática no sessionStorage
 * - Gerenciamento de submissão com estados de loading e erro
 * - Limpeza e reset de dados com opções flexíveis
 *
 * @returns {Object} Objeto contendo dados reativos, estados e métodos do formulário
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useJobApplicationForm } from '@/composables/useJobApplicationForm';
 *
 * const {
 *   formData,
 *   errors,
 *   isSubmitting,
 *   isFormComplete,
 *   submitForm,
 *   validateField,
 *   formatPhone
 * } = useJobApplicationForm();
 *
 * // Uso em template
 * const handleSubmit = async () => {
 *   const success = await submitForm();
 *   if (success) {
 *     console.log('Candidatura enviada com sucesso!');
 *   }
 * };
 * </script>
 * ```
 */
export const useJobApplicationForm = () => {
  // ==================== INICIALIZAÇÃO ====================

  /**
   * Composable de internacionalização para traduções
   */
  const { t } = useI18n();

  /**
   * Configuração do sessionStorage para persistência de dados
   * @description Permite que o usuário continue preenchendo o formulário
   * mesmo após recarregar a página ou navegar para outras seções
   */
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

  // ==================== ESTADO REATIVO ====================

  /**
   * Dados principais do formulário
   * @description Estado reativo inicializado com dados persistidos.
   * O campo 'resume' é inicializado como null pois arquivos não podem ser persistidos.
   */
  const formData = reactive<FormData>({
    fullName: persistedFormData.value.fullName,
    email: persistedFormData.value.email,
    phone: persistedFormData.value.phone,
    areaOfInterest: persistedFormData.value.areaOfInterest,
    experience: persistedFormData.value.experience,
    coverLetter: persistedFormData.value.coverLetter,
    resume: null, // Arquivos não podem ser persistidos no sessionStorage
    privacyConsent: persistedFormData.value.privacyConsent,
  });

  /**
   * Mensagens de erro de validação para cada campo
   * @description Estado reativo que armazena mensagens de erro traduzidas.
   * Cada campo possui sua mensagem correspondente que é exibida na interface.
   */
  const errors = reactive<FormErrors>({
    fullName: '',
    email: '',
    phone: '',
    areaOfInterest: '',
    experience: '',
    resume: '',
    privacyConsent: '',
  });

  /**
   * Watcher para sincronização automática com sessionStorage
   * @description Observa mudanças nos dados do formulário e persiste automaticamente.
   * Utiliza observação profunda para capturar mudanças em propriedades aninhadas.
   * O arquivo é tratado especialmente, persistindo apenas o nome.
   */
  watch(
    () => ({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      areaOfInterest: formData.areaOfInterest,
      experience: formData.experience,
      coverLetter: formData.coverLetter,
      privacyConsent: formData.privacyConsent,
      // Condicional para incluir nome do arquivo apenas quando existe
      ...(formData.resume?.name && { resumeFileName: formData.resume.name }),
    }),
    (newData) => {
      setPersistedFormData(newData);
    },
    { deep: true }
  );

  // ==================== CONTROLE DE ESTADO ====================

  /**
   * Indica se o formulário está sendo enviado
   * @description Usado para controlar estado de loading nos botões e desabilitar interações
   */
  const isSubmitting = ref<boolean>(false);

  /**
   * Indica se ocorreu erro durante a submissão
   * @description Usado para exibir mensagens de erro gerais na interface
   */
  const hasError = ref<boolean>(false);

  // ==================== VALIDADORES ====================

  /**
   * Conjunto de funções utilitárias para validação de diferentes tipos de dados
   * @description Cada validador implementa uma regra específica de validação
   */
  const validators = {
    /**
     * Valida formato de endereço de e-mail
     * @param {string} email - E-mail a ser validado
     * @returns {boolean} True se o e-mail estiver em formato válido
     *
     * @example
     * validators.email("usuario@dominio.com") // retorna true
     * validators.email("email-inválido") // retorna false
     */
    email: (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email.trim());
    },

    /**
     * Valida formato de telefone brasileiro
     * @param {string} phone - Telefone a ser validado
     * @returns {boolean} True se estiver no formato (XX) XXXX-XXXX ou (XX) XXXXX-XXXX
     *
     * @example
     * validators.phone("(11) 99999-9999") // retorna true
     * validators.phone("11999999999") // retorna false (sem formatação)
     */
    phone: (phone: string): boolean => {
      const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
      return phoneRegex.test(phone);
    },

    /**
     * Valida se um campo obrigatório foi preenchido
     * @param {string | boolean | File | null} value - Valor a ser validado
     * @returns {boolean} True se o valor for considerado válido (não vazio)
     *
     * @description Trata diferentes tipos:
     * - boolean: retorna o próprio valor
     * - null: sempre inválido
     * - string/outros: verifica se não está vazio após trim
     */
    required: (value: string | boolean | File | null): boolean => {
      if (typeof value === 'boolean') return value;
      if (value === null) return false;
      return value.toString().trim().length > 0;
    },
  };

  // ==================== UTILITÁRIOS DE FORMATAÇÃO ====================

  /**
   * Formata número de telefone brasileiro em tempo real
   * @param {string} value - Número de telefone sem formatação
   * @returns {string} Telefone formatado nos padrões brasileiros
   *
   * @description Aplica formatação progressiva conforme o usuário digita:
   * - Até 2 dígitos: (XX
   * - Até 6 dígitos: (XX) XXXX
   * - Até 10 dígitos: (XX) XXXX-XXXX (fixo)
   * - 11 dígitos: (XX) XXXXX-XXXX (celular)
   *
   * @example
   * formatPhone("11987654321") // retorna "(11) 98765-4321"
   * formatPhone("1133334444") // retorna "(11) 3333-4444"
   * formatPhone("11999") // retorna "(11) 999"
   */
  const formatPhone = (value: string): string => {
    // Remove todos os caracteres que não são dígitos
    const numbers = value.replace(/\D/g, '');

    // Aplicar formatação baseada no número de dígitos
    if (numbers.length === 0) return '';
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 6)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    }
    // Formato para números de celular (11 dígitos)
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  // ==================== MÉTODOS DE VALIDAÇÃO ====================

  /**
   * Limpa todas as mensagens de erro do formulário
   * @description Percorre todos os campos de erro e redefine para string vazia
   */
  const clearErrors = (): void => {
    Object.keys(errors).forEach((key) => {
      errors[key as keyof FormErrors] = '';
    });
  };

  /**
   * Valida um campo específico do formulário
   * @param {keyof FormData} field - Nome do campo a ser validado
   * @param {any} value - Valor atual do campo
   * @returns {string} Mensagem de erro traduzida ou string vazia se válido
   *
   * @description Executa validação específica baseada no tipo de campo:
   * - Campos de texto: validação de obrigatoriedade
   * - E-mail: validação de formato além da obrigatoriedade
   * - Telefone: validação de formato brasileiro
   * - Arquivo: validação de presença
   * - Consentimento: validação de aceitação
   *
   * @example
   * const error = validateField('email', 'usuario@dominio.com');
   * if (error) {
   *   console.log('Erro encontrado:', error);
   * }
   */
  const validateField = (field: keyof FormData, value: unknown): string => {
    switch (field) {
      case 'fullName':
        return !validators.required(value as string)
          ? t('careers.form.required_field')
          : '';

      case 'email':
        if (!validators.required(value as string)) {
          return t('careers.form.required_field');
        }
        return !validators.email(String(value))
          ? t('careers.form.invalid_email')
          : '';

      case 'phone':
        if (!validators.required(value as string)) {
          return t('careers.form.required_field');
        }
        return !validators.phone(String(value))
          ? t('careers.form.invalid_phone')
          : '';

      case 'areaOfInterest':
      case 'experience':
        return !validators.required(value as string)
          ? t('careers.form.required_field')
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

  /**
   * Executa validação completa de todos os campos do formulário
   * @returns {boolean} True se todos os campos estiverem válidos
   *
   * @description Processo de validação:
   * 1. Limpa erros existentes
   * 2. Valida cada campo obrigatório individualmente
   * 3. Armazena mensagens de erro encontradas
   * 4. Retorna status geral de validação
   *
   * É chamado automaticamente antes de cada tentativa de submissão.
   */
  const validateForm = (): boolean => {
    let isValid = true;
    clearErrors();

    // Lista de campos que devem ser validados obrigatoriamente
    const fieldsToValidate: (keyof FormData)[] = [
      'fullName',
      'email',
      'phone',
      'areaOfInterest',
      'experience',
      'resume',
      'privacyConsent',
    ];

    // Executar validação para cada campo obrigatório
    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error && field in errors) {
        errors[field as keyof FormErrors] = error;
        isValid = false;
      }
    });

    return isValid;
  };

  // ==================== SUBMISSÃO DO FORMULÁRIO ====================

  /**
   * Submete o formulário após validação completa
   * @returns {Promise<boolean>} Promise que resolve para true em caso de sucesso
   *
   * @description Fluxo completo de submissão:
   * 1. Valida todos os campos obrigatórios
   * 2. Define estado de carregamento para feedback visual
   * 3. Executa simulação de envio (substituir por API real)
   * 4. Limpa dados do formulário em caso de sucesso
   * 5. Trata erros e restaura estado em caso de falha
   * 6. Sempre restaura estado de carregamento no finally
   *
   * @throws {Error} Pode lançar erro durante chamada à API externa
   *
   * @example
   * ```typescript
   * const handleSubmit = async () => {
   *   const success = await submitForm();
   *   if (success) {
   *     // Redirecionar para página de sucesso
   *     await navigateTo('/candidatura/sucesso');
   *   } else {
   *     // Exibir mensagem de erro
   *     showErrorMessage('Erro ao enviar candidatura');
   *   }
   * };
   * ```
   */
  const submitForm = async (): Promise<boolean> => {
    // Validação prévia obrigatória - não prossegue se inválido
    if (!validateForm()) {
      return false;
    }

    // Configurar estado de carregamento
    isSubmitting.value = true;
    hasError.value = false;

    try {
      // Simulação de chamada à API - substituir por implementação real
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // TODO: Implementar integração com API real
      // const response = await $fetch('/api/candidaturas', {
      //     method: 'POST',
      //     headers: {
      //         'Content-Type': 'multipart/form-data',
      //     },
      //     body: createFormDataForUpload(formData)
      // });

      // Limpeza automática após envio bem-sucedido
      clearFormData();

      return true;
    } catch (error) {
      // Log estruturado para debugging e monitoramento
      console.error(
        'useJobApplicationForm: Erro durante submissão da candidatura:',
        error
      );
      hasError.value = true;
      return false;
    } finally {
      // Sempre restaurar estado de carregamento
      isSubmitting.value = false;
    }
  };

  // ==================== GERENCIAMENTO DE DADOS ====================

  /**
   * Executa limpeza completa de todos os dados do formulário
   * @description Operações realizadas:
   * 1. Redefine todos os campos reativos para valores padrão
   * 2. Remove dados persistidos do sessionStorage
   * 3. Limpa todas as mensagens de erro de validação
   *
   * Chamado automaticamente após envio bem-sucedido do formulário.
   */
  const clearFormData = (): void => {
    // Redefinir dados reativos para estado inicial
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

    // Remover dados persistidos do navegador
    clearPersistedFormData();

    // Limpar todas as mensagens de erro
    Object.assign(errors, {
      fullName: '',
      email: '',
      phone: '',
      areaOfInterest: '',
      experience: '',
      resume: '',
      privacyConsent: '',
    });
  };

  /**
   * Reseta o formulário para estado inicial com opções flexíveis
   * @param {boolean} preservePrivacyConsent - Se deve manter o consentimento marcado
   *
   * @description Diferente do clearFormData, permite preservar o consentimento
   * de privacidade para melhor experiência do usuário em caso de erro.
   * Útil quando o usuário já concordou com os termos mas houve falha no envio.
   */
  const resetForm = (preservePrivacyConsent = true): void => {
    const currentPrivacyConsent = formData.privacyConsent;

    // Resetar todos os campos baseado em seu tipo
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

    // Preservar consentimento se solicitado (melhora UX)
    if (preservePrivacyConsent) {
      formData.privacyConsent = currentPrivacyConsent;
    }

    // Limpar estados de erro
    clearErrors();
    hasError.value = false;
  };

  // ==================== PROPRIEDADES COMPUTADAS ====================

  /**
   * Verifica se todos os campos obrigatórios estão preenchidos corretamente
   * @returns {boolean} True se o formulário estiver completo e pronto para envio
   *
   * @description Usado para:
   * - Controlar estado habilitado/desabilitado do botão de envio
   * - Fornecer feedback visual sobre progresso do preenchimento
   * - Validar completude antes de permitir submissão
   *
   * Considera um formulário completo quando:
   * - Todos os campos de texto obrigatórios têm conteúdo (após trim)
   * - Arquivo de currículo foi selecionado
   * - Consentimento de privacidade foi aceito
   */
  const isFormComplete = computed((): boolean => {
    return (
      formData.fullName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phone.trim() !== '' &&
      formData.areaOfInterest.trim() !== '' &&
      formData.experience.trim() !== '' &&
      formData.resume !== null &&
      formData.privacyConsent === true
    );
  });

  // ==================== INTERFACE PÚBLICA DO COMPOSABLE ====================

  return {
    // ===== DADOS E ESTADO =====
    /** Dados reativos do formulário com tipagem completa */
    formData,
    /** Mensagens de erro de validação para cada campo */
    errors,
    /** Estado indicando se formulário está sendo submetido */
    isSubmitting,
    /** Estado indicando se ocorreu erro na última submissão */
    hasError,
    /** Propriedade computada indicando se formulário está completo */
    isFormComplete,

    // ===== MÉTODOS PÚBLICOS =====
    /** Executa validação completa do formulário */
    validateForm,
    /** Valida um campo específico do formulário */
    validateField,
    /** Submete o formulário com validação e tratamento de erros */
    submitForm,
    /** Reseta formulário para estado inicial */
    resetForm,
    /** Formata número de telefone brasileiro */
    formatPhone,
    /** Limpa todas as mensagens de erro */
    clearErrors,
    /** Limpa completamente todos os dados do formulário */
    clearFormData,
  };
};
