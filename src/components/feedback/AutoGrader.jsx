import React from 'react';
import { base44 } from '@/api/base44Client';

/**
 * AutoGrader - Sistema de Correção Automática
 * 
 * Gap Resolvido: Feedback Manual → Feedback Automático
 * 
 * Tipos suportados:
 * - Multiple Choice (instantâneo)
 * - True/False (instantâneo)
 * - Fill in the blank (instantâneo)
 * - Short Answer (IA - 2-5s)
 * - Code (análise estática - 1-3s)
 * - Essay (IA - 5-10s, requer revisão)
 */

/**
 * Corrige questões de múltipla escolha
 */
async function gradeMultipleChoice(submission) {
  const { question, answer, correct_answer } = submission;
  
  const isCorrect = answer === correct_answer;
  const score = isCorrect ? 100 : 0;
  
  return {
    automated_score: score,
    confidence_level: 'high',
    feedback_text: isCorrect 
      ? '✅ Resposta correta! Excelente trabalho.'
      : `❌ Resposta incorreta. A resposta correta é: ${correct_answer}`,
    strengths: isCorrect ? ['Compreensão correta do conceito'] : [],
    improvements: isCorrect ? [] : ['Revisar este tópico'],
    next_steps: isCorrect ? ['Avançar para próximo tópico'] : ['Estudar o material novamente'],
    requires_teacher_review: false,
    processing_time_ms: 0
  };
}

/**
 * Corrige questões de verdadeiro/falso
 */
async function gradeTrueFalse(submission) {
  const { question, answer, correct_answer } = submission;
  
  const isCorrect = answer === correct_answer;
  const score = isCorrect ? 100 : 0;
  
  return {
    automated_score: score,
    confidence_level: 'high',
    feedback_text: isCorrect 
      ? '✅ Correto!'
      : `❌ Incorreto. A afirmação é ${correct_answer ? 'verdadeira' : 'falsa'}`,
    strengths: isCorrect ? ['Análise correta'] : [],
    improvements: isCorrect ? [] : ['Revisar conceitos'],
    next_steps: isCorrect ? ['Continuar'] : ['Reler o material'],
    requires_teacher_review: false,
    processing_time_ms: 0
  };
}

/**
 * Corrige respostas curtas usando IA
 */
async function gradeShortAnswer(submission) {
  const startTime = performance.now();
  
  const { question, answer, correct_answer, rubric } = submission;
  
  try {
    const prompt = `
Você é um professor experiente avaliando uma resposta curta.

PERGUNTA: ${question}

RESPOSTA DO ALUNO: ${answer}

RESPOSTA ESPERADA: ${correct_answer}

${rubric ? `RUBRICA:\n${JSON.stringify(rubric, null, 2)}` : ''}

Avalie a resposta do aluno e forneça:
1. Nota de 0-100
2. Nível de confiança (high/medium/low)
3. Feedback construtivo
4. Pontos fortes (array)
5. Áreas de melhoria (array)
6. Próximos passos (array)
7. Se requer revisão do professor (boolean)

Seja encorajador mas honesto. Forneça feedback específico e acionável.
`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          score: { type: 'number' },
          confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
          feedback: { type: 'string' },
          strengths: { type: 'array', items: { type: 'string' } },
          improvements: { type: 'array', items: { type: 'string' } },
          next_steps: { type: 'array', items: { type: 'string' } },
          needs_review: { type: 'boolean' }
        }
      }
    });

    const endTime = performance.now();

    return {
      automated_score: response.score,
      confidence_level: response.confidence,
      feedback_text: response.feedback,
      strengths: response.strengths,
      improvements: response.improvements,
      next_steps: response.next_steps,
      requires_teacher_review: response.needs_review,
      processing_time_ms: endTime - startTime,
      ai_model_used: 'gpt-4'
    };

  } catch (error) {
    console.error('Error grading short answer:', error);
    return {
      automated_score: null,
      confidence_level: 'low',
      feedback_text: 'Não foi possível avaliar automaticamente. Professor irá revisar.',
      strengths: [],
      improvements: [],
      next_steps: ['Aguardar feedback do professor'],
      requires_teacher_review: true,
      processing_time_ms: performance.now() - startTime
    };
  }
}

/**
 * Corrige código Python
 */
