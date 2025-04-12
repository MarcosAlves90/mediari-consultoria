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
                    <div class="button-box">
                        <button class="common-button"><Icon class="icon" name="mdi:linkedin"/></button>
                        <button class="common-button"><Icon class="icon" name="mdi:email-outline"/>contato@mediari.com.br</button>
                        <button class="common-button"><Icon class="icon" name="mdi:instagram"/>@mediari.consultoria</button>
                        <button class="common-button"><Icon class="icon" name="mdi:phone-outline"/>11 4227-3008</button>
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
    $common-padding: 3rem;

    .common-button {
        color: $body-background;
        border-color: $body-background;
        font-size: 20px;
        .icon {
            font-size: 1.5em;
        }
        &:hover {
            background-color: $body-background-25;
        }
    }

    footer {
        background-color: $accent-color;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .footer-group {
        max-width: 80rem;
        width: 100%;
    }
    
    .footer-top {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .top-box {
            padding: $common-padding 0 $common-padding 0;
            border-bottom: 2px solid $accent-dark-color;
            justify-content: space-between;
            display: flex;
            align-items: center;
            .logo-box {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1rem;
                color: $body-background;
                cursor: pointer;

                &-icon {
                    font-size: 4.8em;
                    transition: font-size 0.2s ease-in-out;
                }

                &-text {
                    font-size: 2.9em;
                    transition: font-size 0.2s ease-in-out;
                }
            }
            .button-box {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1rem;
            }
        }
    }


    p, ul {
        margin: 0;
    }
</style>