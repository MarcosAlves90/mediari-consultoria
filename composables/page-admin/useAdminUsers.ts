import { ref, computed, type Ref } from 'vue';
import { useFetch } from '#app';

export interface AdminUser {
  uid: string;
  email?: string;
  createdAt?: unknown;
  lastSignInAt?: unknown;
  [key: string]: unknown; // Permite propriedades adicionais
}

export function useAdminUsers(
  currentUserUid?: Ref<string | null> | string | null
) {
  const users = ref<AdminUser[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const nextPageToken = ref<string | null>(null);

  // Calcula o UID do usuário atual
  const excludeUid = computed(() => {
    if (typeof currentUserUid === 'string') return currentUserUid;
    if (currentUserUid && 'value' in currentUserUid)
      return currentUserUid.value;
    return null;
  });

  // Lista filtrada excluindo o usuário atual
  const filteredUsers = computed(() => {
    const currentUid = excludeUid.value;
    if (!currentUid) return users.value;
    return users.value.filter((user) => user.uid !== currentUid);
  });

  const loadUsers = async (token?: string | null) => {
    isLoading.value = true;
    error.value = null;

    const url = token
      ? `/api/admin/users?nextPageToken=${encodeURIComponent(token)}`
      : '/api/admin/users';

    try {
      const res = await useFetch(url, { method: 'GET' });
      const dataUnknown: unknown = res.data?.value ?? res.data ?? null;
      const fetchError = res.error?.value;

      if (fetchError) {
        error.value = String(fetchError);
        users.value = [];
      } else if (dataUnknown && typeof dataUnknown === 'object') {
        const d = dataUnknown as Record<string, unknown>;
        const rawUsers = Array.isArray(d.users) ? d.users : [];

        // Converte para AdminUser garantindo que uid existe
        users.value = rawUsers
          .filter(
            (user): user is Record<string, unknown> =>
              typeof user === 'object' &&
              user !== null &&
              typeof user.uid === 'string'
          )
          .map(
            (user) =>
              ({
                ...user,
                uid: user.uid as string,
                email: user.email as string | undefined,
              }) as AdminUser
          );

        nextPageToken.value =
          typeof d.nextPageToken === 'string' ? d.nextPageToken : null;
      }
    } catch (e: unknown) {
      error.value = String(e);
      users.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const refresh = async () => {
    await loadUsers(null);
  };

  // Previne que o usuário atual se delete
  const canDeleteUser = (uid: string): boolean => {
    const currentUid = excludeUid.value;
    return currentUid !== uid;
  };

  const createUser = async (userData: {
    email: string;
    password: string;
    displayName?: string | undefined;
  }) => {
    isLoading.value = true;
    error.value = null;

    try {
      const res = await useFetch('/api/admin/users', {
        method: 'POST',
        body: userData,
      });

      const fetchError = res.error?.value;
      if (fetchError) {
        error.value = String(fetchError);
        return { success: false, user: null };
      }

      const responseData = res.data?.value ?? res.data;
      if (responseData && typeof responseData === 'object') {
        const data = responseData as { success: boolean; user: AdminUser };

        if (data.success && data.user) {
          // Adiciona o usuário à lista local
          users.value.unshift(data.user);
          return { success: true, user: data.user };
        }
      }

      return { success: false, user: null };
    } catch (e: unknown) {
      error.value = String(e);
      return { success: false, user: null };
    } finally {
      isLoading.value = false;
    }
  };

  const deleteUser = async (uid: string) => {
    // Validação de segurança
    if (!canDeleteUser(uid)) {
      error.value = 'Não é possível deletar sua própria conta.';
      return false;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const res = await useFetch('/api/admin/users', {
        method: 'DELETE',
        body: { uid },
      });

      const fetchError = res.error?.value;
      if (fetchError) {
        error.value = String(fetchError);
        return false;
      }

      // Remove o usuário da lista local
      users.value = users.value.filter((user) => user.uid !== uid);
      return true;
    } catch (e: unknown) {
      error.value = String(e);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    users,
    filteredUsers,
    isLoading,
    error,
    nextPageToken,
    loadUsers,
    refresh,
    createUser,
    deleteUser,
    canDeleteUser,
  } as const;
}
