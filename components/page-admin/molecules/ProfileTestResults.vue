<template>
    <div class="profile-test-results">
        <div class="space-y-1">
            <div
                v-for="(question, index) in questions"
                :key="index"
                class="bg-accent-color-2/30 rounded p-1"
            >
                <div class="flex items-start justify-between">
                    <div class="flex-1 pr-1">
                        <h4 class="text-sm font-medium text-primary-text mb-0.5">
                            {{ index + 1 }}. {{ question }}
                        </h4>

                        <div class="flex items-center gap-0.5">
                            <span class="text-xs text-secondary-text">Resposta:</span>
                            <span
                                :class="[
                                    'inline-flex items-center px-0.5 py-0.125 rounded-full text-xs font-medium',
                                    getScoreColorClass(answers[index] || 0)
                                ]"
                            >
                                {{ getScoreLabel(answers[index] || 0) }}
                            </span>
                        </div>
                    </div>

                    <!-- Visual Scale -->
                    <div class="flex-shrink-0">
                        <ScaleBar
                            :value="answers[index] || 0"
                            :max="5"
                            :size="'sm'"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- Summary -->
        <div class="mt-1.5 bg-body-bg rounded p-1">
            <h3 class="text-sm font-medium text-primary-text mb-0.75">
                {{ t("admin.candidates.test_summary") }}
            </h3>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-1 text-center">
                <div>
                    <div class="text-xl font-bold text-green-600">
                        {{ getScoreCount(4, 5) }}
                    </div>
                    <div class="text-xs text-secondary-text">
                        {{ t("admin.candidates.positive_responses") }}
                    </div>
                </div>

                <div>
                    <div class="text-xl font-bold text-yellow-600">
                        {{ getScoreCount(3, 3) }}
                    </div>
                    <div class="text-xs text-secondary-text">
                        {{ t("admin.candidates.neutral_responses") }}
                    </div>
                </div>

                <div>
                    <div class="text-xl font-bold text-red-600">
                        {{ getScoreCount(1, 2) }}
                    </div>
                    <div class="text-xs text-secondary-text">
                        {{ t("admin.candidates.negative_responses") }}
                    </div>
                </div>

                <div>
                    <div class="text-xl font-bold text-accent-color">
                        {{ calculateAverageScore().toFixed(1) }}
                    </div>
                    <div class="text-xs text-secondary-text">
                        {{ t("admin.candidates.average_score") }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Behavioral Insights -->
        <div class="mt-1.5 bg-accent-color-2/30 rounded p-1">
            <h3 class="text-sm font-medium text-primary-text mb-0.75">
                {{ t("admin.candidates.behavioral_insights") }}
            </h3>

            <div class="space-y-0.75">
                <div
                    v-for="insight in getBehavioralInsights()"
                    :key="insight.category"
                    class="flex items-center justify-between"
                >
                    <span class="text-sm text-primary-text">{{ insight.category }}</span>
                    <div class="flex items-center gap-0.5">
                        <div class="w-5 bg-gray-200 rounded-full h-0.5">
                            <div
                                :class="[
                                    'h-0.5 rounded-full transition-all duration-300',
                                    insight.score >= 4 ? 'bg-green-500' :
                                    insight.score >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                                ]"
                                :style="{ width: `${(insight.score / 5) * 100}%` }"
                            ></div>
                        </div>
                        <span class="text-sm font-medium text-secondary-text w-2">
                            {{ insight.score.toFixed(1) }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template><script setup lang="ts">
import { useI18n } from "vue-i18n";
import ScaleBar from "~/components/page-trabalhe-conosco/atoms/ScaleBar.vue";

export interface ScaleOption {
    value: number;
    label: string;
}

export interface BehavioralCategory {
    category: string;
    questionIndexes: number[];
}

export interface ProfileTestResultsProps {
    answers: Record<number, number>;
    questions: string[];
    scaleOptions: ScaleOption[];
    behavioralCategories?: BehavioralCategory[];
}

const defaultCategories: BehavioralCategory[] = [
    { category: "Trabalho em Equipe", questionIndexes: [0, 5, 13, 17] },
    { category: "Organização", questionIndexes: [1, 2, 7, 14] },
    { category: "Liderança", questionIndexes: [3, 6, 9, 16] },
    { category: "Adaptabilidade", questionIndexes: [8, 10, 11, 19] },
    { category: "Detalhismo", questionIndexes: [2, 4, 18] },
    { category: "Independência", questionIndexes: [8, 12, 15] }
];

const props = defineProps<ProfileTestResultsProps>();
const { t } = useI18n();

function getScoreLabel(score: number): string {
    const option = props.scaleOptions.find(opt => opt.value === score);
    return option?.label || t("admin.candidates.no_answer");
}

function getScoreColorClass(score: number): string {
    if (score >= 4) return "bg-green-100 text-green-800";
    if (score === 3) return "bg-yellow-100 text-yellow-800";
    if (score >= 1) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
}

function getScoreCount(min: number, max: number): number {
    return Object.values(props.answers).filter(score => score >= min && score <= max).length;
}

function calculateAverageScore(): number {
    const scores = Object.values(props.answers);
    if (scores.length === 0) return 0;
    const sum = scores.reduce((acc, score) => acc + score, 0);
    return sum / scores.length;
}

function getBehavioralInsights(): Array<{ category: string; score: number }> {
    const categories = props.behavioralCategories || defaultCategories;
    return categories.map(({ category, questionIndexes }) => {
        const relevantAnswers = questionIndexes
            .map(index => props.answers[index])
            .filter(answer => answer !== undefined);
        const averageScore = relevantAnswers.length > 0
            ? relevantAnswers.reduce((sum, score) => sum + score, 0) / relevantAnswers.length
            : 0;
        return { category, score: averageScore };
    }).sort((a, b) => b.score - a.score);
}
</script>

<style scoped>
        .profile-test-results {
            max-height: 25rem;
            overflow-y: auto;
        }
    </style>
