import admin from 'firebase-admin';

let initialized = false;

/**
 * Initializes Firebase Admin SDK.
 * Automatically detects emulator or production mode.
 * Returns Firebase admin instance or undefined if initialization fails.
 */
export function initFirebaseAdmin(): typeof admin | undefined {
  if (initialized) return admin;

  const storageBucket = getStorageBucket();
  if (!storageBucket) return undefined;

  if (isRunningInEmulator()) {
    return initializeForEmulator(storageBucket);
  }

  return initializeForProduction(storageBucket);
}

function getStorageBucket(): string | undefined {
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  if (!storageBucket) {
    console.error('[firebase-admin] FIREBASE_STORAGE_BUCKET not defined');
    return undefined;
  }

  return storageBucket;
}

function isRunningInEmulator(): boolean {
  return Boolean(
    process.env.FIRESTORE_EMULATOR_HOST ||
      process.env.FIREBASE_STORAGE_EMULATOR_HOST
  );
}

function initializeForEmulator(
  storageBucket: string
): typeof admin | undefined {
  console.log('[firebase-admin] Emulator mode detected');

  try {
    admin.initializeApp({
      projectId: 'mediari',
      storageBucket,
    });

    initialized = true;
    console.log('[firebase-admin] Initialized for emulators');
    return admin;
  } catch (error) {
    return handleInitializationError(error, 'emulator');
  }
}

function initializeForProduction(
  storageBucket: string
): typeof admin | undefined {
  const credential = createProductionCredential();

  try {
    const config: admin.AppOptions = { storageBucket };

    if (credential) {
      config.credential = credential;
    }

    admin.initializeApp(config);
    initialized = true;
    console.log('[firebase-admin] Initialized for production');
    return admin;
  } catch (error) {
    return handleInitializationError(error, 'production');
  }
}

function createProductionCredential(): admin.credential.Credential | undefined {
  const serviceAccountBase64 = getServiceAccountFromEnv();

  if (!serviceAccountBase64) {
    console.error(
      '[firebase-admin] Service account not found. Set NUXT_FIREBASE_ADMIN_SA with base64 encoded service account JSON.'
    );
    return undefined;
  }

  try {
    const serviceAccountJson = Buffer.from(
      serviceAccountBase64,
      'base64'
    ).toString('utf8');
    const serviceAccount = JSON.parse(serviceAccountJson);

    console.log('[firebase-admin] Service account loaded successfully');
    return admin.credential.cert(serviceAccount);
  } catch (error) {
    console.error(
      '[firebase-admin] Failed to parse service account from env:',
      error
    );
    return undefined;
  }
}

function getServiceAccountFromEnv(): string | undefined {
  return (
    process.env.NUXT_FIREBASE_ADMIN_SA || process.env.FIREBASE_ADMIN_SA_BASE64
  );
}

function handleInitializationError(
  error: unknown,
  mode: 'emulator' | 'production'
): typeof admin | undefined {
  console.warn(
    `[firebase-admin] Warning during ${mode} initialization:`,
    error
  );
  initialized = Boolean(admin.apps.length);
  return admin;
}
