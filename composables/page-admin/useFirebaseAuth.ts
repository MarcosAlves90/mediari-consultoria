import { type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  type User,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';

/**
 * Composável para gerenciar autenticação com Firebase.
 * Fornece funções para login, logout e monitoramento de mudanças de estado de autenticação.
 */
export function useFirebaseAuth() {
  const nuxtApp = useNuxtApp();
  const app = nuxtApp.$firebaseApp as FirebaseApp | undefined;

  /**
   * Obtém a instância de autenticação do Firebase.
   * Retorna null se o app não estiver disponível.
   */
  function getAuthInstance() {
    if (!app) return null;
    try {
      return getAuth(app);
    } catch (e) {
      console.warn('[useFirebaseAuth] erro getAuth', e);
      return null;
    }
  }

  /**
   * Faz login com email e senha.
   * @param email - Email do usuário
   * @param password - Senha do usuário
   * @returns Usuário autenticado
   */
  async function signIn(email: string, password: string) {
    const auth = getAuthInstance();
    if (!auth) {
      // Use your error mapping system here, e.g. mapFirebaseError('auth/unavailable')
      throw new Error(
        'Não foi possível acessar o serviço de autenticação. Tente novamente mais tarde.'
      );
    }
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user as User;
  }

  /**
   * Faz logout do usuário atual.
   */
  async function signOut() {
    const auth = getAuthInstance();
    if (!auth) return;
    await firebaseSignOut(auth);
  }

  /**
   * Monitora mudanças no estado de autenticação.
   * @param cb - Callback chamado quando o estado muda
   * @returns Função para remover o listener
   */
  function onAuthChange(cb: (user: User | null) => void) {
    const auth = getAuthInstance();
    if (!auth) return () => {};
    return onAuthStateChanged(auth, cb);
  }

  return {
    signIn,
    signOut,
    onAuthChange,
  };
}
