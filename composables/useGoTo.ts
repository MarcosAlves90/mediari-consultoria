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