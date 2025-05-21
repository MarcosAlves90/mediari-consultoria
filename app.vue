<script setup lang="ts">

useSeoMeta({
  title: 'Direito para Empresas e Pessoas Físicas',
});

defineOgImageComponent('NuxtSeo')

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