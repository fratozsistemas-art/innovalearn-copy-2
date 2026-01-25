
import { base44 } from '@/api/base44Client';

/**
 * DifficultyPredictor - Sistema Preditivo de Dificuldade
 * 
 * Gap Resolvido: Sistema Reativo → Sistema Preditivo
 * 
 * Funcionalidades:
 * - Analisa padrões históricos do aluno
 * - Prevê dificuldades ANTES de acontecerem
 * - Aciona intervenções automáticas
 * - Aprende com os resultados (feedback loop)
 */

/**
 * Calcula score de dificuldade prevista para uma lição
 */
export async function predictDifficulty(studentEmail, lessonId) {
  console.log('🔮 Predicting difficulty for:', studentEmail, lessonId);
  
  try {
    // 1. Buscar histórico do aluno
    const [allProgress, allPredictions, studentPatterns] = await Promise.all([
      base44.entities.StudentProgress.filter({ student_email: studentEmail }).catch(() => []),
      base44.entities.DifficultyPrediction.filter({ student_email: studentEmail }).catch(() => []),
      base44.entities.LearningPattern.filter({ student_email: studentEmail }).catch(() => [])
    ]);

    // 2. Buscar informações da lição
    const lessons = await base44.entities.Lesson.filter({ id: lessonId }).catch(() => []);
    const lesson = lessons[0];
    
    if (!lesson) {
      console.warn('⚠️ Lesson not found:', lessonId, '- returning default prediction');
      
      // Retornar predição padrão para lição não encontrada
      return {
        student_email: studentEmail,
        lesson_id: lessonId,
        module_id: lessonId.split('-lesson-')[0] || 'unknown',
        prediction_score: 30, // Score baixo padrão (menos risco)
        confidence_level: 'low',
        risk_factors: [{
          factor: 'lesson_not_found',
          weight: 0,
          description: 'Lição não encontrada no sistema'
        }],
        predicted_difficulty_type: 'conceptual',
        recommended_interventions: [{
          type: 'extra_resource',
          description: 'Revisar conteúdo relacionado',
          priority: 3,
          resource_url: null
        }]
      };
    }

    // 3. Calcular fatores de risco
    const riskFactors = [];
    let totalScore = 0;

    // Fator 1: Histórico de dificuldade em tópicos similares (peso: 30)
    const similarTopics = allProgress.filter(p => 
      p.completed && 
      p.quiz_score !== null && 
      p.quiz_score < 70 &&
      // Checar se é mesmo nível ou tem soft skills similares
      lesson.soft_skills?.some(s => p.lesson_id?.includes(s))
    );
    
    if (similarTopics.length > 2) {
      const avgScore = similarTopics.reduce((sum, p) => sum + p.quiz_score, 0) / similarTopics.length;
      const weight = 30 * (1 - avgScore / 100);
      totalScore += weight;
      riskFactors.push({
        factor: 'similar_topic_difficulty',
        weight: weight,
        description: `Dificuldade prévia em ${similarTopics.length} tópicos similares (média: ${avgScore.toFixed(0)}%)`
      });
    }

    // Fator 2: Tempo desde última atividade (peso: 20)
    const lastActivity = allProgress
      .filter(p => p.completion_date)
      .sort((a, b) => new Date(b.completion_date) - new Date(a.completion_date))[0];
    
    if (lastActivity) {
      const daysSinceActivity = Math.floor(
        (new Date() - new Date(lastActivity.completion_date)) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceActivity > 7) {
        const weight = Math.min(20, daysSinceActivity * 2);
        totalScore += weight;
        riskFactors.push({
          factor: 'inactivity',
          weight: weight,
          description: `${daysSinceActivity} dias sem atividade (risco de perda de contexto)`
        });
      }
    }

    // Fator 3: Taxa de conclusão recente (peso: 25)
    const recentProgress = allProgress
      .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
      .slice(0, 5);
    
    if (recentProgress.length > 0) {
      const completionRate = recentProgress.filter(p => p.completed).length / recentProgress.length;
      
      if (completionRate < 0.6) {
        const weight = 25 * (1 - completionRate);
        totalScore += weight;
        riskFactors.push({
          factor: 'low_completion_rate',
          weight: weight,
          description: `Taxa de conclusão baixa: ${(completionRate * 100).toFixed(0)}% nas últimas 5 lições`
        });
      }
    }

    // Fator 4: Padrão de tempo de estudo (peso: 15)
    const timePattern = studentPatterns.find(p => p.pattern_type === 'session_duration');
    if (timePattern && timePattern.pattern_data?.average_duration_minutes < 30) {
      const weight = 15;
      totalScore += weight;
      riskFactors.push({
        factor: 'short_study_sessions',
        weight: weight,
        description: `Sessões de estudo curtas (média: ${timePattern.pattern_data.average_duration_minutes}min)`
      });
    }

    // Fator 5: Predições anteriores corretas (peso: 10)
    const recentPredictions = allPredictions
      .filter(p => p.prediction_accuracy !== null && p.prediction_accuracy !== undefined)
      .slice(0, 10);
    
    if (recentPredictions.length > 3) {
      const accuratePredictions = recentPredictions.filter(p => p.prediction_accuracy === true);
      
      // Se tivemos predições corretas de dificuldade, aumentar score
      const previousDifficulties = accuratePredictions.filter(p => p.actual_outcome?.had_difficulty);
      if (previousDifficulties.length > 2) {
        const weight = 10;
        totalScore += weight;
        riskFactors.push({
          factor: 'historical_pattern',
          weight: weight,
          description: `Padrão histórico de dificuldade (${previousDifficulties.length} casos recentes)`
        });
      }
    }

    // 4. Determinar tipo de dificuldade prevista
    let predictedType = 'conceptual';
    if (riskFactors.some(f => f.factor === 'similar_topic_difficulty')) {
      predictedType = 'prerequisite_gap';
    } else if (riskFactors.some(f => f.factor === 'inactivity')) {
      predictedType = 'motivational';
    } else if (lesson.difficulty_level === 'advanced') {
      predictedType = 'technical';
    }

    // 5. Gerar recomendações
    const interventions = generateInterventions(totalScore, predictedType, lesson, riskFactors);

    // 6. Determinar confiança
    const confidence = recentPredictions.length > 5 ? 'high' : 
                       recentPredictions.length > 2 ? 'medium' : 'low';

    // 7. Criar predição
    const prediction = {
      student_email: studentEmail,
      lesson_id: lessonId,
      module_id: lesson.module_id || lessonId.split('-lesson-')[0],
      prediction_score: Math.min(Math.round(totalScore), 100),
      confidence_level: confidence,
      risk_factors: riskFactors,
      predicted_difficulty_type: predictedType,
      recommended_interventions: interventions
    };

    // 8. Salvar predição
    const saved = await base44.entities.DifficultyPrediction.create(prediction);
    
    // 9. Se score alto, acionar intervenção automática
    if (totalScore > 60) {
      await triggerIntervention(saved.id, studentEmail, interventions);
    }

    console.log('✅ Difficulty predicted:', totalScore, 'Type:', predictedType);
    
    return saved;

  } catch (error) {
    console.error('❌ Error predicting difficulty:', error.message || error);
    
    // Retornar predição padrão em caso de erro
    return {
      student_email: studentEmail,
      lesson_id: lessonId,
      module_id: lessonId.split('-lesson-')[0] || 'unknown',
      prediction_score: 30,
      confidence_level: 'low',
      risk_factors: [{
        factor: 'error',
        weight: 0,
        description: 'Erro ao calcular predição'
      }],
      predicted_difficulty_type: 'conceptual',
      recommended_interventions: []
    };
  }
}

