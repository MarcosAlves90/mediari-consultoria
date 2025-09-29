<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import ContactCard from '~/components/page-index/molecules/ContactCard.vue'
  import { useContacts } from '~/utils/useContacts'
  import { useHomepageStyles } from '~/composables/page-index/useHomepageStyles'

  const { t } = useI18n()
  const { openPhoneDialer, openMailTo, openLinkInBrowser } = useContacts()
  const {
    homepage__container,
    homepage__section_title,
    homepage__section_subtitle,
    homepage__section_description,
  } = useHomepageStyles()
</script>

<template>
  <section
    id="contact-section"
    class="homepage__contact homepage__contact--gray-bg w-full flex justify-center items-center bg-body-bg-dark"
    role="region"
    aria-labelledby="contact-heading"
    aria-describedby="contact-description"
  >
    <div
      :class="[
        homepage__container,
        'homepage__contact-content max-w-85 w-full',
      ]"
    >
      <p
        id="contact-heading"
        class="homepage__section-subtitle"
        :class="homepage__section_subtitle"
      >
        {{ t('contact.section_subtitle') }}
      </p>
      <h2 class="homepage__section-title" :class="homepage__section_title">
        {{ t('contact.section_title') }}
      </h2>
      <p
        id="contact-description"
        class="homepage__section_description"
        :class="homepage__section_description"
      >
        {{ t('contact.description') }}
      </p>
      <div
        class="homepage__contact-list mt-1 flex items-center justify-between gap-0.5 max-md:grid max-md:grid-cols-2"
        role="list"
        aria-label="Opções de contato"
      >
        <ContactCard
          backgroundImage="instagram_g4nm4d_vkd5ws.webp"
          iconImage="instagram"
          :buttonText="t('contact.instagram')"
          :buttonAction="
            () =>
              openLinkInBrowser('https://www.instagram.com/mediari.consultoria')
          "
          role="listitem"
          aria-label="Contato pelo Instagram"
        />

        <ContactCard
          backgroundImage="telefone_bluhgk_p8rms9.webp"
          iconImage="telefone"
          :buttonText="t('contact.phone')"
          :buttonAction="openPhoneDialer"
          role="listitem"
          aria-label="Contato por telefone"
        />

        <ContactCard
          backgroundImage="gmail_itiiyf_qn4gk0.webp"
          iconImage="gmail"
          :buttonText="t('contact.email')"
          :buttonAction="openMailTo"
          role="listitem"
          aria-label="Contato por e-mail"
        />

        <ContactCard
          backgroundImage="linkedin_jbmidd_faecil.webp"
          iconImage="linkedin"
          :buttonText="t('contact.linkedin')"
          :buttonAction="
            () =>
              openLinkInBrowser(
                'https://www.linkedin.com/company/mediari-consultoria-empresarial-ltda'
              )
          "
          role="listitem"
          aria-label="Contato pelo LinkedIn"
        />
      </div>
    </div>
  </section>
</template>
