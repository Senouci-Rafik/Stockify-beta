export type UserRole = 'client_particulier' | 'client_interne' | 'employee' | 'director' | 'comptable' | 'rh' | 'terminal_user' | 'industrial_client' | 'retail_client' | 'reseller_client';

export interface User {
  id: string;
  email: string;
  user_type: UserRole;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
} 