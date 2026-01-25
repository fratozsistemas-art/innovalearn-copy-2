import React, { useState, useEffect, useCallback } from "react";
import { ChallengerProject } from "@/entities/all";
import { User } from "@/entities/User";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Globe, 
  Sparkles, 
  Trophy, 
  Users,
  Award,
  ChevronRight,
  Crown,
  Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const CHALLENGER_MODULES = [
  {
    id: 'challenger-1',
    name: 'EarthAI',
    subtitle: 'Sistema Global de Inteligência Climática',
    description: 'Liderar revolução sustentável global com Quantum ML e IoT planetário',
    technologies: ['Quantum ML', 'Satellite Constellations', 'Global IoT', 'Carbon Markets'],
    stakeholders: ['ONU', 'União Europeia', 'Banco Mundial', 'Google.org', 'Tesla'],
    icon: '🌍',
    color: 'var(--success)',
    difficulty: 'civilizational',
    impact: '2B+ pessoas protegidas',
    unicornTarget: '$5B ClimateAI Unicorn'
  },
  {
    id: 'challenger-2',
    name: 'SpaceAI',
    subtitle: 'Ecossistema de IA para Exploração Espacial',
    description: 'Liderar próxima era da exploração espacial com Quantum Computing',
    technologies: ['Quantum Computing', 'Edge AI Espacial', 'Sistemas Autônomos Planetários'],
    stakeholders: ['NASA', 'ESA', 'SpaceX', 'Blue Origin', 'MIT Media Lab'],
    icon: '🚀',
    color: 'var(--info)',
    difficulty: 'civilizational',
    impact: 'Colonização de Marte + $1T economia espacial',
    unicornTarget: '$10B SpaceAI Unicorn'
  },
  {
    id: 'challenger-3',
    name: 'CulturalAI',
    subtitle: 'Plataforma Global de Criação Cultural',
    description: 'Criar revolução cultural global com Generative AI e Neural Interfaces',
    technologies: ['Generative AI', 'Neural Interfaces', 'Global Streaming', 'AR/VR'],
    stakeholders: ['UNESCO', 'Spotify', 'Netflix', 'Meta', 'NVIDIA'],
    icon: '🎨',
    color: 'var(--accent-orange)',
    difficulty: 'civilizational',
    impact: '1B+ criadores empoderados',
    unicornTarget: '$15B CulturalAI Unicorn'
  },
  {
    id: 'challenger-4',
    name: 'GlobalFinAI',
    subtitle: 'Sistema Financeiro Global Ético',
    description: 'Liderar revolução FinTech global com Blockchain e DeFi',
    technologies: ['Blockchain', 'DeFi', 'CBDCs', 'AI Ethics'],
    stakeholders: ['Banco Mundial', 'FMI', 'Federal Reserve', 'Ethereum Foundation'],
    icon: '💰',
    color: 'var(--warning)',
    difficulty: 'civilizational',
    impact: '3B+ pessoas incluídas financeiramente',
    unicornTarget: '$20B GlobalFinAI Unicorn'
  },
  {
    id: 'challenger-5',
    name: 'Sua Startup Unicórnio',
    subtitle: 'Criação de Unicórnio de Base Tecnológica',
    description: 'ÚNICO: Criar e liderar próprio unicórnio do zero até IPO',
    technologies: ['Startup Stack Completo', 'VC', 'Global Scaling', 'IPO'],
    stakeholders: ['Y Combinator', 'Sequoia', 'a16z', 'SoftBank'],
    icon: '🦄',
    color: 'var(--error)',
    difficulty: 'civilizational',
    impact: 'Transformação de indústria inteira',
    unicornTarget: 'Startup real $1B+ com IPO $10B+'
  }
];

