<template>
    <main class="admin-login-page min-h-screen bg-body-bg flex items-center justify-center p-4 max-lg:px-2 max-md:px-1">
        <AdminLogin />
    </main>
</template>

<script setup lang="ts">
import { AdminLogin } from "~/components/page-admin";

/**
 * Configura as meta tags de SEO para a página de login administrativa.
 *
 * Título: Login
 * Descrição: Painel administrativo da Mediari Consultoria
 * Robots: noindex, nofollow (páginas administrativas não devem ser indexadas)
 */
useSeoMeta({
    title: "Login",
    description: "Painel administrativo da Mediari Consultoria",
    robots: "noindex, nofollow",
});

/**
 * Define o layout padrão para a página de login do painel administrativo.
 */
definePageMeta({
    layout: 'default'
});
</script>
