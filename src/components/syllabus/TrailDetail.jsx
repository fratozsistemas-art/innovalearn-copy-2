
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, BookOpen, Calendar, TrendingUp, Link as LinkIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Lesson, Module } from "@/entities/all";

const trailColors = {
  sustentabilidade: 'var(--success)',
  mudancas_climaticas: 'var(--info)',
  musica: 'var(--accent-orange)',
  educacao_financeira: 'var(--warning)',
  pensamento_sistemico: 'var(--primary-teal)',
  iot: 'var(--info)',
  astrofisica: 'var(--primary-navy)',
  xadrez: 'var(--neutral-dark)',
  empreendedorismo: 'var(--accent-orange)'
};

const levelNames = {
  curiosity: 'Curiosity',
  discovery: 'Discovery',
  pioneer: 'Pioneer',
  challenger: 'Challenger'
};

const levelColors = {
  curiosity: 'var(--info)',
  discovery: 'var(--success)',
  pioneer: 'var(--accent-orange)',
  challenger: 'var(--error)'
};

export default function TrailDetail({ trail, onClose }) {
  const [lessons, setLessons] = useState([]);
  const [modules, setModules] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrailLessons = async () => {
      setLoading(true);
      
      // Carregar todas as lições
      const allLessons = await Lesson.list();
      
      // Filtrar lições que pertencem a esta trilha
      // Uma lição pode aparecer em VÁRIOS cursos (recall anual)
      // mas é a MESMA lição (mesmo ID) apenas revisitada com mais complexidade
      const trailLessons = allLessons.filter(lesson => 
        lesson.transversal_trails && lesson.transversal_trails.includes(trail.id)
      );

      // Ordenar por curso e ordem
      trailLessons.sort((a, b) => {
        const courseOrder = { curiosity: 1, discovery: 2, pioneer: 3, challenger: 4 };
        if (courseOrder[a.course_id] !== courseOrder[b.course_id]) {
          return courseOrder[a.course_id] - courseOrder[b.course_id];
        }
        return (a.order || 0) - (b.order || 0);
      });

      setLessons(trailLessons);

      // Carregar módulos relacionados
      const moduleIds = [...new Set(trailLessons.map(l => l.module_id))];
      const allModules = await Module.list();
      const modulesMap = {};
      allModules.forEach(m => {
        if (moduleIds.includes(m.id)) {
          modulesMap[m.id] = m;
        }
      });
      setModules(modulesMap);

      setLoading(false);
    };

    loadTrailLessons();
  }, [trail]);

  const trailColor = trailColors[trail.id] || 'var(--primary-teal)';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl max-h-[90vh] overflow-auto"
      >
        <Card className="border-none shadow-2xl">
          <CardHeader 
            className="border-b text-white"
            style={{ backgroundColor: trailColor }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{trail.icon}</span>
                  <CardTitle className="text-2xl">{trail.name}</CardTitle>
                </div>
                <p className="opacity-90 mb-3">{trail.description}</p>
                <Badge className="border-0 text-sm" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  Recall {trail.pattern === 'odd' ? 'Anos Ímpares (1, 3, 5, 7)' : 'Anos Pares (2, 4, 6, 8)'}
                </Badge>
                <p className="text-sm mt-2 opacity-80">
                  ⚠️ As mesmas lições são revisitadas anualmente com complexidade crescente
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
                  style={{ borderColor: trailColor }}
                ></div>
                <p style={{ color: 'var(--text-secondary)' }}>Carregando conexões da trilha...</p>
              </div>
            ) : lessons.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5" style={{ color: trailColor }} />
                  <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                    {lessons.length} Lições Únicas (Revisitadas Anualmente)
                  </h3>
                </div>

                {/* Agrupar por curso */}
                {['curiosity', 'discovery', 'pioneer', 'challenger'].map(courseId => {
                  const courseLessons = lessons.filter(l => l.course_id === courseId);
                  if (courseLessons.length === 0) return null;

                  return (
                    <div key={courseId} className="space-y-3">
                      <div className="flex items-center gap-2 mb-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: levelColors[courseId] }}
                        />
                        <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {levelNames[courseId]} ({courseLessons.length} lições)
                        </h4>
                      </div>

                      <div className="space-y-2">
                        {courseLessons.map((lesson, idx) => {
                          const module = modules[lesson.module_id];
                          
                          return (
                            <div
                              key={lesson.id}
                              className="p-4 rounded-xl border-l-4 hover:shadow-md transition-all"
                              style={{ 
                                borderColor: trailColor,
                                backgroundColor: 'var(--neutral-light)'
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <div 
                                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                  style={{ backgroundColor: levelColors[courseId] }}
                                >
                                  <span className="text-sm font-bold text-white">{lesson.order}</span>
                                </div>
                                
                                <div className="flex-1">
                                  <h5 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                                    {lesson.title}
                                  </h5>
                                  <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                                    {lesson.description}
                                  </p>
                                  
                                  {lesson.trail_connection && (
                                    <div className="p-2 rounded-lg mb-2" style={{ backgroundColor: `${trailColor}10` }}>
                                      <p className="text-xs flex items-start gap-2" style={{ color: 'var(--text-primary)' }}>
                                        <LinkIcon className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: trailColor }} />
                                        <span>{lesson.trail_connection}</span>
                                      </p>
                                    </div>
                                  )}

                                  <div className="flex flex-wrap gap-2">
                                    {module && (
                                      <Badge variant="outline" className="text-xs">
                                        <BookOpen className="w-3 h-3 mr-1" />
                                        {module.title}
                                      </Badge>
                                    )}
                                    <Badge variant="outline" className="text-xs">
                                      <Calendar className="w-3 h-3 mr-1" />
                                      {lesson.duration_minutes} min
                                    </Badge>
                                    <Badge className="text-xs border-0" 
                                      style={{ backgroundColor: levelColors[courseId], color: 'white' }}
                                    >
                                      {lesson.media_type}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Lições em Desenvolvimento
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  As lições conectadas a esta trilha serão adicionadas em breve
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
