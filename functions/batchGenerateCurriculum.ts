import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!['administrador', 'coordenador_pedagogico'].includes(user.user_type)) {
      return Response.json({ error: 'Unauthorized - Admin only' }, { status: 403 });
    }

    const { 
      mode,  // 'module' | 'course' | 'all'
      course_id, 
      module_id,
      include_questions = true,
      start_lesson = 1,
      end_lesson = 16
    } = await req.json();

    console.log(`🚀 BATCH CURRICULUM GENERATION - Mode: ${mode}`);

    const results = {
      lessons_created: 0,
      lessons_failed: 0,
      questions_created: 0,
      errors: []
    };

    let modulesToProcess = [];

    // Determine which modules to process
    if (mode === 'all') {
      modulesToProcess = await base44.asServiceRole.entities.Module.list();
    } else if (mode === 'course') {
      modulesToProcess = await base44.asServiceRole.entities.Module.filter({ 
        course_id: course_id 
      });
    } else if (mode === 'module') {
      const modules = await base44.asServiceRole.entities.Module.filter({ id: module_id });
      modulesToProcess = modules;
    }

    console.log(`📚 Processing ${modulesToProcess.length} modules`);

    // Process each module
    for (const module of modulesToProcess) {
      console.log(`\n📖 Module: ${module.title} (${module.course_id})`);

      // Generate lessons for this module
      for (let lessonNum = start_lesson; lessonNum <= end_lesson; lessonNum++) {
        try {
          console.log(`  └─ Generating Lesson ${lessonNum}...`);

          // Check if lesson already exists
          const existing = await base44.asServiceRole.entities.Lesson.filter({
            module_id: module.id,
            order: lessonNum
          });

          if (existing.length > 0) {
            console.log(`  └─ ⏭️ Lesson ${lessonNum} already exists, skipping`);
            continue;
          }

          // Call the lesson generation function
          const lessonResponse = await base44.asServiceRole.functions.invoke('generateLessonContent', {
            module_id: module.id,
            course_id: module.course_id,
            lesson_number: lessonNum
          });

          if (lessonResponse.data.success) {
            results.lessons_created++;
            console.log(`  └─ ✅ Lesson ${lessonNum} created`);

            // Generate questions if requested
            if (include_questions) {
              try {
                const questionsResponse = await base44.asServiceRole.functions.invoke('generateQuestions', {
                  lesson_id: lessonResponse.data.lesson_id,
                  num_questions: 15
                });

                if (questionsResponse.data.success) {
                  results.questions_created += questionsResponse.data.questions_generated;
                  console.log(`  └─ ✅ ${questionsResponse.data.questions_generated} questions generated`);
                }
              } catch (qError) {
                console.error(`  └─ ⚠️ Questions failed: ${qError.message}`);
              }
            }

            // Rate limiting: wait 3 seconds between lessons
            await new Promise(resolve => setTimeout(resolve, 3000));

          } else {
            results.lessons_failed++;
            results.errors.push({
              module: module.title,
              lesson: lessonNum,
              error: lessonResponse.data.error || 'Unknown error'
            });
          }

        } catch (lessonError) {
          results.lessons_failed++;
          results.errors.push({
            module: module.title,
            lesson: lessonNum,
            error: lessonError.message
          });
          console.error(`  └─ ❌ Error: ${lessonError.message}`);
        }
      }
    }

    console.log(`\n✅ BATCH GENERATION COMPLETE`);
    console.log(`   Lessons Created: ${results.lessons_created}`);
    console.log(`   Lessons Failed: ${results.lessons_failed}`);
    console.log(`   Questions Created: ${results.questions_created}`);

    return Response.json({
      success: true,
      summary: results,
      message: `Batch generation complete. ${results.lessons_created} lessons and ${results.questions_created} questions created.`
    });

  } catch (error) {
    console.error('❌ Batch generation error:', error);
    return Response.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
});