<script setup lang="ts">
import { AdminLogin } from "~/components/page-admin";

useSeoMeta({
    title: "Login",
    description: "Painel administrativo da Mediari Consultoria",
    robots: "noindex, nofollow",
});

definePageMeta({
    layout: 'default',
    middleware: 'guest-to-admin'
});
</script>

<template>
    <main class="admin-login-page min-h-screen bg-body-bg flex items-center justify-center p-4 max-lg:px-2 max-md:px-1">
        <AdminLogin />
    </main>
</template>
