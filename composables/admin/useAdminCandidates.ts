import { ref } from "vue";

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

    // Mock data for demonstration - Replace with actual API calls
    const mockCandidates: Candidate[] = [
        {
            id: "1",
            fullName: "Ana Silva Santos",
            email: "ana.silva@email.com",
            phone: "(11) 99999-1234",
            areaOfInterest: "Direito Civil",
            experience: "Graduada em Direito pela USP com 3 anos de experiência em escritórios de advocacia. Especialização em direito civil e família. Experiência em atendimento ao cliente e elaboração de peças processuais.",
            coverLetter: "Tenho grande interesse em fazer parte da equipe da Mediari Consultoria devido à excelente reputação da empresa no mercado jurídico. Acredito que minha experiência em direito civil e minha dedicação ao atendimento de qualidade se alinham perfeitamente com os valores da empresa.",
            resumeFileName: "ana-silva-curriculo.pdf",
            resumeUrl: "/resumes/ana-silva-curriculo.pdf",
            submittedAt: "2024-08-08T10:30:00Z",
            testAnswers: {
                0: 'A', 1: 'B', 2: 'A', 3: 'B', 4: 'C', 5: 'A', 6: 'B', 7: 'A', 8: 'D', 9: 'A',
                10: 'A', 11: 'B', 12: 'C', 13: 'B', 14: 'B', 15: 'C', 16: 'C', 17: 'A', 18: 'A', 19: 'B'
            },
            testScore: 85,
            privacyConsent: true
        },
        {
            id: "2",
            fullName: "Carlos Eduardo Oliveira",
            email: "carlos.oliveira@email.com",
            phone: "(11) 98888-5678",
            areaOfInterest: "Direito Trabalhista",
            experience: "Advogado com 5 anos de experiência em direito trabalhista. Atuação em reclamações trabalhistas, acordos e consultoria preventiva para empresas. Mestrado em Direito do Trabalho.",
            coverLetter: "Meu interesse na Mediari Consultoria surge da oportunidade de aplicar minha experiência em direito trabalhista em uma empresa reconhecida por sua excelência. Tenho sólida formação acadêmica e prática experiência em litígios trabalhistas.",
            resumeFileName: "carlos-oliveira-cv.pdf",
            resumeUrl: "/resumes/carlos-oliveira-cv.pdf",
            submittedAt: "2024-08-07T14:15:00Z",
            testAnswers: {
                0: 'B', 1: 'B', 2: 'B', 3: 'B', 4: 'B', 5: 'C', 6: 'B', 7: 'B', 8: 'B', 9: 'B',
                10: 'B', 11: 'C', 12: 'B', 13: 'C', 14: 'B', 15: 'B', 16: 'B', 17: 'B', 18: 'B', 19: 'B'
            },
            testScore: 92,
            privacyConsent: true
        },
        {
            id: "3",
            fullName: "Mariana Costa Lima",
            email: "mariana.lima@email.com",
            phone: "(11) 97777-9012",
            areaOfInterest: "Direito do Consumidor",
            experience: "Formada em Direito há 2 anos, com experiência em estágio no Procon e em escritório especializado em direito do consumidor. Conhecimento em CDC e práticas abusivas.",
            coverLetter: "Busco uma oportunidade de crescimento profissional em uma empresa séria e comprometida com a defesa dos direitos dos consumidores. Acredito que a Mediari é o local ideal para desenvolver minha carreira.",
            resumeFileName: "mariana-lima-curriculo.docx",
            resumeUrl: "/resumes/mariana-lima-curriculo.docx",
            submittedAt: "2024-08-06T09:45:00Z",
            testAnswers: {
                0: 'A', 1: 'C', 2: 'B', 3: 'C', 4: 'B', 5: 'A', 6: 'C', 7: 'B', 8: 'C', 9: 'B',
                10: 'A', 11: 'A', 12: 'B', 13: 'A', 14: 'C', 15: 'D', 16: 'D', 17: 'A', 18: 'B', 19: 'C'
            },
            testScore: 78,
            privacyConsent: true
        },
        {
            id: "4",
            fullName: "Roberto Ferreira Santos",
            email: "roberto.santos@email.com",
            phone: "(11) 96666-3456",
            areaOfInterest: "Direito Bancário",
            experience: "Advogado sênior com 8 anos de experiência em direito bancário e financeiro. Atuação em grandes bancos e assessoria jurídica para instituições financeiras. Especialização em contratos bancários.",
            coverLetter: "Com vasta experiência em direito bancário, vejo na Mediari Consultoria a oportunidade de contribuir com meu conhecimento técnico e experiência prática para fortalecer ainda mais a atuação da empresa nesta área.",
            resumeFileName: "roberto-santos-cv.pdf",
            resumeUrl: "/resumes/roberto-santos-cv.pdf",
            submittedAt: "2024-08-05T16:20:00Z",
            testAnswers: {
                0: 'C', 1: 'B', 2: 'B', 3: 'B', 4: 'B', 5: 'C', 6: 'B', 7: 'B', 8: 'B', 9: 'B',
                10: 'B', 11: 'C', 12: 'C', 13: 'C', 14: 'B', 15: 'B', 16: 'B', 17: 'C', 18: 'B', 19: 'B'
            },
            testScore: 88,
            privacyConsent: true
        },
        {
            id: "5",
            fullName: "Juliana Almeida Silva",
            email: "juliana.almeida@email.com",
            phone: "(11) 95555-7890",
            areaOfInterest: "Contratos",
            experience: "Recém-formada em Direito com estágios focados em elaboração e revisão de contratos. Conhecimento em direito empresarial e civil. Participação em projeto de extensão universitária.",
            coverLetter: "Como recém-formada, busco uma oportunidade de iniciar minha carreira em uma empresa de renome. Tenho dedicação aos estudos e grande interesse em direito contratual.",
            resumeFileName: "juliana-almeida-curriculo.pdf",
            resumeUrl: "/resumes/juliana-almeida-curriculo.pdf",
            submittedAt: "2024-08-04T11:30:00Z",
            privacyConsent: true
        }
    ];

    const loadCandidates = async (): Promise<void> => {
        isLoading.value = true;
        hasError.value = false;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // In a real application, this would be:
            // const response = await $fetch('/api/admin/candidates');
            // candidates.value = response.data;

            candidates.value = mockCandidates;
        } catch (error) {
            console.error("Error loading candidates:", error);
            hasError.value = true;
        } finally {
            isLoading.value = false;
        }
    };

    const selectCandidate = (candidate: Candidate): void => {
        selectedCandidate.value = candidate;
    };

    const downloadResume = (): void => {
        if (!selectedCandidate.value?.resumeUrl) return;

        // In a real application, this would trigger a download
        // For demo purposes, we'll just show an alert
        alert(`Download iniciado: ${selectedCandidate.value.resumeFileName}`);

        // Real implementation would be:
        // window.open(selectedCandidate.value.resumeUrl, '_blank');
    };

    const getCandidateById = (id: string): Candidate | undefined => {
        return candidates.value.find(candidate => candidate.id === id);
    };

    const getCandidatesByArea = (area: string): Candidate[] => {
        return candidates.value.filter(candidate => candidate.areaOfInterest === area);
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
