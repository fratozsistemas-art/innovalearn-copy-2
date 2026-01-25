import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, TrendingUp } from "lucide-react";

export default function WelcomeCard({ userName, totalCourses, completedAssignments }) {
  return (
    <Card className="card-innova border-none shadow-2xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, var(--primary-teal) 0%, var(--primary-navy) 100%)' }}>
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: 'var(--accent-orange)' }} />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: 'var(--accent-yellow)' }} />
      
      <CardContent className="p-8 relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5" style={{ color: 'var(--accent-yellow)' }} />
              <span className="text-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Bem-vindo de volta!</span>
            </div>
            <h2 className="text-3xl font-heading font-bold mb-2" style={{ color: 'var(--background)' }}>
              Olá, {userName}!
            </h2>
            <p className="text-lg" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
              Continue sua jornada de aprendizado
            </p>
          </div>
          <div className="hidden md:block p-4 backdrop-blur-sm rounded-2xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
            <TrendingUp className="w-8 h-8" style={{ color: 'var(--accent-yellow)' }} />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="backdrop-blur-sm rounded-xl p-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <p className="text-sm mb-1" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Cursos Ativos</p>
            <p className="text-3xl font-heading font-bold" style={{ color: 'var(--background)' }}>{totalCourses}</p>
          </div>
          <div className="backdrop-blur-sm rounded-xl p-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <p className="text-sm mb-1" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Tarefas Concluídas</p>
            <p className="text-3xl font-heading font-bold" style={{ color: 'var(--background)' }}>{completedAssignments}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}