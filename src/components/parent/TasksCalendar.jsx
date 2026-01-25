import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle2, FileText, Home, Users } from "lucide-react";
import { format, differenceInDays, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function TasksCalendar({ studentEmail }) {
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('list'); // 'list' or 'calendar'

  useEffect(() => {
    loadAssignments();
  }, [studentEmail]);

  const loadAssignments = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.Assignment.filter({
        student_email: studentEmail
      }, '-due_date', 50);
      setAssignments(data);
    } catch (error) {
      console.error('Error loading assignments:', error);
    }
    setLoading(false);
  };

  const getTasksForDate = (date) => {
    return assignments.filter(a => 
      isSameDay(new Date(a.due_date), date)
    );
  };

  const pendingTasks = assignments.filter(a => a.status === 'pending');
  const submittedTasks = assignments.filter(a => a.status === 'submitted');
  const completedTasks = assignments.filter(a => a.status === 'graded');

  const getTaskIcon = (assignmentType) => {
    switch (assignmentType) {
      case 'homework': return <FileText className="w-4 h-4" />;
      case 'familywork': return <Home className="w-4 h-4" />;
      case 'classwork': return <Users className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTaskColor = (assignment) => {
    if (assignment.status === 'graded') return 'var(--success)';
    if (assignment.status === 'submitted') return 'var(--info)';
    
    const daysUntilDue = differenceInDays(new Date(assignment.due_date), new Date());
    if (daysUntilDue < 0) return 'var(--error)';
    if (daysUntilDue <= 2) return 'var(--warning)';
    return 'var(--primary-teal)';
  };

  const getUrgencyLabel = (assignment) => {
    if (assignment.status === 'graded') return 'Corrigida';
    if (assignment.status === 'submitted') return 'Enviada';
    
    const daysUntilDue = differenceInDays(new Date(assignment.due_date), new Date());
    if (daysUntilDue < 0) return 'Atrasada';
    if (daysUntilDue === 0) return 'Vence Hoje';
    if (daysUntilDue === 1) return 'Vence Amanhã';
    return `${daysUntilDue} dias`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
            style={{ borderColor: 'var(--primary-teal)' }}
          />
          <p>Carregando tarefas...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => setView('list')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <Clock className="w-8 h-8" style={{ color: 'var(--warning)' }} />
              <Badge style={{ backgroundColor: 'var(--warning)', color: 'white' }}>
                Urgente
              </Badge>
            </div>
            <div className="text-3xl font-bold mb-1">{pendingTasks.length}</div>
            <div className="text-sm text-gray-600">Tarefas Pendentes</div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <CheckCircle2 className="w-8 h-8" style={{ color: 'var(--info)' }} />
            </div>
            <div className="text-3xl font-bold mb-1">{submittedTasks.length}</div>
            <div className="text-sm text-gray-600">Aguardando Correção</div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <CheckCircle2 className="w-8 h-8" style={{ color: 'var(--success)' }} />
            </div>
            <div className="text-3xl font-bold mb-1">{completedTasks.length}</div>
            <div className="text-sm text-gray-600">Corrigidas</div>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <Button
          variant={view === 'list' ? 'default' : 'outline'}
          onClick={() => setView('list')}
        >
          Lista
        </Button>
        <Button
          variant={view === 'calendar' ? 'default' : 'outline'}
          onClick={() => setView('calendar')}
        >
          Calendário
        </Button>
      </div>

      {/* List View */}
      {view === 'list' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
              Todas as Tarefas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {assignments.length > 0 ? (
              assignments.map((assignment) => (
                <div 
                  key={assignment.id}
                  className="p-4 rounded-lg border-l-4 hover:shadow-md transition-all"
                  style={{ borderColor: getTaskColor(assignment) }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: getTaskColor(assignment) + '20' }}
                      >
                        {getTaskIcon(assignment.assignment_type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{assignment.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <Badge variant="outline">
                            {assignment.assignment_type === 'homework' ? '📝 Dever de Casa' :
                             assignment.assignment_type === 'familywork' ? '👨‍👩‍👧 Atividade em Família' :
                             assignment.assignment_type === 'classwork' ? '🏫 Atividade em Aula' :
                             '📋 Tarefa'}
                          </Badge>
                          <span className="text-gray-500">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {format(new Date(assignment.due_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </span>
                          {assignment.points && (
                            <span className="font-semibold text-blue-600">
                              {assignment.points} pontos
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge 
                      style={{ 
                        backgroundColor: getTaskColor(assignment),
                        color: 'white'
                      }}
                    >
                      {getUrgencyLabel(assignment)}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>Nenhuma tarefa encontrada</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Calendar View */}
      {view === 'calendar' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
              Calendário de Tarefas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Visualização de calendário em desenvolvimento</p>
              <p className="text-sm mt-2">Use a visualização em lista por enquanto</p>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}