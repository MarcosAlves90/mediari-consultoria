import admin from 'firebase-admin';

let initialized = false;

/**
 * Inicializa o Firebase Admin SDK.
 * Tenta usar credenciais de conta de serviço a partir de variáveis de ambiente.
 * Se não houver credenciais, tenta usar as credenciais padrão do aplicativo.
 * Retorna a instância do admin do Firebase ou undefined se falhar.
 */
export function initFirebaseAdmin() {
  if (initialized) return admin;
  // Forçar uso apenas de NUXT_FIREBASE_ADMIN_SA (base64) para credenciais do Admin
  const saBase64 =
    process.env.NUXT_FIREBASE_ADMIN_SA || process.env.FIREBASE_ADMIN_SA_BASE64;
  let credential;

  if (saBase64) {
    try {
      // Decodifica e analisa a conta de serviço a partir da string base64
      const saJson = Buffer.from(saBase64, 'base64').toString('utf8');
      const sa = JSON.parse(saJson);
      credential = admin.credential.cert(sa);
    } catch (e) {
      console.error(
        '[firebase-admin] falha ao analisar conta de serviço do env:',
        e
      );
    }
  } else {
    console.error(
      '[firebase-admin] NUXT_FIREBASE_ADMIN_SA não definida. Defina a variável com o JSON da service account codificado em base64.'
    );
  }

  try {
    if (credential) {
      admin.initializeApp({ credential });
    } else {
      admin.initializeApp();
    }
    initialized = true;
  } catch (e) {
    // Em alguns ambientes, o admin pode já estar inicializado

    console.warn('[firebase-admin] aviso initializeApp:', e);
    initialized = !!admin.apps.length;
  }

  return admin;
}
