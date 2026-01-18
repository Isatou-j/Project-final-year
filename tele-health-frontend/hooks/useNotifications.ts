import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';
import apiClient from '@/utils/api-client';
import { useSocket } from '@/providers/socket-provider';

export interface Notification {
  id: number;
  userId: number;
  type: 'APPOINTMENT' | 'PRESCRIPTION' | 'PAYMENT' | 'MEDICAL_RECORD' | 'SYSTEM';
  title: string;
  message: string;
  isRead: boolean;
  link?: string | null;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
}

// Real-time notifications using Socket.io and API
export const useNotifications = () => {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/notifications');
        return response.data.data as NotificationsResponse;
      } catch (error) {
        console.error('Error fetching notifications:', error);
        return {
          notifications: [],
          total: 0,
          unreadCount: 0,
        } as NotificationsResponse;
      }
    },
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes as fallback
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Listen for real-time notifications via Socket.io
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewNotification = (notification: Notification) => {
      console.log('📬 New notification received:', notification);
      
      // Update the query cache with the new notification
      queryClient.setQueryData<NotificationsResponse>(['notifications'], (old) => {
        if (!old) {
          return {
            notifications: [notification],
            total: 1,
            unreadCount: 1,
          };
        }

        // Check if notification already exists (avoid duplicates)
        const exists = old.notifications.some((n) => n.id === notification.id);
        if (exists) {
          return old;
        }

        // Add new notification at the beginning
        const updatedNotifications = [notification, ...old.notifications];
        const unreadCount = notification.isRead ? old.unreadCount : old.unreadCount + 1;

        return {
          notifications: updatedNotifications.slice(0, 50), // Keep only latest 50
          total: old.total + 1,
          unreadCount,
        };
      });

      // Show toast notification
      toast.info(notification.title, {
        description: notification.message,
        action: notification.link
          ? {
              label: 'View',
              onClick: () => {
                window.location.href = notification.link!;
              },
            }
          : undefined,
      });
    };

    socket.on('notification:new', handleNewNotification);

    return () => {
      socket.off('notification:new', handleNewNotification);
    };
  }, [socket, isConnected, queryClient]);

  return {
    ...query,
    isConnected,
  };
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  
  return useMutation({
    mutationFn: async (notificationId: number) => {
      try {
        const response = await apiClient.patch(`/notifications/${notificationId}/read`);
        
        // Emit to socket for real-time update
        if (socket) {
          socket.emit('notification:read', notificationId);
        }
        
        return response.data;
      } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      try {
        const response = await apiClient.patch('/notifications/read-all');
        return response.data;
      } catch (error) {
        console.error('Error marking all notifications as read:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationId: number) => {
      try {
        const response = await apiClient.delete(`/notifications/${notificationId}`);
        return response.data;
      } catch (error) {
        console.error('Error deleting notification:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

