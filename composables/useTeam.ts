import { ref } from 'vue';

/**
 * Composable para gerenciar os dados da equipe
 */
export const useTeam = () => {
  const teamImages = ref<string[]>([
    'fernanda-assis_sqa0ag_didohw.webp',
    'letícia-ferreira_qliwdi_aw9w4j.webp',
    'lucas-jesus_svwujc_fwxeqy.webp',
    'millena-vieira_kbs5vt_lzhvnu.webp',
    'mylena-barboza_ermcjh_rq4laa.webp',
    'roberta-curcios_nokbvj_pyym69.webp',
    'ingrid-pacheco_uuazeo_usy5vx.webp'
  ]);

  const getNome = (img: string): string => {
    const fileName = img.split('/').pop();
    if (!fileName) return 'Nome Desconhecido';

    const namePart = fileName.split('_')[0];
    if (!namePart) return 'Nome Desconhecido';

    const cleanedName = namePart.replace('.webp', '');
    return cleanedName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return {
    teamImages,
    getNome,
  };
};
