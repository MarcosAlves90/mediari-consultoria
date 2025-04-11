<script setup lang="ts">
// Define props for the error object
defineProps({
    error: {
        type: Object,
        required: true,
    },
});

// Set up page metadata
useHead({
    title: 'Mediari Consultoria - Página não encontrada',
    htmlAttrs: { lang: 'pt-BR' },
    link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
});

// Import navigation function
const { goTo } = useGoTo();
</script>

<template>
    <div class="error-page">
        <div class="mesh-gradient-background"></div>
        <div class="header">
            <Icon class="logo" name="my-icon:mediari-logo" aria-label="Logotipo Mediari" />
            <h1>{{ error.statusCode }}</h1>
        </div>
        <p v-if="error.statusCode === 404">Oops! A página que você procura não foi encontrada.</p>
        <p v-else>Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.</p>
        <button class="common-button" @click="goTo('/')" aria-label="Voltar para a página inicial">
            Voltar para a página inicial
        </button>
    </div>
</template>

<style scoped lang="scss">
.error-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    text-align: center;
    background-color: $body-background;
    color: $accent-color;
    padding: 0 2rem;
    gap: 1rem;

    .header {
        display: flex;
        align-items: center;
        gap: 1rem;

        h1 {
            font-size: 5rem;
            margin: 0;
        }
    }

    p {
        font-size: 1.5rem;
        max-width: 600px;
        margin: 0;
        font-weight: bold;
    }
}

.common-button {
    font-size: 20px;
}

.logo {
    font-size: 6rem;
    color: $accent-color;
}
</style>
