import { ref } from 'vue';

export interface Candidate {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  areaOfInterest: string;
  experience: string;
  coverLetter: string;
  resumeFileName: string;
  resumeUrl: string;
  submittedAt: string;
  testAnswers?: Record<number, string>;
  testScore?: number;
  privacyConsent: boolean;
}

export const useAdminCandidates = () => {
  const candidates = ref<Candidate[]>([]);
  const selectedCandidate = ref<Candidate | null>(null);
  const isLoading = ref(false);
  const hasError = ref(false);

  // Mock data removed: use real API response. When loading or on error we keep `candidates` empty

  const loadCandidates = async (): Promise<void> => {
    isLoading.value = true;
    hasError.value = false;

    try {
      // Tenta buscar candidatos do servidor (endpoint protegido)
      type ResponseCandidate = {
        id: string;
        fullName?: string;
        email?: string | null;
        phone?: string | null;
        areaOfInterest?: string | null;
        positionApplied?: string | null;
        experience?: string | null;
        coverLetter?: string | null;
        resumeFileName?: string | null;
        resumeStoragePath?: string | null;
        resumeUrl?: string | null;
        submittedAt?: string | null;
        testAnswers?: Record<number, string> | null;
        testScore?: number | null;
        privacyConsent?: boolean | null;
      };

      type CandidatesResponse = { candidates: ResponseCandidate[] } | unknown;

      const response = (await $fetch('/api/admin/candidates').catch((err) => {
        throw err;
      })) as CandidatesResponse;

      const resp = response as { candidates?: ResponseCandidate[] } | undefined;
      if (resp && Array.isArray(resp.candidates)) {
        // Mapear dados retornados para o formato local
        const mapped = resp.candidates.map((c: ResponseCandidate) => ({
          id: String(c.id),
          fullName: c.fullName || '—',
          email: c.email || '',
          phone: c.phone || '',
          areaOfInterest: c.areaOfInterest || c.positionApplied || '',
          experience: c.experience || '',
          coverLetter: c.coverLetter || '',
          resumeFileName: c.resumeFileName || '',
          // resumeUrl pode não existir; mantemos campo vazio
          resumeUrl: c.resumeUrl || '',
          submittedAt: c.submittedAt || new Date().toISOString(),
          testAnswers: c.testAnswers
            ? (c.testAnswers as Record<number, string>)
            : undefined,
          testScore: typeof c.testScore === 'number' ? c.testScore : undefined,
          privacyConsent: !!c.privacyConsent,
        }));

        candidates.value = mapped as unknown as Candidate[];
        return;
      }

      // Se a resposta não estiver no formato esperado, usar fallback
      console.warn('[useAdminCandidates] unexpected response, leaving empty');
      candidates.value = [];
    } catch (error) {
      console.error('Error loading candidates:', error);
      // fallback: manter lista vazia para evitar mostrar dados incorretos
      candidates.value = [];
      hasError.value = true;
    } finally {
      isLoading.value = false;
    }
  };

  const selectCandidate = (candidate: Candidate): void => {
    selectedCandidate.value = candidate;
  };

  const downloadResume = async (): Promise<void> => {
    if (!selectedCandidate.value) return;

    // Se já existir resumeStoragePath (do servidor), solicitar signed URL
    const storagePath = (
      selectedCandidate.value as unknown as Record<string, unknown>
    )['resumeStoragePath'] as string | undefined;
    if (storagePath) {
      try {
        const res = await $fetch('/api/admin/careers/download', {
          method: 'POST',
          body: { storagePath },
        });
        type DownloadResponse = { downloadUrl?: string } | unknown;
        const downloadResponse = res as DownloadResponse;

        if (
          downloadResponse &&
          typeof downloadResponse === 'object' &&
          downloadResponse !== null &&
          'downloadUrl' in downloadResponse
        ) {
          const maybe = downloadResponse as { downloadUrl?: unknown };
          if (typeof maybe.downloadUrl === 'string') {
            window.open(maybe.downloadUrl, '_blank');
            return;
          }
        }
      } catch (e) {
        console.error('failed to request signed url', e);
      }
    }

    // fallback: se houver resumeUrl público, abre; senão mostra alerta
    if (selectedCandidate.value.resumeUrl) {
      window.open(selectedCandidate.value.resumeUrl, '_blank');
      return;
    }

    alert(`Download iniciado: ${selectedCandidate.value.resumeFileName}`);
  };

  const getCandidateById = (id: string): Candidate | undefined => {
    return candidates.value.find((candidate) => candidate.id === id);
  };

  const getCandidatesByArea = (area: string): Candidate[] => {
    return candidates.value.filter(
      (candidate) => candidate.areaOfInterest === area
    );
  };

  const getTestCompletionRate = (candidate: Candidate): number => {
    if (!candidate.testAnswers) return 0;
    const totalQuestions = 20; // Based on the profile test
    const answeredQuestions = Object.keys(candidate.testAnswers).length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  return {
    // State
    candidates,
    selectedCandidate,
    isLoading,
    hasError,

    // Methods
    loadCandidates,
    selectCandidate,
    downloadResume,
    getCandidateById,
    getCandidatesByArea,
    getTestCompletionRate,
  };
};
