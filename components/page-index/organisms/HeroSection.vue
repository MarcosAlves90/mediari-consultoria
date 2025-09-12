<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { useHeroTags } from '~/composables/useHeroTags'

  const { t } = useI18n()
  const { heroTags } = useHeroTags()
</script>

<template>
  <section
    id="banner-section"
    class="homepage__hero relative h-[95vh] w-full border-b-12 border-accent-color max-lg:h-[80vh]"
    role="banner"
    aria-labelledby="banner-heading"
    aria-describedby="banner-description"
  >
    <div
      class="homepage__hero-text absolute top-1/2 left-1/2 z-3 mt-[54px] w-full -translate-x-1/2 -translate-y-1/2 text-center text-body-bg"
      aria-label="Texto do banner principal"
    >
      <div
        class="homepage__hero-text-tags mb-2 flex items-center justify-center gap-4 max-lg:gap-[4.5vw]"
        role="list"
        aria-label="Características principais"
      >
        <div
          v-for="(tag, idx) in heroTags"
          :key="idx"
          class="homepage__hero-text-tags-tag cursor-pointer flex min-w-12 items-center justify-center rounded-sm border-2 border-body-bg bg-body-bg-05 py-1 backdrop-blur-sm transition-transform duration-200 ease-in-out hover:scale-[1.1] max-lg:min-w-[20vw] max-lg:py-0.5 max-sm:min-w-[25vw]"
          role="listitem"
        >
          <p
            class="m-0 text-body-bg text-base max-xl:text-[1.5vw] max-sm:text-[2.7vw]"
          >
            {{ tag }}
          </p>
        </div>
      </div>
      <h1
        id="banner-heading"
        class="m-0 text-[5.8rem] font-medium transition-all duration-200 ease-in-out max-xl:text-[7.75vw] max-sm:text-[8.4vw]"
      >
        {{ t('banner.main_title') }}
      </h1>
      <p
        class="mt-[-2.5rem] text-[3.65rem] font-medium text-body-bg transition-all duration-200 ease-in-out max-xl:mt-[-2.9vw] max-xl:text-[4.9vw] max-sm:text-[5.34vw]"
      >
        {{ t('banner.subtitle-1')
        }}<span
          class="relative top-[-0.15vw] font-scheherazade text-[4.11rem] font-bold text-accent-color transition-all duration-200 ease-in-out max-xl:text-[5.5vw] max-sm:text-[5.94vw] max-sm:top-[-0.20vw]"
          >{{ t('banner.subtitle-2') }}</span
        >
      </p>
      <p
        id="banner-description"
        class="homepage__hero-text-description mt-[-0.5rem] text-lg text-body-bg transition-all duration-200 ease-in-out max-xl:mt-[-0.5vw] max-xl:px-2 max-xl:text-[1.5vw] max-md:px-1 max-sm:text-[2.7vw]"
      >
        {{ t('banner.description') }}
      </p>
    </div>
    <div
      class="homepage__hero-notch absolute left-1/2 -translate-x-1/2 bottom-0 w-30 h-[18px] bg-accent-color z-2 rounded-t-sm max-md:w-[50vw]"
      aria-hidden="true"
    ></div>
    <div
      class="homepage__hero-gradient absolute top-0 left-0 right-0 bottom-0 opacity-60"
      aria-hidden="true"
    ></div>
    <NuxtImg
      class="homepage__hero-image w-full h-full object-cover object-center opacity-25"
      src="/banner-background_acqeef_rgmwey.webp"
      provider="cloudinary"
      width="1920"
      height="1080"
      sizes="xl:100vw lg:80vw"
      preload
      fit="cropping"
      alt="Banner de fundo da página principal com elementos gráficos abstratos"
    />
  </section>
</template>

<style scoped>
  .homepage__hero-gradient {
    background: linear-gradient(
      180deg,
      var(--color-accent-color) 60%,
      var(--color-secondary-text) 100%
    );
  }
</style>
