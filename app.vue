<script setup lang="ts">

import { useI18n } from 'vue-i18n';
import { watch, onMounted } from 'vue';

const { t, locale } = useI18n();


const updateSeoMeta = () => {
  useSeoMeta({
    title: t('seo.title'),
    description: t('seo.description'),
  });
};

watch(locale, () => {
  updateSeoMeta();
});

updateSeoMeta();

defineOgImageComponent('Mediari', {
  title: t('seo.title'),
  description: t('seo.description'),
});

onMounted(() => {
  const loader = document.getElementById('loader');
  if (loader) loader.classList.add('loader-ds-hidden');
});

</script>

<template>
  <div>
    <AtomsLoader />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>