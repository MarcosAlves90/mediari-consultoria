<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import type { Candidate } from "~/composables/admin/useAdminCandidates";
import Loader from "~/components/atoms/Loader.vue";

interface Props {
    candidates: Candidate[];
    selectedCandidate: Candidate | null;
    isLoading: boolean;
}

interface Emits {
    (e: 'select', candidate: Candidate): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const { t } = useI18n();

// Search and filter
const searchQuery = ref("");
const selectedArea = ref("");

// Computed properties
const areas = computed(() => {
    const uniqueAreas = new Set(props.candidates.map((c: any) => c.areaOfInterest));
    return Array.from(uniqueAreas).sort();
});

const filteredCandidates = computed(() => {
    let filtered = props.candidates;

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter((candidate: any) =>
            candidate.fullName.toLowerCase().includes(query) ||
            candidate.email.toLowerCase().includes(query)
        );
    }

    if (selectedArea.value) {
        filtered = filtered.filter((candidate: any) =>
            candidate.areaOfInterest === selectedArea.value
        );
    }

    return filtered.sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
});

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

<template>
    <div class="bg-body-bg-dark rounded border-2 border-accent-color">
        <div class="p-1 border-b-2 border-body-bg">
            <h2 class="text-lg font-semibold text-primary-text">
                {{ t("admin.candidates.candidates_list") }}
            </h2>

            <!-- Search and Filter -->
            <div class="mt-0.75 space-y-0.75">
                <input
                    v-model="searchQuery"
                    type="text"
                    :placeholder="t('admin.candidates.search_placeholder')"
                    class="w-full px-0.75 py-0.5 bg-body-bg rounded focus:outline-none focus:ring-accent-color focus:border-accent-color text-sm border-2 border-accent-color"
                />

                <select
                    v-model="selectedArea"
                    class="w-full px-0.75 py-0.5 bg-body-bg rounded focus:outline-none focus:ring-accent-color focus:border-accent-color text-sm border-2 border-accent-color"
                >
                    <option value="">{{ t("admin.candidates.all_areas") }}</option>
                    <option v-for="area in areas" :key="area" :value="area">
                        {{ area }}
                    </option>
                </select>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="p-1 text-center">
            <Loader />
            <p class="text-secondary-text text-sm mt-0.5">
                {{ t("admin.candidates.loading") }}
            </p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredCandidates.length === 0" class="p-1.5 text-center">
            <Icon name="mdi:account-search" class="w-3 h-3 text-gray-400 mx-auto mb-0.75" />
            <p class="text-secondary-text">
                {{ searchQuery || selectedArea ? t("admin.candidates.no_results") : t("admin.candidates.no_candidates") }}
            </p>
        </div>

        <!-- Candidates List -->
        <div v-else class="divide-y divide-gray-200 max-h-30 overflow-y-auto">
            <div
                v-for="candidate in filteredCandidates"
                :key="candidate.id"
                @click="$emit('select', candidate)"
                :class="[
                    'p-1 cursor-pointer hover:bg-body-bg border-y-2 border-transparent',
                    selectedCandidate?.id === candidate.id ? 'bg-accent-color-2 !border-accent-color hover:!bg-accent-color-3' : ''
                ]"
            >
                <div class="flex items-start justify-between">
                    <div class="flex-1 min-w-0">
                        <h3 class="text-sm font-medium text-primary-text truncate">
                            {{ candidate.fullName }}
                        </h3>
                        <p class="text-xs text-secondary-text truncate">
                            {{ candidate.email }}
                        </p>
                        <div class="flex items-center mt-0.25 gap-0.5">
                            <span class="inline-flex items-center px-0.5 py-0.125 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {{ candidate.areaOfInterest }}
                            </span>
                            <span v-if="candidate.testScore" class="text-xs text-secondary-text">
                                {{ t("admin.candidates.test_score") }}: {{ candidate.testScore }}%
                            </span>
                        </div>
                    </div>
                    <div class="text-xs text-secondary-text">
                        {{ formatDate(candidate.submittedAt) }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

