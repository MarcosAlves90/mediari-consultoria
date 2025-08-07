<template>
    <div class="profile-test">
        <!-- Progress Bar -->
        <div :class="progress_bar">
            <div
                :class="progress_fill"
                :style="{ width: `${progress}%` }"
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
            {{ t("careers.profile_test.error_message") }}
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
                        :class="scale_option"
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
            @click="handleSubmit"
            :class="submit_button"
            :disabled="isSubmittingTest || !isTestComplete"
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
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useProfileTest } from "~/composables/useProfileTest";
import Loader from "~/components/atoms/Loader.vue";

interface Emits {
    (e: 'completed'): void;
}

const emit = defineEmits<Emits>();

const { t } = useI18n();

const {
    profileTestAnswers,
    isSubmittingTest,
    hasError,
    profileQuestions,
    scaleOptions,
    progress,
    isTestComplete,
    submitProfileTest,
} = useProfileTest();

const handleSubmit = async () => {
    const success = await submitProfileTest();
    if (success) {
        emit('completed');
    }
};

// Profile test styles
const progress_bar = "w-full bg-accent-color rounded h-1 mb-2";
const progress_fill = "bg-red-400 h-1 rounded transition-all duration-300";
const profile_description = "text-sm text-secondary-text text-center mb-2 max-md:text-xs";
const question_container = "mb-1.5 p-1.25 bg-body-bg-light rounded-sm border-2 border-gray-600 max-md:mb-1 max-md:p-1";
const question_text = "text-sm font-medium text-primary-text mb-1 max-md:text-xs";
const scale_container = "flex justify-between items-center gap-0.5 max-md:flex-col max-md:gap-0.75";
const scale_option = "flex flex-col items-center cursor-pointer transition-all duration-200 p-0.375 rounded max-md:flex-row max-md:gap-0.5";
const scale_radio = "w-1.5 h-1.5 cursor-pointer accent-accent-color max-md:w-3 max-md:h-3";
const scale_label = "text-xs text-primary-text text-center mt-0.25 max-md:text-xs max-md:mt-0";
const submit_button = "common-button w-full text-base font-medium !min-h-[48px] mt-1.5 disabled:opacity-50 disabled:cursor-not-allowed max-md:!min-h-[42px] max-md:mt-1";
</script>

<style scoped>
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
    color: rgb(248 113 113); /* red-400 */
    font-weight: 600;
}

/* Progress bar animation */
.progress-fill {
    transition: width 0.3s ease-in-out;
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
    outline: 2px solid rgb(248 113 113); /* red-400 */
    outline-offset: 2px;
}

input[type="radio"]:focus {
    outline: none;
}

/* Mobile adjustments */
@media (max-width: 768px) {
    .scale-container {
        gap: 0.5rem;
    }

    .scale-option {
        max-width: none;
        padding: 0.75rem 0.5rem;
        border-radius: 0.25rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .scale-option:has(input:checked) {
        border-color: rgb(248 113 113); /* red-400 */
    }
}
</style>
