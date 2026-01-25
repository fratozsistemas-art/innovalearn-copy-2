import React, { useState, useEffect, useCallback } from "react";
import { User } from "@/entities/User";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft,
  CheckCircle2,
  FileText,
  BookOpen,
  Clock,
  Award,
  PlayCircle,
  AlertTriangle,
  Lock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import LessonPlanViewer from "../components/lesson/LessonPlanViewer";
import YouTubePlayer from "../components/media/YouTubePlayer";

// Importar entidades dinamicamente
const loadEntities = async () => {
  try {
    const { Lesson } = await import("@/entities/all");
    const { Module } = await import("@/entities/all");
    const { TeacherLessonCertification } = await import("@/entities/all");
    const { LessonPlan } = await import("@/entities/all");
    return { Lesson, Module, TeacherLessonCertification, LessonPlan };
  } catch (error) {
    console.error("Erro ao importar entidades:", error);
    return null;
  }
};

const levelColors = {
  curiosity: '#3498DB',
  discovery: '#27AE60',
  pioneer: '#FF6F3C',
  challenger: '#E74C3C'
};

export default function TeacherLessonPage() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const lessonId = urlParams.get('lessonId');

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [module, setModule] = useState(null);
  const [lessonPlan, setLessonPlan] = useState(null);
  const [certification, setCertification] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [checklist, setChecklist] = useState({
    plan_reviewed: false,
    materials_downloaded: false,
    activities_understood: false
  });
  const [notes, setNotes] = useState('');
  const [isCertifying, setIsCertifying] = useState(false);

  const loadData = useCallback(async () => {
    if (!lessonId) {
      setError("ID da lição não fornecido");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userData = await User.me();
      setUser(userData);

      if (!['administrador', 'coordenador_pedagogico', 'instrutor'].includes(userData.user_type)) {
        setError("Você não tem permissão para acessar esta página");
        setLoading(false);
        return;
      }

      // Carregar entidades
      const entities = await loadEntities();
      if (!entities) {
        throw new Error("Não foi possível carregar as entidades necessárias");
      }

      const { Lesson, Module, TeacherLessonCertification, LessonPlan } = entities;

      // Carregar lição
      console.log("Carregando lição:", lessonId);
      const lessons = await Lesson.filter({ id: lessonId });
      
      if (lessons.length === 0) {
        throw new Error("Lição não encontrada");
      }

      const lessonData = lessons[0];
      setLesson(lessonData);
      console.log("Lição carregada:", lessonData);

      // Carregar módulo
      const modules = await Module.filter({ id: lessonData.module_id });
      if (modules.length > 0) {
        setModule(modules[0]);
        console.log("Módulo carregado:", modules[0]);
      }

      // Carregar plano de aula
      console.log("Carregando plano de aula...");
      const plans = await LessonPlan.filter({ lesson_id: lessonId });
      
      if (plans.length > 0) {
        setLessonPlan(plans[0]);
        console.log("Plano de aula encontrado:", plans[0]);
      } else {
        console.log("Nenhum plano de aula encontrado");
      }

      // Carregar certificação existente
      const certs = await TeacherLessonCertification.filter({
        teacher_email: userData.email,
        lesson_id: lessonId
      });

      if (certs.length > 0) {
        const cert = certs[0];
        setCertification(cert);
        setChecklist({
          plan_reviewed: cert.lesson_plan_reviewed || false,
          materials_downloaded: cert.materials_downloaded || false,
          activities_understood: cert.activities_understood || false
        });
        setNotes(cert.notes || '');
        console.log("Certificação carregada:", cert);
      }

    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError(err.message || "Erro ao carregar dados");
    }
    
    setLoading(false);
  }, [lessonId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCertify = async () => {
    if (!checklist.plan_reviewed || !checklist.materials_downloaded || !checklist.activities_understood) {
      alert("Por favor, complete todos os itens do checklist antes de obter a certificação.");
      return;
    }

    setIsCertifying(true);

    try {
      const entities = await loadEntities();
      if (!entities) {
        throw new Error("Não foi possível carregar as entidades necessárias");
      }

      const { TeacherLessonCertification } = entities;

      if (certification) {
        await TeacherLessonCertification.update(certification.id, {
          lesson_plan_reviewed: true,
          materials_downloaded: true,
          activities_understood: true,
          certified: true,
          certification_date: new Date().toISOString(),
          notes: notes,
          training_completed_at: new Date().toISOString()
        });
      } else {
        await TeacherLessonCertification.create({
          teacher_email: user.email,
          lesson_id: lessonId,
          course_level: lesson.course_id,
          training_started_at: new Date().toISOString(),
          training_completed_at: new Date().toISOString(),
          lesson_plan_reviewed: true,
          materials_downloaded: true,
          activities_understood: true,
          certified: true,
          certification_date: new Date().toISOString(),
          notes: notes,
          times_taught: 0
        });
      }

      await loadData();
      alert("Parabéns! Você está agora certificado para ministrar esta lição.");

    } catch (err) {
      console.error("Erro ao certificar:", err);
      alert("Erro ao salvar certificação: " + err.message);
    }

    setIsCertifying(false);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
            style={{ borderColor: 'var(--primary-teal)' }}
          />
          <p style={{ color: 'var(--text-secondary)' }}>Carregando conteúdo da lição...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="p-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        
        <Card className="border-2 border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Erro ao Carregar Lição
                </h3>
                <p className="text-red-700 mb-4">{error || "Lição não encontrada"}</p>
                <Button 
                  onClick={loadData}
                  style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
                >
                  Tentar Novamente
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const levelColor = levelColors[lesson.course_id] || levelColors.curiosity;
  const isCertified = certification?.certified || false;
  const hasLessonPlan = lessonPlan !== null;

  console.log("Renderizando página - Lição:", lesson.title);
  console.log("Tem plano de aula?", hasLessonPlan);
  console.log("Está certificado?", isCertified);

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        {/* Header */}
        <Card className="border-none shadow-xl overflow-hidden">
          <div className="h-3" style={{ backgroundColor: levelColor }} />
          <CardHeader style={{ backgroundColor: 'var(--background)' }}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0"
                  style={{ backgroundColor: levelColor }}
                >
                  {lesson.order}
                </div>
                <div>
                  <CardTitle className="text-2xl font-heading mb-2">
                    {lesson.title}
                  </CardTitle>
                  <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                    {module?.title} • Lição {lesson.order}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline">
                      <Clock className="w-3 h-3 mr-1" />
                      {lesson.duration_minutes} minutos
                    </Badge>
                    {isCertified && (
                      <Badge style={{ backgroundColor: 'var(--success)', color: 'white' }}>
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Certificado
                      </Badge>
                    )}
                    {hasLessonPlan && (
                      <Badge style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}>
                        <FileText className="w-3 h-3 mr-1" />
                        Plano Disponível
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Status Alert */}
        {hasLessonPlan && !isCertified && (
          <Alert className="border-2" style={{ borderColor: 'var(--warning)', backgroundColor: 'rgba(249, 115, 22, 0.1)' }}>
            <AlertTriangle className="w-5 h-5" style={{ color: 'var(--warning)' }} />
            <AlertDescription className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div>
                <p className="font-semibold mb-1">Certificação Pendente</p>
                <p className="text-sm">
                  Complete o treinamento para poder ministrar esta lição em sala de aula.
                </p>
              </div>
              <Button
                onClick={() => setActiveTab('certification')}
                style={{ backgroundColor: 'var(--warning)', color: 'white' }}
                className="flex-shrink-0"
              >
                <Lock className="w-4 h-4 mr-2" />
                Iniciar Certificação
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {isCertified && (
          <Alert className="border-2" style={{ borderColor: 'var(--success)', backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
            <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--success)' }} />
            <AlertDescription>
              <p className="font-semibold mb-1">Você está certificado para ministrar esta lição</p>
              <p className="text-sm">
                Certificado em: {new Date(certification.certification_date).toLocaleDateString('pt-BR')}
                {certification.times_taught > 0 && ` • Ministrada ${certification.times_taught}x`}
              </p>
            </AlertDescription>
          </Alert>
        )}

        {/* Debug Info - Remove depois */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-sm font-mono">
              <strong>Debug:</strong> lessonId={lessonId}, hasLessonPlan={hasLessonPlan ? 'SIM' : 'NÃO'}, isCertified={isCertified ? 'SIM' : 'NÃO'}
            </p>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4" style={{ backgroundColor: 'var(--background)' }}>
            <TabsTrigger value="overview">
              <BookOpen className="w-4 h-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="content">
              <PlayCircle className="w-4 h-4 mr-2" />
              Conteúdo
            </TabsTrigger>
            <TabsTrigger value="lesson-plan">
              <FileText className="w-4 h-4 mr-2" />
              Plano de Aula
            </TabsTrigger>
            <TabsTrigger value="certification">
              <Award className="w-4 h-4 mr-2" />
              Certificação
            </TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Sobre esta Lição</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{lesson.description}</p>
                
                {lesson.learning_objectives && lesson.learning_objectives.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Objetivos:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {lesson.learning_objectives.map((obj, idx) => (
                        <li key={idx}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conteúdo */}
          <TabsContent value="content" className="mt-6">
            {lesson.content_url ? (
              <YouTubePlayer url={lesson.content_url} title={lesson.title} />
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <PlayCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Conteúdo em desenvolvimento</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Plano de Aula */}
          <TabsContent value="lesson-plan" className="mt-6">
            {hasLessonPlan ? (
              <LessonPlanViewer lessonPlan={lessonPlan} levelColor={levelColor} />
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Plano de aula em desenvolvimento</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Certificação */}
          <TabsContent value="certification" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{isCertified ? 'Certificado!' : 'Obter Certificação'}</CardTitle>
              </CardHeader>
              <CardContent>
                {isCertified ? (
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-600" />
                    <h3 className="text-xl font-bold mb-2">Parabéns! Você está certificado</h3>
                    <p>Certificado em: {new Date(certification.certification_date).toLocaleDateString('pt-BR')}</p>
                  </div>
                ) : hasLessonPlan ? (
                  <div className="space-y-4">
                    <h4 className="font-semibold">Checklist de Preparação:</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="plan_reviewed"
                          checked={checklist.plan_reviewed}
                          onCheckedChange={(checked) => setChecklist({...checklist, plan_reviewed: checked})}
                        />
                        <Label htmlFor="plan_reviewed" className="cursor-pointer">
                          Li e compreendi o plano de aula completo
                        </Label>
                      </div>

                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="materials_downloaded"
                          checked={checklist.materials_downloaded}
                          onCheckedChange={(checked) => setChecklist({...checklist, materials_downloaded: checked})}
                        />
                        <Label htmlFor="materials_downloaded" className="cursor-pointer">
                          Baixei todos os materiais necessários
                        </Label>
                      </div>

                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="activities_understood"
                          checked={checklist.activities_understood}
                          onCheckedChange={(checked) => setChecklist({...checklist, activities_understood: checked})}
                        />
                        <Label htmlFor="activities_understood" className="cursor-pointer">
                          Entendi como conduzir todas as atividades
                        </Label>
                      </div>
                    </div>

                    <div>
                      <Label>Notas Pessoais (opcional)</Label>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Suas reflexões sobre esta lição..."
                        rows={4}
                      />
                    </div>

                    <Button
                      onClick={handleCertify}
                      disabled={!checklist.plan_reviewed || !checklist.materials_downloaded || !checklist.activities_understood || isCertifying}
                      className="w-full"
                      style={{ backgroundColor: 'var(--success)', color: 'white' }}
                    >
                      {isCertifying ? 'Processando...' : 'Obter Certificação'}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <Lock className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Plano de aula necessário para certificação</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}