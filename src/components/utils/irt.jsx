/**
 * Item Response Theory (IRT) Utilities
 * 
 * Implementa algoritmos IRT para adaptive assessment
 */

/**
 * Calcula probabilidade de acerto usando modelo IRT 3PL
 * 
 * @param {number} theta - Habilidade do aluno (-3 a +3)
 * @param {number} difficulty - Dificuldade da questão (-3 a +3)
 * @param {number} discrimination - Discriminação (0 a 3)
 * @param {number} guessing - Probabilidade de chute (0 a 1)
 */
export function calculateProbability(theta, difficulty, discrimination = 1, guessing = 0.25) {
  const exponent = discrimination * (theta - difficulty);
  const probability = guessing + ((1 - guessing) / (1 + Math.exp(-exponent)));
  return probability;
}

/**
 * Estima habilidade do aluno baseado em respostas usando Maximum Likelihood
 * 
 * @param {Array} responses - Histórico de respostas com questões IRT
 */
export function calculateAbilityEstimate(responses) {
  if (responses.length === 0) return 0;

  // Método Newton-Raphson simplificado
  let theta = 0;
  const maxIterations = 10;
  const tolerance = 0.01;

  for (let iter = 0; iter < maxIterations; iter++) {
    let firstDerivative = 0;
    let secondDerivative = 0;

    responses.forEach(response => {
      const question = response.question;
      const correct = response.correct;
      
      const difficulty = question.irt_parameters?.difficulty || 0;
      const discrimination = question.irt_parameters?.discrimination || 1;
      const guessing = question.irt_parameters?.guessing || 0.25;

      const prob = calculateProbability(theta, difficulty, discrimination, guessing);
      
      // First derivative (likelihood)
      const factor = discrimination * (prob - guessing) / (1 - guessing);
      firstDerivative += correct ? factor * (1 - prob) / prob : -factor;

      // Second derivative (information)
      secondDerivative -= discrimination * discrimination * prob * (1 - prob);
    });

    // Newton-Raphson update
    const delta = firstDerivative / secondDerivative;
    theta -= delta;

    if (Math.abs(delta) < tolerance) break;
  }

  // Limitar entre -3 e +3
  return Math.max(-3, Math.min(3, theta));
}

/**
 * Seleciona próxima questão mais informativa para habilidade estimada
 * 
 * @param {Array} questions - Pool de questões disponíveis
 * @param {Array} responses - Questões já respondidas
 * @param {number} abilityEstimate - Habilidade atual estimada
 */
export function selectNextQuestion(questions, responses, abilityEstimate) {
  // Filtrar questões já respondidas
  const answeredIds = responses.map(r => r.question_id);
  const availableQuestions = questions.filter(q => !answeredIds.includes(q.id));

  if (availableQuestions.length === 0) return null;

  // Selecionar questão com maior informação (mais próxima da habilidade estimada)
  let bestQuestion = availableQuestions[0];
  let bestInformation = 0;

  availableQuestions.forEach(question => {
    const difficulty = question.irt_parameters?.difficulty || 0;
    const discrimination = question.irt_parameters?.discrimination || 1;
    const guessing = question.irt_parameters?.guessing || 0.25;

    const prob = calculateProbability(abilityEstimate, difficulty, discrimination, guessing);
    
    // Fisher Information
    const information = discrimination * discrimination * 
                       ((prob - guessing) * (1 - prob)) / 
                       ((1 - guessing) * (1 - guessing) * prob);

    if (information > bestInformation) {
      bestInformation = information;
      bestQuestion = question;
    }
  });

  return bestQuestion;
}

/**
 * Determina se deve continuar ou finalizar o quiz
 * 
 * @param {number} questionCount - Número de questões já respondidas
 * @param {number} abilityEstimate - Habilidade estimada atual
 * @param {number} previousAbility - Habilidade da iteração anterior
 */
export function shouldContinueQuiz(questionCount, abilityEstimate, previousAbility = null) {
  // Mínimo 5 questões
  if (questionCount < 5) return true;

  // Máximo 7 questões
  if (questionCount >= 7) return false;

  // Convergiu (mudança < 0.3 entre iterações)
  if (previousAbility !== null && Math.abs(abilityEstimate - previousAbility) < 0.3) {
    return false;
  }

  return true;
}