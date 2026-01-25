import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

// Hook para obter tarefas de um estudante
export function useStudentAssignments(studentEmail, status = null) {
  return useQuery({
    queryKey: ['assignments', studentEmail, status],
    queryFn: async () => {
      if (!studentEmail) return [];
      
      try {
        const filters = { student_email: studentEmail };
        if (status) filters.status = status;
        return await base44.entities.Assignment.filter(filters, '-due_date');
      } catch (error) {
        if (error?.message?.includes('Rate limit')) {
          console.warn('⚠️ Rate limit on assignments');
          return [];
        }
        console.error('Error fetching assignments:', error);
        return [];
      }
    },
    enabled: !!studentEmail,
    staleTime: 1000 * 60 * 10, // 10 minutos
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    retry: false,
    throwOnError: false
  });
}

// Hook para atualizar tarefa
export function useUpdateAssignment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ assignmentId, data }) => {
      try {
        return await base44.entities.Assignment.update(assignmentId, data);
      } catch (error) {
        console.error('Error updating assignment:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      // Invalidar as tarefas do estudante
      queryClient.invalidateQueries({ 
        queryKey: ['assignments', data.student_email] 
      });
    },
    retry: false
  });
}

// Hook para criar tarefa
export function useCreateAssignment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (assignmentData) => {
      try {
        return await base44.entities.Assignment.create(assignmentData);
      } catch (error) {
        console.error('Error creating assignment:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: ['assignments', data.student_email] 
      });
    },
    retry: false
  });
}