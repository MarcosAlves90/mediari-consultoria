<script setup lang="ts">
  import { useScreenWidth } from '@/utils/useScreenWidth'

  const screenWidth = useScreenWidth()

  interface Props {
    isNavbarSmall: boolean
  }

  defineProps<Props>()

  interface ContactLink {
    href: string
    icon: string
    text: string
    target: string
    rel: string
    show: () => boolean
  }

  const contactLinks: ContactLink[] = [
    {
      href: 'mailto:contato@mediari.com.br',
      icon: 'mdi:email-outline',
      text: 'contato@mediari.com.br',
      target: '',
      rel: '',
      show: () => true,
    },
    {
      href: 'https://www.instagram.com/mediari.consultoria',
      icon: 'mdi:instagram',
      text: '@mediari.consultoria',
      target: '_blank',
      rel: 'noopener noreferrer',
      show: () => true,
    },
    {
      href: 'https://www.linkedin.com/company/mediari-consultoria-empresarial-ltda',
      icon: 'mdi:linkedin',
      text: 'Mediari Consultoria',
      target: '_blank',
      rel: 'noopener noreferrer',
      show: () => true,
    },
    {
      href: 'tel:+551142273008',
      icon: 'mdi:phone-outline',
      text: '11 4227-3008',
      target: '',
      rel: '',
      show: () => screenWidth.value < 1280,
    },
  ]
</script>

<template>
  <div
    class="app-header__top flex items-center justify-center gap-1 bg-accent-color py-0.5 text-sm text-accent-text-color transition-[height] duration-200 ease-in-out max-md:justify-evenly"
    :class="{ 'app-header--small': isNavbarSmall }"
  >
    <template v-for="(link, idx) in contactLinks" :key="idx">
      <a
        v-if="link.show()"
        class="app-header__top-link flex cursor-pointer items-center gap-0.5 rounded-sm no-underline transition-colors duration-200 ease-in-out hover:bg-body-bg-2"
        :href="link.href"
        :target="link.target"
        :rel="link.rel"
        :aria-label="link.text"
      >
        <Icon
          class="app-header__top-link-icon text-[1.8rem] transition-[font-size] duration-200 ease-in-out max-lg:text-2xl"
          :name="link.icon"
        />
        <p
          class="m-0 max-lg:text-xs transition-[font-size] duration-200 ease-in-out"
          v-if="!(screenWidth < 768)"
        >
          {{ link.text }}
        </p>
      </a>
    </template>
  </div>
</template>

<style scoped>
  @media (min-width: 768px) {
    .app-header--small .app-header__top {
      padding: 6px 0;
    }
    .app-header--small .app-header__top-link-icon {
      font-size: 0;
    }
    .app-header--small .app-header__top-link p {
      font-size: 0;
    }
  }
</style>
