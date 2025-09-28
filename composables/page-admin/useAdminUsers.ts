import { ref } from 'vue';
import { useFetch } from '#app';

export function useAdminUsers() {
  const users = ref<Array<Record<string, unknown>>>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const nextPageToken = ref<string | null>(null);

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
        users.value = (Array.isArray(d.users) ? d.users : []) as Array<
          Record<string, unknown>
        >;
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

  return {
    users,
    isLoading,
    error,
    nextPageToken,
    loadUsers,
    refresh,
  } as const;
}
