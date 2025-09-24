<template>
  <div class="admin-layout min-h-[calc(100vh-64px)] mt-[64px] bg-body-bg flex flex-col">
    <!-- Admin Navbar -->
    <AdminNavbar />

    <!-- Main Content -->
    <main class="flex-1 relative">
      <div class="relative z-10">
        <slot />
      </div>
    </main>

    <!-- Admin Footer -->
    <footer class="bg-accent-color py-1.5 500:py-2">
      <div class="max-w-7xl mx-auto px-1 300:px-1.5 500:px-2 870:px-3">
        <div
          class="flex flex-col 500:flex-row items-center justify-between gap-1 500:gap-0"
        >
          <div
            class="text-center 500:text-left text-xs 500:text-sm text-accent-text-color"
          >
            <span class="font-medium"
              >© {{ currentYear }} Mediari Consultoria</span
            >
            <span class="hidden 500:inline mx-1">•</span>
            <span>
              <span class="hidden 500:inline">{{
                t('admin.footer.admin_panel')
              }}</span>
              <span class="500:hidden">Admin Panel</span>
            </span>
          </div>

          <!-- Status indicator -->
          <div class="flex items-center text-xs text-accent-text-color">
            <div
              class="w-0.5 h-0.5 bg-green-500 rounded mr-0.5 animate-pulse shadow-sm"
            ></div>
            <span class="font-medium">Sistema Online</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import AdminNavbar from '~/components/organisms/adminNavbar/AdminNavbar.vue'

  const { t } = useI18n()

  const currentYear = computed(() => new Date().getFullYear())
</script>
