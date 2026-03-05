import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function OverdueAssignments({ assignments }) {
  const navigate = useNavigate();

  const overdue = assignments
    .filter(a => a.status === 'pending' && new Date(a.due_date) < new Date())
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

  const upcoming = assignments
    .filter(a => a.status === 'pending' && new Date(a.due_date) >= new Date())
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 4);

  if (overdue.length === 0 && upcoming.length === 0) {
    return (
      <Card className="card-innova border-none shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">✅</span>
          </div>
          <p className="font-semibold text-gray-700">Nenhuma tarefa pendente!</p>
          <p className="text-sm text-gray-400 mt-1">Você está em dia com tudo.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-innova border-none shadow-lg">
      <CardHeader style={{ backgroundColor: 'var(--neutral-light)', borderBottom: '1px solid var(--neutral-medium)' }}>
        <CardTitle className="font-heading flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-innova-orange-500" />
            Tarefas Pendentes & Atrasadas
          </div>
          {overdue.length > 0 && (
            <Badge className="bg-red-100 text-red-700 border-0">
              {overdue.length} atrasada{overdue.length > 1 ? 's' : ''}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {overdue.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Atrasadas
            </p>
            <div className="space-y-2">
              {overdue.map(a => (
                <div key={a.id} className="flex items-start justify-between p-3 rounded-xl bg-red-50 border border-red-200">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-red-800 truncate">{a.title}</p>
                    <p className="text-xs text-red-500 mt-0.5">
                      Venceu {formatDistanceToNow(new Date(a.due_date), { locale: ptBR, addSuffix: true })}
                    </p>
                  </div>
                  <Badge className="bg-red-600 text-white border-0 text-xs ml-2 flex-shrink-0">
                    {a.assignment_type || 'tarefa'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {upcoming.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-2 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Próximas Entregas
            </p>
            <div className="space-y-2">
              {upcoming.map(a => {
                const dueDate = new Date(a.due_date);
                const daysLeft = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
                const isUrgent = daysLeft <= 2;
                return (
                  <div key={a.id} className={`flex items-start justify-between p-3 rounded-xl border ${isUrgent ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm truncate ${isUrgent ? 'text-orange-800' : 'text-gray-800'}`}>{a.title}</p>
                      <p className={`text-xs mt-0.5 ${isUrgent ? 'text-orange-500' : 'text-gray-500'}`}>
                        {daysLeft === 0 ? 'Hoje!' : daysLeft === 1 ? 'Amanhã!' : `em ${daysLeft} dias`}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
                      {a.assignment_type || 'tarefa'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate(createPageUrl("Assignments"))}
        >
          Ver todas as tarefas
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}