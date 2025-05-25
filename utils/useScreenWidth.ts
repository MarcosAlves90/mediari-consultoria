import { ref, onMounted, onUnmounted } from 'vue';

/**
 * Uma função composable que fornece uma referência reativa para a largura atual da tela.
 * Ela escuta eventos de redimensionamento da janela e atualiza a largura da tela conforme necessário.
 *
 * @returns {Ref<number>} Uma referência reativa contendo a largura atual da tela.
 *
 * @example
 * ```typescript
 * import { useScreenWidth } from '@/composables/useScreenWidth';
 *
 * export default {
 *   setup() {
 *     const screenWidth = useScreenWidth();
 *     return { screenWidth };
 *   },
 * };
 * ```
 */
export function useScreenWidth() {
    const screenWidth = ref(0); // Inicializa com 0 (ou null)

    const updateScreenWidth = () => {
        screenWidth.value = window.innerWidth;
    };

    onMounted(() => {
        window.addEventListener('resize', updateScreenWidth);
        updateScreenWidth();
    });

    onUnmounted(() => {
        window.removeEventListener('resize', updateScreenWidth);
    });

    return screenWidth;
}