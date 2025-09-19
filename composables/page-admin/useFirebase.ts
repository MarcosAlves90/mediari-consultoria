import { type FirebaseApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

/**
 * Composável para acessar a instância do Firebase App e Analytics.
 * Fornece acesso seguro ao app Firebase e ao serviço de analytics.
 */
export function useFirebase() {
  const nuxtApp = useNuxtApp();
  const app = nuxtApp.$firebaseApp as FirebaseApp | undefined;

  /**
   * Retorna a instância do Firebase App.
   */
  function getApp() {
    return app;
  }

  /**
   * Retorna a instância do Analytics do Firebase.
   * Retorna undefined se não estiver disponível ou se houver erro.
   */
  function getAppAnalytics() {
    try {
      if (!app) return undefined;
      return getAnalytics(app);
    } catch (e) {
      console.warn('[useFirebase] analytics não disponível', e);
      return undefined;
    }
  }

  return {
    app: getApp(),
    analytics: getAppAnalytics(),
  };
}
