<script lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
    setup() {
        const router = useRouter(); // Instância do roteador
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
        
        const toggleHamburguerMenu = () => {
            hamburguerMenuOpen.value = !hamburguerMenuOpen.value;
        };

        const goToHome = () => {
            router.push('/'); // Redireciona para a página inicial
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


        return {
            hamburguerMenuOpen,
            toggleHamburguerMenu,
            screenWidth,
            openPhoneDialer,
            isNavbarSmall,
            goToHome,
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
            <a v-if="screenWidth <= 1310" class="navbar-top-link" href="tel:+551142273008" >
                <Icon class="navbar-top-link-icon" name="mdi:phone" />
                <p v-if="screenWidth > 750">11 4227-3008</p>
            </a>
        </div>
        <div class="navbar-bottom">
            <div class="navbar-bottom-group">
                <div class="navbar-bottom-group-logo-box" @click="goToHome">
                    <Icon class="navbar-bottom-group-logo-box-icon" name="my-icon:mediari-logo" />
                    <Icon class="navbar-bottom-group-logo-box-text" name="my-icon:mediari-logo-texto" />
                </div>
                <nav class="navbar-bottom-group-nav desktop" v-if="screenWidth > 1080">
                    <a href="/">Início</a>
                    <a href="/about">Áreas de Atuação</a>
                    <a href="/contact">Empresa</a>
                    <a href="/services">Equipe</a>
                    <a href="/blog">Fale conosco</a>
                    <button v-if="screenWidth > 1310" class="navbar-bottom-group-nav-button common-button"
                        @click.prevent="openPhoneDialer">
                        <Icon class="navbar-bottom-group-nav-button-icon" name="mdi:phone" />11 4227-3008
                    </button>
                </nav>
                <button v-if="screenWidth <= 1080" class="navbar-bottom-group-hamburguer-menu common-button"
                    :class="{ open: hamburguerMenuOpen }" @click="toggleHamburguerMenu">
                    <Icon class="navbar-bottom-group-hamburguer-menu-icon" mode="svg"
                        :name="hamburguerMenuOpen ? 'line-md:menu-to-close-transition' : 'line-md:close-to-menu-transition'"
                        :key="hamburguerMenuOpen" />
                </button>
                <nav class="navbar-bottom-group-nav mobile" :class="{ closed: !hamburguerMenuOpen }" v-show="screenWidth <= 1030">
                    <a href="/">Início</a>
                    <a href="/about">Áreas de Atuação</a>
                    <a href="/contact">Empresa</a>
                    <a href="/services">Equipe</a>
                    <a href="/blog">Fale conosco</a>
                </nav>
            </div>
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
    border-bottom: 2px solid transparent;
    transition: border-color 0.2s ease-in-out;

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
        transition: backdrop-filter 0.2s ease-in-out;
        &-group {
            max-width: 80rem;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.1rem;
            font-size: 20px;
            gap: 3.5rem;

            &-logo-box {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1rem;
                color: $accent-color;
                cursor: pointer;

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
                gap: 2.8rem;
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
                    background-color: $accent-color-20;

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
}

/* Navbar Small Styles */
.navbar.small .navbar-bottom-group {
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

.navbar.small {
    border-color: $accent-color;
}

.navbar.small .navbar-bottom {
    backdrop-filter: blur(10px);
}

/* Responsive Styles */
@media (max-width: 1300px) {
    .navbar {
        &-bottom-group {
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

        &-bottom-group {
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

/**
 * Responsive styles for the `.navbar-bottom-logo-box` component:
 *
 * - For screens with a maximum width of 450px:
 *   - Adjusts the font size of the `-icon` element to 3.5em.
 *   - Adjusts the font size of the `-text` element to 2.2em.
 *
 * - For screens with a maximum width of 365px:
 *   - Hides the `-text` element by setting its display property to `none`.
 */
@media (max-width: 450px) {
    .navbar-bottom-group-logo-box {
        &-icon {
            font-size: 3.5em;
        }
        &-text {
            font-size: 2.2em;
        }
    }
}
@media (max-width: 365px) {
    .navbar-bottom-group-logo-box {
        &-text {
            display: none;
        }
    }
}
</style>