/**
 * Gera intervenções recomendadas baseado no score e tipo
 */
function generateInterventions(score, type, lesson, riskFactors) {
  const interventions = [];

  if (score > 70) {
    // Alto risco - intervenção imediata
    if (type === 'prerequisite_gap') {
      interventions.push({
        type: 'prerequisite_review',
        description: 'Revisar conceitos fundamentais antes desta lição',
        priority: 1,
        resource_url: null // Será preenchido com recursos VARK-adaptados
      });
    }
    
    interventions.push({
      type: 'tutoring',
      description: 'Sessão de mentoria 1:1 com instrutor recomendada',
      priority: 1,
      resource_url: null
    });
    
    interventions.push({
      type: 'simplified_content',
      description: 'Acessar versão simplificada do conteúdo',
      priority: 2,
      resource_url: null
    });

  } else if (score > 50) {
    // Risco médio - suporte adicional
    interventions.push({
      type: 'extra_resource',
      description: 'Recursos complementares no seu estilo VARK',
      priority: 1,
      resource_url: null
    });
    
    interventions.push({
      type: 'peer_learning',
      description: 'Estudo em grupo com colegas recomendado',
      priority: 2,
      resource_url: null
    });

  } else if (score > 30) {
    // Risco baixo - apenas monitoramento
    interventions.push({
      type: 'extra_resource',
      description: 'Recursos opcionais disponíveis se precisar',
      priority: 3,
      resource_url: null
    });
  }

  return interventions;
}

