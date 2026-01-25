import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!['administrador', 'coordenador_pedagogico', 'instrutor'].includes(user.user_type)) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { lesson_id, module_id, course_id, lesson_number, regenerate = false } = await req.json();

    console.log(`🎓 Generating lesson content for ${course_id}/${module_id}/lesson-${lesson_number}`);

    // Get existing lesson data
    const existingLesson = lesson_id 
      ? await base44.asServiceRole.entities.Lesson.filter({ id: lesson_id })
      : null;

    // Get module info for context
    const modules = await base44.asServiceRole.entities.Module.filter({ id: module_id });
    const module = modules[0];

    if (!module) {
      return Response.json({ error: 'Module not found' }, { status: 404 });
    }

    // Build comprehensive prompt with syllabus context
    const prompt = `You are an expert curriculum designer for InnovaLearn, an AI education platform for children in Brazil.

COURSE LEVEL: ${course_id.toUpperCase()} (${getLevelAge(course_id)})
MODULE: ${module.title} - Semester ${module.semester}
MODULE DESCRIPTION: ${module.description}
MODULE OBJECTIVES: ${module.objectives?.join(', ') || 'Not specified'}
LESSON NUMBER: ${lesson_number} of 16

CURRICULUM STRUCTURE:
- 18-week semester (16 lessons + 2 buffer weeks)
- 2-hour weekly sessions
- Project-based learning
- VARK-aligned (Visual, Auditory, Read/Write, Kinesthetic)
- Family involvement (FamilyWork)
- Challenge extension (ExtraMile)

LANGUAGE REQUIREMENTS:
${course_id === 'curiosity' ? '🇧🇷 CRITICAL: ALL content MUST be in Brazilian Portuguese (PT-BR). No exceptions.' : 
  course_id === 'discovery' ? '🇧🇷 Prefer PT-BR, English with subtitles acceptable' :
  '🌍 Multilingual content allowed'}

YOUR TASK:
Generate a COMPLETE lesson plan for Lesson ${lesson_number} that includes:

1. LESSON OVERVIEW
   - Title (engaging, age-appropriate)
   - Description (2-3 sentences)
   - Learning objectives (3-5 specific, measurable)
   - Duration: 120 minutes
   - Media type (video/interactive/mixed)
   - VARK alignment (which styles this lesson serves)
   - Transversal trails connection (sustainability, music, finance, etc.)
   - Soft skills developed

2. LESSON STRUCTURE (120 minutes total)
   - Abertura/Acolhimento (10-15 min): Welcome, emotional check-in
   - Ativação de Conhecimento (10-15 min): Review/activate prior knowledge
   - Exploração/Instrução (40-50 min): Main learning activity
   - Prática Guiada (20-30 min): Guided practice
   - Fechamento/Reflexão (10-15 min): Closing, reflection
   
3. RESOURCES (VARK-adapted)
   - Visual: Videos, diagrams, infographics (with URLs if possible)
   - Auditory: Podcasts, audio explanations
   - Read/Write: Articles, worksheets, coding exercises
   - Kinesthetic: Hands-on activities, movement-based learning

4. HOMEWORK (50 Innova Coins)
   - Title
   - Description (clear instructions)
   - Expected deliverable
   - Time estimate: 30-45 minutes
   - Resource URL (worksheet/activity)

5. FAMILYWORK (100 Innova Coins)
   - Title
   - Description (activity to do with family)
   - Materials needed
   - Instructions for parents
   - Family learning objective
   - Time estimate: 45-60 minutes

6. EXTRAMILE Challenge (200 Innova Coins)
   - Title
   - Description (advanced challenge)
   - Difficulty level
   - Prerequisites
   - Time estimate: 90+ minutes
   - Badge unlock name

7. ASSESSMENT
   - Formative assessment strategy
   - Quiz questions (3-5)
   - Portfolio items to collect
   - Success criteria

AGE-APPROPRIATE GUIDELINES:
${getAgeGuidelines(course_id)}

OUTPUT FORMAT: Return ONLY valid JSON matching the Lesson entity schema.`;

    // Call GPT-4
    const lessonData = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: prompt,
      response_json_schema: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          course_id: { type: "string" },
          module_id: { type: "string" },
          order: { type: "number" },
          media_type: { type: "string", enum: ["video", "text", "interactive", "quiz", "simulation", "audio", "mixed"] },
          vark_alignment: { 
            type: "array", 
            items: { type: "string", enum: ["visual", "auditory", "read_write", "kinesthetic"] }
          },
          duration_minutes: { type: "number" },
          resources: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                url: { type: "string" },
                type: { type: "string" },
                vark_style: { type: "string" }
              }
            }
          },
          learning_objectives: {
            type: "array",
            items: { type: "string" }
          },
          difficulty_level: { type: "string", enum: ["beginner", "intermediate", "advanced"] },
          transversal_trails: {
            type: "array",
            items: { type: "string" }
          },
          soft_skills: {
            type: "array",
            items: { type: "string" }
          },
          homework: {
            type: "object",
            properties: {
              titulo: { type: "string" },
              descricao: { type: "string" },
              tempo_estimado: { type: "number" },
              instrucoes: { type: "array", items: { type: "string" } },
              entregaveis: { type: "array", items: { type: "string" } },
              innova_coins_reward: { type: "number" }
            }
          },
          familywork: {
            type: "object",
            properties: {
              titulo: { type: "string" },
              descricao: { type: "string" },
              tempo_estimado: { type: "number" },
              materiais_necessarios: { type: "array", items: { type: "string" } },
              instrucoes_familia: { type: "string" },
              objetivo_familiar: { type: "string" },
              innova_coins_reward: { type: "number" }
            }
          },
          extramile: {
            type: "object",
            properties: {
              titulo: { type: "string" },
              descricao: { type: "string" },
              nivel_desafio: { type: "string", enum: ["medio", "dificil", "expert"] },
              tempo_estimado: { type: "number" },
              pre_requisitos: { type: "array", items: { type: "string" } },
              innova_coins_reward: { type: "number" },
              badge_unlock: { type: "string" }
            }
          }
        }
      }
    });

    // Create or update lesson
    let savedLesson;
    if (lesson_id && regenerate) {
      savedLesson = await base44.asServiceRole.entities.Lesson.update(lesson_id, {
        ...lessonData,
        course_id,
        module_id,
        order: lesson_number
      });
    } else {
      savedLesson = await base44.asServiceRole.entities.Lesson.create({
        ...lessonData,
        course_id,
        module_id,
        order: lesson_number
      });
    }

    console.log(`✅ Lesson created: ${savedLesson.id}`);

    return Response.json({
      success: true,
      lesson_id: savedLesson.id,
      lesson: savedLesson,
      message: `Lesson ${lesson_number} generated successfully`
    });

  } catch (error) {
    console.error('❌ Error generating lesson:', error);
    return Response.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
});

