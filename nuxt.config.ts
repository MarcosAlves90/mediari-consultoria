// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import { defineOrganization } from 'nuxt-schema-org/schema'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // Performance optimizations
  experimental: {
    payloadExtraction: false,
  },

  // Modules
  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/seo',
    '@nuxtjs/i18n'
  ],

  // CSS
  css: ['@/assets/css/tailwind.css'],

  // Vite configuration
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  // Icon configuration
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

  // Fonts configuration
  fonts: {
    defaults: {
      weights: [400, 500, 600, 700]
    }
  },

  // Site configuration
  site: {
    url: 'https://www.mediariconsultoria.com.br',
    name: 'Mediari Consultoria',
    description: 'Consultoria jurídica especializada para empresas e pessoas físicas. Experts em Direito Bancário, do Consumidor e Empresarial.',
    defaultLocale: 'pt-BR',
  },

  // Schema.org configuration
  schemaOrg: {
    identity: defineOrganization({
      name: 'Mediari Consultoria',
      alternateName: 'Mediari',
      description: 'Consultoria jurídica para pequenas e médias empresas e pessoas físicas. Especialistas em Direito Trabalhista, Bancário e do Consumidor.',
      url: 'https://www.mediariconsultoria.com.br',
      logo: '/favicon.png',
      contactPoint: {
        telephone: '+55-11-4227-3008',
        contactType: 'customer service',
        email: 'contato@mediari.com.br'
      },
      address: {
        addressCountry: 'BR',
        addressLocality: 'São Paulo',
        addressRegion: 'SP'
      }
    })
  },

  // SEO configuration
  seo: {
    meta: {
      description: 'Consultoria jurídica para pequenas e médias empresas e pessoas físicas. Especialistas em Direito Trabalhista, Bancário e do Consumidor.',
      author: 'Mediari Consultoria',
      applicationName: 'Mediari Consultoria',
      keywords: 'consultoria jurídica, direito empresarial, direito bancário, direito do consumidor, advocacia, São Paulo'
    }
  },

  // App configuration
  app: {
    head: {
      titleTemplate: '%s - Mediari Consultoria',
      templateParams: {
        separator: '-',
      },
      meta: [
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#590100' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Mediari Consultoria' },
      ],
    },
  },
  i18n: {
    locales: [
      {
        code: 'pt-br',
        iso: 'pt-br',
        file: 'pt-br.json',
        name: 'Português (Brasil)'
      },
      {
        code: 'en-us',
        iso: 'en-us',
        file: 'en-us.json',
        name: 'English (US)'
      }
    ],
    defaultLocale: 'pt-br',
    strategy: 'prefix_except_default',
    baseUrl: 'https://mediariconsultoria.com.br',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      fallbackLocale: 'pt-br'
    },
  },

  image: {
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/dawhjravc/image/upload'
    },
  }
})