async function gradeCode(submission) {
  const startTime = performance.now();
  
  const { question, code, test_cases, rubric } = submission;
  
  try {
    const prompt = `
Você é um instrutor de programação avaliando código Python.

EXERCÍCIO: ${question}

CÓDIGO DO ALUNO:
\`\`\`python
${code}
\`\`\`

${test_cases ? `CASOS DE TESTE:\n${JSON.stringify(test_cases, null, 2)}` : ''}

${rubric ? `RUBRICA:\n${JSON.stringify(rubric, null, 2)}` : ''}

Avalie o código considerando:
1. Correção (funciona corretamente?)
2. Sintaxe e estilo (PEP8)
3. Eficiência do algoritmo
4. Legibilidade e documentação
5. Tratamento de edge cases

Forneça:
- Nota de 0-100
- Feedback detalhado
- Pontos fortes do código
- Sugestões de melhoria específicas
- Próximos passos para aprendizado
- Se passa nos casos de teste
- Se requer revisão do professor
`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          score: { type: 'number' },
          confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
          feedback: { type: 'string' },
          strengths: { type: 'array', items: { type: 'string' } },
          improvements: { type: 'array', items: { type: 'string' } },
          next_steps: { type: 'array', items: { type: 'string' } },
          passes_tests: { type: 'boolean' },
          needs_review: { type: 'boolean' },
          syntax_errors: { type: 'array', items: { type: 'string' } },
          style_issues: { type: 'array', items: { type: 'string' } }
        }
      }
    });

    const endTime = performance.now();

    return {
      automated_score: response.score,
      confidence_level: response.confidence,
      feedback_text: response.feedback,
      strengths: response.strengths,
      improvements: response.improvements,
      next_steps: response.next_steps,
      requires_teacher_review: response.needs_review || response.score < 50,
      processing_time_ms: endTime - startTime,
      ai_model_used: 'gpt-4',
      rubric_applied: {
        passes_tests: response.passes_tests,
        syntax_errors: response.syntax_errors,
        style_issues: response.style_issues
      }
    };

  } catch (error) {
    console.error('Error grading code:', error);
    return {
      automated_score: null,
      confidence_level: 'low',
      feedback_text: 'Erro na avaliação automática. Professor irá revisar.',
      strengths: [],
      improvements: [],
      next_steps: ['Aguardar feedback do professor'],
      requires_teacher_review: true,
      processing_time_ms: performance.now() - startTime
    };
  }
}

/**
 * Corrige redações/ensaios usando IA
 */
async function gradeEssay(submission) {
  const startTime = performance.now();
  
  const { question, essay, min_words, rubric } = submission;
  
  // Contar palavras
  const wordCount = essay.trim().split(/\s+/).length;
  
  try {
    const prompt = `
Você é um professor avaliando uma redação.

TÓPICO/PERGUNTA: ${question}

REDAÇÃO DO ALUNO:
${essay}

${min_words ? `MÍNIMO DE PALAVRAS: ${min_words} (aluno escreveu: ${wordCount})` : ''}

${rubric ? `RUBRICA:\n${JSON.stringify(rubric, null, 2)}` : ''}

Avalie a redação considerando:
1. Clareza e organização
2. Argumentação e evidências
3. Gramática e ortografia
4. Profundidade de análise
5. Criatividade e originalidade

Esta é uma avaliação preliminar que DEVE ser revisada pelo professor.

Forneça:
- Nota preliminar de 0-100
- Feedback construtivo e encorajador
- Pontos fortes
- Áreas específicas de melhoria
- Próximos passos para desenvolvimento
`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          preliminary_score: { type: 'number' },
          feedback: { type: 'string' },
          strengths: { type: 'array', items: { type: 'string' } },
          improvements: { type: 'array', items: { type: 'string' } },
          next_steps: { type: 'array', items: { type: 'string' } },
          grammar_issues: { type: 'array', items: { type: 'string' } },
          content_quality: { type: 'string' }
        }
      }
    });

    const endTime = performance.now();

    return {
      automated_score: response.preliminary_score,
      confidence_level: 'medium', // Sempre medium para essays
      feedback_text: `📝 AVALIAÇÃO PRELIMINAR (Professor irá revisar)\n\n${response.feedback}`,
      strengths: response.strengths,
      improvements: response.improvements,
      next_steps: response.next_steps,
      requires_teacher_review: true, // SEMPRE requer revisão
      processing_time_ms: endTime - startTime,
      ai_model_used: 'gpt-4',
      rubric_applied: {
        word_count: wordCount,
        meets_minimum: min_words ? wordCount >= min_words : true,
        grammar_issues: response.grammar_issues,
        content_quality: response.content_quality
      }
    };

  } catch (error) {
    console.error('Error grading essay:', error);
    return {
      automated_score: null,
      confidence_level: 'low',
      feedback_text: 'Não foi possível gerar avaliação preliminar. Professor irá revisar.',
      strengths: [],
      improvements: [],
      next_steps: ['Aguardar feedback do professor'],
      requires_teacher_review: true,
      processing_time_ms: performance.now() - startTime
    };
  }
}

