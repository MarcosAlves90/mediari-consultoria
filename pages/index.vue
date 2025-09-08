<script setup lang="ts">

import { ref, onMounted } from 'vue';
import ContactCard from '@/components/molecules/ContactCard.vue';
import { useContacts } from '@/utils/useContacts';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

if (import.meta.client) {
    const L = await import('leaflet');
    await import('leaflet/dist/leaflet.css');

    const redIcon = new L.Icon({
        iconUrl: 'https://res.cloudinary.com/dawhjravc/image/upload/marker-icon-2x-red_tpormo_vyst4k.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    onMounted(() => {
        const map = L.map('map').setView([-23.61460809533691, -46.56925480555049], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/way/1184265877" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker([-23.61460809533691, -46.56925480555049],{icon: redIcon}).addTo(map)
            .bindPopup('Edifício Monumental, Rua Amazonas, 439 - Centro, São Caetano do Sul, SP')
            .openPopup();
    });
}

const { openPhoneDialer, openMailTo, openLinkInBrowser } = useContacts();

const heroTags = ref<string[]>([
    t('banner.tags.0'),
    t('banner.tags.1'),
    t('banner.tags.2'),
]);

const teamImages = ref<string[]>([
    'fernanda-assis_sqa0ag_didohw.webp',
    'lucas-jesus_svwujc_fwxeqy.webp',
    'millena-vieira_kbs5vt_lzhvnu.webp',
    'mylena-barboza_ermcjh_rq4laa.webp',
    'roberta-curcio_nokbvj_pyym69.webp',
    'ingrid-pacheco_uuazeo_usy5vx.webp'
]);

interface Service {
    icon: string;
    headingId: string;
    descId: string;
    title: string;
    description: string;
}

const mainServices: Service[] = [
    {
        icon: 'my-icon:icon-direito-civil',
        headingId: 'civil-heading',
        descId: 'civil-description',
        title: t('services.main.0.title'),
        description: t('services.main.0.description'),
    },
    {
        icon: 'my-icon:icon-direito-penal',
        headingId: 'penal-heading',
        descId: 'penal-description',
        title: t('services.main.1.title'),
        description: t('services.main.1.description'),
    },
    {
        icon: 'my-icon:icon-contratos',
        headingId: 'contracts-heading',
        descId: 'contracts-description',
        title: t('services.main.2.title'),
        description: t('services.main.2.description'),
    },
    {
        icon: 'my-icon:icon-consultivo',
        headingId: 'consulting-heading',
        descId: 'consulting-description',
        title: t('services.main.3.title'),
        description: t('services.main.3.description'),
    },
];

const secondaryServices: Service[] = [
    {
        icon: 'my-icon:icon-direito-do-consumidor',
        headingId: 'consumer-heading',
        descId: 'consumer-description',
        title: t('services.secondary.0.title'),
        description: t('services.secondary.0.description'),
    },
    {
        icon: 'my-icon:icon-direito-bancario',
        headingId: 'banking-heading',
        descId: 'banking-description',
        title: t('services.secondary.1.title'),
        description: t('services.secondary.1.description'),
    },
    {
        icon: 'my-icon:icon-direito-trabalhista',
        headingId: 'labor-heading',
        descId: 'labor-description',
        title: t('services.secondary.2.title'),
        description: t('services.secondary.2.description'),
    },
];

const getNome = (img: string): string => {
    const fileName = img.split('/').pop();
    if (!fileName) return 'Nome Desconhecido';

    const namePart = fileName.split('_')[0];
    if (!namePart) return 'Nome Desconhecido';

    const cleanedName = namePart.replace('.webp', '');
    return cleanedName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};


const triggerShake = (event: Event) => {
    const target = event.currentTarget as HTMLElement;
    if (target) {
        target.classList.add('shake-animation');
        setTimeout(() => {
            target.classList.remove('shake-animation');
        }, 700);
    }
};

const breakLinesByDot = (text: string): string =>
    text
        ? text
            .trim()
            .replace(/\.(\s|$)/g, (match, p1, offset, str) =>
                offset + match.length < str.length ? '.<br><br>' : '.'
            )
        : '';

const homepage__section_title = 'text-4xl text-primary-text max-md:text-center max-md:text-2xl';
const homepage__section_subtitle = 'font-scheherazade text-xl font-bold text-accent-color max-md:text-center max-md:text-lg';
const homepage__section_description = 'mt-0.5 text-base text-secondary-text max-md:text-justify max-md:text-sm';
const homepage__services_card = 'homepage__services-card relative m-0 box-border flex h-full w-full flex-col items-center justify-start overflow-hidden rounded-sm border-2 border-accent-color p-1 hover:scale-[1.05] transition-transform duration-200 ease-in-out';
const homepage__services_card_icon = 'homepage__services-card-icon cursor-pointer text-[4rem] max-870:text-[3rem]';
const homepage__services_card_title = 'homepage__services-card-title mt-0.5 text-center text-xl font-medium text-accent-color max-xl:text-lg';
const homepage__services_card_description = 'homepage__services-card-description mt-0.5 text-justify text-sm text-secondary-text max-xl:text-xs';
const homepage__container = 'py-4.5 px-4 max-lg:py-3.5 max-xl:px-2 max-md:py-2 max-md:px-1';
</script>

<template>
    <main class="homepage">
        <section id="banner-section"
            class="homepage__hero relative h-[95vh] w-full border-b-12 border-accent-color max-lg:h-[80vh]"
            role="banner" aria-labelledby="banner-heading" aria-describedby="banner-description">
            <div class="homepage__hero-text absolute top-1/2 left-1/2 z-3 mt-[54px] w-full -translate-x-1/2 -translate-y-1/2 text-center text-body-bg"
                aria-label="Texto do banner principal">
                <div class="homepage__hero-text-tags mb-2 flex items-center justify-center gap-4 max-lg:gap-[4.5vw]"
                    role="list" aria-label="Características principais">
                    <div v-for="(tag, idx) in heroTags" :key="idx"
                        class="homepage__hero-text-tags-tag cursor-pointer flex min-w-12 items-center justify-center rounded-sm border-2 border-body-bg bg-body-bg-05 py-1 backdrop-blur-sm transition-transform duration-200 ease-in-out hover:scale-[1.1] max-lg:min-w-[20vw] max-lg:py-0.5 max-sm:min-w-[25vw]"
                        role="listitem">
                        <p class="m-0 text-body-bg text-base max-xl:text-[1.5vw] max-sm:text-[2.7vw]">{{ tag }}</p>
                    </div>
                </div>
                <h1 id="banner-heading"
                    class="m-0 text-[5.8rem] font-medium transition-all duration-200 ease-in-out max-xl:text-[7.75vw] max-sm:text-[8.4vw]">
                    {{ t('banner.main_title') }}</h1>
                <p
                    class="mt-[-2.5rem] text-[3.65rem] font-medium text-body-bg transition-all duration-200 ease-in-out max-xl:mt-[-2.9vw] max-xl:text-[4.9vw] max-sm:text-[5.34vw]">
                    {{ t('banner.subtitle-1') }}<span
                        class="relative top-[-0.15vw] font-scheherazade text-[4.11rem] font-bold text-accent-color transition-all duration-200 ease-in-out max-xl:text-[5.5vw] max-sm:text-[5.94vw] max-sm:top-[-0.20vw]">{{
                            t('banner.subtitle-2') }}</span></p>
                <p id="banner-description"
                    class="homepage__hero-text-description mt-[-0.5rem] text-lg text-body-bg transition-all duration-200 ease-in-out max-xl:mt-[-0.5vw] max-xl:px-2 max-xl:text-[1.5vw] max-md:px-1 max-sm:text-[2.7vw]">
                    {{ t('banner.description') }}
                </p>
            </div>
            <div class="homepage__hero-notch absolute left-1/2 -translate-x-1/2 bottom-0 w-30 h-[18px] bg-accent-color z-2 rounded-t-sm max-md:w-[50vw]"
                aria-hidden="true"></div>
            <div class="homepage__hero-gradient absolute top-0 left-0 right-0 bottom-0 opacity-60" aria-hidden="true">
            </div>
            <NuxtImg class="homepage__hero-image w-full h-full object-cover object-center opacity-25"
                src="/banner-background_acqeef_rgmwey.webp" provider="cloudinary" width="1920" height="1080"
                sizes="xl:100vw lg:80vw" preload fit="cropping"
                alt="Banner de fundo da página principal com elementos gráficos abstratos" />
        </section>
        <section id="services-section" class="homepage__services w-full flex items-center justify-center" role="region"
            aria-labelledby="services-heading" aria-describedby="services-description">
            <div :class="[homepage__container, 'homepage__services-container w-full max-w-85']">
                <p id="services-heading" class="homepage__section-subtitle" :class="homepage__section_subtitle">{{
                    t('services.section_subtitle') }}
                </p>
                <h2 class="homepage__section-title" :class="homepage__section_title">{{ t('services.section_title') }}
                </h2>
                <p id="services-description" class="homepage__section-description"
                    :class="homepage__section_description">{{ t('services.section_description') }}</p>
                <div class="homepage__services-list homepage__services-list--main grid gap-1 mt-1 grid-cols-4 max-870:grid-cols-2"
                    role="list" aria-label="Serviços principais">
                    <div v-for="service in mainServices" :key="service.headingId" :class="homepage__services_card"
                        role="listitem" :aria-labelledby="service.headingId" :aria-describedby="service.descId">
                        <Icon :class="homepage__services_card_icon" :name="service.icon" @click="triggerShake"
                            aria-hidden="true" />
                        <p :id="service.headingId" :class="homepage__services_card_title">
                            {{ service.title }}</p>
                        <p :id="service.descId" :class="homepage__services_card_description">
                            {{ service.description }}</p>
                    </div>
                </div>
                <div class="homepage__services-list homepage__services-list--secondary grid gap-1 mt-1 grid-cols-3 max-870:grid-cols-1"
                    role="list" aria-label="Outros serviços">
                    <div v-for="service in secondaryServices" :key="service.headingId" :class="homepage__services_card"
                        role="listitem" :aria-labelledby="service.headingId" :aria-describedby="service.descId">
                        <Icon :class="homepage__services_card_icon" :name="service.icon" @click="triggerShake"
                            aria-hidden="true" />
                        <p :id="service.headingId" :class="homepage__services_card_title">
                            {{ service.title }}</p>
                        <p :id="service.descId" :class="homepage__services_card_description">
                            {{ service.description }}</p>
                    </div>
                </div>
            </div>
        </section>
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
        <section id="seo-section" class="homepage__seo w-full flex justify-center items-center" role="region"
            aria-labelledby="seo-heading" aria-describedby="seo-description">
            <div
                :class="[homepage__container, 'homepage__seo-content max-w-85 w-full flex items-start justify-center gap-1 max-lg:flex-col-reverse']">
                <div
                    class="homepage__seo-image relative max-w-[18rem] min-w-[14rem] min-h-[18rem] flex-shrink-0 self-center overflow-hidden rounded-t-sm transition-transform duration-200 ease-in-out hover:scale-105 max-xl:hover:scale-102 max-lg:max-h-25 max-sm:max-h-26 max-sm:w-full max-sm:max-w-none">
                    <NuxtImg src="bruno-lima_ughibo_widbcw.webp" provider="cloudinary" loading="lazy"
                        alt="Foto do sócio fundador Bruno Lima" title="Bruno Lima - Mediari Consultoria"
                        class="w-full h-full" />
                    <div class="homepage__team-carousel-gradient absolute top-0 left-0 right-0 bottom-0 mix-blend-multiply bg-accent-color-2"
                        aria-hidden="true" />
                    <div
                        class="homepage__team-carousel-text absolute bottom-0 left-1/2 z-2 w-4/5 -translate-x-1/2 rounded-t-sm bg-accent-color-7 text-center backdrop-blur-xs max-md:w-[90%]">
                        <p class="text-sm text-body-bg my-1">Bruno Lima</p>
                    </div>
                </div>
                <div
                    class="homepage__seo-info flex flex-col items-start justify-start max-md:items-center max-md:justify-center">
                    <p id="seo-heading" class="homepage__section-subtitle" :class="homepage__section_subtitle">
                        {{ t('ceo.section_subtitle') }}
                    </p>
                    <h2 class="homepage__section-title" :class="homepage__section_title">{{ t('ceo.section_title') }}
                    </h2>
                    <blockquote
                        class="homepage__seo-quote italic w-full text-secondary-text text-lg my-0.5 bg-body-bg-dark p-1 max-md:text-center max-md:text-base">
                        {{ t('ceo.quote') }}
                    </blockquote>
                    <p id="seo-description" class="homepage__section_description text-justify"
                        :class="homepage__section_description" v-html="breakLinesByDot(t('ceo.description'))">
                    </p>
                </div>
            </div>
        </section>
        <section id="team-section" class="homepage__team w-full flex justify-center items-center bg-body-bg-dark"
            role="region" aria-labelledby="team-heading" aria-describedby="team-description">
            <div :class="[homepage__container, 'homepage__team-content max-w-85 w-full']">
                <p id="team-heading" class="homepage__section-subtitle" :class="homepage__section_subtitle">
                    {{ t('team.section_subtitle') }}</p>
                <h2 class="homepage__section-title" :class="homepage__section_title">{{ t('team.section_title') }}</h2>
                <p id="team-description" class="homepage__section_description" :class="homepage__section_description">
                    {{ t('team.description') }}
                </p>
                <div class="homepage__team-list grid gap-0.5 mt-1 grid-cols-6 max-xl:grid-cols-4 max-lg:grid-cols-3 max-sm:grid-cols-2"
                    role="list">
                    <div v-for="(img, idx) in teamImages" :key="idx"
                        class="homepage__team-card relative flex flex-col items-center overflow-hidden rounded-t-sm transition-transform duration-200 lg:hover:scale-105 aspect-[3/4.5]"
                        role="listitem">
                        <NuxtImg :src="img" loading="lazy" provider="cloudinary"
                            :alt="`Foto do membro da equipe ${getNome(img)}`"
                            :title="`${getNome(img)} - Mediari Consultoria`"
                            class="w-full h-full object-cover object-top" />
                        <div class="homepage__team-carousel-gradient absolute top-0 left-0 right-0 bottom-0 mix-blend-multiply bg-accent-color-2"
                            aria-hidden="true" />
                        <div
                            class="homepage__team-carousel-text absolute bottom-0 left-1/2 z-2 w-4/5 -translate-x-1/2 rounded-t-sm bg-accent-color-7 text-center backdrop-blur-xs max-md:w-[90%]">
                            <p class="text-sm text-body-bg my-1">{{ getNome(img) }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section id="contact-section"
            class="homepage__contact homepage__contact--gray-bg w-full flex justify-center items-center" role="region"
            aria-labelledby="contact-heading" aria-describedby="contact-description">
            <div :class="[homepage__container, 'homepage__contact-content max-w-85 w-full']">
                <p id="contact-heading" class="homepage__section-subtitle" :class="homepage__section_subtitle">
                    {{ t('contact.section_subtitle') }}
                </p>
                <h2 class="homepage__section-title" :class="homepage__section_title">{{ t('contact.section_title') }}
                </h2>
                <p id="contact-description" class="homepage__section_description"
                    :class="homepage__section_description">
                    {{ t('contact.description') }}
                </p>
                <div class="homepage__contact-list mt-1 flex items-center justify-between gap-0.5 max-md:grid max-md:grid-cols-2"
                    role="list" aria-label="Opções de contato">
                    <ContactCard backgroundImage="instagram_g4nm4d_vkd5ws.webp" iconImage="instagram"
                        :buttonText="t('contact.instagram')"
                        :buttonAction="() => openLinkInBrowser('https://www.instagram.com/mediari.consultoria')"
                        role="listitem" aria-label="Contato pelo Instagram" />

                    <ContactCard backgroundImage="telefone_bluhgk_p8rms9.webp" iconImage="telefone"
                        :buttonText="t('contact.phone')" :buttonAction="openPhoneDialer" role="listitem"
                        aria-label="Contato por telefone" />

                    <ContactCard backgroundImage="gmail_itiiyf_qn4gk0.webp" iconImage="gmail" :buttonText="t('contact.email')"
                        :buttonAction="openMailTo" role="listitem" aria-label="Contato por e-mail" />

                    <ContactCard backgroundImage="linkedin_jbmidd_faecil.webp" iconImage="linkedin"
                        :buttonText="t('contact.linkedin')"
                        :buttonAction="() => openLinkInBrowser('https://www.linkedin.com/company/mediari-consultoria-empresarial-ltda')"
                        role="listitem" aria-label="Contato pelo LinkedIn" />
                </div>
            </div>
        </section>
    </main>
</template>

<style scoped>
.homepage__hero-gradient {
    background: linear-gradient(180deg, var(--color-accent-color) 60%, var(--color-secondary-text) 100%);
}

.homepage__services-card {
    &:hover .homepage__services-card-description {
        color: var(--color-accent-color);
    }

    position: relative;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: url('https://res.cloudinary.com/dawhjravc/image/upload/card-background_jp4akg_rbjplo.webp') center / cover no-repeat;
        filter: blur(5px) brightness(0.7);
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
        z-index: 0;
        pointer-events: none;
    }

    &:hover::before {
        opacity: 0.2;
        transform: scale(1.1);
    }

    >* {
        position: relative;
        z-index: 1;
    }
}

.shake-animation {
    animation: shake 0.7s ease-in-out;
}

@keyframes shake {
    0% {
        transform: translateX(0);
    }

    20% {
        transform: translateX(-10px);
    }

    40% {
        transform: translateX(10px);
    }

    60% {
        transform: translateX(-10px);
    }

    80% {
        transform: translateX(10px);
    }

    100% {
        transform: translateX(0);
    }
}
</style>