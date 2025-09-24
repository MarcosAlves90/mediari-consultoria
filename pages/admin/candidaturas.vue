<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useAdminCandidates } from '~/composables/page-admin'
  import { useProfileTest } from '~/composables/page-careers'
  import {
    AdminHeader,
    CandidatesList,
    CandidateDetails,
  } from '~/components/page-admin'

  definePageMeta({
    layout: 'admin',
    middleware: 'admin',
  })

  const { t } = useI18n()

  useSeoMeta({
    title: `${t('admin.candidates.page_title')}`,
    description: t('admin.candidates.page_description'),
    robots: 'noindex, nofollow',
  })

  const {
    candidates,
    selectedCandidate,
    isLoading,
    loadCandidates,
    selectCandidate,
    downloadResume,
  } = useAdminCandidates()

  const { GROUPS } = useProfileTest()

  const refreshCandidates = async (): Promise<void> => {
    await loadCandidates()
  }

  onMounted(() => {
    loadCandidates()
  })
</script>

<template>
  <AdminHeader
    :title="t('admin.candidates.page_title')"
    :description="t('admin.candidates.page_description')"
  >
    <template #actions>
      <div
        class="flex flex-col sm:flex-row items-stretch sm:items-center gap-0.5 sm:gap-1 w-full sm:w-auto"
      >
        <div class="actions-text text-sm self-center">
          {{
            t('admin.candidates.total_applications', {
              count: candidates.length,
            })
          }}
        </div>

        <button
          @click="refreshCandidates"
          :disabled="isLoading"
          class="common-button"
          :title="t('admin.candidates.refresh')"
        >
          <Icon
            name="mdi:refresh"
            class="w-1 h-1"
            :class="{ 'animate-spin': isLoading }"
          />
          <span>{{ t('admin.candidates.refresh') }}</span>
        </button>
      </div>
    </template>
  </AdminHeader>

  <main class="max-w-7xl mx-auto px-0.5 500:px-1 870:px-1.5 py-1 870:py-1.5">
    <div class="flex flex-col 870:flex-row gap-1 870:gap-1.5">
      <div class="w-full 870:w-1/3">
        <CandidatesList
          :candidates="candidates"
          :selected-candidate="selectedCandidate"
          :is-loading="isLoading"
          @select="selectCandidate"
        />
      </div>

      <div class="w-full 870:w-2/3">
        <CandidateDetails
          :candidate="selectedCandidate"
          :groups="GROUPS"
          :is-loading="isLoading"
          @download-resume="downloadResume"
        />
      </div>
    </div>
  </main>
</template>
