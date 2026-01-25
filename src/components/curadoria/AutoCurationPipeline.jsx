import { base44 } from '@/api/base44Client';
import { searchYouTubeVideos, calculateYouTubeQualityScore } from './YouTubeAPIClient';
import { evaluateResourceQuality, calculateVARKProfile, detectBias } from './LLMQualityScorer';

/**
 * Pipeline Completo de Curadoria Automática
 * Sprint 2 - MVP Funcional
 */

export async function runAutoCurationPipeline() {
  console.log('🚀 ========== PIPELINE DE CURADORIA AUTOMÁTICA ==========');
  console.log('Iniciando em:', new Date().toISOString());

  const results = {
    success: true,
    gaps_processed: 0,
    resources_discovered: 0,
    resources_saved: 0,
    auto_approved: 0,
    pending_review: 0,
    rejected: 0,
    errors: []
  };

  try {
    // ===========================
    // FASE 1: DETECTAR GAPS
    // ===========================
    console.log('\n📊 FASE 1: Detectando gaps de conteúdo...');
    
    const gaps = await detectContentGaps();
    results.gaps_processed = gaps.length;
    console.log(`✅ ${gaps.length} gaps identificados`);

    if (gaps.length === 0) {
      console.log('⚠️ Nenhum gap encontrado. Finalizando pipeline.');
      return results;
    }

    // ===========================
    // FASE 2: DESCOBRIR RECURSOS
    // ===========================
    console.log('\n🔍 FASE 2: Descobrindo recursos externos...');
    
    const discoveredResources = [];
    
    for (const gap of gaps.slice(0, 10)) { // Limitar a 10 gaps por execução
      console.log(`\n   Gap: ${gap.description} (${gap.explorer_level})`);
      
      // 2.1 Buscar no YouTube
      const youtubeVideos = await searchYouTubeVideos(
        gap.description,
        gap.explorer_level,
        5 // Top 5 por gap
      );
      
      console.log(`   ├─ YouTube: ${youtubeVideos.length} vídeos encontrados`);
      discoveredResources.push(...youtubeVideos.map(v => ({ ...v, source: 'youtube', gap_id: gap.id })));
      
      // 2.2 Buscar outros recursos (Khan Academy, Code.org, etc.) via LLM
      const webResources = await searchWebResources(gap);
      console.log(`   └─ Web: ${webResources.length} recursos encontrados`);
      discoveredResources.push(...webResources.map(r => ({ ...r, gap_id: gap.id })));
      
      // Delay para não sobrecarregar APIs
      await delay(1000);
    }
    
    results.resources_discovered = discoveredResources.length;
    console.log(`\n✅ Total descoberto: ${discoveredResources.length} recursos`);

    // ===========================
    // FASE 3: AVALIAR QUALIDADE
    // ===========================
    console.log('\n🧠 FASE 3: Avaliando qualidade com LLM...');
    
    const evaluatedResources = [];
    
    for (const resource of discoveredResources) {
      console.log(`\n   Avaliando: ${resource.title}`);
      
      try {
        // 3.1 Score de qualidade pedagógica
        const qualityEval = await evaluateResourceQuality(resource, {
          target_level: resource.explorer_level,
          learning_objectives: resource.learning_objectives
        });
        
        console.log(`   ├─ Qualidade: ${qualityEval.overall_score}/100`);
        
        // 3.2 Perfil VARK completo
        const varkProfile = await calculateVARKProfile(resource);
        console.log(`   ├─ VARK: V:${varkProfile.visual} A:${varkProfile.auditory} R:${varkProfile.read_write} K:${varkProfile.kinesthetic}`);
        
        // 3.3 Detectar viés
        const biasAnalysis = await detectBias(resource);
        console.log(`   ├─ Viés: Comercial(${biasAnalysis.commercial_bias}) Político(${biasAnalysis.political_bias})`);
        
        // 3.4 Score YouTube (se aplicável)
        let youtubeScore = null;
        if (resource.source === 'youtube' && resource.viewCount) {
          youtubeScore = calculateYouTubeQualityScore(resource);
          console.log(`   └─ YouTube Score: ${youtubeScore.score}/100`);
        }
        
        // Combinar todas avaliações
        const finalScore = calculateFinalScore(qualityEval, varkProfile, biasAnalysis, youtubeScore);
        
        evaluatedResources.push({
          ...resource,
          auto_quality_score: finalScore.score,
          quality_evaluation: qualityEval,
          vark_profile: varkProfile,
          bias_indicators: biasAnalysis,
          youtube_metrics: youtubeScore
        });
        
        // Delay para não sobrecarregar LLM
        await delay(2000);
        
      } catch (error) {
        console.error(`   ❌ Erro avaliando ${resource.title}:`, error.message);
        results.errors.push({ resource: resource.title, error: error.message });
      }
    }
    
    console.log(`\n✅ ${evaluatedResources.length} recursos avaliados`);

    // ===========================
    // FASE 4: SALVAR NO BANCO
    // ===========================
    console.log('\n💾 FASE 4: Salvando recursos...');
    
    for (const resource of evaluatedResources) {
      try {
        // Decidir se auto-aprova, requer revisão, ou rejeita
        const decision = makeApprovalDecision(resource);
        
        console.log(`\n   ${resource.title}`);
        console.log(`   ├─ Score: ${resource.auto_quality_score}/100`);
        console.log(`   └─ Decisão: ${decision.action}`);
        
        if (decision.action === 'reject') {
          results.rejected++;
          console.log(`      Motivo: ${decision.reason}`);
          continue; // Não salvar recursos rejeitados
        }
        
        // Salvar no banco
        await base44.entities.ExternalResource.create({
          title: resource.title,
          url: resource.url,
          source: resource.source,
          type: resource.type || 'video',
          description: resource.description || `Recurso descoberto automaticamente sobre: ${resource.gap_description}`,
          
          // Scoring
          auto_quality_score: resource.auto_quality_score,
          relevance_score: resource.auto_quality_score >= 80 ? 3 : resource.auto_quality_score >= 60 ? 2 : 1,
          quality_evaluation: resource.quality_evaluation,
          
          // VARK Profile
          vark_profile: resource.vark_profile,
          vark_alignment: getVARKAlignment(resource.vark_profile),
          primary_vark: resource.vark_profile.primary_style,
          
          // Metadados
          target_level: resource.explorer_level || 'discovery',
          subjects: resource.subjects || ['Inteligência Artificial'],
          keywords: resource.tags || [],
          estimated_time_minutes: resource.duration_minutes,
          language: resource.language || 'pt-BR',
          
          // Curadoria
          auto_discovered: true,
          curator_approved: decision.action === 'auto_approve',
          requires_human_review: decision.action === 'review',
          added_by: 'auto-curator',
          
          // Bias
          bias_indicators: resource.bias_indicators,
          
          // Gap addressed
          gap_addressed: {
            type: resource.gap_type,
            topic: resource.gap_description,
            detected_date: new Date().toISOString()
          }
        });
        
        results.resources_saved++;
        if (decision.action === 'auto_approve') results.auto_approved++;
        if (decision.action === 'review') results.pending_review++;
        
      } catch (error) {
        console.error(`❌ Erro salvando ${resource.title}:`, error.message);
        results.errors.push({ resource: resource.title, error: error.message });
      }
    }
    
    // ===========================
    // FASE 5: ATUALIZAR GAPS
    // ===========================
    console.log('\n📈 FASE 5: Atualizando status dos gaps...');
    
    for (const gap of gaps.slice(0, 10)) {
      const resourcesForGap = evaluatedResources.filter(r => r.gap_id === gap.id && r.auto_quality_score >= 60);
      
      if (resourcesForGap.length > 0) {
        await base44.entities.ContentGap.update(gap.id, {
          status: 'in_production',
          suggested_solution: `${resourcesForGap.length} recursos de qualidade descobertos automaticamente`
        });
        console.log(`   ✅ Gap "${gap.description}" atualizado: ${resourcesForGap.length} recursos`);
      }
    }

  } catch (error) {
    console.error('❌ ERRO CRÍTICO NO PIPELINE:', error);
    results.success = false;
    results.errors.push({ phase: 'general', error: error.message });
  }

  console.log('\n🏁 ========== PIPELINE FINALIZADO ==========');
  console.log('Resumo:');
  console.log(`   Gaps processados: ${results.gaps_processed}`);
  console.log(`   Recursos descobertos: ${results.resources_discovered}`);
  console.log(`   Recursos salvos: ${results.resources_saved}`);
  console.log(`   Auto-aprovados: ${results.auto_approved}`);
  console.log(`   Aguardando revisão: ${results.pending_review}`);
  console.log(`   Rejeitados: ${results.rejected}`);
  console.log(`   Erros: ${results.errors.length}`);
  
  return results;
}

