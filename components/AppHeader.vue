<template>
    <header class="navbar">
        <div class="navbar-top">
            <div class="navbar-top-link-container">
                <Icon name="mdi:email-outline" size="2em"/>
                <a>contato@mediari.com.br</a>
            </div>
            <div class="navbar-top-link-container">
                <Icon name="mdi:instagram" size="2em"/>
                <a>@mediari.consultoria</a>
            </div>
            <div class="navbar-top-link-container">
                <Icon name="mdi:linkedin" size="2em"/>
                <a>Mediari Consultoria Empresarial LTDA</a>
            </div>
        </div>
        <div class="navbar-bottom">
            <div class="navbar-bottom-logo-box">
                <Icon class="navbar-bottom-logo-box-icon" name="my-icon:mediari-logo" size="4.2em"/>
                <Icon class="navbar-bottom-logo-box-icon" name="my-icon:mediari-logo-texto" size="2.5em"/>
            </div>
            <nav class="navbar-bottom-nav">
                <a href="/">Início</a>
                <a href="/about">Áreas de Atuação</a>
                <a href="/contact">Empresa</a>
                <a href="/services">Equipe</a>
                <a href="/blog">Fale conosco</a>
                <button class="navbar-button common-button">
                    <Icon class="navbar-button-icon" name="mdi:phone" size="1.5em"/>11 4227-3008
                </button>
            </nav>
        </div>
    </header>
</template>

<style lang="scss" scoped>

    .navbar {
        &-top {
            background-color: $accent-color;
            color: $accent-text-color;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            padding: 12px;
            &-link-container {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 15px;
            }
        }
        &-bottom {
            background-color: $body-background;
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
                        transition: width 0.3s ease-in-out;
                    }
                    &:hover::after {
                        width: 100%;
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
</style>