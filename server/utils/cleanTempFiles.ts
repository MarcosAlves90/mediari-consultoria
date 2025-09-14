import { initFirebaseAdmin } from '~/server/utils/firebaseAdmin';

/**
 * Limpa arquivos em `candidates/temp/` mais antigos que `maxAgeMs`.
 * Pode ser executado como Cloud Function agendada ou job em Cloud Run.
 */
export async function cleanTempFiles(maxAgeMs = 1000 * 60 * 60 * 24 * 3) {
  const admin = initFirebaseAdmin();
  if (!admin) throw new Error('firebase-admin not initialized');

  const bucket = admin.storage().bucket();
  const prefix = 'candidates/temp/';
  const [files] = await bucket.getFiles({ prefix });
  const now = Date.now();
  const toDelete: string[] = [];

  await Promise.all(
    files.map(async (file) => {
      try {
        const [meta] = await file.getMetadata();
        const updatedStr = (meta && (meta.updated || meta.timeCreated)) as
          | string
          | undefined;
        if (!updatedStr) return;
        const updated = new Date(updatedStr).getTime();
        if (now - updated > maxAgeMs) {
          toDelete.push(file.name);
        }
      } catch (e) {
        console.warn('failed to stat file', file.name, e);
      }
    })
  );

  if (toDelete.length === 0) return { deleted: 0 };

  await Promise.all(
    toDelete.map((p) =>
      bucket
        .file(p)
        .delete()
        .catch((e) => console.warn('failed delete', p, e))
    )
  );
  return { deleted: toDelete.length };
}
