// Tipagens relacionadas a candidaturas e profile tests
import type { Timestamp } from 'firebase/firestore';

export interface CandidateBase {
  // Agora armazenamos o nome completo em um único campo
  fullName: string;
  email: string;
  phone?: string;
  positionApplied?: string;
  status?: 'submitted' | 'screening' | 'interview' | 'rejected' | 'hired';
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
  attachments?: CandidateAttachment[];
  metadata?: Record<string, unknown> | null; // mantido mas pouco usado; considerar remoção futura
}

export interface CandidateAttachment {
  name: string;
  storagePath: string;
  contentType?: string;
  size?: number;
  uploadedAt?: Timestamp | null;
}

export interface JobApplication extends CandidateBase {
  coverLetter?: string;
  experience?: string;
  resumeFileName?: string;
}

export interface ProfileTestResult {
  candidateId?: string;
  email?: string;
  answers: Record<number, string> | Array<string>;
  score?: number;
  passed?: boolean;
  version?: string;
  completedAt?: Timestamp | null;
  raw?: Record<string, unknown> | null;
}

export interface CandidateFull extends CandidateBase {
  id: string;
  applications?: Array<{ id: string; data: Record<string, unknown> }>;
  profileTests?: Array<{ id: string; data: Record<string, unknown> }>;
}
