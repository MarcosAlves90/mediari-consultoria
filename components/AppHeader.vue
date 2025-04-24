<script lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

export default defineComponent({
    setup() {
        const hamburguerMenuOpen = ref(false);
        const screenWidth = useScreenWidth();
        const scrollToSection = useScrollToSection();
        const isNavbarSmall = ref(false);
        const { openPhoneDialer } = useContacts();
        const { goTo } = useGoTo();

        const handleNavClick = (id: string) => {
            scrollToSection(id);
            hamburguerMenuOpen.value = false;
        };

        const handleScroll = () => {
            isNavbarSmall.value = window.scrollY > 200;
        };

        const toggleHamburguerMenu = () => {
            hamburguerMenuOpen.value = !hamburguerMenuOpen.value;
        };

        onMounted(() => {
            window.addEventListener('scroll', handleScroll);
        });

        onUnmounted(() => {
            window.removeEventListener('scroll', handleScroll);
        });

        return {
            hamburguerMenuOpen,
            toggleHamburguerMenu,
            screenWidth,
            isNavbarSmall,
            goTo,
            openPhoneDialer,
            handleNavClick,
        };
    },
});
</script>

<template>
    <header class="app-header" :class="{ 'app-header--small': isNavbarSmall }">
        <div class="app-header__top">
            <a class="app-header__top-link" href="mailto:contato@mediari.com.br">
                <Icon class="app-header__top-link-icon" name="mdi:email-outline" />
                <p v-if="screenWidth > 610">contato@mediari.com.br</p>
            </a>
            <a class="app-header__top-link" href="https://www.instagram.com/mediari.consultoria" target="_blank"
                rel="noopener noreferrer">
                <Icon class="app-header__top-link-icon" name="mdi:instagram" />
                <p v-if="screenWidth > 610">@mediari.consultoria</p>
            </a>
            <a class="app-header__top-link" href="https://www.linkedin.com/company/mediari-consultoria-empresarial-ltda"
                target="_blank" rel="noopener noreferrer">
                <Icon class="app-header__top-link-icon" name="mdi:linkedin" />
                <p v-if="screenWidth > 610">Mediari Consultoria</p>
            </a>
            <a v-if="screenWidth <= 1325" class="app-header__top-link" href="tel:+551142273008">
                <Icon class="app-header__top-link-icon" name="mdi:phone-outline" />
                <p v-if="screenWidth > 610">11 4227-3008</p>
            </a>
        </div>
        <div class="app-header__bottom">
            <div class="app-header__group">
                <div class="app-header__logo-box" @click="goTo('/')">
                    <Icon class="app-header__logo-box-icon" name="my-icon:mediari-logo" />
                    <Icon class="app-header__logo-box-text" name="my-icon:mediari-logo-texto" />
                </div>
                <nav class="app-header__nav app-header__nav--desktop" v-if="screenWidth > 1105">
                    <a href="#" @click.prevent="handleNavClick('banner-section')">Início</a>
                    <a href="#" @click.prevent="handleNavClick('services-section')">Áreas de Atuação</a>
                    <a href="#" @click.prevent="handleNavClick('enterprise-section')">Empresa</a>
                    <a href="#" @click.prevent="handleNavClick('team-section')">Equipe</a>
                    <a href="#" @click.prevent="handleNavClick('contact-section')">Fale conosco</a>
                    <button v-if="screenWidth > 1325" class="app-header__nav-button common-button"
                        @click.prevent="openPhoneDialer">
                        <Icon class="app-header__nav-button-icon" name="mdi:phone-outline" />11 4227-3008
                    </button>
                </nav>
                <button v-if="screenWidth <= 1105" class="app-header__hamburguer-menu common-button"
                    :class="{ 'app-header__hamburguer-menu--open': hamburguerMenuOpen }" @click="toggleHamburguerMenu">
                    <Transition name="icon-morph" mode="out-in">
                        <Icon v-if="!hamburguerMenuOpen" class="app-header__hamburguer-menu-icon" name="mdi:menu"
                            key="menu" />
                        <Icon v-else class="app-header__hamburguer-menu-icon" name="mdi:close" key="close" />
                    </Transition>
                </button>
            </div>
        </div>
        <nav class="app-header__nav app-header__nav--mobile"
            :class="{ 'app-header__nav--closed': !hamburguerMenuOpen }" v-show="screenWidth <= 1105">
            <a href="#" @click.prevent="handleNavClick('banner-section')">Início</a>
            <a href="#" @click.prevent="handleNavClick('services-section')">Áreas de Atuação</a>
            <a href="#" @click.prevent="handleNavClick('enterprise-section')">Empresa</a>
            <a href="#" @click.prevent="handleNavClick('team-section')">Equipe</a>
            <a href="#" @click.prevent="handleNavClick('contact-section')">Fale conosco</a>
        </nav>
    </header>
</template>

<style lang="scss" scoped>
@use "@/assets/css/mixins.scss" as *;

