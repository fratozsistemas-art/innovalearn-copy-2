import React, { useState, useEffect, useCallback } from "react";
import { PioneerProject } from "@/entities/all";
import { User } from "@/entities/User";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Database, 
  Brain, 
  Rocket, 
  Users,
  Award,
  ChevronRight,
  Cloud,
  BookOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const PIONEER_MODULES = [
  {
    id: 'pioneer-1',
    name: 'CerradoWatch',
    subtitle: 'Sistema Nacional de Monitoramento Ambiental',
    description: 'Salvar o planeta com Computer Vision e Deep Learning avançado',
    technologies: ['TensorFlow', 'U-Net', 'FastAPI', 'Docker', 'Kubernetes'],
    stakeholders: ['IBAMA', 'ICMBio', 'INPE', 'Microsoft AI for Good'],
    icon: '🌍',
    color: 'var(--success)',
    difficulty: 'elite',
    impact: '1M+ hectares monitorados'
  },
  {
    id: 'pioneer-2',
    name: 'SETI-AI',
    subtitle: 'Sistema Global de Busca por Inteligência Extraterrestre',
    description: 'Revolucionar exploração espacial com Transformers e análise de sinais',
    technologies: ['PyTorch', 'Transformers', 'Apache Spark', 'CUDA'],
    stakeholders: ['SETI Institute', 'NASA', 'ESA', 'Square Kilometre Array'],
    icon: '🔭',
    color: 'var(--info)',
    difficulty: 'elite',
    impact: 'Petabytes de dados astronômicos'
  },
  {
    id: 'pioneer-3',
    name: 'ArtStrategy',
    subtitle: 'Plataforma Global de IA Criativa e Estratégica',
    description: 'Criar próxima geração de arte e estratégia com GANs e RL',
    technologies: ['GANs', 'Reinforcement Learning', 'WebRTC', 'Microserviços'],
    stakeholders: ['Spotify', 'Chess.com', 'Orquestra Sinfônica'],
    icon: '🎨',
    color: 'var(--accent-orange)',
    difficulty: 'elite',
    impact: '100K+ usuários simultâneos'
  },
  {
    id: 'pioneer-4',
    name: 'EthicalFinAI',
    subtitle: 'Plataforma Nacional de Educação Financeira Inteligente',
    description: 'Liderar revolução FinTech com BERT/GPT e blockchain',
    technologies: ['BERT/GPT', 'Blockchain', 'Kafka', 'Microserviços'],
    stakeholders: ['Banco Central', 'Nubank', 'Stone', 'B3'],
    icon: '💰',
    color: 'var(--warning)',
    difficulty: 'elite',
    impact: '1M+ brasileiros impactados'
  }
];

