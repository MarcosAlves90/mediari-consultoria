<template>
  <div class="bg-body-bg-dark rounded border-2 border-accent-color">
    <div class="p-1.5">
      <div class="flex items-center justify-between mb-1">
        <h3 class="text-lg font-semibold text-primary-text">
          {{ t('careers.profile_test.title') }}
        </h3>
      </div>
      <ProfileTestResults
        v-if="candidate.testAnswers"
        :answers="candidate.testAnswers"
        :groups="groups"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import type { Candidate } from '~/composables/page-admin/useAdminCandidates'
  import ProfileTestResults from '~/components/page-admin/molecules/ProfileTestResults.vue'

  interface Props {
    candidate: Candidate
    groups: Array<Record<'A' | 'B' | 'C' | 'D', string>>
  }

  defineProps<Props>()
  const { t } = useI18n()
</script>