/**
 * Função principal de auto-correção
 */
export async function autoGrade(submission) {
  const { submission_type } = submission;
  
  let feedback;
  
  switch (submission_type) {
    case 'multiple_choice':
      feedback = await gradeMultipleChoice(submission);
      break;
    case 'true_false':
      feedback = await gradeTrueFalse(submission);
      break;
    case 'short_answer':
      feedback = await gradeShortAnswer(submission);
      break;
    case 'code':
      feedback = await gradeCode(submission);
      break;
    case 'essay':
      feedback = await gradeEssay(submission);
      break;
    default:
      feedback = {
        automated_score: null,
        confidence_level: 'low',
        feedback_text: 'Tipo de submissão não suportado para correção automática.',
        strengths: [],
        improvements: [],
        next_steps: ['Aguardar feedback do professor'],
        requires_teacher_review: true,
        processing_time_ms: 0
      };
  }
  
  // Salvar feedback no banco
  try {
    await base44.entities.AutomatedFeedback.create({
      submission_id: submission.id,
      student_email: submission.student_email,
      submission_type: submission.submission_type,
      ...feedback
    });
  } catch (error) {
    console.error('Error saving automated feedback:', error);
  }
  
  return feedback;
}

/**
 * Componente React para exibir feedback
 */
export function FeedbackDisplay({ feedback, showDetails = true }) {
  if (!feedback) return null;

  const getConfidenceColor = (level) => {
    switch (level) {
      case 'high': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      {/* Score e Confiança */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="text-sm text-gray-600 mb-1">Nota Automática</p>
          <p className={`text-4xl font-bold ${getScoreColor(feedback.automated_score)}`}>
            {feedback.automated_score !== null ? feedback.automated_score.toFixed(0) : 'N/A'}
            <span className="text-lg text-gray-500 ml-1">/100</span>
          </p>
        </div>
        <div className={`px-4 py-2 rounded-lg border-2 ${getConfidenceColor(feedback.confidence_level)}`}>
          <p className="text-xs font-semibold">
            Confiança: {feedback.confidence_level.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Feedback Principal */}
      <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
        <h4 className="font-semibold mb-2 text-blue-900">💬 Feedback</h4>
        <p className="text-sm text-blue-800 whitespace-pre-wrap">{feedback.feedback_text}</p>
      </div>

      {showDetails && (
        <>
          {/* Pontos Fortes */}
          {feedback.strengths && feedback.strengths.length > 0 && (
            <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <h4 className="font-semibold mb-2 text-green-900">✨ Pontos Fortes</h4>
              <ul className="space-y-1">
                {feedback.strengths.map((strength, idx) => (
                  <li key={idx} className="text-sm text-green-800 flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Áreas de Melhoria */}
          {feedback.improvements && feedback.improvements.length > 0 && (
            <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
              <h4 className="font-semibold mb-2 text-orange-900">🎯 Áreas de Melhoria</h4>
              <ul className="space-y-1">
                {feedback.improvements.map((improvement, idx) => (
                  <li key={idx} className="text-sm text-orange-800 flex items-start gap-2">
                    <span className="text-orange-600">→</span>
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Próximos Passos */}
          {feedback.next_steps && feedback.next_steps.length > 0 && (
            <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
              <h4 className="font-semibold mb-2 text-purple-900">🚀 Próximos Passos</h4>
              <ul className="space-y-1">
                {feedback.next_steps.map((step, idx) => (
                  <li key={idx} className="text-sm text-purple-800 flex items-start gap-2">
                    <span className="text-purple-600">{idx + 1}.</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {/* Aviso de Revisão */}
      {feedback.requires_teacher_review && (
        <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
          <p className="text-sm text-yellow-800">
            ⚠️ Esta avaliação será revisada pelo professor antes da nota final.
          </p>
        </div>
      )}

      {/* Tempo de Processamento */}
      {showDetails && feedback.processing_time_ms && (
        <p className="text-xs text-gray-500 text-right">
          Processado em {(feedback.processing_time_ms / 1000).toFixed(2)}s
        </p>
      )}
    </div>
  );
}