// Inicializa o Firebase no cliente usando valores de runtimeConfig.
// Este arquivo roda apenas no client-side (sufixo .client.ts).
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const fb = config.public.firebase as Record<string, string> | undefined

  // Formato do firebaseConfig — validação mínima
  if (!fb) {
    // eslint-disable-next-line no-console
    console.warn('[firebase] runtime config public.firebase not found')
    return
  }

  const firebaseConfig = {
    apiKey: fb.apiKey || '',
    authDomain: fb.authDomain || '',
    projectId: fb.projectId || '',
    storageBucket: fb.storageBucket || '',
    messagingSenderId: fb.messagingSenderId || '',
    appId: fb.appId || '',
    measurementId: fb.measurementId || '',
  }

  // Evita inicializar múltiplas vezes
  let app: FirebaseApp | null = null
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
    try {
      // analytics só funciona em navegadores com suporte
      if (typeof window !== 'undefined') {
        getAnalytics(app)
      }
    } catch (e) {
      // Falha ao inicializar analytics não deve quebrar o app
      // eslint-disable-next-line no-console
      console.warn('[firebase] analytics not initialized:', e)
    }
  } else {
    app = getApps()[0]
  }

  // Disponibiliza via provide/inject
  nuxtApp.provide('firebaseApp', app)
})
