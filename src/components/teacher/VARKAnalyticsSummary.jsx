import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Ear, BookText, Hand, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

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

export default function VARKAnalyticsSummary({ classes }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [varkStats, setVarkStats] = useState({
    byStyle: {},
    totalStudents: 0,
    averageMatch: 0
  });

  useEffect(() => {
    if (classes.length > 0) {
      loadVARKStats();
    }
  }, [classes]);

  const loadVARKStats = async () => {
    setLoading(true);
    try {
      // Get all students from all classes
      const allStudentEmails = [];
      for (const classItem of classes) {
        const classStudents = await base44.entities.ClassStudent.filter({ 
          class_id: classItem.id,
          status: 'active'
        });
        allStudentEmails.push(...classStudents.map(cs => cs.student_email));
      }

      if (allStudentEmails.length === 0) {
        setLoading(false);
        return;
      }

      // Get all users
      const allUsers = await base44.entities.User.list();
      const students = allUsers.filter(u => allStudentEmails.includes(u.email));

      // Count by VARK style
      const styleCount = {
        visual: 0,
        auditory: 0,
        read_write: 0,
        kinesthetic: 0,
        multimodal: 0
      };

      students.forEach(student => {
        const style = student.vark_primary_style || 'multimodal';
        styleCount[style] = (styleCount[style] || 0) + 1;
      });

      setVarkStats({
        byStyle: styleCount,
        totalStudents: students.length,
        averageMatch: 75 // Placeholder - could calculate from logs
      });

    } catch (error) {
      console.error('Error loading VARK stats:', error);
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
          <p className="text-gray-600">Carregando analytics VARK...</p>
        </CardContent>
      </Card>
    );
  }

  if (varkStats.totalStudents === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <BookText className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-gray-600">Nenhum aluno encontrado nas turmas</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
            Distribuição VARK nas Suas Turmas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(VARK_ICONS).map(([style, Icon]) => {
              const count = varkStats.byStyle[style] || 0;
              const percentage = varkStats.totalStudents > 0 
                ? Math.round((count / varkStats.totalStudents) * 100) 
                : 0;

              return (
                <Card key={style} className="border-l-4" style={{ borderColor: VARK_COLORS[style] }}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: VARK_COLORS[style] + '20' }}
                      >
                        <Icon className="w-6 h-6" style={{ color: VARK_COLORS[style] }} />
                      </div>
                      <div>
                        <h4 className="font-semibold">{VARK_NAMES[style]}</h4>
                        <p className="text-sm text-gray-600">{count} alunos</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Distribuição</span>
                        <span className="font-semibold">{percentage}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full transition-all"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: VARK_COLORS[style]
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
            <h4 className="font-semibold mb-2">Resumo Geral</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total de Alunos:</span>
                <span className="font-semibold ml-2">{varkStats.totalStudents}</span>
              </div>
              <div>
                <span className="text-gray-600">Taxa Média de Match:</span>
                <span className="font-semibold ml-2 text-green-600">{varkStats.averageMatch}%</span>
              </div>
              <div>
                <span className="text-gray-600">Estilo Predominante:</span>
                <span className="font-semibold ml-2">
                  {Object.entries(varkStats.byStyle).reduce((a, b) => 
                    (varkStats.byStyle[a[0]] || 0) > (varkStats.byStyle[b[0]] || 0) ? a : b
                  )[0].toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Button 
              className="w-full"
              onClick={() => navigate(createPageUrl("VARKAnalytics"))}
            >
              Ver Dashboard Completo de VARK Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}