export default function ChallengerPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const userData = await User.me();
    setUser(userData);

    if (userData.explorer_level !== 'challenger') {
      navigate(createPageUrl("Dashboard"));
      return;
    }

    const projectsData = await ChallengerProject.filter({ student_email: userData.email });
    setProjects(projectsData);

    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStartProject = async (moduleId) => {
    const module = CHALLENGER_MODULES.find(m => m.id === moduleId);
    
    await ChallengerProject.create({
      project_name: `${module.name} - ${user.full_name}`,
      module_id: moduleId,
      student_email: user.email,
      global_stakeholders: module.stakeholders.map(s => ({
        name: s,
        organization: s,
        level: 'international',
        engagement: 'active'
      })),
      cutting_edge_technologies: module.technologies,
      status: 'ideation'
    });

    navigate(createPageUrl("ChallengerProject") + `?module=${moduleId}`);
  };

  if (loading) {
    return <div className="p-8">Carregando Challenger...</div>;
  }

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="relative overflow-hidden rounded-2xl p-8 text-white"
          style={{ 
            background: 'linear-gradient(135deg, #2C3E50 0%, #E74C3C 25%, #F39C12 50%, #8E44AD 75%, #3498DB 100%)'
          }}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-12 h-12" />
              <Badge className="border-0 text-lg px-4 py-2" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                14+ anos • Elite Global
              </Badge>
            </div>
            <h1 className="text-5xl font-heading font-bold mb-4">
              Programa Challenger
            </h1>
            <p className="text-2xl mb-6 opacity-90">
              Liderança Global + Criação de Unicórnios + Transformação Civilizacional
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { icon: <Sparkles className="w-6 h-6" />, label: 'Quantum ML' },
                { icon: <Globe className="w-6 h-6" />, label: 'Impacto Global' },
                { icon: <Trophy className="w-6 h-6" />, label: 'Unicórnios $1B+' },
                { icon: <Star className="w-6 h-6" />, label: 'Forbes 30 Under 30' },
                { icon: <Crown className="w-6 h-6" />, label: 'Liderança Mundial' }
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
          <h2 className="text-3xl font-heading font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Escolha Seu Projeto Civilizacional
          </h2>
          <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
            5 módulos únicos • 2.5 anos • Impacto em bilhões de pessoas • Criação de unicórnios reais
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {CHALLENGER_MODULES.map((module) => {
              const existingProject = projects.find(p => p.module_id === module.id);
              
              return (
                <Card 
                  key={module.id}
                  className="card-innova border-none shadow-2xl hover:shadow-3xl transition-all overflow-hidden"
                >
                  <div className="h-3" style={{ backgroundColor: module.color }} />
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
                          style={{ backgroundColor: `${module.color}20` }}
                        >
                          {module.icon}
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-heading">{module.name}</CardTitle>
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {module.subtitle}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        className="border-0 text-white"
                        style={{ backgroundColor: '#8E44AD' }}
                      >
                        Civilizational
                      </Badge>
                    </div>
                    <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
                      {module.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                        🚀 Tecnologias de Ponta:
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
                        🌍 Stakeholders Globais:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {module.stakeholders.map((stakeholder, idx) => (
                          <Badge 
                            key={idx}
                            className="border-0"
                            style={{ backgroundColor: `${module.color}20`, color: module.color }}
                          >
                            <Users className="w-3 h-3 mr-1" />
                            {stakeholder}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--neutral-light)' }}>
                      <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                        🎯 Impacto: {module.impact}
                      </p>
                      <p className="text-sm font-semibold" style={{ color: 'var(--accent-yellow)' }}>
                        🦄 Target: {module.unicornTarget}
                      </p>
                    </div>

                    {existingProject ? (
                      <Button 
                        className="w-full btn-secondary"
                        onClick={() => navigate(createPageUrl("ChallengerProject") + `?id=${existingProject.id}`)}
                      >
                        Continuar Projeto Civilizacional
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button 
                        className="w-full text-white"
                        style={{ backgroundColor: module.color }}
                        onClick={() => handleStartProject(module.id)}
                      >
                        Iniciar Projeto Civilizacional
                        <Crown className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <Card className="card-innova border-none shadow-2xl">
          <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
            <CardTitle className="flex items-center gap-2 font-heading">
              <Award className="w-6 h-6" style={{ color: 'var(--accent-yellow)' }} />
              Reconhecimento Global e Certificações de Elite
            </CardTitle>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Prepare-se para reconhecimento mundial e liderança civilizacional
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: 'Global Leader', provider: 'Innova Academy', prestige: 'Lifetime Achievement' },
                { name: 'Unicorn Creator', provider: 'Innova Academy', prestige: 'Exceptional' },
                { name: 'Forbes 30 Under 30', provider: 'Forbes', prestige: 'Very High' },
                { name: 'TIME 100 Next', provider: 'TIME', prestige: 'Exceptional' },
                { name: 'WEF Young Global Leader', provider: 'World Economic Forum', prestige: 'Exceptional' },
                { name: 'MIT Innovators Under 35', provider: 'MIT Technology Review', prestige: 'Very High' }
              ].map((cert, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-xl border-2 hover:shadow-lg transition-all"
                  style={{ borderColor: 'var(--accent-yellow)', backgroundColor: 'var(--background)' }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-6 h-6" style={{ color: 'var(--accent-yellow)' }} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                        {cert.name}
                      </h4>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {cert.provider}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    className="border-0 w-full justify-center"
                    style={{ backgroundColor: 'var(--accent-yellow)', color: 'var(--primary-navy)' }}
                  >
                    {cert.prestige}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-innova border-none shadow-lg" style={{ borderLeft: `4px solid var(--accent-yellow)` }}>
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Crown className="w-8 h-8 mt-1" style={{ color: 'var(--accent-yellow)' }} />
              <div>
                <h3 className="font-semibold text-xl mb-3" style={{ color: 'var(--text-primary)' }}>
                  O Ápice da Educação em IA e Liderança Global
                </h3>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  O programa Challenger representa o <strong>pináculo da excelência educacional</strong>, 
                  preparando líderes que não apenas participam da história, mas <strong>criam a história da humanidade</strong> 
                  através de inovação responsável e transformação sistêmica positiva.
                </p>
                <ul className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
                  <li><strong>• Quantum Machine Learning:</strong> IA de ponta para desafios civilizacionais</li>
                  <li><strong>• Liderança Global:</strong> Stakeholders como ONU, NASA, Banco Mundial</li>
                  <li><strong>• Criação de Unicórnios:</strong> Startups reais com $1B+ valuation</li>
                  <li><strong>• Impacto em Bilhões:</strong> Transformação de indústrias inteiras</li>
                  <li><strong>• Reconhecimento Mundial:</strong> Forbes, TIME, WEF</li>
                  <li><strong>• Legado Civilizacional:</strong> Contribuições que transcendem gerações</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}