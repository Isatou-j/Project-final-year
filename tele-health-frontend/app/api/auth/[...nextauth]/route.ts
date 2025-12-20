import { LoginResponse } from '@/types/auth';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

if (!BASE_URL) {
  throw new Error('API URL is not defined');
}

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const loginUrl = `${BASE_URL}/auth/login`;
          console.log('Attempting login to:', loginUrl);
          
          // Call your backend API
          const response = await axios.post(loginUrl, {
            email: credentials.email,
            password: credentials.password,
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const data = response.data as LoginResponse;

          // Suppose backend returns { user: {...}, accessToken, refreshToken }
          if (data && data.data && data.data.user && data.data.accessToken) {
            const user = data.data.user;
            return {
              id: user.id.toString(),
              name: user.name || user.email.split('@')[0] || 'User',
              email: user.email,
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
              expiresIn: data.data.expiresIn,
              isActive: user.isActive,
              role: user.role,
              isVerified: user.isVerified,
              profileUrl: user.profileUrl,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
            };
          }

          console.error('Invalid response structure:', data);
          return null;
        } catch (e: any) {
          console.error('Auth error:', e.message);
          if (e.response) {
            console.error('Response status:', e.response.status);
            console.error('Response data:', e.response.data);
            console.error('Request URL:', e.config?.url);
          }
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On initial login
      if (user) {
        token.id = user.id.toString();
        token.name = user.name;
        token.email = user.email;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
        token.isActive = user.isActive;
        token.isVerified = user.isVerified;
        token.profileUrl = user.profileUrl;
        token.createdAt = user.createdAt;
        token.updatedAt = user.updatedAt;
        // Set expiry time (assuming expiresIn is in seconds, default to 15 minutes)
        token.exp =
          Math.floor(Date.now() / 1000) +
          (user.expiresIn ? parseInt(user.expiresIn) : 900);
        return token;
      }

      // Check if token is expired
      const now = Math.floor(Date.now() / 1000);
      if (token.exp && now > token.exp) {
        try {
          // Refresh the token
          const response = await axios.post(`${BASE_URL}/auth/refresh`, {
            refreshToken: token.refreshToken,
          });

          const data = response.data;
          token.accessToken = data.accessToken;
          token.refreshToken = data.refreshToken;
          token.exp =
            Math.floor(Date.now() / 1000) +
            (data.expiresIn ? parseInt(data.expiresIn) : 900);
        } catch (error) {
          console.error('Token refresh error:', error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.profileUrl;
        session.user.role = token.role;
        session.user.isVerified = token.isVerified;
        session.user.isActive = token.isActive;
        session.user.createdAt = token.createdAt;
        session.user.updatedAt = token.updatedAt;
      }
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.expires = token.exp
        ? new Date(token.exp * 1000).toISOString()
        : new Date().toISOString();
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret:
    process.env.NEXTAUTH_SECRET ??
    '5a4323827c4e070a88f36db8ce8a9ddc754270204906f2ec31c4632256b0bab5d92e35fda224ca4d6a0b67a1a908d8ac13149402ab90de8240b068862afa4534',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
