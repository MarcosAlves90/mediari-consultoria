<template>
  <header class="bg-accent-color shadow-md">
    <div
      class="max-w-7xl mx-auto px-1 sm:px-1.5 lg:px-2 py-1 sm:py-1.5 lg:py-2"
    >
      <div
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-1.5"
      >
        <div class="flex-1 min-w-0">
          <h1
            class="text-xl sm:text-2xl lg:text-xl font-bold text-accent-text-color truncate"
          >
            {{ title }}
          </h1>
          <p
            v-if="description"
            class="text-sm sm:text-base lg:text-sm text-accent-text-color/90 mt-0.5 line-clamp-2"
          >
            {{ description }}
          </p>
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
    description?: string
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
