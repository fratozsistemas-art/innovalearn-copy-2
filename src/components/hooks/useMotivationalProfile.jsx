import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

/**
 * Hook para buscar perfil motivacional do estudante
 */
export function useMotivationalProfile(studentEmail) {
  return useQuery({
    queryKey: ['motivationalProfile', studentEmail],
    queryFn: async () => {
      if (!studentEmail) return null;
      
      try {
        const profiles = await base44.entities.MotivationalProfile.filter({ 
          student_email: studentEmail 
        });
        
        return profiles.length > 0 ? profiles[0] : null;
      } catch (error) {
        if (error?.message?.includes('Rate limit')) {
          console.warn('⚠️ Rate limit on motivational profile, returning null');
          return null;
        }
        console.error('Error fetching motivational profile:', error);
        return null;
      }
    },
    enabled: !!studentEmail,
    staleTime: 1000 * 60 * 30, // 30 minutos - perfil muda raramente
    gcTime: 1000 * 60 * 60, // 1 hora
    retry: false,
    throwOnError: false
  });
}

/**
 * Calcula tipo Bartle predominante baseado nos scores
 */
export function calculateBartleType(achieverScore, explorerScore, socializerScore, competitorScore) {
  const scores = {
    achiever: achieverScore || 0,
    explorer: explorerScore || 0,
    socializer: socializerScore || 0,
    competitor: competitorScore || 0
  };

  const maxScore = Math.max(...Object.values(scores));
  
  // Se todos os scores são 0, retornar mixed
  if (maxScore === 0) {
    return 'mixed';
  }
  
  const topTypes = Object.entries(scores).filter(([_, score]) => score === maxScore);

  // Se há empate em múltiplos tipos
  if (topTypes.length > 2) {
    return 'mixed';
  }

  // Se há empate em 2 tipos
  if (topTypes.length === 2) {
    // Priorizar achiever > explorer > socializer > competitor
    if (topTypes.some(([type]) => type === 'achiever')) return 'achiever';
    if (topTypes.some(([type]) => type === 'explorer')) return 'explorer';
    if (topTypes.some(([type]) => type === 'socializer')) return 'socializer';
    return 'competitor';
  }

  // Tipo único dominante
  return topTypes[0][0];
}

/**
 * Hook para atualizar perfil motivacional
 */
export function useUpdateMotivationalProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ studentEmail, profileData }) => {
      try {
        // Buscar perfil existente
        const existing = await base44.entities.MotivationalProfile.filter({ 
          student_email: studentEmail 
        });

        if (existing.length > 0) {
          // Atualizar
          return await base44.entities.MotivationalProfile.update(existing[0].id, profileData);
        } else {
          // Criar
          return await base44.entities.MotivationalProfile.create({
            student_email: studentEmail,
            ...profileData
          });
        }
      } catch (error) {
        console.error('Error updating motivational profile:', error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['motivationalProfile', variables.studentEmail] 
      });
    },
    retry: false
  });
}