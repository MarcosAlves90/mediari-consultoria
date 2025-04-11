export function useGoTo() {
    const router = useRouter(); // Instância do roteador
    const goTo = (link: string) => {
        router.push(link); // Redireciona para a página inicial
    };

    return { goTo };
}