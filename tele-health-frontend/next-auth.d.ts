import type { User } from './types/user';
import type { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string; // add id
      role: 'ADMIN' | 'PATIENT' | 'PHYSICIAN' | string;
      profileUrl: string;
      isVerified: boolean;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    } & DefaultSession['user'];
    accessToken: string;
    refreshToken: string;
  }

  interface User extends DefaultUser {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'PATIENT' | 'PHYSICIAN' | string; // you can adjust based on your roles
    profileUrl: string;
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    accessToken: string;
    refreshToken: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'PATIENT' | 'PHYSICIAN' | string;
    profileUrl: string;
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    exp?: number;
  }
}
