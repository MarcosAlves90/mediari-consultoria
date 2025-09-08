<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useHomepageStyles } from '~/composables/useHomepageStyles';

const { t } = useI18n();
const {
        homepage__container,
        homepage__section_title,
        homepage__section_subtitle,
        homepage__section_description,
} = useHomepageStyles();

// Tipos: mantemos separação entre os dados brutos (chaves de i18n)
// e o objeto final que a view consome (com textos já traduzidos).
interface SocialActionRaw {
    id: number;
    nameKey: string;
    descriptionKey: string;
    impactKey: string;
    categoryKey: string;
    icon: string;
}

interface SocialAction {
    id: number;
    name: string;
    description: string;
    impact: string;
    category: string;
    icon: string;
}

// Dados estáticos — apenas chaves de tradução e meta (icone/id).
const rawActions: SocialActionRaw[] = [
    { id: 1, nameKey: 'socialAction.actions.abrigo_irma_tereza.name', descriptionKey: 'socialAction.actions.abrigo_irma_tereza.description', impactKey: 'socialAction.actions.abrigo_irma_tereza.impact', categoryKey: 'socialAction.actions.abrigo_irma_tereza.category', icon: 'mdi:heart-plus-outline' },
    { id: 2, nameKey: 'socialAction.actions.instituto_tuh.name', descriptionKey: 'socialAction.actions.instituto_tuh.description', impactKey: 'socialAction.actions.instituto_tuh.impact', categoryKey: 'socialAction.actions.instituto_tuh.category', icon: 'mdi:food-outline' },
    { id: 3, nameKey: 'socialAction.actions.tragedia_rio_grande_sul.name', descriptionKey: 'socialAction.actions.tragedia_rio_grande_sul.description', impactKey: 'socialAction.actions.tragedia_rio_grande_sul.impact', categoryKey: 'socialAction.actions.tragedia_rio_grande_sul.category', icon: 'mdi:hand-heart-outline' },
    { id: 4, nameKey: 'socialAction.actions.casa_florescer.name', descriptionKey: 'socialAction.actions.casa_florescer.description', impactKey: 'socialAction.actions.casa_florescer.impact', categoryKey: 'socialAction.actions.casa_florescer.category', icon: 'mdi:home-heart' },
    { id: 5, nameKey: 'socialAction.actions.nucleo_menino_jesus.name', descriptionKey: 'socialAction.actions.nucleo_menino_jesus.description', impactKey: 'socialAction.actions.nucleo_menino_jesus.impact', categoryKey: 'socialAction.actions.nucleo_menino_jesus.category', icon: 'mdi:baby-face-outline' },
    { id: 6, nameKey: 'socialAction.actions.instituto_losurdo.name', descriptionKey: 'socialAction.actions.instituto_losurdo.description', impactKey: 'socialAction.actions.instituto_losurdo.impact', categoryKey: 'socialAction.actions.instituto_losurdo.category', icon: 'mdi:basket-fill' },
    { id: 7, nameKey: 'socialAction.actions.instituto_borboleta_azul.name', descriptionKey: 'socialAction.actions.instituto_borboleta_azul.description', impactKey: 'socialAction.actions.instituto_borboleta_azul.impact', categoryKey: 'socialAction.actions.instituto_borboleta_azul.category', icon: 'mdi:palette-outline' },
    { id: 8, nameKey: 'socialAction.actions.projeto_social_abencoe.name', descriptionKey: 'socialAction.actions.projeto_social_abencoe.description', impactKey: 'socialAction.actions.projeto_social_abencoe.impact', categoryKey: 'socialAction.actions.projeto_social_abencoe.category', icon: 'mdi:gift-outline' }
];

