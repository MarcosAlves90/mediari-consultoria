<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useScreenWidth } from '@/utils/useScreenWidth'

  const { t } = useI18n()
  const localePath = useLocalePath()
  const route = useRoute()
  const screenWidth = useScreenWidth()

  interface Props {
    isNavbarSmall: boolean
    onNavClick: (link: { section?: string; href?: string }) => void
  }

  const { onNavClick } = defineProps<Props>()

  const hamburguerMenuOpen = ref(false)

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

  // Links combinados: home + seções + "trabalhe conosco" (seções primeiro)
  const links = computed<
    Array<{ label: string; section?: string; href?: string }>
  >(() => {
    const home = [{ label: t('navbar.home'), section: 'banner-section' }]

    const sections = [
      { label: t('navbar.services'), section: 'services-section' },
      { label: t('navbar.enterprise'), section: 'enterprise-section' },
      { label: t('navbar.socialAction'), section: 'social-action-section' },
      { label: t('navbar.founder'), section: 'seo-section' },
      { label: t('navbar.team'), section: 'team-section' },
      { label: t('navbar.contact'), section: 'contact-section' },
    ]

    const careers = [{ label: t('navbar.careers'), href: '/trabalhe-conosco' }]

    // Ordem desejada: home, seções..., trabalhe-conosco
    return [...home, ...sections, ...careers]
  })

  const handleNavClick = (link: { section?: string; href?: string }) => {
    onNavClick(link)
    hamburguerMenuOpen.value = false
  }

  const toggleHamburguerMenu = () => {
    hamburguerMenuOpen.value = !hamburguerMenuOpen.value
  }

  defineExpose({
    hamburguerMenuOpen,
    toggleHamburguerMenu,
  })
</script>

<template>
  <template v-if="screenWidth < 1024">
    <button
      class="app-header__hamburguer-menu common-button text-[1.5rem]"
      :class="{
        'app-header__hamburguer-menu--open bg-accent-color-2':
          hamburguerMenuOpen,
      }"
      @click="toggleHamburguerMenu"
      :aria-label="
        hamburguerMenuOpen
          ? 'Fechar menu de navegação'
          : 'Abrir menu de navegação'
      "
    >
      <!-- Container com tamanho fixo para evitar 'jump' quando o ícone ainda não carregou -->
      <div
        class="app-header__hamburguer-menu-icon-container w-[30px] h-[30px] relative"
        key="icon-wrap"
      >
        <!-- Ambos ícones montados; alternamos visibilidade por classes para animar opacidade sem alterar layout -->
        <Icon
          :class="[
            'app-header__hamburguer-menu-icon icon-fade absolute inset-0 m-auto w-full h-full',
            { 'is-hidden': hamburguerMenuOpen },
          ]"
          name="mdi:menu"
          aria-hidden="true"
          key="menu"
        />

        <Icon
          :class="[
            'app-header__hamburguer-menu-icon icon-fade absolute inset-0 m-auto w-full h-full',
            { 'is-hidden': !hamburguerMenuOpen },
          ]"
          name="mdi:close"
          aria-hidden="true"
          key="close"
        />
      </div>
    </button>

    <Transition name="slide-fade-nav">
      <nav
        v-show="hamburguerMenuOpen"
        class="app-header__nav app-header__nav--mobile flex absolute top-full shadow-lg left-0 right-0 flex-col gap-1 p-1 overflow-hidden border-t-2 border-b-2 max-h-[500px] opacity-100 visible"
        :class="{
          'bg-body-bg/95 border-accent-color': isHomePage,
          'border-gray-400': !isHomePage,
        }"
      >
        <!-- Links (home, seções..., trabalhe-conosco) no mobile -->
        <a
          v-for="(link, idx) in links"
          :key="`mobile-nav-${idx}`"
          :href="link.href ? localePath(link.href) : '#' + link.section"
          @click.prevent="handleNavClick(link)"
          class="box-border w-full rounded-sm border-2 px-1 py-0.5 text-center text-base no-underline max-md:text-sm"
          :class="{
            'border-accent-color hover:bg-accent-color-2': isHomePage,
            'border-gray-400 hover:bg-gray-100': !isHomePage,
          }"
        >
          {{ link.label }}
        </a>
      </nav>
    </Transition>
  </template>
</template>

<style scoped>
  .app-header__hamburguer-menu-icon {
    transition: font-size 0.2s ease-in-out;
  }

  /* Mantém tamanho do container e faz fade/scale suave dos ícones sem reflow */
  .app-header__hamburguer-menu-icon-container {
    display: inline-block;
    line-height: 0; /* remove espaço extra */
  }

  .icon-fade {
    transition:
      opacity 0.18s ease,
      transform 0.18s ease;
    will-change: opacity, transform;
    opacity: 1;
    transform: scale(1);
  }

  .icon-fade.is-hidden {
    opacity: 0;
    transform: scale(0.95);
    pointer-events: none;
  }

  .slide-fade-nav-enter-active,
  .slide-fade-nav-leave-active {
    transition:
      opacity 0.2s,
      max-height 0.2s;
    will-change: opacity, max-height;
  }

  .slide-fade-nav-enter-from,
  .slide-fade-nav-leave-to {
    opacity: 0;
    max-height: 0;
  }

  .slide-fade-nav-enter-to,
  .slide-fade-nav-leave-from {
    opacity: 1;
    max-height: 500px;
  }

  .icon-morph-enter-active,
  .icon-morph-leave-active {
    transition:
      opacity 0.2s,
      filter 0.2s,
      border-radius 0.2s,
      transform 0.2s;
  }

  .icon-morph-enter-from,
  .icon-morph-leave-to {
    opacity: 0;
    filter: blur(6px);
    border-radius: 50%;
    transform: scale(0.7) rotate(-90deg);
  }

  .icon-morph-enter-to,
  .icon-morph-leave-from {
    opacity: 1;
    filter: blur(0);
    border-radius: 0;
    transform: scale(1) rotate(0deg);
  }
</style>
