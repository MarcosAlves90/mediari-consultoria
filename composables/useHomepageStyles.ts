/**
 * Composable para classes CSS reutilizáveis da homepage
 */
export const useHomepageStyles = () => {
  const homepage__container = 'py-4.5 px-4 max-lg:py-3.5 max-xl:px-2 max-md:py-2 max-md:px-1';
  const homepage__section_title = 'text-4xl text-primary-text max-md:text-center max-md:text-2xl';
  const homepage__section_subtitle = 'font-scheherazade text-xl font-bold text-accent-color max-md:text-center max-md:text-lg';
  const homepage__section_description = 'mt-0.5 text-base text-secondary-text max-md:text-justify max-md:text-sm';
  const homepage__services_card = 'homepage__services-card relative m-0 box-border flex h-full w-full flex-col items-center justify-start overflow-hidden rounded-sm border-2 border-accent-color p-1 hover:scale-[1.05] transition-transform duration-200 ease-in-out';
  const homepage__services_card_icon = 'homepage__services-card-icon cursor-pointer text-[4rem] max-870:text-[3rem]';
  const homepage__services_card_title = 'homepage__services-card-title mt-0.5 text-center text-xl font-medium text-accent-color max-xl:text-lg';
  const homepage__services_card_description = 'homepage__services-card-description mt-0.5 text-justify text-sm text-secondary-text max-xl:text-xs';

  return {
    homepage__container,
    homepage__section_title,
    homepage__section_subtitle,
    homepage__section_description,
    homepage__services_card,
    homepage__services_card_icon,
    homepage__services_card_title,
    homepage__services_card_description,
  };
};
