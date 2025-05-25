// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import { defineOrganization } from 'nuxt-schema-org/schema'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/fonts', '@nuxt/icon', '@nuxt/image', '@nuxtjs/seo', '@nuxtjs/i18n'],
  css: ['@/assets/css/tailwind.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  icon: {
    provider: 'server',
    customCollections: [
      {
        prefix: 'my-icon',
        dir: './assets/icons'
      },
    ],
    serverBundle: {
      collections: ['mdi']
    }
  },
  fonts: {
    defaults: {
      weights: [400, 500, 600, 700]
    }
  },

  site: {
    url: 'https://mediari-consultoria.netlify.app',
    name: 'Mediari Consultoria',
  },
  schemaOrg: {
    identity: defineOrganization({
      name: 'Mediari Consultoria',
      alternateName: 'Mediari',
      description: 'Consultoria jurídica para pequenas e médias empresas e pessoas físicas. Especialistas em Direito Trabalhista, Bancário e do Consumidor.',
      url: 'https://mediari-consultoria.netlify.app',
      logo: '/favicon.png',
    })
  },
  seo: {
    meta: {
      description: 'Consultoria jurídica para pequenas e médias empresas e pessoas físicas. Especialistas em Direito Trabalhista, Bancário e do Consumidor.',
      author: 'Mediari Consultoria',
      applicationName: 'Mediari Consultoria',
    }
  },
  app: {
    head: {
      titleTemplate: 'Mediari Consultoria - %s',
      templateParams: {
        separator: '-',
      },
    },
  },
  i18n: {
    locales: [
      {
        code: 'pt-BR',
        iso: 'pt-BR',
        file: 'pt-BR.json',
        name: 'Português (Brasil)'
      },
      {
        code: 'en-US',
        iso: 'en-US',
        file: 'en-US.json',
        name: 'English (US)'
      }
    ],
    defaultLocale: 'pt-BR',
    strategy: 'prefix_except_default',
    baseUrl: 'https://mediari-consultoria.netlify.app',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      fallbackLocale: 'pt-BR'
    },
  },

  image: {
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/dgsywmzb2/image/upload'
    },
  }
})