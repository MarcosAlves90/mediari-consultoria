import { useScreenWidth } from './useScreenWidth';

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