<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { AdminHeader } from '~/components/page-admin'
  import Skeleton from '~/components/atoms/Skeleton.vue'
  import { useAdminUsers } from '~/composables/page-admin/useAdminUsers'

  definePageMeta({ layout: 'admin', middleware: 'admin' })

  const { t } = useI18n()

  const { users, isLoading, error, nextPageToken, loadUsers, refresh } =
    useAdminUsers()

  onMounted(() => {
    loadUsers()
  })

  const loadNext = async () => {
    if (nextPageToken.value) await loadUsers(nextPageToken.value)
  }

  function formatDate(value: unknown): string {
    if (!value) return '—'

    // Trata strings ISO ou objetos com método toDate()
    let d: Date | null = null
    if (typeof value === 'string') {
      const parsed = new Date(value)
      if (!isNaN(parsed.getTime())) d = parsed
    } else if (typeof value === 'object' && value !== null) {
      if (typeof (value as { toDate?: unknown }).toDate === 'function') {
        d = (value as { toDate: () => Date }).toDate()
      }
    }

    if (!d) return '—'

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d)
  }
</script>

<template>
  <AdminHeader :title="t('admin.users.page_title')">
    <template #actions>
      <div class="flex items-center gap-1">
        <div class="actions-text text-sm">
          {{ t('admin.users.total', { count: users.length }) }}
        </div>

        <button
          @click="refresh"
          :disabled="isLoading"
          class="common-button"
          :title="t('admin.users.refresh')"
        >
          <Icon
            name="mdi:refresh"
            class="w-1 h-1"
            :class="{ 'animate-spin': isLoading }"
          />
          <span>{{ t('admin.users.refresh') }}</span>
        </button>
      </div>
    </template>
  </AdminHeader>

  <main class="max-w-7xl mx-auto px-0.5 500:px-1 870:px-1.5 py-1 870:py-1.5">
    <section class="bg-body-bg-dark rounded border-2 border-accent-color p-2 min-w-[800px]">
      <div v-if="error" class="text-red-600">{{ error }}</div>

      <div class="overflow-auto">
        <table class="w-full text-left text-sm table-fixed">
          <thead>
            <tr class="border-b">
              <th class="p-1 w-2/5 min-w-[250px]">
                {{ t('admin.users.email') }}
              </th>
              <th class="p-1 w-1/3 min-w-[180px]">
                {{ t('admin.users.created') }}
              </th>
              <th class="p-1 w-1/3 min-w-[180px]">
                {{ t('admin.users.last_login') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-if="isLoading">
              <tr v-for="i in 5" :key="`skeleton-${i}`" class="border-b">
                <td class="p-1">
                  <Skeleton
                    :width="i % 2 === 0 ? '200px' : '240px'"
                    height="1.2rem"
                  />
                </td>
                <td class="p-1">
                  <Skeleton
                    :width="i % 3 === 0 ? '140px' : '160px'"
                    height="1.2rem"
                  />
                </td>
                <td class="p-1">
                  <Skeleton
                    :width="i % 2 === 1 ? '150px' : '170px'"
                    height="1.2rem"
                  />
                </td>
              </tr>
            </template>

            <template v-else>
              <tr
                v-for="u in users"
                :key="String(u.email ?? u.uid)"
                class="border-b"
              >
                <td class="p-1">{{ u.email }}</td>
                <td class="p-1">{{ formatDate(u.createdAt) }}</td>
                <td class="p-1">{{ formatDate(u.lastSignInAt) }}</td>
              </tr>

              <tr v-if="users.length === 0">
                <td class="p-2" colspan="3">{{ t('admin.users.no_users') }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div class="flex justify-end gap-2 mt-2">
        <button
          v-if="nextPageToken"
          @click="loadNext"
          class="common-button"
          :disabled="isLoading"
        >
          {{ t('admin.users.next_page') }}
        </button>
      </div>
    </section>
  </main>
</template>
