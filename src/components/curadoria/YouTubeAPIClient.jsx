import { base44 } from "@/api/base44Client";

/**
 * YouTubeAPIClient - Cliente para buscar recursos educacionais do YouTube
 * 
 * CRITÉRIOS OBRIGATÓRIOS:
 * - Curiosity (6-8 anos): APENAS vídeos em PT-BR
 * - Discovery (9-11 anos): PT-BR preferencialmente, EN com legendas PT-BR OK
 * - Pioneer/Challenger: Multilíngue
 */

const SEARCH_TERMS_BY_LEVEL = {
  curiosity: {
    language: 'pt',
    region: 'BR',
    queries: [
      'programação para crianças',
      'scratch para crianças',
      'robótica infantil',
      'ciências para crianças',
      'matemática divertida',
      'experimentos científicos crianças',
      'aprender a programar',
      'tecnologia para crianças',
      'inteligência artificial crianças',
      'sustentabilidade infantil'
    ],
    max_duration: 600, // 10 minutos
    safe_search: 'strict'
  },
  discovery: {
    language: 'pt',
    region: 'BR',
    queries: [
      'python para iniciantes',
      'scratch avançado',
      'projetos com arduino',
      'aprender machine learning',
      'ciência de dados para jovens',
      'programação jogos scratch',
      'robótica educacional',
      'projetos de tecnologia',
      'inteligência artificial educação',
      'Khan Academy português'
    ],
    max_duration: 900, // 15 minutos
    safe_search: 'moderate'
  },
  pioneer: {
    language: 'pt',
    region: 'BR',
    queries: [
      'python machine learning',
      'tensorflow tutorial português',
      'deep learning iniciantes',
      'pytorch tutorial',
      'data science projetos',
      'kaggle tutorial português',
      'computer vision python',
      'nlp processamento linguagem',
      'inteligência artificial projetos',
      'machine learning na prática'
    ],
    max_duration: 1800, // 30 minutos
    safe_search: 'moderate',
    allow_english: true
  },
  challenger: {
    language: 'en',
    region: 'US',
    queries: [
      'advanced machine learning',
      'deep learning research',
      'reinforcement learning tutorial',
      'computer vision advanced',
      'nlp transformer models',
      'pytorch lightning tutorial',
      'MLOps best practices',
      'production machine learning',
      'AI research papers explained',
      'cutting edge AI techniques'
    ],
    max_duration: 3600, // 60 minutos
    safe_search: 'none',
    allow_english: true
  }
};

/**
 * Buscar vídeos educacionais no YouTube
 */
export async function searchYouTubeVideos(explorerLevel, topic = null, maxResults = 10) {
  try {
    const searchConfig = SEARCH_TERMS_BY_LEVEL[explorerLevel];
    
    if (!searchConfig) {
      throw new Error(`Invalid explorer level: ${explorerLevel}`);
    }

    const queries = topic ? [topic] : searchConfig.queries;
    const allVideos = [];

    for (const query of queries.slice(0, 3)) { // Limitar a 3 queries por busca
      // Construir query com filtros de idioma
      const searchQuery = `${query} ${searchConfig.language === 'pt' ? 'legendado português' : ''}`;
      
      // Usar integração InvokeLLM para buscar e validar
      const searchResult = await base44.integrations.Core.InvokeLLM({
        prompt: `Você é um curador de conteúdo educacional. Busque vídeos do YouTube sobre "${searchQuery}" que sejam:

NÍVEL: ${explorerLevel}
IDIOMA OBRIGATÓRIO: ${searchConfig.language === 'pt' ? 'Português Brasileiro (PT-BR)' : 'Inglês com legendas PT-BR disponíveis'}
IDADE: ${explorerLevel === 'curiosity' ? '6-8 anos' : explorerLevel === 'discovery' ? '9-11 anos' : explorerLevel === 'pioneer' ? '12-13 anos' : '14-16 anos'}
DURAÇÃO MÁXIMA: ${Math.floor(searchConfig.max_duration / 60)} minutos

CRITÉRIOS OBRIGATÓRIOS:
${explorerLevel === 'curiosity' ? `
- APENAS vídeos em Português Brasileiro (PT-BR)
- Linguagem simples e clara
- Visual e lúdico
- Conteúdo concreto (não abstrato)
- Canal educacional confiável
- Sem conceitos complexos
` : explorerLevel === 'discovery' ? `
- Preferencialmente PT-BR, inglês com legendas PT-BR OK
- Hands-on e prático
- Explicações passo a passo
- Projetos realizáveis
` : explorerLevel === 'pioneer' ? `
- PT-BR ou EN com legendas
- Conteúdo técnico permitido
- Projetos mais complexos
- Pode ter teoria + prática
` : `
- Inglês técnico OK
- Conteúdo avançado
- Papers e conceitos complexos
- Cutting-edge technology
`}

Retorne uma lista de 3-5 vídeos reais do YouTube que você conhece e que atendem TODOS os critérios acima.
Para cada vídeo, forneça: título, ID do vídeo, canal, duração em minutos, e justificativa de por que é adequado.`,
        response_json_schema: {
          type: "object",
          properties: {
            videos: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  video_id: { type: "string" },
                  title: { type: "string" },
                  channel: { type: "string" },
                  duration_minutes: { type: "number" },
                  language: { type: "string" },
                  has_ptbr_subtitles: { type: "boolean" },
                  is_age_appropriate: { type: "boolean" },
                  reasoning: { type: "string" },
                  educational_value: { type: "number" }
                }
              }
            }
          }
        },
        add_context_from_internet: true
      });

      if (searchResult.videos && searchResult.videos.length > 0) {
        // Validar cada vídeo antes de adicionar
        for (const video of searchResult.videos) {
          // Para Curiosity: APENAS PT-BR
          if (explorerLevel === 'curiosity' && video.language !== 'pt-BR') {
            console.log(`Rejeitado: ${video.title} - idioma ${video.language} não permitido para Curiosity`);
            continue;
          }

          // Validar duração
          if (video.duration_minutes > searchConfig.max_duration / 60) {
            console.log(`Rejeitado: ${video.title} - duração muito longa`);
            continue;
          }

          // Validar apropriação para idade
          if (!video.is_age_appropriate) {
            console.log(`Rejeitado: ${video.title} - não apropriado para idade`);
            continue;
          }

          allVideos.push({
            title: video.title,
            url: `https://www.youtube.com/watch?v=${video.video_id}`,
            source: 'youtube',
            type: 'video',
            language: video.language || 'pt-BR',
            target_level: explorerLevel,
            relevance_score: Math.min(Math.round(video.educational_value / 20), 3),
            description: video.reasoning,
            estimated_time_minutes: video.duration_minutes,
            vark_alignment: ['visual', 'auditory'],
            auto_discovered: true,
            curator_approved: false, // Requer aprovação
            requires_human_review: true,
            auto_quality_score: video.educational_value,
            quality_evaluation: {
              pedagogical_rigor: video.educational_value,
              accessibility: video.has_ptbr_subtitles ? 80 : 100,
              engagement: 75,
              justification: video.reasoning,
              recommended_for: [explorerLevel]
            }
          });
        }
      }
    }

    // Deduplicate por URL
    const uniqueVideos = [];
    const seenUrls = new Set();
    
    for (const video of allVideos) {
      if (!seenUrls.has(video.url)) {
        seenUrls.add(video.url);
        uniqueVideos.push(video);
      }
    }

    return uniqueVideos.slice(0, maxResults);

  } catch (error) {
    console.error('Error searching YouTube:', error);
    return [];
  }
}

