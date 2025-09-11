// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import { defineOrganization } from 'nuxt-schema-org/schema'

export default defineNuxtConfig({
  // Data de compatibilidade para garantir que o Nuxt funcione corretamente
  compatibilityDate: '2024-11-01',
  // Habilita ferramentas de desenvolvimento
  devtools: { enabled: true },

  // Otimizações de performance
  experimental: {
    payloadExtraction: false,
  },

  // Módulos utilizados no projeto
  modules: [
    '@nuxt/fonts', // Gerenciamento de fontes
    '@nuxt/icon', // Ícones
    '@nuxt/image', // Otimização de imagens
    '@nuxtjs/seo', // SEO
    '@nuxtjs/i18n' // Internacionalização
  ],

  // CSS
  css: ['@/assets/css/tailwind.css'],

  // Configuração do Vite
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  // Configuração de ícones
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

  // Configuração de fontes
  fonts: {
    defaults: {
      weights: [400, 500, 600, 700]
    }
  },

  // Configuração do site
  site: {
    url: 'https://www.mediariconsultoria.com.br',
    name: 'Mediari Consultoria',
    description: 'Consultoria jurídica especializada para empresas e pessoas físicas. Experts em Direito Bancário, do Consumidor e Empresarial.',
    defaultLocale: 'pt-BR',
  },

  // Configuração do Schema.org
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

  // Configuração de SEO
  seo: {
    meta: {
      description: 'Consultoria jurídica para pequenas e médias empresas e pessoas físicas. Especialistas em Direito Trabalhista, Bancário e do Consumidor.',
      author: 'Mediari Consultoria',
      applicationName: 'Mediari Consultoria',
      keywords: 'consultoria jurídica, direito empresarial, direito bancário, direito do consumidor, advocacia, São Paulo'
    }
  },

  // Configuração do aplicativo
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

  // Configuração de internacionalização
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

  // Configuração de imagens
  image: {
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/dawhjravc/image/upload'
    },
  },

  // Configuração de runtime (segura): Configurações do Firebase são expostas via public runtimeConfig
  // Defina esses valores aqui para que o código não codifique segredos. Você pode sobrescrevê-los via
  // variáveis de ambiente ou configuração de runtime do provedor de hospedagem (recomendado).
  runtimeConfig: {
    public: {
      firebase: {
        apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY as string,
        authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
        projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID as string,
        storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
        messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string,
        appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID as string,
        measurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID as string,
      }
    }
  }
})
