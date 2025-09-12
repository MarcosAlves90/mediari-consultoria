// prettier.config.js
export default {
  // Configurações básicas
  semi: true, // Ponto e vírgula no final das linhas
  singleQuote: true, // Aspas simples em vez de duplas
  tabWidth: 2, // Tamanho da indentação
  useTabs: false, // Usar espaços em vez de tabs
  printWidth: 80, // Largura máxima da linha

  // Trailing comma - vírgula no final de objetos/arrays
  trailingComma: 'es5', // Apenas onde é seguro no ES5

  // Configurações para Vue
  vueIndentScriptAndStyle: true, // Indentar <script> e <style> em .vue

  // Configurações para HTML/Vue templates
  htmlWhitespaceSensitivity: 'css', // Respeitar espaços em branco do CSS

  // Quebra de linha
  endOfLine: 'lf', // Usar LF (Linux/Mac) em vez de CRLF (Windows)

  // Configurações por tipo de arquivo
  overrides: [
    {
      files: '*.vue',
      options: {
        parser: 'vue',
        singleQuote: true,
        semi: false, // Sem ponto e vírgula em templates Vue
      },
    },
    {
      files: ['*.js', '*.ts'],
      options: {
        semi: true,
        singleQuote: true,
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 100, // Linhas mais longas para markdown
        proseWrap: 'always', // Quebrar linhas em markdown
      },
    },
    {
      files: ['*.json', '*.jsonc'],
      options: {
        singleQuote: false, // JSON sempre usa aspas duplas
      },
    },
  ],
};
