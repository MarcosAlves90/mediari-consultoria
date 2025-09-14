import { ref } from 'vue';
import type { JobApplication, ProfileTestResult } from '~/types/candidates';

/**
 * Cliente service que utiliza os endpoints server-side:
 * - POST /api/careers/upload-url  -> gera signed upload URL
 * - POST /api/careers/submit      -> grava candidate
 * - POST /api/careers/profile     -> grava profile test
 */

/**
 * Composable/Service para envio de candidaturas e profile tests ao Firebase.
 * Implementação mínima: esqueleto com pontos de extensão para lógica real.
 */
export const useCandidateService = () => {
  const isSubmitting = ref(false);
  const error = ref<Error | null>(null);

  // Server-side endpoints are used; client-side Firebase instances are not required here.

  /**
   * Submete uma candidatura: faz upload do arquivo (se houver) e grava documentos no Firestore.
   * Observação: esta função é apenas um skeleton — recomenda-se mover lógica sensível para Callable Functions.
   */
  async function submitApplication(
    application: JobApplication,
    resumeFile?: File,
    onProgress?: (percent: number) => void
  ) {
    isSubmitting.value = true;
    error.value = null;

    try {
      // Workflow:
      // 1) if resumeFile: request signed upload URL from server
      // 2) upload file with PUT to signed URL
      // 3) call /api/careers/submit with application + storagePath

      let storagePath: string | undefined = undefined;
      if (resumeFile) {
        const uploadResp = (await $fetch('/api/careers/upload-url', {
          method: 'POST',
          body: { fileName: resumeFile.name, contentType: resumeFile.type },
        })) as { uploadUrl: string; storagePath: string };

        // upload via XHR to get progress
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('PUT', uploadResp.uploadUrl);
          xhr.setRequestHeader(
            'Content-Type',
            resumeFile.type || 'application/octet-stream'
          );
          xhr.upload.onprogress = (ev) => {
            if (ev.lengthComputable && onProgress) {
              const percent = Math.round((ev.loaded / ev.total) * 100);
              onProgress(percent);
            }
          };
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve();
            else reject(new Error('upload failed: ' + xhr.status));
          };
          xhr.onerror = () => reject(new Error('upload error'));
          xhr.send(resumeFile);
        });

        storagePath = uploadResp.storagePath;
      }

      const submitPayload = {
        firstName: application.firstName,
        lastName: application.lastName || null,
        email: application.email,
        phone: application.phone || null,
        positionApplied: application.positionApplied || null,
        storagePath: storagePath || undefined,
      } as Record<string, unknown>;

      const submitResp = (await $fetch('/api/careers/submit', {
        method: 'POST',
        body: submitPayload,
      })) as { candidateId?: string };

      return { candidateId: submitResp.candidateId };
    } catch (err: unknown) {
      error.value = err as Error;
      throw err;
    } finally {
      isSubmitting.value = false;
    }
  }

  async function submitProfileTest(profile: ProfileTestResult) {
    isSubmitting.value = true;
    error.value = null;

    try {
      const payload = profile as unknown as Record<string, unknown>;
      await $fetch('/api/careers/profile', { method: 'POST', body: payload });
      return { ok: true };
    } catch (err: unknown) {
      error.value = err as Error;
      throw err;
    } finally {
      isSubmitting.value = false;
    }
  }

  return {
    isSubmitting,
    error,
    submitApplication,
    submitProfileTest,
  };
};
