import { useScreenWidth } from './useScreenWidth';

/**
 * Uma função util que fornece uma utilidade para rolar suavemente para uma seção
 * específica da página pelo ID do elemento, com um ajuste de deslocamento baseado na largura da tela.
 *
 * @returns Uma função que recebe o ID de um elemento como parâmetro e rola para a seção
 *          correspondente da página com um efeito de rolagem suave.
 *
 * @example
 * const scrollToSection = useScrollToSection();
 * scrollToSection('section-id');
 *
 * A função calcula um deslocamento com base na largura da tela:
 * - Para telas com largura maior que 850px, o deslocamento é de 113px.
 * - Para telas com largura de 850px ou menor, o deslocamento é de 135px.
 *
 * O comportamento da rolagem é suave, proporcionando uma melhor experiência ao usuário.
 *
 * @param id - O ID do elemento HTML para o qual rolar.
 */
export function useScrollToSection() {
    const screenWidth = useScreenWidth();

    return (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            const screenW = screenWidth.value;
            let offset = 0;
            if (screenW > 850) {
                offset = 99 + 14;
            } else {
                offset = 96 + 39;
            }
            const elementTop = el.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: elementTop - offset,
                behavior: 'smooth',
            });
        }
    };
}