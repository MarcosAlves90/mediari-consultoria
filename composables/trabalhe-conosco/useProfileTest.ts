import { ref, reactive, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSessionStorage } from '../useSessionStorage';
import { useCandidateService } from './useCandidateService';
import type { ProfileTestResult } from '~/types/candidates';

type Letter = 'A' | 'B' | 'C' | 'D';
type TestAnswerValue = Letter;
interface TestAnswers {
  [questionIndex: number]: TestAnswerValue;
}

const LETTERS: Letter[] = ['A', 'B', 'C', 'D'];

const FALLBACK_GROUPS: Array<Record<Letter, string>> = [
  { A: 'Animado', B: 'Aventureiro', C: 'Analítico', D: 'Adaptável' },
  { A: 'Brincalhão', B: 'Persuasivo', C: 'Persistente', D: 'Sereno' },
  { A: 'Sociável', B: 'Energético', C: 'Doador', D: 'Submisso' },
  { A: 'Convincente', B: 'Competitivo', C: 'Atencioso', D: 'Controlado' },
  { A: 'Estimulante', B: 'Habilidoso', C: 'Respeitoso', D: 'Reservado' },
  { A: 'Espirituoso', B: 'Auto-suficiente', C: 'Sensível', D: 'Satisfeito' },
  { A: 'Charmoso', B: 'Positivo', C: 'Planejador', D: 'Paciente' },
  { A: 'Espontâneo', B: 'Seguro', C: 'Organizado', D: 'Tímido' },
  { A: 'Otimista', B: 'Franco', C: 'Ordeiro', D: 'Serviçal' },
  { A: 'Engraçado', B: 'Vigoroso', C: 'Fiel', D: 'Amigável' },
  { A: 'Encantador', B: 'Audacioso', C: 'Minucioso', D: 'Diplomático' },
  { A: 'Alegre', B: 'Confiante', C: 'Culto', D: 'Previsível' },
  { A: 'Inspirado', B: 'Independente', C: 'Idealista', D: 'Inofensivo' },
  { A: 'Demonstrativo', B: 'Decidido', C: 'Profundo', D: 'Irônico' },
  { A: 'Desembaraçado', B: 'Ativo', C: 'Musical', D: 'Mediador' },
  { A: 'Conversador', B: 'Firme', C: 'Pensativo', D: 'Tolerante' },
  { A: 'Metido', B: 'Mandão', C: 'Acanhado', D: 'Vazio' },
  { A: 'Indisciplinado', B: 'Insensível', C: 'Rancoroso', D: 'Desinteressado' },
  { A: 'Vivo', B: 'Líder', C: 'Leal', D: 'Ouvinte' },
  { A: 'Atraente', B: 'Chefe', C: 'Detalhista', D: 'Contente' },
  { A: 'Popular', B: 'Produtivo', C: 'Perfeccionista', D: 'Agradável' },
  { A: 'Vivaz', B: 'Valente', C: 'Comportado', D: 'Equilibrado' },
  { A: 'Repetitível', B: 'Inflexível', C: 'Ressentido', D: 'Relutante' },
  { A: 'Esquecido', B: 'Franco', C: 'Complicado', D: 'Medroso' },
  { A: 'Inoportuno', B: 'Impaciente', C: 'Inseguro', D: 'Indeciso' },
  { A: 'Imprevisível', B: 'Frio', C: 'Impopular', D: 'Desligado' },
  { A: 'Casual', B: 'Cabeçudo', C: 'Insatisfeito', D: 'Exitante' },
  { A: 'Permissivo', B: 'Orgulhoso', C: 'Cauteloso', D: 'Simples' },
  { A: 'Esquentado', B: 'Discutidor', C: 'Alienado', D: 'Incerto' },
  { A: 'Ingênuo', B: 'Ousado', C: 'Negativo', D: 'Indiferente' },
  { A: 'Egoísta', B: 'Trabalhador', C: 'Retraído', D: 'Preocupado' },
  { A: 'Tagarela', B: 'Indelicado', C: 'Sensível demais', D: 'Tímido' },
  { A: 'Desorganizado', B: 'Mandão', C: 'Deprimido', D: 'Confuso' },
  { A: 'Inconstante', B: 'Intolerante', C: 'Introvertido', D: 'Apático' },
  { A: 'Desordenado', B: 'Manipulador', C: 'Triste', D: 'Resmungão' },
  { A: 'Convencido', B: 'Obstinado', C: 'Cético (não acreditar)', D: 'Lento' },
  { A: 'Barulhento', B: 'Tirânico', C: 'Solitário', D: 'Preguiçoso' },
  { A: 'Distraído', B: 'Irritável', C: 'Desconfiado', D: 'Vagaroso' },
  { A: 'Agitado', B: 'Imprudente', C: 'Vingativo', D: 'Relutante' },
  { A: 'Instável', B: 'Astuto', C: 'Crítico', D: 'Acomodado' },
];

