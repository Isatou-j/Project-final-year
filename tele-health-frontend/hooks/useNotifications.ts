import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/utils/api-client';

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
  unreadCount: number;
}

// For now, we'll generate notifications from appointments and other events
// In a full implementation, you'd have a notifications table in the database
export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      // Generate notifications from appointments
      try {
        const appointmentsResponse = await apiClient.get('/appointment/patient');
        const appointments = appointmentsResponse.data.appointments || appointmentsResponse.data || [];
        
        // Generate notifications from recent appointments
        const notifications: Notification[] = [];
        const now = new Date();
        
        appointments.forEach((appointment: any) => {
          const appointmentDate = new Date(appointment.appointmentDate);
          const daysUntil = Math.floor((appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          // Notification for upcoming appointments (within 24 hours)
          if (daysUntil >= 0 && daysUntil <= 1 && appointment.status === 'CONFIRMED') {
            notifications.push({
              id: appointment.id * 1000 + 1, // Generate unique ID
              userId: 0, // Will be set by backend
              type: 'APPOINTMENT',
              title: 'Upcoming Appointment',
              message: `You have an appointment with ${appointment.physician?.firstName || 'your doctor'} ${appointment.physician?.lastName || ''} on ${appointmentDate.toLocaleDateString()}`,
              isRead: false,
              link: `/patient/appointments`,
              createdAt: appointment.createdAt,
              updatedAt: appointment.updatedAt,
            });
          }
          
          // Notification for appointment status changes
          if (appointment.status === 'CONFIRMED' && appointment.updatedAt) {
            const updatedDate = new Date(appointment.updatedAt);
            const hoursSinceUpdate = (now.getTime() - updatedDate.getTime()) / (1000 * 60 * 60);
            
            if (hoursSinceUpdate < 24) {
              notifications.push({
                id: appointment.id * 1000 + 2,
                userId: 0,
                type: 'APPOINTMENT',
                title: 'Appointment Confirmed',
                message: `Your appointment has been confirmed for ${appointmentDate.toLocaleDateString()}`,
                isRead: false,
                link: `/patient/appointments`,
                createdAt: appointment.updatedAt,
                updatedAt: appointment.updatedAt,
              });
            }
          }
        });
        
        // Sort by date (newest first)
        notifications.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        const unreadCount = notifications.filter(n => !n.isRead).length;
        
        return {
          notifications: notifications.slice(0, 10), // Limit to 10 most recent
          unreadCount,
        } as NotificationsResponse;
      } catch (error) {
        console.error('Error fetching notifications:', error);
        return {
          notifications: [],
          unreadCount: 0,
        } as NotificationsResponse;
      }
    },
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationId: number) => {
      // In a real implementation, this would call the backend
      // For now, we'll just update the cache
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

