<template>
    <main class="main-page">
        <div class="main-page-banner">
            <NuxtImg class="main-page-banner-image" src="/banner-background.jpg"/>
        </div>
        <h1>Welcome to the Main Page</h1>
        <p>This is the main content of the application.</p>
    </main>
</template>

<style lang="scss" scoped>
    .main-page {
        &-banner {
            width: 100%;
            &-image {
                width: 100%;
                box-sizing: border-box;
            }
        }
    }
    p {
        color: $secondary-text;
    }
</style>