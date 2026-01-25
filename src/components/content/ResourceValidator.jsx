import { base44 } from '@/api/base44Client';

/**
 * Valida e corrige URLs de recursos usando busca real na internet
 * Substitui URLs fictícias por recursos reais e testados
 */

export async function validateAndFixLessonResources(lesson, module) {
  console.log(`🔍 Validando recursos: ${lesson.title}`);
  
  const searchPrompt = `
Você é um curador de conteúdo educacional especializado em IA para crianças/jovens.

LIÇÃO PARA VALIDAR:
- Título: ${lesson.title}
- Descrição: ${lesson.description}
- Nível: ${lesson.course_id} (${
  lesson.course_id === 'curiosity' ? '6+ anos - Educação Infantil' :
  lesson.course_id === 'discovery' ? '9+ anos - Fundamental II' :
  lesson.course_id === 'pioneer' ? '12+ anos - Ensino Médio' :
  '14+ anos - Ensino Médio Avançado'
})
- Objetivos: ${lesson.learning_objectives?.join(', ') || 'N/A'}
- Tipo de mídia principal: ${lesson.media_type}

TAREFA CRÍTICA:
Encontre recursos REAIS, TESTADOS e de ALTA QUALIDADE na internet que:

1. **VÍDEOS EDUCACIONAIS (Visual + Auditory)**
   - YouTube de canais confiáveis: Khan Academy, Code.org, CrashCourse, 3Blue1Brown, Computerphile
   - Duração: 5-15 minutos (não documentários longos)
   - Português ou Inglês com legendas
   - URL completa e verificável

2. **FERRAMENTAS INTERATIVAS (Kinesthetic)**
   - Plataformas gratuitas: Scratch, Teachable Machine, Google Colab, Streamlit
   - Simuladores, games, code editors
   - Sem necessidade de cadastro/pagamento

3. **TUTORIAIS E DOCUMENTAÇÃO (Read/Write)**
   - Artigos de qualidade: Medium, Towards Data Science, documentação oficial
   - PDFs de fontes confiáveis: universidades, instituições
   - Guias passo-a-passo

4. **DATASETS E PLATAFORMAS (Kinesthetic/Read)**
   - Dados reais: INMET, IBGE, Kaggle, Google Dataset Search
   - APIs públicas documentadas
   - GitHub repositories com stars 100+

CRITÉRIOS DE QUALIDADE:
✅ URL deve estar ativa (não 404)
✅ Conteúdo apropriado para idade (COPPA compliant se < 13 anos)
✅ Gratuito ou freemium
✅ Português quando possível, Inglês aceitável
✅ Atualizado (publicado nos últimos 3 anos se vídeo/artigo)

IMPORTANTE:
- NÃO invente URLs
- NÃO use "cdn.innova.com" ou URLs fictícias
- Prefira fontes oficiais (YouTube oficial, sites .edu, .gov, .org)
- Para cada recurso, CONFIRME que o link existe usando seu conhecimento da web

Retorne APENAS recursos que você tem CERTEZA que existem e funcionam.
`;

  try {
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: searchPrompt,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          content_url: {
            type: "object",
            properties: {
              url: { type: "string" },
              title: { type: "string" },
              verified: { type: "boolean" },
              notes: { type: "string" }
            }
          },
          resources: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                url: { type: "string" },
                type: { type: "string" },
                vark_style: { type: "string" },
                description: { type: "string" },
                quality_score: { type: "number" },
                verified: { type: "boolean" },
                language: { type: "string" },
                duration_minutes: { type: "number" }
              }
            }
          },
          homework_resource_url: {
            type: "object",
            properties: {
              url: { type: "string" },
              verified: { type: "boolean" }
            }
          },
          familywork_resource_url: {
            type: "object",
            properties: {
              url: { type: "string" },
              verified: { type: "boolean" }
            }
          },
          extramile_resource_url: {
            type: "object",
            properties: {
              url: { type: "string" },
              verified: { type: "boolean" }
            }
          }
        }
      }
    });

    return {
      success: true,
      validated_data: result,
      original_lesson: lesson
    };

  } catch (error) {
    console.error(`❌ Erro ao validar recursos de ${lesson.title}:`, error);
    return {
      success: false,
      error: error.message,
      original_lesson: lesson
    };
  }
}

/**
 * Atualiza lição com recursos validados
 */
export async function updateLessonWithValidatedResources(lessonId, validatedData) {
  try {
    const updatePayload = {};

    // Atualizar content_url se verificado
    if (validatedData.content_url && validatedData.content_url.verified && validatedData.content_url.url) {
      updatePayload.content_url = validatedData.content_url.url;
    }

    // Atualizar resources array
    if (validatedData.resources && validatedData.resources.length > 0) {
      const verifiedResources = validatedData.resources
        .filter(r => r.verified)
        .map(r => ({
          title: r.title,
          url: r.url,
          type: r.type,
          vark_style: r.vark_style
        }));

      if (verifiedResources.length > 0) {
        updatePayload.resources = verifiedResources;
      }
    }

    if (Object.keys(updatePayload).length > 0) {
      await base44.entities.Lesson.update(lessonId, updatePayload);
      return { success: true, updates: Object.keys(updatePayload).length };
    }

    return { success: true, updates: 0 };

  } catch (error) {
    console.error(`❌ Erro ao atualizar lição ${lessonId}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Processa batch de lições
 */
export async function validateLessonBatch(lessons, module, onProgress) {
  const results = {
    total: lessons.length,
    validated: 0,
    updated: 0,
    failed: 0,
    errors: []
  };

  for (let i = 0; i < lessons.length; i++) {
    const lesson = lessons[i];
    
    if (onProgress) {
      onProgress({
        current: i + 1,
        total: lessons.length,
        currentLesson: lesson.title,
        status: 'validating'
      });
    }

    try {
      // Validar recursos
      const validation = await validateAndFixLessonResources(lesson, module);
      
      if (validation.success) {
        results.validated++;
        
        // Atualizar lição com recursos validados
        const update = await updateLessonWithValidatedResources(
          lesson.id,
          validation.validated_data
        );
        
        if (update.success) {
          results.updated++;
          if (onProgress) {
            onProgress({
              current: i + 1,
              total: lessons.length,
              currentLesson: lesson.title,
              status: 'updated',
              updates: update.updates
            });
          }
        }
      } else {
        results.failed++;
        results.errors.push({
          lesson_id: lesson.id,
          lesson_title: lesson.title,
          error: validation.error
        });
      }

      // Delay para não sobrecarregar API
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      results.failed++;
      results.errors.push({
        lesson_id: lesson.id,
        lesson_title: lesson.title,
        error: error.message
      });
    }
  }

  return results;
}