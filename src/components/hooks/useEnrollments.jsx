import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

// Hook para obter matrículas de um estudante
export function useStudentEnrollments(studentEmail) {
  return useQuery({
    queryKey: ['enrollments', studentEmail],
    queryFn: async () => {
      if (!studentEmail) return [];
      try {
        return await base44.entities.Enrollment.filter({ student_email: studentEmail });
      } catch (error) {
        console.error('Error fetching enrollments:', error);
        return [];
      }
    },
    enabled: !!studentEmail,
    staleTime: 1000 * 60 * 10, // 10 minutos - matrículas mudam raramente
    gcTime: 1000 * 60 * 30, // 30 minutos
    retry: false
  });
}

// Hook para listar todas as matrículas (admin)
export function useAllEnrollments() {
  return useQuery({
    queryKey: ['enrollments', 'all'],
    queryFn: async () => {
      try {
        return await base44.entities.Enrollment.list();
      } catch (error) {
        console.error('Error fetching all enrollments:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 15,
    retry: false
  });
}

// Hook para criar matrícula
export function useCreateEnrollment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (enrollmentData) => {
      try {
        return await base44.entities.Enrollment.create(enrollmentData);
      } catch (error) {
        console.error('Error creating enrollment:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      // Invalidar as matrículas do estudante
      queryClient.invalidateQueries({ 
        queryKey: ['enrollments', data.student_email] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['enrollments', 'all'] 
      });
    },
    retry: false
  });
}

// Hook para atualizar matrícula
export function useUpdateEnrollment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ enrollmentId, data }) => {
      try {
        return await base44.entities.Enrollment.update(enrollmentId, data);
      } catch (error) {
        console.error('Error updating enrollment:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      // Invalidar as matrículas do estudante
      queryClient.invalidateQueries({ 
        queryKey: ['enrollments', data.student_email] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['enrollments', 'all'] 
      });
    },
    retry: false
  });
}