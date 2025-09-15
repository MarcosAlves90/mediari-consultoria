<template>
  <div
    :class="['skeleton', rounded ? 'rounded' : '', customClass]"
    :style="{ width: width, height: height }"
  ></div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  interface Props {
    width?: string
    height?: string
    rounded?: boolean
    customClass?: string
  }

  const props = defineProps<Props>()

  const width = computed(() => props.width ?? '100%')
  const height = computed(() => props.height ?? '1rem')
  const rounded = computed(() => props.rounded ?? true)
  const customClass = computed(() => props.customClass ?? '')
</script>

<style scoped>
  .skeleton {
    background-color: #e6e6e6;
    animation: pulse 1.2s ease-in-out infinite;
  }

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
    100% {
      opacity: 1;
    }
  }
</style>
