<template>
    <div :class="completion_container">
        <div class="mb-2">
            <svg class="w-16 h-16 text-green-500 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
        </div>

        <h2 :class="completion_title">
            {{ t("careers.profile_test.completion_title") }}
        </h2>

        <p :class="completion_message">
            {{ t("careers.profile_test.completion_message") }}
        </p>

        <button
            @click="goToHome"
            :class="home_button"
        >
            {{ t("careers.profile_test.return_home") }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const goToHome = () => {
    navigateTo('/');
};

// Completion screen styling
const completion_container = "text-center py-2 max-w-70 w-full bg-body-bg-dark rounded-sm border border-gray-600 p-8 max-md:p-4";
const completion_title = "text-2xl text-primary-text mb-1 max-md:text-xl";
const completion_message = "text-base text-secondary-text mb-2 max-md:text-sm";
const home_button = "common-button mx-auto px-2 py-0.75";
</script>

<style scoped>
/* Completion screen styling */
.completion-container {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 3rem 2rem;
}

@media (max-width: 1024px) {
    .completion-container {
        padding: 1.5rem;
    }
}

@media (max-width: 768px) {
    .completion-container {
        padding: 1rem;
        background: transparent;
        border: none;
    }
}
</style>
