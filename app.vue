<script setup lang="ts">
  // Adicionar outras tags ao head
  useSeoMeta({
    description: 'Consultoria jurídica para pequenas e médias empresas e pessoas físicas. Especialistas em Direito Trabalhista, Bancário e do Consumidor.',
    ogDescription: 'Consultoria jurídica para pequenas e médias empresas e pessoas físicas. Especialistas em Direito Trabalhista, Bancário e do Consumidor.',
    twitterDescription: 'Consultoria jurídica para pequenas e médias empresas e pessoas físicas. Especialistas em Direito Trabalhista, Bancário e do Consumidor.',
    ogTitle: 'Mediari Consultoria - Especialistas em Direito para Empresas e Pessoas Físicas',
    twitterTitle: 'Mediari Consultoria - Direito Trabalhista, Bancário e do Consumidor',
    twitterCard: 'summary_large_image',
    ogUrl: 'https://mediari-consultoria.netlify.app/',
    ogImage: '/mediari-og-image.png',
    twitterImage: '/mediari-og-image.png',
  })
  useHead({
    title: 'Mediari Consultoria',
    htmlAttrs: {
      lang: 'pt-BR',
    },
    link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.png'
    }
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
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
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