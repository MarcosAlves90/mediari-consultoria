<template>
    <div v-if="!candidate" class="bg-body-bg-dark rounded-lg shadow border border-gray-200 p-2 text-center">
        <Icon name="mdi:account-outline" class="w-4 h-4 text-gray-400 mx-auto mb-1" />
        <h3 class="text-lg font-medium text-primary-text mb-0.5">
            {{ t("admin.candidates.select_candidate") }}
        </h3>
        <p class="text-secondary-text">
            {{ t("admin.candidates.select_candidate_description") }}
        </p>
    </div>

    <div v-else class="space-y-1.5">
        <!-- Personal Information -->
        <div class="bg-body-bg-dark rounded-lg shadow border border-gray-200">
            <div class="p-1.5">
                <div class="flex items-start justify-between mb-1">
                    <div>
                        <h2 class="text-xl font-semibold text-primary-text">
                            {{ candidate.fullName }}
                        </h2>
                        <p class="text-secondary-text">
                            {{ t("admin.candidates.submitted_on") }} {{ formatDate(candidate.submittedAt) }}
                        </p>
                    </div>
                    <div class="flex gap-0.5">
                        <button
                            @click="$emit('download-resume')"
                            :disabled="!candidate.resumeUrl"
                            class="inline-flex items-center px-0.75 py-0.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-primary-text bg-body-bg-dark hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accent-color disabled:opacity-50"
                        >
                            <Icon name="mdi:download" class="w-1 h-1 mr-0.5" />
                            {{ t("admin.candidates.download_resume") }}
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-1">
                    <div>
                        <label class="block text-sm font-medium text-secondary-text mb-0.25">
                            {{ t("careers.form.email") }}
                        </label>
                        <p class="text-primary-text">{{ candidate.email }}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-secondary-text mb-0.25">
                            {{ t("careers.form.phone") }}
                        </label>
                        <p class="text-primary-text">{{ candidate.phone }}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-secondary-text mb-0.25">
                            {{ t("careers.form.area_of_interest") }}
                        </label>
                        <p class="text-primary-text">{{ candidate.areaOfInterest }}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-secondary-text mb-0.25">
                            {{ t("admin.candidates.resume_file") }}
                        </label>
                        <p class="text-primary-text">{{ candidate.resumeFileName || t("admin.candidates.no_file") }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Experience -->
        <div class="bg-body-bg-dark rounded-lg shadow border border-gray-200">
            <div class="p-1.5">
                <h3 class="text-lg font-semibold text-primary-text mb-0.75">
                    {{ t("careers.form.experience") }}
                </h3>
                <div class="prose prose-sm max-w-none">
                    <p class="text-primary-text whitespace-pre-wrap">{{ candidate.experience }}</p>
                </div>
            </div>
        </div>

        <!-- Cover Letter -->
        <div v-if="candidate.coverLetter" class="bg-body-bg-dark rounded-lg shadow border border-gray-200">
            <div class="p-1.5">
                <h3 class="text-lg font-semibold text-primary-text mb-0.75">
                    {{ t("careers.form.cover_letter") }}
                </h3>
                <div class="prose prose-sm max-w-none">
                    <p class="text-primary-text whitespace-pre-wrap">{{ candidate.coverLetter }}</p>
                </div>
            </div>
        </div>

        <!-- Profile Test Results -->
        <div v-if="candidate.testAnswers" class="bg-body-bg-dark rounded-lg shadow border border-gray-200">
            <div class="p-1.5">
                <div class="flex items-center justify-between mb-1">
                    <h3 class="text-lg font-semibold text-primary-text">
                        {{ t("careers.profile_test.title") }}
                    </h3>
                    <div class="text-right">
                        <div class="text-xl font-bold text-accent-color">
                            {{ candidate.testScore }}%
                        </div>
                        <div class="text-xs text-secondary-text">
                            {{ t("admin.candidates.completion_rate") }}
                        </div>
                    </div>
                </div>

                <ProfileTestResults
                    :answers="candidate.testAnswers"
                    :questions="profileQuestions"
                    :scale-options="scaleOptions"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { Candidate } from "~/composables/admin/useAdminCandidates";
import ProfileTestResults from "./ProfileTestResults.vue";

interface Props {
    candidate: Candidate | null;
    profileQuestions: string[];
    scaleOptions: Array<{ value: number; label: string }>;
}

interface Emits {
    (e: 'download-resume'): void;
}

defineProps<Props>();
defineEmits<Emits>();

const { t } = useI18n();

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
</script>

<style scoped>
.prose p {
    margin-bottom: 1rem;
}

.prose p:last-child {
    margin-bottom: 0;
}
</style>
