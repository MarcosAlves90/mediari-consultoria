/**
 * Configuração para Progressive Web App (PWA)
 * Define configurações para transformar o site em uma PWA
 */

export const pwaConfig = {
  name: 'Mediari Consultoria',
  short_name: 'Mediari',
  description: 'Consultoria jurídica especializada para empresas e pessoas físicas',
  theme_color: '#590100',
  background_color: '#ffffff',
  display: 'standalone',
  start_url: '/',
  scope: '/',
  orientation: 'portrait-primary',
  categories: ['business', 'professional', 'legal'],
  lang: 'pt-BR',
  icons: [
    {
      src: '/favicon-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any maskable'
    },
    {
      src: '/favicon-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any maskable'
    }
  ],
  shortcuts: [
    {
      name: 'Contato',
      short_name: 'Contato',
      description: 'Entre em contato conosco',
      url: '/#contact',
      icons: [
        {
          src: '/favicon-96x96.png',
          sizes: '96x96'
        }
      ]
    },
    {
      name: 'Serviços',
      short_name: 'Serviços',
      description: 'Veja nossos serviços',
      url: '/#services',
      icons: [
        {
          src: '/favicon-96x96.png',
          sizes: '96x96'
        }
      ]
    }
  ]
} as const;
