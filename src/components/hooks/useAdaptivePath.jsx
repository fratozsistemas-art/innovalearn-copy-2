import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { generateAdaptivePath, recalculatePathAfterLesson } from '@/components/learning/AdaptivePathGenerator';

/**
 * Hook para obter caminho adaptativo do aluno
 */
export function useAdaptivePath(studentEmail, moduleId) {
  return useQuery({
    queryKey: ['adaptive-path', studentEmail, moduleId],
    queryFn: async () => {
      if (!studentEmail || !moduleId) return null;
      
      // Tentar buscar caminho existente
      const existing = await base44.entities.AdaptivePath.filter({
        student_email: studentEmail,
        module_id: moduleId
      });

      if (existing.length > 0) {
        return existing[0];
      }

      // Gerar novo caminho se não existir
      return await generateAdaptivePath(studentEmail, moduleId);
    },
    enabled: !!studentEmail && !!moduleId,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 1
  });
}

/**
 * Hook para recalcular caminho após completar lição
 */
export function useRecalculatePath() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ studentEmail, moduleId, lessonId, outcome }) => {
      return await recalculatePathAfterLesson(studentEmail, moduleId, lessonId, outcome);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['adaptive-path', variables.studentEmail, variables.moduleId] 
      });
    }
  });
}