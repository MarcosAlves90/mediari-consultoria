<template>
    <div :class="containerClass">
        <div
            v-for="i in max"
            :key="i"
            :class="[
                'rounded-full transition-colors duration-200',
                barClass,
                i <= value ? activeBarClass : inactiveBarClass
            ]"
        ></div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
    value: number;
    max: number;
    size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
    size: 'md'
});

const containerClass = computed(() => {
    return 'flex items-center gap-0.25';
});

const barClass = computed(() => {
    switch (props.size) {
        case 'sm':
            return 'w-0.5 h-0.5';
        case 'lg':
            return 'w-1 h-1';
        default:
            return 'w-0.75 h-0.75';
    }
});

const activeBarClass = computed(() => {
    if (props.value >= 4) return 'bg-green-500';
    if (props.value === 3) return 'bg-yellow-500';
    return 'bg-red-500';
});

const inactiveBarClass = computed(() => {
    return 'bg-gray-200';
});
</script>
