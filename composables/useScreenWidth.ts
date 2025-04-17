import { ref, onMounted, onUnmounted } from 'vue';

/**
 * A composable function that provides a reactive reference to the current screen width.
 * It listens for window resize events and updates the screen width accordingly.
 *
 * @returns {Ref<number>} A reactive reference containing the current screen width.
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