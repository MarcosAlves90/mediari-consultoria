<script setup lang="ts">
  import { useGoTo } from '@/utils/useGoTo'

  const { goTo } = useGoTo()
  import { useLocalePathSafe } from '~/composables/useLocalePathSafe'
  const localePath = useLocalePathSafe()

  interface Props {
    isNavbarSmall: boolean
  }

  defineProps<Props>()
</script>

<template>
  <div
    class="app-header__logo-box flex items-center justify-center gap-1 cursor-pointer text-accent-color"
    @click="goTo(localePath('/'))"
  >
    <Icon
      class="app-header__logo-box-icon text-[3.5rem] transition-[font-size] duration-200 ease-in-out"
      :class="{ '!text-[3.2rem]': isNavbarSmall }"
      name="my-icon:mediari-logo"
    />
    <Icon
      class="app-header__logo-box-text text-[2.2rem] transition-[font-size] duration-200 ease-in-out max-300:hidden"
      :class="{ '!text-[2rem]': isNavbarSmall }"
      name="my-icon:mediari-logo-texto"
    />
  </div>
</template>
