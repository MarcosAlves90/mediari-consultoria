import { ref, reactive, computed } from "vue";
import { useI18n } from "vue-i18n";

export const useProfileTest = () => {
    const { t } = useI18n();

    // Profile test data
    const profileTestAnswers = reactive<Record<number, number>>({});
    const isSubmittingTest = ref(false);
    const hasError = ref(false);

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

    const progress = computed(() => {
        return (Object.keys(profileTestAnswers).length / profileQuestions.value.length) * 100;
    });

    const isTestComplete = computed(() => {
        return Object.keys(profileTestAnswers).length === profileQuestions.value.length;
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
            return true;
        } catch (error) {
            console.error("Error submitting profile test:", error);
            hasError.value = true;
            return false;
        } finally {
            isSubmittingTest.value = false;
        }
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
    };
};
