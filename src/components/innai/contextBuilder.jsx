import { base44 } from '@/api/base44Client';
import { differenceInDays } from 'date-fns';

/**
 * Constrói contexto completo do aluno para InnAI
 */
export async function buildStudentContext(studentEmail) {
  try {
    // Buscar dados do aluno em paralelo
    const [
      progressData,
      enrollmentsData,
      assignmentsData,
      gamificationData,
      aiEthicsData,
      difficultyPredictions,
      learningPatterns
    ] = await Promise.all([
      base44.entities.StudentProgress.filter({ student_email: studentEmail }).catch(() => []),
      base44.entities.Enrollment.filter({ student_email: studentEmail }).catch(() => []),
      base44.entities.Assignment.filter({ student_email: studentEmail, status: 'pending' }, '-due_date', 5).catch(() => []),
      base44.entities.GamificationProfile.filter({ student_email: studentEmail }).catch(() => []),
      base44.entities.AIEthicsCourse.filter({ student_email: studentEmail }).catch(() => []),
      base44.entities.DifficultyPrediction.filter({ student_email: studentEmail }, '-created_date', 5).catch(() => []),
      base44.entities.LearningPattern.filter({ student_email: studentEmail }).catch(() => [])
    ]);

    // Calcular dias sem acesso - usar AGORA como referência (usuário está acessando)
    // Se o usuário está vendo InnAI, ele ESTÁ ATIVO AGORA
    let daysSinceLastAccess = 0;
    
    // Pegar a data/hora atual do sistema
    const now = new Date();
    
    if (progressData.length > 0) {
      // Encontrar o progresso mais recente ANTES de hoje
      const sortedProgress = progressData
        .map(p => ({
          ...p,
          date: new Date(p.updated_date || p.created_date)
        }))
        .filter(p => p.date < now) // Apenas registros anteriores
        .sort((a, b) => b.date - a.date);
      
      if (sortedProgress.length > 0) {
        const lastAccessDate = sortedProgress[0].date;
        daysSinceLastAccess = differenceInDays(now, lastAccessDate);
        
        // Se a diferença for 0 ou negativa, significa que o usuário está ativo hoje
        if (daysSinceLastAccess <= 0) {
          daysSinceLastAccess = 0;
        }
      }
    } else {
      // Se não há dados de progresso, considerar novo usuário (0 dias)
      daysSinceLastAccess = 0;
    }

    // Aulas concluídas recentemente (últimas 5)
    const completedLessons = progressData
      .filter(p => p.completed)
      .sort((a, b) => new Date(b.completion_date) - new Date(a.completion_date))
      .slice(0, 5);

    // Scores recentes (últimas 5 notas)
    const recentScores = progressData
      .filter(p => p.quiz_score != null)
      .sort((a, b) => new Date(b.updated_date || b.created_date) - new Date(a.updated_date || a.created_date))
      .slice(0, 5)
      .map(p => p.quiz_score);

    // Média de scores recentes
    const avgRecentScore = recentScores.length > 0
      ? Math.round(recentScores.reduce((sum, s) => sum + s, 0) / recentScores.length)
      : null;

    // Tópicos de dificuldade (baseado em scores baixos)
    const struggleTopics = progressData
      .filter(p => p.quiz_score != null && p.quiz_score < 60)
      .map(p => p.lesson_id)
      .slice(0, 5);

    // Perfil de gamificação
    const gamification = gamificationData.length > 0 ? gamificationData[0] : null;

    // Progresso em AI Ethics
    const aiEthics = aiEthicsData.length > 0 ? aiEthicsData[0] : null;

    // Predições de dificuldade recentes
    const recentPredictions = difficultyPredictions
      .filter(p => p.prediction_score > 60) // Alto risco
      .slice(0, 3);

    // Padrões de aprendizado
    const patterns = learningPatterns.reduce((acc, pattern) => {
      acc[pattern.pattern_type] = pattern;
      return acc;
    }, {});

    // Matrículas ativas
    const activeEnrollments = enrollmentsData.filter(e => e.progress < 100);

    // Calcular taxa de conclusão geral
    const totalProgress = progressData.length;
    const completedProgress = progressData.filter(p => p.completed).length;
    const completionRate = totalProgress > 0 
      ? Math.round((completedProgress / totalProgress) * 100)
      : 0;

    // Streak (dias consecutivos - simplificado)
    const streakDays = gamification?.streak_days || 0;

    // Risk score (0-100, maior = mais risco)
    let riskScore = 0;
    
    // Fatores de risco
    if (daysSinceLastAccess > 7) riskScore += 30;
    else if (daysSinceLastAccess > 3) riskScore += 15;
    
    if (avgRecentScore && avgRecentScore < 60) riskScore += 25;
    else if (avgRecentScore && avgRecentScore < 70) riskScore += 15;
    
    if (assignmentsData.length > 3) riskScore += 20;
    else if (assignmentsData.length > 1) riskScore += 10;
    
    if (completionRate < 40) riskScore += 25;
    else if (completionRate < 60) riskScore += 15;

    // Contexto final
    const context = {
      // Identidade
      student_email: studentEmail,
      
      // Atividade
      days_since_last_access: daysSinceLastAccess,
      last_access_date: progressData.length > 0 
        ? (progressData[0].updated_date || progressData[0].created_date)
        : null,
      
      // Progresso
      total_lessons_completed: completedProgress,
      completion_rate: completionRate,
      current_enrollments: activeEnrollments.map(e => ({
        module_id: e.module_id,
        progress: e.progress
      })),
      
      // Performance
      recent_scores: recentScores,
      average_recent_score: avgRecentScore,
      struggle_topics: struggleTopics,
      
      // Gamificação
      innova_coins: gamification?.innova_coins || 0,
      level: gamification?.level || 1,
      badges_count: gamification?.badges?.length || 0,
      streak_days: streakDays,
      
      // Tarefas
      pending_tasks: assignmentsData.length,
      pending_tasks_details: assignmentsData.map(a => ({
        title: a.title,
        due_date: a.due_date,
        type: a.assignment_type
      })),
      
      // AI Ethics
      ai_ethics_completed: aiEthics?.certificate_issued || false,
      ai_ethics_progress: aiEthics?.progress_percentage || 0,
      
      // Predições e Padrões
      risk_score: riskScore,
      difficulty_predictions: recentPredictions.map(p => ({
        lesson_id: p.lesson_id,
        score: p.prediction_score,
        type: p.predicted_difficulty_type
      })),
      learning_patterns: {
        time_of_day: patterns.time_of_day?.pattern_data || null,
        struggle_topics: patterns.struggle_topics?.pattern_data || null,
        strength_topics: patterns.strength_topics?.pattern_data || null
      },
      
      // Estado geral
      needs_intervention: riskScore > 60,
      is_active: daysSinceLastAccess < 7,
      is_struggling: avgRecentScore && avgRecentScore < 60
    };

    return context;

  } catch (error) {
    console.error('Erro ao construir contexto do aluno:', error);
    
    // Retornar contexto mínimo em caso de erro
    return {
      student_email: studentEmail,
      days_since_last_access: 0,
      error: true,
      error_message: error.message
    };
  }
}

