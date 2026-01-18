'use client';

import { QueryProvider } from '@/providers/query-client-provider';
import { SessionProvider } from 'next-auth/react';
import { SocketProvider } from '@/providers/socket-provider';
import { Toaster } from 'sonner';
import { useEffect, useState } from 'react';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
      </div>
    );
  }

  return (
    <SessionProvider>
      <QueryProvider>
        <SocketProvider>
          {children}
          <Toaster position='top-right' richColors />
        </SocketProvider>
      </QueryProvider>
    </SessionProvider>
  );
}
