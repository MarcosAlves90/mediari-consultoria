<script setup lang="ts">
import { useGoTo } from '@/composables/useGoTo';
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();

const props = defineProps({
    error: {
        type: Object,
        required: true,
    },
});

useSeoMeta({
    title: t('error.title'),
});

defineOgImageComponent('Mediari', {
    title: (props.error?.statusCode ?? '') + ' ' + t('error.title')
})

const { goTo } = useGoTo();

function goHome() {
    goTo(locale.value === 'en-US' ? '/en-US' : '/');
}
</script>

<template>
    <div
        class="error-page flex flex-col justify-center items-center h-screen text-center bg-body-bg text-accent-color py-0 px-2 gap-1">
        <div class="mesh-gradient-background"></div>
        <div class="header flex items-center gap-1">
            <Icon class="logo text-[6rem] text-accent-color" name="my-icon:mediari-logo"
                aria-label="Logotipo Mediari" />
            <h1 class="text-[5rem] m-0">{{ props.error.statusCode }}</h1>
        </div>
        <p class="error-page__p" v-if="props.error.statusCode === 404">{{ t('error.not_found') }}</p>
        <p class="error-page__p" v-else>{{ t('error.unexpected') }}</p>
        <button class="common-button" @click="goHome" :aria-label="t('error.back_home_aria')">
            {{ t('error.back_home') }}
        </button>
    </div>
</template>