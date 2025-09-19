import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * Composable para gerenciar as tags do hero section
 */
export const useHeroTags = () => {
  const { t } = useI18n();

  const heroTags = ref<string[]>([
    t('banner.tags.0'),
    t('banner.tags.1'),
    t('banner.tags.2'),
  ]);

  return {
    heroTags,
  };
};
