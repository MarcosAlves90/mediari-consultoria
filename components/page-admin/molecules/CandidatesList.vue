
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
defineEmits<Emits>();
const { t } = useI18n();

const searchQuery = ref("");
const selectedArea = ref("");

const areas = computed(() => {
    const uniqueAreas = new Set(props.candidates.map((c: Candidate) => c.areaOfInterest));
    return Array.from(uniqueAreas).sort();
});

const filteredCandidates = computed(() => {
    let filtered = props.candidates;

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter((candidate: Candidate) =>
            candidate.fullName.toLowerCase().includes(query) ||
            candidate.email.toLowerCase().includes(query)
        );
    }

    if (selectedArea.value) {
        filtered = filtered.filter((candidate: Candidate) =>
            candidate.areaOfInterest === selectedArea.value
        );
    }

    return filtered.sort((a: Candidate, b: Candidate) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
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

    <div class="bg-body-bg-dark rounded border-2 border-accent-color h-20 sm:h-24 md:h-28 lg:h-32 xl:h-36 flex flex-col">
        <div class="border-b-2 border-body-bg flex-shrink-0">
            <h2 class="text-lg font-semibold text-body-bg bg-accent-color px-1 py-0.5">
                {{ t("admin.candidates.candidates_list") }}
            </h2>

            <!-- Área de busca e filtro -->
            <div class="space-y-0.75 px-1 py-1">
                <!-- Campo de busca por nome ou e-mail -->
                <input
                    v-model="searchQuery"
                    type="text"
                    :placeholder="t('admin.candidates.search_placeholder')"
                    class="w-full px-0.75 py-0.5 bg-body-bg rounded focus:outline-none focus:ring-accent-color focus:border-accent-color text-sm border-2 border-accent-color"
                />

                <!-- Seleção de área de interesse -->
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

        <!-- Estado de carregamento -->
        <div v-if="isLoading" class="p-1 text-center flex-shrink-0">
            <Loader />
            <p class="text-secondary-text text-sm mt-0.5">
                {{ t("admin.candidates.loading") }}
            </p>
        </div>

        <!-- Estado vazio (nenhum candidato ou nenhum resultado) -->
        <div v-else-if="filteredCandidates.length === 0" class="p-1.5 text-center flex-shrink-0">
            <div class="w-3 h-3 text-gray-400 mx-auto mb-0.75 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <p class="text-secondary-text">
                {{ searchQuery || selectedArea ? t("admin.candidates.no_results") : t("admin.candidates.no_candidates") }}
            </p>
        </div>

        <!-- Lista de candidatos -->
        <div v-else class="divide-y divide-gray-200 overflow-y-auto flex-1">
            <!-- Item de candidato -->
            <div
                v-for="(candidate, index) in filteredCandidates"
                :key="candidate.id"
                @click="$emit('select', candidate)"
                :class="[
                    'p-1 cursor-pointer hover:bg-body-bg border-y-2 border-transparent',
                    selectedCandidate?.id === candidate.id ? 'bg-accent-color-2 !border-accent-color hover:!bg-accent-color-3' : '',
                    index === filteredCandidates.length - 1 ? '!border-b-transparent' : ''
                ]"
            >
                <div class="flex items-start justify-between">
                    <div class="flex-1 min-w-0">
                        <!-- Nome do candidato -->
                        <h3 class="text-sm font-medium text-primary-text truncate">
                            {{ candidate.fullName }}
                        </h3>
                        <!-- E-mail do candidato -->
                        <p class="text-xs text-secondary-text truncate">
                            {{ candidate.email }}
                        </p>
                        <div class="flex items-center mt-0.25 gap-0.5">
                            <!-- Área de interesse -->
                            <span class="inline-flex items-center px-0.5 py-0.125 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {{ candidate.areaOfInterest }}
                            </span>
                            <!-- Nota do teste, se houver -->
                            <span v-if="candidate.testScore" class="text-xs text-secondary-text">
                                {{ t("admin.candidates.test_score") }}: {{ candidate.testScore }}%
                            </span>
                        </div>
                    </div>
                    <!-- Data de envio da candidatura -->
                    <div class="text-xs text-secondary-text">
                        {{ formatDate(candidate.submittedAt) }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

