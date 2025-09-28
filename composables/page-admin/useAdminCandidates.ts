import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

export interface Candidate {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  areaOfInterest: string;
  experience: string;
  coverLetter: string;
  resumeFileName: string;
  resumeStoragePath?: string;
  submittedAt: string;
  testAnswers?: Record<number, string>;
  testScore?: number;
  privacyConsent: boolean;
}

interface ApiCandidate {
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
  submittedAt?: string | null;
  testAnswers?: Record<number, string> | null;
  testScore?: number | null;
  privacyConsent?: boolean | null;
}

interface CandidatesApiResponse {
  candidates: ApiCandidate[];
}

interface DownloadResponse {
  downloadUrl?: string;
}

export const useAdminCandidates = () => {
  const candidates = ref<Candidate[]>([]);
  const selectedCandidate = ref<Candidate | null>(null);
  const isLoading = ref(false);
  const hasError = ref(false);

  const mapApiCandidate = (c: ApiCandidate): Candidate => {
    const candidate: Partial<Candidate> = {
      id: String(c.id),
      fullName: c.fullName || '—',
      email: c.email || '',
      phone: c.phone || '',
      areaOfInterest: c.areaOfInterest || c.positionApplied || '',
      experience: c.experience || '',
      coverLetter: c.coverLetter || '',
      resumeFileName: c.resumeFileName || '',
      submittedAt: c.submittedAt || new Date().toISOString(),
      privacyConsent: !!c.privacyConsent,
    };

    if (c.testAnswers) candidate.testAnswers = c.testAnswers;
    if (c.testScore !== null && c.testScore !== undefined)
      candidate.testScore = c.testScore;
    if (c.resumeStoragePath) candidate.resumeStoragePath = c.resumeStoragePath;

    return candidate as Candidate;
  };

  const loadCandidates = async (): Promise<void> => {
    isLoading.value = true;
    hasError.value = false;

    try {
      const response = await $fetch<CandidatesApiResponse>(
        '/api/admin/candidates'
      );
      candidates.value = response.candidates?.map(mapApiCandidate) || [];
    } catch (error) {
      console.error('Error loading candidates:', error);
      candidates.value = [];
      hasError.value = true;
    } finally {
      isLoading.value = false;
    }
  };

  const selectCandidate = (candidate: Candidate | null): void => {
    selectedCandidate.value = candidate;
  };

  const downloadResume = async (): Promise<void> => {
    const { t } = useI18n();
    if (!selectedCandidate.value?.resumeStoragePath) {
      // Não expor urls públicas — use endpoint de download. Se não houver storagePath, informar o admin.
      alert(t('admin.candidates.download_not_available') as string);
      return;
    }

    try {
      const response = await $fetch<DownloadResponse>(
        '/api/admin/careers/download',
        {
          method: 'POST',
          body: { storagePath: selectedCandidate.value.resumeStoragePath },
        }
      );

      if (response.downloadUrl) {
        window.open(response.downloadUrl, '_blank');
      }
    } catch (error) {
      console.error('Failed to generate download URL:', error);
      alert(t('admin.candidates.download_failed') as string);
    }
  };

  const getCandidateById = (id: string): Candidate | undefined =>
    candidates.value.find((candidate) => candidate.id === id);

  const getCandidatesByArea = (area: string): Candidate[] =>
    candidates.value.filter((candidate) => candidate.areaOfInterest === area);

  const getTestCompletionRate = (candidate: Candidate): number => {
    if (!candidate.testAnswers) return 0;
    const totalQuestions = 40;
    const answeredQuestions = Object.keys(candidate.testAnswers).length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  return {
    candidates,
    selectedCandidate,
    isLoading,
    hasError,
    loadCandidates,
    selectCandidate,
    downloadResume,
    getCandidateById,
    getCandidatesByArea,
    getTestCompletionRate,
  };
};
