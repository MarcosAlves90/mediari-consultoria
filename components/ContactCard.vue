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
@import "@/assets/css/mixins.scss";

// Mixins locais reutilizáveis
@mixin flex-center($direction: row, $gap: 0) {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: $direction;
    gap: $gap;
}

@mixin card-square($height: 22rem) {
    position: relative;
    width: 100%;
    height: $height;
    overflow: hidden;
    border-radius: 5px;
    max-width: 100%;
}

@mixin icon-box($font-size: 2rem, $icon-size: 5rem) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    @include flex-center();
    font-size: $font-size;
    color: white;
    transition: opacity 0.3s ease;

    &-svg {
        font-size: $icon-size;
        transition: transform 0.2s ease;
    }
}

.contact-card {
    @include flex-center(column, 2rem);
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;

    &__square {
        @include card-square();
        @include respond-to(desktop) {
            @include card-square(16rem);
        }
        @include respond-to(tablet) {
            @include card-square(100%);
        }
    }

    &__image-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;

        &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: $accent-color-30;
            pointer-events: none;
        }
    }

    &__image-wrapper,
    &__image {
        width: 100% !important;
        height: 100% !important;
        display: block !important;
    }

    &__image {
        object-fit: cover;
        filter: blur(3px);
        transition: transform 0.2s ease;
    }

    &__square:hover .contact-card__image {
        transform: scale(1.5);
    }

    &__square:hover .contact-card__icon-box-svg {
        transform: scale(1.2);
    }

    &__icon-box {
        @include icon-box();
    }

    &__icon-box-svg {
        @include respond-to(desktop) {
            font-size: 4rem;
        }
        @include respond-to(mobile) {
            font-size: 2.5rem;
        }
    }

    &__button {
        width: 100%;
        font-size: 20px;
        max-width: 400px;
        align-self: center;
        @include respond-to(desktop) {
            font-size: 15px;
            max-width: 100%;
        }
        @include respond-to(mobile) {
            font-size: 13px;
            padding: 0.3rem 0.5rem;
        }
    }

    @include respond-to(desktop) {
        max-width: 100%;
    }
    @include respond-to(mobile) {
        gap: 1rem;
    }
}
</style>