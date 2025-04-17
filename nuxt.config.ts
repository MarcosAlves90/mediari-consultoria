// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/fonts', '@nuxt/image', '@nuxt/icon'],
  css: ['~/assets/css/main.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/css/_colors.scss" as *;'
        }
      }
    }
  },
  icon: {
    provider: 'server',
    customCollections: [
      {
        prefix: 'my-icon',
        dir: './assets/icons'
      },
    ],
  },
  fonts: {
    defaults: {
      weights: [400, 500, 600, 700]
    }
  },
  routeRules: {
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/**/*.(png|jpg|jpeg|webp|svg|ico)': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
  },
  nitro: {
    compressPublicAssets: true
  }
})