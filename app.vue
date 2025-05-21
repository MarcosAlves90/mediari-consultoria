<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

useSeoMeta({
  title: t('seo.title'),
});

defineOgImageComponent('Mediari')

onMounted(() => {
  const loader = document.getElementById('loader');
  if (loader) loader.classList.add('loader-ds-hidden');
});
</script>

<template>
  <div>
    <Loader />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>