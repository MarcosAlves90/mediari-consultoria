<script setup lang="ts">
import HeroSection from '@/components/organisms/HeroSection.vue';
import ServicesSection from '@/components/organisms/ServicesSection.vue';
import CompanySection from '@/components/organisms/CompanySection.vue';
import CEOSection from '@/components/organisms/CEOSection.vue';
import TeamSection from '@/components/organisms/TeamSection.vue';
import ContactSection from '@/components/organisms/ContactSection.vue';
</script>

<template>
    <main class="homepage">
        <HeroSection />
        <ServicesSection />
        <CompanySection />
        <CEOSection />
        <TeamSection />
        <ContactSection />
    </main>
</template>

<style scoped>
/* Estilos específicos da homepage foram movidos para os componentes individuais */
</style>
