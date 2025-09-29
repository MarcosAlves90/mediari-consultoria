<script setup lang="ts">
  import { useGoTo } from '@/utils/useGoTo'
  import { useScreenWidth } from '@/utils/useScreenWidth'
  import { useScrollToSection } from '@/utils/useScrollToSection'
  import { useContacts } from '@/utils/useContacts'
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  const { t, locale, locales } = useI18n()
  const router = useRouter()
  const switchLocalePath = useSwitchLocalePath()

  const { goTo } = useGoTo()
  const screenWidth = useScreenWidth()
  const scrollToSection = useScrollToSection()
  const { openPhoneDialer, openLinkInBrowser, openMailTo } = useContacts()

  const footerHighlights = computed(() => [
    {
      icon: 'mdi:shield-outline',
      title: t('footer.highlights[0].title'),
      desc: t('footer.highlights[0].desc'),
    },
    {
      icon: 'mdi:star-outline',
      title: t('footer.highlights[1].title'),
      desc: t('footer.highlights[1].desc'),
    },
    {
      icon: 'mdi:shield-home-outline',
      title: t('footer.highlights[2].title'),
      desc: t('footer.highlights[2].desc'),
    },
  ])

  const footerNavLinks = computed(() => [
    { label: t('navbar.home'), section: 'banner-section' },
    { label: t('navbar.services'), section: 'services-section' },
    { label: t('navbar.enterprise'), section: 'enterprise-section' },
    { label: t('navbar.founder'), section: 'seo-section' },
    { label: t('navbar.team'), section: 'team-section' },
    { label: t('navbar.socialAction'), section: 'social-action-section' },
    { label: t('navbar.contact'), section: 'contact-section' },
    { label: t('navbar.careers'), href: '/trabalhe-conosco' },
  ])

  const footerAreasGroups = computed(() => [
    [
      { label: t('services.secondary[0].title') },
      { label: t('services.secondary[1].title') },
      { label: t('services.secondary[2].title') },
      { label: t('services.main[0].title') },
      { label: t('services.main[1].title') },
    ],
    [
      { label: t('services.main[3].title') },
      { label: t('services.main[2].title') },
    ],
  ])

  const availableLocales = locales.value

  import { useLocalePathSafe } from '~/composables/useLocalePathSafe'
  const localePath = useLocalePathSafe()

  const handleFooterNavClick = (link: { section?: string; href?: string }) => {
    if (link.href) {
      // Para links com href, usa o localePath para garantir o locale correto
      const localizedPath = localePath(link.href)
      goTo(localizedPath)
    } else if (link.section) {
      scrollToSection(link.section)
    }
  }

  const changeLanguage = async (newLocale: 'pt-br' | 'en-us') => {
    if (locale.value !== newLocale) {
      // Usa switchLocalePath para navegar para a mesma página no novo idioma
      const localizedPath = switchLocalePath(newLocale)
      await router.push(localizedPath)
    }
  }

  const footer__location_display =
    'footer__location-display flex justify-center items-center flex-row gap-0 box-border w-full'
  const footer__container_util =
    'max-w-85 w-full max-xl:max-w-full max-xl:px-2 max-md:px-1'
  const footer__bottom_paragraph = 'text-body-bg text-sm max-lg:text-xs'
  const footer__contact_btn_util =
    'footer__contact-btn common-button text-base !text-body-bg !border-body-bg hover:!bg-body-bg-25 max-lg:text-sm'
  const footer__contact_btn_icon = 'text-[1.3rem] max-xl:text-[1.2rem]'
  const footer__nav_section_util =
    'flex flex-col gap-2 min-w-12 text-body-bg max-xl:w-1/2 max-lg:w-full'
  const footer__nav_ul_util = 'list-none p-0 m-0 flex flex-col gap-1'
  const footer__nav_a_util =
    'rounded-sm p-[0.1rem] text-base no-underline transition-colors duration-200 hover:bg-accent-text-color-20 max-lg:text-sm'
  const footer__nav_title = 'text-xl border-b-2 border-body-bg max-lg:text-lg'
</script>

