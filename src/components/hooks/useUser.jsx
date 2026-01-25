
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

// Detectar se está em ambiente de desenvolvimento
const isDevelopment = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

/**
 * Hook para obter o usuário atual com retry robusto
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      try {
        const user = await base44.auth.me();
        if (isDevelopment) {
          console.log('✅ User loaded successfully:', user?.email);
        }
        return user;
      } catch (error) {
        console.error('❌ Error fetching current user:', error.message || error);
        
        // Se não estiver autenticado, retornar null ao invés de erro
        if (error.message?.includes('not authenticated') || 
            error.message?.includes('Not authenticated') ||
            error.message?.includes('401')) {
          console.warn('⚠️ User not authenticated');
          return null;
        }
        
        // Se for rate limit, retornar null e esperar cache
        if (error.message?.includes('429') || error.message?.includes('Rate limit')) {
          console.warn('⚠️ Rate limit on user fetch, returning cached data');
          return null;
        }
        
        // Se for erro de rede, tentar novamente
        if (error.message?.includes('Network Error')) {
          console.warn('⚠️ Network error, will retry...');
          throw error;
        }
        
        // Para outros erros, ainda lançar
        throw error;
      }
    },
    staleTime: 1000 * 60 * 15, // 15 minutos - usuário muda raramente
    gcTime: 1000 * 60 * 60, // 1 hora
    retry: (failureCount, error) => {
      // Não retentar em erro de autenticação, 401 ou rate limit
      if (error?.message?.includes('not authenticated') || 
          error?.message?.includes('401') ||
          error?.message?.includes('429') ||
          error?.message?.includes('Rate limit')) {
        return false;
      }
      // Retentar até 2 vezes em erro de rede
      if (error?.message?.includes('Network Error')) {
        return failureCount < 2;
      }
      // Retentar até 1 vez para outros erros
      return failureCount < 1;
    },
    retryDelay: (attemptIndex) => {
      // Delay exponencial: 2s, 5s, 12.5s (max 10s)
      return Math.min(2000 * Math.pow(2.5, attemptIndex), 10000);
    },
    refetchOnWindowFocus: false,
    // Não lançar erro se falhar - apenas retornar null (aqui throwOnError está em conflito com o retorno de null da queryFn,
    // mas o `queryFn` já lida com o caso de não autenticado retornando null explicitamente antes de lançar erro para outros casos,
    // então `throwOnError: false` ainda é válido para evitar que o React Query propague um erro para o ErrorBoundary para os outros casos de erro.)
    throwOnError: false
  });
}

// Hook para listar todos os usuários (admin)
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const users = await base44.entities.User.list();
        console.log('✅ Users loaded:', users.length);
        return users;
      } catch (error) {
        console.error('❌ Error fetching users:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 2, // 2 minutos
    retry: 1,
    throwOnError: false
  });
}

// Hook para atualizar dados do usuário atual
export function useUpdateMyUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      try {
        const updated = await base44.auth.updateMe(data);
        console.log('✅ User updated successfully');
        return updated;
      } catch (error) {
        console.error('❌ Error updating user:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      // Atualizar o cache do usuário atual
      queryClient.setQueryData(['user', 'me'], data);
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
    },
    onError: (error) => {
      console.error('❌ Mutation error:', error);
    }
  });
}

// Hook para atualizar qualquer usuário (admin)
export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, data }) => {
      try {
        return await base44.entities.User.update(userId, data);
      } catch (error) {
        console.error('❌ Error updating user:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidar lista de usuários
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('❌ Mutation error:', error);
    }
  });
}

// Hook para logout
export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      try {
        await base44.auth.logout();
        console.log('✅ Logout successful');
      } catch (error) {
        console.error('❌ Error during logout:', error);
        // Mesmo com erro, fazer logout local
      }
    },
    onSuccess: () => {
      // Limpar todo o cache ao fazer logout
      queryClient.clear();
      // Recarregar a página para limpar estado
      window.location.href = '/';
    },
    onError: () => {
      // Em caso de erro, ainda recarregar
      window.location.href = '/';
    }
  });
}
