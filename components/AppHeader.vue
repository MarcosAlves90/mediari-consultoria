<script lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

export default defineComponent({
    setup() {
        const hamburguerMenuOpen = ref(false);
        const screenWidth = ref(0);

        const updateScreenWidth = () => {
            screenWidth.value = window.innerWidth;
        };

        onMounted(() => {
            updateScreenWidth(); // Atualiza a largura ao montar
            window.addEventListener('resize', updateScreenWidth); // Listener para redimensionamento
        });

        onUnmounted(() => {
            window.removeEventListener('resize', updateScreenWidth); // Remove o listener ao desmontar
        });

        const toggleHamburguerMenu = () => {
            hamburguerMenuOpen.value = !hamburguerMenuOpen.value;
        };

        return {
            hamburguerMenuOpen,
            toggleHamburguerMenu,
            screenWidth,
        };
    },
});
</script>

<template>
    <header class="navbar">
        <div class="navbar-top">
            <a class="navbar-top-link" href="mailto:contato@mediari.com.br">
                <Icon name="mdi:email-outline" size="2em" />
                contato@mediari.com.br
            </a>
            <a class="navbar-top-link" href="https://www.instagram.com/mediari.consultoria" target="_blank"
                rel="noopener noreferrer">
                <Icon name="mdi:instagram" size="2em" />
                @mediari.consultoria
            </a>
            <a class="navbar-top-link" href="https://www.linkedin.com/company/mediari-consultoria-empresarial-ltda"
                target="_blank" rel="noopener noreferrer">
                <Icon name="mdi:linkedin" size="2em" />
                Mediari Consultoria Empresarial LTDA
            </a>
            <a v-if="screenWidth <= 1300" class="navbar-top-link" href="tel:+551142273008">
                <Icon name="mdi:phone" size="2em" />
                11 4227-3008
            </a>
        </div>
        <div class="navbar-bottom">
            <div class="navbar-bottom-logo-box">
                <Icon class="navbar-bottom-logo-box-icon" name="my-icon:mediari-logo" size="4.2em" />
                <Icon class="navbar-bottom-logo-box-icon" name="my-icon:mediari-logo-texto" size="2.5em" />
            </div>
            <nav class="navbar-bottom-nav desktop" v-if="screenWidth > 1030">
                <a href="/">Início</a>
                <a href="/about">Áreas de Atuação</a>
                <a href="/contact">Empresa</a>
                <a href="/services">Equipe</a>
                <a href="/blog">Fale conosco</a>
                <button v-if="screenWidth > 1300" class="navbar-bottom-nav-button common-button"
                    @click.prevent="openPhoneDialer">
                    <Icon class="navbar-button-icon" name="mdi:phone" size="1.5em" />11 4227-3008
                </button>
            </nav>
            <button v-if="screenWidth <= 1030" class="navbar-bottom-hamburguer-menu common-button"
                :class="{ open: hamburguerMenuOpen }" @click="toggleHamburguerMenu">
                <Icon class="navbar-bottom-hamburguer-menu-icon" mode="svg"
                    :name="hamburguerMenuOpen ? 'line-md:menu-to-close-transition' : 'line-md:close-to-menu-transition'"
                    :key="hamburguerMenuOpen" size="1em" />
            </button>
        </div>
    </header>
</template>

<style lang="scss" scoped>
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;

    &-top {
        background-color: $accent-color;
        color: $accent-text-color;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding: 12px;

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

            &:hover {
                background-color: $accent-text-color-20;
            }
        }
    }

    &-bottom {
        background-color: $body-background-67;
        backdrop-filter: blur(14px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.1rem;
        font-size: 20px;
        gap: 5rem;

        &-logo-box {
            gap: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: $accent-color;
        }

        &-nav {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 2rem;

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
            }
        }

        &-hamburguer-menu {
            font-size: 1.5em;

            &.open {
                background-color: $accent-color-30;

                &:hover {
                    background-color: unset;
                }
            }
        }
    }
}

nav ul {
    list-style-type: none;
    padding: 0;
}

nav ul li {
    display: inline;
    margin: 0;
}

@media (max-width: 1300px) {
    .navbar {

        &-bottom {
            gap: 5vw;
        }
    }
}

@media (max-width: 1030px) {
    .navbar {
        &-bottom {
            justify-content: space-between;
        }
    }
}
</style>