<template>
  <footer
    class="bg-accent-color flex justify-center items-center flex-col gap-0"
  >
    <div :class="[footer__location_display, 'footer__main']">
      <div :class="[footer__container_util, 'footer__container py-2 px-4']">
        <div
          class="footer__header pb-2 border-b-2 border-accent-dark-color flex flex-row justify-between items-center max-xl:flex-col max-xl:gap-1.5 max-xl:pb-2"
        >
          <div
            class="footer__logo flex flex-row items-center justify-center gap-1 text-body-bg cursor-pointer"
            @click="goTo('/')"
          >
            <Icon
              class="text-[3.5em] transition-[font-size] duration-200"
              name="my-icon:mediari-logo"
            />
            <Icon
              class="text-[2.2em] transition-[font-size] duration-200"
              name="my-icon:mediari-logo-texto"
            />
          </div>
          <div
            class="footer__contacts flex flex-row items-center justify-center gap-1 max-lg:w-full max-lg:grid max-lg:grid-cols-2"
          >
            <button
              :class="footer__contact_btn_util"
              @click.prevent="
                () =>
                  openLinkInBrowser(
                    'https://www.linkedin.com/company/mediari-consultoria-empresarial-ltda'
                  )
              "
              aria-label="Abrir LinkedIn da Mediari"
            >
              <Icon :class="footer__contact_btn_icon" name="mdi:linkedin" />
              <p v-if="screenWidth < 1280 && !(screenWidth < 640)">
                Mediari Consultoria
              </p>
            </button>
            <button
              :class="footer__contact_btn_util"
              @click.prevent="openMailTo"
              aria-label="Enviar e-mail para contato@mediari.com.br"
            >
              <Icon
                :class="footer__contact_btn_icon"
                name="mdi:email-outline"
              />
              <p v-if="!(screenWidth < 640)">contato@mediari.com.br</p>
            </button>
            <button
              :class="footer__contact_btn_util"
              @click.prevent="
                () =>
                  openLinkInBrowser(
                    'https://www.instagram.com/mediari.consultoria'
                  )
              "
              aria-label="Abrir Instagram da Mediari"
            >
              <Icon :class="footer__contact_btn_icon" name="mdi:instagram" />
              <p v-if="!(screenWidth < 640)">@mediari.consultoria</p>
            </button>
            <button
              :class="footer__contact_btn_util"
              @click.prevent="openPhoneDialer"
              aria-label="Ligar para 11 4227-3008"
            >
              <Icon
                :class="footer__contact_btn_icon"
                name="mdi:phone-outline"
              />
              <p v-if="!(screenWidth < 640)">11 4227-3008</p>
            </button>
          </div>
        </div>
        <div
          class="footer__content pt-2 flex justify-center flex-row gap-4 items-stretch max-xl:flex-col max-xl:gap-2 max-xl:pt-1.5"
        >
          <div
            class="footer__highlights flex flex-col items-center justify-center gap-1.5 max-w-25 w-full max-xl:grid max-xl:grid-cols-3 max-xl:gap-1 max-xl:max-w-full max-lg:grid-cols-1"
          >
            <div
              v-for="(highlight, idx) in footerHighlights"
              :key="idx"
              class="footer__highlight box-border flex w-full flex-row items-center justify-center gap-1 rounded-sm bg-accent-dark-color p-1 text-body-bg transition-transform duration-200 hover:scale-105 max-xl:h-full max-xl:min-w-0 max-xl:flex-1 max-xl:basis-0 max-xl:hover:scale-102 max-lg:flex-col max-lg:text-center max-sm:flex-row"
            >
              <Icon
                class="footer__highlight-icon text-[3.5rem] max-xl:text-[3rem] max-lg:text-[2rem] max-sm:!hidden"
                :name="highlight.icon"
              />
              <div
                class="footer__highlight-text min-w-17 max-xl:min-w-0 max-lg:min-w-15"
              >
                <p
                  class="footer__highlight-title text-lg font-bold max-lg:text-base"
                >
                  {{ highlight.title }}
                </p>
                <p
                  class="footer__highlight-desc text-secondary-text text-sm max-lg:text-xs"
                >
                  {{ highlight.desc }}
                </p>
              </div>
            </div>
          </div>
          <nav
            class="footer__nav w-full flex flex-row justify-center items-start gap-4 max-xl:gap-2 max-xl:items-start max-lg:flex-col"
          >
            <div :class="[footer__nav_section_util, 'footer__nav-section']">
              <p :class="[footer__nav_title]">{{ t('footer.menu_title') }}</p>
              <ul :class="[footer__nav_ul_util]">
                <li v-for="(item, idx) in footerNavLinks" :key="`nav-${idx}`">
                  <a
                    :class="[footer__nav_a_util]"
                    :href="item.href ? item.href : '/'"
                    @click.prevent="handleFooterNavClick(item)"
                    >{{ item.label }}</a
                  >
                </li>
              </ul>
            </div>
            <div
              :class="[
                footer__nav_section_util,
                'footer__nav-section full-width-section w-full',
              ]"
            >
              <p :class="[footer__nav_title]">{{ t('footer.areas_title') }}</p>
              <div
                class="footer__areas-grid flex gap-5 max-lg:flex-col max-lg:gap-1"
              >
                <ul
                  v-for="(group, idx) in footerAreasGroups"
                  :key="idx"
                  :class="[footer__nav_ul_util]"
                >
                  <li v-for="area in group" :key="area.label">
                    <a :class="[footer__nav_a_util]" href="/">{{
                      area.label
                    }}</a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
    <div
      :class="[
        footer__location_display,
        'footer__bottom bg-accent-dark-color text-center',
      ]"
    >
      <div
        :class="[
          footer__container_util,
          'footer__container text-box footer-location-display !flex-col py-2 px-4',
        ]"
      >
        <div class="flex items-center justify-center mb-1 gap-2">
          <a
            v-for="lang in availableLocales"
            :key="lang.code"
            @click.prevent="changeLanguage(lang.code as 'pt-br' | 'en-us')"
            :class="[
              'rounded text-sm transition-opacity text-body-bg opacity-100 hover:opacity-50 max-lg:text-xs',
            ]"
            href="#"
          >
            {{ locale === lang.code ? '> ' : '' }}{{ lang.name }}
          </a>
        </div>
        <p :class="footer__bottom_paragraph">
          ©2025 Mediari Consultoria Empresarial LTDA -
          {{ t('footer.all_rights_reserved') }}
        </p>
        <p :class="footer__bottom_paragraph">CNPJ 49.315.134/0001-90</p>
        <p :class="footer__bottom_paragraph">
          Rua Amazonas, 439 - Centro, São Caetano do Sul, 09520070
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
  p,
  ul {
    margin: 0;
  }
</style>
