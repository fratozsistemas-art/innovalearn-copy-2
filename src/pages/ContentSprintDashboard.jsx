import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Zap, 
  BookOpen, 
  Brain, 
  CheckCircle2, 
  AlertCircle,
  Play,
  Sparkles,
  FileText,
  Loader,
  TrendingUp
} from "lucide-react";
import { useCurrentUser } from "@/components/hooks/useUser";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ContentSprintDashboard() {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();
  
  const [batchConfig, setBatchConfig] = useState({
    mode: 'module',
    course_id: 'curiosity',
    module_id: '',
    include_questions: true,
    start_lesson: 1,
    end_lesson: 16
  });

  const [singleLessonConfig, setSingleLessonConfig] = useState({
    module_id: '',
    course_id: 'curiosity',
    lesson_number: 1
  });

  const [batchStatus, setBatchStatus] = useState(null);

  // Fetch modules
  const { data: modules = [] } = useQuery({
    queryKey: ['modules'],
    queryFn: async () => await base44.entities.Module.list()
  });

  // Fetch lessons
  const { data: lessons = [] } = useQuery({
    queryKey: ['lessons'],
    queryFn: async () => await base44.entities.Lesson.list()
  });

  // Fetch questions
  const { data: questions = [] } = useQuery({
    queryKey: ['questions'],
    queryFn: async () => await base44.entities.QuestionBank.list()
  });

  // Calculate completion stats
  const totalLessonsNeeded = modules.length * 16; // 16 lessons per module
  const lessonsCreated = lessons.length;
  const completionRate = totalLessonsNeeded > 0 
    ? Math.round((lessonsCreated / totalLessonsNeeded) * 100) 
    : 0;

  const lessonsByModule = modules.map(m => ({
    module: m,
    lessons: lessons.filter(l => l.module_id === m.id).length,
    needed: 16
  }));

  // Single lesson generation
  const generateLessonMutation = useMutation({
    mutationFn: async (config) => {
      const response = await base44.functions.invoke('generateLessonContent', config);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    }
  });

  // Single question batch generation
  const generateQuestionsMutation = useMutation({
    mutationFn: async ({ lesson_id, num_questions }) => {
      const response = await base44.functions.invoke('generateQuestions', {
        lesson_id,
        num_questions
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    }
  });

  // Batch generation
  const batchGenerateMutation = useMutation({
    mutationFn: async (config) => {
      const response = await base44.functions.invoke('batchGenerateCurriculum', config);
      return response.data;
    },
    onSuccess: (data) => {
      setBatchStatus(data.summary);
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    }
  });

  const handleSingleLessonGenerate = async () => {
    if (!singleLessonConfig.module_id) {
      alert('Select a module first');
      return;
    }
    await generateLessonMutation.mutateAsync(singleLessonConfig);
  };

  const handleBatchGenerate = async () => {
    if (batchConfig.mode === 'module' && !batchConfig.module_id) {
      alert('Select a module for single module generation');
      return;
    }
    if (batchConfig.mode === 'course' && !batchConfig.course_id) {
      alert('Select a course');
      return;
    }

    const confirmed = confirm(
      `This will generate ${
        batchConfig.mode === 'all' ? 'ALL LESSONS (272)' :
        batchConfig.mode === 'course' ? `all lessons for ${batchConfig.course_id}` :
        `lessons ${batchConfig.start_lesson}-${batchConfig.end_lesson} for selected module`
      }. Continue?`
    );

    if (confirmed) {
      await batchGenerateMutation.mutateAsync(batchConfig);
    }
  };

  if (!['administrador', 'coordenador_pedagogico'].includes(user?.user_type)) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-gray-600">Only administrators can access content generation.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-4xl font-heading font-bold mb-2">
            🚀 AI Curriculum Generator
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            GPT-4 powered content creation for all 272 lessons
          </p>
        </div>

        {/* Overall Progress */}
        <Card className="border-2" style={{ borderColor: 'var(--primary-teal)' }}>
          <CardHeader style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Overall Curriculum Completion
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: 'var(--primary-teal)' }}>
                  {lessonsCreated}
                </div>
                <div className="text-sm text-gray-600">Lessons Created</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: 'var(--warning)' }}>
                  {totalLessonsNeeded - lessonsCreated}
                </div>
                <div className="text-sm text-gray-600">Remaining</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: 'var(--success)' }}>
                  {questions.length}
                </div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: 'var(--info)' }}>
                  {completionRate}%
                </div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Total Progress</span>
                <span className="font-semibold">{lessonsCreated} / {totalLessonsNeeded}</span>
              </div>
              <Progress value={completionRate} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Batch Status */}
        {batchStatus && (
          <Alert className="border-2" style={{ borderColor: 'var(--success)' }}>
            <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--success)' }} />
            <AlertDescription>
              <p className="font-semibold mb-2">Batch Generation Complete!</p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Lessons:</span>
                  <span className="font-semibold ml-2">{batchStatus.lessons_created} created</span>
                </div>
                <div>
                  <span className="text-gray-600">Questions:</span>
                  <span className="font-semibold ml-2">{batchStatus.questions_created} created</span>
                </div>
                <div>
                  <span className="text-gray-600">Failed:</span>
                  <span className="font-semibold ml-2 text-red-600">{batchStatus.lessons_failed}</span>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="batch">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="batch">
              <Zap className="w-4 h-4 mr-2" />
              Batch Generation
            </TabsTrigger>
            <TabsTrigger value="single">
              <FileText className="w-4 h-4 mr-2" />
              Single Lesson
            </TabsTrigger>
            <TabsTrigger value="progress">
              <BookOpen className="w-4 h-4 mr-2" />
              Progress by Module
            </TabsTrigger>
          </TabsList>

          {/* Batch Generation Tab */}
          <TabsContent value="batch" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" style={{ color: 'var(--accent-orange)' }} />
                  Bulk Curriculum Generation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="font-semibold text-blue-800 mb-2">⚡ How It Works:</p>
                  <ol className="text-sm text-blue-700 space-y-1 list-decimal pl-6">
                    <li>GPT-4 generates complete lesson plans (resources, activities, assessments)</li>
                    <li>Creates Homework, FamilyWork, ExtraMile challenges</li>
                    <li>Generates 15 questions per lesson automatically</li>
                    <li>VARK-aligned content for all learning styles</li>
                    <li>Rate-limited: 3 seconds between lessons (safe for API)</li>
                  </ol>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Generation Mode</label>
                    <select
                      className="w-full p-3 border rounded-lg"
                      value={batchConfig.mode}
                      onChange={(e) => setBatchConfig({ ...batchConfig, mode: e.target.value })}
                    >
                      <option value="module">Single Module (16 lessons)</option>
                      <option value="course">Full Course (~64 lessons)</option>
                      <option value="all">ALL COURSES (272 lessons) 🚀</option>
                    </select>
                  </div>

                  {batchConfig.mode === 'course' && (
                    <div>
                      <label className="block text-sm font-semibold mb-2">Course</label>
                      <select
                        className="w-full p-3 border rounded-lg"
                        value={batchConfig.course_id}
                        onChange={(e) => setBatchConfig({ ...batchConfig, course_id: e.target.value })}
                      >
                        <option value="curiosity">Curiosity (6-8 years)</option>
                        <option value="discovery">Discovery (9-11 years)</option>
                        <option value="pioneer">Pioneer (12-13 years)</option>
                        <option value="challenger">Challenger (14-17 years)</option>
                      </select>
                    </div>
                  )}

                  {batchConfig.mode === 'module' && (
                    <div>
                      <label className="block text-sm font-semibold mb-2">Module</label>
                      <select
                        className="w-full p-3 border rounded-lg"
                        value={batchConfig.module_id}
                        onChange={(e) => setBatchConfig({ ...batchConfig, module_id: e.target.value })}
                      >
                        <option value="">Select module...</option>
                        {modules.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.title} ({m.course_id})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {batchConfig.mode === 'module' && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Start Lesson</label>
                      <input
                        type="number"
                        min="1"
                        max="16"
                        className="w-full p-3 border rounded-lg"
                        value={batchConfig.start_lesson}
                        onChange={(e) => setBatchConfig({ ...batchConfig, start_lesson: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">End Lesson</label>
                      <input
                        type="number"
                        min="1"
                        max="16"
                        className="w-full p-3 border rounded-lg"
                        value={batchConfig.end_lesson}
                        onChange={(e) => setBatchConfig({ ...batchConfig, end_lesson: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="includeQuestions"
                    checked={batchConfig.include_questions}
                    onChange={(e) => setBatchConfig({ ...batchConfig, include_questions: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="includeQuestions" className="text-sm">
                    Generate questions for each lesson (15 per lesson)
                  </label>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                  <p className="font-semibold text-yellow-800 mb-2">⏱️ Estimated Time:</p>
                  <p className="text-sm text-yellow-700">
                    {batchConfig.mode === 'all' ? '~14 hours (272 lessons × 3 sec)' :
                     batchConfig.mode === 'course' ? '~3.5 hours (64 lessons × 3 sec)' :
                     `~${Math.ceil((batchConfig.end_lesson - batchConfig.start_lesson + 1) * 3 / 60)} minutes`}
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">
                    Leave this page open. Process runs in background.
                  </p>
                </div>

                <Button
                  onClick={handleBatchGenerate}
                  disabled={batchGenerateMutation.isPending}
                  className="w-full"
                  size="lg"
                  style={{ backgroundColor: 'var(--accent-orange)', color: 'white' }}
                >
                  {batchGenerateMutation.isPending ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Generating... ({batchConfig.mode})
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Start Batch Generation
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Single Lesson Tab */}
          <TabsContent value="single" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Single Lesson</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Course</label>
                    <select
                      className="w-full p-3 border rounded-lg"
                      value={singleLessonConfig.course_id}
                      onChange={(e) => setSingleLessonConfig({ ...singleLessonConfig, course_id: e.target.value, module_id: '' })}
                    >
                      <option value="curiosity">Curiosity</option>
                      <option value="discovery">Discovery</option>
                      <option value="pioneer">Pioneer</option>
                      <option value="challenger">Challenger</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Module</label>
                    <select
                      className="w-full p-3 border rounded-lg"
                      value={singleLessonConfig.module_id}
                      onChange={(e) => setSingleLessonConfig({ ...singleLessonConfig, module_id: e.target.value })}
                    >
                      <option value="">Select module...</option>
                      {modules
                        .filter(m => m.course_id === singleLessonConfig.course_id)
                        .map(m => (
                          <option key={m.id} value={m.id}>{m.title}</option>
                        ))
                      }
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Lesson Number</label>
                    <input
                      type="number"
                      min="1"
                      max="16"
                      className="w-full p-3 border rounded-lg"
                      value={singleLessonConfig.lesson_number}
                      onChange={(e) => setSingleLessonConfig({ ...singleLessonConfig, lesson_number: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSingleLessonGenerate}
                  disabled={generateLessonMutation.isPending}
                  className="w-full"
                  style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
                >
                  {generateLessonMutation.isPending ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Generating Lesson...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-2" />
                      Generate This Lesson
                    </>
                  )}
                </Button>

                {generateLessonMutation.isSuccess && (
                  <Alert className="border-2" style={{ borderColor: 'var(--success)' }}>
                    <CheckCircle2 className="w-4 h-4" />
                    <AlertDescription>
                      Lesson generated successfully! Now generating questions...
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-4 mt-6">
            <div className="grid md:grid-cols-2 gap-4">
              {lessonsByModule.map(({ module, lessons, needed }) => {
                const progress = Math.round((lessons / needed) * 100);
                const status = progress === 100 ? 'complete' : progress > 0 ? 'in-progress' : 'not-started';
                
                return (
                  <Card key={module.id} className={`border-2 ${
                    status === 'complete' ? 'border-green-500' :
                    status === 'in-progress' ? 'border-yellow-500' :
                    'border-gray-300'
                  }`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <Badge className={
                          status === 'complete' ? 'bg-green-500' :
                          status === 'in-progress' ? 'bg-yellow-500' :
                          'bg-gray-400'
                        }>
                          {lessons}/{needed}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{module.course_id.toUpperCase()} • Semester {module.semester}</p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Progress value={progress} className="h-2 mb-2" />
                      <p className="text-xs text-gray-600">{progress}% complete</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}