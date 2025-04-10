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
    <div class="contact-card">
        <div class="contact-card-square">
            <div class="contact-card-image-wrapper">
                <NuxtImg :src="backgroundImage" alt="Background" class="contact-card-image" lazy format="webp" />
            </div>
            <div class="contact-card-icon-box">
                <Icon class="contact-card-icon-box-svg" :name="'my-icon:' + iconImage" />
            </div>
        </div>
        <button class="contact-card-button common-button" @click="buttonAction">{{ buttonText }}</button>
    </div>
</template>

<style scoped lang="scss">
.contact-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
}

.contact-card-square {
    position: relative;
    width: 100%;
    height: 22rem;
    overflow: hidden;
    border-radius: 5px;
}

.contact-card-image-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.contact-card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: blur(3px);
    transition: transform 0.2s ease;
}

.contact-card-image-wrapper::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: $accent-color-30;
    pointer-events: none;
}

.contact-card-square:hover {
    .contact-card-image {
        transform: scale(1.5);
    }
    .contact-card-icon-box-svg {
        transform: scale(1.2);
    }
}

.contact-card-icon-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex; // Garante centralização do conteúdo interno
    justify-content: center; // Centraliza horizontalmente
    align-items: center; // Centraliza verticalmente
    font-size: 2rem;
    color: white;
    transition: opacity 0.3s ease;
    &-svg {
        font-size: 5rem;
        transition: transform 0.2s ease;
    }
}

.contact-card-button {
    width: 100%;
    font-size: 20px;
}
</style>