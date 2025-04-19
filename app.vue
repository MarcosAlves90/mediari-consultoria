<script setup lang="ts">
useSeoMeta({
  robots: 'index, follow',
  description: 'Consultoria jurídica para pequenas e médias empresas e pessoas físicas. Especialistas em Direito Trabalhista, Bancário e do Consumidor.',

  ogTitle: 'Mediari Consultoria - Especialistas em Direito para Empresas e Pessoas Físicas', // spell-check-ignore
  ogDescription: 'Consultoria jurídica para pequenas e médias empresas e pessoas físicas. Especialistas em Direito Trabalhista, Bancário e do Consumidor.',
  ogUrl: 'https://mediari-consultoria.netlify.app/',
  ogImage: '/mediari-og-image.webp', // spell-check-ignore
  ogType: 'website',

  twitterTitle: 'Mediari Consultoria - Direito Trabalhista, Bancário e do Consumidor',
  twitterDescription: 'Consultoria jurídica para pequenas e médias empresas e pessoas físicas. Especialistas em Direito Trabalhista, Bancário e do Consumidor.',
  twitterCard: 'summary_large_image',
  twitterImage: '/mediari-og-image.webp',
})
useHead({
  title: 'Mediari Consultoria', // spell-check-ignore
  htmlAttrs: {
    lang: 'pt-BR',
  },
  link: [
    {
      rel: 'icon',
      type: 'image/webp',
      href: '/favicon.webp'
    },
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    },
    // Preload critical images
    {
      rel: 'preload',
      as: 'image',
      href: '/mediari-og-image.webp', // spell-check-ignore
      type: 'image/webp'
    },
    {
      rel: 'preload',
      as: 'image',
      href: '/banner-background.webp',
      type: 'image/webp'
    },
    {
      rel: 'preload',
      as: 'image',
      href: '/card-background.webp',
      type: 'image/webp'
    }
  ],
  meta: [
    { name: 'robots', content: 'index, follow' },
    { property: 'og:locale', content: 'pt_BR' },
    { property: 'og:site_name', content: 'Mediari Consultoria' }, // spell-check-ignore
    { property: 'og:url', content: 'https://mediari-consultoria.netlify.app/' }
  ]
});

// Esconde o loader após o carregamento
onMounted(() => {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.display = 'none';
  }
});
</script>

<template>
  <div>
    <div id="loader" class="loader">
      <div class="spinner"></div>
    </div>
    <NuxtLayout> <!-- spell-check-ignore -->
      <NuxtPage /> <!-- spell-check-ignore -->
    </NuxtLayout> <!-- spell-check-ignore -->
  </div>
</template>


<style lang="scss" scoped>
/* Loader Styles */
.loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: $body-background-67;
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid $body-background;
  border-top: 5px solid $accent-color;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>