<script setup lang="ts">
// TODO: Deixar responsivo
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

useSeoMeta({
  title: `${t('admin.users.page_title')}`,
  description: t('admin.users.page_description'),
  robots: 'noindex, nofollow',
})

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
} = useAdminUsers(computed(() => currentUser.value))

// Estado do modal de criação
const isCreateModalOpen = ref(false)
const createModalError = ref<string | null>(null)

onMounted(async () => {
  // Carrega primeiro o usuário atual (incl. claims) para evitar condições de corrida
  // onde a lista de usuários é carregada antes da verificação das claims.
  await loadCurrentUser()
  await loadUsers()
})

const loadNext = async () => {
  if (nextPageToken.value) await loadUsers(nextPageToken.value)
}

// Recarrega informações do usuário atual antes de recarregar a lista.
const doRefresh = async () => {
  await loadCurrentUser()
  await refresh()
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
    const currentUid = currentUser.value?.uid

    // Se for a própria conta
    if (currentUid && currentUid === uid) {
      alert(t('admin.users.cannot_delete_self'))
      return
    }

    // Se for super admin
    const target = filteredUsers.value.find((u) => u.uid === uid)
    if (target?.customClaims?.superAdmin) {
      alert(t('admin.users.cannot_delete_super_admin'))
      return
    }

    // Caso genérico
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

// Computed properties para verificar permissões
const canCreateAdmin = computed(() => {
  const claims = currentUser.value?.claims
  return claims && claims.admin && !claims.restrictedAdmin
})

const canDeleteAdmin = computed(() => {
  const claims = currentUser.value?.claims
  return claims && claims.admin && !claims.restrictedAdmin
})
</script>

<template>
  <AdminHeader :title="t('admin.users.page_title')">
    <template #actions>
      <div class="flex items-center gap-1 max-md:flex-col max-md:w-full max-md:items-start">
        <div class="actions-text text-sm">
          {{ t('admin.users.total', { count: filteredUsers.length }) }}
        </div>

        <div class="flex items-center gap-1 max-md:w-full max-sm:flex-col">
          <button v-if="canCreateAdmin" @click="openCreateModal" :disabled="isLoading" class="common-button max-md:w-full"
            :title="t('admin.users.create_user')">
            <Icon name="mdi:plus" class="w-1 h-1" />
            <span>{{ t('admin.users.create_user') }}</span>
          </button>

          <button @click="doRefresh" :disabled="isLoading" class="common-button max-md:w-full" :title="t('admin.users.refresh')">
            <Icon name="mdi:refresh" class="w-1 h-1" :class="{ 'animate-spin': isLoading }" />
            <span>{{ t('admin.users.refresh') }}</span>
          </button>
        </div>
      </div>
    </template>
  </AdminHeader>

  <main class="max-w-7xl w-full mx-auto px-1 870:px-1.5 py-1 870:py-1.5">
    <section class="870:bg-body-bg-dark rounded 870:border-2 border-accent-color w-full 870:p-2">
      <div v-if="error" class="text-red-600">{{ error }}</div>

      <div class="overflow-auto">
        <!-- Desktop/tablet maior: tabela original visível em telas >=870 -->
        <table class="hidden 870:table w-full text-left text-sm table-fixed">
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
              <th class="p-1 w-1/6 min-w-[120px]">
                {{ t('admin.users.role') || 'Tipo' }}
              </th>
              <th class="p-1 w-1/4 min-w-[180px]">
                {{ t('admin.users.last_login') }}
              </th>
              <th v-if="canDeleteAdmin" class="p-1 w-1/6 min-w-[120px]">
                {{ t('admin.users.actions') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-if="isLoading">
              <tr v-for="i in 5" :key="`skeleton-${i}`" class="border-b">
                <td class="p-1">
                  <Skeleton width="100%" height="1.2rem" />
                </td>
                <td class="p-1">
                  <Skeleton width="100%" height="1.2rem" />
                </td>
                <td class="p-1">
                  <Skeleton width="100%" height="1.2rem" />
                </td>
                <td class="p-1">
                  <Skeleton width="100%" height="1.2rem" />
                </td>
                <!-- Skeleton para a coluna "last login" -->
                <td class="p-1">
                  <Skeleton width="100%" height="1.2rem" />
                </td>
                <td v-if="canDeleteAdmin" class="p-1">
                  <Skeleton width="100%" height="1.2rem" />
                </td>
              </tr>
            </template>

            <template v-else>
              <tr v-for="u in filteredUsers" :key="String(u.email ?? u.uid)" class="border-b">
                <td class="p-1">{{ u.email }}</td>
                <td class="p-1">{{ (u.displayName as string) || '—' }}</td>
                <td class="p-1">{{ formatDate(u.createdAt) }}</td>
                <td class="p-1">
                  {{
                    (u.customClaims &&
                      (u.customClaims.superAdmin
                        ? t('admin.users.role_super') || 'Super'
                        : u.customClaims.restrictedAdmin
                          ? t('admin.users.role_restricted') || 'Restrito'
                          : '—')) ||
                    '—'
                  }}
                </td>
                <td class="p-1">{{ formatDate(u.lastSignInAt) }}</td>
                <td v-if="canDeleteAdmin" class="p-1">
                  <button v-if="canDeleteUser(u.uid)" @click="handleDeleteUser(u)" :disabled="isLoading"
                    class="common-button flex items-center justify-center gap-1" :title="t('admin.users.delete_user')">
                    <Icon name="mdi:delete" />
                    {{ t('admin.users.delete_user') }}
                  </button>
                  <span v-else class="text-gray-500 text-sm"> — </span>
                </td>
              </tr>

              <tr v-if="filteredUsers.length === 0">
                <td class="p-1" :colspan="canDeleteAdmin ? 6 : 5">
                  {{ t('admin.users.no_users') }}
                </td>
              </tr>
            </template>
          </tbody>
        </table>

        <!-- Mobile / small screens: lista em cards (visível em <870) -->
        <div class="block 870:hidden space-y-2">
          <template v-if="isLoading">
            <div v-for="i in 5" :key="`mob-skel-${i}`" class="border-2 rounded p-2 bg-white">
              <Skeleton width="60%" height="1rem" />
              <div class="mt-2">
                <Skeleton width="40%" height="0.9rem" />
              </div>
              <div class="mt-2 flex flex-col gap-1">
                <Skeleton width="50%" height="0.85rem" />
                <Skeleton width="50%" height="0.85rem" />
              </div>
            </div>
          </template>

          <template v-else>
            <div v-for="u in filteredUsers" :key="String(u.email ?? u.uid) + '-card'"
              class="border-2 rounded p-1 bg-white">
              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                <div class="flex-1 min-w-0">
                  <div class="font-semibold text-sm truncate">{{ u.email }}</div>
                  <div class="text-sm text-gray-600 truncate">{{ (u.displayName as string) || '—' }}</div>

                  <div class="mt-1 text-xs text-gray-500">
                    <div>{{ t('admin.users.created') }}: {{ formatDate(u.createdAt) }}</div>
                    <div>{{ t('admin.users.last_login') }}: {{ formatDate(u.lastSignInAt) }}</div>
                    <div>
                      {{ t('admin.users.role') || 'Tipo' }}:
                      {{
                        (u.customClaims &&
                          (u.customClaims.superAdmin
                            ? t('admin.users.role_super') || 'Super'
                            : u.customClaims.restrictedAdmin
                              ? t('admin.users.role_restricted') || 'Restrito'
                              : '—')) ||
                        '—'
                      }}
                    </div>
                  </div>
                </div>

                <div class="flex items-start sm:items-center gap-2">
                  <div v-if="canDeleteAdmin">
                    <button v-if="canDeleteUser(u.uid)" @click="handleDeleteUser(u)" :disabled="isLoading"
                      class="common-button flex items-center justify-center gap-1"
                      :title="t('admin.users.delete_user')">
                      <Icon name="mdi:delete" />
                      <span class="text-sm">{{ t('admin.users.delete_user') }}</span>
                    </button>
                    <span v-else class="text-gray-500 text-sm"> — </span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="filteredUsers.length === 0" class="p-2 text-sm text-gray-600">
              {{ t('admin.users.no_users') }}
            </div>
          </template>
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-2">
        <button v-if="nextPageToken" @click="loadNext" class="common-button" :disabled="isLoading">
          {{ t('admin.users.next_page') }}
        </button>
      </div>
    </section>
  </main>

  <!-- Modal de criação de usuário -->
  <CreateUserModal :is-open="isCreateModalOpen" :is-loading="isLoading" :error="createModalError"
    @close="closeCreateModal" @submit="handleCreateUser" />
</template>
