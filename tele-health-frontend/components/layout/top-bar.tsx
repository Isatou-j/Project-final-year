'use client';

import { User as UserType, Role } from '@/types/layout';
import {
  Menu,
  Heart,
  Search,
  Shield,
  ChevronDown,
  Bell,
  User,
  Settings,
  LogOut,
  Calendar,
  FileText,
  CreditCard,
  CheckCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useNotifications, useMarkNotificationAsRead } from '@/hooks';
import { formatDistanceToNow } from 'date-fns';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from 'next-auth/react';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

const TopBar: React.FC<{
  user: any;
  onMenuClick: () => void;
}> = ({ user, onMenuClick }) => {
  const router = useRouter();
  const { data: notificationsData, isLoading: notificationsLoading } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();
  
  const notifications = notificationsData?.notifications || [];
  const unreadCount = notificationsData?.unreadCount || 0;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'APPOINTMENT':
        return <Calendar className='w-4 h-4' />;
      case 'PRESCRIPTION':
        return <FileText className='w-4 h-4' />;
      case 'PAYMENT':
        return <CreditCard className='w-4 h-4' />;
      case 'MEDICAL_RECORD':
        return <FileText className='w-4 h-4' />;
      default:
        return <Bell className='w-4 h-4' />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'APPOINTMENT':
        return 'bg-blue-500';
      case 'PRESCRIPTION':
        return 'bg-green-500';
      case 'PAYMENT':
        return 'bg-purple-500';
      case 'MEDICAL_RECORD':
        return 'bg-teal-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleNotificationClick = (notification: any) => {
    if (notification.link) {
      router.push(notification.link);
    }
    if (!notification.isRead) {
      markAsRead.mutate(notification.id);
    }
  };
  return (
    <header className='bg-white border-b border-gray-200 sticky top-0 z-40'>
      <div className='flex items-center justify-between px-4 py-3'>
        {/* Left section */}
        <div className='flex items-center gap-4'>
          <Button
            onClick={onMenuClick}
            className='lg:hidden p-2 hover:bg-gray-100 rounded-lg'
          >
            <Menu className='w-5 h-5' />
          </Button>

          {/* Search bar */}
          <div className='hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64 lg:w-96'>
            <Search className='w-4 h-4 text-gray-400 mr-2' />
            <input
              type='text'
              placeholder='Search...'
              className='bg-transparent outline-none text-sm w-full'
            />
          </div>
        </div>

        {/* Right section */}
        <div className='flex items-center gap-2 sm:gap-4'>
          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='relative p-2 hover:bg-gray-100 bg-gray-50 rounded-lg cursor-pointer focus:outline-none'>
                <Bell className='w-6 h-6 text-gray-600' />
                {unreadCount > 0 && (
                  <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full' />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-80 max-h-96 overflow-y-auto'>
              <DropdownMenuLabel className='flex items-center justify-between'>
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className='text-xs bg-red-500 text-white px-2 py-0.5 rounded-full'>
                    {unreadCount}
                  </span>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notificationsLoading ? (
                <div className='flex items-center justify-center py-8'>
                  <Loader2 className='w-6 h-6 animate-spin text-gray-400' />
                </div>
              ) : notifications.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-8 text-center'>
                  <Bell className='w-12 h-12 text-gray-300 mb-2' />
                  <p className='text-sm text-gray-500'>No notifications</p>
                </div>
              ) : (
                <>
                  {notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`flex flex-col items-start py-3 cursor-pointer ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className='flex items-start gap-3 w-full'>
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${getNotificationColor(
                            notification.type,
                          )}`}
                        />
                        <div className='flex-1'>
                          <div className='flex items-start gap-2'>
                            {getNotificationIcon(notification.type)}
                            <p className='text-sm font-medium'>{notification.title}</p>
                          </div>
                          <p className='text-xs text-gray-500 mt-1'>
                            {notification.message}
                          </p>
                          <p className='text-xs text-gray-400 mt-1'>
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className='w-2 h-2 bg-blue-500 rounded-full mt-2' />
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className='text-center text-sm text-blue-600 cursor-pointer'
                    onClick={() => router.push('/patient/appointments')}
                  >
                    View all notifications
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='flex items-center gap-2 sm:gap-3 hover:bg-gray-100 rounded-lg p-2 focus:outline-none'>
                <div className='w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm'>
                  {user.name.charAt(0)}
                </div>
                <div className='hidden sm:block text-left'>
                  <p className='text-sm font-medium text-gray-900'>
                    {user.name}
                  </p>
                  <p className='text-xs text-gray-500'>{user.role}</p>
                </div>
                <ChevronDown className='w-4 h-4 text-gray-400 hidden sm:block' />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              <DropdownMenuLabel>
                <div className='flex flex-col space-y-1'>
                  <p className='text-sm font-medium'>{user.name}</p>
                  <p className='text-xs text-gray-500'>{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className='cursor-pointer'
                onClick={() => {
                  const role = user.role?.toLowerCase() || 'patient';
                  router.push(`/${role}/profile`);
                }}
              >
                <User className='w-4 h-4 mr-2' />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className='cursor-pointer'>
                <Settings className='w-4 h-4 mr-2' />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className='cursor-pointer text-red-600 focus:text-red-600'
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className='w-4 h-4 mr-2' />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
