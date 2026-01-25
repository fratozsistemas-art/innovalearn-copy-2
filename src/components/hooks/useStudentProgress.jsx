import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StudentProgress } from '@/entities/all';

// Hook para obter progresso de um estudante em uma lição
export function useStudentLessonProgress(studentEmail, lessonId) {
  return useQuery({
    queryKey: ['progress', studentEmail, lessonId],
    queryFn: async () => {
      const progress = await StudentProgress.filter({
        student_email: studentEmail,
        lesson_id: lessonId
      });
      return progress[0] || null;
    },
    enabled: !!studentEmail && !!lessonId,
    staleTime: 1000 * 60 * 2
  });
}

// Hook para obter todo o progresso de um estudante
export function useStudentProgress(studentEmail) {
  return useQuery({
    queryKey: ['progress', studentEmail],
    queryFn: () => StudentProgress.filter({ student_email: studentEmail }),
    enabled: !!studentEmail,
    staleTime: 1000 * 60 * 5
  });
}

// Hook para criar ou atualizar progresso
export function useUpdateProgress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ progressId, data }) => {
      if (progressId) {
        return await StudentProgress.update(progressId, data);
      } else {
        return await StudentProgress.create(data);
      }
    },
    onSuccess: (data) => {
      // Invalidar o progresso do estudante
      queryClient.invalidateQueries({ 
        queryKey: ['progress', data.student_email] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['progress', data.student_email, data.lesson_id] 
      });
    }
  });
}