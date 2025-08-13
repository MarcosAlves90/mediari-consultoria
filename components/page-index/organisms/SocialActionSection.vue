<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useHomepageStyles } from '~/composables/useHomepageStyles';

const { t } = useI18n();
const {
    homepage__container,
    homepage__section_title,
    homepage__section_subtitle,
    homepage__section_description,
} = useHomepageStyles();

// Por enquanto apenas uma empresa, mas preparado para mais
const socialActions = [
    {
        id: 1,
        name: 'Empresa Exemplo',
        description: 'Descrição da ação social realizada para esta empresa, explicando os benefícios e impactos gerados.',
        image: '', // Deixando vazio para testar o placeholder
        imageAlt: 'Logo da Empresa Exemplo'
    }
];
</script>

<template>
    <section id="social-action-section"
        class="homepage__social-action w-full flex items-center justify-center bg-body-bg"
        role="region"
        aria-labelledby="social-action-heading"
        aria-describedby="social-action-description">
        <div :class="[homepage__container, 'homepage__social-action-container w-full max-w-85']">
            <p id="social-action-heading"
                class="homepage__section-subtitle"
                :class="homepage__section_subtitle">
                {{ t('socialAction.section_subtitle') }}
            </p>
            <h2 class="homepage__section-title"
                :class="homepage__section_title">
                {{ t('socialAction.section_title') }}
            </h2>
            <p id="social-action-description"
                class="homepage__section-description"
                :class="homepage__section_description">
                {{ t('socialAction.section_description') }}
            </p>

            <div class="homepage__social-action-list grid gap-1 mt-1 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                role="list"
                aria-label="Empresas beneficiadas por ações sociais">
                <div v-for="action in socialActions"
                    :key="action.id"
                    class="homepage__social-action-card relative flex flex-col items-center overflow-hidden rounded bg-body-bg p-1 transition-transform duration-200 ease-in-out hover:scale-105"
                    :class="action.image ? 'border-2 border-solid border-accent-color' : 'border-2 border-dashed border-gray-400'"
                    role="listitem"
                    :aria-labelledby="`action-title-${action.id}`"
                    :aria-describedby="`action-desc-${action.id}`">

                    <div class="homepage__social-action-card-image w-full aspect-video flex items-center justify-center bg-gray-100 rounded-sm mb-1 overflow-hidden">
                        <NuxtImg
                            v-if="action.image"
                            :src="action.image"
                            :alt="action.imageAlt"
                            :title="`${action.name} - Mediari Consultoria`"
                            class="w-full h-full object-contain object-center"
                            loading="lazy" />
                        <div v-else class="flex flex-col items-center justify-center text-gray-400 text-center">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>

                    <div class="homepage__social-action-card-content w-full text-center">
                        <h3 :id="`action-title-${action.id}`"
                            class="homepage__social-action-card-title text-xl font-medium text-accent-color mb-0.5">
                            {{ action.name }}
                        </h3>
                        <p :id="`action-desc-${action.id}`"
                            class="homepage__social-action-card-description text-sm text-secondary-text text-justify">
                            {{ action.description }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.homepage__social-action-card {
    min-height: 300px;
}

.homepage__social-action-card-image {
    background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
}
</style>
