<template>
  <div class="admin-header bg-accent-color">
    <!-- Container responsivo com padding adaptativo -->
    <div
      class="max-w-7xl mx-auto px-0.5 300:px-0.75 500:px-1 870:px-1.5 py-0.75 500:py-1 870:py-1.5"
    >
      <!-- Layout flexível que se adapta aos breakpoints -->
      <div
        class="flex flex-col 500:flex-row items-start 500:items-center justify-between gap-0.75 500:gap-1"
      >
        <!-- Seção do título e descrição -->
        <div class="flex-1 min-w-0">
          <h1
            class="text-lg 500:text-xl 870:text-xl font-bold text-white truncate"
          >
            {{ title }}
          </h1>
          <p
            v-if="description"
            class="text-xs 500:text-sm text-secondary-text mt-0.25 line-clamp-2 500:line-clamp-1"
          >
            {{ description }}
          </p>
        </div>

        <!-- Seção de ações com layout responsivo -->
        <div
          class="flex items-center gap-0.5 500:gap-1 w-full 500:w-auto flex-shrink-0"
        >
          <slot name="actions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    title: string
    description?: string
  }

  defineProps<Props>()
</script>