/**
 * Aciona intervenção automática
 */
async function triggerIntervention(predictionId, studentEmail, interventions) {
  try {
    // 1. Atualizar predição
    await base44.entities.DifficultyPrediction.update(predictionId, {
      intervention_triggered: true,
      intervention_timestamp: new Date().toISOString()
    });

    // 2. Criar notificação para o aluno
    await base44.entities.Notification.create({
      user_email: studentEmail,
      type: 'at_risk_alert',
      priority: 'high',
      title: '🎯 Apoio Personalizado Disponível',
      message: `Detectamos que você pode precisar de suporte extra na próxima lição. Preparamos recursos especiais para você!`,
      action_url: `/recommendations?prediction=${predictionId}`,
      metadata: {
        prediction_id: predictionId,
        interventions: interventions
      }
    });

    // 3. Notificar coordenador se risco muito alto
    const prediction = await base44.entities.DifficultyPrediction.filter({ id: predictionId });
    if (prediction[0]?.prediction_score > 80) {
      // Buscar coordenadores
      const coordinators = await base44.entities.User.filter({ user_type: 'coordenador_pedagogico' });
      
      for (const coord of coordinators) {
        await base44.entities.Notification.create({
          user_email: coord.email,
          type: 'at_risk_alert',
          priority: 'urgent',
          title: '⚠️ Aluno em Alto Risco de Dificuldade',
          message: `${studentEmail} tem 80%+ de chance de dificuldade na próxima lição. Intervenção recomendada.`,
          action_url: `/analytics?student=${studentEmail}`,
          metadata: {
            student_email: studentEmail,
            prediction_id: predictionId
          }
        });
      }
    }

    console.log('✅ Intervention triggered for:', studentEmail);

  } catch (error) {
    console.error('❌ Error triggering intervention:', error);
  }
}

/**
 * Registra resultado real (para treinar o modelo)
 */
export async function recordActualOutcome(predictionId, outcome) {
  try {
    const predictions = await base44.entities.DifficultyPrediction.filter({ id: predictionId });
    const prediction = predictions[0];
    
    if (!prediction) return;

    // Determinar se houve dificuldade
    const hadDifficulty = 
      outcome.quiz_score < 60 ||
      outcome.needed_help === true ||
      outcome.completion_time_minutes > (outcome.expected_time_minutes * 1.5);

    // Calcular acurácia
    const predictedDifficulty = prediction.prediction_score > 50;
    const accuracy = predictedDifficulty === hadDifficulty;

    // Atualizar predição
    await base44.entities.DifficultyPrediction.update(predictionId, {
      actual_outcome: {
        had_difficulty: hadDifficulty,
        completion_time_minutes: outcome.completion_time_minutes,
        quiz_score: outcome.quiz_score,
        needed_help: outcome.needed_help
      },
      prediction_accuracy: accuracy
    });

    console.log('✅ Outcome recorded. Accuracy:', accuracy);

    // Se o modelo errou muito, ajustar
    if (!accuracy && Math.abs(prediction.prediction_score - 50) > 30) {
      console.log('⚠️ Significant prediction error. Model adjustment needed.');
      // Aqui poderia ajustar pesos dos fatores de risco
    }

  } catch (error) {
    console.error('❌ Error recording outcome:', error);
  }
}

