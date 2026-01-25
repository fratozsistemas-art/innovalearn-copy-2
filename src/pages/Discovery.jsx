import React, { useState, useEffect, useCallback } from "react";
import { DiscoveryProject } from "@/entities/all";
import { User } from "@/entities/User";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Code, 
  Database, 
  Brain, 
  Rocket, 
  Users,
  Award,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const DISCOVERY_MODULES = [
  {
    id: 'discovery-1',
    name: 'ClimatePredict',
    subtitle: 'Sistema Preditivo Ambiental',
    description: 'Prever o futuro do clima com Machine Learning e dados reais',
    technologies: ['Python', 'Pandas', 'Scikit-learn', 'Matplotlib'],
    stakeholders: ['INMET', 'UnB Geografia', 'WWF Brasil'],
    icon: '🌍',
    color: 'var(--success)',
    difficulty: 'advanced'
  },
  {
    id: 'discovery-2',
    name: 'SkyNet',
    subtitle: 'Rede de Telescópios Inteligentes',
    description: 'Construir IA para explorar o universo e detectar objetos astronômicos',
    technologies: ['TensorFlow', 'OpenCV', 'Raspberry Pi', 'APIs NASA'],
    stakeholders: ['Observatório Nacional', 'NASA', 'UnB Astronomia'],
    icon: '🔭',
    color: 'var(--info)',
    difficulty: 'expert'
  },
  {
    id: 'discovery-3',
    name: 'MusicChess',
    subtitle: 'IA Musical e Estratégica',
    description: 'Criar inteligência que compõe música baseada em estratégia de xadrez',
    technologies: ['Librosa', 'TensorFlow', 'Chess.js', 'Web Audio API'],
    stakeholders: ['Orquestra Sinfônica', 'Federação Xadrez DF'],
    icon: '🎵',
    color: 'var(--accent-orange)',
    difficulty: 'advanced'
  },
  {
    id: 'discovery-4',
    name: 'FinanceAI',
    subtitle: 'Plataforma de Educação Financeira Inteligente',
    description: 'Revolucionar educação financeira com IA e blockchain',
    technologies: ['NLP', 'BERT', 'APIs Financeiras', 'Blockchain'],
    stakeholders: ['Banco Central', 'Fintechs', 'SEBRAE'],
    icon: '💰',
    color: 'var(--warning)',
    difficulty: 'expert'
  }
];

export default function DiscoveryPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const userData = await User.me();
    setUser(userData);

    if (userData.explorer_level !== 'discovery' && userData.explorer_level !== 'pioneer' && userData.explorer_level !== 'challenger') {
      navigate(createPageUrl("Dashboard"));
      return;
    }

    const projectsData = await DiscoveryProject.filter({ student_email: userData.email });
    setProjects(projectsData);

    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStartProject = async (moduleId) => {
    const module = DISCOVERY_MODULES.find(m => m.id === moduleId);
    
    await DiscoveryProject.create({
      project_name: `${module.name} - ${user.full_name}`,
      module_id: moduleId,
      student_email: user.email,
      stakeholders: module.stakeholders.map(s => ({
        name: s,
        organization: s,
        role: 'Stakeholder',
        contact: ''
      })),
      technologies_used: module.technologies,
      status: 'planning'
    });

    navigate(createPageUrl("DiscoveryProject") + `?module=${moduleId}`);
  };

  if (loading) {
    return <div className="p-8">Carregando Discovery...</div>;
  }

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="relative overflow-hidden rounded-2xl p-8 text-white"
          style={{ 
            background: 'linear-gradient(135deg, var(--primary-navy) 0%, var(--primary-teal) 50%, var(--info) 100%)'
          }}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Code className="w-10 h-10" />
              <Badge className="border-0" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                9+ anos
              </Badge>
            </div>
            <h1 className="text-4xl font-heading font-bold mb-3">
              Programa Discovery
            </h1>
            <p className="text-xl mb-6 opacity-90">
              Python Real + Machine Learning + Projetos com Impacto Real
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: <Code className="w-6 h-6" />, label: 'Python Profissional' },
                { icon: <Brain className="w-6 h-6" />, label: 'Machine Learning' },
                { icon: <Database className="w-6 h-6" />, label: 'Dados Reais' },
                { icon: <Users className="w-6 h-6" />, label: 'Stakeholders Reais' }
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
            Escolha Seu Projeto
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {DISCOVERY_MODULES.map((module) => {
              const existingProject = projects.find(p => p.module_id === module.id);
              
              return (
                <Card 
                  key={module.id}
                  className="card-innova border-none shadow-lg hover:shadow-xl transition-all overflow-hidden"
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
                          backgroundColor: module.difficulty === 'expert' ? 'var(--error)' : 'var(--warning)',
                          color: 'white'
                        }}
                      >
                        {module.difficulty === 'expert' ? 'Expert' : 'Avançado'}
                      </Badge>
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      {module.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Tecnologias:
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
                        Stakeholders Reais:
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

                    {existingProject ? (
                      <Button 
                        className="w-full btn-secondary"
                        onClick={() => navigate(createPageUrl("DiscoveryProject") + `?id=${existingProject.id}`)}
                      >
                        Continuar Projeto
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button 
                        className="w-full btn-primary"
                        onClick={() => handleStartProject(module.id)}
                      >
                        Iniciar Projeto
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
              Certificações Discovery
            </CardTitle>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Complete projetos e obtenha certificações reconhecidas
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: 'Python Proficiency', provider: 'Innova Academy', progress: 45 },
                { name: 'ML Fundamentals', provider: 'Innova Academy', progress: 20 },
                { name: 'Data Science', provider: 'Innova Academy', progress: 10 }
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