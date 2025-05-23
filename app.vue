<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

useSeoMeta({
  title: t('seo.title'),
  description: t('seo.description'),
});

defineOgImageComponent('Mediari', {
  title: t('seo.title')
})

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