.app-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    border-bottom: 2px solid transparent;
    transition: border-color 0.2s ease-in-out;

    &__top {
        background-color: $accent-color;
        color: $accent-text-color;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        min-height: 54px;
        transition: min-height 0.2s ease-in-out;

        &-link {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 15px;
            text-decoration: none;
            color: $accent-text-color;
            cursor: pointer;
            border-radius: 5px;
            transition: background-color 0.2s ease-in-out;

            &-icon {
                font-size: 2em;
                transition: font-size 0.2s ease-in-out;
            }

            p {
                margin: 0;
                transition: font-size 0.2s ease-in-out;
            }

            &:hover {
                background-color: $accent-text-color-20;
            }
        }

        @include respond-to(tablet) {
            min-height: 40px;

            &-link-icon {
                font-size: 1.5em;
            }

            &-link p {
                font-size: 10px;
            }
        }

        @include respond-to(mobile) {
            justify-content: space-evenly;
        }
    }

    &__bottom {
        background-color: $body-background-67;
        backdrop-filter: blur(5px);
        transition: backdrop-filter 0.2s ease-in-out;

    }

    &__group {
        max-width: 80rem;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 18px;
        gap: 3.5rem;
        padding: 1.1rem 4rem;
        @media (max-width: 1300px) {
            gap: 5vw;
        }
        // Definição do padding do header
        @include respond-to(desktop) {
            padding: 1.1rem 2rem;
        }
        @include respond-to(tablet) {
            justify-content: space-between;
            flex-wrap: wrap;
        }
        @include respond-to(mobile) {
            padding: 1rem;
        }
    }

    &__logo-box {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        color: $accent-color;
        cursor: pointer;

        &-icon {
            font-size: 4.2em;
            transition: font-size 0.2s ease-in-out;

            @include respond-to(mobile) {
                font-size: 3.5em;
            }
        }

        &-text {
            font-size: 2.5em;
            transition: font-size 0.2s ease-in-out;

            @include respond-to(mobile) {
                font-size: 2.2em;
            }

            @media (max-width: 450px) {
                font-size: 2.2em;
            }

            @media (max-width: 365px) {
                display: none;
            }
        }
    }

    &__nav {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2.8rem;
        transition: font-size 0.2s ease-in-out;

        a {
            position: relative;
            text-decoration: none;
            color: $primary-text;
        }

        &--desktop {
            a {
                &::after {
                    content: '';
                    position: absolute;
                    bottom: -3px;
                    left: 50%;
                    width: 0;
                    height: 2px;
                    background-color: $accent-color;
                    transform: translateX(-50%);
                    transition: width 0.2s ease-in-out;
                }

                &:hover::after {
                    width: 100%;
                }
            }

            @include respond-to(tablet) {

                a::after,
                a::after:hover {
                    all: unset;
                }
            }
        }

        &--mobile {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            overflow: hidden;
            max-height: 0;
            opacity: 0;
            flex-direction: column;
            background-color: $body-background-67;
            border-top: 2px solid $accent-color;
            border-bottom: 2px solid $accent-color;
            backdrop-filter: blur(5px);
            gap: 1rem;
            padding: 1rem;
            transition: max-height 0.2s ease-in-out, opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;

            a {
                border: 2px solid $accent-color;
                border-radius: 5px;
                padding: 0.5rem 1rem;
                width: 100%;
                box-sizing: border-box;
                text-align: center;
                transition: opacity 0.2s ease-in-out, font-size 0.2s ease-in-out, background-color 0.2s ease-in-out;

                &:hover {
                    background-color: $accent-color-20;
                }
            }
        }

        &--closed {
            max-height: 0;
            opacity: 0;
            visibility: hidden;
        }

        &:not(.app-header__nav--closed) {
            max-height: 500px;
            opacity: 1;
            visibility: visible;
        }
    }

    &__nav-button {
        font-size: inherit;

        &-icon {
            font-size: 1.3em;
        }
    }

    &__hamburguer-menu {
        font-size: 1.5em;

        &-icon {
            width: 30px;
            aspect-ratio: 1 / 1;
            transition: font-size 0.2s ease-in-out;
        }

        &--open {
            background-color: $accent-color-20;

            &:hover {
                background-color: unset;
            }
        }
    }
}

.app-header--small {
    border-color: $accent-color;

    .app-header__bottom {
        backdrop-filter: blur(10px);
    }

    .app-header__logo-box-icon {
        font-size: 3.2em;
    }

    .app-header__logo-box-text {
        font-size: 2em;
    }

    .app-header__nav {
        font-size: 15px;
    }

    .app-header__hamburguer-menu,
    .app-header__nav-button {
        min-height: 45px;
        min-width: 45px;
    }

    @media (min-width: 851px) {
        .app-header__top {
            height: 0;
            min-height: 12px;

            &-link-icon {
                font-size: 0;
            }

            &-link p {
                font-size: 0;
            }
        }
    }
}

.icon-fade-scale-enter-active,
.icon-fade-scale-leave-active {
    transition: opacity 0.25s, transform 0.25s;
}

.icon-fade-scale-enter-from,
.icon-fade-scale-leave-to {
    opacity: 0;
    transform: scale(0.7) rotate(-90deg);
}

.icon-fade-scale-enter-to,
.icon-fade-scale-leave-from {
    opacity: 1;
    transform: scale(1) rotate(0deg);
}

.icon-morph-enter-active,
.icon-morph-leave-active {
    transition: opacity 0.25s, filter 0.25s, border-radius 0.25s, transform 0.25s;
}

.icon-morph-enter-from,
.icon-morph-leave-to {
    opacity: 0;
    filter: blur(6px);
    border-radius: 50%;
    transform: scale(0.7) rotate(-90deg);
}

.icon-morph-enter-to,
.icon-morph-leave-from {
    opacity: 1;
    filter: blur(0);
    border-radius: 0;
    transform: scale(1) rotate(0deg);
}
</style>