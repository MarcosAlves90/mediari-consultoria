<template>
    <main class="main-page">
        <div class="main-page-banner">
            <div class="main-page-banner-text-box">
                <h1>EXCELÊNCIA JURÍDICA</h1>
                <h2>PARA <span>VOCÊ E OS SEUS NEGÓCIOS</span></h2>
                <p>Atendimento especializado para empresas e soluções completas em demandas bancárias e do consumidor.</p>
            </div>
            <div class="main-page-banner-notch" />
            <div class="main-page-banner-gradient" />
            <NuxtImg class="main-page-banner-image" src="/banner-background.jpg" width="1920" height="1080"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" lazy format="webp"
                alt="Banner de fundo da página principal" />
        </div>
        <h1>Welcome to the Main Page</h1>
        <p>This is the main content of the application.</p>
    </main>
</template>

<style lang="scss" scoped>
.main-page {
    &-banner {
        width: 100%;
        height: 60rem;
        position: relative;
        border-bottom: 12px solid $accent-color;

        &-text-box {
            margin-top: 3.1rem;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 3;
            color: $body-background;
            width: 100%;
            text-align: center;
            * {
                margin: 0;
            }
            h1, h2, span, p {
                transition: font-size 0.2s ease-in-out, margin-top 0.2s ease-in-out;
            }
            h1 {
                font-size: 95px;
            }
            h2 {
                margin-top: -3.1rem;
                font-size: 62px;
                span {
                    color: $accent-color;
                    font-family: "Scheherazade New", sans-serif;
                    font-size: 68px;
                    position: relative;
                    top: -2px;
                }
            }
            p {
                margin-top: -1rem;
                color: inherit;
                font-size: 1.15rem;
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
        }

    }
}

p {
    color: $secondary-text;
}

@media (max-width: 1200px) {
    .main-page-banner-text-box {
        h1 {
            font-size: 70px;
            margin-top: -2.9rem;
        }
        h2 {
            font-size: 46px;
            margin-top: -2.4rem;
            span {
                font-size: 50px;
            }
        }
        p {
            font-size: 0.85rem;
            margin-top: -0.5rem;
        }
    }
}

@media (max-width: 850px) {
    .main-page-banner-text-box {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        h1 {
            font-size: 50px;
            margin-top: -2rem;
        }
        h2 {
            font-size: 32px;
            margin-top: -1.6rem;
            span {
                top: -1px;
                font-size: 36px;
            }
        }
        p {
            max-width: 35rem;
            font-size: 0.82rem;
            margin-top: -0.4rem;
        }
    }
}

@media (max-width: 610px) {
    .main-page-banner-text-box {
        h1 {
            font-size: 8.2vw;
            margin-top: -4vw;
        }
        h2 {
            font-size: 5.5vw;
            margin-top: -3vw;
            span {
                font-size: 5.8vw;
            }
        }
        p {
            max-width: 90%;
            font-size: 3vw;
            margin-top: -1vw;
        }
    }
    .main-page-banner-notch {
        width: 50vw;
    }
}

@media (max-width: 750px) {
    .main-page-banner {
        max-height: 850px;
    }
    .main-page-banner-notch {
        width: 60vw;
    }
}
</style>