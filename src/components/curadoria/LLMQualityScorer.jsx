import { base44 } from '@/api/base44Client';

/**
 * Sistema de Avaliação de Qualidade via LLM
 * Princípio CAIO: Avaliar objetivamente sem viés de origem
 */

/**
 * Avalia qualidade pedagógica de um recurso usando IA
 */
export async function evaluateResourceQuality(resource, context = {}) {
  console.log(`🧠 Evaluating quality of: ${resource.title}`);
  
  try {
    const evaluationPrompt = buildEvaluationPrompt(resource, context);
    
    const evaluation = await base44.integrations.Core.InvokeLLM({
      prompt: evaluationPrompt,
      response_json_schema: {
        type: "object",
        properties: {
          pedagogical_rigor: { type: "number" },
          accessibility: { type: "number" },
          engagement: { type: "number" },
          depth: { type: "number" },
          reliability: { type: "number" },
          overall_score: { type: "number" },
          justification: { type: "string" },
          recommended_for: {
            type: "array",
            items: { type: "string" }
          },
          concerns: {
            type: "array",
            items: { type: "string" }
          },
          strengths: {
            type: "array",
            items: { type: "string" }
          }
        }
      }
    });

    console.log(`✅ Quality evaluation: ${evaluation.overall_score}/100`);
    return evaluation;

  } catch (error) {
    console.error('❌ Error evaluating quality:', error);
    return getFallbackEvaluation();
  }
}

function buildEvaluationPrompt(resource, context) {
  return `
Você é um curador pedagógico especializado em educação de IA para crianças e jovens.

PRINCÍPIO: Não há viés de origem. YouTube pode ser melhor que MIT se ensinar melhor.

RECURSO:
- Título: ${resource.title}
- Tipo: ${resource.type || 'desconhecido'}
- Fonte: ${resource.source || 'desconhecida'}
- Descrição: ${resource.description || 'N/A'}
- URL: ${resource.url}

CONTEXTO:
- Nível: ${context.target_level || 'não especificado'}
- Objetivos: ${context.learning_objectives?.join(', ') || 'não especificados'}

CRITÉRIOS (0-100 cada):

1. Rigor Pedagógico: Conteúdo correto, estruturado, exemplos claros?
2. Acessibilidade: Linguagem apropriada, legendas, clareza?
3. Engajamento: Mantém atenção, elementos visuais, storytelling?
4. Profundidade: Vai além do superficial, explica "porquê"?
5. Confiabilidade: Fonte respeitada, informações atualizadas, sem erros?

INSTRUÇÕES:
- Seja OBJETIVO. Não favoreça "acadêmicos" automaticamente.
- Overall score = média ponderada: Rigor(30%) + Access(20%) + Engage(20%) + Depth(20%) + Reliability(10%)
- Score >= 75: Excelente, pode auto-aprovar
- Score 60-74: Bom, requer revisão
- Score < 60: Inadequado

Retorne avaliação HONESTA.
`;
}

export async function calculateVARKProfile(resource) {
  console.log(`🎨 Calculating VARK profile: ${resource.title}`);

  try {
    const varkPrompt = `
Analise este recurso e determine scores VARK (0-100 cada):

RECURSO:
- Título: ${resource.title}
- Tipo: ${resource.type || 'desconhecido'}
- Descrição: ${resource.description || 'N/A'}

ESTILOS:
1. Visual (V): Gráficos, diagramas, animações, infográficos?
2. Auditivo (A): Narração, explicações verbais, áudio claro?
3. Leitura/Escrita (R): Textos, artigos, notas, documentação?
4. Cinestésico (K): Hands-on, experimentos, interação, prática?

IMPORTANTE:
- Recurso pode ter scores altos em MÚLTIPLAS dimensões.
- Vídeo tutorial = Visual (80) + Auditivo (75) + Cinestésico (70)
- Primary style = score mais alto (ou multimodal se vários >= 70)

Retorne scores objetivos.
`;

    const varkAnalysis = await base44.integrations.Core.InvokeLLM({
      prompt: varkPrompt,
      response_json_schema: {
        type: "object",
        properties: {
          visual: { type: "number" },
          auditory: { type: "number" },
          read_write: { type: "number" },
          kinesthetic: { type: "number" },
          reasoning: { type: "string" },
          primary_style: {
            type: "string",
            enum: ["visual", "auditory", "read_write", "kinesthetic", "multimodal"]
          }
        }
      }
    });

    console.log(`✅ VARK: V:${varkAnalysis.visual} A:${varkAnalysis.auditory} R:${varkAnalysis.read_write} K:${varkAnalysis.kinesthetic}`);
    return varkAnalysis;

  } catch (error) {
    console.error('❌ Error calculating VARK:', error);
    return getFallbackVARKProfile(resource.type);
  }
}

