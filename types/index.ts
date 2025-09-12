/**
 * Tipos TypeScript para a aplicação Mediari Consultoria
 */

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  socialMedia: {
    instagram: string;
    linkedin: string;
  };
}

export interface CompanyInfo {
  name: string;
  fullName: string;
  description: string;
  foundedYear: number;
  teamSize: string;
  website: string;
}

export interface ServiceItem {
  title: string;
  description: string;
}

export interface TeamMember {
  name: string;
  position: string;
  image?: string;
  bio?: string;
}

export interface FooterHighlight {
  title: string;
  desc: string;
}

export interface CareerFormData {
  fullName: string;
  email: string;
  phone: string;
  areaOfInterest: string;
  experience: string;
  resume?: File;
  coverLetter: string;
  privacyConsent: boolean;
}

export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
}

export type LocaleCode = 'pt-br' | 'en-us';

export type ServiceType =
  | 'civil'
  | 'criminal'
  | 'contracts'
  | 'consulting'
  | 'consumer'
  | 'banking'
  | 'labor';
