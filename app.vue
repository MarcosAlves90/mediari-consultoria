<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { watch, onMounted } from 'vue'

  const { t, locale } = useI18n()

  useHead({
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
        sizes: '16x16 32x32 48x48',
      },
      {
        rel: 'manifest',
        href: '/manifest.webmanifest',
      },
    ],
    meta: [
      {
        name: 'theme-color',
        content: '#590100',
      },
      {
        name: 'apple-mobile-web-app-title',
        content: 'Mediari',
      },
      {
        name: 'application-name',
        content: 'Mediari',
      },
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes',
      },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'black-translucent',
      },
      {
        name: 'msapplication-TileColor',
        content: '#590100',
      },
    ],
  })

  const updateSeoMeta = () => {
    useSeoMeta({
      title: t('seo.title'),
      description: t('seo.description'),
    })
  }

  watch(locale, () => {
    updateSeoMeta()
  })

  updateSeoMeta()

  defineOgImageComponent('Mediari', {
    title: t('seo.title'),
    description: t('seo.description'),
  })

  onMounted(() => {
    const loader = document.getElementById('loader')
    if (loader) loader.classList.add('loader-ds-hidden')
  })
</script>

<template>
  <div>
    <AtomsLoader />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
