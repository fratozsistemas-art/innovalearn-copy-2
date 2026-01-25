
import { base44 } from '@/api/base44Client';

/**
 * Personalized Learning Engine
 * 
 * Motor de IA que gera caminhos de aprendizado personalizados baseado em:
 * - Progresso do estudante
 * - Gaps identificados
 * - Perfil VARK
 * - Perfil motivacional (Bartle)
 * - Performance histórica
 */

/**
 * Gera caminho de aprendizado personalizado completo
 */
export async function generatePersonalizedPath(studentEmail) {
  try {
    console.log('🤖 Generating personalized learning path for:', studentEmail);
    
    // 1. Coletar dados do estudante COM RATE LIMIT HANDLING
    const studentData = await collectStudentData(studentEmail);
    
    if (!studentData.user) {
      throw new Error('Student not found');
    }
    
    // 2. Analisar gaps e pontos fracos
    const gaps = await analyzeKnowledgeGaps(studentData);
    
    // 3. Gerar recomendações com IA (COM FALLBACK RÁPIDO)
    const recommendations = await generateAIRecommendations(studentData, gaps);
    
    // 4. Gerar tarefas personalizadas (OPCIONAL - só se não tiver rate limit)
    let customAssignments = [];
    try {
      customAssignments = await generateCustomAssignments(studentData, recommendations);
    } catch (error) {
      console.warn('⚠️ Skipping custom assignments due to:', error.message);
      customAssignments = [];
    }
    
    // 5. Recomendar recursos VARK-aligned (LOCAL - sem API calls)
    const resources = await recommendVARKResources(studentData, recommendations);
    
    return {
      success: true,
      studentProfile: {
        name: studentData.user.full_name,
        email: studentData.user.email,
        vark_primary: studentData.user.vark_primary_style,
        motivational_type: studentData.motivationalProfile?.bartle_type,
        explorer_level: studentData.user.explorer_level
      },
      currentStatus: {
        totalLessonsCompleted: studentData.progress.filter(p => p.completed).length,
        totalLessonsAvailable: studentData.progress.length,
        averageScore: calculateAverageScore(studentData.progress),
        strengthTopics: gaps.strengths,
        weaknessTopics: gaps.weaknesses
      },
      recommendations: recommendations,
      customAssignments: customAssignments,
      recommendedResources: resources,
      nextSteps: recommendations.nextSteps,
      motivationalMessage: generateMotivationalMessage(studentData, gaps)
    };
    
  } catch (error) {
    console.error('❌ Error generating personalized path:', error);
    
    // CRITICAL: Re-throw with clear message if rate limit
    if (error?.message?.includes('Rate limit') || error?.message?.includes('429')) {
      throw new Error('Rate limit exceeded');
    }
    
    throw error;
  }
}

/**
 * Coleta todos os dados relevantes do estudante
 * COM RATE LIMIT PROTECTION
 */
async function collectStudentData(studentEmail) {
  try {
    // Use Promise.allSettled to not fail if one query fails
    const results = await Promise.allSettled([
      base44.entities.User.filter({ email: studentEmail }).then(r => r[0]),
      base44.entities.StudentProgress.filter({ student_email: studentEmail }),
      base44.entities.Enrollment.filter({ student_email: studentEmail }),
      base44.entities.Assignment.filter({ student_email: studentEmail }),
      base44.entities.ContentGap.filter({ student_email: studentEmail }),
      base44.entities.GamificationProfile.filter({ student_email: studentEmail }).then(r => r[0]),
      base44.entities.MotivationalProfile.filter({ student_email: studentEmail }).then(r => r[0])
    ]);
    
    // Extract data, using defaults for failed queries
    const [
      userResult,
      progressResult,
      enrollmentsResult,
      assignmentsResult,
      gapsResult,
      gamificationResult,
      motivationalResult
    ] = results;
    
    // Check if any critical query failed due to rate limit
    const hasRateLimitError = results.some(r => 
      r.status === 'rejected' && 
      (r.reason?.message?.includes('Rate limit') || r.reason?.message?.includes('429'))
    );
    
    if (hasRateLimitError) {
      throw new Error('Rate limit exceeded');
    }
    
    return {
      user: userResult.status === 'fulfilled' ? userResult.value : null,
      progress: progressResult.status === 'fulfilled' ? progressResult.value : [],
      enrollments: enrollmentsResult.status === 'fulfilled' ? enrollmentsResult.value : [],
      assignments: assignmentsResult.status === 'fulfilled' ? assignmentsResult.value : [],
      gaps: gapsResult.status === 'fulfilled' ? gapsResult.value : [],
      gamification: gamificationResult.status === 'fulfilled' ? gamificationResult.value : null,
      motivationalProfile: motivationalResult.status === 'fulfilled' ? motivationalResult.value : null
    };
  } catch (error) {
    console.error('❌ Error collecting student data:', error);
    throw error;
  }
}

