<script setup lang="ts">
const baseUrl = 'https://mediari-consultoria.netlify.app';

useSeoMeta({
  robots: 'index, follow',
});

useHead({
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
    { property: 'og:image:type', content: 'image/webp' },
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