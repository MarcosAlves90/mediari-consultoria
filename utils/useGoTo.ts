/**
 * Uma função util que fornece uma utilidade para navegar para uma rota especificada
 * usando o método `push` do Vue Router.
 *
 * @returns Um objeto contendo a função `goTo`.
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
 * @throws Irá registrar um erro no console se a mudança de rota falhar.
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