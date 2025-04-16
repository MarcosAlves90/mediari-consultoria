<script lang="ts">
    export default defineComponent({
        setup(){
            const { goTo } = useGoTo();

            return {
                goTo,
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
                        <button class="footer__contact-btn common-button"><Icon class="icon" name="mdi:linkedin"/></button>
                        <button class="footer__contact-btn common-button"><Icon class="icon" name="mdi:email-outline"/>contato@mediari.com.br</button>
                        <button class="footer__contact-btn common-button"><Icon class="icon" name="mdi:instagram"/>@mediari.consultoria</button>
                        <button class="footer__contact-btn common-button"><Icon class="icon" name="mdi:phone-outline"/>11 4227-3008</button>
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

    .footer-location-display{
        display: flex;
        justify-content: center;
        align-items: center;
        &.column {
            flex-direction: column;
        }
    }

    footer {
        background-color: $accent-color;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .footer__container {
        max-width: 80rem;
        width: 100%;
        &.text-box {
            color: $body-background;
        }
    }

    .footer__main, .footer__bottom {
        padding: $common-padding 2rem;
        box-sizing: border-box;
        width: 100%;
    }
    
    .footer__main {
        .footer__header {
            padding-bottom: $common-padding;
            border-bottom: 2px solid $accent-dark-color;
            justify-content: space-between;
            display: flex;
            align-items: center;
            .footer__logo {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1rem;
                color: $body-background;
                cursor: pointer;
                font-size: 20px;

                &-icon {
                    font-size: 4.2em;
                    transition: font-size 0.2s ease-in-out;
                }

                &-text {
                    font-size: 2.5em;
                    transition: font-size 0.2s ease-in-out;
                }
            }
            .footer__contacts {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1rem;
            }
        }
        .footer__content {
            padding-top: 2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 4rem;
            height: auto;
            align-items: stretch;
            .footer__highlights {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                gap: 1.5rem;
                max-width: 25rem;
                width: 100%;
                .footer__highlight {
                    width: 100%;
                    padding: 1rem;
                    border-radius: 5px;
                    background-color: $accent-dark-color;
                    color: $body-background;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1rem;
                    box-sizing: border-box;
                    transition: transform 0.2s ease-in-out;
                    .footer__highlight-icon {
                        font-size: 5em;
                    }
                    .footer__highlight-text {
                        min-width: 17rem;
                    }
                    .footer__highlight-title {
                        font-size: 24px;
                        font-weight: 700;
                    }
                    .footer__highlight-desc {
                        color: $secondary-text;
                        font-size: 15px;
                    }
                    &:hover {
                        transform: scale(1.05);
                    }
                }
            }
            .footer__nav {
                width: 100%;
                display: flex;
                justify-content: center;
                gap: 4rem;
                &-section, &-section a {
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
                    font-size: 19px;
                    text-decoration: none;
                    padding: 0.1rem;
                    border-radius: 5px;
                    &:hover {
                        background-color: $accent-text-color-20;
                    }
                }
                &-section {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    min-width: 12rem;
                    .footer__nav-title {
                        font-size: 35px;
                        border-bottom: 2px solid $body-background;
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
    }

    p, ul {
        margin: 0;
    }
</style>