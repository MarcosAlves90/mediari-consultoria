/**
 * Composable para utilitários de formatação de texto
 */
export const useTextUtils = () => {
  const breakLinesByDot = (text: string): string =>
    text
      ? text
          .trim()
          .replace(/\.(\s|$)/g, (match, _, offset, str) =>
            offset + match.length < str.length ? '.<br><br>' : '.'
          )
      : '';

  return {
    breakLinesByDot,
  };
};
