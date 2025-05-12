<script setup lang="ts">
// 1. Imports
import { ref } from 'vue';
import ContactCard from '@/components/ContactCard.vue';
import { useContacts } from '@/composables/useContacts';

// 2. Composables
const { openPhoneDialer, openMailTo, openLinkInBrowser } = useContacts();

// 3. Refs e Dados Reativos
const heroTags = ref<string[]>(['Competência', 'Segurança', 'Experiência']);
const teamImages = ref<string[]>([
    '/funcionarios-em-destaque/fernanda-assis.webp',
    '/funcionarios-em-destaque/letícia-ferreira.webp',
    '/funcionarios-em-destaque/lucas-jesus.webp',
    '/funcionarios-em-destaque/millena-vieira.webp',
    '/funcionarios-em-destaque/mylena-barboza.webp',
    '/funcionarios-em-destaque/roberta-curcios.webp',
]);

// 4. Tipos/Interfaces
interface Service {
    icon: string;
    headingId: string;
    descId: string;
    title: string;
    description: string;
}

// 5. Dados Estáticos
const mainServices: Service[] = [
    {
        icon: 'my-icon:icon-direito-civil',
        headingId: 'civil-heading',
        descId: 'civil-description',
        title: 'Direito Civil',
        description: 'Resolvemos conflitos, indenizações e questões do dia a dia para sua segurança jurídica.',
    },
    {
        icon: 'my-icon:icon-direito-penal',
        headingId: 'penal-heading',
        descId: 'penal-description',
        title: 'Direito Penal',
        description: 'Defesa especializada em processos criminais, garantindo proteção em todas as etapas.',
    },
    {
        icon: 'my-icon:icon-contratos',
        headingId: 'contracts-heading',
        descId: 'contracts-description',
        title: 'Contratos',
        description: 'Elaboração e revisão de contratos para assegurar segurança e proteção jurídica.',
    },
    {
        icon: 'my-icon:icon-consultivo',
        headingId: 'consulting-heading',
        descId: 'consulting-description',
        title: 'Consultivo',
        description: 'Orientação jurídica estratégica para prevenir riscos e garantir conformidade legal.',
    },
];

const secondaryServices: Service[] = [
    {
        icon: 'my-icon:icon-direito-do-consumidor',
        headingId: 'consumer-heading',
        descId: 'consumer-description',
        title: 'Direito do Consumidor',
        description: 'Defendemos os direitos dos consumidores em diversas situações, como compras online, cobranças indevidas e defeitos em produtos ou serviços.',
    },
    {
        icon: 'my-icon:icon-direito-bancario',
        headingId: 'banking-heading',
        descId: 'banking-description',
        title: 'Direito Bancário',
        description: 'Prestamos assessoria jurídica para questões envolvendo bancos, contratos financeiros, cobranças abusivas e renegociação de dívidas. Proteja seus direitos com nosso suporte.',
    },
    {
        icon: 'my-icon:icon-direito-trabalhista',
        headingId: 'labor-heading',
        descId: 'labor-description',
        title: 'Direito Trabalhista',
        description: 'Atuamos na defesa de trabalhadores e empresas em disputas trabalhistas, rescisões contratuais, direitos previdenciários e demais questões ligadas ao ambiente de trabalho.',
    },
];

// 6. Funções Utilitárias
// Formata nome da imagem para exibição
const getNome = (img: string) => {
    const nome = img.split('/').pop()?.replace('.webp', '') || '';
    return nome.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};
// Animação shake para ícones
const triggerShake = (event: Event) => {
    const target = event.currentTarget as HTMLElement;
    if (target) {
        target.classList.add('shake-animation');
        setTimeout(() => {
            target.classList.remove('shake-animation');
        }, 700);
    }
};