// ===========================
// FUNÇÕES AUXILIARES
// ===========================

async function detectContentGaps() {
  // Buscar gaps não resolvidos ou em review
  const gaps = await base44.entities.ContentGap.filter({
    status: { $in: ['detected', 'in_review'] }
  }, '-priority_score', 20);
  
  return gaps;
}

async function searchWebResources(gap) {
  // Usar LLM para buscar recursos na web
  try {
    const searchPrompt = `
Busque recursos educacionais de alta qualidade na web para o seguinte gap de conteúdo:

**Gap:** ${gap.description}
**Nível:** ${gap.explorer_level}
**Disciplina:** ${gap.subject}

Encontre:
1. Tutoriais do Khan Academy sobre este tópico
2. Projetos do Code.org relacionados
3. Artigos educacionais de qualidade (Medium, Dev.to, blogs técnicos)
4. Simulações interativas (se existirem)

Para cada recurso, forneça:
- Título exato
- URL completa e verificável
- Tipo (tutorial, artigo, simulação, etc.)
- Breve descrição
- Por que é relevante para este gap

Retorne APENAS recursos que VOCÊ SABE que existem. Não invente URLs.
`;

    const webResults = await base44.integrations.Core.InvokeLLM({
      prompt: searchPrompt,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          resources: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                url: { type: "string" },
                type: { type: "string" },
                description: { type: "string" },
                source: { type: "string" }
              }
            }
          }
        }
      }
    });

    return webResults.resources.map(r => ({
      ...r,
      gap_description: gap.description,
      gap_type: gap.gap_type,
      explorer_level: gap.explorer_level
    }));

  } catch (error) {
    console.error('Error searching web resources:', error);
    return [];
  }
}

