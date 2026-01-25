import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

// Hook para obter notificações do usuário COM FALLBACK PARA NETWORK ERROR
export function useUserNotifications(userEmail) {
  return useQuery({
    queryKey: ['notifications', userEmail],
    queryFn: async () => {
      if (!userEmail) return [];
      try {
        return await base44.entities.Notification.filter({ user_email: userEmail }, '-created_date', 20);
      } catch (error) {
        if (error?.message?.includes('Network Error')) {
          console.warn('⚠️ Network error on notifications, returning empty array');
          return [];
        }
        console.error('Error fetching notifications:', error);
        return [];
      }
    },
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 15, // 15 minutos
    refetchInterval: false,
    retry: (failureCount, error) => {
      // Não retry em network error
      if (error?.message?.includes('Network Error')) return false;
      return failureCount < 1;
    },
    throwOnError: false
  });
}

// Hook para obter notificações não lidas COM FALLBACK PARA NETWORK ERROR
export function useUnreadNotifications(userEmail) {
  return useQuery({
    queryKey: ['notifications', userEmail, 'unread'],
    queryFn: async () => {
      if (!userEmail) return [];
      try {
        return await base44.entities.Notification.filter({ 
          user_email: userEmail, 
          read: false 
        }, '-created_date', 10);
      } catch (error) {
        if (error?.message?.includes('Network Error')) {
          console.warn('⚠️ Network error on unread notifications, returning empty array');
          return [];
        }
        if (error?.message?.includes('Rate limit')) {
          console.warn('⚠️ Rate limit on notifications');
          return [];
        }
        console.error('Error fetching unread notifications:', error);
        return [];
      }
    },
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 3, // 3 minutos
    gcTime: 1000 * 60 * 10,
    refetchInterval: false,
    retry: (failureCount, error) => {
      // Não retry em network error ou rate limit
      if (error?.message?.includes('Network Error')) return false;
      if (error?.message?.includes('Rate limit')) return false;
      return failureCount < 1;
    },
    throwOnError: false
  });
}

// Hook para marcar notificação como lida
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ notificationId, userEmail }) => {
      try {
        return await base44.entities.Notification.update(notificationId, { read: true });
      } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['notifications', variables.userEmail] 
      });
      queryClient.invalidateQueries({
        queryKey: ['notifications', variables.userEmail, 'unread']
      });
    },
    retry: false
  });
}

// Hook para criar notificação
export function useCreateNotification() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationData) => {
      try {
        return await base44.entities.Notification.create(notificationData);
      } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: ['notifications', data.user_email] 
      });
      queryClient.invalidateQueries({
        queryKey: ['notifications', data.user_email, 'unread']
      });
    },
    retry: false
  });
}