<template>
  <div class="profile-test-results">
    <div class="bg-body-bg rounded p-1">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-1 text-center">
        <div>
          <div class="text-xl font-bold text-accent-color">
            {{ distributionLetters.A }}
          </div>
          <div class="text-xs text-secondary-text">
            A — {{ t('careers.profile_test.labels.A') }}
          </div>
        </div>
        <div>
          <div class="text-xl font-bold text-accent-color">
            {{ distributionLetters.B }}
          </div>
          <div class="text-xs text-secondary-text">
            B — {{ t('careers.profile_test.labels.B') }}
          </div>
        </div>
        <div>
          <div class="text-xl font-bold text-accent-color">
            {{ distributionLetters.C }}
          </div>
          <div class="text-xs text-secondary-text">
            C — {{ t('careers.profile_test.labels.C') }}
          </div>
        </div>
        <div>
          <div class="text-xl font-bold text-accent-color">
            {{ distributionLetters.D }}
          </div>
          <div class="text-xs text-secondary-text">
            D — {{ t('careers.profile_test.labels.D') }}
          </div>
        </div>
      </div>
      <div class="mt-2 text-center">
        <div class="text-sm font-semibold">
          {{ t('careers.profile_test.predominant') }}
        </div>
        <div class="text-lg font-bold">{{ topProfile.label || '-' }}</div>
      </div>
    </div>

    <div class="space-y-1 mt-2">
      <div
        v-for="(group, index) in groups"
        :key="index"
        class="bg-accent-color-2/30 rounded p-1"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1 pr-1">
            <h4 class="text-sm font-medium text-primary-text mb-0.5">
              {{ index + 1 }}.
            </h4>
            <div class="flex gap-1 mb-1 flex-wrap text-sm">
              <span
                v-for="key in ['A', 'B', 'C', 'D']"
                :key="key"
                class="text-secondary-text text-xs"
              >
                <strong class="mr-0.25">{{ key }}:</strong>
                {{ group[key as 'A' | 'B' | 'C' | 'D'] }}
              </span>
            </div>
            <div class="flex items-center gap-0.5">
              <span class="text-xs text-secondary-text"
                >{{ t('careers.profile_test.answer') }}:</span
              >
              <span
                class="inline-flex items-center px-0.5 py-0.125 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {{ answerLabel(index) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  export type Letter = 'A' | 'B' | 'C' | 'D'

  export interface ProfileTestResultsProps {
    answers: Record<number, string>
    groups: Array<Record<'A' | 'B' | 'C' | 'D', string>>
  }

  const props = defineProps<ProfileTestResultsProps>()
  const { t } = useI18n()

  const distributionLetters = computed(() => {
    const dist: Record<Letter, number> = { A: 0, B: 0, C: 0, D: 0 }
    Object.values(props.answers).forEach((v) => {
      if (typeof v === 'string' && ['A', 'B', 'C', 'D'].includes(v)) {
        dist[v as Letter] += 1
      }
    })
    return dist
  })

  const topProfile = computed(() => {
    const entries = Object.entries(distributionLetters.value) as [
      Letter,
      number,
    ][]
    entries.sort((a, b) => b[1] - a[1])
    const top = entries[0]
    if (!top || top[1] === 0)
      return { letter: null as Letter | null, label: null as string | null }
    const mapping: Record<Letter, string> = {
      A: t('careers.profile_test.labels.A'),
      B: t('careers.profile_test.labels.B'),
      C: t('careers.profile_test.labels.C'),
      D: t('careers.profile_test.labels.D'),
    }
    return { letter: top[0], label: mapping[top[0]] }
  })

  function answerLabel(index: number) {
    const ans = props.answers[index]
    if (!ans) return '-'
    const group = props.groups[index]
    if (!group) return ans
    const key = ans as 'A' | 'B' | 'C' | 'D'
    return group[key] || ans
  }
</script>

<style scoped>
  .profile-test-results {
    max-height: 25rem;
    overflow-y: auto;
  }
</style>
