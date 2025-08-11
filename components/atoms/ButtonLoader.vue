<template>
    <div class="button-loader" aria-label="Carregando...">
        <div class="dot dot-1"></div>
        <div class="dot dot-2"></div>
        <div class="dot dot-3"></div>
    </div>
</template>

<style scoped>
.button-loader {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
}

.dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: currentColor;
    animation: dotPulse 1.4s infinite ease-in-out;
}

.dot-1 {
    animation-delay: -0.32s;
}

.dot-2 {
    animation-delay: -0.16s;
}

.dot-3 {
    animation-delay: 0s;
}

@keyframes dotPulse {
    0%, 80%, 100% {
        transform: scale(0.8);
        opacity: 0.5;
    }
    40% {
        transform: scale(1);
        opacity: 1;
    }
}
</style>
