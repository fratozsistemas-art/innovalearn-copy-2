import { useMutation, useQueryClient } from '@tanstack/react-query';
import { autoGrade } from '@/components/feedback/AutoGrader';

/**
 * Hook para correção automática
 */
export function useAutoGrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (submission) => {
      return await autoGrade(submission);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automated-feedback'] });
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    }
  });
}