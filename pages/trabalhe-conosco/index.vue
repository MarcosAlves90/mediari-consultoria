<script setup lang="ts">
/**
 * @fileoverview Página de Carreiras - Componente principal que gerencia o fluxo de aplicação para vagas
 * @description Esta página controla o fluxo completo de candidatura, incluindo formulário de aplicação,
 * teste de perfil e tela de conclusão. Utiliza sessionStorage para persistir o estado entre navegações.
 *
 * @author Mediari Consultoria
 * @version 1.0.0
 */

import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useSessionStorage } from "~/composables/useSessionStorage";
import {
    CareersHero,
    JobApplicationForm,
    ProfileTest,
    CompletionScreen
} from "~/components/page-trabalhe-conosco";

// Composable para internacionalização
const { t } = useI18n();

/**
 * Configuração de meta tags SEO para otimização em mecanismos de busca
 * Define título, descrição e imagem de compartilhamento social
 */
useSeoMeta({
    title: `${t("careers.page_title")} - Mediari Consultoria`,
    description: t("careers.section_description"),
    ogTitle: `${t("careers.section_title")} - Mediari Consultoria`,
    ogDescription: t("careers.section_description"),
    ogImage: "/mediari-logo.svg",
});

/**
 * Interface para definir a estrutura do estado persistido
 */
interface PersistedState {
    /** Etapa atual do processo de candidatura */
    currentStep: 'form' | 'test' | 'completed';
    /** Indica se deve exibir mensagem de sucesso */
    showSuccess: boolean;
}

/**
 * Configuração do sessionStorage para manter o estado do processo de candidatura
 * Permite que o usuário continue de onde parou mesmo após recarregar a página
 */
const [persistedState, setPersistedState, clearPersistedState] = useSessionStorage<PersistedState>(
    'mediari-careers-state',
    {
        currentStep: 'form',
        showSuccess: false
    }
);

/**
 * Estado reativo para controle da etapa atual do processo
 * Inicializado com o valor persistido no sessionStorage
 */
const currentStep = ref<'form' | 'test' | 'completed'>(persistedState.value.currentStep);

/**
 * Estado reativo para controle da exibição de mensagem de sucesso
 * Inicializado com o valor persistido no sessionStorage
 */
const showSuccess = ref(persistedState.value.showSuccess);

/**
 * Watcher para sincronizar automaticamente as mudanças de estado com o sessionStorage
 * Sempre que currentStep ou showSuccess mudarem, o estado será persistido
 */
watch(
    () => ({
        currentStep: currentStep.value,
        showSuccess: showSuccess.value
    }),
    (newState) => {
        setPersistedState(newState);
    },
    { deep: true }
);

/**
 * Computed property que retorna o título do hero baseado na etapa atual
 * @returns {string} Título traduzido para a etapa atual
 */
const heroTitle = computed(() => {
    switch (currentStep.value) {
        case 'test':
            return t("careers.profile_test.title");
        case 'completed':
            return t("careers.profile_test.completion_title");
        default:
            return t("careers.section_title");
    }
});

/**
 * Computed property que retorna o subtítulo do hero baseado na etapa atual
 * @returns {string} Subtítulo traduzido para a etapa atual
 */
const heroSubtitle = computed(() => {
    switch (currentStep.value) {
        case 'test':
            return t("careers.profile_test.subtitle");
        default:
            return t("careers.section_subtitle");
    }
});

/**
 * Computed property que retorna a descrição do hero baseado na etapa atual
 * @returns {string} Descrição traduzida para a etapa atual
 */
const heroDescription = computed(() => {
    switch (currentStep.value) {
        case 'test':
            return t("careers.profile_test.description");
        default:
            return t("careers.section_description");
    }
});

/**
 * Handler executado quando o formulário de candidatura é submetido com sucesso
 * Avança para a etapa do teste de perfil
 */
const onFormSubmitted = (): void => {
    showSuccess.value = true;
    currentStep.value = 'test';
};

/**
 * Handler executado quando o teste de perfil é completado
 * Avança para a tela de conclusão e limpa todos os dados persistidos
 */
const onTestCompleted = (): void => {
    currentStep.value = 'completed';
    clearAllPersistedData();
};

/**
 * Função utilitária para limpar todos os dados persistidos do processo
 * Chamada quando o usuário completa todo o fluxo de candidatura
 */
const clearAllPersistedData = (): void => {
    clearPersistedState();
    // Nota: Os dados específicos do formulário e teste serão limpos pelos próprios composables
};

/**
 * Classes CSS para o container principal
 * Responsivo com diferentes paddings para diferentes breakpoints
 */
const container_classes = "py-4.5 px-4 max-lg:py-3.5 max-xl:px-2 max-md:py-2 max-md:px-1";

/**
 * Classes CSS específicas para o container do teste de perfil
 * Aplicada apenas quando na etapa 'test'
 */
const profile_container = "max-w-70 w-full";
</script>

<template>
    <!-- Container principal da página de carreiras -->
    <main class="careers-page">
        <!-- Seção Hero - Cabeçalho com título, subtítulo e descrição dinâmicos -->
        <CareersHero
            :title="heroTitle"
            :subtitle="heroSubtitle"
            :description="heroDescription"
        />

        <!-- Seção do conteúdo principal - Container para os componentes do fluxo -->
        <section
            class="careers__form w-full flex justify-center items-center bg-body-bg-dark"
            role="region"
            aria-labelledby="form-heading"
        >
            <div
                :class="[
                    container_classes,
                    currentStep === 'test' ? profile_container : 'careers__form-content max-w-70 w-full',
                ]"
            >
                <!--
                    Formulário de Candidatura
                    Exibido na etapa inicial do processo
                -->
                <JobApplicationForm
                    v-if="currentStep === 'form'"
                    :show-success="showSuccess"
                    @submitted="onFormSubmitted"
                />

                <!--
                    Teste de Perfil
                    Exibido após o envio bem-sucedido do formulário
                -->
                <ProfileTest
                    v-else-if="currentStep === 'test'"
                    @completed="onTestCompleted"
                />

                <!--
                    Tela de Conclusão
                    Exibida quando todo o processo é finalizado
                -->
                <CompletionScreen v-else-if="currentStep === 'completed'" />
            </div>
        </section>
    </main>
</template>

<style scoped>
/**
 * Estilos específicos do componente
 * Garante que a página ocupe pelo menos a altura completa da viewport
 */
.careers-page {
    min-height: 100vh;
}
</style>
