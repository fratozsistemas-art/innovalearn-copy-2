import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Clock, 
  Target, 
  Lightbulb,
  Download,
  FileText,
  Activity
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function LessonPlanViewer({ lessonPlan, levelColor = 'var(--primary-teal)' }) {
  if (!lessonPlan) {
    return (
      <div className="text-center py-8">
        <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
        <p className="text-gray-600">Plano de aula não disponível para esta lição</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Downloads de PDFs */}
      {(lessonPlan.pdf_url || lessonPlan.additional_pdfs?.length > 0) && (
        <Card className="card-innova border-none shadow-lg">
          <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
            <CardTitle className="flex items-center gap-2 font-heading">
              <Download className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
              Materiais para Download
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              {lessonPlan.pdf_url && (
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => window.open(lessonPlan.pdf_url, '_blank')}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--primary-teal)20' }}>
                      <FileText className="w-6 h-6" style={{ color: 'var(--primary-teal)' }} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                        Plano de Aula Completo
                      </h4>
                      <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                        Documento detalhado com todas as informações da aula
                      </p>
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3 mr-2" />
                        Baixar PDF
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {lessonPlan.additional_pdfs?.map((pdf, idx) => (
                <Card key={idx} className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => window.open(pdf.url, '_blank')}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--accent-orange)20' }}>
                      <Activity className="w-6 h-6" style={{ color: 'var(--accent-orange)' }} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                        {pdf.title}
                      </h4>
                      <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                        {pdf.description}
                      </p>
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3 mr-2" />
                        Baixar PDF
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Visão Geral */}
      <Card className="card-innova border-none shadow-lg">
        <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-heading mb-2">
                {lessonPlan.title}
              </CardTitle>
              <p style={{ color: 'var(--text-secondary)' }}>
                {lessonPlan.overview}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" style={{ color: 'var(--primary-teal)' }} />
                Tema Central
              </h4>
              <p style={{ color: 'var(--text-secondary)' }}>{lessonPlan.theme}</p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" style={{ color: 'var(--accent-yellow)' }} />
                Pergunta Norteadora
              </h4>
              <p style={{ color: 'var(--text-secondary)' }}>{lessonPlan.guiding_question}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Objetivos */}
      {lessonPlan.main_objectives && (
        <Card className="card-innova border-none shadow-lg">
          <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
            <CardTitle className="flex items-center gap-2 font-heading">
              <Target className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
              Objetivos de Aprendizagem
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              {lessonPlan.main_objectives.knowledge && (
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
                    Conhecimento
                  </h4>
                  <ul className="space-y-2">
                    {lessonPlan.main_objectives.knowledge.map((item, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span>•</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {lessonPlan.main_objectives.skills && (
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: 'var(--success)' }}>
                    Habilidades
                  </h4>
                  <ul className="space-y-2">
                    {lessonPlan.main_objectives.skills.map((item, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span>•</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {lessonPlan.main_objectives.attitudes && (
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: 'var(--accent-orange)' }}>
                    Atitudes
                  </h4>
                  <ul className="space-y-2">
                    {lessonPlan.main_objectives.attitudes.map((item, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span>•</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estrutura da Aula */}
      {lessonPlan.lesson_structure && lessonPlan.lesson_structure.length > 0 && (
        <Card className="card-innova border-none shadow-lg">
          <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
            <CardTitle className="flex items-center gap-2 font-heading">
              <Clock className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
              Estrutura da Aula
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="space-y-4">
              {lessonPlan.lesson_structure.map((section, sectionIdx) => (
                <AccordionItem 
                  key={sectionIdx} 
                  value={`section-${sectionIdx}`}
                  className="border rounded-lg overflow-hidden"
                  style={{ borderColor: 'var(--neutral-medium)' }}
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline" style={{ backgroundColor: 'var(--neutral-light)' }}>
                    <div className="flex items-center justify-between w-full pr-4">
                      <span className="font-semibold">{section.section_name}</span>
                      <Badge>{section.duration_minutes} min</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-4">
                    <div className="space-y-6">
                      {section.activities?.map((activity, actIdx) => (
                        <div key={actIdx} className="p-4 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                              {activity.activity_name}
                            </h4>
                            <Badge variant="outline">{activity.duration_minutes} min</Badge>
                          </div>
                          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                            <strong>Objetivo:</strong> {activity.objective}
                          </p>
                          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                            {activity.description}
                          </p>
                          {activity.materials && activity.materials.length > 0 && (
                            <div className="mb-3">
                              <p className="text-sm font-semibold mb-1">Materiais:</p>
                              <div className="flex flex-wrap gap-2">
                                {activity.materials.map((material, matIdx) => (
                                  <Badge key={matIdx} variant="outline" className="text-xs">
                                    {material}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Materiais Necessários */}
      {lessonPlan.materials_needed && (
        <Card className="card-innova border-none shadow-lg">
          <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
            <CardTitle className="flex items-center gap-2 font-heading">
              <BookOpen className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
              Materiais Necessários
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              {lessonPlan.materials_needed.technology && (
                <div>
                  <h4 className="font-semibold mb-3">Tecnologia</h4>
                  <ul className="space-y-1">
                    {lessonPlan.materials_needed.technology.map((item, idx) => (
                      <li key={idx} className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {lessonPlan.materials_needed.physical_materials && (
                <div>
                  <h4 className="font-semibold mb-3">Materiais Físicos</h4>
                  <ul className="space-y-1">
                    {lessonPlan.materials_needed.physical_materials.map((item, idx) => (
                      <li key={idx} className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {lessonPlan.materials_needed.environment_setup && (
                <div>
                  <h4 className="font-semibold mb-3">Preparação do Ambiente</h4>
                  <ul className="space-y-1">
                    {lessonPlan.materials_needed.environment_setup.map((item, idx) => (
                      <li key={idx} className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}