<template>
  <!--
        Componente de detalhes do candidato
        - Exibe informações pessoais, experiência, carta de apresentação e resultados do teste de perfil
        - Permite download do currículo
        - Mostra mensagem caso nenhum candidato esteja selecionado
    -->
  <!-- Loading skeleton -->
  <div
    v-if="isLoading"
    class="bg-body-bg-dark rounded p-2 border-2 border-accent-color space-y-2"
  >
    <Skeleton width="50%" :height="1.5" />
    <Skeleton width="66%" :height="0.75" />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
      <div>
        <Skeleton width="75%" :height="0.75" />
        <Skeleton width="100%" :height="2.5" />
      </div>
      <div>
        <Skeleton width="75%" :height="0.75" />
        <Skeleton width="100%" :height="2.5" />
      </div>
    </div>
  </div>

  <!-- Empty state: no candidate selected -->
  <div
    v-else-if="!candidate"
    class="bg-body-bg-dark rounded p-2 text-center border-2 border-accent-color"
  >
    <Icon
      name="mdi:account-outline"
      size="50"
      class="text-secondary-text mx-auto mb-0.5"
    />
    <h3 class="text-lg font-medium text-secondary-text mb-0.5">
      {{ t('admin.candidates.select_candidate') }}
    </h3>
    <p class="text-secondary-text">
      {{ t('admin.candidates.select_candidate_description') }}
    </p>
  </div>

  <div v-else class="space-y-1.5">
    <!-- Informações pessoais do candidato -->
    <div class="bg-body-bg-dark rounded border-2 border-accent-color">
      <div class="p-1.5">
        <div class="flex items-start justify-between mb-1">
          <div>
            <!-- Nome completo e data de envio -->
            <h2 class="text-xl font-semibold text-primary-text">
              {{ candidate.fullName }}
            </h2>
            <p class="text-secondary-text">
              {{ t('admin.candidates.submitted_on') }}
              {{ formatDate(candidate.submittedAt) }}
            </p>
          </div>
          <div class="flex gap-0.5">
            <!-- Botão para abrir o currículo em nova aba -->
            <a
              v-if="candidate.resumeUrl"
              :href="candidate.resumeUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="common-button flex items-center"
            >
              <Icon name="mdi:open-in-new" class="w-1 h-1 mr-0.5" />
              {{ t('admin.candidates.open_resume') }}
            </a>
            <button
              v-else
              class="common-button opacity-50 cursor-not-allowed"
              disabled
            >
              <Icon name="mdi:open-in-new" class="w-1 h-1 mr-0.5" />
              {{ t('admin.candidates.open_resume') }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-1">
          <!-- E-mail -->
          <div>
            <label
              class="block text-sm font-medium text-secondary-text mb-0.25"
            >
              {{ t('careers.form.email') }}
            </label>
            <p class="text-primary-text">{{ candidate.email }}</p>
          </div>
          <!-- Telefone -->
          <div>
            <label
              class="block text-sm font-medium text-secondary-text mb-0.25"
            >
              {{ t('careers.form.phone') }}
            </label>
            <p class="text-primary-text">{{ candidate.phone }}</p>
          </div>
          <!-- Área de interesse -->
          <div>
            <label
              class="block text-sm font-medium text-secondary-text mb-0.25"
            >
              {{ t('careers.form.area_of_interest') }}
            </label>
            <p class="text-primary-text">{{ candidate.areaOfInterest }}</p>
          </div>
          <!-- Nome do arquivo do currículo -->
          <div>
            <label
              class="block text-sm font-medium text-secondary-text mb-0.25"
            >
              {{ t('admin.candidates.resume_file') }}
            </label>
            <p class="text-primary-text">
              {{ candidate.resumeFileName || t('admin.candidates.no_file') }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Experiência profissional -->
    <div class="bg-body-bg-dark rounded border-2 border-accent-color">
      <div class="p-1.5">
        <h3 class="text-lg font-semibold text-primary-text mb-0.75">
          {{ t('careers.form.experience') }}
        </h3>
        <div class="prose prose-xs max-w-none">
          <p class="text-sm text-primary-text whitespace-pre-wrap">
            {{ candidate.experience }}
          </p>
        </div>
      </div>
    </div>

    <!-- Carta de apresentação -->
    <div
      v-if="candidate.coverLetter"
      class="bg-body-bg-dark rounded border-2 border-accent-color"
    >
      <div class="p-1.5">
        <h3 class="text-lg font-semibold text-primary-text mb-0.75">
          {{ t('careers.form.cover_letter') }}
        </h3>
        <div class="prose prose-xs max-w-none">
          <p class="text-sm text-primary-text whitespace-pre-wrap">
            {{ candidate.coverLetter }}
          </p>
        </div>
      </div>
    </div>

    <!-- Resultados do teste de perfil -->
    <div
      v-if="candidate.testAnswers"
      class="bg-body-bg-dark rounded border-2 border-accent-color"
    >
      <div class="p-1.5">
        <div class="flex items-center justify-between mb-1">
          <h3 class="text-lg font-semibold text-primary-text">
            {{ t('careers.profile_test.title') }}
          </h3>
          <div class="text-right">
            <div class="text-xl font-bold text-accent-color">
              {{ candidate.testScore }}%
            </div>
            <div class="text-xs text-secondary-text">
              {{ t('admin.candidates.completion_rate') }}
            </div>
          </div>
        </div>

        <ProfileTestResults :answers="candidate.testAnswers" :groups="groups" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  // Importações de dependências e componentes
  import { useI18n } from 'vue-i18n'
  import type { Candidate } from '~/composables/page-admin/useAdminCandidates'
  import ProfileTestResults from '~/components/page-admin/molecules/ProfileTestResults.vue'
  import Skeleton from '~/components/atoms/Skeleton.vue'

  /**
   * Propriedades esperadas pelo componente CandidateDetails
   * @property candidate - Objeto do candidato selecionado (ou null)
   * @property groups - Lista de grupos (A-D) com rótulos para cada linha do teste
   * @property scaleOptions - Opções de escala para respostas do teste
   */
  interface Props {
    candidate: Candidate | null
    groups: Array<Record<'A' | 'B' | 'C' | 'D', string>>
    isLoading?: boolean
    // scaleOptions removido - test usa apenas letras A-D
  }

  /**
   * Eventos emitidos pelo componente
   * (nenhum evento relacionado ao currículo é mais emitido)
   */

  // Definição das props
  defineProps<Props>()

  const { t } = useI18n()

  /**
   * Formata a data de envio do candidato para o padrão brasileiro
   * @param dateString - Data em formato string
   * @returns Data formatada (dd/mm/aaaa hh:mm)
   */
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

<style scoped>
  .prose p {
    margin-bottom: 1rem;
  }

  .prose p:last-child {
    margin-bottom: 0;
  }
</style>
