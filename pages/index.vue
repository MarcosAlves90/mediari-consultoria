<script lang="ts">
import '@splidejs/splide/css/sea-green';
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import ContactCard from '@/components/ContactCard.vue';
export default defineComponent({
    components: {
        Splide,
        SplideSlide,
        ContactCard
    },
    setup() {
        const { openPhoneDialer, openMailTo } = useContacts();
        const openLinkInBrowser = (link: string) => {
            window.open(link, '_blank', 'noopener');
        }
        const screenWidth = useScreenWidth();

        const triggerShake = (event: Event) => {
            const target = event.currentTarget as HTMLElement;
            if (target) {
                target.classList.add('shake-animation');
                setTimeout(() => {
                    target.classList.remove('shake-animation');
                }, 700);
            }
        };

        return {
            triggerShake,
            openLinkInBrowser,
            openPhoneDialer,
            openMailTo,
            screenWidth
        };
    }
})
</script>

<template>
    <main class="homepage">
        <section class="homepage__hero" role="banner" aria-labelledby="banner-heading"
            aria-describedby="banner-description">
            <div class="homepage__hero-text" aria-label="Texto do banner principal">
                <div class="homepage__hero-text-tags" role="list" aria-label="Características principais">
                    <div class="homepage__hero-text-tags-tag" role="listitem">
                        <p>Competência</p>
                    </div>
                    <div class="homepage__hero-text-tags-tag" role="listitem">
                        <p>Segurança</p>
                    </div>
                    <div class="homepage__hero-text-tags-tag" role="listitem">
                        <p>Experiência</p>
                    </div>
                </div>
                <h1 id="banner-heading">EXCELÊNCIA JURÍDICA</h1>
                <h2>PARA <span>VOCÊ E OS SEUS NEGÓCIOS</span></h2>
                <p id="banner-description" class="homepage__hero-text-description">Atendimento especializado para
                    empresas e soluções
                    completas em demandas bancárias e do consumidor.</p>
            </div>
            <div class="homepage__hero-notch" aria-hidden="true"></div>
            <div class="homepage__hero-gradient" aria-hidden="true"></div>
            <NuxtImg class="homepage__hero-image" src="/banner-background.jpg" width="1920" height="1080"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" lazy format="webp"
                alt="Banner de fundo da página principal com elementos gráficos abstratos" />
        </section>
        <section class="homepage__services" role="region" aria-labelledby="services-heading"
            aria-describedby="services-description">
            <div class="homepage__services-container">
                <h2 id="services-heading" class="homepage__section-subtitle">ÁREAS DE ATUAÇÃO</h2>
                <h1 class="homepage__section-title">NOSSOS SERVIÇOS</h1>
                <p id="services-description" class="homepage__section-description">Nosso corpo de profissionais atua em
                    diferentes áreas para proteger
                    os seus direitos ou da sua empresa.</p>
                <div class="homepage__services-list homepage__services-list--main" role="list"
                    aria-label="Serviços principais">
                    <div class="homepage__service-card" role="listitem" aria-labelledby="civil-heading"
                        aria-describedby="civil-description">
                        <Icon class="homepage__service-card-icon" name="my-icon:icon-direito-civil"
                            @click="triggerShake" aria-hidden="true" />
                        <h1 id="civil-heading" class="homepage__service-card-title">Direito Civil</h1>
                        <p id="civil-description" class="homepage__service-card-description">Resolvemos conflitos,
                            indenizações e questões do dia a dia para
                            sua segurança jurídica.</p>
                    </div>
                    <div class="homepage__service-card" role="listitem" aria-labelledby="penal-heading"
                        aria-describedby="penal-description">
                        <Icon class="homepage__service-card-icon" name="my-icon:icon-direito-penal"
                            @click="triggerShake" aria-hidden="true" />
                        <h1 id="penal-heading" class="homepage__service-card-title">Direito Penal</h1>
                        <p id="penal-description" class="homepage__service-card-description">Defesa especializada em
                            processos criminais, garantindo proteção em todas as
                            etapas.</p>
                    </div>
                    <div class="homepage__service-card" role="listitem" aria-labelledby="contracts-heading"
                        aria-describedby="contracts-description">
                        <Icon class="homepage__service-card-icon" name="my-icon:icon-contratos" @click="triggerShake"
                            aria-hidden="true" />
                        <h1 id="contracts-heading" class="homepage__service-card-title">Contratos</h1>
                        <p id="contracts-description" class="homepage__service-card-description">Elaboração e revisão de
                            contratos para assegurar segurança e
                            proteção jurídica.</p>
                    </div>
                    <div class="homepage__service-card" role="listitem" aria-labelledby="consulting-heading"
                        aria-describedby="consulting-description">
                        <Icon class="homepage__service-card-icon" name="my-icon:icon-consultivo" @click="triggerShake"
                            aria-hidden="true" />
                        <h1 id="consulting-heading" class="homepage__service-card-title">Consultivo</h1>
                        <p id="consulting-description" class="homepage__service-card-description">Orientação jurídica
                            estratégica para prevenir riscos e garantir
                            conformidade legal.</p>
                    </div>
                </div>
                <div class="homepage__services-list homepage__services-list--secondary" role="list"
                    aria-label="Outros serviços">
                    <div class="homepage__service-card" role="listitem" aria-labelledby="consumer-heading"
                        aria-describedby="consumer-description">
                        <Icon class="homepage__service-card-icon" name="my-icon:icon-direito-do-consumidor"
                            @click="triggerShake" aria-hidden="true" />
                        <h1 id="consumer-heading" class="homepage__service-card-title">Direito do Consumidor</h1>
                        <p id="consumer-description" class="homepage__service-card-description">Defendemos os direitos
                            dos consumidores em diversas situações,
                            como compras online, cobranças
                            indevidas e defeitos em produtos ou serviços.</p>
                    </div>
                    <div class="homepage__service-card" role="listitem" aria-labelledby="banking-heading"
                        aria-describedby="banking-description">
                        <Icon class="homepage__service-card-icon" name="my-icon:icon-direito-bancario"
                            @click="triggerShake" aria-hidden="true" />
                        <h1 id="banking-heading" class="homepage__service-card-title">Direito Bancário</h1>
                        <p id="banking-description" class="homepage__service-card-description">Prestamos assessoria
                            jurídica para questões envolvendo bancos,
                            contratos financeiros,
                            cobranças abusivas e renegociação de dívidas. Proteja seus direitos com nosso suporte.</p>
                    </div>
                    <div class="homepage__service-card" role="listitem" aria-labelledby="labor-heading"
                        aria-describedby="labor-description">
                        <Icon class="homepage__service-card-icon" name="my-icon:icon-direito-trabalhista"
                            @click="triggerShake" aria-hidden="true" />
                        <h1 id="labor-heading" class="homepage__service-card-title">Direito Trabalhista</h1>
                        <p id="labor-description" class="homepage__service-card-description">Atuamos na defesa de
                            trabalhadores e empresas em disputas
                            trabalhistas, rescisões
                            contratuais, direitos previdenciários e demais questões ligadas ao ambiente de trabalho.</p>
                    </div>
                </div>
            </div>
        </section>
        <section class="homepage__company homepage__company--gray-bg" role="region" aria-labelledby="enterprise-heading"
            aria-describedby="enterprise-description">
            <div class="homepage__company-content">
                <div class="homepage__company-map" role="complementary" aria-label="Mapa da localização da empresa">
                    <!-- Conteúdo para o lado esquerdo -->
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!4v1744196621406!6m8!1m7!1sEP5Wtm-s9EVnSAi5PEfDvw!2m2!1d-23.61476374919065!2d-46.56947893457005!3f56.22!4f9.540000000000006!5f0.7820865974627469"
                        style="border:0;" allowfullscreen="true" loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                        title="Mapa interativo da localização da Mediari Consultoria"></iframe>
                </div>
                <div class="homepage__company-info">
                    <!-- Conteúdo para o lado direito -->
                    <h2 id="enterprise-heading" class="homepage__section-subtitle">EMPRESA</h2>
                    <h1 class="homepage__section-title">MEDIARI CONSULTORIA</h1>
                    <p id="enterprise-description" class="homepage__section-description">Somos uma empresa especializada
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
                    <div class="homepage__company-info-location" role="group" aria-label="Informações de localização">
                        <Icon class="homepage__company-info-location-map-icon" name="my-icon:icon-map"
                            @click="openLinkInBrowser('https://maps.app.goo.gl/8f6BACTToivurF4h9')"
                            aria-label="Abrir localização no Google Maps" />
                        <p class="homepage__section-description">Estamos localizados na <span>Rua Amazonas, 439 -
                                Centro, São
                                Caetano do Sul, 09520070.</span></p>
                    </div>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d456.9641794996792!2d-46.56925480555049!3d-23.61460809533691!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5cee9ee117a1%3A0x17896a272eed7c60!2sR.%20Amazonas%2C%20439%20-%20Centro%2C%20S%C3%A3o%20Caetano%20do%20Sul%20-%20SP%2C%2009520-070!5e0!3m2!1spt-BR!2sbr!4v1744202283698!5m2!1spt-BR!2sbr"
                        style="border:0;" allowfullscreen="true" loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                        title="Mapa detalhado da localização da Mediari Consultoria"></iframe>
                </div>
            </div>
        </section>
        <section class="homepage__team" role="region" aria-labelledby="team-heading"
            aria-describedby="team-description">
            <div class="homepage__team-content">
                <h2 id="team-heading" class="homepage__section-subtitle">EQUIPE</h2>
                <h1 class="homepage__section-title">NOSSOS DESTAQUES</h1>
                <p id="team-description" class="homepage__section-description">Com mais de 60 colaboradores e auxiliares
                    jurídicos, entregamos
                    excelência em todos os serviços.</p>
                <Splide class="homepage__team-carousel" :options="{
                    type: 'loop',
                    perPage: screenWidth > 850 ? 4 : screenWidth > 610 ? 3 : screenWidth > 500 ? 2 : 1,
                    perMove: 1,
                    updateOnMove: true,
                    pagination: true,
                    gap: '1rem',
                }" aria-label="Destaques da equipe">
                    <SplideSlide>
                        <NuxtImg src="/favicon.png" lazy format="webp"
                            alt="Imagem representativa de um membro da equipe" />
                    </SplideSlide>
                    <SplideSlide>
                        <NuxtImg src="/favicon.png" lazy format="webp"
                            alt="Imagem representativa de um membro da equipe" />
                    </SplideSlide>
                </Splide>
            </div>
        </section>
        <section class="homepage__contact homepage__contact--gray-bg" role="region" aria-labelledby="contact-heading"
            aria-describedby="contact-description">
            <div class="homepage__contact-content">
                <h2 id="contact-heading" class="homepage__section-subtitle">FALE CONOSCO</h2>
                <h1 class="homepage__section-title">ENTRE EM CONTATO</h1>
                <p id="contact-description" class="homepage__section-description">Nos contate através de nossas redes e
                    tenha os seus direitos protegidos.
                </p>
                <div class="homepage__contact-list" role="list" aria-label="Opções de contato">
                    <ContactCard backgroundImage="/contact-prints/instagram.png" iconImage="instagram"
                        buttonText="Fale pelo Instagram"
                        :buttonAction="() => openLinkInBrowser('https://www.instagram.com/mediari.consultoria')"
                        role="listitem" aria-label="Contato pelo Instagram" />
                    <ContactCard backgroundImage="/contact-prints/telefone.png" iconImage="telefone"
                        buttonText="Ligue para Nós" :buttonAction="openPhoneDialer" role="listitem"
                        aria-label="Contato por telefone" />
                    <ContactCard backgroundImage="/contact-prints/gmail.png" iconImage="gmail"
                        buttonText="Envie um E-mail" :buttonAction="openMailTo" role="listitem"
                        aria-label="Contato por e-mail" />
                    <ContactCard backgroundImage="/contact-prints/linkedin.png" iconImage="linkedin"
                        buttonText="Conecte-se no LinkedIn"
                        :buttonAction="() => openLinkInBrowser('https://www.linkedin.com/company/mediari-consultoria-empresarial-ltda')"
                        role="listitem" aria-label="Contato pelo LinkedIn" />
                </div>
            </div>
        </section>
    </main>
