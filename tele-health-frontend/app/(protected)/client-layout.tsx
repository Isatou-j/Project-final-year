'use client';

import { ReactNode, useState } from 'react';
import TopBar from '@/components/layout/top-bar';
import Sidebar from '@/components/layout/side-bar';
import { mockUsers } from '@/mocks/layout-data';
import { Role } from '@/types/layout';

type ClientLayoutProps = {
  role: 'ADMIN' | 'PATIENT' | 'PHYSICIAN';
  user?: any;
  children: ReactNode;
};

export default function ClientLayout({
  role,
  user,
  children,
}: ClientLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePath, setActivePath] = useState(
    `/${role.toLowerCase()}/dashboard`,
  );

  return (
    <div className='min-h-screen bg-gray-50 flex relative'>
      <Sidebar
        role={role}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activePath={activePath}
        onNavigate={setActivePath}
      />

      <div className='flex-1 h-[calc(100vh-64px)] transition-all duration-300 lg:ml-64 ml-0'>
        <TopBar user={user} onMenuClick={() => setIsSidebarOpen(true)} />

        <main className=' p-4 lg:p-8'>{children}</main>
      </div>
    </div>
  );
}
