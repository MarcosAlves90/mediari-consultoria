import { CONTACT_INFO } from '~/constants';

/**
 * Composable para gerenciar interações de contato
 * Fornece métodos utilitários para interagir com opções de contato da empresa.
 * 
 * @returns Um objeto contendo os seguintes métodos:
 * - `openPhoneDialer`: Abre o discador de telefone com o número da empresa
 * - `openMailTo`: Abre o cliente de email padrão com o email da empresa
 * - `openLinkInBrowser`: Abre um link em nova aba com configurações de segurança
 * - `getContactInfo`: Retorna as informações de contato da empresa
 */
export function useContacts() {
    /**
     * Abre o discador de telefone com o número da empresa
     */
    function openPhoneDialer(): void {
        const phoneLink = `tel:${CONTACT_INFO.phone}`;
        window.location.href = phoneLink;
    }

    /**
     * Abre o cliente de email padrão com o email da empresa
     */
    function openMailTo(): void {
        const mailtoLink = `mailto:${CONTACT_INFO.email}`;
        window.location.href = mailtoLink;
    }

    /**
     * Abre um link em nova aba com configurações de segurança
     * @param link - URL para abrir
     */
    function openLinkInBrowser(link: string): void {
        if (!link) {
            console.warn('Link não fornecido para openLinkInBrowser');
            return;
        }
        
        window.open(link, '_blank', 'noopener,noreferrer');
    }

    /**
     * Retorna as informações de contato da empresa
     */
    function getContactInfo() {
        return CONTACT_INFO;
    }

    return { 
        openPhoneDialer, 
        openMailTo, 
        openLinkInBrowser,
        getContactInfo 
    };
}