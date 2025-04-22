<script setup lang="ts">
const baseUrl = 'https://mediari-consultoria.netlify.app';

// Definições de SEO e meta tags para o site

useSeoMeta({
  robots: 'index, follow',
  description: 'Consultoria jurídica para pequenas e médias empresas e pessoas físicas. Especialistas em Direito Trabalhista, Bancário e do Consumidor.',
  ogTitle: 'Mediari Consultoria - Especialistas em Direito para Empresas e Pessoas Físicas',
  ogDescription: 'Consultoria jurídica para pequenas e médias empresas e pessoas físicas. Especialistas em Direito Trabalhista, Bancário e do Consumidor.',
  ogUrl: `${baseUrl}/`,
  ogImage: `${baseUrl}/mediari-og-image.webp`,
  ogType: 'website',
  twitterTitle: 'Mediari Consultoria - Direito Trabalhista, Bancário e do Consumidor',
  twitterDescription: 'Consultoria jurídica para pequenas e médias empresas e pessoas físicas. Especialistas em Direito Trabalhista, Bancário e do Consumidor.',
  twitterCard: 'summary_large_image',
  twitterImage: `${baseUrl}/mediari-og-image.webp`,
});

useHead({
  title: 'Mediari Consultoria',
  htmlAttrs: { lang: 'pt-BR' },
  link: [
    { type: 'image/webp', href: `${baseUrl}/favicon.webp` },
    { rel: 'icon', type: 'image/png', href: `${baseUrl}/favicon.png` },
    { rel: 'icon', type: 'image/x-icon', href: `${baseUrl}/favicon.ico` },
    { rel: 'preload', as: 'image', href: `${baseUrl}/mediari-og-image.webp`, type: 'image/webp' },
    { rel: 'preload', as: 'image', href: `${baseUrl}/banner-background.webp`, type: 'image/webp' },
    { rel: 'preload', as: 'image', href: `${baseUrl}/card-background.webp`, type: 'image/webp' }
  ],
  meta: [
    { property: 'og:locale', content: 'pt_BR' },
    { property: 'og:site_name', content: 'Mediari Consultoria' },
    { property: 'twitter:domain', content: 'mediari-consultoria.netlify.app' },
    { property: 'twitter:url', content: `${baseUrl}/` },
    { property: 'og:image:type', content: 'image/webp' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    ]
});

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