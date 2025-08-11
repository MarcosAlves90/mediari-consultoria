/**
 * @fileoverview Composable para Gerenciamento de Teste de Perfil Profissional
 * @description Composable Vue 3 responsável pelo controle completo do teste de perfil
 * profissional aplicado aos candidatos. Gerencia questões com escala Likert,
 * persiste respostas no sessionStorage, calcula progresso em tempo real e 
 * controla o fluxo de submissão com validação completa.
 * 
 * @features
 * - Teste de perfil com 20 questões profissionais
 * - Escala Likert de 5 pontos (1-5) para cada questão
 * - Persistência automática das respostas no sessionStorage
 * - Cálculo de progresso em tempo real
 * - Validação de completude antes da submissão
 * - Suporte completo à internacionalização (i18n)
 * - Controle de estados de loading e erro
 * - Limpeza automática após submissão bem-sucedida
 * - Interface TypeScript fortemente tipada
 * 
 * @author Mediari Consultoria
 * @version 1.0.0
 * @since 2025-01-01
 */

import { ref, reactive, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useSessionStorage } from "../useSessionStorage";

/**
 * Interface para definir a estrutura de uma opção da escala Likert
 */
interface ScaleOption {
    /** Valor numérico da opção (1-5) */
    value: number;
    /** Texto traduzido da opção */
    label: string;
}

/**
 * Interface para definir a estrutura das respostas do teste
 * @description Mapeia o índice da questão (0-19) para o valor da resposta (1-5)
 */
interface TestAnswers {
    [questionIndex: number]: number;
}

/**
 * Composable principal para gerenciamento do teste de perfil profissional
 * 
 * @description Este composable oferece funcionalidades completas para:
 * - Gerenciar respostas do teste de perfil com 20 questões
 * - Calcular progresso de completude em tempo real
 * - Persistir automaticamente respostas no sessionStorage
 * - Validar completude antes da submissão
 * - Controlar estados de carregamento e erro
 * - Limpar dados após operações bem-sucedidas
 * 
 * O teste utiliza escala Likert de 5 pontos para avaliar características
 * profissionais do candidato, fornecendo insights valiosos para o processo seletivo.
 * 
 * @returns {Object} Objeto contendo dados reativos, questões, progresso e métodos do teste
 * 
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useProfileTest } from '@/composables/useProfileTest';
 * 
 * const {
 *   profileTestAnswers,
 *   profileQuestions,
 *   scaleOptions,
 *   progress,
 *   isTestComplete,
 *   submitProfileTest
 * } = useProfileTest();
 * 
 * // Uso em template
 * const handleAnswer = (questionIndex: number, value: number) => {
 *   profileTestAnswers[questionIndex] = value;
 * };
 * 
 * const handleSubmit = async () => {
 *   const success = await submitProfileTest();
 *   if (success) {
 *     await navigateTo('/teste-perfil/concluido');
 *   }
 * };
 * </script>
 * ```
 */
