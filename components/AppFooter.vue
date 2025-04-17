<script lang="ts">
export default defineComponent({
    setup() {
        const { goTo } = useGoTo();
        const screenWidth = useScreenWidth();

        return {
            goTo,
            screenWidth
        }
    }
})
</script>

<template>
    <footer>
        <div class="footer__main footer-location-display">
            <div class="footer__container">
                <div class="footer__header">
                    <div class="footer__logo" @click="goTo('/')">
                        <Icon class="footer__logo-icon" name="my-icon:mediari-logo" />
                        <Icon class="footer__logo-text" name="my-icon:mediari-logo-texto" />
                    </div>
                    <div class="footer__contacts">
                        <button class="footer__contact-btn common-button">
                            <Icon class="icon" name="mdi:linkedin" />
                            <p v-if="screenWidth <= 1200 && screenWidth > 610">Mediari Consultoria</p>
                        </button>
                        <button class="footer__contact-btn common-button">
                            <Icon class="icon" name="mdi:email-outline" />
                            <p v-if="screenWidth > 610">contato@mediari.com.br</p>
                        </button>
                        <button class="footer__contact-btn common-button">
                            <Icon class="icon" name="mdi:instagram" />
                            <p v-if="screenWidth > 610">@mediari.consultoria</p>
                        </button>
                        <button class="footer__contact-btn common-button">
                            <Icon class="icon" name="mdi:phone-outline" />
                            <p v-if="screenWidth > 610">11 4227-3008</p>
                        </button>
                    </div>
                </div>
                <div class="footer__content">
                    <div class="footer__highlights">
                        <div class="footer__highlight">
                            <Icon class="footer__highlight-icon" name="mdi:shield-outline" />
                            <div class="footer__highlight-text">
                                <p class="footer__highlight-title">Site 100% Seguro</p>
                                <p class="footer__highlight-desc">Criptografia SSL para sua proteção</p>
                            </div>
                        </div>
                        <div class="footer__highlight">
                            <Icon class="footer__highlight-icon" name="mdi:star-outline" />
                            <div class="footer__highlight-text">
                                <p class="footer__highlight-title">Referência no Ramo</p>
                                <p class="footer__highlight-desc">Serviço bem avaliado</p>
                            </div>
                        </div>
                        <div class="footer__highlight">
                            <Icon class="footer__highlight-icon" name="mdi:shield-home-outline" />
                            <div class="footer__highlight-text">
                                <p class="footer__highlight-title">Acesso Protegido</p>
                                <p class="footer__highlight-desc">Navegação estável e confiável</p>
                            </div>
                        </div>
                    </div>
                    <nav class="footer__nav">
                        <div class="footer__nav-section">
                            <p class="footer__nav-title">MENU</p>
                            <ul>
                                <li><a href="/">Início</a></li>
                                <li><a href="/">Áreas de Atuação</a></li>
                                <li><a href="/">Empresa</a></li>
                                <li><a href="/">Equipe</a></li>
                                <li><a href="/">Contato</a></li>
                            </ul>
                        </div>
                        <div class="footer__nav-section full-width-section">
                            <p class="footer__nav-title">ÁREAS DE ATUAÇÃO</p>
                            <div class="footer__areas-grid">
                                <ul>
                                    <li><a href="/">Direito do Consumidor</a></li>
                                    <li><a href="/">Direito Bancário</a></li>
                                    <li><a href="/">Direito Trabalhista</a></li>
                                    <li><a href="/">Direito Civil</a></li>
                                    <li><a href="/">Direito Penal</a></li>
                                </ul>
                                <ul>
                                    <li><a href="/">Consultivo</a></li>
                                    <li><a href="/">Contratos</a></li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
        <div class="footer__bottom footer-location-display">
            <div class="footer__container text-box footer-location-display column">
                <p>©2025 Mediari Consultoria Empresarial LTDA - Todos os Direitos Reservados</p>
                <p>CNPJ 49.315.134/0001-90</p>
                <p>Rua Amazonas, 439 - Centro, São Caetano do Sul, 09520070</p>
            </div>
        </div>
    </footer>
</template>

<style scoped lang="scss">
@import "@/assets/css/mixins.scss";

// Mixins locais reutilizáveis
@mixin flex-center($direction: row, $gap: 0) {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: $direction;
    gap: $gap;
}

@mixin text-title($size, $weight: 700) {
    font-size: $size;
    font-weight: $weight;
}

@mixin nav-link {
    font-size: 19px;
    text-decoration: none;
    padding: 0.1rem;
    border-radius: 5px;
    transition: background-color 0.2s;

    &:hover {
        background-color: $accent-text-color-20;
    }
}

@mixin highlight-box {
    width: 100%;
    padding: 1rem;
    border-radius: 5px;
    background-color: $accent-dark-color;
    color: $body-background;
    @include flex-center(row, 1rem);
    box-sizing: border-box;
    transition: transform 0.2s;

    &:hover {
        transform: scale(1.05);
    }
}

$common-padding: 3rem;

.footer__contact-btn {
    color: $body-background;
    border-color: $body-background;
    font-size: 20px;

    .icon {
        font-size: 1.5em;
    }

    &:hover {
        background-color: $body-background-25;
    }
}

