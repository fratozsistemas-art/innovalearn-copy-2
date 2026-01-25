import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Eye, 
  Ear, 
  BookText, 
  Hand,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Users
} from "lucide-react";
import { useCurrentUser } from "@/components/hooks/useUser";

const VARK_ICONS = {
  visual: Eye,
  auditory: Ear,
  read_write: BookText,
  kinesthetic: Hand
};

const VARK_COLORS = {
  visual: '#3B82F6',
  auditory: '#10B981',
  read_write: '#F59E0B',
  kinesthetic: '#EF4444'
};

const VARK_NAMES = {
  visual: 'Visual',
  auditory: 'Auditivo',
  read_write: 'Leitura/Escrita',
  kinesthetic: 'Cinestésico'
};

export default function VARKAnalyticsPage() {
  const { data: user } = useCurrentUser();
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('effectiveness');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [allLogs, allUsers] = await Promise.all([
        base44.entities.VARKEffectivenessLog.list('-created_date'),
        base44.entities.User.list()
      ]);

      setLogs(allLogs);
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading VARK analytics:', error);
    }
    setLoading(false);
  };

  // Calcular métricas de eficácia por estilo
  const calculateEffectiveness = () => {
    const styles = ['visual', 'auditory', 'read_write', 'kinesthetic'];
    
    return styles.map(style => {
      // Logs onde recurso MATCH com estilo primário do aluno
      const optimalLogs = logs.filter(log => 
        log.user_vark_style === style && 
        log.resource_vark_style === style &&
        log.is_optimal_match
      );

      // Logs onde recurso NÃO MATCH
      const suboptimalLogs = logs.filter(log =>
        log.user_vark_style === style &&
        log.resource_vark_style !== style &&
        !log.is_optimal_match
      );

      // Métricas de engajamento
      const optimalCompletionRate = optimalLogs.length > 0
        ? (optimalLogs.filter(l => l.completed).length / optimalLogs.length) * 100
        : 0;

      const suboptimalCompletionRate = suboptimalLogs.length > 0
        ? (suboptimalLogs.filter(l => l.completed).length / suboptimalLogs.length) * 100
        : 0;

      const optimalAvgTime = optimalLogs.length > 0
        ? optimalLogs.reduce((sum, l) => sum + (l.time_spent_seconds || 0), 0) / optimalLogs.length
        : 0;

      const suboptimalAvgTime = suboptimalLogs.length > 0
        ? suboptimalLogs.reduce((sum, l) => sum + (l.time_spent_seconds || 0), 0) / suboptimalLogs.length
        : 0;

      return {
        style,
        optimalCount: optimalLogs.length,
        suboptimalCount: suboptimalLogs.length,
        optimalCompletionRate,
        suboptimalCompletionRate,
        improvementMargin: optimalCompletionRate - suboptimalCompletionRate,
        optimalAvgTime: Math.floor(optimalAvgTime / 60), // minutos
        suboptimalAvgTime: Math.floor(suboptimalAvgTime / 60)
      };
    });
  };

  // Identificar alunos que NÃO estão recebendo recursos adequados
  const identifyMisalignedStudents = () => {
    const studentsWithLogs = {};

    logs.forEach(log => {
      if (!studentsWithLogs[log.student_email]) {
        studentsWithLogs[log.student_email] = {
          email: log.student_email,
          optimalAccess: 0,
          suboptimalAccess: 0
        };
      }

      if (log.is_optimal_match) {
        studentsWithLogs[log.student_email].optimalAccess++;
      } else {
        studentsWithLogs[log.student_email].suboptimalAccess++;
      }
    });

    // Calcular % de desalinhamento
    return Object.values(studentsWithLogs)
      .map(student => {
        const total = student.optimalAccess + student.suboptimalAccess;
        const optimalPercentage = total > 0 ? (student.optimalAccess / total) * 100 : 0;
        
        const studentData = users.find(u => u.email === student.email);
        
        return {
          ...student,
          full_name: studentData?.full_name || 'Unknown',
          vark_primary: studentData?.vark_primary_style || 'unknown',
          optimalPercentage,
          needsIntervention: optimalPercentage < 50 && total > 5
        };
      })
      .filter(s => s.needsIntervention)
      .sort((a, b) => a.optimalPercentage - b.optimalPercentage);
  };

  const effectiveness = calculateEffectiveness();
  const misalignedStudents = identifyMisalignedStudents();

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4 text-blue-600" />
          <p>Carregando analytics VARK...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Analytics VARK</h1>
        <p className="text-gray-600">
          Análise de eficácia da personalização por estilo de aprendizado
        </p>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-l-4 border-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-2xl font-bold">{logs.length}</p>
            <p className="text-sm text-gray-600">Acessos Rastreados</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold">
              {logs.filter(l => l.is_optimal_match).length}
            </p>
            <p className="text-sm text-gray-600">Matches Ótimos</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-2xl font-bold">{misalignedStudents.length}</p>
            <p className="text-sm text-gray-600">Alunos Desalinhados</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-2xl font-bold">
              {new Set(logs.map(l => l.student_email)).size}
            </p>
            <p className="text-sm text-gray-600">Alunos Ativos</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="effectiveness" value={selectedView} onValueChange={setSelectedView}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="effectiveness">Eficácia por Estilo</TabsTrigger>
          <TabsTrigger value="interventions">Intervenções Necessárias</TabsTrigger>
        </TabsList>

        <TabsContent value="effectiveness" className="space-y-4">
          {effectiveness.map(data => {
            const Icon = VARK_ICONS[data.style];
            const color = VARK_COLORS[data.style];

            return (
              <Card key={data.style} className="border-l-4" style={{ borderColor: color }}>
                <CardHeader className="bg-gray-50">
                  <CardTitle className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: color + '20' }}
                    >
                      <Icon className="w-6 h-6" style={{ color }} />
                    </div>
                    <div>
                      <h3 className="text-xl">{VARK_NAMES[data.style]}</h3>
                      <p className="text-sm text-gray-600 font-normal">
                        {data.optimalCount} acessos ótimos • {data.suboptimalCount} subótimos
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Taxa de Conclusão (Match)</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all"
                              style={{ 
                                width: `${data.optimalCompletionRate}%`,
                                backgroundColor: color 
                              }}
                            />
                          </div>
                        </div>
                        <span className="font-bold text-lg">{data.optimalCompletionRate.toFixed(0)}%</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Taxa de Conclusão (Mismatch)</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gray-400 rounded-full transition-all"
                              style={{ width: `${data.suboptimalCompletionRate}%` }}
                            />
                          </div>
                        </div>
                        <span className="font-bold text-lg text-gray-600">
                          {data.suboptimalCompletionRate.toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Melhoria com Match</p>
                      <div className={`text-2xl font-bold ${data.improvementMargin > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                        {data.improvementMargin > 0 ? '+' : ''}{data.improvementMargin.toFixed(0)}%
                      </div>
                      {data.improvementMargin > 20 && (
                        <Badge className="mt-2 bg-green-100 text-green-800">
                          Alto Impacto!
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t flex justify-between text-sm text-gray-600">
                    <span>Tempo médio (match): {data.optimalAvgTime}min</span>
                    <span>Tempo médio (mismatch): {data.suboptimalAvgTime}min</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="interventions" className="space-y-4">
          <Card className="border-2 border-orange-200 bg-orange-50 mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-orange-600 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Alunos Necessitando Intervenção</h3>
                  <p className="text-sm text-gray-700">
                    Estes alunos estão recebendo menos de 50% de recursos alinhados com seu perfil VARK.
                    Recomenda-se ajustar o conteúdo ou enriquecer a biblioteca de recursos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {misalignedStudents.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-600" />
                <h3 className="text-xl font-bold mb-2">Tudo Certo!</h3>
                <p className="text-gray-600">
                  Nenhum aluno necessita intervenção no momento. Todos estão recebendo recursos adequados.
                </p>
              </CardContent>
            </Card>
          ) : (
            misalignedStudents.map((student, idx) => {
              const Icon = VARK_ICONS[student.vark_primary] || Users;
              const color = VARK_COLORS[student.vark_primary] || '#666';

              return (
                <Card key={idx} className="border-l-4" style={{ borderColor: color }}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: color + '20' }}
                        >
                          <Icon className="w-6 h-6" style={{ color }} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{student.full_name}</h3>
                          <p className="text-sm text-gray-600">{student.email}</p>
                          <Badge className="mt-2" style={{ backgroundColor: color + '20', color }}>
                            Perfil: {VARK_NAMES[student.vark_primary]}
                          </Badge>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-3xl font-bold text-orange-600">
                          {student.optimalPercentage.toFixed(0)}%
                        </p>
                        <p className="text-sm text-gray-600">recursos adequados</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-700">
                        <strong>Ação Recomendada:</strong> Adicionar {3 - Math.floor(student.optimalPercentage / 33)} recursos {VARK_NAMES[student.vark_primary].toLowerCase()}s às próximas lições deste aluno.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}