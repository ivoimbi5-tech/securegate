
export enum AppState {
  INITIAL_SETUP = 'INITIAL_SETUP',
  MASTER_LOGIN = 'MASTER_LOGIN',
  EMAIL_STORAGE = 'EMAIL_STORAGE'
}

export type EmailProvider = 'gmail' | 'outlook' | 'yahoo' | 'apple' | 'proton' | 'generic';

export interface StoredCredential {
  id: string;
  email: string;
  password: string;
  createdAt: number;
}

export interface SecurityTip {
  title: string;
  content: string;
}
