<template>
    <section
        class="careers__hero w-full flex justify-center items-center"
        role="region"
        aria-labelledby="careers-heading"
        aria-describedby="careers-description"
    >
        <div
            :class="[
                container_classes,
                'careers__hero-content max-w-85 w-full text-center',
            ]"
        >
            <p id="careers-subtitle" :class="section_subtitle">
                {{ subtitle }}
            </p>
            <h1 id="careers-heading" :class="section_title">
                {{ title }}
            </h1>
            <p id="careers-description" :class="section_description">
                {{ description }}
            </p>
        </div>
    </section>
</template>

<script setup lang="ts">
interface Props {
    title: string;
    subtitle: string;
    description: string;
}

defineProps<Props>();

// CSS classes
const container_classes = "py-4.5 px-4 max-lg:py-3.5 max-xl:px-2 max-md:py-2 max-md:px-1 flex items-center justify-center flex-col";
const section_title = "text-4xl text-primary-text max-md:text-center max-md:text-2xl";
const section_subtitle = "font-scheherazade text-xl font-bold text-accent-color max-md:text-center max-md:text-lg";
const section_description = "mt-0.5 text-base text-secondary-text max-md:text-justify max-md:text-sm max-w-60";
</script>

<style scoped>
.careers__hero {
    padding-top: calc(88px + 44.8px);
}

@media (max-width: 768px) {
    .careers__hero {
        padding-top: calc(88px + 40px);
    }
}
</style>
