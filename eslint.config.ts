import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import prettierConfig from 'eslint-config-prettier';

export default [
  // Arquivos ignorados globalmente
  {
    ignores: [
      '.nuxt/**/*',
      'node_modules/**/*',
      'dist/**/*',
      '.output/**/*',
      '*.local',
      '.env',
      '.env.*',
    ],
  },

  // Configurações base
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  // Configuração principal
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        // Auto-imports do Nuxt
        useHead: 'readonly',
        useSeoMeta: 'readonly',
        definePageMeta: 'readonly',
        navigateTo: 'readonly',
        $fetch: 'readonly',
        useRouter: 'readonly',
        useRoute: 'readonly',
        useNuxtApp: 'readonly',
        useRuntimeConfig: 'readonly',
        useState: 'readonly',
        useCookie: 'readonly',
        useLocalePath: 'readonly',
        useSwitchLocalePath: 'readonly',
        // Macros do Vue
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly',
        defineModel: 'readonly',
        defineSlots: 'readonly',
        // Funções do Nitro
        defineEventHandler: 'readonly',
        getQuery: 'readonly',
        readBody: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      // Regras do Vue
      'vue/multi-word-component-names': 'off',
      'vue/no-multiple-template-root': 'off',
      'vue/require-default-prop': 'off',

      // Regras do TypeScript
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/ban-ts-comment': 'warn',

      // Regras do JavaScript
      'no-empty': 'warn',
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    },
  },

  // Configuração para arquivos Vue
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      'no-undef': 'off',
    },
  },

  // Configuração para arquivos TypeScript
  {
    files: ['**/*.{ts,mts,cts}'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },

  // Configuração para arquivos de servidor
  {
    files: ['nuxt.config.{js,ts}', 'server/**/*.{js,ts}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // IMPORTANTE: Prettier deve vir por último para desabilitar regras conflitantes
  prettierConfig,
];
