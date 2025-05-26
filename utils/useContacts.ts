/**
 * Uma função util que fornece métodos utilitários para interagir com opções de contato.
 * Inclui métodos para abrir o discador de telefone, o cliente de email e redirecionar para um link específico.
 *
 * @returns Um objeto contendo os seguintes métodos:
 * - `openPhoneDialer`: Abre o discador de telefone com um número de telefone predefinido.
 * - `openMailTo`: Abre o cliente de email padrão com um endereço de email predefinido.
 * - `openLink`: Redireciona para um link específico.
 */
export function useContacts() {
    function openPhoneDialer() {
        const phoneNumber = "+551142273008";
        const phoneLink = `tel:${phoneNumber}`;
        window.location.href = phoneLink;
    }

    function openMailTo() {
        const email = "contato@mediari.com.br";
        const mailtoLink = `mailto:${email}`;
        window.location.href = mailtoLink;
    }

    const openLinkInBrowser = (link: string) => {
        window.open(link, '_blank', 'noopener');
    }

    return { openPhoneDialer, openMailTo, openLinkInBrowser };
}