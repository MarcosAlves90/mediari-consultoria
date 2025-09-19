<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { useHomepageStyles } from '~/composables/page-index/useHomepageStyles'
  import { useTextUtils } from '~/composables/page-index/useTextUtils'

  const { t } = useI18n()
  const {
    homepage__container,
    homepage__section_title,
    homepage__section_subtitle,
    homepage__section_description,
  } = useHomepageStyles()

  const { breakLinesByDot } = useTextUtils()
</script>

<template>
  <section
    id="seo-section"
    class="homepage__seo w-full flex justify-center items-center"
    role="region"
    aria-labelledby="seo-heading"
    aria-describedby="seo-description"
  >
    <div
      :class="[
        homepage__container,
        'homepage__seo-content max-w-85 w-full flex items-start justify-center gap-1 max-lg:flex-col-reverse',
      ]"
    >
      <div
        class="homepage__seo-image relative max-w-[18rem] min-w-[14rem] min-h-[18rem] flex-shrink-0 self-center overflow-hidden rounded-t-sm transition-transform duration-200 ease-in-out hover:scale-105 max-xl:hover:scale-102 max-lg:max-h-25 max-sm:max-h-26 max-sm:w-full max-sm:max-w-none"
      >
        <NuxtImg
          src="bruno-lima_ughibo_widbcw.webp"
          provider="cloudinary"
          loading="lazy"
          alt="Foto do sócio fundador Bruno Lima"
          title="Bruno Lima - Mediari Consultoria"
          class="w-full h-full"
        />
        <div
          class="homepage__team-carousel-gradient absolute top-0 left-0 right-0 bottom-0 mix-blend-multiply bg-accent-color-2"
          aria-hidden="true"
        />
        <div
          class="homepage__team-carousel-text absolute bottom-0 left-1/2 z-2 w-4/5 -translate-x-1/2 rounded-t-sm bg-accent-color-7 text-center backdrop-blur-xs max-md:w-[90%]"
        >
          <p class="text-sm text-body-bg my-1">Bruno Lima</p>
        </div>
      </div>
      <div
        class="homepage__seo-info flex flex-col items-start justify-start max-md:items-center max-md:justify-center"
      >
        <p
          id="seo-heading"
          class="homepage__section-subtitle"
          :class="homepage__section_subtitle"
        >
          {{ t('ceo.section_subtitle') }}
        </p>
        <h2 class="homepage__section-title" :class="homepage__section_title">
          {{ t('ceo.section_title') }}
        </h2>
        <blockquote
          class="homepage__seo-quote italic w-full text-secondary-text text-lg my-0.5 bg-body-bg-dark p-1 max-md:text-center max-md:text-base"
        >
          {{ t('ceo.quote') }}
        </blockquote>
        <p
          id="seo-description"
          class="homepage__section_description text-justify"
          :class="homepage__section_description"
          v-html="breakLinesByDot(t('ceo.description'))"
        ></p>
      </div>
    </div>
  </section>
</template>