/**
 * Analisa gaps de conhecimento e identifica pontos fortes/fracos
 */
async function analyzeKnowledgeGaps(studentData) {
  const { progress, assignments } = studentData;
  
  // Identificar tópicos com baixa performance
  const weakTopics = progress
    .filter(p => p.quiz_score !== null && p.quiz_score < 60)
    .map(p => ({ lesson_id: p.lesson_id, score: p.quiz_score }));
  
  // Identificar tópicos com alta performance
  const strongTopics = progress
    .filter(p => p.quiz_score !== null && p.quiz_score >= 85)
    .map(p => ({ lesson_id: p.lesson_id, score: p.quiz_score }));
  
  // Tarefas não completadas
  const pendingAssignments = assignments.filter(a => a.status === 'pending' || a.status === 'late');
  
  // Tarefas com baixa nota
  const lowGradeAssignments = assignments.filter(a => a.grade !== null && a.grade < 60);
  
  return {
    weaknesses: weakTopics,
    strengths: strongTopics,
    pendingWork: pendingAssignments,
    needsReview: lowGradeAssignments,
    hasGaps: weakTopics.length > 0 || lowGradeAssignments.length > 0
  };
}

/**
 * Gera recomendações personalizadas usando IA (COM FALLBACK IMEDIATO)
 */
async function generateAIRecommendations(studentData, gaps) {
  const { user, progress, motivationalProfile } = studentData;
  
  // SKIP AI - use fallback directly if not much data
  if (!user || progress.length < 3) {
    console.log('⚠️ Not enough data for AI or user not found. Using rule-based recommendations.');
    return generateBasicRecommendations(studentData, gaps);
  }
  
  const prompt = `Você é um especialista em educação personalizada de IA para crianças/adolescentes.

PERFIL DO ALUNO:
- Nome: ${user.full_name}
- Nível: ${user.explorer_level}
- Estilo VARK predominante: ${user.vark_primary_style}
- Tipo motivacional: ${motivationalProfile?.bartle_type || 'unknown'}
- Lições completadas: ${progress.filter(p => p.completed).length}
- Média de notas: ${calculateAverageScore(progress).toFixed(1)}%

PONTOS FORTES:
${gaps.strengths.length > 0 ? gaps.strengths.slice(0, 3).map(s => `- Lição ${s.lesson_id}: ${s.score}%`).join('\n') : '- Ainda coletando dados'}

PONTOS FRACOS / GAPS:
${gaps.weaknesses.length > 0 ? gaps.weaknesses.slice(0, 3).map(w => `- Lição ${w.lesson_id}: ${w.score}%`).join('\n') : '- Nenhum gap identificado'}

TAREFA: Gere um plano de aprendizado personalizado com:
1. Análise do perfil (2-3 linhas)
2. Top 3 prioridades de aprendizado
3. Estratégias específicas por estilo VARK
4. 5 próximos passos concretos

Seja específico, encorajador e prático.`;

  try {
    // TRY AI with FAST TIMEOUT
    let timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('AI timeout')), 10000) // 10s timeout
    );
    
    const response = await Promise.race([
      base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            profile_analysis: { type: "string" },
            top_priorities: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  priority: { type: "string" },
                  reason: { type: "string" },
                  impact: { type: "string", enum: ["high", "medium", "low"] }
                }
              }
            },
            vark_strategies: {
              type: "object",
              properties: {
                visual: { type: "array", items: { type: "string" } },
                auditory: { type: "array", items: { type: "string" } },
                read_write: { type: "array", items: { type: "string" } },
                kinesthetic: { type: "array", items: { type: "string" } }
              }
            },
            nextSteps: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  step: { type: "string" },
                  description: { type: "string" },
                  estimated_time: { type: "string" }
                }
              }
            }
          },
          required: ["profile_analysis", "top_priorities", "vark_strategies", "nextSteps"] // Make sure essential fields are expected
        }
      }),
      timeoutPromise
    ]);
    
    console.log('✅ AI recommendations generated successfully');
    return response;
    
  } catch (error) {
    console.warn('⚠️ AI failed, using fallback:', error.message);
    // IMMEDIATE FALLBACK
    return generateBasicRecommendations(studentData, gaps);
  }
}

