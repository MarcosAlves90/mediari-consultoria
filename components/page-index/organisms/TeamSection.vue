<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { useHomepageStyles } from '~/composables/page-index/useHomepageStyles'
  import { useTeam } from '~/composables/page-index/useTeam'

  const { t } = useI18n()
  const {
    homepage__container,
    homepage__section_title,
    homepage__section_subtitle,
    homepage__section_description,
  } = useHomepageStyles()

  const { teamImages, getNome } = useTeam()
</script>

<template>
  <section
    id="team-section"
    class="homepage__team w-full flex justify-center items-center bg-body-bg-dark"
    role="region"
    aria-labelledby="team-heading"
    aria-describedby="team-description"
  >
    <div
      :class="[homepage__container, 'homepage__team-content max-w-85 w-full']"
    >
      <p
        id="team-heading"
        class="homepage__section-subtitle"
        :class="homepage__section_subtitle"
      >
        {{ t('team.section_subtitle') }}
      </p>
      <h2 class="homepage__section-title" :class="homepage__section_title">
        {{ t('team.section_title') }}
      </h2>
      <p
        id="team-description"
        class="homepage__section_description"
        :class="homepage__section_description"
      >
        {{ t('team.description') }}
      </p>
      <div
        class="homepage__team-list grid gap-0.5 mt-1 grid-cols-7 max-xl:grid-cols-5 max-lg:grid-cols-4 max-sm:grid-cols-2"
        role="list"
      >
        <div
          v-for="(img, idx) in teamImages"
          :key="idx"
          class="homepage__team-card relative flex flex-col items-center overflow-hidden rounded-t-sm transition-transform duration-200 lg:hover:scale-105"
          role="listitem"
        >
          <NuxtImg
            :src="img"
            loading="lazy"
            provider="cloudinary"
            :alt="`Foto do membro da equipe ${getNome(img)}`"
            :title="`${getNome(img)} - Mediari Consultoria`"
            class="w-full h-full object-cover object-top"
          />
          <div
            class="homepage__team-carousel-gradient absolute top-0 left-0 right-0 bottom-0 mix-blend-multiply bg-accent-color-2"
            aria-hidden="true"
          />
          <div
            class="homepage__team-carousel-text absolute bottom-0 left-1/2 z-2 w-4/5 -translate-x-1/2 rounded-t-sm bg-accent-color-7 text-center backdrop-blur-xs max-md:w-[90%]"
          >
            <p class="text-sm text-body-bg my-1">{{ getNome(img) }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