.footer-location-display {
    @include flex-center();

    &.column {
        flex-direction: column;
    }
}

footer {
    background-color: $accent-color;
    @include flex-center(column);
}

.footer__container {
    max-width: 80rem;
    width: 100%;

    &.text-box {
        color: $body-background;
    }
}

.footer__main,
.footer__bottom {
    padding: $common-padding 2rem;
    box-sizing: border-box;
    width: 100%;
}

.footer__main {
    .footer__header {
        padding-bottom: $common-padding;
        border-bottom: 2px solid $accent-dark-color;
        @include flex-center(row, 0);
        justify-content: space-between;

        .footer__logo {
            @include flex-center(row, 1rem);
            color: $body-background;
            cursor: pointer;
            font-size: 20px;

            &-icon {
                font-size: 4.2em;
                transition: font-size 0.2s;
            }

            &-text {
                font-size: 2.5em;
                transition: font-size 0.2s;
            }
        }

        .footer__contacts {
            @include flex-center(row, 1rem);
        }
    }

    .footer__content {
        padding-top: 2rem;
        @include flex-center(row, 4rem);
        align-items: stretch;

        .footer__highlights {
            @include flex-center(column, 1.5rem);
            max-width: 25rem;
            width: 100%;

            .footer__highlight {
                @include highlight-box;

                .footer__highlight-icon {
                    font-size: 5em;
                }

                .footer__highlight-text {
                    min-width: 17rem;
                }

                .footer__highlight-title {
                    @include text-title(24px);
                }

                .footer__highlight-desc {
                    color: $secondary-text;
                    font-size: 15px;
                }
            }
        }

        .footer__nav {
            width: 100%;
            @include flex-center(row, 4rem);
            align-items: start;

            &-section,
            &-section a {
                color: $body-background;
            }

            ul {
                list-style: none;
                padding: 0;
                margin: 0;
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            a {
                @include nav-link;
            }

            &-section {
                display: flex;
                flex-direction: column;
                gap: 2rem;
                min-width: 12rem;

                .footer__nav-title {
                    @include text-title(35px);
                    border-bottom: 2px solid $body-background;
                    font-weight: 400;
                }

                .footer__areas-grid {
                    display: flex;
                    gap: 5rem;
                }
            }
        }
    }
}

.footer__nav-section.full-width-section {
    width: 100%;
}

.footer__bottom {
    background-color: $accent-dark-color;
    text-align: center;
}

p,
ul {
    margin: 0;
}

// Responsividade
@include respond-to(desktop) {
    .footer__contact-btn {
        font-size: 15px;

        .icon {
            font-size: 1.2em;
        }
    }

    .footer__container {
        max-width: 100%;
        padding: 0 1rem;
    }

    .footer__main,
    .footer__bottom {
        padding: 2rem 0;
    }

    .footer__main {
        .footer__header {
            flex-direction: column;
            gap: 1.5rem;
            padding-bottom: 2rem;
        }

        .footer__content {
            flex-direction: column;
            gap: 2rem;
            padding-top: 1.5rem;

            .footer__highlights {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1rem;
                max-width: 100%;

                .footer__highlight {
                    min-width: 0;
                    flex: 1 1 0;
                    height: 100%;

                    .footer__highlight-text {
                        min-width: unset;
                    }

                    .footer__highlight-title {
                        font-size: 20px;
                    }

                    .footer__highlight-desc {
                        font-size: 13px;
                    }

                    .footer__highlight-icon {
                        font-size: 3em;
                    }
                }
            }

            .footer__nav {
                gap: 2rem;
                align-items: flex-start;

                a {
                    font-size: 15px;
                }

                .footer__nav-title {
                    font-size: 26px;
                }
            }
        }
    }

    .footer__nav-section,
    .footer__nav-section.full-width-section {
        width: 50%;
    }

    .footer__bottom .footer__container {
        font-size: 15px;
    }
}

@include respond-to(tablet) {
    .footer__main .footer__header .footer__contacts {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
    }

    .footer__main .footer__highlights .footer__highlight-title {
        font-size: 16px;
    }

    .footer__main .footer__highlights .footer__highlight-desc {
        font-size: 11px;
    }

    .footer__main .footer__highlights .footer__highlight-icon {
        font-size: 2em;
    }

    .footer__main .footer__nav {
        flex-direction: column;

        &-section {
            width: 100%;
        }

        a {
            font-size: 13px;
        }

        .footer__nav-title {
            font-size: 18px;
        }

        .footer__nav-section .footer__areas-grid {
            flex-direction: column;
            gap: 1rem;
        }
    }

    .footer__bottom {
        padding: 1rem;

        .footer__container {
            font-size: 12px;
            padding: 0;
        }
    }

    .footer__main .footer__content .footer__highlights .footer__highlight {
        flex-direction: row;
        text-align: center;

        .footer__highlight-text {
            min-width: 15rem;
        }
    }

    .footer__main .footer__content .footer__highlights {
        grid-template-columns: 1fr;
    }
}

@include respond-to(mobile) {
    .footer__main .footer__content .footer__nav {
        flex-direction: column;
    }
    .footer__main .footer__content .footer__highlights .footer__highlight .footer__highlight-icon {
        display: none;
    }
}
</style>