/**
 * Gera tarefas personalizadas (OPTIONAL - can be skipped)
 */
async function generateCustomAssignments(studentData, recommendations) {
  const { user } = studentData;
  
  // Identify concepts that need practice
  const conceptsNeedingPractice = recommendations.top_priorities
    ?.slice(0, 2) // Only 2 to reduce API calls
    .map(p => p.priority) || [];
  
  if (!user || conceptsNeedingPractice.length === 0) {
    return [];
  }
  
  const prompt = `Gere 2 exercícios práticos personalizados para um aluno de ${user.explorer_level}.

CONCEITOS: ${conceptsNeedingPractice.join(', ')}
ESTILO: ${user.vark_primary_style}

Para cada exercício: título, descrição, tipo, tempo estimado, 3 instruções, 3 critérios de avaliação.`;

  try {
    // Fast timeout
    let timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Assignment generation timeout')), 8000)
    );

    const response = await Promise.race([
      base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            assignments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  type: { type: "string" },
                  estimated_time_minutes: { type: "number" },
                  instructions: { type: "array", items: { type: "string" } },
                  evaluation_criteria: { type: "array", items: { type: "string" } },
                  vark_alignment: { type: "string" },
                  difficulty: { type: "string", enum: ["beginner", "intermediate", "advanced"] }
                },
                required: ["title", "description", "type", "estimated_time_minutes", "instructions", "evaluation_criteria", "vark_alignment", "difficulty"]
              }
            }
          },
          required: ["assignments"]
        }
      }),
      timeoutPromise
    ]);
    
    return response.assignments || [];
    
  } catch (error) {
    console.warn('⚠️ Could not generate custom assignments:', error.message);
    return [];
  }
}

/**
 * Recomenda recursos alinhados ao perfil VARK (NO API CALLS - local filtering)
 */
async function recommendVARKResources(studentData, recommendations) {
  const { user } = studentData;
  
  try {
    // Use cached resources
    const resources = await base44.entities.ExternalResource.list();
    
    // Filtrar por estilo VARK primário
    const varkAligned = resources.filter(r => 
      r.vark_alignment?.includes(user?.vark_primary_style) &&
      r.target_level === user?.explorer_level &&
      r.curator_approved === true
    );
    
    // Ordenar por relevância
    const sorted = varkAligned.sort((a, b) => 
      (b.auto_quality_score || 0) - (a.auto_quality_score || 0)
    );
    
    return sorted.slice(0, 10).map(r => ({
      id: r.id,
      title: r.title,
      url: r.url,
      type: r.type,
      vark_style: r.primary_vark,
      quality_score: r.auto_quality_score,
      relevance: r.relevance_score,
      description: r.description
    }));
    
  } catch (error) {
    console.warn('⚠️ Error recommending resources:', error);
    return [];
  }
}

/**
 * Gera mensagem motivacional personalizada
 */
function generateMotivationalMessage(studentData, gaps) {
  const { user, progress, motivationalProfile } = studentData;
  
  // Ensure progress array is not empty to avoid division by zero
  const completionRate = progress.length > 0 ? progress.filter(p => p.completed).length / progress.length * 100 : 0;
  const avgScore = calculateAverageScore(progress);
  
  // Baseado no tipo motivacional
  const bartleType = motivationalProfile?.bartle_type || 'achiever';
  
  const messages = {
    achiever: `🏆 ${user.full_name}, você já completou ${progress.filter(p => p.completed).length} lições! Continue conquistando seus objetivos!`,
    explorer: `🔍 ${user.full_name}, há ${progress.length - progress.filter(p => p.completed).length} lições esperando para serem exploradas. Que tal descobrir algo novo?`,
    socializer: `👥 ${user.full_name}, você está progredindo muito bem! Que tal compartilhar seu aprendizado com seus colegas?`,
    competitor: `⚡ ${user.full_name}, sua média é ${avgScore.toFixed(1)}%. Desafie-se a superar seus próprios recordes!`
  };
  
  return messages[bartleType] || messages.achiever;
}

