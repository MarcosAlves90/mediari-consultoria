<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import type { Candidate } from '~/composables/page-admin/useAdminCandidates'
  import Skeleton from '~/components/atoms/Skeleton.vue'
  interface Props {
    candidates: Candidate[]
    selectedCandidate: Candidate | null
    isLoading: boolean
  }

  interface Emits {
    (e: 'select', candidate: Candidate | null): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const handleCandidateClick = (candidate: Candidate) => {
    // Se o candidato clicado já está selecionado, desseleciona
    if (props.selectedCandidate?.id === candidate.id) {
      emit('select', null)
    } else {
      emit('select', candidate)
    }
  }
  const { t } = useI18n()

  const searchQuery = ref('')
  const selectedArea = ref('')

  const areas = computed(() => {
    const uniqueAreas = new Set(
      props.candidates.map((c: Candidate) => c.areaOfInterest)
    )
    return Array.from(uniqueAreas).sort()
  })

  const filteredCandidates = computed(() => {
    let filtered = props.candidates

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(
        (candidate: Candidate) =>
          candidate.fullName.toLowerCase().includes(query) ||
          candidate.email.toLowerCase().includes(query)
      )
    }

    if (selectedArea.value) {
      filtered = filtered.filter(
        (candidate: Candidate) =>
          candidate.areaOfInterest === selectedArea.value
      )
    }

    return filtered.sort(
      (a: Candidate, b: Candidate) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
</script>

<template>
  <div
    class="bg-body-bg-dark rounded border-2 border-accent-color flex flex-col h-24 md:h-28 lg:h-32 xl:h-36"
  >
    <div class="border-b-2 border-body-bg flex-shrink-0">
      <h2
        class="text-lg font-semibold text-body-bg bg-accent-color px-1 py-0.5"
      >
        {{ t('admin.candidates.candidates_list') }}
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
          <option value="">{{ t('admin.candidates.all_areas') }}</option>
          <option v-for="area in areas" :key="area" :value="area">
            {{ area }}
          </option>
        </select>
      </div>
    </div>

    <!-- Estado de carregamento: skeletons -->
    <div v-if="isLoading" class="p-1 text-center flex-shrink-0">
      <div class="space-y-1">
        <!-- usar múltiplos de var(--spacing). 1 = 1 * spacing (1rem) -->
        <Skeleton width="100%" :height="3" />
        <Skeleton width="100%" :height="3" />
        <Skeleton width="100%" :height="3" />
      </div>
    </div>

    <!-- Estado vazio (nenhum candidato ou nenhum resultado) -->
    <div
      v-else-if="filteredCandidates.length === 0"
      class="p-1.5 text-center flex-shrink-0"
    >
      <div
        class="w-3 h-3 text-gray-400 mx-auto mb-0.75 flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <p class="text-secondary-text">
        {{
          searchQuery || selectedArea
            ? t('admin.candidates.no_results')
            : t('admin.candidates.no_candidates')
        }}
      </p>
    </div>

    <!-- Lista de candidatos -->
    <div v-else class="divide-y divide-gray-200 overflow-y-auto flex-1">
      <!-- Item de candidato -->
      <div
        v-for="(candidate, index) in filteredCandidates"
        :key="candidate.id"
        @click="handleCandidateClick(candidate)"
        :class="[
          /* padding reduzido em dispositivos pequenos, volta ao padrão em md+ */
          'p-0.5 md:p-1 cursor-pointer hover:bg-body-bg border-y-2 border-transparent',
          selectedCandidate?.id === candidate.id
            ? 'bg-accent-color-2 !border-accent-color hover:!bg-accent-color-3'
            : '',
          index === filteredCandidates.length - 1
            ? '!border-b-transparent'
            : '',
        ]"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <!-- Nome do candidato (menor em telas pequenas) -->
            <h3
              class="text-xs md:text-sm font-medium text-primary-text truncate"
            >
              {{ candidate.fullName }}
            </h3>
            <!-- E-mail do candidato (escondido em telas pequenas) -->
            <p class="hidden md:block text-xs text-secondary-text truncate">
              {{ candidate.email }}
            </p>
            <div class="flex items-center mt-0.25 gap-0.5">
              <!-- Área de interesse (escondida em telas pequenas) -->
              <span
                class="hidden md:inline-flex items-center px-0.5 py-0.125 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {{ candidate.areaOfInterest }}
              </span>
              <!-- Nota do teste, se houver (escondida em telas pequenas) -->
              <span
                v-if="candidate.testScore"
                class="hidden md:inline text-xs text-secondary-text"
              >
                {{ t('admin.candidates.test_score') }}:
                {{ candidate.testScore }}%
              </span>
            </div>
          </div>
          <!-- Data de envio da candidatura (fonte menor em telas pequenas) -->
          <div class="text-[10px] md:text-xs text-secondary-text">
            {{ formatDate(candidate.submittedAt) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