export default function PioneerPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const userData = await User.me();
    setUser(userData);

    if (userData.explorer_level !== 'pioneer' && userData.explorer_level !== 'challenger') {
      navigate(createPageUrl("Dashboard"));
      return;
    }

    const projectsData = await PioneerProject.filter({ student_email: userData.email });
    setProjects(projectsData);

    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStartProject = async (moduleId) => {
    const module = PIONEER_MODULES.find(m => m.id === moduleId);
    
    await PioneerProject.create({
      project_name: `${module.name} - ${user.full_name}`,
      module_id: moduleId,
      student_email: user.email,
      enterprise_stakeholders: module.stakeholders.map(s => ({
        name: s,
        organization: s,
        role: 'Enterprise Stakeholder',
        engagement_level: 'active'
      })),
      technologies_stack: module.technologies,
      status: 'planning'
    });

    navigate(createPageUrl("PioneerProject") + `?module=${moduleId}`);
  };

  if (loading) {
    return <div className="p-8">Carregando Pioneer...</div>;
  }

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="relative overflow-hidden rounded-2xl p-8 text-white"
          style={{ 
            background: 'linear-gradient(135deg, var(--primary-navy) 0%, var(--error) 50%, var(--accent-orange) 100%)'
          }}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Rocket className="w-10 h-10" />
              <Badge className="border-0" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                12+ anos
              </Badge>
            </div>
            <h1 className="text-4xl font-heading font-bold mb-3">
              Programa Pioneer
            </h1>
            <p className="text-xl mb-6 opacity-90">
              Deep Learning Elite + Sistemas Full-Stack + Pesquisa Científica
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: <Brain className="w-6 h-6" />, label: 'Deep Learning Avançado' },
                { icon: <Cloud className="w-6 h-6" />, label: 'Cloud & Kubernetes' },
                { icon: <Database className="w-6 h-6" />, label: 'Sistemas Escaláveis' },
                { icon: <BookOpen className="w-6 h-6" />, label: 'Publicações Científicas' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 rounded-xl" 
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-heading font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Escolha Seu Projeto de Elite
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {PIONEER_MODULES.map((module) => {
              const existingProject = projects.find(p => p.module_id === module.id);
              
              return (
                <Card 
                  key={module.id}
                  className="card-innova border-none shadow-lg hover:shadow-2xl transition-all overflow-hidden"
                >
                  <div className="h-2" style={{ backgroundColor: module.color }} />
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                          style={{ backgroundColor: `${module.color}20` }}
                        >
                          {module.icon}
                        </div>
                        <div>
                          <CardTitle className="text-xl font-heading">{module.name}</CardTitle>
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {module.subtitle}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        className="border-0"
                        style={{ 
                          backgroundColor: 'var(--error)',
                          color: 'white'
                        }}
                      >
                        Elite
                      </Badge>
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      {module.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Stack Tecnológico:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {module.technologies.map((tech, idx) => (
                          <Badge 
                            key={idx}
                            variant="outline"
                            style={{ borderColor: module.color, color: module.color }}
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Stakeholders Empresariais:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {module.stakeholders.map((stakeholder, idx) => (
                          <Badge 
                            key={idx}
                            className="border-0 bg-opacity-10"
                            style={{ backgroundColor: `${module.color}20`, color: module.color }}
                          >
                            <Users className="w-3 h-3 mr-1" />
                            {stakeholder}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        🎯 Impacto: {module.impact}
                      </p>
                    </div>

                    {existingProject ? (
                      <Button 
                        className="w-full btn-secondary"
                        onClick={() => navigate(createPageUrl("PioneerProject") + `?id=${existingProject.id}`)}
                      >
                        Continuar Projeto
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button 
                        className="w-full btn-primary"
                        onClick={() => handleStartProject(module.id)}
                      >
                        Iniciar Projeto Elite
                        <Rocket className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <Card className="card-innova border-none shadow-lg">
          <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
            <CardTitle className="flex items-center gap-2 font-heading">
              <Award className="w-6 h-6" style={{ color: 'var(--accent-yellow)' }} />
              Certificações Pioneer
            </CardTitle>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Prepare-se para certificações reconhecidas globalmente
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: 'Deep Learning Architect', provider: 'Innova Academy', progress: 0 },
                { name: 'Systems Architect', provider: 'Innova Academy', progress: 0 },
                { name: 'TensorFlow Developer', provider: 'Google', progress: 0 },
                { name: 'AWS ML Specialty', provider: 'Amazon', progress: 0 }
              ].map((cert, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-xl border-2"
                  style={{ borderColor: 'var(--neutral-medium)', backgroundColor: 'var(--background)' }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-5 h-5" style={{ color: 'var(--accent-yellow)' }} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                        {cert.name}
                      </h4>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {cert.provider}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span style={{ color: 'var(--text-secondary)' }}>Progresso</span>
                      <span className="font-semibold" style={{ color: 'var(--primary-teal)' }}>
                        {cert.progress}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--neutral-light)' }}>
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          width: `${cert.progress}%`,
                          backgroundColor: 'var(--primary-teal)'
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}