// 7. Constantes de Classe/Estilo
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
                        class="homepage__hero-text-tags-tag flex min-w-12 items-center justify-center rounded-sm border-2 border-body-bg bg-body-bg-05 py-1 backdrop-blur-sm transition-transform duration-200 ease-in-out hover:scale-[1.1] max-lg:min-w-[20vw] max-lg:py-0.5 max-sm:min-w-[25vw]"
                        role="listitem">
                        <p class="m-0 text-body-bg text-base max-xl:text-[1.5vw] max-sm:text-[2.7vw]">{{ tag }}</p>
                    </div>
                </div>
                <h1 id="banner-heading"
                    class="m-0 text-[5.8rem] font-medium transition-all duration-200 ease-in-out max-xl:text-[7.75vw] max-sm:text-[8.4vw]">
                    EXCELÊNCIA JURÍDICA</h1>
                <h2
                    class="mt-[-2.5rem] text-[3.65rem] font-medium text-body-bg transition-all duration-200 ease-in-out max-xl:mt-[-2.9vw] max-xl:text-[4.9vw] max-sm:text-[5.34vw]">
                    PARA <span
                        class="relative top-[-0.15vw] font-scheherazade text-[4.11rem] font-bold text-accent-color transition-all duration-200 ease-in-out max-xl:text-[5.5vw] max-sm:text-[5.94vw] max-sm:top-[-0.20vw]">VOCÊ
                        E OS SEUS NEGÓCIOS</span></h2>
                <p id="banner-description"
                    class="homepage__hero-text-description mt-[-0.5rem] text-lg text-body-bg transition-all duration-200 ease-in-out max-xl:mt-[-0.5vw] max-xl:px-2 max-xl:text-[1.5vw] max-md:px-1 max-sm:text-[2.7vw]">
                    Atendimento especializado para
                    empresas e soluções
                    completas em demandas bancárias e do consumidor.</p>
            </div>
            <div class="homepage__hero-notch absolute left-1/2 -translate-x-1/2 bottom-0 w-30 h-[18px] bg-accent-color z-2 rounded-t-sm max-md:w-[50vw]"
                aria-hidden="true"></div>
            <div class="homepage__hero-gradient absolute top-0 left-0 right-0 bottom-0 opacity-60" aria-hidden="true">
            </div>
            <NuxtImg class="homepage__hero-image w-full h-full object-cover object-center opacity-25"
                src="/banner-background.webp" width="1920" height="1080"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" lazy format="webp"
                alt="Banner de fundo da página principal com elementos gráficos abstratos" />
        </section>
        <section id="services-section" class="homepage__services w-full flex items-center justify-center" role="region"
            aria-labelledby="services-heading" aria-describedby="services-description">
            <div :class="[homepage__container, 'homepage__services-container w-full max-w-85']">
                <h2 id="services-heading" class="homepage__section-subtitle" :class="homepage__section_subtitle">ÁREAS DE ATUAÇÃO
                </h2>
                <p class="homepage__section-title" :class="homepage__section_title">NOSSOS SERVIÇOS</p>
                <p id="services-description" class="homepage__section-description" :class="homepage__section_description">Nosso
                    corpo de profissionais atua em
                    diferentes áreas para proteger
                    os seus direitos ou da sua empresa.</p>
                <div class="homepage__services-list homepage__services-list--main grid gap-1 mt-1 grid-cols-4 max-870:grid-cols-2"
                    role="list" aria-label="Serviços principais">
                    <div v-for="service in mainServices" :key="service.headingId" :class="homepage__services_card" role="listitem"
                        :aria-labelledby="service.headingId" :aria-describedby="service.descId">
                        <Icon :class="homepage__services_card_icon" :name="service.icon" @click="triggerShake" aria-hidden="true" />
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
                        <Icon :class="homepage__services_card_icon" :name="service.icon" @click="triggerShake" aria-hidden="true" />
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
            <div
                :class="[homepage__container, 'homepage__company-content max-w-85 w-full gap-1 flex max-md:flex-col-reverse max-md:gap-1']">
                <div class="homepage__company-map min-w-[25.5rem] p-0 w-full max-xl:min-w-[25vw]" role="complementary"
                    aria-label="Mapa da localização da empresa">
                    <!-- Conteúdo para o lado esquerdo -->
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!4v1744196621406!6m8!1m7!1sEP5Wtm-s9EVnSAi5PEfDvw!2m2!1d-23.61476374919065!2d-46.56947893457005!3f56.22!4f9.540000000000006!5f0.7820865974627469"
                        style="border:0;" allowfullscreen="true" loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade" class="w-full h-full rounded-sm max-md:h-12"
                        title="Mapa interativo da localização da Mediari Consultoria"></iframe>
                </div>
                <div class="homepage__company-info flex flex-col p-0">
                    <!-- Conteúdo para o lado direito -->
                    <h2 id="enterprise-heading" class="homepage__section-subtitle" :class="homepage__section_subtitle">EMPRESA</h2>
                    <p class="homepage__section-title" :class="homepage__section_title">MEDIARI CONSULTORIA</p>
                    <p id="enterprise-description" class="homepage__section_description text-justify"
                        :class="homepage__section_description">
                        Somos uma empresa especializada
                        em assessoria e
                        consultoria
                        jurídica personalizada para pequenos e médios negócios, oferecendo elaboração de minutas,
                        pareceres
                        jurídicos, relatórios completos e suporte abrangente em questões trabalhistas. Para o grande
                        público, atuamos em demandas bancárias, como processos de busca e apreensão, bloqueios de contas
                        e
                        outras áreas do Direito do Consumidor. Contamos com uma equipe de mais de 60 colaboradores e
                        auxiliares jurídicos preparados para entregar o melhor atendimento a empresas e pessoas físicas.
                    </p>
                    <div class="homepage__company-info-location mt-0.5 gap-0.5 flex items-center justify-start text-secondary-text p-0"
                        role="group" aria-label="Informações de localização">
                        <Icon
                            class="homepage__company-info-location-map-icon cursor-pointer text-[2.5rem] transition-transform duration-200 ease-in-out hover:scale-[1.1] hover:rotate-[-10deg] max-500:!text-[4rem] max-xl:text-[2.5rem] max-md:text-[3rem]"
                            name="my-icon:icon-map"
                            @click="openLinkInBrowser('https://maps.app.goo.gl/8f6BACTToivurF4h9')"
                            aria-label="Abrir localização no Google Maps" />
                        <p class="homepage__section_description !m-0" :class="homepage__section_description">Estamos localizados na
                            <span class="font-medium">Rua Amazonas, 439 - Centro, São
                                Caetano do Sul, 09520070.</span>
                        </p>
                    </div>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d456.9641794996792!2d-46.56925480555049!3d-23.61460809533691!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5cee9ee117a1%3A0x17896a272eed7c60!2sR.%20Amazonas%2C%20439%20-%20Centro%2C%20S%C3%A3o%20Caetano%20do%20Sul%20-%20SP%2C%2009520-070!5e0!3m2!1spt-BR!2sbr!4v1744202283698!5m2!1spt-BR!2sbr"
                        style="border:0;" allowfullscreen="true" loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade" class="rounded-sm mt-1 h-15 max-xl:h-12"
                        title="Mapa detalhado da localização da Mediari Consultoria"></iframe>
                </div>
            </div>
        </section>
        <section id="seo-section" class="homepage__seo w-full flex justify-center items-center" role="region"
            aria-labelledby="seo-heading" aria-describedby="seo-description">
            <div
                :class="[homepage__container, 'homepage__seo-content max-w-85 w-full flex items-start justify-center gap-1 max-lg:flex-col-reverse']">
                <div
                    class="homepage__seo-image relative max-w-[18rem] self-center overflow-hidden rounded-t-sm transition-transform duration-200 ease-in-out hover:scale-105 max-xl:hover:scale-102 max-lg:max-h-25 max-sm:max-h-26 max-sm:w-full max-sm:max-w-none">
                    <NuxtImg src="/fundador/bruno-lima.webp" lazy format="webp" alt="Foto do sócio fundador Bruno Lima"
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
                    <h2 id="seo-heading" class="homepage__section-subtitle" :class="homepage__section_subtitle">FUNDADOR</h2>
                    <p class="homepage__section-title" :class="homepage__section_title">À FRENTE DA NOSSA VISÃO</p>
                    <p id="seo-description" class="homepage__section_description text-justify"
                        :class="homepage__section_description">
                        Com liderança estratégica e expertise em SEO, conduz nossa equipe rumo à inovação e excelência
                        nos resultados.
                    </p>
                </div>
            </div>
        </section>
        <section id="team-section" class="homepage__team w-full flex justify-center items-center bg-body-bg-dark"
            role="region" aria-labelledby="team-heading" aria-describedby="team-description">
            <div :class="[homepage__container, 'homepage__team-content max-w-85 w-full']">
                <h2 id="team-heading" class="homepage__section-subtitle" :class="homepage__section_subtitle">EQUIPE</h2>
                <p class="homepage__section-title" :class="homepage__section_title">NOSSOS DESTAQUES</p>
                <p id="team-description" class="homepage__section_description" :class="homepage__section_description">Com mais de
                    60 colaboradores e auxiliares
                    jurídicos, entregamos
                    excelência em todos os serviços.</p>
                <div class="homepage__team-list grid gap-1 mt-1 grid-cols-6 max-lg:grid-cols-4 max-sm:grid-cols-2"
                    role="list">
                    <div v-for="(img, idx) in teamImages" :key="idx"
                        class="homepage__team-card relative flex flex-col items-center overflow-hidden rounded-t-sm transition-transform duration-200 hover:scale-105">
                        <NuxtImg :src="img" lazy format="webp" :alt="`Foto do membro da equipe ${getNome(img)}`"
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
                <h2 id="contact-heading" class="homepage__section-subtitle" :class="homepage__section_subtitle">FALE CONOSCO</h2>
                <p class="homepage__section-title" :class="homepage__section_title">ENTRE EM CONTATO</p>
                <p id="contact-description" class="homepage__section_description" :class="homepage__section_description">Nos
                    contate através de nossas redes e
                    tenha os seus direitos protegidos.
                </p>
                <div class="homepage__contact-list mt-1 flex items-center justify-between gap-1 max-md:grid max-md:grid-cols-2"
                    role="list" aria-label="Opções de contato">
                    <ContactCard backgroundImage="/contact-prints/instagram.webp" iconImage="instagram"
                        buttonText="Fale pelo Instagram"
                        :buttonAction="() => openLinkInBrowser('https://www.instagram.com/mediari.consultoria')"
                        role="listitem" aria-label="Contato pelo Instagram" />
                    <ContactCard backgroundImage="/contact-prints/telefone.webp" iconImage="telefone"
                        buttonText="Ligue para Nós" :buttonAction="openPhoneDialer" role="listitem"
                        aria-label="Contato por telefone" />
                    <ContactCard backgroundImage="/contact-prints/gmail.webp" iconImage="gmail"
                        buttonText="Envie um E-mail" :buttonAction="openMailTo" role="listitem"
                        aria-label="Contato por e-mail" />
                    <ContactCard backgroundImage="/contact-prints/linkedin.webp" iconImage="linkedin"
                        buttonText="Conecte-se no LinkedIn"
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
        background: url('/card-background.webp') center / cover no-repeat;
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
    > * {
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