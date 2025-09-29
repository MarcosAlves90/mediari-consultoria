import { ref, computed, type Ref } from 'vue';
import { useFetch } from '#app';

export interface AdminUser {
  uid: string;
  email?: string;
  createdAt?: unknown;
  lastSignInAt?: unknown;
  customClaims?: Record<string, unknown> | null;
  [key: string]: unknown; // Permite propriedades adicionais
}

export function useAdminUsers(
  // Pode receber o uid ou o objeto currentUser retornado por useCurrentUser
  currentUser?:
    | Ref<string | null>
    | Ref<Record<string, unknown> | null>
    | string
    | null
) {
  const users = ref<AdminUser[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const nextPageToken = ref<string | null>(null);

  // Calcula o UID do usuário atual e expõe claims se disponível
  const current = computed(() => {
    if (!currentUser) return null;

    // Se for string direta (uid)
    if (typeof currentUser === 'string') {
      return { uid: currentUser, claims: null };
    }

    // Se for um ref
    if ('value' in currentUser) {
      const v = currentUser.value;

      if (!v) return null;

      // Se for string (uid)
      if (typeof v === 'string') {
        return { uid: v, claims: null };
      }

      // Se for objeto CurrentUser
      if (typeof v === 'object' && 'uid' in v) {
        const userObj = v as Record<string, unknown>;
        return {
          uid: String(userObj.uid),
          claims: userObj.claims as Record<string, unknown> | null,
        };
      }
    }

    return null;
  });

  // Lista filtrada excluindo o usuário atual
  const filteredUsers = computed(() => {
    const currentUid = current.value?.uid ?? null;
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

  // Determina se o usuário atual pode deletar o usuário alvo
  const canDeleteUser = (uid: string): boolean => {
    const currentUid = current.value?.uid ?? null;
    const currentClaims = current.value?.claims ?? null;

    // Não pode deletar se for a si mesmo
    if (currentUid && currentUid === uid) {
      return false;
    }

    // Usuários com claim 'restrictedAdmin' não podem deletar outros administradores
    if (currentClaims && currentClaims.restrictedAdmin) {
      return false;
    }

    // Se o usuário alvo for superAdmin, não permitir deleção via painel
    const target = users.value.find((u) => u.uid === uid) as
      | AdminUser
      | undefined;
    if (
      target &&
      target.customClaims &&
      (target.customClaims as Record<string, unknown>).superAdmin
    ) {
      return false;
    }

    return true;
  };

  const createUser = async (userData: {
    email: string;
    password: string;
    displayName?: string | undefined;
    role?: 'super' | 'restricted' | undefined;
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