/**
 * Detecta gatilhos para mensagens proativas do InnAI
 */
export function detectProactiveTriggers(context) {
  const triggers = [];

  if (!context || context.error) {
    return triggers;
  }

  // Trigger 1: Inatividade prolongada
  // IMPORTANTE: Só mostrar se realmente houver inatividade significativa
  if (context.days_since_last_access > 14) {
    triggers.push({
      type: 'inactivity',
      priority: 'urgent',
      message: `Oi! Faz um tempinho que você não acessa a plataforma. Tudo bem? Estou aqui para ajudar você a retomar seus estudos! 🌱`,
      suggested_actions: [
        { type: 'open_lesson', label: 'Ver Próxima Lição', url: '/Courses' }
      ]
    });
  } else if (context.days_since_last_access >= 7) {
    triggers.push({
      type: 'mild_inactivity',
      priority: 'medium',
      message: `Oi! Faz uma semana que não nos vemos. Que tal continuar de onde parou? 😊`,
      suggested_actions: [
        { type: 'open_lesson', label: 'Continuar Estudos', url: '/Courses' }
      ]
    });
  } else if (context.days_since_last_access > 0) {
    // Usuário voltou após alguns dias - mensagem de boas-vindas
    triggers.push({
      type: 'welcome_back',
      priority: 'low',
      message: `Que bom te ver de volta! Como posso ajudar hoje? 😊`,
      suggested_actions: [
        { type: 'continue_learning', label: 'Continuar Aprendendo', url: '/Courses' }
      ]
    });
  }

  // Trigger 2: Tarefas pendentes críticas
  if (context.pending_tasks > 5) {
    triggers.push({
      type: 'overdue_tasks',
      priority: 'high',
      message: `Você tem ${context.pending_tasks} tarefas pendentes. Vamos organizar? Posso te ajudar a priorizar! 📋`,
      suggested_actions: [
        { type: 'view_assignments', label: 'Ver Tarefas', url: '/Assignments' }
      ]
    });
  } else if (context.pending_tasks > 2) {
    triggers.push({
      type: 'pending_tasks',
      priority: 'medium',
      message: `Você tem ${context.pending_tasks} tarefas esperando. Quer uma ajuda para começar? 💪`,
      suggested_actions: [
        { type: 'view_assignments', label: 'Ver Tarefas', url: '/Assignments' }
      ]
    });
  }

  // Trigger 3: Performance baixa
  if (context.average_recent_score && context.average_recent_score < 60) {
    triggers.push({
      type: 'low_performance',
      priority: 'high',
      message: `Notei que suas últimas notas ficaram abaixo de 60%. Vamos revisar o conteúdo juntos? Estou aqui para te apoiar! 📚`,
      suggested_actions: [
        { type: 'review_content', label: 'Revisar Conteúdo', url: '/Resources' }
      ]
    });
  }

  // Trigger 4: Risco de evasão
  if (context.risk_score > 70) {
    triggers.push({
      type: 'churn_risk',
      priority: 'urgent',
      message: `Percebi que você pode estar com dificuldades. Que tal conversarmos? Estou aqui para ajudar você a ter sucesso! 🌟`,
      suggested_actions: [
        { type: 'schedule_support', label: 'Falar com Professor', url: '/Profile' }
      ]
    });
  }

  // Trigger 5: AI Ethics não completado
  if (!context.ai_ethics_completed && context.total_lessons_completed > 10) {
    triggers.push({
      type: 'ethics_reminder',
      priority: 'low',
      message: `Você já tem ${context.total_lessons_completed} lições completadas! Que tal fazer o curso de Ética em IA também? É rápido e muito importante! 🛡️`,
      suggested_actions: [
        { type: 'start_ethics', label: 'Começar Curso de Ética', url: '/AIEthics' }
      ]
    });
  }

  // Trigger 6: Streak quebrado
  if (context.streak_days === 0 && context.total_lessons_completed > 5) {
    triggers.push({
      type: 'streak_broken',
      priority: 'low',
      message: `Seu streak de dias consecutivos foi zerado. Vamos recomeçar hoje? 🔥`,
      suggested_actions: [
        { type: 'continue_learning', label: 'Continuar Aprendendo', url: '/Courses' }
      ]
    });
  }

  // Trigger 7: Conquista próxima
  if (context.completion_rate > 80 && context.completion_rate < 100) {
    triggers.push({
      type: 'achievement_close',
      priority: 'medium',
      message: `Você está a ${100 - context.completion_rate}% de completar tudo! Está quase lá! 🏆`,
      suggested_actions: [
        { type: 'view_progress', label: 'Ver Progresso', url: '/Profile' }
      ]
    });
  }

  // Ordenar por prioridade
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  triggers.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return triggers;
}

