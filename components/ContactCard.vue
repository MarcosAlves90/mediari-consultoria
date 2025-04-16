<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

export default defineComponent({
    props: {
        backgroundImage: {
            type: String,
            required: true
        },
        iconImage: {
            type: String,
            required: true
        },
        buttonText: {
            type: String,
            required: true
        },
        buttonAction: {
            type: Function as PropType<() => void>,
            required: true
        }
    }
});
</script>

<template>
    <div class="contact-card" data-testid="contact-card">
        <div class="contact-card__square">
            <div class="contact-card__image-wrapper">
                <NuxtImg :src="backgroundImage" alt="Background" class="contact-card__image" lazy format="webp" />
            </div>
            <div class="contact-card__icon-box">
                <Icon class="contact-card__icon-box-svg" :name="'my-icon:' + iconImage" />
            </div>
        </div>
        <button class="contact-card__button common-button" @click="buttonAction">{{ buttonText }}</button>
    </div>
</template>

<style scoped lang="scss">
.contact-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;

    &__square {
        position: relative;
        width: 100%;
        height: 22rem;
        overflow: hidden;
        border-radius: 5px;
        max-width: 100%;
    }

    &__image-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    &__image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: blur(3px);
        transition: transform 0.2s ease;
    }

    &__image-wrapper::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: $accent-color-30;
        pointer-events: none;
    }

    &__square:hover {
        .contact-card__image {
            transform: scale(1.5);
        }
        .contact-card__icon-box-svg {
            transform: scale(1.2);
        }
    }

    &__icon-box {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2rem;
        color: white;
        transition: opacity 0.3s ease;
        &-svg {
            font-size: 5rem;
            transition: transform 0.2s ease;
        }
    }

    &__button {
        width: 100%;
        font-size: 20px;
        max-width: 400px;
        align-self: center;
    }

}

@media (max-width: 1200px) {
  .contact-card {
    max-width: 100%;
  }
  .contact-card__square {
    height: 16rem;
  }
  .contact-card__icon-box-svg {
    font-size: 4rem;
  }
  .contact-card__button {
    font-size: 15px;
    max-width: 100%;
  }
}
</style>