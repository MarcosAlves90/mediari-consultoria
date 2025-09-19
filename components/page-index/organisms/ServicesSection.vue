<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { useHomepageStyles } from '~/composables/page-index/useHomepageStyles'
  import { useServices } from '~/composables/page-index/useServices'

  const { t } = useI18n()
  const {
    homepage__container,
    homepage__section_title,
    homepage__section_subtitle,
    homepage__section_description,
    homepage__services_card,
    homepage__services_card_icon,
    homepage__services_card_title,
    homepage__services_card_description,
  } = useHomepageStyles()

  const { mainServices, secondaryServices, triggerShake } = useServices()
</script>

<template>
  <section
    id="services-section"
    class="homepage__services w-full flex items-center justify-center"
    role="region"
    aria-labelledby="services-heading"
    aria-describedby="services-description"
  >
    <div
      :class="[
        homepage__container,
        'homepage__services-container w-full max-w-85',
      ]"
    >
      <p
        id="services-heading"
        class="homepage__section-subtitle"
        :class="homepage__section_subtitle"
      >
        {{ t('services.section_subtitle') }}
      </p>
      <h2 class="homepage__section-title" :class="homepage__section_title">
        {{ t('services.section_title') }}
      </h2>
      <p
        id="services-description"
        class="homepage__section-description"
        :class="homepage__section_description"
      >
        {{ t('services.section_description') }}
      </p>
      <ul
        class="homepage__services-list homepage__services-list--main grid gap-1 mt-1 grid-cols-4 max-870:grid-cols-2"
        role="list"
        :aria-label="t('services.main_aria_label')"
      >
        <li
          v-for="service in mainServices"
          :key="service.headingId"
          :class="homepage__services_card"
          role="listitem"
          :aria-labelledby="service.headingId"
          :aria-describedby="service.descId"
        >
          <button
            type="button"
            class="homepage__services-icon-button"
            @click="triggerShake"
            :aria-label="
              t('services.icon_button_label', { service: service.title })
            "
          >
            <Icon
              :class="homepage__services_card_icon"
              :name="service.icon"
              aria-hidden="true"
            />
          </button>
          <p :id="service.headingId" :class="homepage__services_card_title">
            {{ service.title }}
          </p>
          <p :id="service.descId" :class="homepage__services_card_description">
            {{ service.description }}
          </p>
        </li>
      </ul>
      <ul
        class="homepage__services-list homepage__services-list--secondary grid gap-1 mt-1 grid-cols-3 max-870:grid-cols-1"
        role="list"
        :aria-label="t('services.secondary_aria_label')"
      >
        <li
          v-for="service in secondaryServices"
          :key="service.headingId"
          :class="homepage__services_card"
          role="listitem"
          :aria-labelledby="service.headingId"
          :aria-describedby="service.descId"
        >
          <button
            type="button"
            class="homepage__services-icon-button"
            @click="triggerShake"
            :aria-label="
              t('services.icon_button_label', { service: service.title })
            "
          >
            <Icon
              :class="homepage__services_card_icon"
              :name="service.icon"
              aria-hidden="true"
            />
          </button>
          <p :id="service.headingId" :class="homepage__services_card_title">
            {{ service.title }}
          </p>
          <p :id="service.descId" :class="homepage__services_card_description">
            {{ service.description }}
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
  .homepage__services-card {
    &:hover .homepage__services-card-description {
      color: var(--color-accent-color);
    }

    position: relative;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: url('https://res.cloudinary.com/dawhjravc/image/upload/card-background_jp4akg_rbjplo.webp')
        center / cover no-repeat;
      filter: blur(5px) brightness(0.7);
      opacity: 0;
      transition:
        opacity 0.3s ease,
        transform 0.3s ease;
      z-index: 0;
      pointer-events: none;
    }

    &:hover::before {
      opacity: 0.2;
      transform: scale(1.1);
    }

    > * {
      position: relative;
      z-index: 1;
    }
  }

  .shake-animation {
    animation: shake 0.7s ease-in-out;
  }

  @keyframes shake {
    0% {
      transform: translateX(0);
    }

    20% {
      transform: translateX(-10px);
    }

    40% {
      transform: translateX(10px);
    }

    60% {
      transform: translateX(-10px);
    }

    80% {
      transform: translateX(10px);
    }

    100% {
      transform: translateX(0);
    }
  }
</style>