/**
 * Formata contexto para o prompt do InnAI
 */
export function formatContextForPrompt(context) {
  let contextText = `
CONTEXTO DO ALUNO:
Email: ${context.student_email}
`;

  if (context.days_since_last_access === 0) {
    contextText += `Atividade: Ativo agora\n`;
  } else if (context.days_since_last_access === 1) {
    contextText += `Atividade: Último acesso ontem\n`;
  } else if (context.days_since_last_access <= 7) {
    contextText += `Atividade: Último acesso há ${context.days_since_last_access} dias\n`;
  } else {
    contextText += `Atividade: Inativo há ${context.days_since_last_access} dias ⚠️\n`;
  }

  if (context.completion_rate != null) {
    contextText += `Progresso Geral: ${context.completion_rate}% de lições completadas\n`;
  }

  if (context.average_recent_score != null) {
    contextText += `Performance Recente: Média de ${context.average_recent_score}% nos últimos quizzes\n`;
  }

  if (context.innova_coins != null) {
    contextText += `Innova Coins: ${context.innova_coins} moedas\n`;
  }

  if (context.streak_days > 0) {
    contextText += `Streak: ${context.streak_days} dias consecutivos 🔥\n`;
  }

  if (context.pending_tasks > 0) {
    contextText += `Tarefas Pendentes: ${context.pending_tasks}\n`;
  }

  if (context.risk_score > 60) {
    contextText += `⚠️ ALERTA: Aluno em risco de evasão (score: ${context.risk_score}/100)\n`;
  }

  if (context.struggle_topics && context.struggle_topics.length > 0) {
    contextText += `Tópicos de Dificuldade: ${context.struggle_topics.join(', ')}\n`;
  }

  if (!context.ai_ethics_completed) {
    contextText += `AI Ethics: Não completado (${context.ai_ethics_progress}%)\n`;
  }

  return contextText;
}