<script lang="ts">
    export default defineComponent({
        setup(){
            const { goTo } = useGoTo();

            return {
                goTo,
            }
        }
    })
</script>

<template>
    <footer>
        <div class="footer-top">
            <div class="footer-group">
                <div class="top-box">
                    <div class="logo-box" @click="goTo('/')">
                        <Icon class="logo-box-icon" name="my-icon:mediari-logo" />
                        <Icon class="logo-box-text" name="my-icon:mediari-logo-texto" />
                    </div>
                </div>
                <div class="links-box">

                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <div class="footer-group">
                <ul>
                    <li><a href="/privacy">Privacy Policy</a></li>
                    <li><a href="/terms">Terms of Service</a></li>
                </ul>
            </div>
        </div>
    </footer>
</template>

<style scoped lang="scss">
    footer {
        background-color: $accent-color;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .footer-group {
        max-width: 80rem;
    }

    .top-box {
        .logo-box {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1rem;
                color: $body-background;
                cursor: pointer;

                &-icon {
                    font-size: 4.2em;
                    transition: font-size 0.2s ease-in-out;
                }

                &-text {
                    font-size: 2.5em;
                    transition: font-size 0.2s ease-in-out;
                }
            }
    }

    p, ul {
        margin: 0;
    }
</style>