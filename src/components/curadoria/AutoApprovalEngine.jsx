import { base44 } from '@/api/base44Client';
import { evaluateResourceQuality, calculateVARKProfile, detectBias } from './LLMQualityScorer';
import { validateURL, checkFreshness, validateLanguage } from './ResourceValidator';

/**
 * Motor de Aprovação Automática
 * Decide se recurso pode ser auto-aprovado ou precisa revisão humana
 */

const AUTO_APPROVAL_THRESHOLD = 75; // Score mínimo para auto-aprovar
const HUMAN_REVIEW_THRESHOLD = 60; // Abaixo disso, rejeitar automaticamente

/**
 * Processa recurso e decide aprovação
 */
export async function processResourceForApproval(resource, context = {}) {
  console.log(`⚙️ Processing resource for approval: ${resource.title}`);

  try {
    // 1. Validar URL
    const urlValidation = await validateURL(resource.url);
    if (!urlValidation.is_valid || !urlValidation.is_accessible) {
      return {
        decision: 'reject',
        reason: 'URL inválida ou inacessível',
        requires_human_review: false
      };
    }

    // 2. Avaliar qualidade pedagógica
    const qualityEval = await evaluateResourceQuality(resource, context);
    
    // 3. Calcular perfil VARK
    const varkProfile = await calculateVARKProfile(resource);

    // 4. Detectar vieses
    const biasAnalysis = await detectBias(resource);

    // 5. Verificar atualização
    const freshnessCheck = checkFreshness(resource.published_date);

    // 6. Validar idioma
    const langValidation = validateLanguage(
      resource.language || 'pt',
      context.target_level
    );

    // DECISÃO DE APROVAÇÃO
    const decision = makeApprovalDecision({
      qualityEval,
      varkProfile,
      biasAnalysis,
      urlValidation,
      freshnessCheck,
      langValidation
    });

    // Atualizar recurso com análise completa
    await saveResourceAnalysis(resource.id, {
      auto_quality_score: qualityEval.overall_score,
      pedagogical_rigor: qualityEval.pedagogical_rigor,
      accessibility_score: qualityEval.accessibility,
      engagement_score: qualityEval.engagement,
      depth_score: qualityEval.depth,
      reliability_score: qualityEval.reliability,
      vark_visual: varkProfile.visual,
      vark_auditory: varkProfile.auditory,
      vark_read_write: varkProfile.read_write,
      vark_kinesthetic: varkProfile.kinesthetic,
      vark_primary_style: varkProfile.primary_style,
      bias_commercial: biasAnalysis.commercial_bias,
      bias_political: biasAnalysis.political_bias,
      bias_representation: biasAnalysis.representation_bias,
      concerns: [...qualityEval.concerns, ...biasAnalysis.concerns],
      strengths: qualityEval.strengths,
      curator_approved: decision.decision === 'auto_approve',
      requires_human_review: decision.requires_human_review,
      rejection_reason: decision.reason,
      last_validation_date: new Date().toISOString()
    });

    console.log(`✅ Decision: ${decision.decision} (score: ${qualityEval.overall_score})`);
    return decision;

  } catch (error) {
    console.error('❌ Error processing resource:', error);
    return {
      decision: 'error',
      reason: 'Erro no processamento automático',
      requires_human_review: true,
      error: error.message
    };
  }
}

/**
 * Lógica de decisão de aprovação
 */
function makeApprovalDecision(analysis) {
  const {
    qualityEval,
    biasAnalysis,
    urlValidation,
    freshnessCheck,
    langValidation
  } = analysis;

  const concerns = [];
  const score = qualityEval.overall_score;

  // RED FLAGS que forçam revisão humana
  const redFlags = [];

  // 1. Viés severo
  if (biasAnalysis.commercial_bias > 50) {
    redFlags.push('Viés comercial severo detectado');
  }
  if (biasAnalysis.political_bias > 50) {
    redFlags.push('Viés político severo detectado');
  }

  // 2. URL suspeita
  if (!urlValidation.is_trusted_domain) {
    concerns.push('Domínio não está na lista de fontes confiáveis');
  }

  // 3. Conteúdo muito desatualizado
  if (!freshnessCheck.is_fresh) {
    concerns.push(`Conteúdo com ${freshnessCheck.age_months} meses (pode estar desatualizado)`);
  }

  // 4. Idioma inadequado
  if (!langValidation.is_acceptable) {
    redFlags.push('Idioma inadequado para público-alvo');
  }

  // DECISÃO
  if (redFlags.length > 0) {
    return {
      decision: 'require_review',
      requires_human_review: true,
      reason: `Red flags: ${redFlags.join('; ')}`,
      concerns,
      score
    };
  }

  if (score >= AUTO_APPROVAL_THRESHOLD && concerns.length === 0) {
    return {
      decision: 'auto_approve',
      requires_human_review: false,
      reason: `Score excelente (${score}/100) sem concerns`,
      concerns: [],
      score
    };
  }

  if (score >= HUMAN_REVIEW_THRESHOLD) {
    return {
      decision: 'require_review',
      requires_human_review: true,
      reason: `Score bom (${score}/100) mas requer validação humana`,
      concerns,
      score
    };
  }

  // Score < 60 = rejeitar
  return {
    decision: 'reject',
    requires_human_review: false,
    reason: `Score insuficiente (${score}/100)`,
    concerns,
    score
  };
}

/**
 * Salva análise no banco
 */
async function saveResourceAnalysis(resourceId, analysis) {
  try {
    await base44.entities.ExternalResource.update(resourceId, analysis);
    console.log(`💾 Analysis saved for resource: ${resourceId}`);
  } catch (error) {
    console.error('Error saving analysis:', error);
  }
}

/**
 * Batch processing de múltiplos recursos
 */
export async function batchProcessResources(resources, context = {}) {
  console.log(`🔄 Batch processing ${resources.length} resources...`);

  const results = {
    auto_approved: 0,
    require_review: 0,
    rejected: 0,
    errors: 0
  };

  for (const resource of resources) {
    try {
      const decision = await processResourceForApproval(resource, context);
      
      if (decision.decision === 'auto_approve') results.auto_approved++;
      else if (decision.decision === 'require_review') results.require_review++;
      else if (decision.decision === 'reject') results.rejected++;
      else results.errors++;

      // Delay para não sobrecarregar API
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`Error processing ${resource.title}:`, error);
      results.errors++;
    }
  }

  console.log(`✅ Batch complete:`, results);
  return results;
}

export default {
  processResourceForApproval,
  batchProcessResources
};