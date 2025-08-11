<script setup lang="ts">

import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useScreenWidth } from '@/utils/useScreenWidth';
import { useScrollToSection } from '@/utils/useScrollToSection';
import { useContacts } from '@/utils/useContacts';
import { useGoTo } from '@/utils/useGoTo';

const screenWidth = useScreenWidth();
const scrollToSection = useScrollToSection();
const { openPhoneDialer } = useContacts();
const { goTo } = useGoTo();

const hamburguerMenuOpen = ref(false);
const isNavbarSmall = ref(false);

// Verifica se está na página inicial
const isHomePage = computed(() => {
    const currentPath = route.path;
    const homePath = localePath('/');
    return currentPath === homePath || currentPath === '/' || currentPath === '/pt-br' || currentPath === '/en-us';
});

interface ContactLink {
    href: string;
    icon: string;
    text: string;
    target: string;
    rel: string;
    show: () => boolean;
}

const contactLinks: ContactLink[] = [
    {
        href: 'mailto:contato@mediari.com.br',
        icon: 'mdi:email-outline',
        text: 'contato@mediari.com.br',
        target: '',
        rel: '',
        show: () => true,
    },
    {
        href: 'https://www.instagram.com/mediari.consultoria',
        icon: 'mdi:instagram',
        text: '@mediari.consultoria',
        target: '_blank',
        rel: 'noopener noreferrer',
        show: () => true,
    },
    {
        href: 'https://www.linkedin.com/company/mediari-consultoria-empresarial-ltda',
        icon: 'mdi:linkedin',
        text: 'Mediari Consultoria',
        target: '_blank',
        rel: 'noopener noreferrer',
        show: () => true,
    },
    {
        href: 'tel:+551142273008',
        icon: 'mdi:phone-outline',
        text: '11 4227-3008',
        target: '',
        rel: '',
        show: () => screenWidth.value < 1280,
    },
];

import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();

const navLinks = computed(() => [
        { label: t('navbar.home'), section: 'banner-section' },
        { label: t('navbar.services'), section: 'services-section' },
        { label: t('navbar.enterprise'), section: 'enterprise-section' },
        { label: t('navbar.founder'), section: 'seo-section' },
        { label: t('navbar.team'), section: 'team-section' },
        { label: t('navbar.contact'), section: 'contact-section' },
        { label: t('navbar.careers'), href: '/trabalhe-conosco' },
]);

const handleNavClick = async (link: { section?: string, href?: string }) => {
    if (link.href) {
        // Para links com href, usa o localePath para garantir o locale correto
        const localizedPath = localePath(link.href);
        goTo(localizedPath);
    } else if (link.section) {
        // Se não estiver na página inicial, vai para a página inicial primeiro
        const currentPath = window.location.pathname;
        const homePath = localePath('/');

        if (currentPath !== homePath) {
            await goTo(homePath);
            // Aguarda a página carregar e então rola para a seção
            setTimeout(() => {
                scrollToSection(link.section!);
            }, 100);
        } else {
            // Se já estiver na página inicial, apenas rola para a seção
            scrollToSection(link.section);
        }
    }
    hamburguerMenuOpen.value = false;
};

const handleScroll = () => {
    isNavbarSmall.value = window.scrollY > 200;
};

