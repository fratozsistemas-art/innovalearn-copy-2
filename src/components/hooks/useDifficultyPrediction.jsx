import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { predictDifficulty, recordActualOutcome } from '@/components/learning/DifficultyPredictor';

/**
 * Hook para obter predição de dificuldade
 */
export function useDifficultyPrediction(studentEmail, lessonId) {
  return useQuery({
    queryKey: ['difficulty-prediction', studentEmail, lessonId],
    queryFn: async () => {
      if (!studentEmail || !lessonId) return null;
      return await predictDifficulty(studentEmail, lessonId);
    },
    enabled: !!studentEmail && !!lessonId,
    staleTime: 1000 * 60 * 30, // 30 minutos
    retry: 1
  });
}

/**
 * Hook para registrar resultado real
 */
export function useRecordOutcome() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ predictionId, outcome }) => {
      return await recordActualOutcome(predictionId, outcome);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['difficulty-prediction'] });
    }
  });
}