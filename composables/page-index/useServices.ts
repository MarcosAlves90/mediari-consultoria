import { useI18n } from 'vue-i18n';

export interface Service {
  icon: string;
  headingId: string;
  descId: string;
  title: string;
  description: string;
}

/**
 * Composable para gerenciar os dados dos serviços da homepage
 */
export const useServices = () => {
  const { t } = useI18n();

  const mainServices: Service[] = [
    {
      icon: 'my-icon:icon-direito-civil',
      headingId: 'civil-heading',
      descId: 'civil-description',
      title: t('services.main.0.title'),
      description: t('services.main.0.description'),
    },
    {
      icon: 'my-icon:icon-direito-penal',
      headingId: 'penal-heading',
      descId: 'penal-description',
      title: t('services.main.1.title'),
      description: t('services.main.1.description'),
    },
    {
      icon: 'my-icon:icon-contratos',
      headingId: 'contracts-heading',
      descId: 'contracts-description',
      title: t('services.main.2.title'),
      description: t('services.main.2.description'),
    },
    {
      icon: 'my-icon:icon-consultivo',
      headingId: 'consulting-heading',
      descId: 'consulting-description',
      title: t('services.main.3.title'),
      description: t('services.main.3.description'),
    },
  ];

  const secondaryServices: Service[] = [
    {
      icon: 'my-icon:icon-direito-do-consumidor',
      headingId: 'consumer-heading',
      descId: 'consumer-description',
      title: t('services.secondary.0.title'),
      description: t('services.secondary.0.description'),
    },
    {
      icon: 'my-icon:icon-direito-bancario',
      headingId: 'banking-heading',
      descId: 'banking-description',
      title: t('services.secondary.1.title'),
      description: t('services.secondary.1.description'),
    },
    {
      icon: 'my-icon:icon-direito-trabalhista',
      headingId: 'labor-heading',
      descId: 'labor-description',
      title: t('services.secondary.2.title'),
      description: t('services.secondary.2.description'),
    },
  ];

  const triggerShake = (event: Event) => {
    const target = event.currentTarget as HTMLElement;
    if (target) {
      target.classList.add('shake-animation');
      setTimeout(() => {
        target.classList.remove('shake-animation');
      }, 700);
    }
  };

  return {
    mainServices,
    secondaryServices,
    triggerShake,
  };
};
