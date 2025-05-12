<script setup lang="ts">
import { useGoTo } from '@/composables/useGoTo'; 

defineProps({
    error: {
        type: Object,
        required: true,
    },
});

useHead({
    title: 'Mediari Consultoria - Página não encontrada',
    htmlAttrs: { lang: 'pt-BR' },
    link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
});

const { goTo } = useGoTo();
</script>

<template>
    <div class="error-page flex flex-col justify-center items-center h-screen text-center bg-body-bg text-accent-color py-0 px-2 gap-1">
        <div class="mesh-gradient-background"></div>
        <div class="header flex items-center gap-1">
            <Icon class="logo text-[6rem] text-accent-color" name="my-icon:mediari-logo" aria-label="Logotipo Mediari" />
            <h1 class="text-[5rem] m-0">{{ error.statusCode }}</h1>
        </div>
        <p class="error-page__p" v-if="error.statusCode === 404">Oops! A página que você procura não foi encontrada.</p>
        <p class="error-page__p" v-else>Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.</p>
        <button class="common-button" @click="goTo('/')" aria-label="Voltar para a página inicial">
            Voltar para a página inicial
        </button>
    </div>
</template>