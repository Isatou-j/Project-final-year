'use client';

import { NavigationItem, Role } from '@/types/layout';
import { Heart, X, LogOut, Activity } from 'lucide-react';
import { Button } from '../ui/button';
import { navigationConfig } from '@/mocks/layout-data';
import NavLink from '../nav-link';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoIcon from '../svg/logo-icon';
import { signOut } from 'next-auth/react';

const Sidebar: React.FC<{
  role: Role;
  isOpen: boolean;
  onClose: () => void;
  activePath: string;
  onNavigate: (path: string) => void;
}> = ({ role, isOpen, onClose, activePath, onNavigate }) => {
  const navigation = navigationConfig[role];

  const currentPath = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-gray-900 border-r border-gray-800 z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-64 flex flex-col
        `}
      >
        {/* Sidebar header */}
        <div className='flex items-center justify-between p-4 border-b border-gray-200 lg:hidden'>
          <div className='flex items-center gap-2'>
            <LogoIcon fill='#0d9488' />
            <span className='font-bold text-xl text-gray-900'>TeleHealth</span>
          </div>
          <Button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 rounded-lg'
          >
            <X className='w-5 h-5' />
          </Button>
        </div>

        <div className='p-4 border-b border-gray-700'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-teal-600  rounded-lg flex items-center justify-center'>
                <Activity className='w-6 h-6 text-white' />
              </div>
              <span className='text-xl font-bold bg-teal-600  bg-clip-text text-transparent'>
                TeleHealth
              </span>
            </div>
            <button
              onClick={() => onClose()}
              className='p-2 hover:bg-gray-700 rounded-lg transition lg:hidden'
              title='Close sidebar'
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className='flex-1 overflow-y-auto p-4'>
          <div className='space-y-1'>
            {navigation.map(item => {
              const Icon = item.icon;
              const isActive = currentPath === item.href;

              return (
                <NavLink
                  key={item.href}
                  href={item.href}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-colors duration-150
                    ${
                      isActive
                        ? 'bg-teal-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                >
                  <Icon className='w-5 h-5' />
                  <span className='flex-1 text-left'>{item.label}</span>
                  {item.badge && (
                    <span className='bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full'>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Sidebar footer */}
        <div className='p-4 border-t border-gray-700'>
          <Button
            onClick={() => signOut({ callbackUrl: '/' })}
            className='w-full flex items-center gap-3 px-3 py-2.5 text-gray-200 hover:bg-teal-600 rounded-lg text-sm font-medium cursor-pointer'
          >
            <LogOut className='w-5 h-5' />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
