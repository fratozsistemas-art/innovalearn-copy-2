import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

/**
 * Hook para buscar todos os módulos
 * Cache ULTRA agressivo porque módulos mudam raramente
 */
export function useModules() {
  return useQuery({
    queryKey: ['modules'],
    queryFn: async () => {
      try {
        console.log('🔄 Fetching all modules');
        const modules = await base44.entities.Module.list();
        console.log('✅ Modules loaded:', modules.length);
        return modules;
      } catch (error) {
        if (error?.message?.includes('Rate limit')) {
          console.warn('⚠️ Rate limit on modules. Retornando cache ou array vazio.');
          // Retornar array vazio ao invés de lançar erro
          return [];
        }
        console.error('❌ Error fetching modules:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 60, // 1 HORA - módulos não mudam
    gcTime: 1000 * 60 * 60 * 4, // 4 horas na memória
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
    throwOnError: false
  });
}

/**
 * Hook para buscar módulos de um curso específico
 */
export function useModulesByCourse(courseId) {
  return useQuery({
    queryKey: ['modules', 'course', courseId],
    queryFn: async () => {
      if (!courseId) return [];
      
      try {
        const modules = await base44.entities.Module.filter({ course_id: courseId }, 'order');
        return modules;
      } catch (error) {
        if (error?.message?.includes('Rate limit')) {
          console.warn('⚠️ Rate limit on modules by course');
          return [];
        }
        console.error('Error fetching modules by course:', error);
        return [];
      }
    },
    enabled: !!courseId,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 4,
    refetchOnMount: false,
    retry: false,
    throwOnError: false
  });
}