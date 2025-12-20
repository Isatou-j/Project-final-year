'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

type AuthLayoutProps = {
  children: ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const router = useRouter();
  return (
    <div className='min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md shadow-xl'>
        
        <CardContent className='space-y-4'>
          {children}

          <Button
            variant='ghost'
            onClick={() => router.push('/')}
            className='w-full'
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthLayout;
