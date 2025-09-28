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

  const onCandidateDeleted = async (): Promise<void> => {
    await refreshCandidates()
    selectCandidate(null)
  }

  onMounted(() => {
    loadCandidates()
  })
</script>

<template>
  <AdminHeader :title="t('admin.candidates.page_title')">
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
    <div class="grid grid-cols-1 870:grid-cols-3 gap-1 870:gap-1.5">
      <div class="870:col-span-1">
        <CandidatesList
          :candidates="candidates"
          :selected-candidate="selectedCandidate"
          :is-loading="isLoading"
          @select="selectCandidate"
        />
      </div>

      <div class="870:col-span-2">
        <CandidateDetails
          :candidate="selectedCandidate"
          :groups="GROUPS"
          :is-loading="isLoading"
          @download-resume="downloadResume"
          @candidateDeleted="onCandidateDeleted"
        />
      </div>
    </div>
  </main>
</template>
