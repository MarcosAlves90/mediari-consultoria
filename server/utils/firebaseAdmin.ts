import admin from 'firebase-admin'

let initialized = false

/**
 * Inicializa o Firebase Admin SDK.
 * Tenta usar credenciais de conta de serviço a partir de variáveis de ambiente.
 * Se não houver credenciais, tenta usar as credenciais padrão do aplicativo.
 * Retorna a instância do admin do Firebase ou undefined se falhar.
 */
export function initFirebaseAdmin() {
  if (initialized) return admin

  const saBase64 = process.env.NUXT_FIREBASE_ADMIN_SA || process.env.FIREBASE_ADMIN_SA_BASE64
  let credential

  if (saBase64) {
    try {
      // Decodifica e analisa a conta de serviço a partir da string base64
      const saJson = Buffer.from(saBase64, 'base64').toString('utf8')
      const sa = JSON.parse(saJson)
      credential = admin.credential.cert(sa)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[firebase-admin] falha ao analisar conta de serviço do env:', e)
    }
  }

  if (!credential && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Usa credenciais padrão do aplicativo se disponíveis
    credential = admin.credential.applicationDefault()
  }

  if (!credential) {
    // eslint-disable-next-line no-console
    console.error('[firebase-admin] Nenhuma conta de serviço encontrada. Defina NUXT_FIREBASE_ADMIN_SA (base64) ou GOOGLE_APPLICATION_CREDENTIALS')
  }

  try {
    if (credential) {
      admin.initializeApp({ credential })
    } else {
      admin.initializeApp()
    }
    initialized = true
  } catch (e) {
    // Em alguns ambientes, o admin pode já estar inicializado
    // eslint-disable-next-line no-console
    console.warn('[firebase-admin] aviso initializeApp:', e)
    initialized = !!admin.apps.length
  }

  return admin
}
