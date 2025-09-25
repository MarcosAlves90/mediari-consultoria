<template>
  <div class="bg-body-bg-dark rounded border-2 border-accent-color">
    <div class="p-1.5">
      <div class="flex items-start justify-between mb-1">
        <div>
          <h2 class="text-xl font-semibold text-primary-text">
            {{ candidate.fullName }}
          </h2>
          <p class="text-secondary-text">
            {{ t('admin.candidates.submitted_on') }}
            {{ formatDate(candidate.submittedAt) }}
          </p>
        </div>
        <div class="flex gap-0.5">
          <button
            :disabled="!candidate.resumeStoragePath"
            :class="[
              'common-button flex items-center',
              !candidate.resumeStoragePath && 'opacity-50 cursor-not-allowed',
            ]"
            @click="$emit('downloadResume')"
          >
            <Icon name="mdi:open-in-new" class="w-1 h-1 mr-0.5" />
            {{ t('admin.candidates.open_resume') }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-1">
        <InfoField :label="t('careers.form.email')" :value="candidate.email" />
        <InfoField :label="t('careers.form.phone')" :value="candidate.phone" />
        <InfoField
          :label="t('careers.form.area_of_interest')"
          :value="candidate.areaOfInterest"
        />
        <InfoField
          :label="t('admin.candidates.resume_file')"
          :value="candidate.resumeFileName || t('admin.candidates.no_file')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import type { Candidate } from '~/composables/page-admin/useAdminCandidates'
  import InfoField from '~/components/page-admin/atoms/InfoField.vue'

  interface Props {
    candidate: Candidate
  }

  defineProps<Props>()
  defineEmits<{
    downloadResume: []
  }>()

  const { t } = useI18n()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
</script>