function calculateFinalScore(qualityEval, varkProfile, biasAnalysis, youtubeScore) {
  // Ponderação:
  // - Qualidade pedagógica: 50%
  // - VARK coverage: 20%
  // - Ausência de viés: 20%
  // - YouTube metrics: 10%
  
  let finalScore = qualityEval.overall_score * 0.5;
  
  // VARK coverage (quanto mais estilos atende, melhor)
  const varkCoverage = Object.values(varkProfile).filter(v => typeof v === 'number' && v >= 60).length;
  finalScore += (varkCoverage / 4) * 100 * 0.2;
  
  // Penalizar viés alto
  const maxBias = Math.max(
    biasAnalysis.commercial_bias || 0,
    biasAnalysis.political_bias || 0,
    biasAnalysis.representation_bias || 0
  );
  
  if (maxBias > 50) {
    finalScore *= 0.5; // Penalizar 50% se viés severo
  } else if (maxBias > 30) {
    finalScore *= 0.8; // Penalizar 20% se viés moderado
  }
  
  // Bonus YouTube metrics
  if (youtubeScore) {
    finalScore += youtubeScore.score * 0.1;
  }
  
  return {
    score: Math.min(Math.round(finalScore), 100),
    breakdown: {
      quality: qualityEval.overall_score,
      vark_coverage: varkCoverage,
      bias_penalty: maxBias,
      youtube_bonus: youtubeScore?.score || 0
    }
  };
}

function makeApprovalDecision(resource) {
  const score = resource.auto_quality_score;
  const biasAnalysis = resource.bias_indicators;
  
  // Rejeitar automaticamente se:
  // 1. Score < 60
  // 2. Viés severo (>50)
  // 3. Múltiplas concerns críticas
  
  const maxBias = Math.max(
    biasAnalysis.commercial_bias || 0,
    biasAnalysis.political_bias || 0
  );
  
  if (score < 60) {
    return { action: 'reject', reason: `Score muito baixo: ${score}/100` };
  }
  
  if (maxBias > 50) {
    return { action: 'reject', reason: `Viés excessivo detectado: ${maxBias}/100` };
  }
  
  if (resource.quality_evaluation?.concerns?.length >= 3) {
    return { action: 'reject', reason: 'Múltiplas preocupações críticas' };
  }
  
  // Auto-aprovar se score >= 75 e sem red flags
  if (score >= 75 && maxBias < 30) {
    return { action: 'auto_approve', reason: 'Alta qualidade, aprovação automática' };
  }
  
  // Caso contrário, requer revisão humana
  return { action: 'review', reason: 'Qualidade boa mas requer validação humana' };
}

function getVARKAlignment(varkProfile) {
  // Retornar estilos com score >= 60
  const alignment = [];
  if (varkProfile.visual >= 60) alignment.push('visual');
  if (varkProfile.auditory >= 60) alignment.push('auditory');
  if (varkProfile.read_write >= 60) alignment.push('read_write');
  if (varkProfile.kinesthetic >= 60) alignment.push('kinesthetic');
  
  return alignment.length > 0 ? alignment : ['multimodal'];
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}