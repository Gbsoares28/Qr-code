export interface SavedQRCode {
  id: string;
  name: string;
  url: string;
  createdAt: number;
  color: string;
  bgColor: string;
  clientId?: string; // ID da empresa vinculada
}

export type LeadStatus = 'visit' | 'contact' | 'return' | 'followup' | 'nurture' | 'closing' | 'won' | 'lost';

export interface Lead {
  id: string;
  businessName: string;
  contactName: string;
  phone: string;
  status: LeadStatus;
  notes: string;
  value?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Client {
  id: string;
  // Dados da Empresa
  companyName: string;
  segment: string;
  contactName: string;
  whatsapp: string;
  
  // Links
  socialMedia?: string;
  gmbProfile?: string;
  
  // Serviço e Financeiro
  serviceHired: string;
  serviceValue: string;
  paymentDate: string; // YYYY-MM-DD
  recurrenceDate: string; // Dia do mês ou data específica
  
  createdAt: number;
  updatedAt: number;
}

export interface Idea {
  id: string;
  title: string;
  url: string;
  tags: string[]; // IDs das tags
  platform: 'instagram' | 'youtube' | 'other';
  notes: string;
  createdAt: number;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface GMBResult {
  businessName: string;
  address: string;
  reviewUrl: string;
}

export interface ProfileAnalysisResult {
  businessName: string;
  profileStrength: number;
  metrics: {
    reviewCount: string | number;
    rating: string | number;
    photoEstimate: string | number;
    activityLevel: string;
  };
  salesArguments: string[];
  missingElements: string[];
  potentialGrowth: string;
}