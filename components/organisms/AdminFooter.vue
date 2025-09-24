<template>
  <footer
    role="contentinfo"
    aria-label="Rodapé do painel administrativo"
    class="bg-accent-color text-accent-text-color border-t border-accent-color-3"
  >
    <div
      class="max-w-7xl mx-auto px-0.5 300:px-0.75 500:px-1 870:px-1.5 py-0.75 500:py-1"
    >
      <div
        class="flex flex-col 500:flex-row items-center justify-between gap-0.75 500:gap-0"
      >
        <!-- Info principal -->
        <div
          class="flex items-center text-xs 500:text-sm text-accent-text-color"
        >
          <span class="font-medium"
            >© {{ currentYear }} Mediari Consultoria</span
          >
          <span class="hidden 500:inline mx-0.5 opacity-60">•</span>
          <span class="opacity-90">
            <span class="hidden 500:inline">{{
              t('admin.footer.admin_panel')
            }}</span>
            <span class="500:hidden">Admin Panel</span>
          </span>
        </div>

        <!-- Indicador de status -->
        <div
          class="flex items-center gap-0.25 text-xs text-accent-text-color"
          aria-live="polite"
        >
          <span class="relative flex h-0.5 w-0.5 mr-0.5" aria-hidden="true">
            <span
              class="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"
            ></span>
            <span
              class="relative inline-flex h-0.5 w-0.5 rounded-full bg-green-500 shadow-sm"
            ></span>
          </span>
          <span class="font-medium">Sistema Online</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const currentYear = computed(() => new Date().getFullYear())
</script>