/**
 * Analisa padrões de aprendizado do aluno
 */
export async function analyzeLearningPatterns(studentEmail) {
  try {
    console.log('📊 Analyzing learning patterns for:', studentEmail);

    const allProgress = await base44.entities.StudentProgress.filter({ 
      student_email: studentEmail 
    });

    if (allProgress.length < 5) {
      console.log('⚠️ Not enough data for pattern analysis');
      return [];
    }

    const patterns = [];

    // Padrão 1: Horário preferido de estudo
    const timeOfDayData = {};
    allProgress.forEach(p => {
      if (p.created_date) {
        const hour = new Date(p.created_date).getHours();
        const period = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
        timeOfDayData[period] = (timeOfDayData[period] || 0) + 1;
      }
    });

    if (Object.keys(timeOfDayData).length > 0) {
      const bestPeriod = Object.entries(timeOfDayData)
        .sort((a, b) => b[1] - a[1])[0][0];
      
      patterns.push({
        student_email: studentEmail,
        pattern_type: 'time_of_day',
        pattern_data: {
          distribution: timeOfDayData,
          best_period: bestPeriod
        },
        confidence: Math.min((timeOfDayData[bestPeriod] / allProgress.length) * 100, 100),
        sample_size: allProgress.length,
        insights: [
          `Você aprende melhor no período da ${bestPeriod === 'morning' ? 'manhã' : bestPeriod === 'afternoon' ? 'tarde' : 'noite'}`,
          `Tente fazer atividades difíceis neste horário`
        ]
      });
    }

    // Padrão 2: Duração média de sessão
    const sessionsWithTime = allProgress.filter(p => p.time_spent_minutes > 0);
    if (sessionsWithTime.length > 3) {
      const avgDuration = sessionsWithTime.reduce((sum, p) => sum + p.time_spent_minutes, 0) / sessionsWithTime.length;
      
      patterns.push({
        student_email: studentEmail,
        pattern_type: 'session_duration',
        pattern_data: {
          average_duration_minutes: Math.round(avgDuration),
          min_duration: Math.min(...sessionsWithTime.map(p => p.time_spent_minutes)),
          max_duration: Math.max(...sessionsWithTime.map(p => p.time_spent_minutes))
        },
        confidence: 75,
        sample_size: sessionsWithTime.length,
        insights: avgDuration < 30 
          ? ['Suas sessões são curtas. Tente aumentar para 45-60 minutos para melhor retenção']
          : avgDuration > 90
          ? ['Suas sessões são longas. Faça pausas a cada 60 minutos para manter o foco']
          : ['Duração ideal de estudo! Continue assim']
      });
    }

    // Padrão 3: Tópicos de dificuldade
    const lowScores = allProgress.filter(p => p.quiz_score !== null && p.quiz_score < 70);
    if (lowScores.length > 0) {
      // Agrupar por soft_skill ou tópico
      const difficultyTopics = {};
      // Simplified: apenas contar
      
      patterns.push({
        student_email: studentEmail,
        pattern_type: 'struggle_topics',
        pattern_data: {
          count: lowScores.length,
          topics: difficultyTopics
        },
        confidence: 60,
        sample_size: lowScores.length,
        insights: [
          `Você teve dificuldade em ${lowScores.length} lições`,
          'Recomendamos revisar estes tópicos antes de avançar'
        ]
      });
    }

    // Salvar padrões
    for (const pattern of patterns) {
      pattern.last_updated = new Date().toISOString();
      await base44.entities.LearningPattern.create(pattern);
    }

    console.log('✅ Patterns analyzed:', patterns.length);
    return patterns;

  } catch (error) {
    console.error('❌ Error analyzing patterns:', error);
    return [];
  }
}
