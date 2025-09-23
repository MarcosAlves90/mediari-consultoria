<template>
  <div
    class="rounded"
    :class="['skeleton', rounded ? 'rounded' : '', customClass]"
    :style="{ width: width, height: height }"
  ></div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  // width/height can be a CSS string (e.g. '66%', '20px') or a number
  // representing multiples of the project's spacing variable `--spacing`.
  interface Props {
    width?: string | number
    height?: string | number
    rounded?: boolean
    customClass?: string
  }

  const props = defineProps<Props>()

  const formatSize = (value: string | number | undefined, fallback: string) => {
    // fallback uses 1rem so component behaves even if --spacing is not defined
    const spacingFallback = '1rem'
    if (value === undefined || value === null) return fallback
    if (typeof value === 'number') {
      return `calc(var(--spacing, ${spacingFallback}) * ${value})`
    }
    // if string contains only a number, treat it as multiple of spacing
    if (/^\d+(\.\d+)?$/.test(value)) {
      return `calc(var(--spacing, ${spacingFallback}) * ${value})`
    }
    // otherwise assume it's a valid CSS size (%, px, rem, etc.)
    return value
  }

  const width = computed(() => formatSize(props.width, '100%'))
  const height = computed(() =>
    formatSize(props.height, 'calc(var(--spacing, 1rem) * 1)')
  )
  const rounded = computed(() => props.rounded ?? true)
  const customClass = computed(() => props.customClass ?? '')
</script>

<style scoped>
  .skeleton {
    background-color: #cbcbcb;
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