/**
 * Validar se um vídeo do YouTube está disponível e é apropriado
 */
export async function validateYouTubeVideo(videoUrl, explorerLevel) {
  try {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      return { valid: false, reason: 'URL inválida' };
    }

    // Usar InvokeLLM para validar o vídeo
    const validation = await base44.integrations.Core.InvokeLLM({
      prompt: `Valide este vídeo do YouTube para uso educacional:

URL: ${videoUrl}
NÍVEL: ${explorerLevel}
IDADE: ${explorerLevel === 'curiosity' ? '6-8 anos' : explorerLevel === 'discovery' ? '9-11 anos' : explorerLevel === 'pioneer' ? '12-13 anos' : '14-16 anos'}

VALIDAÇÃO OBRIGATÓRIA:
${explorerLevel === 'curiosity' ? `
1. O vídeo ESTÁ em Português Brasileiro? (OBRIGATÓRIO)
2. Tem áudio dublado OU legendas em PT-BR? (OBRIGATÓRIO)
3. Linguagem simples e clara para 6-8 anos? (OBRIGATÓRIO)
4. Conteúdo visual e concreto? (OBRIGATÓRIO)
5. Duração apropriada (max 10 min)? (OBRIGATÓRIO)
6. Sem conceitos abstratos complexos? (OBRIGATÓRIO)
` : `
1. Idioma apropriado para o nível?
2. Conteúdo educacional de qualidade?
3. Apropriado para a idade?
4. Seguro e confiável?
`}

Retorne uma validação estruturada.`,
      response_json_schema: {
        type: "object",
        properties: {
          is_valid: { type: "boolean" },
          is_ptbr: { type: "boolean" },
          has_ptbr_audio_or_subtitles: { type: "boolean" },
          is_age_appropriate: { type: "boolean" },
          duration_minutes: { type: "number" },
          language_complexity: { type: "string" },
          issues: {
            type: "array",
            items: { type: "string" }
          },
          recommendation: { type: "string" }
        }
      },
      add_context_from_internet: true
    });

    // Para Curiosity: validação rigorosa
    if (explorerLevel === 'curiosity') {
      if (!validation.is_ptbr || !validation.has_ptbr_audio_or_subtitles) {
        return {
          valid: false,
          reason: 'Vídeo NÃO está em Português Brasileiro (obrigatório para Curiosity)',
          details: validation
        };
      }

      if (!validation.is_age_appropriate) {
        return {
          valid: false,
          reason: 'Conteúdo não apropriado para 6-8 anos',
          details: validation
        };
      }

      if (validation.duration_minutes && validation.duration_minutes > 15) {
        return {
          valid: false,
          reason: 'Vídeo muito longo para Curiosity (max 15 min)',
          details: validation
        };
      }
    }

    return {
      valid: validation.is_valid,
      reason: validation.recommendation,
      details: validation
    };

  } catch (error) {
    console.error('Error validating video:', error);
    return {
      valid: false,
      reason: 'Erro ao validar vídeo',
      error: error.message
    };
  }
}

/**
 * Extrair ID do vídeo de URL do YouTube
 */
function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

export default {
  searchYouTubeVideos,
  validateYouTubeVideo,
  extractVideoId
};