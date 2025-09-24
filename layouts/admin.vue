<template>
  <div
    class="admin-layout min-h-[calc(100vh-64px)] mt-[64px] bg-body-bg flex flex-col"
  >
    <!-- Admin Navbar -->
    <AdminNavbar />

    <!-- Main Content -->
    <main class="flex-1 relative">
      <div class="relative z-10">
        <slot />
      </div>
    </main>

    <!-- Admin Footer -->
    <AdminFooter />
  </div>
</template>

<script setup lang="ts">
  import AdminNavbar from '~/components/organisms/AdminNavbar.vue'
  import AdminFooter from '~/components/organisms/AdminFooter.vue'
</script>
