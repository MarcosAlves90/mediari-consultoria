// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/fonts', '@nuxt/image', '@nuxt/icon', '@nuxtjs/sitemap', '@nuxtjs/robots'],
  css: ['~/assets/css/main.scss', '~/assets/css/theme.css'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/css/_colors.scss" as *;'
        }
      }
    },
    plugins: [tailwindcss()],
  },
  site: {
    url: 'https://mediari-consultoria.netlify.app',
    name: 'Mediari Consultoria',
    trailingSlash: false,
  },
  sitemap: {
    urls: [
      {
        loc: '/',
        images: [
          {
            loc: 'https://mediari-consultoria.netlify.app/banner-background.webp',
            caption: 'Banner de fundo da página principal com elementos gráficos abstratos',
          },
          {
            loc: 'https://mediari-consultoria.netlify.app/fundador/bruno-lima.webp',
            caption: 'Foto do sócio fundador Bruno Lima',
          },
          {
            loc: 'https://mediari-consultoria.netlify.app/card-background.webp',
            caption: 'Fundo dos cards de serviço',
          },
          {
            loc: 'https://mediari-consultoria.netlify.app/funcionarios-em-destaque/fernanda-assis.webp',
            caption: 'Foto do membro da equipe Fernanda Assis',
          },
          {
            loc: 'https://mediari-consultoria.netlify.app/funcionarios-em-destaque/letícia-ferreira.webp',
            caption: 'Foto do membro da equipe Letícia Ferreira',
          },
          {
            loc: 'https://mediari-consultoria.netlify.app/funcionarios-em-destaque/lucas-jesus.webp',
            caption: 'Foto do membro da equipe Lucas Jesus',
          },
          {
            loc: 'https://mediari-consultoria.netlify.app/funcionarios-em-destaque/millena-vieira.webp',
            caption: 'Foto do membro da equipe Millena Vieira',
          },
          {
            loc: 'https://mediari-consultoria.netlify.app/funcionarios-em-destaque/mylena-barboza.webp',
            caption: 'Foto do membro da equipe Mylena Barboza',
          },
          {
            loc: 'https://mediari-consultoria.netlify.app/funcionarios-em-destaque/roberta-curcios.webp',
            caption: 'Foto do membro da equipe Roberta Curcios',
          },
          {
            loc: 'https://mediari-consultoria.netlify.app/contact-prints/instagram.webp',
            caption: 'Contato pelo Instagram',
          },
          {
            loc: 'https://mediari-consultoria.netlify.app/contact-prints/telefone.webp',
            caption: 'Contato por telefone',
          },
          {
            loc: 'https://mediari-consultoria.netlify.app/contact-prints/gmail.webp',
            caption: 'Contato por e-mail',
          },
          {
            loc: 'https://mediari-consultoria.netlify.app/contact-prints/linkedin.webp',
            caption: 'Contato pelo LinkedIn',
          }
        ],
      }
    ],
    discoverImages: true,
    discoverVideos: true,
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
  routeRules: {
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/**/*.(png|jpg|jpeg|webp|svg|ico)': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
  },
  nitro: {
    compressPublicAssets: true
  },
  ssr: true,
})