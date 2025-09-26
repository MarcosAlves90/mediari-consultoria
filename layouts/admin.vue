<template>
  <!-- Admin Navbar -->
  <OrganismsAdminNavbar />

  <!-- Main Content -->
  <main
    class="flex-1 relative admin-layout min-h-[calc(100vh-64px)] mt-[64px] bg-body-bg flex flex-col"
  >
    <slot />
  </main>

  <!-- Admin Footer -->
  <OrganismsAdminFooter />
</template>
