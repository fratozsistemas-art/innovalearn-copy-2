import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, BookOpen, CheckCircle2, Clock, Award, Target } from "lucide-react";

export default function StudentProgressSummary({ studentEmail }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    enrollments: [],
    assignments: [],
    modules: [],
    recentActivity: []
  });

  useEffect(() => {
    loadProgressData();
  }, [studentEmail]);

  const loadProgressData = async () => {
    setLoading(true);
    try {
      const [enrollments, assignments, allModules] = await Promise.all([
        base44.entities.Enrollment.filter({ student_email: studentEmail }),
        base44.entities.Assignment.filter({ student_email: studentEmail }, '-due_date', 20),
        base44.entities.Module.list()
      ]);

      const enrolledModuleIds = enrollments.map(e => e.module_id);
      const modules = allModules.filter(m => enrolledModuleIds.includes(m.id));

      setData({
        enrollments,
        assignments,
        modules,
        recentActivity: assignments.slice(0, 5)
      });
    } catch (error) {
      console.error('Error loading progress:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
            style={{ borderColor: 'var(--primary-teal)' }}
          />
          <p>Carregando progresso...</p>
        </CardContent>
      </Card>
    );
  }

  const averageProgress = data.enrollments.length > 0
    ? Math.round(data.enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / data.enrollments.length)
    : 0;

  const completedAssignments = data.assignments.filter(a => a.status === 'graded' || a.status === 'submitted').length;
  const pendingAssignments = data.assignments.filter(a => a.status === 'pending').length;
  const averageGrade = data.assignments.filter(a => a.grade).length > 0
    ? Math.round(data.assignments.filter(a => a.grade).reduce((sum, a) => sum + a.grade, 0) / data.assignments.filter(a => a.grade).length)
    : 0;

  return (
    <div className="space-y-6">
      
      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <BookOpen className="w-8 h-8" style={{ color: 'var(--primary-teal)' }} />
            </div>
            <div className="text-3xl font-bold mb-1">{data.modules.length}</div>
            <div className="text-sm text-gray-600">Módulos Ativos</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-8 h-8" style={{ color: 'var(--success)' }} />
            </div>
            <div className="text-3xl font-bold mb-1">{averageProgress}%</div>
            <div className="text-sm text-gray-600">Progresso Médio</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <CheckCircle2 className="w-8 h-8" style={{ color: 'var(--info)' }} />
            </div>
            <div className="text-3xl font-bold mb-1">{completedAssignments}</div>
            <div className="text-sm text-gray-600">Tarefas Completas</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <Award className="w-8 h-8" style={{ color: 'var(--accent-yellow)' }} />
            </div>
            <div className="text-3xl font-bold mb-1">{averageGrade || '--'}</div>
            <div className="text-sm text-gray-600">Nota Média</div>
          </CardContent>
        </Card>
      </div>

      {/* Module Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
            Progresso por Módulo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.enrollments.map((enrollment) => {
            const module = data.modules.find(m => m.id === enrollment.module_id);
            if (!module) return null;

            return (
              <div key={enrollment.id} className="p-4 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{module.title}</h4>
                    <p className="text-sm text-gray-600">Semestre {module.semester}</p>
                  </div>
                  <Badge style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}>
                    {enrollment.progress}%
                  </Badge>
                </div>
                <Progress value={enrollment.progress} className="h-2" />
                <div className="mt-2 text-xs text-gray-500">
                  {enrollment.completed_lessons?.length || 0} de {module.total_lessons || 16} lições completadas
                </div>
              </div>
            );
          })}

          {data.enrollments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Nenhuma matrícula ativa no momento</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" style={{ color: 'var(--info)' }} />
            Atividade Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.recentActivity.map((assignment) => (
              <div 
                key={assignment.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  {assignment.status === 'graded' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : assignment.status === 'submitted' ? (
                    <Clock className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-orange-600" />
                  )}
                  <div>
                    <p className="font-semibold text-sm">{assignment.title}</p>
                    <p className="text-xs text-gray-600">
                      {assignment.status === 'graded' 
                        ? `Nota: ${assignment.grade}/${assignment.points}`
                        : assignment.status === 'submitted'
                        ? 'Aguardando correção'
                        : `Prazo: ${new Date(assignment.due_date).toLocaleDateString('pt-BR')}`
                      }
                    </p>
                  </div>
                </div>
                <Badge 
                  variant="outline"
                  style={assignment.status === 'graded' 
                    ? { borderColor: 'var(--success)', color: 'var(--success)' }
                    : assignment.status === 'submitted'
                    ? { borderColor: 'var(--info)', color: 'var(--info)' }
                    : { borderColor: 'var(--warning)', color: 'var(--warning)' }
                  }
                >
                  {assignment.status === 'graded' ? 'Corrigida' :
                   assignment.status === 'submitted' ? 'Enviada' : 'Pendente'}
                </Badge>
              </div>
            ))}

            {data.recentActivity.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Nenhuma atividade recente</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}