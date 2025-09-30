<template>
  <div>
    <label class="block text-sm font-medium text-secondary-text mb-0.25">{{
      label
    }}</label>
    <p class="text-primary-text break-all">{{ value }}</p>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    label: string
    value: string
  }

  defineProps<Props>()
</script>
