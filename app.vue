<script setup lang="ts">
useSeoMeta({
  title: 'Mediari Consultoria - Especialistas em Direito para Empresas e Pessoas Físicas',
  description: 'Consultoria jurídica para pequenas e médias empresas e pessoas físicas. Especialistas em Direito Trabalhista, Bancário e do Consumidor.',
  ogTitle: 'Mediari Consultoria - Especialistas em Direito para Empresas e Pessoas Físicas',
  ogDescription: 'Consultoria jurídica para pequenas e médias empresas e pessoas físicas. Especialistas em Direito Trabalhista, Bancário e do Consumidor.',
  ogImage: '/mediari-og-image.webp',
  ogUrl: '/',
  twitterTitle: 'Mediari Consultoria - Direito Trabalhista, Bancário e do Consumidor',
  twitterDescription: 'Consultoria jurídica para pequenas e médias empresas e pessoas físicas. Especialistas em Direito Trabalhista, Bancário e do Consumidor.',
  twitterImage: '/mediari-og-image.webp',
  twitterCard: 'summary'
})

useHead({
  htmlAttrs: {
    lang: 'pt-BR'
  },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.png'
    }
  ]
})

onMounted(() => {
  const loader = document.getElementById('loader');
  if (loader) loader.style.display = 'none';
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