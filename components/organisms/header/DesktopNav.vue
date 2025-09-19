<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useContacts } from '@/utils/useContacts'
  import { useScreenWidth } from '@/utils/useScreenWidth'

  const { t } = useI18n()
  const localePath = useLocalePath()
  const { openPhoneDialer } = useContacts()
  const screenWidth = useScreenWidth()

  interface Props {
    isNavbarSmall: boolean
    onNavClick: (link: { section?: string; href?: string }) => void
  }

  const { onNavClick } = defineProps<Props>()

  const sectionsDropdownOpen = ref(false)

  const navLinks = computed(() => [
    { label: t('navbar.home'), section: 'banner-section' },
    { label: t('navbar.careers'), href: '/trabalhe-conosco' },
  ])

  const sectionLinks = computed(() => [
    { label: t('navbar.services'), section: 'services-section' },
    { label: t('navbar.enterprise'), section: 'enterprise-section' },
    { label: t('navbar.founder'), section: 'seo-section' },
    { label: t('navbar.team'), section: 'team-section' },
    { label: t('navbar.socialAction'), section: 'social-action-section' },
    { label: t('navbar.contact'), section: 'contact-section' },
  ])

  const handleNavClick = (link: { section?: string; href?: string }) => {
    onNavClick(link)
    sectionsDropdownOpen.value = false
  }

  const toggleSectionsDropdown = () => {
    sectionsDropdownOpen.value = !sectionsDropdownOpen.value
  }

  const closeSectionsDropdown = () => {
    sectionsDropdownOpen.value = false
  }

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Element
    if (sectionsDropdownOpen.value && !target.closest('.relative')) {
      sectionsDropdownOpen.value = false
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
</script>

<template>
  <nav
    class="app-header__nav app-header__nav--desktop flex items-center justify-center gap-[2.8rem]"
    v-if="screenWidth >= 1024"
  >
    <a
      v-for="(link, idx) in navLinks"
      :key="`desktop-nav-${idx}`"
      :href="link.href ? localePath(link.href) : '#' + link.section"
      @click.prevent="handleNavClick(link)"
      class="after:absolute after:bottom-[-3px] after:left-1/2 after:-translate-x-1/2 after:w-0 after:bg-accent-color after:content-[''] after:h-[2px] hover:after:w-full no-underline"
    >
      {{ link.label }}
    </a>

    <!-- Dropdown de Seções -->
    <div class="relative">
      <button
        @click="toggleSectionsDropdown"
        class="flex items-center gap-1 bg-transparent border-none cursor-pointer text-primary-text-color"
      >
        Seções
        <Icon
          name="mdi:chevron-down"
          class="text-[1.2rem] transition-transform duration-200"
          :class="{ 'rotate-180': sectionsDropdownOpen }"
        />
      </button>

      <Transition name="dropdown-fade">
        <div
          v-show="sectionsDropdownOpen"
          class="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 rounded bg-body-bg shadow-lg border-2 z-50 transition duration-200 ease-in-out"
          @click="closeSectionsDropdown"
        >
          <div class="h-0.5 bg-accent-color"/>
          <a
            v-for="(link, idx) in sectionLinks"
            :key="`sections-${idx}`"
            :href="'#' + link.section"
            @click.prevent="handleNavClick(link)"
            class="block px-4 py-1 text-sm text-gray-700 hover:bg-accent-color/20 hover:text-accent-color transition-colors duration-200 no-underline"
          >
            {{ link.label }}
          </a>
          <div class="h-0.5 bg-accent-color"/>
        </div>
      </Transition>
    </div>

    <button
      v-if="screenWidth >= 1280"
      class="app-header__nav-button common-button"
      @click.prevent="openPhoneDialer"
      aria-label="Ligar para 11 4227-3008"
    >
      <Icon
        class="app-header__nav-button-icon text-[1.3rem]"
        name="mdi:phone-outline"
      />
      11 4227-3008
    </button>
  </nav>
</template>

<style scoped>
  .app-header__nav {
    transition: font-size 0.2s ease-in-out;
  }

  .app-header__nav a {
    position: relative;
    color: var(--color-primary-text);
  }

  .app-header__nav--desktop a::after {
    transition: width 0.2s ease-in-out;
  }

  .dropdown-fade-enter-active,
  .dropdown-fade-leave-active {
    transition:
      opacity 0.2s ease-in-out,
      transform 0.2s ease-in-out;
  }

  .dropdown-fade-enter-from,
  .dropdown-fade-leave-to {
    opacity: 0;
    transform: translateY(-8px) scale(0.95);
  }

  .dropdown-fade-enter-to,
  .dropdown-fade-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
</style>