/**
 * Calcula média de scores
 */
function calculateAverageScore(progress) {
  const scores = progress
    .filter(p => p.quiz_score !== null)
    .map(p => p.quiz_score);
  
  if (scores.length === 0) return 0;
  
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

/**
 * Fallback: recomendações básicas sem IA
 */
function generateBasicRecommendations(studentData, gaps) {
  // Use optional chaining for studentData.user to prevent errors if user is null
  const userVarkStyle = studentData.user?.vark_primary_style || 'visual'; // Default if user is null
  const userFullName = studentData.user?.full_name || 'Estudante';
  const explorerLevel = studentData.user?.explorer_level || 'iniciante';
  const progressLength = studentData.progress?.length || 0;

  return {
    profile_analysis: `Analisando seu perfil de aprendizado personalizado baseado em ${progressLength} lições e seu estilo VARK ${userVarkStyle}.`,
    top_priorities: [
      {
        priority: gaps.weaknesses.length > 0 
          ? "Revisar conceitos com baixa performance" 
          : "Continuar progredindo no ritmo atual",
        reason: gaps.weaknesses.length > 0 
          ? "Identificamos algumas áreas que precisam de reforço" 
          : "Seu desempenho está ótimo!",
        impact: gaps.weaknesses.length > 0 ? "high" : "medium"
      },
      {
        priority: "Praticar com exercícios do seu estilo VARK",
        reason: `Recursos ${userVarkStyle} são mais efetivos para você`,
        impact: "high"
      },
      {
        priority: "Manter consistência no aprendizado",
        reason: "Regularidade é chave para o sucesso",
        impact: "medium"
      }
    ],
    vark_strategies: {
      visual: ["Use diagramas e mapas mentais", "Assista vídeos educativos"],
      auditory: ["Ouça podcasts", "Discuta conceitos em voz alta"],
      read_write: ["Faça anotações detalhadas", "Leia artigos e documentações"],
      kinesthetic: ["Faça projetos práticos", "Experimente hands-on"]
    },
    nextSteps: [
      {
        step: "Revisar lições com baixa performance",
        description: "Foque nos conceitos que ainda não domina completamente",
        estimated_time: "30-45 minutos"
      },
      {
        step: "Completar tarefas pendentes",
        description: `Você tem ${gaps.pendingWork.length} tarefas aguardando`,
        estimated_time: "Variável"
      },
      {
        step: "Explorar novos recursos",
        description: "Recursos personalizados para seu estilo de aprendizado",
        estimated_time: "20 minutos"
      }
    ]
    // motivational_tips are generated by generateMotivationalMessage separately.
  };
}

/**
 * Cria assignment personalizada no banco de dados
 */
export async function createPersonalizedAssignment(studentEmail, assignmentData) {
  try {
    const assignment = await base44.entities.Assignment.create({
      student_email: studentEmail,
      title: assignmentData.title,
      description: assignmentData.description,
      course_id: assignmentData.course_id || 'personalized',
      lesson_id: assignmentData.lesson_id || null,
      due_date: assignmentData.due_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      points: assignmentData.points || 100,
      assignment_type: assignmentData.type || 'homework',
      status: 'pending',
      expected_answer: assignmentData.expected_answer || '',
      rubric: assignmentData.evaluation_criteria ? {
        criteria: assignmentData.evaluation_criteria.map(c => ({
          name: c,
          weight: 100 / assignmentData.evaluation_criteria.length
        }))
      } : null
    });
    
    console.log('✅ Personalized assignment created:', assignment.id);
    return assignment;
    
  } catch (error) {
    console.error('❌ Error creating personalized assignment:', error);
    throw error;
  }
}
