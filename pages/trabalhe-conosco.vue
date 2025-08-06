<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import CareersHero from "~/components/organisms/CareersHero.vue";
import JobApplicationForm from "~/components/organisms/JobApplicationForm.vue";
import ProfileTest from "~/components/organisms/ProfileTest.vue";
import CompletionScreen from "~/components/organisms/CompletionScreen.vue";

const { t } = useI18n();

// SEO Meta tags
useSeoMeta({
    title: `${t("careers.page_title")} - Mediari Consultoria`,
    description: t("careers.section_description"),
    ogTitle: `${t("careers.section_title")} - Mediari Consultoria`,
    ogDescription: t("careers.section_description"),
    ogImage: "/mediari-logo.svg",
});

// Current step state
const currentStep = ref<'form' | 'test' | 'completed'>('form');
const showSuccess = ref(false);

// Computed properties for hero content
const heroTitle = computed(() => {
    switch (currentStep.value) {
        case 'test':
            return t("careers.profile_test.title");
        case 'completed':
            return t("careers.profile_test.completion_title");
        default:
            return t("careers.section_title");
    }
});

const heroSubtitle = computed(() => {
    switch (currentStep.value) {
        case 'test':
            return t("careers.profile_test.subtitle");
        default:
            return t("careers.section_subtitle");
    }
});

const heroDescription = computed(() => {
    switch (currentStep.value) {
        case 'test':
            return t("careers.profile_test.description");
        default:
            return t("careers.section_description");
    }
});

// Event handlers
const onFormSubmitted = () => {
    showSuccess.value = true;
    currentStep.value = 'test';
};

const onTestCompleted = () => {
    currentStep.value = 'completed';
};

// Container classes
const container_classes = "py-4.5 px-4 max-lg:py-3.5 max-xl:px-2 max-md:py-2 max-md:px-1";
const profile_container = "max-w-70 w-full";
</script>

<template>
    <main class="careers-page">
        <!-- Hero Section -->
        <CareersHero
            :title="heroTitle"
            :subtitle="heroSubtitle"
            :description="heroDescription"
        />

        <!-- Main Content Section -->
        <section
            class="careers__form w-full flex justify-center items-center bg-body-bg-dark"
            role="region"
            aria-labelledby="form-heading"
        >
            <div
                :class="[
                    container_classes,
                    currentStep === 'test' ? profile_container : 'careers__form-content max-w-70 w-full',
                ]"
            >
                <!-- Job Application Form -->
                <JobApplicationForm
                    v-if="currentStep === 'form'"
                    :show-success="showSuccess"
                    @submitted="onFormSubmitted"
                />

                <!-- Profile Test -->
                <ProfileTest
                    v-else-if="currentStep === 'test'"
                    @completed="onTestCompleted"
                />

                <!-- Completion Screen -->
                <CompletionScreen v-else-if="currentStep === 'completed'" />
            </div>
        </section>
    </main>
</template>

<style scoped>
.careers-page {
    min-height: 100vh;
}
</style>
