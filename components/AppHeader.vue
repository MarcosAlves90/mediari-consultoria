<script lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

export default defineComponent({
    setup() {
        const hamburguerMenuOpen = ref(false);
        const screenWidth = ref(0);
        const isNavbarSmall = ref(false);

        const updateScreenWidth = () => {
            screenWidth.value = window.innerWidth;
        };

        const handleScroll = () => {
            isNavbarSmall.value = window.scrollY > 200; // Adiciona a classe se o scroll for maior que 50px
        };

        const openPhoneDialer = () => {
            window.location.href = 'tel:+551142273008';
        };

        onMounted(() => {
            updateScreenWidth();
            window.addEventListener('resize', updateScreenWidth);
            window.addEventListener('scroll', handleScroll); // Adiciona o listener de scroll
        });

        onUnmounted(() => {
            window.removeEventListener('resize', updateScreenWidth);
            window.removeEventListener('scroll', handleScroll); // Remove o listener de scroll
        });

        const toggleHamburguerMenu = () => {
            hamburguerMenuOpen.value = !hamburguerMenuOpen.value;
        };

        return {
            hamburguerMenuOpen,
            toggleHamburguerMenu,
            screenWidth,
            openPhoneDialer,
            isNavbarSmall,
        };
    },
});
</script>

<template>
    <header class="navbar" :class="{small: isNavbarSmall}">
        <div class="navbar-top">
            <a class="navbar-top-link" href="mailto:contato@mediari.com.br">
                <Icon class="navbar-top-link-icon" name="mdi:email-outline" />
                <p v-if="screenWidth > 750">contato@mediari.com.br</p>
            </a>
            <a class="navbar-top-link" href="https://www.instagram.com/mediari.consultoria" target="_blank"
                rel="noopener noreferrer">
                <Icon class="navbar-top-link-icon" name="mdi:instagram" />
                <p v-if="screenWidth > 750">@mediari.consultoria</p>
            </a>
            <a class="navbar-top-link" href="https://www.linkedin.com/company/mediari-consultoria-empresarial-ltda"
                target="_blank" rel="noopener noreferrer">
                <Icon class="navbar-top-link-icon" name="mdi:linkedin" />
                <p v-if="screenWidth > 750">Mediari Consultoria Empresarial LTDA</p>
            </a>
            <a v-if="screenWidth <= 1300" class="navbar-top-link" href="tel:+551142273008" >
                <Icon class="navbar-top-link-icon" name="mdi:phone" />
                <p v-if="screenWidth > 750">11 4227-3008</p>
            </a>
        </div>
        <div class="navbar-bottom">
            <div class="navbar-bottom-logo-box">
                <Icon class="navbar-bottom-logo-box-icon" name="my-icon:mediari-logo" />
                <Icon class="navbar-bottom-logo-box-text" name="my-icon:mediari-logo-texto" />
            </div>
            <nav class="navbar-bottom-nav desktop" v-if="screenWidth > 1030">
                <a href="/">Início</a>
                <a href="/about">Áreas de Atuação</a>
                <a href="/contact">Empresa</a>
                <a href="/services">Equipe</a>
                <a href="/blog">Fale conosco</a>
                <button v-if="screenWidth > 1300" class="navbar-bottom-nav-button common-button"
                    @click.prevent="openPhoneDialer">
                    <Icon class="navbar-bottom-nav-button-icon" name="mdi:phone" />11 4227-3008
                </button>
            </nav>
            <button v-if="screenWidth <= 1030" class="navbar-bottom-hamburguer-menu common-button"
                :class="{ open: hamburguerMenuOpen }" @click="toggleHamburguerMenu">
                <Icon class="navbar-bottom-hamburguer-menu-icon" mode="svg"
                    :name="hamburguerMenuOpen ? 'line-md:menu-to-close-transition' : 'line-md:close-to-menu-transition'"
                    :key="hamburguerMenuOpen" />
            </button>
            <nav class="navbar-bottom-nav mobile" :class="{ closed: !hamburguerMenuOpen }" v-show="screenWidth <= 1030">
                <a href="/">Início</a>
                <a href="/about">Áreas de Atuação</a>
                <a href="/contact">Empresa</a>
                <a href="/services">Equipe</a>
                <a href="/blog">Fale conosco</a>
            </nav>
        </div>
    </header>
</template>

<style lang="scss" scoped>
/* Navbar Base Styles */
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;

    &-top {
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
    }

    &-bottom {
        background-color: $body-background-67;
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.1rem;
        font-size: 20px;
        gap: 5rem;

        &-logo-box {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            color: $accent-color;

            &-icon {
                font-size: 4.2em;
                transition: font-size 0.2s ease-in-out;
            }

            &-text {
                font-size: 2.5em;
                transition: font-size 0.2s ease-in-out;
            }
        }

        &-nav {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 2rem;
            transition: font-size 0.2s ease-in-out;

            a {
                position: relative;
                text-decoration: none;
                color: $primary-text;

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

            &-button {
                font-size: inherit;

                &-icon {
                    font-size: 1.3em;
                }
            }
        }

        &-hamburguer-menu {
            font-size: 1.5em;

            &-icon {
                transition: font-size 0.2s ease-in-out;
            }

            &.open {
                background-color: $accent-color-30;

                &:hover {
                    background-color: unset;
                }
            }
        }

        &-nav.mobile {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            overflow: hidden;
            max-height: 0;
            opacity: 0;
            flex-direction: column;
            background-color: $body-background-67;
            backdrop-filter: blur(5px);
            border-top: 2px solid $accent-color;
            border-bottom: 2px solid $accent-color;
            gap: 1rem;
            padding: 1rem;
            transition: max-height 0.2s ease-in-out, opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;

            &.closed {
                max-height: 0;
                opacity: 0;
                visibility: hidden;
            }

            &:not(.closed) {
                max-height: 500px;
                opacity: 1;
                visibility: visible;
            }

            a {
                border: 2px solid $accent-color;
                border-radius: 5px;
                padding: 0.5rem 1rem;
                width: 100%;
                box-sizing: border-box;
                text-align: center;
                transition: opacity 0.2s ease-in-out, font-size 0.2s ease-in-out;
            }
        }
    }
}

/* Navbar Small Styles */
.navbar.small .navbar-bottom {
    &-logo-box {
        &-icon {
            font-size: 3.2em;
        }

        &-text {
            font-size: 2em;
        }
    }

    &-nav {
        font-size: 15px;
    }

    &-hamburguer-menu,
    &-nav-button {
        min-height: 45px;
        min-width: 45px;
    }
}

/* Responsive Styles */
@media (max-width: 1300px) {
    .navbar {
        &-bottom {
            gap: 5vw;
        }
    }
}

@media (max-width: 1030px) {
    .navbar {
        &-top {
            min-height: 40px;

            &-link {
                &-icon {
                    font-size: 1.5em;
                }

                p {
                    font-size: 10px;
                }
            }
        }

        &-bottom {
            justify-content: space-between;
            flex-wrap: wrap;
            &-nav {
                a::after {
                    all: unset;
                }
                a::after:hover {
                    all: unset;
                }
            }
        }
    }
}

@media (min-width: 750px) {
    .navbar.small .navbar-top {
        height: 0;
        min-height: 12px;

        &-link {
            &-icon {
                font-size: 0;
            }

            p {
                font-size: 0;
            }
        }
    }
}

@media (max-width: 750px) {
    .navbar {
        &-top {
            justify-content: space-evenly;
        }
    }
}
</style>