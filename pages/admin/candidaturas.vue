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
  <main class="admin-candidates-page">
    <AdminHeader
      :title="t('admin.candidates.page_title')"
      :description="t('admin.candidates.page_description')"
    >
      <template #actions>
        <div
          class="flex flex-col 500:flex-row items-stretch 500:items-center gap-0.5 500:gap-1 w-full 500:w-auto"
        >
          <div class="text-secondary-text">
            {{
              t('admin.candidates.total_applications', {
                count: candidates.length,
              })
            }}
          </div>

          <button
            @click="refreshCandidates"
            :disabled="isLoading"
            class="cursor-pointer bg-body-bg text-primary-text rounded p-0.5"
          >
            <Icon
              name="mdi:refresh"
              class="w-1 h-1 mr-0.5"
              :class="{ 'animate-spin': isLoading }"
            />
            <span>{{ t('admin.candidates.refresh') }}</span>
          </button>
        </div>
      </template>
    </AdminHeader>

    <div
      class="max-w-7xl mx-auto px-0.5 300:px-0.75 500:px-1 870:px-1.5 py-0.75 500:py-1 870:py-1.5"
    >
      <div
        class="grid grid-cols-1 870:grid-cols-3 gap-0.75 500:gap-1 870:gap-1.5"
      >
        <CandidatesList
          :candidates="candidates"
          :selected-candidate="selectedCandidate"
          :is-loading="isLoading"
          @select="selectCandidate"
        />

        <div class="870:col-span-2 order-1 870:order-2">
          <CandidateDetails
            :candidate="selectedCandidate"
            :groups="GROUPS"
            :is-loading="isLoading"
            @download-resume="downloadResume"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>

  @media (max-width: 300px) {
    .admin-candidates-page {
      padding: 0;
    }
  }

  @media (min-width: 500px) and (max-width: 869px) {
    .admin-candidates-page {
      padding-top: 0.5rem;
    }
  }
</style>
