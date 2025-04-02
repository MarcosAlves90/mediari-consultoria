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
                <Icon class="navbar-bottom-logo-box-icon" name="my-icon:mediari-logo-original" size="5em"/>
            </div>
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
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
            padding: 11px;
            &-link-container {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
        }
        &-bottom {
            background-color: $body-background;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
            &-logo-box {
                &-icon {
                    color: $accent-color;
                }
            }
        }
    }

    p {
        margin: 0;
    }

    nav ul {
        list-style-type: none;
        padding: 0;
    }

    nav ul li {
        display: inline;
        margin: 0 15px;
    }

    nav ul li a {
        text-decoration: none;
        color: #007bff;
    }
</style>