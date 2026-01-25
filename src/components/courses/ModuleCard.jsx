import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Calendar, Leaf, Rocket, Music, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

const moduleIcons = {
  'curiosity-1': Leaf,
  'curiosity-2': Rocket,
  'curiosity-3': Music,
  'curiosity-4': DollarSign,
  'discovery-1': BookOpen,
  'discovery-2': Rocket,
  'discovery-3': Music,
  'discovery-4': DollarSign
};

const moduleColors = {
  'curiosity-1': 'var(--success)',
  'curiosity-2': 'var(--info)',
  'curiosity-3': 'var(--accent-orange)',
  'curiosity-4': 'var(--warning)',
  'discovery-1': 'var(--success)',
  'discovery-2': 'var(--info)',
  'discovery-3': 'var(--accent-orange)',
  'discovery-4': 'var(--warning)'
};

export default function ModuleCard({ module, enrollment, onClick }) {
  const progress = enrollment?.progress || 0;
  const ModuleIcon = moduleIcons[module.id] || BookOpen;
  const moduleColor = moduleColors[module.id] || 'var(--primary-teal)';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card 
        className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-none overflow-hidden bg-white"
        onClick={onClick}
      >
        <div className="h-3" style={{ backgroundColor: moduleColor }} />
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: moduleColor }}
                >
                  <ModuleIcon className="w-6 h-6 text-white" />
                </div>
                <Badge style={{ backgroundColor: moduleColor }} className="border-0 text-white">
                  Semestre {module.semester}
                </Badge>
              </div>
              <CardTitle className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {module.title}
              </CardTitle>
              <p className="text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                {module.description}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {module.duration_weeks} semanas
            </span>
            {module.total_lessons && (
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {module.total_lessons} aulas
              </span>
            )}
          </div>

          {enrollment && (
            <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--neutral-medium)' }}>
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--text-secondary)' }}>Seu progresso</span>
                <span className="font-semibold" style={{ color: moduleColor }}>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}