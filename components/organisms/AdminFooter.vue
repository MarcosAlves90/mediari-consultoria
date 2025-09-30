<template>
  <footer
    role="contentinfo"
    :aria-label="t('admin.footer.aria_label')"
    class="bg-accent-color text-accent-text-color border-t border-accent-color-3"
  >
    <div
      class="max-w-7xl mx-auto px-0.5 300:px-0.75 500:px-1 870:px-1.5 py-0.75 500:py-1"
    >
      <div
        class="flex flex-col 500:flex-row items-center justify-between gap-0.75 500:gap-0"
      >
        <div
          class="flex items-center text-xs 500:text-sm text-accent-text-color"
        >
          <span class="font-medium"
            >© {{ currentYear }} Mediari Consultoria</span
          >
          <span class="hidden 500:inline mx-0.5 opacity-60">•</span>
          <span class="opacity-90 max-500:hidden">
            {{ t('admin.footer.admin_panel') }}
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  /**
   * @property {number} currentYear - Uma propriedade computada que retorna o ano atual.
   * Isso garante que o ano no copyright seja sempre atualizado automaticamente.
   */
  const currentYear = computed(() => new Date().getFullYear())
</script>
