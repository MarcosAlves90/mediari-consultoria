import { useRoute } from 'vue-router';

/**
 * Retorna uma função que transforma um path em path preservando o locale atual
 * quando possível.
 * - Tenta usar `useLocalePath()` (nuxt-i18n auto-import)
 * - Se não disponível, tenta extrair o prefixo de locale do route.path (ex: /pt-br/...)
 * - Caso contrário, retorna o path original
 */
export const useLocalePathSafe = (): ((p: string) => string) => {
  // Tenta primeiro o helper do nuxt (quando disponível)
  try {
    // Chama o helper auto-import apenas em runtime; se não existir, cai no catch
    // (evita diretivas TS que às vezes são sinalizadas como 'unused')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const maybe = (useLocalePath as unknown as any)();
    if (typeof maybe === 'function') return maybe;
  } catch {
    // ignore
  }

  // Fallback: extrai locale do route atual (ex: /pt-br/...) e aplica prefixo
  try {
    const route = useRoute();
    const segments = (route?.path || '').split('/').filter(Boolean);
    if (segments.length >= 1 && /^[a-z]{2}(-[a-z]{2})?$/i.test(segments[0])) {
      const prefix = `/${segments[0]}`;
      return (p: string) => {
        if (!p || p === '/') return `${prefix}/`;
        if (p.startsWith(`/${segments[0]}`)) return p;
        return `${prefix}${p.startsWith('/') ? '' : '/'}${p}`;
      };
    }
  } catch {
    // ignore
  }

  // Último fallback: identidade
  return (p: string) => p;
};

export default useLocalePathSafe;