export const useProfileTest = () => {
    // ==================== INICIALIZAÇÃO ====================

    /**
     * Composable de internacionalização para traduções
     */
    const { t } = useI18n();

    /**
     * Configuração do sessionStorage para persistência das respostas do teste
     * @description Permite que o candidato continue o teste mesmo após recarregar
     * a página ou navegar temporariamente para outras seções
     */
    const [persistedAnswers, setPersistedAnswers, clearPersistedAnswers] = 
        useSessionStorage<Record<number, number>>(
            'mediari-profile-test-answers',
            {}
        );

    // ==================== ESTADO REATIVO ====================

    /**
     * Respostas do teste de perfil
     * @description Estado reativo que mapeia índice da questão (0-19) para valor da resposta (1-5).
     * Inicializado com dados persistidos do sessionStorage para continuidade da sessão.
     */
    const profileTestAnswers = reactive<TestAnswers>(persistedAnswers.value);

    /**
     * Indica se o teste está sendo submetido
     * @description Controla estado de loading durante a submissão
     */
    const isSubmittingTest = ref<boolean>(false);

    /**
     * Indica se ocorreu erro durante a submissão
     * @description Usado para exibir mensagens de erro na interface
     */
    const hasError = ref<boolean>(false);

    /**
     * Watcher para sincronização automática com sessionStorage
     * @description Observa mudanças nas respostas e persiste automaticamente.
     * Utiliza spread operator para criar nova referência e triggerar reatividade.
     */
    watch(
        () => ({ ...profileTestAnswers }),
        (newAnswers) => {
            setPersistedAnswers(newAnswers);
        },
        { deep: true }
    );

    // ==================== CONFIGURAÇÃO DAS QUESTÕES ====================

    /**
     * Chaves de tradução para as questões do teste de perfil
     * @description Array constante com 20 chaves de tradução para garantir
     * consistência e facilitar manutenção. Cada questão avalia aspectos
     * específicos do perfil profissional do candidato.
     */
    const PROFILE_QUESTION_KEYS = [
        'careers.profile_test.questions.0',   // Questão sobre liderança
        'careers.profile_test.questions.1',   // Questão sobre trabalho em equipe
        'careers.profile_test.questions.2',   // Questão sobre comunicação
        'careers.profile_test.questions.3',   // Questão sobre adaptabilidade
        'careers.profile_test.questions.4',   // Questão sobre resolução de problemas
        'careers.profile_test.questions.5',   // Questão sobre iniciativa
        'careers.profile_test.questions.6',   // Questão sobre organização
        'careers.profile_test.questions.7',   // Questão sobre pressão
        'careers.profile_test.questions.8',   // Questão sobre aprendizado
        'careers.profile_test.questions.9',   // Questão sobre inovação
        'careers.profile_test.questions.10',  // Questão sobre relacionamento
        'careers.profile_test.questions.11',  // Questão sobre responsabilidade
        'careers.profile_test.questions.12',  // Questão sobre flexibilidade
        'careers.profile_test.questions.13',  // Questão sobre metas
        'careers.profile_test.questions.14',  // Questão sobre feedback
        'careers.profile_test.questions.15',  // Questão sobre planejamento
        'careers.profile_test.questions.16',  // Questão sobre decisões
        'careers.profile_test.questions.17',  // Questão sobre conflitos
        'careers.profile_test.questions.18',  // Questão sobre desenvolvimento
        'careers.profile_test.questions.19'   // Questão sobre valores
    ] as const;

    /**
     * Configuração das opções da escala Likert
     * @description Define os 5 pontos da escala com seus valores e chaves de tradução:
     * 1 - Discordo Totalmente
     * 2 - Discordo
     * 3 - Neutro/Indiferente
     * 4 - Concordo
     * 5 - Concordo Totalmente
     */
    const SCALE_OPTION_KEYS = [
        { value: 1, key: 'careers.profile_test.scale.strongly_disagree' },
        { value: 2, key: 'careers.profile_test.scale.disagree' },
        { value: 3, key: 'careers.profile_test.scale.neutral' },
        { value: 4, key: 'careers.profile_test.scale.agree' },
        { value: 5, key: 'careers.profile_test.scale.strongly_agree' }
    ] as const;

    // ==================== PROPRIEDADES COMPUTADAS ====================

    /**
     * Lista de questões traduzidas do teste de perfil
     * @description Computed property que converte as chaves de tradução em textos
     * traduzidos. Atualiza automaticamente quando o idioma da aplicação muda.
     * @returns {string[]} Array com 20 questões traduzidas
     */
    const profileQuestions = computed((): string[] => {
        return PROFILE_QUESTION_KEYS.map(key => t(key));
    });

    /**
     * Opções da escala Likert traduzidas
     * @description Computed property que gera as opções da escala com valores
     * numéricos e labels traduzidos. Facilita a renderização no template.
     * @returns {ScaleOption[]} Array com 5 opções da escala traduzidas
     */
    const scaleOptions = computed((): ScaleOption[] => {
        return SCALE_OPTION_KEYS.map(option => ({
            value: option.value,
            label: t(option.key)
        }));
    });

    /**
     * Porcentagem de progresso do teste
     * @description Calcula o percentual de conclusão baseado no número de
     * questões respondidas versus total de questões disponíveis.
     * @returns {number} Percentual de 0 a 100 representando o progresso
     * 
     * @example
     * // Com 10 questões respondidas de 20 total
     * progress.value // retorna 50
     */
    const progress = computed((): number => {
        const totalQuestions = PROFILE_QUESTION_KEYS.length;
        const answeredQuestions = Object.keys(profileTestAnswers).length;
        return totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
    });

    /**
     * Verifica se o teste está completamente respondido
     * @description Valida se todas as 20 questões foram respondidas.
     * Usado para habilitar o botão de submissão e validação prévia.
     * @returns {boolean} True se todas as questões foram respondidas
     */
    const isTestComplete = computed((): boolean => {
        return Object.keys(profileTestAnswers).length === PROFILE_QUESTION_KEYS.length;
    });

    // ==================== MÉTODOS DE SUBMISSÃO ====================

    /**
     * Submete o teste de perfil após validação completa
     * @returns {Promise<boolean>} Promise que resolve para true em caso de sucesso
     * 
     * @description Fluxo completo de submissão:
     * 1. Valida se todas as questões foram respondidas
     * 2. Define estado de carregamento para feedback visual
     * 3. Executa simulação de envio (substituir por API real)
     * 4. Limpa dados do teste em caso de sucesso
     * 5. Trata erros e restaura estado em caso de falha
     * 6. Sempre restaura estado de carregamento no finally
     * 
     * @throws {Error} Pode lançar erro durante chamada à API externa
     * 
     * @example
     * ```typescript
     * const handleTestSubmission = async () => {
     *   const success = await submitProfileTest();
     *   if (success) {
     *     // Avançar para próxima etapa
     *     emit('test-completed');
     *   } else {
     *     // Exibir mensagem de erro
     *     showErrorNotification('Erro ao enviar teste');
     *   }
     * };
     * ```
     */
    const submitProfileTest = async (): Promise<boolean> => {
        // Validação prévia obrigatória - todas as questões devem estar respondidas
        if (!isTestComplete.value) {
            hasError.value = true;
            console.warn("useProfileTest: Tentativa de submissão com teste incompleto");
            return false;
        }

        // Configurar estado de carregamento
        isSubmittingTest.value = true;
        hasError.value = false;

        try {
            // Simulação de chamada à API - substituir por implementação real
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // TODO: Implementar integração com API real
            // const response = await $fetch('/api/teste-perfil', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         candidateId: getCurrentCandidateId(),
            //         answers: profileTestAnswers,
            //         completedAt: new Date().toISOString()
            //     })
            // });

            // Limpeza automática após envio bem-sucedido
            clearTestData();

            console.log("useProfileTest: Teste enviado com sucesso");
            return true;
            
        } catch (error) {
            // Log estruturado para debugging e monitoramento
            console.error("useProfileTest: Erro durante submissão do teste de perfil:", error);
            hasError.value = true;
            return false;
            
        } finally {
            // Sempre restaurar estado de carregamento
            isSubmittingTest.value = false;
        }
    };

    // ==================== GERENCIAMENTO DE DADOS ====================

    /**
     * Executa limpeza completa de todos os dados do teste
     * @description Operações realizadas:
     * 1. Remove todas as respostas do estado reativo
     * 2. Limpa dados persistidos do sessionStorage
     * 3. Reseta estado de erro
     * 
     * Chamado automaticamente após submissão bem-sucedida do teste.
     * 
     * @example
     * ```typescript
     * // Limpar dados manualmente (ex: botão "Reiniciar Teste")
     * const resetTest = () => {
     *   clearTestData();
     *   showSuccessMessage('Teste reiniciado com sucesso');
     * };
     * ```
     */
    const clearTestData = (): void => {
        // Remover todas as respostas do estado reativo
        Object.keys(profileTestAnswers).forEach(key => {
            delete profileTestAnswers[Number(key)];
        });

        // Limpar dados persistidos no sessionStorage
        clearPersistedAnswers();

        // Resetar estado de erro
        hasError.value = false;

        console.log("useProfileTest: Dados do teste limpos com sucesso");
    };

    /**
     * Adiciona ou atualiza resposta para uma questão específica
     * @param {number} questionIndex - Índice da questão (0-19)
     * @param {number} answerValue - Valor da resposta na escala Likert (1-5)
     * 
     * @description Método utilitário para facilitar a atualização de respostas
     * com validação básica dos parâmetros de entrada.
     * 
     * @example
     * ```typescript
     * // Responder questão 5 com valor 4 (Concordo)
     * setAnswer(5, 4);
     * 
     * // Em um componente Vue
     * const handleRadioChange = (questionIndex: number, value: number) => {
     *   setAnswer(questionIndex, value);
     * };
     * ```
     */
    const setAnswer = (questionIndex: number, answerValue: number): void => {
        // Validação básica dos parâmetros
        if (questionIndex < 0 || questionIndex >= PROFILE_QUESTION_KEYS.length) {
            console.error(`useProfileTest: Índice de questão inválido: ${questionIndex}`);
            return;
        }

        if (answerValue < 1 || answerValue > 5) {
            console.error(`useProfileTest: Valor de resposta inválido: ${answerValue}`);
            return;
        }

        // Atualizar resposta no estado reativo
        profileTestAnswers[questionIndex] = answerValue;
        
        console.log(`useProfileTest: Resposta atualizada - Questão ${questionIndex}: ${answerValue}`);
    };

    /**
     * Obtém a resposta atual para uma questão específica
     * @param {number} questionIndex - Índice da questão (0-19)
     * @returns {number | undefined} Valor da resposta ou undefined se não respondida
     * 
     * @example
     * ```typescript
     * const currentAnswer = getAnswer(5);
     * if (currentAnswer) {
     *   console.log(`Questão 5 respondida com valor: ${currentAnswer}`);
     * }
     * ```
     */
    const getAnswer = (questionIndex: number): number | undefined => {
        return profileTestAnswers[questionIndex];
    };

    // ==================== ESTATÍSTICAS DO TESTE ====================

    /**
     * Calcula estatísticas básicas das respostas do teste
     * @returns {Object} Objeto com estatísticas das respostas
     * 
     * @description Fornece insights sobre o padrão de respostas:
     * - Média das respostas
     * - Distribuição por valor da escala
     * - Questões não respondidas
     * 
     * Útil para análise e validação dos dados antes da submissão.
     */
    const getTestStatistics = () => {
        const answers = Object.values(profileTestAnswers);
        const totalAnswers = answers.length;
        
        if (totalAnswers === 0) {
            return {
                averageScore: 0,
                totalAnswered: 0,
                totalPending: PROFILE_QUESTION_KEYS.length,
                distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
            };
        }

        // Calcular média
        const sum = answers.reduce((acc, value) => acc + value, 0);
        const averageScore = sum / totalAnswers;

        // Calcular distribuição
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        answers.forEach(value => {
            distribution[value as keyof typeof distribution]++;
        });

        return {
            averageScore: Number(averageScore.toFixed(2)),
            totalAnswered: totalAnswers,
            totalPending: PROFILE_QUESTION_KEYS.length - totalAnswers,
            distribution
        };
    };

    // ==================== INTERFACE PÚBLICA DO COMPOSABLE ====================

    return {
        // ===== DADOS E ESTADO =====
        /** Respostas do teste mapeadas por índice da questão */
        profileTestAnswers,
        /** Estado indicando se teste está sendo submetido */
        isSubmittingTest,
        /** Estado indicando se ocorreu erro na submissão */
        hasError,

        // ===== DADOS COMPUTADOS =====
        /** Lista de questões traduzidas do teste */
        profileQuestions,
        /** Opções da escala Likert traduzidas */
        scaleOptions,
        /** Porcentagem de progresso de conclusão */
        progress,
        /** Indica se todas as questões foram respondidas */
        isTestComplete,

        // ===== MÉTODOS PRINCIPAIS =====
        /** Submete o teste após validação completa */
        submitProfileTest,
        /** Limpa todos os dados do teste */
        clearTestData,

        // ===== MÉTODOS UTILITÁRIOS =====
        /** Define resposta para uma questão específica */
        setAnswer,
        /** Obtém resposta atual de uma questão */
        getAnswer,
        /** Calcula estatísticas das respostas */
        getTestStatistics,
    };
};