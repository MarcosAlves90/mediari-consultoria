/**
 * A composable function that provides a utility for navigating to a specified route
 * using Vue Router's `push` method.
 *
 * @returns An object containing the `goTo` function.
 *
 * @function
 * @name useGoTo
 *
 * @example
 * ```typescript
 * const { goTo } = useGoTo();
 * await goTo('/home');
 * ```
 *
 * @throws Will log an error to the console if the route change fails.
 */
export function useGoTo() {
    const router = useRouter();
    const goTo = async (link: string) => {
        try {
            await router.push(link);
        } catch (error) {
            console.error('Erro ao mudar de rota:', error);
        }
    };

    return { goTo };
}