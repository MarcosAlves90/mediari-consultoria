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
  },
} as const;

export const COMPANY_INFO = {
  name: 'Mediari Consultoria',
  fullName: 'Mediari Consultoria Empresarial LTDA',
  description:
    'Consultoria jurídica especializada para empresas e pessoas físicas',
  foundedYear: 2018,
  teamSize: '60+',
  website: 'https://www.mediariconsultoria.com.br',
} as const;

export const SERVICES = {
  main: ['civil', 'criminal', 'contracts', 'consulting'],
  secondary: ['consumer', 'banking', 'labor'],
} as const;

export const SEO_DEFAULTS = {
  titleTemplate: '%s - Mediari Consultoria',
  description:
    'Consultoria jurídica para pequenas e médias empresas e pessoas físicas. Especialistas em Direito Trabalhista, Bancário e do Consumidor.',
  keywords: [
    'consultoria jurídica',
    'direito empresarial',
    'direito bancário',
    'direito do consumidor',
    'advocacia',
    'São Paulo',
  ],
} as const;
