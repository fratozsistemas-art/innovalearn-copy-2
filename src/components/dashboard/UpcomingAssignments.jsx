
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * AssignmentItem - Componente memoizado para itens individuais
 */
const AssignmentItem = React.memo(({ assignment, onViewClick }) => {
  const daysUntilDue = React.useMemo(() => {
    const due = new Date(assignment.due_date);
    const now = new Date();
    const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    return diff;
  }, [assignment.due_date]);

  const urgencyColor = React.useMemo(() => {
    if (daysUntilDue < 0) return 'var(--error)';
    if (daysUntilDue <= 3) return 'var(--warning)';
    return 'var(--info)';
  }, [daysUntilDue]);

  const urgencyLabel = React.useMemo(() => {
    if (daysUntilDue < 0) return 'Atrasado';
    if (daysUntilDue === 0) return 'Hoje';
    if (daysUntilDue === 1) return 'Amanhã';
    return `${daysUntilDue} dias`;
  }, [daysUntilDue]);

  const formattedDate = React.useMemo(() => {
    return format(new Date(assignment.due_date), "dd 'de' MMMM", { locale: ptBR });
  }, [assignment.due_date]);

  return (
    <div
      className="p-4 rounded-xl hover:shadow-md transition-all cursor-pointer group border"
      style={{
        backgroundColor: 'var(--background)',
        borderColor: 'var(--neutral-medium)'
      }}
      onClick={onViewClick}
      role="article"
      aria-label={`Tarefa: ${assignment.title}, prazo: ${formattedDate}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onViewClick();
        }
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <FileText
              className="w-4 h-4"
              style={{ color: 'var(--primary-teal)' }}
              aria-hidden="true"
            />
            <h4
              className="font-semibold group-hover:text-teal-600 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              {assignment.title}
            </h4>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span
              className="flex items-center gap-1"
              style={{ color: 'var(--text-secondary)' }}
              aria-label={`Prazo: ${formattedDate}`}
            >
              <Calendar className="w-3 h-3" aria-hidden="true" />
              {formattedDate}
            </span>

            <Badge
              className="border-0 text-xs"
              style={{
                backgroundColor: urgencyColor,
                color: 'var(--background)'
              }}
              aria-label={`Urgência: ${urgencyLabel}`}
            >
              <Clock className="w-3 h-3 mr-1" aria-hidden="true" />
              {urgencyLabel}
            </Badge>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onViewClick();
          }}
          aria-label={`Ver detalhes da tarefa ${assignment.title}`}
        >
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
});

AssignmentItem.displayName = 'AssignmentItem';

/**
 * UpcomingAssignments - Lista de tarefas com otimizações de performance
 */
export default function UpcomingAssignments({ assignments = [] }) {
  const navigate = useNavigate();

  // Memoizar a lista ordenada de assignments
  const sortedAssignments = React.useMemo(() => {
    return [...assignments]
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
      .slice(0, 5);
  }, [assignments]);

  // Memoizar o handler de click
  const handleViewAssignment = React.useCallback((assignmentId) => {
    navigate(createPageUrl("Assignments") + `?highlight=${assignmentId}`);
  }, [navigate]);

  const handleViewAll = React.useCallback(() => {
    navigate(createPageUrl("Assignments"));
  }, [navigate]);

  if (sortedAssignments.length === 0) {
    return (
      <Card
        className="card-innova border-none shadow-lg"
        role="region"
        aria-label="Próximas tarefas"
      >
        <CardHeader style={{ backgroundColor: 'var(--neutral-light)', borderBottom: '1px solid var(--neutral-medium)' }}>
          <CardTitle className="font-heading flex items-center gap-2">
            <Calendar className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} aria-hidden="true" />
            Próximas Tarefas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" aria-hidden="true" />
          <p style={{ color: 'var(--text-secondary)' }}>
            Nenhuma tarefa pendente no momento
          </p>
          <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
            Parabéns! Você está em dia com suas atividades 🎉
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="card-innova border-none shadow-lg"
      role="region"
      aria-label="Próximas tarefas"
    >
      <CardHeader style={{ backgroundColor: 'var(--neutral-light)', borderBottom: '1px solid var(--neutral-medium)' }}>
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading flex items-center gap-2">
            <Calendar className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} aria-hidden="true" />
            <span>Próximas Tarefas</span>
            <Badge
              className="ml-2 border-0"
              style={{
                backgroundColor: 'var(--primary-teal)',
                color: 'var(--background)'
              }}
              aria-label={`${sortedAssignments.length} tarefas pendentes`}
            >
              {sortedAssignments.length}
            </Badge>
          </CardTitle>

          {assignments.length > 5 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewAll}
              style={{ color: 'var(--primary-teal)' }}
              aria-label="Ver todas as tarefas"
            >
              Ver Todas
              <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div
          className="space-y-3"
          role="list"
          aria-label="Lista de tarefas próximas"
        >
          {sortedAssignments.map((assignment) => (
            <AssignmentItem
              key={assignment.id}
              assignment={assignment}
              onViewClick={() => handleViewAssignment(assignment.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
