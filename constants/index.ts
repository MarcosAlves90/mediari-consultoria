/**
 * Constantes da aplicação Mediari Consultoria
 * Centraliza informações importantes da empresa
 */

export const CONTACT_INFO = {
  phone: '+551142273008',
  email: 'contato@mediari.com.br',
  address: 'São Paulo, SP - Brasil',
  socialMedia: {
    instagram: 'https://instagram.com/mediariconsultoria',
    linkedin: 'https://linkedin.com/company/mediari-consultoria',
  }
} as const;

export const COMPANY_INFO = {
  name: 'Mediari Consultoria',
  fullName: 'Mediari Consultoria Empresarial LTDA',
  description: 'Consultoria jurídica especializada para empresas e pessoas físicas',
  foundedYear: 2018,
  teamSize: '60+',
  website: 'https://www.mediariconsultoria.com.br'
} as const;

export const SERVICES = {
  main: [
    'civil',
    'criminal',
    'contracts',
    'consulting'
  ],
  secondary: [
    'consumer',
    'banking',
    'labor'
  ]
} as const;

export const SEO_DEFAULTS = {
  titleTemplate: '%s - Mediari Consultoria',
  description: 'Consultoria jurídica para pequenas e médias empresas e pessoas físicas. Especialistas em Direito Trabalhista, Bancário e do Consumidor.',
  keywords: [
    'consultoria jurídica',
    'direito empresarial',
    'direito bancário',
    'direito do consumidor',
    'advocacia',
    'São Paulo'
  ]
} as const;

export const SOCIAL_ACTIONS = [
  {
    id: 1,
    name: 'Abrigo Irmã Tereza',
    description: 'Doação de produtos de higiene e fraldas geriátricas e mantimentos para apoiar os idosos do abrigo.',
    icon: 'mdi:heart-plus-outline',
    impact: 'Idosos assistidos',
    category: 'Assistência Social'
  },
  {
    id: 2,
    name: 'Instituto TUH',
    description: 'Doação de cestas básicas para famílias em situação vulnerável, garantindo segurança alimentar.',
    icon: 'mdi:food-outline',
    impact: 'Famílias atendidas',
    category: 'Segurança Alimentar'
  },
  {
    id: 3,
    name: 'Tragédia Rio Grande do Sul',
    description: 'Doação de roupas, calçados e mantimentos para vítimas da tragédia climática no RS.',
    icon: 'mdi:hand-heart-outline',
    impact: 'Vítimas assistidas',
    category: 'Emergência Social'
  },
  {
    id: 4,
    name: 'Casa Florescer (LGBTQIA+)',
    description: 'Doação de roupas de cama e kits de higiene para apoiar a comunidade LGBTQIA+ em vulnerabilidade.',
    icon: 'mdi:home-heart',
    impact: 'Pessoas apoiadas',
    category: 'Direitos Humanos'
  },
  {
    id: 5,
    name: 'Núcleo Menino Jesus',
    description: 'Doação de mantimentos (leite, bolacha e pães) para crianças em situação de vulnerabilidade.',
    icon: 'mdi:baby-face-outline',
    impact: 'Crianças alimentadas',
    category: 'Proteção Infantil'
  },
  {
    id: 6,
    name: 'Instituto Losurdo',
    description: 'Doação de cestas básicas para famílias necessitadas, promovendo dignidade e segurança alimentar.',
    icon: 'mdi:basket-fill',
    impact: 'Famílias beneficiadas',
    category: 'Assistência Social'
  },
  {
    id: 7,
    name: 'Instituto Borboleta Azul',
    description: 'Doação de materiais para pintar, desenhar e jogos interativos para desenvolvimento educacional.',
    icon: 'mdi:palette-outline',
    impact: 'Crianças beneficiadas',
    category: 'Educação e Arte'
  },
  {
    id: 8,
    name: 'Projeto Social Abençoe',
    description: 'Doação de mantimentos, produtos de higiene e brinquedos para crianças carentes do sertão.',
    icon: 'mdi:gift-outline',
    impact: 'Crianças do sertão',
    category: 'Proteção Infantil'
  }
] as const;
