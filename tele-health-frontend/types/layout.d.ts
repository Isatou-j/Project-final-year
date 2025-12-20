export type Role = 'PATIENT' | 'PHYSICIAN' | 'ADMIN';

export interface User {
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface NavigationItem {
  icon: any;
  label: string;
  href: string;
  badge?: number;
}

// Mock user data
