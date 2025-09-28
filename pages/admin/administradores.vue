<script setup lang="ts">
  import { onMounted, computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { AdminHeader, CreateUserModal } from '~/components/page-admin'
  import Skeleton from '~/components/atoms/Skeleton.vue'
  import {
    useAdminUsers,
    type AdminUser,
  } from '~/composables/page-admin/useAdminUsers'
  import { useCurrentUser } from '~/composables/page-admin/useCurrentUser'

  definePageMeta({ layout: 'admin', middleware: 'admin' })

  const { t } = useI18n()

  const { currentUser, loadCurrentUser } = useCurrentUser()

  const {
    filteredUsers,
    isLoading,
    error,
    nextPageToken,
    loadUsers,
    refresh,
    createUser,
    deleteUser,
    canDeleteUser,
  } = useAdminUsers(computed(() => currentUser.value?.uid || null))

  // Estado do modal de criação
  const isCreateModalOpen = ref(false)
  const createModalError = ref<string | null>(null)

  onMounted(async () => {
    await Promise.all([loadCurrentUser(), loadUsers()])
  })

  const loadNext = async () => {
    if (nextPageToken.value) await loadUsers(nextPageToken.value)
  }

  const openCreateModal = () => {
    createModalError.value = null
    isCreateModalOpen.value = true
  }

  const closeCreateModal = () => {
    createModalError.value = null
    isCreateModalOpen.value = false
  }

  const handleCreateUser = async (userData: {
    email: string
    password: string
    displayName?: string | undefined
  }) => {
    createModalError.value = null

    const result = await createUser(userData)

    if (result.success) {
      closeCreateModal()
      // Opcional: mostrar mensagem de sucesso
      console.log(t('admin.users.create_success'))
    } else {
      createModalError.value = error.value || t('admin.users.create_error')
    }
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

  const handleDeleteUser = async (user: AdminUser) => {
    const email = user.email
    const uid = user.uid

    if (!uid) return

    // Verifica se o usuário pode ser deletado
    if (!canDeleteUser(uid)) {
      alert(t('admin.users.cannot_delete_self'))
      return
    }

    const confirmed = confirm(
      t('admin.users.delete_confirmation', { email: email || uid })
    )

    if (!confirmed) return

    const success = await deleteUser(uid)

    if (success) {
      // Opcional: mostrar mensagem de sucesso
      console.log(t('admin.users.delete_success'))
    } else {
      // Opcional: mostrar mensagem de erro
      alert(t('admin.users.delete_error'))
    }
  }
</script>

<template>
  <AdminHeader :title="t('admin.users.page_title')">
    <template #actions>
      <div class="flex items-center gap-1">
        <div class="actions-text text-sm">
          {{ t('admin.users.total', { count: filteredUsers.length }) }}
        </div>

        <button
          @click="openCreateModal"
          :disabled="isLoading"
          class="common-button"
          :title="t('admin.users.create_user')"
        >
          <Icon name="mdi:plus" class="w-1 h-1" />
          <span>{{ t('admin.users.create_user') }}</span>
        </button>

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
    <section
      class="bg-body-bg-dark rounded border-2 border-accent-color p-2 min-w-[920px]"
    >
      <div v-if="error" class="text-red-600">{{ error }}</div>

      <div class="overflow-auto">
        <table class="w-full text-left text-sm table-fixed">
          <thead>
            <tr class="border-b">
              <th class="p-1 w-2/5 min-w-[250px]">
                {{ t('admin.users.email') }}
              </th>
              <th class="p-1 w-1/5 min-w-[160px]">
                {{ t('admin.users.name') }}
              </th>
              <th class="p-1 w-1/4 min-w-[180px]">
                {{ t('admin.users.created') }}
              </th>
              <th class="p-1 w-1/4 min-w-[180px]">
                {{ t('admin.users.last_login') }}
              </th>
              <th class="p-1 w-1/6 min-w-[120px]">
                {{ t('admin.users.actions') }}
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
                    :width="i % 2 === 0 ? '140px' : '160px'"
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
                <td class="p-1">
                  <Skeleton width="80px" height="1.2rem" />
                </td>
              </tr>
            </template>

            <template v-else>
              <tr
                v-for="u in filteredUsers"
                :key="String(u.email ?? u.uid)"
                class="border-b"
              >
                <td class="p-1">{{ u.email }}</td>
                <td class="p-1">{{ (u.displayName as string) || '—' }}</td>
                <td class="p-1">{{ formatDate(u.createdAt) }}</td>
                <td class="p-1">{{ formatDate(u.lastSignInAt) }}</td>
                <td class="p-1">
                  <button
                    @click="handleDeleteUser(u)"
                    :disabled="isLoading"
                    class="common-button flex items-center justify-center gap-1"
                    :title="t('admin.users.delete_user')"
                  >
                    <Icon name="mdi:delete" />
                    {{ t('admin.users.delete_user') }}
                  </button>
                </td>
              </tr>

              <tr v-if="filteredUsers.length === 0">
                <td class="p-1" colspan="5">{{ t('admin.users.no_users') }}</td>
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

  <!-- Modal de criação de usuário -->
  <CreateUserModal
    :is-open="isCreateModalOpen"
    :is-loading="isLoading"
    :error="createModalError"
    @close="closeCreateModal"
    @submit="handleCreateUser"
  />
</template>
