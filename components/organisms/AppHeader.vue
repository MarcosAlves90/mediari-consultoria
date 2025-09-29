<script setup lang="ts">
  import { ref, onMounted, onUnmounted, computed } from 'vue'
  import { useScrollToSection } from '@/utils/useScrollToSection'
  import { useGoTo } from '@/utils/useGoTo'
  import TopBar from './header/TopBar.vue'
  import Logo from './header/Logo.vue'
  import DesktopNav from './header/DesktopNav.vue'
  import MobileNav from './header/MobileNav.vue'

  const scrollToSection = useScrollToSection()
  const { goTo } = useGoTo()

  const isNavbarSmall = ref(false)
  const mobileNavRef = ref<InstanceType<typeof MobileNav>>()

  import { useLocalePathSafe } from '~/composables/useLocalePathSafe'
  const localePath = useLocalePathSafe()
  const route = useRoute()

  // Verifica se está na página inicial
  const isHomePage = computed(() => {
    const currentPath = route.path
    const homePath = localePath('/')
    return (
      currentPath === homePath ||
      currentPath === '/' ||
      currentPath === '/pt-br' ||
      currentPath === '/en-us'
    )
  })

  const handleNavClick = async (link: { section?: string; href?: string }) => {
    if (link.href) {
      // Para links com href, usa o localePath para garantir o locale correto
      const localizedPath = localePath(link.href)
      goTo(localizedPath)
    } else if (link.section) {
      // Se não estiver na página inicial, vai para a página inicial primeiro
      const currentPath = window.location.pathname
      const homePath = localePath('/')

      if (currentPath !== homePath) {
        await goTo(homePath)
        // Aguarda a página carregar e então rola para a seção
        setTimeout(() => {
          scrollToSection(link.section!)
        }, 100)
      } else {
        // Se já estiver na página inicial, apenas rola para a seção
        scrollToSection(link.section)
      }
    }
  }

  const handleScroll = () => {
    isNavbarSmall.value = window.scrollY > 200
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
</script>

<template>
  <header
    class="app-header fixed top-0 right-0 left-0 z-99 border-b-2 transition-colors duration-200 ease-in-out"
    :class="{
      'app-header--small': isNavbarSmall,
      'border-accent-color': isNavbarSmall,
      'border-body-bg-dark': !isHomePage && !isNavbarSmall,
      'border-transparent': isHomePage && !isNavbarSmall,
    }"
  >
    <TopBar :is-navbar-small="isNavbarSmall" />
    <div
      class="app-header__bottom flex items-center justify-center transition duration-200 ease-in-out"
      :class="{
        '!backdrop-blur-md bg-body-bg-67': isNavbarSmall && isHomePage,
        '!bg-body-bg': isNavbarSmall && !isHomePage,
        'backdrop-blur-xs bg-body-bg-67': !isNavbarSmall && isHomePage,
        'bg-body-bg': !isNavbarSmall && !isHomePage,
      }"
    >
      <div
        class="app-header__group flex w-full max-w-85 items-center justify-between px-4 py-1 text-base max-xl:px-2 max-lg:flex-wrap max-md:px-1"
      >
        <Logo :is-navbar-small="isNavbarSmall" />
        <DesktopNav
          :is-navbar-small="isNavbarSmall"
          :on-nav-click="handleNavClick"
        />
        <MobileNav
          ref="mobileNavRef"
          :is-navbar-small="isNavbarSmall"
          :on-nav-click="handleNavClick"
        />
      </div>
    </div>
  </header>
</template>

<style scoped>
  /* Estilos movidos para os componentes filhos */
</style>