// Computed: resolve as traduções dinamicamente — mantém reatividade quando o idioma muda.
const socialActions = computed<SocialAction[]>(() =>
    rawActions.map((a) => ({
        id: a.id,
        name: t(a.nameKey),
        description: t(a.descriptionKey),
        impact: t(a.impactKey),
        category: t(a.categoryKey),
        icon: a.icon,
    }))
);
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

            <div class="homepage__social-action-list grid gap-1 mt-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                role="list"
                aria-label="Doações sociais realizadas pela Mediari">
                <div v-for="action in socialActions"
                    :key="action.id"
                    class="homepage__social-action-card group relative flex flex-col items-center overflow-hidden rounded-sm bg-accent-color p-1 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
                    role="listitem"
                    :aria-labelledby="`action-title-${action.id}`"
                    :aria-describedby="`action-desc-${action.id}`">

                    <!-- Background decoration -->
                    <div class="homepage__social-action-card-bg absolute inset-0 bg-gradient-to-br from-accent-color to-accent-dark-color opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <!-- Content -->
                    <div class="homepage__social-action-card-content relative z-10 w-full text-center text-body-bg">
                        <!-- Icon -->
                        <div class="homepage__social-action-card-icon-wrapper mb-0.5 flex justify-center">
                            <Icon
                                :name="action.icon"
                                class="homepage__social-action-card-icon text-3xl transition-transform duration-300 group-hover:scale-110"
                            />
                        </div>

                        <!-- Category badge -->
                        <div class="homepage__social-action-card-category mb-0.5">
                            <span class="inline-block px-1.5 py-0.25 bg-body-bg-2 text-body-bg/50 text-xs font-medium rounded-sm">
                                {{ action.category }}
                            </span>
                        </div>

                        <!-- Title -->
                        <h3 :id="`action-title-${action.id}`"
                            class="homepage__social-action-card-title text-base font-bold mb-0.5 leading-tight">
                            {{ action.name }}
                        </h3>

                        <!-- Description -->
                        <p :id="`action-desc-${action.id}`"
                            class="homepage__social-action-card-description text-xs mb-1 leading-relaxed opacity-90">
                            {{ action.description }}
                        </p>

                        <!-- Impact -->
                        <div class="homepage__social-action-card-impact mt-auto">
                            <div class="flex items-center justify-center gap-1 pt-1 border-t border-body-bg-25">
                                <Icon name="mdi:trending-up" class="text-xs opacity-80" />
                                <span class="text-xs font-semibold tracking-wide">{{ action.impact }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Hover effect overlay -->
                    <div class="homepage__social-action-card-overlay absolute inset-0 bg-body-bg opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
                </div>
            </div>

        </div>
    </section>
</template>

<style scoped>
/* Base card styles */
.homepage__social-action-card {
    min-height: 220px;
    position: relative;
    background: linear-gradient(135deg, var(--color-accent-color), var(--color-accent-dark-color));
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1.0);
    animation: slideInUp 0.6s ease-out backwards;
}

.homepage__social-action-card:nth-child(even) {
    background: linear-gradient(135deg, var(--color-accent-dark-color), var(--color-accent-color));
}

.homepage__social-action-card:nth-child(1) { animation-delay: 0.1s; }
.homepage__social-action-card:nth-child(2) { animation-delay: 0.2s; }
.homepage__social-action-card:nth-child(3) { animation-delay: 0.3s; }
.homepage__social-action-card:nth-child(4) { animation-delay: 0.4s; }
.homepage__social-action-card:nth-child(5) { animation-delay: 0.5s; }
.homepage__social-action-card:nth-child(6) { animation-delay: 0.6s; }
.homepage__social-action-card:nth-child(7) { animation-delay: 0.7s; }
.homepage__social-action-card:nth-child(8) { animation-delay: 0.8s; }

/* Hover effects */
.homepage__social-action-card:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
    transform: translateY(-6px) scale(1.02);
}

.homepage__social-action-card:hover .homepage__social-action-card-icon {
    animation: iconBounce 0.6s ease-in-out;
    color: var(--color-body-bg);
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

/* Content layout */
.homepage__social-action-card-content {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.homepage__social-action-card-category span {
    backdrop-filter: blur(10px);
}

.homepage__social-action-card-impact {
    margin-top: auto;
    border-top: 1px solid rgba(255, 255, 255, 0.25);
}

/* Shine effect */
.homepage__social-action-card::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        110deg,
        transparent 0%,
        transparent 40%,
        rgba(255, 255, 255, 0.12) 45%,
        rgba(255, 255, 255, 0.25) 50%,
        rgba(255, 255, 255, 0.12) 55%,
        transparent 60%,
        transparent 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    z-index: 10;
    border-radius: inherit;
}

.homepage__social-action-card:hover::after {
    opacity: 1;
    animation: professionalShine 1.2s cubic-bezier(0.25, 0.1, 0.25, 1.0) 0.2s;
}

/* Reflection effect */
.homepage__social-action-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.08) 0%,
        rgba(255, 255, 255, 0.02) 50%,
        transparent 100%
    );
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 5;
    border-radius: inherit;
    border-bottom-left-radius: 50% 100%;
    border-bottom-right-radius: 50% 100%;
}

.homepage__social-action-card:hover::before {
    opacity: 1;
}

/* Animations */
@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes iconBounce {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.2);
    }
}

@keyframes professionalShine {
    0% {
        left: -100%;
        opacity: 0;
    }
    1% {
        opacity: 1;
    }
    100% {
        left: 100%;
        opacity: 0;
    }
}

/* Media queries */
@media (max-width: 1024px) {
    .homepage__social-action-card {
        min-height: 200px;
    }
}

@media (max-width: 768px) {
    .homepage__social-action-card {
        min-height: 180px;
    }

    .homepage__social-action-card-title {
        font-size: 0.9rem;
    }

    .homepage__social-action-card-description {
        font-size: 0.75rem;
    }
}

@media (max-width: 480px) {
    .homepage__social-action-card {
        min-height: 160px;
    }

    .homepage__social-action-card:hover {
        transform: translateY(-2px) scale(1.01);
    }
}
</style>
