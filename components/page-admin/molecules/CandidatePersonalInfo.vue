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

          <button
            :disabled="isDeleting"
            class="common-button flex items-center"
            @click="handleDelete"
            title="{{ t('admin.candidates.delete_candidate') }}"
          >
            <Icon name="mdi:trash-can-outline" class="w-1 h-1 mr-0.5" />
            <span v-if="!isDeleting">{{ t('admin.candidates.delete') }}</span>
            <span v-else>{{ t('admin.candidates.deleting') }}</span>
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
  import { ref } from 'vue'
  import type { Candidate } from '~/composables/page-admin/useAdminCandidates'
  import InfoField from '~/components/page-admin/atoms/InfoField.vue'

  interface Props {
    candidate: Candidate
  }

  const props = defineProps<Props>()
  const candidate = props.candidate
  const emit = defineEmits<{
    downloadResume: []
    deleted: [string]
  }>()

  const isDeleting = ref(false)

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

  const handleDelete = async () => {
    // pedir explicitamente para digitar a palavra 'delete' (case-insensitive)
    const namePrompt = t('admin.candidates.delete_confirm')
    const answer = prompt(namePrompt)
    if (!answer) return
    if (answer.trim().toLowerCase() !== 'delete') {
      // usuário não confirmou corretamente
      alert(t('admin.candidates.delete_failed') as string)
      return
    }
    const id = candidate?.id
    if (!id) return
    try {
      isDeleting.value = true
      const resp = (await $fetch(
        `/api/admin/candidates?id=${encodeURIComponent(id)}`,
        {
          method: 'DELETE',
        }
      )) as {
        success?: boolean
        deletedFiles?: Array<{ path: string; ok: boolean; error?: string }>
      }

      if (resp?.deletedFiles && Array.isArray(resp.deletedFiles)) {
        const failed = resp.deletedFiles.filter((f) => !f.ok)
        if (failed.length > 0) {
          const list = failed
            .map((f) => `${f.path}${f.error ? ` — ${f.error}` : ''}`)
            .join('\n')
          alert(`${t('admin.candidates.delete_failed')}\n\n${list}`)
        }
      }

      emit('deleted', id)
    } catch (e) {
      console.error('Failed deleting candidate', e)
      // fallback: mostrar alerta simples
      alert(t('admin.candidates.delete_failed') as string)
    } finally {
      isDeleting.value = false
    }
  }
</script>
