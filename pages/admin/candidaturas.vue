<script setup lang="ts">
/**
 * Página de Administração de Candidatos
 * 
 * Esta página permite aos administradores visualizar e gerenciar candidatos
 * que se candidataram através do sistema "Trabalhe Conosco". A interface
 * é dividida em duas seções principais: lista de candidatos e detalhes do
 * candidato selecionado.
 * 
 * @author Mediari Consultoria
 * @version 1.0.0
 */

import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useAdminCandidates } from "@/composables/admin";
import { useProfileTest } from "@/composables/trabalhe-conosco";
import { AdminHeader, CandidatesList, CandidateDetails } from "@/components/admin";

/**
 * Configuração da página - Define layout administrativo e middleware de autenticação
 * Garante que apenas usuários autenticados como administradores possam acessar
 */
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
});

/**
 * Hook de internacionalização para suporte multilíngue
 */
const { t } = useI18n();

/**
 * Configuração de SEO e meta tags
 * Páginas administrativas são configuradas para não serem indexadas por motores de busca
 */
useSeoMeta({
  title: `${t("admin.candidates.page_title")} - Mediari Consultoria`,
  description: t("admin.candidates.page_description"),
  robots: "noindex, nofollow", // Páginas administrativas não devem ser indexadas
});

/**
 * Composable para gerenciamento de candidatos administrativos
 * Fornece funcionalidades para carregar, selecionar e fazer download de currículos
 */
const {
  candidates,           // Lista de candidatos
  selectedCandidate,    // Candidato atualmente selecionado
  isLoading,           // Estado de carregamento
  loadCandidates,      // Função para carregar candidatos
  selectCandidate,     // Função para selecionar um candidato
  downloadResume,      // Função para baixar currículo
} = useAdminCandidates();

/**
 * Composable para questões do teste de perfil
 * Fornece as perguntas e opções de escala utilizadas na avaliação dos candidatos
 */
const { profileQuestions, scaleOptions } = useProfileTest();

/**
 * Atualiza a lista de candidatos
 * Função utilitária para recarregar os dados dos candidatos
 * 
 * @async
 * @returns {Promise<void>}
 */
const refreshCandidates = async (): Promise<void> => {
  await loadCandidates();
};

/**
 * Hook de ciclo de vida - Carrega candidatos quando o componente é montado
 * Executa automaticamente ao inicializar a página
 */
onMounted(() => {
  loadCandidates();
});
</script>

<template>
  <main class="admin-candidates-page">
    <!-- Cabeçalho da Página Administrativa -->
    <AdminHeader
      :title="t('admin.candidates.page_title')"
      :description="t('admin.candidates.page_description')"
    >
      <!-- Slot de ações do cabeçalho -->
      <template #actions>
        <!-- Container responsivo para ações -->
        <div class="flex flex-col 500:flex-row items-stretch 500:items-center gap-0.5 500:gap-1 w-full 500:w-auto">
          <!-- Contador de candidaturas totais -->
          <div class="text-xs 500:text-sm text-secondary-text text-center 500:text-left order-2 500:order-1 py-0.25 500:py-0">
            {{ t("admin.candidates.total_applications", { count: candidates.length }) }}
          </div>
          
          <!-- Botão de atualização da lista -->
          <button
            @click="refreshCandidates"
            :disabled="isLoading"
            class="inline-flex items-center px-1 py-0.5 border border-gray-300 rounded-md shadow-sm text-xs 500:text-sm font-medium text-primary-text bg-body-bg-dark hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accent-color disabled:opacity-50 transition-all duration-200 order-1 500:order-2 justify-center min-h-[40px] 500:min-h-[36px]"
          >
            <!-- Ícone de refresh com animação durante carregamento -->
            <Icon 
              name="mdi:refresh" 
              class="w-1 h-1 mr-0.5" 
              :class="{ 'animate-spin': isLoading }" 
            />
            <span>{{ t("admin.candidates.refresh") }}</span>
          </button>
        </div>
      </template>
    </AdminHeader>

    <!-- Container principal com layout responsivo -->
    <div class="max-w-7xl mx-auto px-0.5 300:px-0.75 500:px-1 870:px-1.5 py-0.75 500:py-1 870:py-1.5">
      <!-- Layout de grid adaptativo com breakpoints personalizados -->
      <div class="grid grid-cols-1 870:grid-cols-3 gap-0.75 500:gap-1 870:gap-1.5">
        
        <!-- Seção da Lista de Candidatos -->
        <div class="870:col-span-1 order-2 870:order-1">
          <CandidatesList
            :candidates="candidates"
            :selected-candidate="selectedCandidate"
            :is-loading="isLoading"
            @select="selectCandidate"
          />
        </div>

        <!-- Seção de Detalhes do Candidato -->
        <div class="870:col-span-2 order-1 870:order-2">
          <CandidateDetails
            :candidate="selectedCandidate"
            :profile-questions="profileQuestions"
            :scale-options="scaleOptions"
            @download-resume="downloadResume"
          />
        </div>
        
      </div>
    </div>
  </main>
</template>

<style scoped>
/**
 * Estilos específicos da página de candidatos administrativos
 * Define altura mínima, cor de fundo padrão e melhorias de responsividade
 */
.admin-candidates-page {
  min-height: 100vh;
  background: #fafafa;
}

/* Melhorias para telas muito pequenas */
@media (max-width: 300px) {
  .admin-candidates-page {
    padding: 0;
  }
}

/* Otimizações para tablets */
@media (min-width: 500px) and (max-width: 869px) {
  .admin-candidates-page {
    padding-top: 0.5rem;
  }
}
</style>