import { base44 } from '@/api/base44Client';
import { getAvailableLessons, identifyKeyLessons } from './PrerequisiteGraph';

/**
 * AdaptivePathGenerator - Motor de Sequenciamento Adaptativo
 * 
 * Gap Resolvido: Currículo Linear → Não-Linear
 * 
 * Decide a próxima melhor lição baseado em:
 * - Desempenho anterior
 * - Predição de dificuldade
 * - Estilo VARK
 * - Pré-requisitos
 * - Gaps identificados
 * - Objetivos do aluno
 */

/**
 * Gera ou atualiza o caminho adaptativo do aluno
 */
export async function generateAdaptivePath(studentEmail, moduleId) {
  console.log('🎯 Generating adaptive path for:', studentEmail, moduleId);
  
  try {
    // 1. Buscar dados necessários
    const [
      user,
      allLessons,
      studentProgress,
      difficultyPredictions,
      contentGaps,
      existingPath
    ] = await Promise.all([
      base44.auth.me(),
      base44.entities.Lesson.filter({ module_id: moduleId }),
      base44.entities.StudentProgress.filter({ student_email: studentEmail, module_id: moduleId }),
      base44.entities.DifficultyPrediction.filter({ student_email: studentEmail, module_id: moduleId }),
      base44.entities.ContentGap.filter({ module_id: moduleId }),
      base44.entities.AdaptivePath.filter({ student_email: studentEmail, module_id: moduleId })
    ]);

    // 2. Calcular lições completadas
    const completedLessons = studentProgress
      .filter(p => p.completed)
      .map(p => p.lesson_id);

    // 3. Identificar lição atual
    const currentLesson = findCurrentLesson(studentProgress, allLessons);

    // 4. Calcular lições disponíveis (respeitando pré-requisitos)
    const availableLessons = getAvailableLessons(allLessons, completedLessons, moduleId);

    // 5. Calcular scores para cada lição disponível
    const scoredLessons = await Promise.all(
      availableLessons.map(lesson => scoreLessonFit(
        lesson,
        user,
        studentProgress,
        difficultyPredictions,
        contentGaps,
        allLessons,
        completedLessons
      ))
    );

    // 6. Ordenar por score (maior = melhor fit)
    scoredLessons.sort((a, b) => b.priority_score - a.priority_score);

    // 7. Selecionar top 3 recomendações
    const top3 = scoredLessons.slice(0, 3);

    // 8. Calcular métricas do caminho
    const learningVelocity = calculateLearningVelocity(studentProgress);
    const difficultyLevel = determineDifficultyLevel(studentProgress);
    const mandatoryRemaining = allLessons
      .filter(l => !completedLessons.includes(l.id) && isMandatory(l))
      .map(l => l.id);

    // 9. Criar/atualizar caminho
    const pathData = {
      student_email: studentEmail,
      module_id: moduleId,
      current_lesson_id: currentLesson?.id || null,
      recommended_next: top3,
      path_history: studentProgress
        .filter(p => p.completed)
        .map(p => ({
          lesson_id: p.lesson_id,
          completed_at: p.completion_date,
          score: p.quiz_score,
          difficulty_rating: p.engagement_score > 80 ? 'easy' : p.engagement_score > 50 ? 'medium' : 'hard',
          time_spent_minutes: p.time_spent_minutes
        })),
      learning_velocity: learningVelocity,
      current_difficulty_level: difficultyLevel,
      optimization_goal: user.optimization_goal || 'balanced',
      mandatory_lessons_remaining: mandatoryRemaining,
      last_recalculated: new Date().toISOString()
    };

    // 10. Salvar
    let savedPath;
    if (existingPath.length > 0) {
      savedPath = await base44.entities.AdaptivePath.update(existingPath[0].id, pathData);
    } else {
      savedPath = await base44.entities.AdaptivePath.create(pathData);
    }

    console.log('✅ Adaptive path generated. Top recommendation:', top3[0]?.lesson_id);
    
    return savedPath;

  } catch (error) {
    console.error('❌ Error generating adaptive path:', error);
    return null;
  }
}

/**
 * Calcula score de adequação de uma lição ao aluno
 */