function getLevelAge(level) {
  const ages = {
    curiosity: '6-8 years',
    discovery: '9-11 years',
    pioneer: '12-13 years',
    challenger: '14-17 years'
  };
  return ages[level] || 'Unknown';
}

function getAgeGuidelines(level) {
  const guidelines = {
    curiosity: `- Use VERY simple language (6-8 year old vocabulary)
- Concrete, hands-on activities (no abstract concepts)
- Short attention span: vary activities every 10-15 minutes
- Movement breaks essential
- Heavy parental/family involvement
- Emotional safety critical
- Use stories, games, play-based learning
- ONLY Brazilian Portuguese content`,
    
    discovery: `- Age-appropriate complexity (9-11 years)
- Transitioning to abstract thinking (still need concrete examples)
- Can handle basic coding logic
- Project-based learning works well
- Peer collaboration important
- Prefer PT-BR, allow English with support
- Can work semi-independently with scaffolding`,
    
    pioneer: `- Pre-teen/early teen (12-13 years)
- Abstract thinking developed
- Can handle complex projects with guidance
- Strong peer learning and collaboration
- Self-directed learning emerging
- Multilingual content acceptable
- Need debugging support and scaffolding`,
    
    challenger: `- High school age (14-17 years)
- Advanced abstract reasoning
- Can manage complex, multi-week projects
- Prepare for university/career
- More independent work
- Professional skill development
- Multilingual fluency expected
- Focus on portfolio-building, not fantasy achievements`
  };
  
  return guidelines[level] || '';
}