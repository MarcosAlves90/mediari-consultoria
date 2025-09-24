<template>
  <footer
    role="contentinfo"
    :aria-label="t('admin.footer.aria_label')"
    class="bg-accent-color text-accent-text-color border-t border-accent-color-3"
  >
    <!-- Contêiner de layout para largura máxima e espaçamento responsivo -->
    <div
      class="max-w-7xl mx-auto px-0.5 300:px-0.75 500:px-1 870:px-1.5 py-0.75 500:py-1"
    >
      <!-- Flexbox para alinhar e justificar conteúdo, com layout responsivo (coluna em telas pequenas, linha em telas maiores) -->
      <div
        class="flex flex-col 500:flex-row items-center justify-between gap-0.75 500:gap-0"
      >
        <!-- Seção de informações principais (copyright, nome da empresa, título do painel) -->
        <div
          class="flex items-center text-xs 500:text-sm text-accent-text-color"
        >
          <!-- Ano atual e nome da empresa -->
          <span class="font-medium"
            >© {{ currentYear }} Mediari Consultoria</span
          >
          <!-- Separador (visível apenas em telas maiores) -->
          <span class="hidden 500:inline mx-0.5 opacity-60">•</span>
          <!-- Título do painel administrativo (com tradução e responsividade) -->
          <span class="opacity-90">
            {{ t('admin.footer.admin_panel') }}
          </span>
        </div>

        <!-- Seção do indicador de status do sistema -->
        <div
          class="flex items-center gap-0.25 text-xs text-accent-text-color"
          aria-live="polite"
        >
          <!-- Animação do status (círculo com pulsação) -->
          <span class="relative flex h-0.5 w-0.5 mr-0.5" aria-hidden="true">
            <!-- Animação de pulsação -->
            <span
              class="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"
            ></span>
            <!-- Círculo central do status -->
            <span
              class="relative inline-flex h-0.5 w-0.5 rounded-full bg-green-500 shadow-sm"
            ></span>
          </span>
          <!-- Texto do status -->
          <span class="font-medium">{{ t('admin.footer.system_status') }}</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
  import { computed } from 'vue' // Importa a função 'computed' do Vue para propriedades reativas
  import { useI18n } from 'vue-i18n' // Importa o hook 'useI18n' para internacionalização

  // Inicializa a função de tradução
  const { t } = useI18n()

  /**
   * @property {number} currentYear - Uma propriedade computada que retorna o ano atual.
   * Isso garante que o ano no copyright seja sempre atualizado automaticamente.
   */
  const currentYear = computed(() => new Date().getFullYear())
</script>