export const useProfileTest = () => {
  const [persistedAnswers, setPersistedAnswers, clearPersistedAnswers] =
    useSessionStorage<Record<number, string>>(
      'mediari-profile-test-answers',
      {}
    );

  const profileTestAnswers = reactive<TestAnswers>(
    (persistedAnswers.value as unknown as TestAnswers) || {}
  );
  const isSubmittingTest = ref(false);
  const hasError = ref(false);

  watch(
    () => ({ ...profileTestAnswers }),
    (newAnswers) => setPersistedAnswers(newAnswers),
    { deep: true }
  );

  const { t, te } = useI18n();

  const tryBuildGroupsFromI18n = (): Array<Record<Letter, string>> | null => {
    const count = FALLBACK_GROUPS.length;
    const groups: Array<Record<Letter, string>> = [];

    for (let i = 0; i < count; i++) {
      const group: Partial<Record<Letter, string>> = {};

      for (const k of LETTERS) {
        const path = `careers.profile_test.groups.${i}.${k}`;
        if (!te(path)) return null;
        const value = t(path);
        if (!value || typeof value !== 'string') return null;
        group[k] = value;
      }

      groups.push(group as Record<Letter, string>);
    }

    return groups;
  };

  const GROUPS = tryBuildGroupsFromI18n() ?? FALLBACK_GROUPS;
  const TOTAL_QUESTIONS = GROUPS.length;

  const answeredCount = computed(() => Object.keys(profileTestAnswers).length);

  const progress = computed(() =>
    TOTAL_QUESTIONS > 0 ? (answeredCount.value / TOTAL_QUESTIONS) * 100 : 0
  );
  const isTestComplete = computed(
    () => answeredCount.value === TOTAL_QUESTIONS
  );

  const submitProfileTest = async (): Promise<boolean> => {
    if (!isTestComplete.value) {
      hasError.value = true;
      return false;
    }

    isSubmittingTest.value = true;
    hasError.value = false;

    const { submitProfileTest } = useCandidateService();

    try {
      const candidateId =
        typeof window !== 'undefined'
          ? window.sessionStorage.getItem('mediari-candidate-id')
          : null;

      const basePayload = {
        answers: { ...profileTestAnswers } as Record<number, string>,
      } as unknown;

      if (candidateId)
        (basePayload as Record<string, unknown>).candidateId = candidateId;

      // completedAt será definido no servidor (Firestore) preferencialmente

      await submitProfileTest(basePayload as ProfileTestResult);

      // Limpar dados locais
      clearTestData();

      // Remover candidateId se desejar (opcional)
      if (candidateId && typeof window !== 'undefined')
        window.sessionStorage.removeItem('mediari-candidate-id');

      return true;
    } catch (_e) {
      hasError.value = true;
      return false;
    } finally {
      isSubmittingTest.value = false;
    }
  };

  const clearTestData = (): void => {
    Object.keys(profileTestAnswers).forEach(
      (key) => delete profileTestAnswers[Number(key)]
    );
    clearPersistedAnswers();
    hasError.value = false;
  };

  const setAnswer = (
    questionIndex: number,
    answerValue: TestAnswerValue
  ): void => {
    if (questionIndex < 0 || questionIndex >= TOTAL_QUESTIONS) return;
    if (!LETTERS.includes(answerValue)) return;
    profileTestAnswers[questionIndex] = answerValue;
  };

  const getAnswer = (questionIndex: number): TestAnswerValue | undefined =>
    profileTestAnswers[questionIndex];

  const getTestStatistics = () => {
    const answers = Object.values(profileTestAnswers) as Letter[];
    const totalAnswered = answers.length;
    const totalPending = TOTAL_QUESTIONS - totalAnswered;

    const distributionLetters: Record<Letter, number> = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
    };
    answers.forEach((l) => {
      distributionLetters[l] = (distributionLetters[l] || 0) + 1;
    });

    const topProfile = (() => {
      const entries = Object.entries(distributionLetters) as [Letter, number][];
      entries.sort((a, b) => b[1] - a[1]);
      const top = entries[0];
      if (!top || top[1] === 0)
        return { letter: null as Letter | null, label: null as string | null };
      const mapping: Record<Letter, string> = {
        A: 'INFLUENTE',
        B: 'DOMINANTE',
        C: 'ANALISTA',
        D: 'ESTÁVEL',
      };
      return { letter: top[0], label: mapping[top[0]] };
    })();

    return {
      totalAnswered,
      totalPending,
      distributionLetters,
      topProfile,
    };
  };

  return {
    profileTestAnswers,
    isSubmittingTest,
    hasError,
    progress,
    isTestComplete,
    submitProfileTest,
    clearTestData,
    GROUPS,
    TOTAL_QUESTIONS,
    setAnswer,
    getAnswer,
    getTestStatistics,
  };
};
