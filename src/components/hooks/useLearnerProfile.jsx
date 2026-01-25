import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

/**
 * Hook para acessar o Comprehensive Learner Profile (CAIO-TSI)
 */
export function useLearnerProfile(userEmail) {
  return useQuery({
    queryKey: ['learner-profile', userEmail],
    queryFn: async () => {
      if (!userEmail) return null;
      
      const user = await base44.entities.User.filter({ email: userEmail });
      if (user.length === 0) return null;
      
      return user[0].comprehensive_learner_profile || null;
    },
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 30, // 30 minutes - profile doesn't change frequently
    retry: 1
  });
}

/**
 * Hook para gerar/atualizar o perfil do aluno via CAIO-TSI Orchestration
 */
export function useGenerateLearnerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assessmentData) => {
      const response = await base44.functions.invoke('generateLearnerProfile', {
        assessmentData
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate user and learner profile queries
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['learner-profile'] });
    }
  });
}

/**
 * Hook para obter recomendações baseadas no perfil
 */
export function useProfileBasedRecommendations(userEmail) {
  const { data: profile } = useLearnerProfile(userEmail);

  return useQuery({
    queryKey: ['profile-recommendations', userEmail],
    queryFn: async () => {
      if (!profile) return null;

      // Generate recommendations based on learner profile
      const recommendations = {
        optimal_content_types: [],
        suggested_activities: [],
        communication_approach: null,
        family_engagement_tips: []
      };

      // VARK-based recommendations
      const primaryVark = profile.vark_detailed?.primary_style;
      if (primaryVark === 'visual') {
        recommendations.optimal_content_types.push('videos', 'infographics', 'diagrams');
      } else if (primaryVark === 'auditory') {
        recommendations.optimal_content_types.push('podcasts', 'discussions', 'audio_explanations');
      } else if (primaryVark === 'read_write') {
        recommendations.optimal_content_types.push('articles', 'documentation', 'written_exercises');
      } else if (primaryVark === 'kinesthetic') {
        recommendations.optimal_content_types.push('hands_on_projects', 'simulations', 'experiments');
      }

      // Challenge level recommendations
      const challengeLevel = profile.interest_motivation_map?.challenge_comfort_level;
      if (challengeLevel === 'high_challenge' || challengeLevel === 'extreme_challenge') {
        recommendations.suggested_activities.push('advanced_projects', 'research_challenges', 'pioneer_tasks');
      } else if (challengeLevel === 'moderate_challenge') {
        recommendations.suggested_activities.push('guided_projects', 'scaffolded_challenges');
      } else {
        recommendations.suggested_activities.push('step_by_step_tutorials', 'confidence_building_tasks');
      }

      // Communication approach based on cultural DNA
      const culturalContext = profile.demographic_context?.cultural_context;
      if (culturalContext === 'brazilian') {
        recommendations.communication_approach = 'warm, encouraging, celebrate achievements, family-oriented';
        recommendations.family_engagement_tips.push(
          'Involve family in celebrations of learning milestones',
          'Use collaborative problem-solving approaches',
          'Build relationship-based trust'
        );
      } else if (culturalContext === 'middle_east') {
        recommendations.communication_approach = 'respectful, structured, emphasize excellence pursuit';
        recommendations.family_engagement_tips.push(
          'Balance traditional values with modern approaches',
          'Emphasize academic excellence',
          'Show respect for family educational authority'
        );
      }

      return recommendations;
    },
    enabled: !!profile,
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: false
  });
}

/**
 * Hook helper para verificar se perfil está completo
 */
export function useIsProfileComplete(userEmail) {
  const { data: profile, isLoading } = useLearnerProfile(userEmail);

  return {
    isComplete: !!profile && !!profile.vark_detailed && !!profile.demographic_context,
    isLoading,
    profile
  };
}

/**
 * Get optimal InnAI persona based on learner profile
 */
export function getOptimalPersona(learnerProfile) {
  if (!learnerProfile) return null;

  const ageGroup = learnerProfile.demographic_context?.age_group;
  const communicationPrefs = learnerProfile.cultural_learning_dna?.communication_style_preferences || [];
  const challengeLevel = learnerProfile.interest_motivation_map?.challenge_comfort_level;

  return {
    persona_level: ageGroup,
    tone_adjustments: communicationPrefs,
    challenge_calibration: challengeLevel,
    vark_emphasis: learnerProfile.vark_detailed?.primary_style
  };
}