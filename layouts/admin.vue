<script setup lang="ts">
  import AdminNavbar from '~/components/organisms/AdminNavbar.vue'
  import AdminFooter from '~/components/organisms/AdminFooter.vue'
</script>

<template>
  <!-- Admin Navbar -->
  <AdminNavbar />

  <!-- Main Content -->
  <main
    class="flex-1 relative admin-layout min-h-[calc(100vh-64px)] mt-[64px] bg-body-bg flex flex-col"
  >
    <slot />
  </main>

  <!-- Admin Footer -->
  <AdminFooter />
</template>
