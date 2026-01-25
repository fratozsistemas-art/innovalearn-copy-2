import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useCurrentUser } from "@/components/hooks/useUser";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  User, 
  TrendingUp, 
  Trophy, 
  Calendar, 
  Shield, 
  MessageSquare
} from "lucide-react";
import StudentProgressSummary from "@/components/parent/StudentProgressSummary";
import GamificationMonitor from "@/components/parent/GamificationMonitor";
import TasksCalendar from "@/components/parent/TasksCalendar";
import LGPDConsentForm from "@/components/parent/LGPDConsentForm";
import SecureMessaging from "@/components/parent/SecureMessaging";

export default function ParentPortal() {
  const { data: user } = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    if (user && user.user_type === 'pai_responsavel') {
      loadStudents();
      loadUnreadMessages();
    }
  }, [user]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      // Find students linked to this parent
      const allUsers = await base44.entities.User.list();
      
      // Match by parent email in User entity
      const linkedStudents = allUsers.filter(u => 
        u.user_type === 'aluno' && (
          u.parent_mother_email === user.email ||
          u.parent_father_email === user.email ||
          u.financial_responsible_email === user.email
        )
      );

      setStudents(linkedStudents);
      if (linkedStudents.length > 0) {
        setSelectedStudent(linkedStudents[0]);
      }
    } catch (error) {
      console.error('Error loading students:', error);
    }
    setLoading(false);
  };

  const loadUnreadMessages = async () => {
    try {
      const messages = await base44.entities.Message.filter({
        to_email: user.email,
        read: false
      });
      setUnreadMessages(messages.length);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  if (!user || user.user_type !== 'pai_responsavel') {
    return (
      <div className="p-8 text-center">
        <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-bold mb-2">Acesso Restrito</h2>
        <p className="text-gray-600">
          Este portal é exclusivo para pais e responsáveis cadastrados.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
            style={{ borderColor: 'var(--primary-teal)' }}
          />
          <p style={{ color: 'var(--text-secondary)' }}>Carregando portal...</p>
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="p-8 text-center">
        <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-bold mb-2">Nenhum Aluno Vinculado</h2>
        <p className="text-gray-600 mb-4">
          Não encontramos alunos vinculados à sua conta.
        </p>
        <p className="text-sm text-gray-500">
          Entre em contato com a secretaria para vincular seus filhos.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Portal dos Pais
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Bem-vindo(a), {user.full_name} • Acompanhe a jornada educacional dos seus filhos
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="relative">
              <MessageSquare className="w-5 h-5 mr-2" />
              Mensagens
              {unreadMessages > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0"
                  style={{ backgroundColor: 'var(--error)', color: 'white' }}
                >
                  {unreadMessages}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Student Selector */}
        {students.length > 1 && (
          <Card>
            <CardContent className="p-4">
              <label className="text-sm font-semibold mb-2 block">Selecione o Aluno:</label>
              <div className="flex flex-wrap gap-2">
                {students.map((student) => (
                  <Button
                    key={student.id}
                    variant={selectedStudent?.id === student.id ? "default" : "outline"}
                    onClick={() => setSelectedStudent(student)}
                    className="flex items-center gap-2"
                    style={selectedStudent?.id === student.id ? {
                      backgroundColor: 'var(--primary-teal)',
                      color: 'white'
                    } : {}}
                  >
                    <User className="w-4 h-4" />
                    {student.full_name || student.explorer_name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        {selectedStudent && (
          <Tabs defaultValue="progress" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="progress">
                <TrendingUp className="w-4 h-4 mr-2" />
                Progresso
              </TabsTrigger>
              <TabsTrigger value="gamification">
                <Trophy className="w-4 h-4 mr-2" />
                Conquistas
              </TabsTrigger>
              <TabsTrigger value="tasks">
                <Calendar className="w-4 h-4 mr-2" />
                Tarefas
              </TabsTrigger>
              <TabsTrigger value="consent">
                <Shield className="w-4 h-4 mr-2" />
                Privacidade
              </TabsTrigger>
              <TabsTrigger value="messages">
                <MessageSquare className="w-4 h-4 mr-2" />
                Mensagens
                {unreadMessages > 0 && (
                  <Badge className="ml-2" style={{ backgroundColor: 'var(--error)', color: 'white' }}>
                    {unreadMessages}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Progress Tab */}
            <TabsContent value="progress">
              <StudentProgressSummary studentEmail={selectedStudent.email} />
            </TabsContent>

            {/* Gamification Tab */}
            <TabsContent value="gamification">
              <GamificationMonitor studentEmail={selectedStudent.email} />
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks">
              <TasksCalendar studentEmail={selectedStudent.email} />
            </TabsContent>

            {/* LGPD Consent Tab */}
            <TabsContent value="consent">
              <LGPDConsentForm 
                studentEmail={selectedStudent.email}
                parentEmail={user.email}
                parentName={user.full_name}
              />
            </TabsContent>

            {/* Secure Messaging Tab */}
            <TabsContent value="messages">
              <SecureMessaging 
                parentEmail={user.email}
                studentEmail={selectedStudent.email}
                onMessagesRead={loadUnreadMessages}
              />
            </TabsContent>
          </Tabs>
        )}

      </div>
    </div>
  );
}