import { initFirebaseAdmin } from '~/server/utils/firebaseAdmin';

export default defineEventHandler(async (event) => {
  const admin = initFirebaseAdmin();
  if (!admin)
    return createError({
      statusCode: 500,
      statusMessage: 'firebase-admin not initialized',
    });

  // Autenticação via cookie de sessão (mesma lógica dos outros handlers admin)
  const cookie = getCookie(event, 'mediari_session');
  if (!cookie)
    return createError({ statusCode: 401, statusMessage: 'unauthenticated' });

  let decodedToken: Record<string, unknown> | null = null;
  try {
    const decoded = await admin.auth().verifySessionCookie(cookie, true);
    decodedToken = decoded as unknown as Record<string, unknown>;
    const claims = decodedToken;
    if (!claims || !claims.admin)
      return createError({ statusCode: 403, statusMessage: 'forbidden' });
  } catch (e) {
    console.warn('[admin candidates.delete] invalid session cookie', e);
    return createError({ statusCode: 401, statusMessage: 'unauthenticated' });
  }

  // id via query string ou body
  const id = getQuery(event).id || (await readBody(event))?.id;
  if (!id || typeof id !== 'string')
    return createError({ statusCode: 400, statusMessage: 'missing id' });

  try {
    const db = admin.firestore();
    const docRef = db.collection('candidates').doc(id);
    const doc = await docRef.get();
    if (!doc.exists)
      return createError({ statusCode: 404, statusMessage: 'not found' });

    const data = doc.data() as Record<string, unknown>;

    // coletar attachments (tentar remover todos)
    const attachments = Array.isArray(data.attachments)
      ? (data.attachments as Array<Record<string, unknown>>)
      : [];
    const bucket = admin.storage().bucket();
    const deleteResults: Array<{ path: string; ok: boolean; error?: string }> =
      [];

    const maxAttempts = 3;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    await Promise.all(
      attachments.map(async (att) => {
        const storagePath =
          att && typeof att.storagePath === 'string'
            ? String(att.storagePath).replace(/^\//, '')
            : null;
        if (!storagePath) return;

        // proteger contra paths inválidos simples
        if (storagePath.includes('..')) {
          deleteResults.push({
            path: storagePath,
            ok: false,
            error: 'invalid storage path',
          });
          return;
        }

        let attempt = 0;
        let lastError: string | undefined;
        while (attempt < maxAttempts) {
          try {
            await bucket.file(storagePath).delete();
            deleteResults.push({ path: storagePath, ok: true });
            lastError = undefined;
            break;
          } catch (err) {
            attempt += 1;
            lastError = err instanceof Error ? err.message : String(err);
            console.warn(
              '[admin candidates.delete] attempt',
              attempt,
              'failed for',
              storagePath,
              lastError
            );
            // backoff
            await sleep(200 * Math.pow(2, attempt - 1));
          }
        }

        if (lastError)
          deleteResults.push({
            path: storagePath,
            ok: false,
            error: lastError,
          });
      })
    );

    // remover subcoleção profileTests (se existir) - apagar docs dentro
    try {
      const testsCol = docRef.collection
        ? docRef.collection('profileTests')
        : null;
      if (testsCol) {
        const snap = await testsCol.get();
        const batch = db.batch();
        snap.docs.forEach((d) => batch.delete(d.ref));
        await batch.commit();
      }
    } catch (e) {
      console.warn(
        '[admin candidates.delete] failed cleaning profileTests',
        id,
        e
      );
    }

    // por fim apagar o documento
    try {
      await docRef.delete();
    } catch (e) {
      console.error(
        '[admin candidates.delete] failed deleting document',
        id,
        e
      );
      return createError({
        statusCode: 500,
        statusMessage: 'failed to delete candidate document',
      });
    }

    // gravação de log de auditoria (não impede a resposta principal em caso de falha)
    try {
      const isEmulator = !!process.env.FIRESTORE_EMULATOR_HOST;
      const timestamp = isEmulator
        ? new Date().toISOString()
        : admin.firestore.FieldValue.serverTimestamp();
      const adminUid = decodedToken && (decodedToken.uid as string);
      const adminEmail = decodedToken && (decodedToken.email as string);

      const logDoc = {
        action: 'delete_candidate',
        candidateId: id,
        candidateData: data || null,
        deletedFiles: deleteResults,
        adminUid: adminUid || null,
        adminEmail: adminEmail || null,
        createdAt: timestamp,
      };

      await db.collection('adminDeletionLogs').add(logDoc);
    } catch (logErr) {
      console.warn('[admin candidates.delete] audit log failed', logErr);
    }

    return { success: true, deletedFiles: deleteResults };
  } catch (e) {
    console.error('[admin candidates.delete] delete error', e);
    return createError({
      statusCode: 500,
      statusMessage: 'failed to delete candidate',
    });
  }
});
