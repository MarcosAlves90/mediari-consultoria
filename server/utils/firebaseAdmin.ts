import admin from 'firebase-admin';

let initialized = false;

/**
 * Inicializa o Firebase Admin SDK.
 * Detecta automaticamente se está em modo emulator ou produção.
 * Retorna a instância do admin do Firebase ou undefined se falhar.
 */
export function initFirebaseAdmin() {
  if (initialized) return admin;

  // Detectar se estamos usando emulators
  const isEmulator =
    process.env.FIRESTORE_EMULATOR_HOST ||
    process.env.FIREBASE_STORAGE_EMULATOR_HOST;

  if (isEmulator) {
    console.log('[firebase-admin] Modo emulator detectado');
    try {
      admin.initializeApp({
        projectId: 'mediari',
        storageBucket: 'mediari.appspot.com',
      });
      initialized = true;
      console.log('[firebase-admin] Inicializado para emulators');
      return admin;
    } catch (e) {
      console.warn('[firebase-admin] aviso initializeApp (emulator):', e);
      initialized = !!admin.apps.length;
      return admin;
    }
  }

  // Configuração para produção
  const saBase64 =
    process.env.NUXT_FIREBASE_ADMIN_SA || process.env.FIREBASE_ADMIN_SA_BASE64;
  let credential;

  if (saBase64) {
    try {
      // Decodifica e analisa a conta de serviço a partir da string base64
      const saJson = Buffer.from(saBase64, 'base64').toString('utf8');
      const sa = JSON.parse(saJson);
      credential = admin.credential.cert(sa);
      console.log('[firebase-admin] Service account carregada com sucesso');
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
    const config: admin.AppOptions = {};

    if (credential) {
      config.credential = credential;
    }

    admin.initializeApp(config);
    initialized = true;
    console.log('[firebase-admin] Inicializado para produção');
  } catch (e) {
    // Em alguns ambientes, o admin pode já estar inicializado
    console.warn('[firebase-admin] aviso initializeApp:', e);
    initialized = !!admin.apps.length;
  }

  return admin;
}
