<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import type { Candidate } from '~/composables/page-admin/useAdminCandidates'
  import Skeleton from '~/components/atoms/Skeleton.vue'
  import CandidatePersonalInfo from './CandidatePersonalInfo.vue'
  import CandidateExperience from './CandidateExperience.vue'
  import CandidateCoverLetter from './CandidateCoverLetter.vue'
  import CandidateTestResults from './CandidateTestResults.vue'

  interface Props {
    candidate: Candidate | null
    groups: Array<Record<'A' | 'B' | 'C' | 'D', string>>
    isLoading?: boolean
  }

  const props = defineProps<Props>()
  const { t } = useI18n()

  const handleResumeDownload = async () => {
    if (!props.candidate?.resumeStoragePath) return

    try {
      const response = await $fetch<{ downloadUrl?: string }>(
        '/api/admin/careers/download',
        {
          method: 'POST',
          body: { storagePath: props.candidate.resumeStoragePath },
        }
      )

      if (response.downloadUrl) {
        window.open(response.downloadUrl, '_blank')
      }
    } catch (error) {
      console.error('Error generating download URL:', error)
    }
  }
</script>

<template>
  <div
    v-if="isLoading"
    class="bg-body-bg-dark rounded p-1 border-2 border-accent-color space-y-4"
  >
    <!-- header: avatar + basic info -->
    <div class="flex items-center gap-4">
      <Skeleton :width="5" :height="5" customClass="rounded-full" />
      <div class="flex-1">
        <Skeleton width="100%" :height="1.5" />
        <div class="mt-1 flex gap-2">
          <Skeleton width="100%" :height="0.9" />
          <Skeleton width="100%" :height="0.9" />
        </div>
      </div>
    </div>

    <!-- personal details grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div class="space-y-1">
        <Skeleton width="100%" :height="0.9" />
        <Skeleton width="100%" :height="1.6" />
      </div>
      <div class="space-y-1">
        <Skeleton width="100%" :height="0.9" />
        <Skeleton width="100%" :height="1.6" />
      </div>
    </div>

    <!-- experience list skeletons -->
    <div class="space-y-2">
      <Skeleton width="35%" :height="1" />
      <div class="space-y-1">
        <Skeleton width="100%" :height="1.2" />
        <Skeleton width="100%" :height="1.2" />
        <Skeleton width="100%" :height="1.2" />
      </div>
    </div>

    <!-- cover letter / long text skeleton -->
    <div class="space-y-2">
      <Skeleton width="35%" :height="1" />
      <Skeleton width="100%" :height="5" />
    </div>
  </div>

  <div
    v-else-if="!candidate"
    class="bg-body-bg-dark rounded p-2 text-center border-2 border-accent-color min-h-20 sm:min-h-24 md:min-h-28 lg:min-h-32 xl:min-h-36 flex flex-col justify-center"
  >
    <Icon
      name="mdi:account-outline"
      size="50"
      class="text-secondary-text mx-auto mb-0.5"
    />
    <h3 class="text-lg font-medium text-secondary-text mb-0.5">
      {{ t('admin.candidates.select_candidate') }}
    </h3>
    <p class="text-secondary-text">
      {{ t('admin.candidates.select_candidate_description') }}
    </p>
  </div>

  <div v-else class="space-y-1.5">
    <CandidatePersonalInfo
      :candidate="candidate"
      @download-resume="handleResumeDownload"
      @deleted="(id) => $emit('candidateDeleted', id)"
    />
    <CandidateExperience :experience="candidate.experience" />
    <CandidateCoverLetter
      v-if="candidate.coverLetter"
      :cover-letter="candidate.coverLetter"
    />
    <CandidateTestResults
      v-if="candidate.testAnswers"
      :candidate="candidate"
      :groups="groups"
    />
  </div>
</template>
