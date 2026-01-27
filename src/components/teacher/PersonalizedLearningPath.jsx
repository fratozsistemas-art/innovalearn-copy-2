import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Target,
  BookOpen,
  Award,
  ArrowRight,
  Star,
  CheckCircle2,
  Sparkles,
  Brain
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const CERTIFICATION_TYPES = {
  lesson_specialist: { order: 1, next: ['level_master'] },
  level_master: { order: 2, next: ['pedagogical_expert', 'technology_expert'] },
  pedagogical_expert: { order: 3, next: ['assessment_specialist', 'innovation_leader'] },
  technology_expert: { order: 3, next: ['assessment_specialist', 'innovation_leader'] },
  assessment_specialist: { order: 4, next: ['innovation_leader'] },
  innovation_leader: { order: 5, next: [] }
};

const COURSE_RECOMMENDATIONS = {
  curiosity: ['metodologia', 'gestao_sala'],
  discovery: ['tecnologia', 'pedagogia'],
  pioneer: ['avaliacao', 'tecnologia'],
  challenger: ['soft_skills', 'avaliacao']
};

export default function PersonalizedLearningPath({
  user,
  certifications = [],
  lessonCertifications = [],
  trainingProgress = [],
  trainingCourses = []
}) {
  const navigate = useNavigate();

  // Analyze teacher's current state
  const analysis = useMemo(() => {
    const activeCerts = certifications.filter(c => c.status === 'active');
    const completedTrainings = trainingProgress.filter(p => p.progress === 100);
    
    // Calculate average assessment performance
    const assessmentScores = trainingProgress
      .filter(p => p.quiz_score !== undefined && p.quiz_score !== null)
      .map(p => p.quiz_score);
    const avgScore = assessmentScores.length > 0
      ? assessmentScores.reduce((sum, score) => sum + score, 0) / assessmentScores.length
      : 0;

    // Identify levels the teacher is certified in
    const certifiedLevels = new Set(
      lessonCertifications.map(lc => lc.course_level)
    );

    // Identify certification types achieved
    const certificationTypes = new Set(
      activeCerts.map(c => c.certification_type)
    );

    // Get user interests (teaching areas)
    const userInterests = user?.teaching_interests || [];
    
    // Count lessons certified per level
    const lessonsPerLevel = lessonCertifications.reduce((acc, lc) => {
      acc[lc.course_level] = (acc[lc.course_level] || 0) + 1;
      return acc;
    }, {});

    return {
      activeCerts,
      completedTrainings,
      avgScore,
      certifiedLevels: Array.from(certifiedLevels),
      certificationTypes: Array.from(certificationTypes),
      userInterests,
      lessonsPerLevel,
      totalLessonsCertified: lessonCertifications.length
    };
  }, [certifications, lessonCertifications, trainingProgress, user]);

  // Generate personalized recommendations
  const recommendations = useMemo(() => {
    const recs = [];

    // 1. Next certification recommendations
    if (analysis.certificationTypes.length === 0) {
      recs.push({
        type: 'certification',
        priority: 'high',
        title: 'Comece sua Jornada de Certificação',
        description: 'Obtenha sua primeira certificação como Especialista em Lições',
        icon: Award,
        color: 'var(--primary-teal)',
        action: 'Ver Certificações',
        actionUrl: createPageUrl('TeacherCertifications'),
        reason: 'Você ainda não possui certificações profissionais'
      });
    } else {
      // Suggest next certification in progression
      const highestOrder = Math.max(
        ...analysis.certificationTypes
          .map(type => CERTIFICATION_TYPES[type]?.order || 0)
      );
      
      const nextCerts = new Set();
      analysis.certificationTypes.forEach(type => {
        const next = CERTIFICATION_TYPES[type]?.next || [];
        next.forEach(n => {
          if (!analysis.certificationTypes.includes(n)) {
            nextCerts.add(n);
          }
        });
      });

      if (nextCerts.size > 0) {
        recs.push({
          type: 'certification',
          priority: 'medium',
          title: 'Evolua sua Certificação',
          description: `Próximas certificações disponíveis: ${Array.from(nextCerts).join(', ')}`,
          icon: TrendingUp,
          color: 'var(--success)',
          action: 'Explorar',
          actionUrl: createPageUrl('TeacherCertifications') + '?tab=available',
          reason: `Baseado em suas ${analysis.activeCerts.length} certificações atuais`
        });
      }
    }

    // 2. Level mastery recommendations
    const unmastered = ['curiosity', 'discovery', 'pioneer', 'challenger']
      .filter(level => !analysis.certifiedLevels.includes(level));
    
    if (unmastered.length > 0 && analysis.totalLessonsCertified > 0) {
      const targetLevel = unmastered[0];
      recs.push({
        type: 'level',
        priority: 'high',
        title: `Domine o Nível ${targetLevel.charAt(0).toUpperCase() + targetLevel.slice(1)}`,
        description: 'Complete certificações de lições para se tornar Mestre deste nível',
        icon: Target,
        color: 'var(--accent-orange)',
        action: 'Ver Lições',
        actionUrl: createPageUrl('TeacherCertificationDashboard'),
        reason: 'Expanda seu alcance para novos níveis de ensino'
      });
    }

    // 3. Training course recommendations based on interests and gaps
    const inProgressTrainings = trainingProgress.filter(p => p.progress > 0 && p.progress < 100);
    
    if (inProgressTrainings.length > 0) {
      const course = trainingCourses.find(c => c.id === inProgressTrainings[0].course_id);
      if (course) {
        recs.push({
          type: 'training',
          priority: 'high',
          title: 'Continue seu Treinamento',
          description: `${course.title} - ${inProgressTrainings[0].progress}% concluído`,
          icon: BookOpen,
          color: 'var(--accent-yellow)',
          action: 'Continuar',
          actionUrl: createPageUrl('TeacherTraining'),
          reason: 'Você está quase lá! Finalize o que começou'
        });
      }
    }

    // Recommend courses based on certification level and interests
    if (analysis.certifiedLevels.length > 0) {
      const recommendedCategories = new Set();
      analysis.certifiedLevels.forEach(level => {
        const cats = COURSE_RECOMMENDATIONS[level] || [];
        cats.forEach(cat => recommendedCategories.add(cat));
      });

      const availableCourses = trainingCourses.filter(course => 
        recommendedCategories.has(course.category) &&
        !analysis.completedTrainings.some(ct => ct.course_id === course.id)
      );

      if (availableCourses.length > 0) {
        const topCourse = availableCourses[0];
        recs.push({
          type: 'training',
          priority: 'medium',
          title: `Recomendado: ${topCourse.title}`,
          description: topCourse.description,
          icon: Sparkles,
          color: 'var(--info)',
          action: 'Iniciar Curso',
          actionUrl: createPageUrl('TeacherTraining'),
          reason: `Baseado em seu trabalho com ${analysis.certifiedLevels.join(', ')}`
        });
      }
    }

    // 4. Performance-based recommendations
    if (analysis.avgScore > 0 && analysis.avgScore < 70) {
      recs.push({
        type: 'improvement',
        priority: 'high',
        title: 'Reforce seus Conhecimentos',
        description: 'Revisite tópicos fundamentais para melhorar seu desempenho',
        icon: Brain,
        color: 'var(--warning)',
        action: 'Ver Recursos',
        actionUrl: createPageUrl('TeacherTraining'),
        reason: `Seu desempenho médio está em ${Math.round(analysis.avgScore)}%`
      });
    } else if (analysis.avgScore >= 90) {
      recs.push({
        type: 'excellence',
        priority: 'low',
        title: 'Você é Destaque!',
        description: 'Considere se tornar um mentor ou contribuir com conteúdo',
        icon: Star,
        color: 'var(--success)',
        action: 'Saiba Mais',
        actionUrl: createPageUrl('TeacherDashboard'),
        reason: `Desempenho excepcional de ${Math.round(analysis.avgScore)}%`
      });
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return recs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }, [analysis, trainingCourses]);

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    const weights = {
      certifications: 0.4,
      lessons: 0.3,
      trainings: 0.3
    };

    const certScore = Math.min(100, (analysis.activeCerts.length / 6) * 100);
    const lessonScore = Math.min(100, (analysis.totalLessonsCertified / 20) * 100);
    const trainingScore = Math.min(100, (analysis.completedTrainings.length / 10) * 100);

    return Math.round(
      certScore * weights.certifications +
      lessonScore * weights.lessons +
      trainingScore * weights.trainings
    );
  }, [analysis]);

  return (
    <div className="space-y-6">
      
      {/* Progress Overview */}
      <Card className="border-l-4" style={{ borderColor: 'var(--primary-teal)' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
            Sua Jornada de Desenvolvimento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Progresso Geral</span>
              <span className="text-sm font-bold" style={{ color: 'var(--primary-teal)' }}>
                {overallProgress}%
              </span>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: 'var(--primary-teal)' }}>
                {analysis.activeCerts.length}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Certificações
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: 'var(--success)' }}>
                {analysis.totalLessonsCertified}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Lições Certificadas
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: 'var(--accent-yellow)' }}>
                {analysis.completedTrainings.length}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Treinamentos
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personalized Recommendations */}
      <Card>
        <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" style={{ color: 'var(--accent-yellow)' }} />
            Recomendações Personalizadas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {recommendations.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--success)' }} />
              <h3 className="text-lg font-semibold mb-2">Parabéns!</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Você está em dia com seu desenvolvimento profissional.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec, index) => {
                const Icon = rec.icon;
                const priorityColors = {
                  high: 'var(--error)',
                  medium: 'var(--accent-yellow)',
                  low: 'var(--neutral-medium)'
                };

                return (
                  <div 
                    key={index}
                    className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                    style={{ backgroundColor: 'white' }}
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: rec.color, opacity: 0.9 }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">{rec.title}</h4>
                          <Badge 
                            style={{ 
                              backgroundColor: priorityColors[rec.priority],
                              color: 'white',
                              fontSize: '10px'
                            }}
                          >
                            {rec.priority === 'high' ? 'PRIORITÁRIO' : rec.priority === 'medium' ? 'IMPORTANTE' : 'SUGESTÃO'}
                          </Badge>
                        </div>
                        
                        <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                          {rec.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs italic" style={{ color: 'var(--text-secondary)' }}>
                            💡 {rec.reason}
                          </span>
                          <Button
                            size="sm"
                            onClick={() => navigate(rec.actionUrl)}
                            style={{ backgroundColor: rec.color, color: 'white' }}
                          >
                            {rec.action}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Learning Style Insights */}
      {analysis.avgScore > 0 && (
        <Card>
          <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" style={{ color: 'var(--info)' }} />
              Insights de Aprendizado
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Desempenho Médio em Avaliações</span>
                <span className="font-bold" style={{ 
                  color: analysis.avgScore >= 80 ? 'var(--success)' : analysis.avgScore >= 60 ? 'var(--accent-yellow)' : 'var(--warning)'
                }}>
                  {Math.round(analysis.avgScore)}%
                </span>
              </div>
              
              {analysis.certifiedLevels.length > 0 && (
                <div>
                  <span className="text-sm block mb-2">Níveis em que Atua:</span>
                  <div className="flex flex-wrap gap-2">
                    {analysis.certifiedLevels.map(level => (
                      <Badge 
                        key={level}
                        style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}