async function scoreLessonFit(
  lesson,
  user,
  studentProgress,
  predictions,
  gaps,
  allLessons,
  completedLessons
) {
  let score = 0;
  const reasoning = [];
  let difficultyAdjustment = 'same';
  let varkMatch = false;
  let addressesGap = false;

  // Fator 1: Match VARK (peso: 25 pontos)
  if (user.vark_primary_style && lesson.vark_alignment) {
    if (lesson.vark_alignment.includes(user.vark_primary_style)) {
      score += 25;
      reasoning.push(`Alinhado com seu estilo ${user.vark_primary_style}`);
      varkMatch = true;
    } else {
      score += 5; // Bonus pequeno para diversidade
      reasoning.push('Expande seus estilos de aprendizado');
    }
  }

  // Fator 2: Predição de Dificuldade (peso: 30 pontos)
  const prediction = predictions.find(p => p.lesson_id === lesson.id);
  if (prediction) {
    if (prediction.prediction_score < 30) {
      score += 30;
      reasoning.push('Baixa probabilidade de dificuldade');
      difficultyAdjustment = 'easier';
    } else if (prediction.prediction_score < 60) {
      score += 20;
      reasoning.push('Dificuldade moderada prevista');
    } else {
      score += 5;
      reasoning.push('Alta dificuldade prevista - requer preparação');
      difficultyAdjustment = 'harder';
    }
  } else {
    score += 15; // Score neutro
  }

  // Fator 3: Endereça Gap de Conhecimento (peso: 20 pontos)
  const relatedGaps = gaps.filter(gap => 
    gap.related_lesson_id === lesson.id ||
    gap.subject === lesson.title
  );
  if (relatedGaps.length > 0) {
    score += 20;
    reasoning.push(`Preenche ${relatedGaps.length} lacuna(s) identificada(s)`);
    addressesGap = true;
  }

  // Fator 4: Sequência Natural (peso: 15 pontos)
  const lessonOrder = lesson.order || 0;
  const lastCompleted = studentProgress
    .filter(p => p.completed)
    .sort((a, b) => (b.lesson_order || 0) - (a.lesson_order || 0))[0];
  
  if (lastCompleted) {
    const lastOrder = allLessons.find(l => l.id === lastCompleted.lesson_id)?.order || 0;
    const gap = lessonOrder - lastOrder;
    
    if (gap === 1) {
      score += 15;
      reasoning.push('Próxima lição natural na sequência');
    } else if (gap <= 3) {
      score += 10;
      reasoning.push('Próximo grupo de conceitos');
    } else {
      score += 5;
    }
  }

  // Fator 5: Lição-Chave (peso: 10 pontos)
  const keyLessons = identifyKeyLessons(lesson.module_id);
  const isKey = keyLessons.find(kl => kl.lessonId === lesson.id);
  if (isKey && isKey.dependents > 2) {
    score += 10;
    reasoning.push(`Lição fundamental (${isKey.dependents} lições dependem dela)`);
  }

  return {
    lesson_id: lesson.id,
    priority_score: Math.round(score),
    reasoning: reasoning.join('; '),
    difficulty_adjustment: difficultyAdjustment,
    vark_match: varkMatch,
    addresses_gap: addressesGap
  };
}

/**
 * Encontra a lição atual do aluno
 */
function findCurrentLesson(studentProgress, allLessons) {
  // Última lição iniciada mas não completada
  const inProgress = studentProgress
    .filter(p => !p.completed && p.time_spent_minutes > 0)
    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))[0];
  
  if (inProgress) {
    return allLessons.find(l => l.id === inProgress.lesson_id);
  }
  
  // Se não tem em progresso, retorna primeira não completada
  const completed = studentProgress.filter(p => p.completed).map(p => p.lesson_id);
  return allLessons
    .filter(l => !completed.includes(l.id))
    .sort((a, b) => (a.order || 0) - (b.order || 0))[0];
}

/**
 * Calcula velocidade de aprendizado (lições/semana)
 */
function calculateLearningVelocity(studentProgress) {
  const completedWithDates = studentProgress
    .filter(p => p.completed && p.completion_date)
    .sort((a, b) => new Date(a.completion_date) - new Date(b.completion_date));
  
  if (completedWithDates.length < 2) return 0;
  
  const first = new Date(completedWithDates[0].completion_date);
  const last = new Date(completedWithDates[completedWithDates.length - 1].completion_date);
  const weeks = (last - first) / (1000 * 60 * 60 * 24 * 7);
  
  return weeks > 0 ? completedWithDates.length / weeks : 0;
}

/**
 * Determina nível de dificuldade atual
 */
function determineDifficultyLevel(studentProgress) {
  const recentProgress = studentProgress
    .filter(p => p.completed && p.quiz_score !== null)
    .sort((a, b) => new Date(b.completion_date) - new Date(a.completion_date))
    .slice(0, 5);
  
  if (recentProgress.length === 0) return 'at_grade';
  
  const avgScore = recentProgress.reduce((sum, p) => sum + p.quiz_score, 0) / recentProgress.length;
  
  if (avgScore >= 90) return 'above_grade';
  if (avgScore < 60) return 'below_grade';
  return 'at_grade';
}

/**
 * Verifica se lição é obrigatória
 */
function isMandatory(lesson) {
  // Por padrão, primeiras 12 lições são obrigatórias
  // Lições 13-16 são enriquecimento/opcional
  return (lesson.order || 999) <= 12;
}

/**
 * Recalcula caminho após completar lição
 */
export async function recalculatePathAfterLesson(studentEmail, moduleId, lessonId, outcome) {
  try {
    // Registrar outcome na predição (se existir)
    const predictions = await base44.entities.DifficultyPrediction.filter({
      student_email: studentEmail,
      lesson_id: lessonId
    });
    
    if (predictions.length > 0 && predictions[0].actual_outcome === null) {
      await base44.entities.DifficultyPrediction.update(predictions[0].id, {
        actual_outcome: {
          had_difficulty: outcome.quiz_score < 60,
          completion_time_minutes: outcome.time_spent_minutes,
          quiz_score: outcome.quiz_score,
          needed_help: outcome.needed_help || false
        },
        prediction_accuracy: predictions[0].prediction_score > 50 === (outcome.quiz_score < 60)
      });
    }

    // Gerar novo caminho
    await generateAdaptivePath(studentEmail, moduleId);
    
    console.log('✅ Path recalculated after lesson completion');

  } catch (error) {
    console.error('❌ Error recalculating path:', error);
  }
}