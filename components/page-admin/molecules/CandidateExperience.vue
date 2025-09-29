<template>
  <div class="bg-body-bg-dark rounded border-2 border-accent-color">
    <div class="p-1.5">
      <h3 class="text-lg font-semibold text-primary-text mb-0.75">
        {{ t('careers.form.experience') }}
      </h3>
      <div class="prose prose-xs max-w-none">
        <p class="text-sm text-primary-text whitespace-pre-wrap">
          {{ experience }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  interface Props {
    experience: string
  }

  defineProps<Props>()
  const { t } = useI18n()
</script>

<style scoped>
  .prose p {
    margin-bottom: 1rem;
  }

  .prose p:last-child {
    margin-bottom: 0;
  }
</style>
