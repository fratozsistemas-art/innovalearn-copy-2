import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, BookOpen } from "lucide-react";

const levelColors = {
  curiosity: 'var(--info)',
  discovery: 'var(--success)',
  pioneer: 'var(--accent-orange)',
  challenger: 'var(--error)'
};

const levelNames = {
  curiosity: 'Curiosity',
  discovery: 'Discovery',
  pioneer: 'Pioneer',
  challenger: 'Challenger'
};

export default function ClassOverviewCard({ classData, onClick }) {
  const levelColor = levelColors[classData.explorer_level] || 'var(--primary-teal)';
  const levelName = levelNames[classData.explorer_level] || classData.explorer_level;

  return (
    <Card 
      className="cursor-pointer hover:shadow-xl transition-all"
      onClick={onClick}
    >
      <div className="h-3" style={{ backgroundColor: levelColor }} />
      
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">{classData.name}</span>
          <Badge style={{ backgroundColor: levelColor, color: 'white' }}>
            {levelName}
          </Badge>
        </CardTitle>
        <p className="text-sm text-gray-600">
          {classData.year} • Semestre {classData.semester}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
            <Users className="w-5 h-5 mb-2" style={{ color: levelColor }} />
            <div className="text-2xl font-bold">0</div>
            <div className="text-xs text-gray-600">Alunos</div>
          </div>
          
          <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
            <TrendingUp className="w-5 h-5 mb-2" style={{ color: 'var(--success)' }} />
            <div className="text-2xl font-bold">0%</div>
            <div className="text-xs text-gray-600">Progresso Médio</div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Status</span>
            <Badge 
              variant={classData.status === 'active' ? 'default' : 'secondary'}
              style={classData.status === 'active' ? { 
                backgroundColor: 'var(--success)', 
                color: 'white' 
              } : {}}
            >
              {classData.status === 'active' ? 'Ativa' : 'Arquivada'}
            </Badge>
          </div>
        </div>

        <div className="pt-3 border-t flex items-center justify-between text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            Clique para ver analytics
          </span>
        </div>
      </CardContent>
    </Card>
  );
}