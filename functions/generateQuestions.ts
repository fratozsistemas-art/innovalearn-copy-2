import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!['administrador', 'coordenador_pedagogico', 'instrutor'].includes(user.user_type)) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { lesson_id, num_questions = 20, difficulty_mix = true } = await req.json();

    console.log(`❓ Generating ${num_questions} questions for lesson ${lesson_id}`);

    // Get lesson
    const lessons = await base44.asServiceRole.entities.Lesson.filter({ id: lesson_id });
    const lesson = lessons[0];

    if (!lesson) {
      return Response.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Get module for context
    const modules = await base44.asServiceRole.entities.Module.filter({ id: lesson.module_id });
    const module = modules[0];

    const prompt = `You are a test designer for InnovaLearn educational platform.

LESSON CONTEXT:
Course: ${lesson.course_id.toUpperCase()}
Module: ${module?.title || 'Unknown'}
Lesson: ${lesson.title}
Description: ${lesson.description}
Learning Objectives: ${lesson.learning_objectives?.join(', ') || 'Not specified'}

TASK: Generate ${num_questions} assessment questions that:
1. Test understanding of learning objectives
2. Are age-appropriate for ${lesson.course_id} level
3. Mix difficulty levels (30% easy, 50% medium, 20% hard)
4. Cover different question types
5. Align with VARK styles when possible
6. Use Brazilian Portuguese for Curiosity level

QUESTION TYPES TO USE:
- multiple_choice (60%)
- true_false (15%)
- short_answer (15%)
- code (10% - for technical lessons)

AGE-APPROPRIATE LANGUAGE:
${lesson.course_id === 'curiosity' ? '- Simple vocabulary (6-8 years)\n- Short sentences\n- Concrete examples\n- No abstract concepts' :
  lesson.course_id === 'discovery' ? '- Clear, direct language (9-11 years)\n- Basic technical terms OK\n- Concrete + some abstract' :
  lesson.course_id === 'pioneer' ? '- Technical terminology (12-13 years)\n- Abstract concepts OK\n- Problem-solving focus' :
  '- Professional language (14-17 years)\n- Advanced concepts\n- Critical thinking required'}

Each question must include:
- Clear question text
- Correct answer / options
- Explanation of correct answer
- VARK alignment
- Difficulty level
- Relevant concept/topic

OUTPUT: JSON array of questions`;

    const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: prompt,
      response_json_schema: {
        type: "object",
        properties: {
          questions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                concept: { type: "string" },
                question_text: { type: "string" },
                question_type: { 
                  type: "string", 
                  enum: ["multiple_choice", "true_false", "short_answer", "code"]
                },
                options: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      text: { type: "string" },
                      is_correct: { type: "boolean" }
                    }
                  }
                },
                correct_answer: { type: "string" },
                explanation: { type: "string" },
                difficulty_level: { 
                  type: "string", 
                  enum: ["easy", "medium", "hard"]
                },
                vark_alignment: {
                  type: "array",
                  items: { 
                    type: "string",
                    enum: ["visual", "auditory", "read_write", "kinesthetic"]
                  }
                }
              }
            }
          }
        }
      }
    });

    // Save all questions to QuestionBank
    const savedQuestions = [];
    for (const question of response.questions) {
      const saved = await base44.asServiceRole.entities.QuestionBank.create({
        ...question,
        explorer_level: lesson.course_id,
        module_id: lesson.module_id,
        lesson_id: lesson.id,
        ai_generated: true,
        ai_model_used: 'gpt-4',
        ai_generation_prompt: prompt.substring(0, 500),
        human_reviewed: false,
        times_used: 0,
        times_correct: 0,
        language: lesson.course_id === 'curiosity' ? 'pt-BR' : 'pt-BR',
        tags: lesson.learning_objectives || []
      });
      savedQuestions.push(saved);
    }

    console.log(`✅ Generated ${savedQuestions.length} questions`);

    return Response.json({
      success: true,
      questions_generated: savedQuestions.length,
      questions: savedQuestions,
      message: `${savedQuestions.length} questions created for ${lesson.title}`
    });

  } catch (error) {
    console.error('❌ Error generating questions:', error);
    return Response.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
});