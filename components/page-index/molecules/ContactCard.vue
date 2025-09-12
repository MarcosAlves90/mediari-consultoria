<script setup lang="ts">
  type ButtonAction = () => void
  interface ContactCardProps {
    backgroundImage: string
    iconImage: string
    buttonText: string
    buttonAction: ButtonAction
  }

  defineProps<ContactCardProps>()
</script>

<template>
  <div
    class="contact-card mx-auto my-0 box-border flex w-full flex-col items-center justify-center gap-1"
    data-testid="contact-card"
  >
    <div
      class="contact-card__square relative w-full h-20 overflow-hidden rounded-sm max-w-full max-lg:h-full"
    >
      <div
        class="contact-card__image-wrapper relative w-full h-full overflow-hidden after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-accent-color-3 after:pointer-events-none"
      >
        <NuxtImg
          :src="backgroundImage"
          alt="Background"
          provider="cloudinary"
          class="contact-card__image w-full h-full block object-cover blur-xs transition-transform duration-200 ease-in-out"
          loading="lazy"
        />
      </div>
      <div
        class="contact-card__icon-box absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center text-[2rem] text-white transition-opacity duration-200 ease-in-out"
      >
        <Icon
          class="contact-card__icon-box-svg text-[5rem] transition-transform duration-200 ease-in-out max-xl:text-[4rem] max-lg:text-[3.5rem]"
          loading="lazy"
          :name="'my-icon:' + iconImage"
        />
      </div>
    </div>
    <button
      class="contact-card__button common-button w-full text-base self-center max-lg:text-xs"
      @click.prevent="buttonAction"
    >
      {{ buttonText }}
    </button>
  </div>
</template>

<style scoped>
  .contact-card__square:hover .contact-card__image {
    transform: scale(1.5);
  }

  .contact-card__square:hover .contact-card__icon-box-svg {
    transform: scale(1.2);
  }
</style>
