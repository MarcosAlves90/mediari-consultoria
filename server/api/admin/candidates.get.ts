import { initFirebaseAdmin } from '~/server/utils/firebaseAdmin';

export default defineEventHandler(async (event) => {
  const admin = initFirebaseAdmin();
  if (!admin)
    return createError({
      statusCode: 500,
      statusMessage: 'firebase-admin not initialized',
    });

  // Verificação defensiva de autenticação: verificar cookie de sessão
  const cookie = getCookie(event, 'mediari_session');
  if (!cookie)
    return createError({ statusCode: 401, statusMessage: 'unauthenticated' });

  try {
    const decoded = await admin.auth().verifySessionCookie(cookie, true);
    const claims = decoded as unknown as Record<string, unknown>;
    if (!claims.admin)
      return createError({ statusCode: 403, statusMessage: 'forbidden' });
  } catch (e) {
    console.warn('[admin candidates] invalid session cookie', e);
    return createError({ statusCode: 401, statusMessage: 'unauthenticated' });
  }

  try {
    const db = admin.firestore();
    // Ordenar por createdAt desc — em emulator pode ser string, mas assume-se que funciona
    const snapshot = await db
      .collection('candidates')
      .orderBy('createdAt', 'desc')
      .get();

    const items: Array<Record<string, unknown>> = [];

    type TimestampLike = { toDate: () => Date };

    for (const doc of snapshot.docs) {
      const data = doc.data() as Record<string, unknown>;

      // CreatedAt pode ser Timestamp (admin.firestore.Timestamp) ou string
      let submittedAt = '';
      const createdAt = data.createdAt;
      if (
        createdAt &&
        typeof (createdAt as TimestampLike).toDate === 'function'
      ) {
        submittedAt = (createdAt as TimestampLike).toDate().toISOString();
      } else if (typeof createdAt === 'string') {
        submittedAt = createdAt;
      } else if (
        doc.createTime &&
        typeof doc.createTime.toDate === 'function'
      ) {
        submittedAt = doc.createTime.toDate().toISOString();
      } else {
        submittedAt = new Date().toISOString();
      }

      const attachments = Array.isArray(
        data.attachments ? data.attachments : []
      )
        ? (data.attachments as Array<Record<string, unknown>>)
        : [];
      const firstAttachment = attachments[0] || null;

      // Mapear campos para o formato esperado pelo frontend
      const fullName =
        typeof data.fullName === 'string' && data.fullName
          ? String(data.fullName)
          : '';

      items.push({
        id: doc.id,
        fullName: fullName || '—',
        email: typeof data.email === 'string' ? data.email : null,
        phone: typeof data.phone === 'string' ? data.phone : null,
        areaOfInterest:
          (typeof data.positionApplied === 'string' && data.positionApplied) ||
          (typeof data.areaOfInterest === 'string' && data.areaOfInterest) ||
          null,
        experience:
          typeof data.experience === 'string' ? data.experience : null,
        coverLetter:
          typeof data.coverLetter === 'string' ? data.coverLetter : null,
        resumeFileName:
          firstAttachment && typeof firstAttachment.name === 'string'
            ? firstAttachment.name
            : null,
        resumeStoragePath:
          firstAttachment && typeof firstAttachment.storagePath === 'string'
            ? firstAttachment.storagePath
            : null,
        resumeUrl: null, // não expor signed url aqui; usar endpoint de download
        submittedAt,
        testAnswers: null, // será preenchido abaixo se existir
        testScore: null,
        privacyConsent: !!data.privacyConsent,
        raw: data,
      });

      // Pegar último profileTest (se houver)
      try {
        const testsSnap = await db
          .collection('candidates')
          .doc(doc.id)
          .collection('profileTests')
          .orderBy('createdAt', 'desc')
          .limit(1)
          .get();

        if (!testsSnap.empty) {
          const tdoc = testsSnap.docs[0];
          const tdata = tdoc.data();
          // Assumimos que answers estão salvas como record
          const last = items[items.length - 1];
          last.testAnswers = tdata.answers || null;
          // Não há cálculo de score server-side por enquanto
          last.testScore = tdata.score || null;
        }
      } catch (e) {
        // não falhar a listagem por causa de profileTests
        console.warn(
          '[admin candidates] failed to load profileTests for',
          doc.id,
          e
        );
      }
    }

    return { candidates: items };
  } catch (e) {
    console.error('[admin candidates] list error', e);
    return createError({
      statusCode: 500,
      statusMessage: 'failed to load candidates',
    });
  }
});
