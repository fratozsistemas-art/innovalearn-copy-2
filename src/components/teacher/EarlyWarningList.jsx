import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Mail, TrendingDown, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function EarlyWarningList({ atRiskStudents, showViewAll = false, detailed = false }) {
  const navigate = useNavigate();
  const [studentsWithData, setStudentsWithData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentData();
  }, [atRiskStudents]);

  const loadStudentData = async () => {
    if (atRiskStudents.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const allUsers = await base44.entities.User.list();
      
      const enrichedStudents = atRiskStudents.map(prediction => {
        const student = allUsers.find(u => u.email === prediction.student_email);
        return {
          ...prediction,
          full_name: student?.full_name || 'Unknown',
          email: prediction.student_email
        };
      });

      setStudentsWithData(enrichedStudents);
    } catch (error) {
      console.error('Error loading student data:', error);
    }
    setLoading(false);
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'critical': return 'var(--error)';
      case 'high': return 'var(--warning)';
      case 'moderate': return 'var(--accent-orange)';
      default: return 'var(--info)';
    }
  };

  const getRiskLabel = (level) => {
    switch (level) {
      case 'critical': return 'CRÍTICO';
      case 'high': return 'ALTO';
      case 'moderate': return 'MODERADO';
      default: return 'BAIXO';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" 
          style={{ borderColor: 'var(--primary-teal)' }}
        />
      </div>
    );
  }

  if (studentsWithData.length === 0) {
    return (
      <div className="text-center py-6 text-gray-600">
        <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p>Nenhum aluno em risco detectado</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {studentsWithData.map((student) => (
        <Card key={student.id} className="border-l-4" style={{ borderColor: getRiskColor(student.risk_level) }}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: getRiskColor(student.risk_level) + '20' }}
                >
                  <AlertTriangle className="w-5 h-5" style={{ color: getRiskColor(student.risk_level) }} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold mb-1">{student.full_name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{student.email}</p>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge style={{ 
                      backgroundColor: getRiskColor(student.risk_level), 
                      color: 'white' 
                    }}>
                      {getRiskLabel(student.risk_level)}
                    </Badge>
                    <Badge variant="outline">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      {student.churn_probability}% prob. evasão
                    </Badge>
                  </div>

                  {detailed && student.top_factors && (
                    <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
                      <p className="text-xs font-semibold mb-2">Principais Fatores de Risco:</p>
                      <ul className="text-xs space-y-1">
                        {student.top_factors.slice(0, 3).map((factor, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-gray-400">•</span>
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 ml-3">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => window.location.href = `mailto:${student.email}`}
                  title="Enviar email"
                >
                  <Mail className="w-4 h-4" />
                </Button>
                {detailed && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    title="Ver perfil completo"
                  >
                    <Clock className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {showViewAll && (
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={() => navigate(createPageUrl("EarlyWarningDashboard"))}
        >
          Ver Todos os Alertas
        </Button>
      )}
    </div>
  );
}