<template>
    <footer>
        <div class="footer-group">
            <p>&copy; 2023 My Application. All rights reserved.</p>
        </div>
    </footer>
</template>

<style scoped lang="scss">
    footer {
        background-color: $accent-color;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .footer-group {
        max-width: 80rem;
    }

    p, ul {
        margin: 0;
    }
</style>