/**
 * A composable function that provides utility methods for interacting with contact options.
 * Includes methods to open the phone dialer, email client, and redirect to a specific link.
 *
 * @returns An object containing the following methods:
 * - `openPhoneDialer`: Opens the phone dialer with a predefined phone number.
 * - `openMailTo`: Opens the default email client with a predefined email address.
 * - `openLink`: Redirects to a specific link.
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