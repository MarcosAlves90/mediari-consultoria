<script setup lang="ts">
import HeroSection from '~/components/page-index/organisms/HeroSection.vue';
import ServicesSection from '~/components/page-index/organisms/ServicesSection.vue';
import CompanySection from '~/components/page-index/organisms/CompanySection.vue';
import CEOSection from '~/components/page-index/organisms/CEOSection.vue';
import TeamSection from '~/components/page-index/organisms/TeamSection.vue';
import SocialActionSection from '~/components/page-index/organisms/SocialActionSection.vue';
import ContactSection from '~/components/page-index/organisms/ContactSection.vue';
</script>

<template>
    <main class="homepage">
        <HeroSection />
        <ServicesSection />
        <CompanySection />
        <CEOSection />
        <TeamSection />
        <SocialActionSection />
        <ContactSection />
    </main>
</template>
