import { ref, reactive, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useSessionStorage } from "./useSessionStorage";

export const useProfileTest = () => {
    const { t } = useI18n();

    // Configurar sessionStorage para respostas do teste
    const [persistedAnswers, setPersistedAnswers, clearPersistedAnswers] = useSessionStorage<Record<number, number>>(
        'mediari-profile-test-answers',
        {}
    );

    // Profile test data
    const profileTestAnswers = reactive<Record<number, number>>(persistedAnswers.value);
    const isSubmittingTest = ref(false);
    const hasError = ref(false);

    // Observar mudanças nas respostas e sincronizar com sessionStorage
    watch(
        () => ({ ...profileTestAnswers }),
        (newAnswers) => {
            setPersistedAnswers(newAnswers);
        },
        { deep: true }
    );

    // Professional mirror arrays - Static question keys for reliability
    const PROFILE_QUESTION_KEYS = [
        'careers.profile_test.questions.0',
        'careers.profile_test.questions.1',
        'careers.profile_test.questions.2',
        'careers.profile_test.questions.3',
        'careers.profile_test.questions.4',
        'careers.profile_test.questions.5',
        'careers.profile_test.questions.6',
        'careers.profile_test.questions.7',
        'careers.profile_test.questions.8',
        'careers.profile_test.questions.9',
        'careers.profile_test.questions.10',
        'careers.profile_test.questions.11',
        'careers.profile_test.questions.12',
        'careers.profile_test.questions.13',
        'careers.profile_test.questions.14',
        'careers.profile_test.questions.15',
        'careers.profile_test.questions.16',
        'careers.profile_test.questions.17',
        'careers.profile_test.questions.18',
        'careers.profile_test.questions.19'
    ] as const;

    const SCALE_OPTION_KEYS = [
        { value: 1, key: 'careers.profile_test.scale.strongly_disagree' },
        { value: 2, key: 'careers.profile_test.scale.disagree' },
        { value: 3, key: 'careers.profile_test.scale.neutral' },
        { value: 4, key: 'careers.profile_test.scale.agree' },
        { value: 5, key: 'careers.profile_test.scale.strongly_agree' }
    ] as const;

    // Profile test questions using individual translation keys for better reliability
    const profileQuestions = computed(() => {
        return PROFILE_QUESTION_KEYS.map(key => t(key));
    });

    // Scale options using individual translation keys
    const scaleOptions = computed(() => {
        return SCALE_OPTION_KEYS.map(option => ({
            value: option.value,
            label: t(option.key)
        }));
    });

    const progress = computed(() => {
        const totalQuestions = PROFILE_QUESTION_KEYS.length;
        const answeredQuestions = Object.keys(profileTestAnswers).length;
        return totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
    });

    const isTestComplete = computed(() => {
        return Object.keys(profileTestAnswers).length === PROFILE_QUESTION_KEYS.length;
    });

    const submitProfileTest = async (): Promise<boolean> => {
        // Validate that all questions are answered
        if (!isTestComplete.value) {
            hasError.value = true;
            return false;
        }

        isSubmittingTest.value = true;
        hasError.value = false;

        try {
            // Here you would send both form data and profile test answers to backend
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Limpar dados persistidos após envio bem-sucedido
            clearTestData();

            return true;
        } catch (error) {
            console.error("Error submitting profile test:", error);
            hasError.value = true;
            return false;
        } finally {
            isSubmittingTest.value = false;
        }
    };

    // Função para limpar os dados do teste
    const clearTestData = () => {
        // Limpar respostas reativas
        Object.keys(profileTestAnswers).forEach(key => {
            delete profileTestAnswers[Number(key)];
        });

        // Limpar dados persistidos
        clearPersistedAnswers();

        // Limpar erro
        hasError.value = false;
    };

    return {
        profileTestAnswers,
        isSubmittingTest,
        hasError,
        profileQuestions,
        scaleOptions,
        progress,
        isTestComplete,
        submitProfileTest,
        clearTestData,
    };
};
