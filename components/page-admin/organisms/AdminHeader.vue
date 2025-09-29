<template>
  <header class="bg-accent-color shadow-md">
    <div
      class="max-w-7xl mx-auto w-full px-0.5 500:px-1 870:px-1.5 py-1"
    >
      <div
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-1.5"
      >
        <div class="flex-1 min-w-0">
          <h1
            class="text-xl sm:text-2xl lg:text-xl font-semibold text-accent-text-color truncate"
          >
            {{ title }}
          </h1>
        </div>

        <div
          class="flex items-center gap-1 sm:gap-1.5 w-full sm:w-auto flex-shrink-0"
        >
          <slot name="actions" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  interface Props {
    title: string
  }

  defineProps<Props>()
</script>

<style scoped>
  header :deep(.common-button) {
    color: var(--color-accent-text-color);
    border-color: var(--color-accent-text-color);
  }

  header :deep(.common-button:hover) {
    background-color: var(--color-accent-text-color-20);
  }

  header :deep(.actions-text) {
    color: var(--color-accent-text-color);
  }
</style>