export async function detectBias(resource) {
  console.log(`🔍 Detecting bias: ${resource.title}`);

  try {
    const biasPrompt = `
Analise vieses neste recurso educacional:

RECURSO: ${resource.title}
Tipo: ${resource.type}
Fonte: ${resource.source}

TIPOS DE VIÉS (0-100 cada):

1. Comercial: Promove produtos/serviços? Product placement? Sponsored content disfarçado?
2. Político: Favorece ideologia? Linguagem polarizadora? Unilateral?
3. Representação: Falta diversidade? Estereótipos? Perspectiva limitada (só EUA/Europa)?
4. Simplificação: Simplifica demais? Omite nuances? Gera misconceptions?

SCORES:
- 0-20: Viés mínimo/aceitável
- 21-50: Viés moderado, alerta
- 51-100: Viés severo, rejeitar

Se qualquer score > 50, recurso deve ser rejeitado ou ter disclaimer forte.
`;

    const biasAnalysis = await base44.integrations.Core.InvokeLLM({
      prompt: biasPrompt,
      response_json_schema: {
        type: "object",
        properties: {
          commercial_bias: { type: "number" },
          political_bias: { type: "number" },
          representation_bias: { type: "number" },
          simplification_bias: { type: "number" },
          concerns: {
            type: "array",
            items: { type: "string" }
          },
          requires_disclaimer: { type: "boolean" }
        }
      }
    });

    console.log(`✅ Bias: Commercial(${biasAnalysis.commercial_bias}) Political(${biasAnalysis.political_bias})`);
    return biasAnalysis;

  } catch (error) {
    console.error('❌ Error detecting bias:', error);
    return {
      commercial_bias: 0,
      political_bias: 0,
      representation_bias: 0,
      simplification_bias: 0,
      concerns: [],
      requires_disclaimer: false
    };
  }
}

function getFallbackEvaluation() {
  return {
    pedagogical_rigor: 50,
    accessibility: 50,
    engagement: 50,
    depth: 50,
    reliability: 50,
    overall_score: 50,
    justification: "Avaliação automática falhou. Revisão manual necessária.",
    recommended_for: [],
    concerns: ["Sistema de avaliação indisponível"],
    strengths: []
  };
}

function getFallbackVARKProfile(type) {
  const profiles = {
    video: { visual: 80, auditory: 70, read_write: 20, kinesthetic: 30, primary_style: "visual", reasoning: "Heurística: vídeo" },
    tutorial: { visual: 60, auditory: 50, read_write: 40, kinesthetic: 80, primary_style: "kinesthetic", reasoning: "Heurística: tutorial" },
    article: { visual: 30, auditory: 10, read_write: 90, kinesthetic: 20, primary_style: "read_write", reasoning: "Heurística: artigo" },
    simulation: { visual: 70, auditory: 30, read_write: 30, kinesthetic: 90, primary_style: "kinesthetic", reasoning: "Heurística: simulação" }
  };

  return profiles[type] || {
    visual: 50,
    auditory: 50,
    read_write: 50,
    kinesthetic: 50,
    primary_style: "multimodal",
    reasoning: "Heurística padrão"
  };
}

export default {
  evaluateResourceQuality,
  calculateVARKProfile,
  detectBias
};