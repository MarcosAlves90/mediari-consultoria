import type { SEOData } from '~/types';
import { SEO_DEFAULTS, COMPANY_INFO } from '~/constants';

/**
 * Composable para gerenciar configurações de SEO
 * Facilita a definição de meta tags e estrutura de dados para SEO
 */
export function useSEO() {
  /**
   * Define as meta tags para SEO da página
   * @param seoData - Dados de SEO para a página
   */
  function setSEO(seoData: Partial<SEOData>) {
    const title = seoData.title ? `${seoData.title} - ${COMPANY_INFO.name}` : COMPANY_INFO.name;
    const description = seoData.description || SEO_DEFAULTS.description;
    const keywords = seoData.keywords?.join(', ') || SEO_DEFAULTS.keywords.join(', ');
    const image = seoData.image || '/favicon.png';
    const url = seoData.url || COMPANY_INFO.website;

    useHead({
      title,
      meta: [
        { name: 'description', content: description },
        { name: 'keywords', content: keywords },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
        { property: 'og:url', content: url },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image },
      ],
    });
  }

  /**
   * Define dados estruturados para uma página de serviço
   * @param serviceName - Nome do serviço
   * @param serviceDescription - Descrição do serviço
   */
  function setServiceStructuredData(serviceName: string, serviceDescription: string) {
    useSchemaOrg([
      {
        '@type': 'Service',
        name: serviceName,
        description: serviceDescription,
        provider: {
          '@type': 'Organization',
          name: COMPANY_INFO.name,
          url: COMPANY_INFO.website,
        },
      },
    ]);
  }

  /**
   * Define dados estruturados para página de contato
   */
  function setContactStructuredData() {
    useSchemaOrg([
      {
        '@type': 'ContactPage',
        name: 'Contato - Mediari Consultoria',
        description: 'Entre em contato com a Mediari Consultoria para serviços jurídicos especializados.',
      },
    ]);
  }

  return {
    setSEO,
    setServiceStructuredData,
    setContactStructuredData,
  };
}