</template>

<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";

@mixin responsive-font($tablet, $mobile) {
    @media (max-width: 1200px) {
        font-size: $tablet;
    }

    @media (max-width: 850px) {
        font-size: $mobile;
    }
}

@mixin responsive-margin($tablet, $mobile) {
    @media (max-width: 1200px) {
        margin-top: $tablet;
    }

    @media (max-width: 850px) {
        margin-top: $mobile;
    }
}

$font-large: 105.1px;
$font-medium: 64.5px;
$font-small: 20.3px;

$mobile-font-large: 8.27vw;
$mobile-font-medium: 5.5vw;
$mobile-font-small: 3vw;

$margin-h2-desktop: -9.5rem;
$margin-h2-tablet: -6.2rem;
$margin-h2-mobile: -11vw;

$margin-p-desktop: -5rem;
$margin-p-tablet: -3.5rem;
$margin-p-mobile: -5.5vw;

.homepage {
    &__hero {
        width: 100%;
        height: 60rem;
        position: relative;
        border-bottom: 12px solid $accent-color;

        &-text {
            margin-top: 3.1rem;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 3;
            color: $body-background;
            width: 100%;
            text-align: center;

            &-tags {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1.7rem;

                &-tag {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid $body-background;
                    background-color: $body-background-5;
                    height: 2rem;
                    padding: 0.4rem 0.9rem;
                    border-radius: 5px;
                    min-width: 9rem;
                    backdrop-filter: blur(5px);
                    transition: transform 0.2s ease-in-out;

                    p {
                        color: $body-background;
                        margin: 0;
                        font-size: 20px;
                    }

                    &:hover {
                        transform: scale(1.1);
                    }
                }

                @media (max-width: 1200px) {
                    gap: 1.3rem;

                    &-tag {
                        padding: 0.2rem 0.45rem;
                        min-width: 7.5rem;

                        p {
                            font-size: 15px;
                        }
                    }
                }

                @media (max-width: 850px) {
                    gap: 2.5vw;

                    &-tag {
                        padding: 0.8vw 2.5vw;
                        min-width: 15vw;

                        p {
                            font-size: 2.52vw;
                        }
                    }
                }
            }

            &-description {
                color: inherit;
                font-size: $font-small;
                margin-top: $margin-p-desktop;
                @include responsive-margin($margin-p-tablet, $margin-p-mobile);
                @include responsive-font(0.855rem, 2.52vw);

                @media (max-width: 850px) {
                    padding: 0 4vw;
                }
            }

            h1,
            h2,
            span,
            &-description {
                transition: font-size 0.2s ease-in-out, margin-top 0.2s ease-in-out;
            }

            h1 {
                font-weight: 500;
                margin-top: 0.5rem;
                font-size: $font-large;
                @include responsive-font(71px, $mobile-font-large);
            }

            h2 {
                font-weight: 500;
                font-size: $font-medium;
                margin-top: $margin-h2-desktop;
                @include responsive-margin($margin-h2-tablet, $margin-h2-mobile);
                @include responsive-font(46px, $mobile-font-medium);

                span {
                    font-weight: 700;
                    color: $accent-color;
                    font-family: "Scheherazade New", sans-serif;
                    font-size: 75px;
                    position: relative;
                    top: -2px;
                    @include responsive-font(50px, 5.8vw);
                }
            }
        }

        &-notch {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: 0;
            width: 30rem;
            height: 18px;
            background-color: $accent-color;
            border-radius: 5px 5px 0 0;
            z-index: 2;

            @media (max-width: 750px) {
                width: 60vw;
            }

            @media (max-width: 610px) {
                width: 50vw;
            }
        }

        &-gradient {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            opacity: 0.6;
            background: linear-gradient(180deg, $accent-color 60%, $secondary-text 100%);
        }

        &-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            opacity: 0.25;
        }

        @include respond-to(tablet) {
            height: 50rem;
        }
    }

    &__services {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        &.homepage__company--gray-bg {
            background-color: $body-background-dark;
        }

        &-container {
            width: 100%;
            max-width: 80rem;
            padding: 4.5rem 2rem;
        }
    }

    &__services-list {
        display: grid;
        gap: 1.5rem;
        margin-top: 1.5rem;

        &--main {
            grid-template-columns: repeat(4, 1fr);
        }

        &--secondary {
            grid-template-columns: repeat(3, 1fr);
        }
        
        @include respond-to(tablet) {
            gap: 1rem;

            &--main {
                grid-template-columns: repeat(2, 1fr);
            }

            &--secondary {
                grid-template-columns: repeat(1, 1fr);
            }
        }
    }

    &__service-card {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 0;
        box-sizing: border-box;
        height: 100%;
        width: 100%;
        border: 2px solid $accent-color;
        border-radius: 5px;
        padding: 1rem;
        transition: box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out;
        overflow: hidden;
        position: relative;

        &-icon {
            font-size: 6.2rem;
            cursor: pointer;

            @media (max-width: 1200px) {
                font-size: 4rem;
            }
        }

        &-title {
            font-size: 24px;
            font-weight: 500;
            color: $accent-color;
            text-align: center;
            margin: 0.5rem 0 0;

            @media (max-width: 1200px) {
                font-size: 18px;
            }
        }

        &-description {
            margin: 0;
            text-align: justify;
            font-size: 15px;
            transition: color 0.2s ease-in-out;

            @media (max-width: 1200px) {
                font-size: 12px;
            }
        }

        &:hover {
            transform: scale(1.05);

            .homepage__service-card-description {
                color: $accent-color;
            }
        }

        &::before {
            content: '';
            position: absolute;
            inset: 0;
            background: url('/card-background.png') center / cover no-repeat;
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

    &__company {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        &.homepage__company--gray-bg {
            background-color: $body-background-dark;
        }

        &-content {
            width: 100%;
            max-width: 80rem;
            padding: 4.5rem 2rem;
            display: flex;
            gap: 2rem;
            @include respond-to(tablet) {
                flex-direction: column-reverse;
                gap: 1rem;
            }
        }

        &-map {
            min-width: 25.5rem;
            padding: 0;
            width: 100%;

            iframe {
                border-radius: 5px;
                width: 100%;
                height: 100%;
                @include respond-to(tablet) {
                    height: 12rem;
                }
            }

            @media (max-width: 1200px) {
                min-width: 25vw;
            }

        }

        &-info {
            display: flex;
            flex-direction: column;
            padding: 0;

            &-location {
                margin-top: 1rem;
                gap: 0.5rem;
                display: flex;
                align-items: center;
                justify-content: start;
                color: $secondary-text;
                padding: 0;

                p span {
                    font-weight: 600;
                }

                &-map-icon {
                    cursor: pointer;
                    font-size: 3.5rem;
                    transition: transform 0.2s ease-in-out;

                    &:hover {
                        transform: scale(1.1) rotate(-10deg);
                    }

                    @media (max-width: 1200px) {
                        font-size: 2.5rem;
                    }

                    @include respond-to(tablet) {
                        font-size: 4rem;
                    }
                }
            }

            iframe {
                border-radius: 5px;
                margin-top: 1rem;
                height: 15rem;

                @media (max-width: 1200px) {
                    height: 12rem;
                }
            }
        }

    }

    &__team {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        &-content {
            width: 100%;
            max-width: 80rem;
            padding: 4.5rem 2rem;
        }

        &-carousel {
            margin-top: 1.5rem;
            padding-top: 0;
            padding-bottom: 0;

            img {
                width: 100%;
                height: 100%;
            }
        }

        ::v-deep(.splide__arrow) {
            border: 2px solid $accent-color;
            border-radius: 5px;
            height: 3.5rem;
            width: 2.5rem;
            transition: background-color 0.2s ease-in-out;

            svg {
                fill: $accent-color;
                width: 1rem;
            }

            &:hover {
                background-color: $accent-color-20;
            }
        }

        ::v-deep(.splide__arrow--prev) {
            left: -1px;
        }

        ::v-deep(.splide__arrow--next) {
            right: -1px;
        }

        ::v-deep(.splide__pagination) {
            bottom: unset;
        }
        ::v-deep(.splide__pagination__page) {
            background: $body-background-dark;
            border: 2px solid $accent-color;
            border-radius: 5px;
            width: 18px;
            height: 18px;
        }
        ::v-deep(.splide__pagination__page.is-active) {
            background: $accent-color;
            border-color: $accent-color;
        }

        @include respond-to(tablet) {
            ::v-deep(.splide__arrow) {
                height: 3rem;
                width: 2rem;

                svg {
                    width: 0.8rem;
                }
            }
            ::v-deep(.splide__arrow--prev) {
                left: 1%;
            }

            ::v-deep(.splide__arrow--next) {
                right: 1%;
            }
        }
    }

    &__contact {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        &.homepage__contact--gray-bg {
            background-color: $body-background-dark;
        }

        &-content {
            width: 100%;
            max-width: 80rem;
            padding: 4.5rem 2rem;
        }

        &-list {
            margin-top: 1.5rem;
            display: flex;
            gap: 2rem;
            justify-content: space-between;
            align-items: center;
            @include respond-to(tablet) {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
            }
        }
    }

    &__section-title {
        font-size: 60px;
        font-weight: 400;
        text-align: start;
        margin: -1.5rem 0 0 0;

        @include respond-to(desktop) {
            font-size: 38px;
            margin: -1rem 0 0 0;
        }

        @include respond-to(mobile) {
            font-size: 28px;
        }
    }

    &__section-subtitle {
        font-size: 24px;
        color: $accent-color;
        font-weight: 600;
        font-family: "Scheherazade New", sans-serif;
        margin: 0;

        @include respond-to(desktop) {
            font-size: 18px;
        }
    }

    &__section-description {
        font-size: 20px;
        text-align: justify;
        margin: 0;

        @include respond-to(desktop) {
            font-size: 15px;
        }
    }

    .shake-animation {
        animation: shake 0.7s ease-in-out;
    }
}

@include respond-to(desktop) {

    .homepage__services-container,
    .homepage__company-content,
    .homepage__team-content,
    .homepage__contact-content {
        padding: 3.5rem 1rem;
    }
}

p {
    color: $secondary-text;
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