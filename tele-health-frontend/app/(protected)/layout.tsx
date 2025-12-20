import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ReactNode } from 'react';
import ClientLayout from './client-layout';

type ProtectedLayoutProps = {
  children: ReactNode;
};

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const role = session.user.role as 'ADMIN' | 'PATIENT' | 'PHYSICIAN';

  return (
    <ClientLayout role={role} user={session.user}>
      {children}
    </ClientLayout>
  );
}
