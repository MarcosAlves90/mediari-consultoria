import { ref, computed, readonly } from 'vue';
import { useFetch } from '#app';

export interface CurrentUser {
  uid: string;
  email: string | null;
  name: string | null;
  claims?: Record<string, unknown> | null;
}

export function useCurrentUser() {
  const currentUser = ref<CurrentUser | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!currentUser.value);

  const loadCurrentUser = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const res = await useFetch('/api/session', { method: 'GET' });
      const data = res.data?.value ?? res.data ?? null;
      const fetchError = res.error?.value;

      if (fetchError) {
        error.value = String(fetchError);
        currentUser.value = null;
      } else if (data && typeof data === 'object') {
        const sessionData = data as Record<string, unknown>;

        if (sessionData.authenticated) {
          currentUser.value = {
            uid: String(sessionData.uid || ''),
            email: sessionData.email ? String(sessionData.email) : null,
            name: sessionData.name ? String(sessionData.name) : null,
            claims:
              (sessionData.customClaims as Record<string, unknown>) || null,
          };
        } else {
          currentUser.value = null;
        }
      } else {
        currentUser.value = null;
      }
    } catch (e: unknown) {
      error.value = String(e);
      currentUser.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    currentUser: readonly(currentUser),
    isAuthenticated,
    isLoading: readonly(isLoading),
    error: readonly(error),
    loadCurrentUser,
  } as const;
}
