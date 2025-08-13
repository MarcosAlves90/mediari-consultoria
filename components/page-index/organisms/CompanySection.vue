<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useContacts } from '~/utils/useContacts';
import { useHomepageStyles } from '~/composables/useHomepageStyles';
import { useMap } from '~/composables/useMap';

const { t } = useI18n();
const { openLinkInBrowser } = useContacts();
const {
    homepage__container,
    homepage__section_title,
    homepage__section_subtitle,
    homepage__section_description,
} = useHomepageStyles();

// Inicializa o mapa automaticamente no onMounted
useMap();
</script>

<template>
    <section id="enterprise-section"
        class="homepage__company homepage__company--gray-bg w-full flex justify-center items-center bg-body-bg-dark"
        role="region" aria-labelledby="enterprise-heading" aria-describedby="enterprise-description">
        <div :class="[homepage__container, 'homepage__company-content items-stretch max-w-85 w-full gap-1 flex max-lg:flex-col-reverse max-md:gap-1']">
            <div
                class="homepage__company-img-wrapper min-w-18 max-w-18 flex-1 basis-0 min-h-0 flex-shrink-0 overflow-hidden rounded-t-sm transition-transform duration-200 ease-in-out hover:scale-105 max-xl:min-h-18 max-xl:w-full max-xl:max-w-none max-xl:hover:scale-102 max-lg:max-h-25 max-md:min-h-13">
                <NuxtImg src="/predio-439_jd1vig_gjatw0.webp"
                    sizes="xl:100vw lg:80vw md:60vw"
                    provider="cloudinary" title="Prédio onde está localizado o escritório da Mediari Consultoria"
                    alt="Foto do prédio onde está localizado o escritório da Mediari Consultoria" preload fit="cropping" :modifiers="{ gravity: 'south' }"
                    @click="openLinkInBrowser('https://www.google.com/maps/@-23.6147637,-46.5694789,0a,22.3y,65.04h,95.74t/data=!3m4!1e1!3m2!1sEP5Wtm-s9EVnSAi5PEfDvw!2e0?source=apiv3')"
                    class="cursor-pointer w-full h-full object-cover max-xl:object-bottom" />
            </div>
            <div class="homepage__company-info flex flex-col p-0">
                <p id="enterprise-heading" class="homepage__section-subtitle" :class="homepage__section_subtitle">
                    {{ t('enterprise.section_subtitle') }}</p>
                <h2 class="homepage__section-title" :class="homepage__section_title">MEDIARI CONSULTORIA</h2>
                <p id="enterprise-description" class="homepage__section_description text-justify"
                    :class="homepage__section_description">
                    {{ t('enterprise.description') }}
                </p>
                <div class="homepage__company-info-location mt-0.5 gap-0.5 flex items-center justify-start text-secondary-text p-0"
                    role="group" aria-label="Informações de localização">
                    <Icon
                        class="homepage__company-info-location-map-icon cursor-pointer text-[2.5rem] transition-transform duration-200 ease-in-out hover:scale-[1.1] hover:rotate-[-10deg] max-500:!text-[4rem] max-xl:text-[2.5rem] max-md:text-[3rem]"
                        name="my-icon:icon-map"
                        @click="openLinkInBrowser('https://maps.app.goo.gl/8f6BACTToivurF4h9')"
                        aria-label="Abrir localização no Google Maps" />
                    <p class="homepage__section_description !m-0" :class="homepage__section_description">
                        {{ t('enterprise.location', { address: '' }) }}<span class="font-medium">Rua Amazonas, 439 -
                            Centro, São Caetano do Sul, 09520070</span>.
                    </p>
                </div>
                <div id="map" class="z-1 rounded-sm mt-1 min-h-13"></div>
            </div>
        </div>
    </section>
</template>
