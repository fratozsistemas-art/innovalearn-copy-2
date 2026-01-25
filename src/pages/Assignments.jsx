
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Clock, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

import AssignmentAutoGrader from "../components/assignments/AssignmentAutoGrader";
import RubricDisplay from "../components/assignments/RubricDisplay";
import { useSendAssignmentNotification } from "../components/hooks/useAssignmentNotifications";
import { useCurrentUser } from "@/components/hooks/useUser";
import { PageLoadingSkeleton } from "@/components/common/LoadingSkeleton";

export default function AssignmentsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("pending");
  const [uploadingId, setUploadingId] = useState(null);

  const sendNotification = useSendAssignmentNotification();

  // Buscar usuário atual
  const { data: user, isLoading: userLoading } = useCurrentUser();

  // Buscar assignments COM FALLBACK PARA NETWORK ERROR
  const { data: assignments = [], isLoading: assignmentsLoading, error: assignmentsError } = useQuery({
    queryKey: ['assignments', user?.email, 'all'],
    queryFn: async () => {
      if (!user?.email) {
        console.log('⚠️ No user email, skipping assignments query');
        return [];
      }
      try {
        console.log('🔄 Fetching assignments for:', user.email);
        const data = await base44.entities.Assignment.filter({ 
          student_email: user.email 
        }, '-due_date');
        console.log('✅ Assignments loaded:', data.length);
        return data;
      } catch (error) {
        if (error?.message?.includes('Network Error')) {
          console.warn('⚠️ Network error on assignments, returning empty array');
          return [];
        }
        if (error?.message?.includes('Rate limit')) {
          console.warn('⚠️ Rate limit on assignments. Usando cache.');
          return [];
        }
        console.error('❌ Error fetching assignments:', error);
        return [];
      }
    },
    enabled: !!user?.email,
    staleTime: 1000 * 60 * 15, // 15 minutos
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (error?.message?.includes('Network Error')) return false;
      if (error?.message?.includes('Rate limit')) return false;
      return failureCount < 1; // Retry once for other errors
    },
    throwOnError: false
  });

  // Buscar courses COM CACHE ULTRA AGRESSIVO
  const { data: courses = [], isLoading: coursesLoading, error: coursesError } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      try {
        console.log('🔄 Fetching all courses');
        const data = await base44.entities.Course.list();
        console.log('✅ Courses loaded:', data.length);
        return data;
      } catch (error) {
        if (error?.message?.includes('Network Error')) {
          console.warn('⚠️ Network error on courses, returning empty array');
          return [];
        }
        if (error?.message?.includes('Rate limit')) {
          console.warn('⚠️ Rate limit on courses. Usando cache.');
          return [];
        }
        console.error('❌ Error fetching courses:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 60, // 1 HORA - courses não mudam
    gcTime: 1000 * 60 * 60 * 2, // 2 horas
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (error?.message?.includes('Network Error')) return false;
      if (error?.message?.includes('Rate limit')) return false;
      return failureCount < 1; // Retry once for other errors
    },
    throwOnError: false
  });

  // Mutation para upload de arquivo
  const uploadFileMutation = useMutation({
    mutationFn: async ({ assignmentId, file }) => {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      return await base44.entities.Assignment.update(assignmentId, {
        submission_url: file_url,
        status: "submitted",
        submitted_at: new Date().toISOString()
      });
    },
    onSuccess: (data) => {
      // Enviar notificação ao professor
      sendNotification.mutate({
        assignmentId: data.id,
        studentEmail: user.email,
        type: 'created'
      });
      
      // Invalidar cache de assignments
      queryClient.invalidateQueries({ 
        queryKey: ['assignments', user.email] 
      });
    },
    retry: false
  });

  const handleFileUpload = async (assignmentId, file) => {
    setUploadingId(assignmentId);
    try {
      await uploadFileMutation.mutateAsync({ assignmentId, file });
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Erro ao enviar arquivo. Tente novamente.");
    }
    setUploadingId(null);
  };

  const getCourseName = (courseId) => {
    return courses.find(c => c.id === courseId)?.title || "Curso";
  };

  const getStatusColor = (assignment) => {
    if (assignment.status === "graded") return "bg-green-100 text-green-800";
    if (assignment.status === "submitted") return "bg-blue-100 text-blue-800";
    if (assignment.status === "late") return "bg-red-100 text-red-800";
    
    const daysUntilDue = differenceInDays(new Date(assignment.due_date), new Date());
    if (daysUntilDue < 0) return "bg-red-100 text-red-800";
    if (daysUntilDue <= 2) return "bg-orange-100 text-orange-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const getStatusIcon = (assignment) => {
    if (assignment.status === "graded") return <CheckCircle2 className="w-4 h-4" />;
    if (assignment.status === "submitted") return <Upload className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const getStatusLabel = (assignment) => {
    if (assignment.status === "graded") return `Nota: ${assignment.grade}/${assignment.points}`;
    if (assignment.status === "submitted") return "Enviada";
    
    const daysUntilDue = differenceInDays(new Date(assignment.due_date), new Date());
    if (daysUntilDue < 0) return "Atrasada";
    if (daysUntilDue === 0) return "Vence hoje";
    if (daysUntilDue === 1) return "Vence amanhã";
    return `${daysUntilDue} dias`;
  };

  const filteredAssignments = assignments.filter(a => {
    if (activeTab === "pending") return a.status === "pending";
    if (activeTab === "submitted") return a.status === "submitted";
    if (activeTab === "graded") return a.status === "graded";
    return true;
  });

  // Loading state
  const isLoading = userLoading || assignmentsLoading || coursesLoading;

  if (isLoading) {
    return <PageLoadingSkeleton />;
  }

  // Error state COM FALLBACK GRACIOSO
  if ((assignmentsError || coursesError) && 
      !assignmentsError?.message?.includes('Rate limit') && 
      !assignmentsError?.message?.includes('Network Error') &&
      !coursesError?.message?.includes('Rate limit') &&
      !coursesError?.message?.includes('Network Error')) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
        <h2 className="text-2xl font-bold mb-2">Erro ao Carregar Tarefas</h2>
        <p className="text-gray-600 mb-4">
          Não foi possível carregar suas tarefas. Tente novamente.
        </p>
        <Button onClick={() => window.location.reload()}>
          Recarregar Página
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tarefas</h1>
          <p className="text-gray-600">Gerencie e envie suas tarefas</p>
        </div>

        {/* Rate Limit Warning */}
        {(assignmentsError?.message?.includes('Rate limit') || coursesError?.message?.includes('Rate limit')) && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-yellow-900 text-sm">
                Dados podem estar desatualizados
              </p>
              <p className="text-xs text-yellow-800 mt-1">
                Limite de requisições atingido. Os dados serão atualizados automaticamente em alguns minutos.
              </p>
            </div>
          </div>
        )}
        
        {/* Network Error Warning */}
        {(assignmentsError?.message?.includes('Network Error') || coursesError?.message?.includes('Network Error')) && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-900 text-sm">
                Problema de Conexão
              </p>
              <p className="text-xs text-red-800 mt-1">
                Não foi possível carregar os dados devido a um problema de rede. Por favor, verifique sua conexão à internet.
              </p>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white border">
            <TabsTrigger value="pending">
              Pendentes ({assignments.filter(a => a.status === "pending").length})
            </TabsTrigger>
            <TabsTrigger value="submitted">
              Enviadas ({assignments.filter(a => a.status === "submitted").length})
            </TabsTrigger>
            <TabsTrigger value="graded">
              Corrigidas ({assignments.filter(a => a.status === "graded").length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          {filteredAssignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-lg transition-all border-none bg-white">
              <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{assignment.title}</CardTitle>
                    <p className="text-sm text-gray-600">{getCourseName(assignment.course_id)}</p>
                  </div>
                  <Badge className={`${getStatusColor(assignment)} border-0 flex items-center gap-1`}>
                    {getStatusIcon(assignment)}
                    {getStatusLabel(assignment)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-gray-700">{assignment.description}</p>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    Entrega: {format(new Date(assignment.due_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </div>
                  {assignment.points && (
                    <div className="font-semibold text-blue-900">
                      {assignment.points} pontos
                    </div>
                  )}
                </div>

                {/* Rubrica se disponível */}
                {assignment.rubric && (
                  <RubricDisplay rubric={assignment.rubric} />
                )}

                {assignment.status === "pending" && (
                  <div className="pt-4 border-t">
                    <label className="block">
                      <Button
                        className="w-full bg-gradient-to-r from-blue-900 to-cyan-700 hover:from-blue-800 hover:to-cyan-600"
                        disabled={uploadingId === assignment.id}
                        onClick={() => document.getElementById(`file-${assignment.id}`).click()}
                      >
                        {uploadingId === assignment.id ? (
                          <>Enviando...</>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Enviar Tarefa
                          </>
                        )}
                      </Button>
                      <input
                        id={`file-${assignment.id}`}
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileUpload(assignment.id, e.target.files[0])}
                      />
                    </label>
                  </div>
                )}

                {assignment.status === "submitted" && (
                  <div className="space-y-4">
                    {assignment.submission_url && (
                      <div className="p-4 bg-blue-50 rounded-xl flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-900" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Arquivo enviado</p>
                          <a 
                            href={assignment.submission_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Ver arquivo
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Auto-correção se ainda não foi corrigida manualmente */}
                    {!assignment.feedback && (
                      <AssignmentAutoGrader
                        assignment={assignment}
                        submission={{
                          id: assignment.id,
                          student_email: assignment.student_email,
                          content: assignment.submission_content,
                          file_url: assignment.submission_url
                        }}
                        onGraded={(feedback) => {
                          console.log('Feedback recebido:', feedback);
                          queryClient.invalidateQueries({ 
                            queryKey: ['assignments', user.email] 
                          });
                        }}
                      />
                    )}
                  </div>
                )}

                {assignment.feedback && (
                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <p className="font-semibold text-gray-900 mb-2">Feedback do Professor:</p>
                    <p className="text-gray-700">{assignment.feedback}</p>
                    {assignment.grade && (
                      <div className="mt-3 pt-3 border-t border-green-200">
                        <span className="font-semibold">Nota Final: </span>
                        <span className="text-2xl font-bold text-green-600">
                          {assignment.grade}/{assignment.points || 100}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAssignments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma tarefa nesta categoria</p>
          </div>
        )}
      </div>
    </div>
  );
}
