import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

/**
 * Hook para listar todas as lições com CACHE ULTRA AGRESSIVO
 * Lições mudam raramente, então cache de 24h é seguro
 */
export function useLessons() {
  return useQuery({
    queryKey: ['lessons', 'all'],
    queryFn: async () => {
      try {
        console.log('🔄 Fetching all lessons (cached for 24h)');
        const lessons = await base44.entities.Lesson.list();
        console.log('✅ Lessons loaded:', lessons.length);
        return lessons;
      } catch (error) {
        // CRITICAL: Handle rate limit gracefully
        if (error?.message?.includes('Rate limit') || error?.message?.includes('429')) {
          console.warn('⚠️ Rate limit on lessons. Returning cached data or empty array.');
          return []; // Return empty instead of throwing
        }
        console.error('❌ Error fetching lessons:', error?.message || error);
        return []; // Return empty instead of throwing
      }
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 HORAS - Lições não mudam com frequência
    gcTime: 1000 * 60 * 60 * 48, // 48 horas na memória
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false, // NUNCA retry - use cache
    throwOnError: false, // NUNCA throw - sempre retornar array vazio
  });
}

/**
 * Hook para obter lições de um módulo específico
 * Usa cache local para evitar queries repetidas
 */
export function useLessonsByModule(moduleId) {
  return useQuery({
    queryKey: ['lessons', 'module', moduleId],
    queryFn: async () => {
      if (!moduleId) return [];
      
      try {
        console.log('🔄 Fetching lessons for module:', moduleId);
        const lessons = await base44.entities.Lesson.filter({ module_id: moduleId }, 'order');
        console.log('✅ Module lessons loaded:', lessons.length);
        return lessons;
      } catch (error) {
        if (error?.message?.includes('Rate limit') || error?.message?.includes('429')) {
          console.warn('⚠️ Rate limit on module lessons. Using cache.');
          return [];
        }
        console.error('❌ Error fetching module lessons:', error?.message || error);
        return [];
      }
    },
    enabled: !!moduleId,
    staleTime: 1000 * 60 * 60 * 12, // 12 horas
    gcTime: 1000 * 60 * 60 * 24, // 24 horas
    refetchOnMount: false,
    retry: false,
    throwOnError: false,
  });
}

/**
 * Hook para obter uma lição específica
 * Cache agressivo pois lições individuais raramente mudam
 */
export function useLesson(lessonId) {
  return useQuery({
    queryKey: ['lessons', 'single', lessonId],
    queryFn: async () => {
      if (!lessonId) return null;
      
      try {
        console.log('🔄 Fetching lesson:', lessonId);
        const lessons = await base44.entities.Lesson.filter({ id: lessonId });
        const lesson = lessons[0] || null;
        console.log('✅ Lesson loaded:', lesson?.title || 'Not found');
        return lesson;
      } catch (error) {
        if (error?.message?.includes('Rate limit') || error?.message?.includes('429')) {
          console.warn('⚠️ Rate limit on single lesson. Using cache.');
          return null;
        }
        console.error('❌ Error fetching lesson:', error?.message || error);
        return null;
      }
    },
    enabled: !!lessonId,
    staleTime: 1000 * 60 * 60 * 24, // 24 horas
    gcTime: 1000 * 60 * 60 * 48, // 48 horas
    refetchOnMount: false,
    retry: false,
    throwOnError: false,
  });
}