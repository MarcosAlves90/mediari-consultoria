<script setup lang="ts">
useSeoMeta({
  title: 'Mediari Consultoria - Direito para Empresas e Pessoas Físicas',
  description: 'Consultoria jurídica para pequenas e médias empresas e pessoas físicas. Especialistas em Direito Trabalhista, Bancário e do Consumidor.',
  ogTitle: 'Mediari Consultoria - Direito para Empresas e Pessoas Físicas',
  ogDescription: 'Consultoria jurídica para pequenas e médias empresas e pessoas físicas. Especialistas em Direito Trabalhista, Bancário e do Consumidor.',
  ogImage: 'https://mediari-consultoria.netlify.app/mediari-og-image.webp',
  ogUrl: 'https://mediari-consultoria.netlify.app/',
  ogType: 'website',
  ogLocale: 'pt_BR',
  twitterTitle: 'Mediari Consultoria - Direito Trabalhista, Bancário e do Consumidor',
  twitterDescription: 'Consultoria jurídica para pequenas e médias empresas e pessoas físicas. Especialistas em Direito Trabalhista, Bancário e do Consumidor.',
  twitterImage: 'https://mediari-consultoria.netlify.app/mediari-og-image.webp',
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
    },
    {
      rel: 'canonical',
      href: 'https://mediari-consultoria.netlify.app/'
    }
  ]
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