const toggleHamburguerMenu = () => {
    hamburguerMenuOpen.value = !hamburguerMenuOpen.value;
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
    <header
        class="app-header fixed top-0 right-0 left-0 z-99 border-b-2 transition-colors duration-200 ease-in-out"
        :class="{
            'app-header--small': isNavbarSmall,
            'border-accent-color': isNavbarSmall,
            'border-body-bg-dark': !isHomePage && !isNavbarSmall,
            'border-transparent': isHomePage && !isNavbarSmall,
        }">
        <div class="app-header__top flex items-center justify-center gap-1 bg-accent-color py-0.5 text-sm text-accent-text-color transition-[height] duration-200 ease-in-out max-md:justify-evenly"
            :class="{ 'app-header--small': isNavbarSmall }">
            <template v-for="(link, idx) in contactLinks" :key="idx">
                <a v-if="link.show()"
                    class="app-header__top-link flex cursor-pointer items-center gap-0.5 rounded-sm no-underline transition-colors duration-200 ease-in-out hover:bg-body-bg-2"
                    :href="link.href"
                    :target="link.target"
                    :rel="link.rel"
                    :aria-label="link.text">
                    <Icon
                        class="app-header__top-link-icon text-[1.8rem] transition-[font-size] duration-200 ease-in-out max-lg:text-2xl"
                        :name="link.icon" />
                    <p class="m-0 max-lg:text-xs transition-[font-size] duration-200 ease-in-out"
                        v-if="!(screenWidth < 768)">{{ link.text }}</p>
                </a>
            </template>
        </div>
        <div class="app-header__bottom flex items-center justify-center transition duration-200 ease-in-out"
            :class="{
                '!backdrop-blur-md bg-body-bg-67': isNavbarSmall && isHomePage,
                '!bg-body-bg': isNavbarSmall && !isHomePage,
                'backdrop-blur-xs bg-body-bg-67': !isNavbarSmall && isHomePage,
                'bg-body-bg': !isNavbarSmall && !isHomePage
            }">
            <div
                class="app-header__group flex w-full max-w-85 items-center justify-between px-4 py-1 text-base max-xl:px-2 max-lg:flex-wrap max-md:px-1">
                <div class="app-header__logo-box flex items-center justify-center gap-1 cursor-pointer text-accent-color"
                    @click="goTo(localePath('/'))">
                    <Icon
                        class="app-header__logo-box-icon text-[3.5rem] transition-[font-size] duration-200 ease-in-out"
                        :class="{ '!text-[3.2rem]': isNavbarSmall }" name="my-icon:mediari-logo" />
                    <Icon
                        class="app-header__logo-box-text text-[2.2rem] transition-[font-size] duration-200 ease-in-out max-300:hidden"
                        :class="{ '!text-[2rem]': isNavbarSmall }" name="my-icon:mediari-logo-texto" />
                </div>
                <nav class="app-header__nav app-header__nav--desktop flex items-center justify-center gap-[2.8rem]"
                    v-if="screenWidth >= 1024">
                    <a v-for="(link, idx) in navLinks" :key="`desktop-nav-${idx}`"
                        :href="link.href ? localePath(link.href) : '#' + link.section"
                        @click.prevent="handleNavClick(link)"
                        class="after:absolute after:bottom-[-3px] after:left-1/2 after:-translate-x-1/2 after:w-0 after:bg-accent-color after:content-[''] after:h-[2px] hover:after:w-full no-underline">
                        {{ link.label }}
                    </a>
                <button v-if="screenWidth >= 1280" class="app-header__nav-button common-button"
                    @click.prevent="openPhoneDialer"
                    aria-label="Ligar para 11 4227-3008">
                    <Icon class="app-header__nav-button-icon text-[1.3rem]" name="mdi:phone-outline" />
                    11 4227-3008
                </button>
                </nav>
                <button v-if="screenWidth < 1024" class="app-header__hamburguer-menu common-button text-[1.5rem]"
                    :class="{ 'app-header__hamburguer-menu--open bg-accent-color-2': hamburguerMenuOpen }"
                    @click="toggleHamburguerMenu"
                    :aria-label="hamburguerMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'">
                    <Transition name="icon-morph" mode="out-in">
                        <Icon v-if="!hamburguerMenuOpen" class="app-header__hamburguer-menu-icon w-[30px] aspect-square"
                            name="mdi:menu" key="menu" />
                        <Icon v-else class="app-header__hamburguer-menu-icon w-[30px] aspect-square" name="mdi:close"
                            key="close" />
                    </Transition>
                </button>
            </div>
        </div>
        <Transition name="slide-fade-nav">
            <nav v-show="screenWidth < 1024 && hamburguerMenuOpen"
                class="app-header__nav app-header__nav--mobile flex absolute top-full left-0 right-0 flex-col gap-1 p-1 overflow-hidden border-t-2 border-b-2 backdrop-blur-sm max-h-[500px] opacity-100 visible"
                :class="{
                    'bg-body-bg-67 border-accent-color': isHomePage,
                    'bg-white border-gray-400': !isHomePage
                }">
                <a v-for="(link, idx) in navLinks" :key="`mobile-nav-${idx}`"
                    :href="link.href ? localePath(link.href) : '#' + link.section"
                    @click.prevent="handleNavClick(link)"
                    class="box-border w-full rounded-sm border-2 px-1 py-0.5 text-center text-base no-underline max-md:text-sm"
                    :class="{
                        'border-accent-color hover:bg-accent-color-2': isHomePage,
                        'border-gray-400 hover:bg-gray-100': !isHomePage
                    }">
                    {{ link.label }}
                </a>
            </nav>
        </Transition>
    </header>
</template>

<style scoped>

.app-header__nav {
    transition: font-size 0.2s ease-in-out;
}

.app-header__nav a {
    position: relative;
    color: var(--color-primary-text);
}

.app-header__nav--desktop a::after {
    transition: width 0.2s ease-in-out;
}

.app-header__hamburguer-menu-icon {
    transition: font-size 0.2s ease-in-out;
}

@media (min-width: 768px) {
    .app-header--small .app-header__top {
        padding: 6px 0;
    }
    .app-header--small .app-header__top-link-icon {
        font-size: 0;
    }
    .app-header--small .app-header__top-link p {
        font-size: 0;
    }
}

.slide-fade-nav-enter-active,
.slide-fade-nav-leave-active {
    transition: opacity 0.2s, max-height 0.2s;
    will-change: opacity, max-height;
}

.slide-fade-nav-enter-from,
.slide-fade-nav-leave-to {
    opacity: 0;
    max-height: 0;
}

.slide-fade-nav-enter-to,
.slide-fade-nav-leave-from {
    opacity: 1;
    max-height: 500px;
}

.icon-fade-scale-enter-active,
.icon-fade-scale-leave-active {
    transition: opacity 0.2s, transform 0.2s;
}

.icon-fade-scale-enter-from,
.icon-fade-scale-leave-to {
    opacity: 0;
    transform: scale(0.7) rotate(-90deg);
}

.icon-fade-scale-enter-to,
.icon-fade-scale-leave-from {
    opacity: 1;
    transform: scale(1) rotate(0deg);
}

.icon-morph-enter-active,
.icon-morph-leave-active {
    transition: opacity 0.2s, filter 0.2s, border-radius 0.2s, transform 0.2s;
}

.icon-morph-enter-from,
.icon-morph-leave-to {
    opacity: 0;
    filter: blur(6px);
    border-radius: 50%;
    transform: scale(0.7) rotate(-90deg);
}

.icon-morph-enter-to,
.icon-morph-leave-from {
    opacity: 1;
    filter: blur(0);
    border-radius: 0;
    transform: scale(1) rotate(0deg);
}
</style>
