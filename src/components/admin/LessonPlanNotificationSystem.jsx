import React, { useState, useEffect } from "react";
import { LessonPlan, User } from "@/entities/all";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Send, CheckCircle2, Users } from "lucide-react";
import { useCreateNotification } from "@/components/hooks/useNotifications";

/**
 * Sistema para notificar professores quando novos planos de aula são adicionados
 */
export default function LessonPlanNotificationSystem() {
  const [lessonPlans, setLessonPlans] = useState([]);
  const [recentPlans, setRecentPlans] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingNotifications, setSendingNotifications] = useState(false);
  
  const createNotificationMutation = useCreateNotification();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Carregar planos de aula dos últimos 7 dias
      const allPlans = await LessonPlan.list();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recent = allPlans.filter(plan => {
        const createdDate = new Date(plan.created_date);
        return createdDate > sevenDaysAgo;
      });

      setLessonPlans(allPlans);
      setRecentPlans(recent);

      // Carregar todos os educadores
      const allUsers = await User.list();
      const educators = allUsers.filter(u => 
        ['instrutor', 'coordenador_pedagogico', 'administrador'].includes(u.user_type)
      );
      setTeachers(educators);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
    setLoading(false);
  };

  const sendNotifications = async () => {
    setSendingNotifications(true);
    
    try {
      for (const plan of recentPlans) {
        for (const teacher of teachers) {
          await createNotificationMutation.mutateAsync({
            user_email: teacher.email,
            type: 'new_content',
            priority: 'medium',
            title: 'Novo Plano de Aula Disponível',
            message: `O plano de aula "${plan.title}" foi adicionado e está disponível para treinamento.`,
            action_url: `/teacher-lesson-training?lessonId=${plan.lesson_id}`,
            metadata: {
              lesson_id: plan.lesson_id,
              lesson_plan_id: plan.id
            }
          });
        }
      }
      
      alert(`Notificações enviadas para ${teachers.length} educadores sobre ${recentPlans.length} novo(s) plano(s) de aula!`);
      
    } catch (error) {
      console.error('Erro ao enviar notificações:', error);
      alert('Erro ao enviar notificações. Tente novamente.');
    }
    
    setSendingNotifications(false);
  };

  if (loading) {
    return (
      <Card className="card-innova">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" 
            style={{ borderColor: 'var(--primary-teal)' }}
          />
          <p style={{ color: 'var(--text-secondary)' }}>Carregando...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-innova border-none shadow-lg">
      <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
        <CardTitle className="font-heading flex items-center gap-2">
          <Bell className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
          Sistema de Notificações de Planos de Aula
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--info)10' }}>
            <div className="text-3xl font-bold mb-1" style={{ color: 'var(--info)' }}>
              {lessonPlans.length}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Planos Totais
            </div>
          </div>
          
          <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--accent-orange)10' }}>
            <div className="text-3xl font-bold mb-1" style={{ color: 'var(--accent-orange)' }}>
              {recentPlans.length}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Novos (7 dias)
            </div>
          </div>
          
          <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--success)10' }}>
            <div className="text-3xl font-bold mb-1" style={{ color: 'var(--success)' }}>
              {teachers.length}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Educadores
            </div>
          </div>
        </div>

        {recentPlans.length > 0 ? (
          <>
            {/* Recent Plans */}
            <div>
              <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Novos Planos de Aula (últimos 7 dias)
              </h4>
              <div className="space-y-2">
                {recentPlans.map((plan) => (
                  <div key={plan.id} className="flex items-center justify-between p-3 rounded-lg"
                    style={{ backgroundColor: 'var(--neutral-light)' }}
                  >
                    <div>
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {plan.title}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Adicionado em {new Date(plan.created_date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Badge style={{ backgroundColor: 'var(--accent-orange)', color: 'white' }}>
                      Novo
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification Action */}
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--info)10', border: '2px solid var(--info)' }}>
              <div className="flex items-start gap-3 mb-3">
                <Users className="w-5 h-5 mt-1" style={{ color: 'var(--info)' }} />
                <div className="flex-1">
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--info)' }}>
                    Notificar Educadores
                  </h4>
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    Enviar notificação para todos os {teachers.length} educadores sobre os {recentPlans.length} novo(s) plano(s) de aula disponível(is).
                  </p>
                </div>
              </div>
              
              <Button
                onClick={sendNotifications}
                disabled={sendingNotifications}
                className="w-full"
                style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
              >
                {sendingNotifications ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Notificações
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--success)' }} />
            <p className="font-semibold mb-1" style={{ color: 'var(--success)' }}>
              Tudo em dia!
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Nenhum plano de aula novo nos últimos 7 dias.
            </p>
          </div>
        )}

      </CardContent>
    </Card>
  );
}