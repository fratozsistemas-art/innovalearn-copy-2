
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Ear, BookOpen, Hand, Sparkles, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VARK_CONFIG = {
  visual: {
    name: 'Ver e Visualizar',
    icon: Eye,
    color: '#3B82F6',
    label: 'Prefiro VER como funciona'
  },
  auditory: {
    name: 'Ouvir e Escutar',
    icon: Ear,
    color: '#10B981',
    label: 'Prefiro OUVIR explicações'
  },
  read_write: {
    name: 'Ler e Escrever',
    icon: BookOpen, // Changed from BookText to BookOpen
    color: '#F59E0B',
    label: 'Prefiro LER sobre o assunto'
  },
  kinesthetic: {
    name: 'Fazer e Experimentar',
    icon: Hand,
    color: '#EF4444',
    label: 'Prefiro EXPERIMENTAR na prática'
  }
};

// Curiosidades por nível de explorador
const CURIOSITIES_BY_LEVEL = {
  curiosity: [
    {
      id: 1,
      question: "🤖 Como os robôs reconhecem seu rosto?",
      emoji: "🤖",
      options: {
        visual: {
          title: "Assistir Vídeo Animado",
          description: "Vídeo divertido mostrando como funciona",
          url: "https://www.youtube.com/embed/QH2-TGUlwu4",
          type: "youtube",
          duration: "3 min"
        },
        auditory: {
          title: "Ouvir História Narrada",
          description: "História sobre um robô que aprende rostos",
          url: "https://www.youtube.com/embed/gAxN0SyyIfs",
          type: "youtube",
          duration: "5 min"
        },
        read_write: {
          title: "Ler Quadrinhos Digitais",
          description: "HQ explicando reconhecimento facial",
          url: "https://www.youtube.com/embed/kqtD5dpn9C8",
          type: "youtube",
          duration: "4 min"
        },
        kinesthetic: {
          title: "Jogar e Experimentar",
          description: "Jogo onde você treina uma IA",
          url: "https://teachablemachine.withgoogle.com/train/image",
          type: "interactive",
          duration: "10 min"
        }
      }
    },
    {
      id: 2,
      question: "🎨 Como a IA cria desenhos e pinturas?",
      emoji: "🎨",
      options: {
        visual: {
          title: "Ver IA Desenhando",
          description: "Vídeo mostrando IA criando arte",
          url: "https://www.youtube.com/embed/SVcsDDABEkM",
          type: "youtube",
          duration: "4 min"
        },
        auditory: {
          title: "Escutar Explicação",
          description: "Alguém explicando como funciona",
          url: "https://www.youtube.com/embed/air_tqMkbGE",
          type: "youtube",
          duration: "6 min"
        },
        read_write: {
          title: "Ler Sobre Arte IA",
          description: "Texto ilustrado sobre IA artística",
          url: "https://www.youtube.com/embed/SVcsDDABEkM",
          type: "youtube",
          duration: "5 min"
        },
        kinesthetic: {
          title: "Criar Sua Arte IA",
          description: "Experimentar Quick, Draw! do Google",
          url: "https://quickdraw.withgoogle.com/",
          type: "interactive",
          duration: "10 min"
        }
      }
    },
    {
      id: 3,
      question: "🗣️ Como assistentes virtuais entendem sua voz?",
      emoji: "🗣️",
      options: {
        visual: {
          title: "Ver Como Funciona",
          description: "Animação mostrando reconhecimento de voz",
          url: "https://www.youtube.com/embed/mYvLCp8Vo0o",
          type: "youtube",
          duration: "3 min"
        },
        auditory: {
          title: "Ouvir Demonstração",
          description: "Podcast sobre assistentes virtuais",
          url: "https://www.youtube.com/embed/VuNIsY6JdUw",
          type: "youtube",
          duration: "5 min"
        },
        read_write: {
          title: "Ler História",
          description: "Conto sobre Alexa e Siri",
          url: "https://www.youtube.com/embed/mYvLCp8Vo0o",
          type: "youtube",
          duration: "4 min"
        },
        kinesthetic: {
          title: "Testar Você Mesmo",
          description: "Brincar com reconhecimento de voz",
          url: "https://experiments.withgoogle.com/voice-experiments",
          type: "interactive",
          duration: "10 min"
        }
      }
    }
  ],
  
  discovery: [
    {
      id: 1,
      question: "🌦️ Como a IA prevê o tempo com 7 dias de antecedência?",
      emoji: "🌦️",
      options: {
        visual: {
          title: "Infográfico Interativo",
          description: "Visualização de modelos meteorológicos",
          url: "https://www.youtube.com/embed/e8Yw4alG16Q",
          type: "youtube",
          duration: "5 min"
        },
        auditory: {
          title: "Podcast Científico",
          description: "Meteorologista explica previsões",
          url: "https://www.youtube.com/embed/e8Yw4alG16Q",
          type: "youtube",
          duration: "8 min"
        },
        read_write: {
          title: "Artigo Científico",
          description: "Paper sobre machine learning meteorológico",
          url: "https://www.ibm.com/topics/machine-learning",
          type: "article",
          duration: "10 min"
        },
        kinesthetic: {
          title: "Criar Modelo Preditivo",
          description: "Notebook Python com dados reais INMET",
          url: "https://colab.research.google.com/",
          type: "interactive",
          duration: "15 min"
        }
      }
    },
    {
      id: 2,
      question: "🧬 Como algoritmos encontram padrões em milhões de dados?",
      emoji: "🧬",
      options: {
        visual: {
          title: "Ver Algoritmo Trabalhando",
          description: "Visualização de clustering em ação",
          url: "https://www.youtube.com/embed/IHZwWFHWa-w",
          type: "youtube",
          duration: "6 min"
        },
        auditory: {
          title: "Explicação em Áudio",
          description: "Professor narrando machine learning",
          url: "https://www.youtube.com/embed/ukzFI9rgwfU",
          type: "youtube",
          duration: "7 min"
        },
        read_write: {
          title: "Tutorial Escrito",
          description: "Guia completo sobre clustering",
          url: "https://scikit-learn.org/stable/modules/clustering.html",
          type: "article",
          duration: "12 min"
        },
        kinesthetic: {
          title: "Experimentar K-Means",
          description: "Notebook interativo com Scikit-learn",
          url: "https://colab.research.google.com/",
          type: "interactive",
          duration: "20 min"
        }
      }
    }
  ],
  
  pioneer: [
    {
      id: 1,
      question: "🧠 Como redes neurais profundas 'enxergam' imagens?",
      emoji: "🧠",
      options: {
        visual: {
          title: "Visualizar CNN em Ação",
          description: "Animação mostrando convolução e pooling",
          url: "https://www.youtube.com/embed/YRhxdVk_sIs",
          type: "youtube",
          duration: "8 min"
        },
        auditory: {
          title: "Lecture Técnica",
          description: "Andrew Ng explicando CNNs",
          url: "https://www.youtube.com/embed/ArPaAX_PhIs",
          type: "youtube",
          duration: "12 min"
        },
        read_write: {
          title: "Paper Fundacional",
          description: "AlexNet e ImageNet challenge",
          url: "https://papers.nips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html",
          type: "article",
          duration: "20 min"
        },
        kinesthetic: {
          title: "Implementar CNN do Zero",
          description: "TensorFlow playground + código",
          url: "https://playground.tensorflow.org/",
          type: "interactive",
          duration: "25 min"
        }
      }
    },
    {
      id: 2,
      question: "🐳 Por que Docker revolucionou o deploy de IA?",
      emoji: "🐳",
      options: {
        visual: {
          title: "Diagrama de Arquitetura",
          description: "Infográfico de containerização",
          url: "https://www.youtube.com/embed/Gjnup-PuquQ",
          type: "youtube",
          duration: "7 min"
        },
        auditory: {
          title: "Podcast DevOps",
          description: "Engenheiros discutindo Docker",
          url: "https://www.youtube.com/embed/Gjnup-PuquQ",
          type: "youtube",
          duration: "10 min"
        },
        read_write: {
          title: "Documentation Deep Dive",
          description: "Docker official docs",
          url: "https://docs.docker.com/get-started/",
          type: "article",
          duration: "15 min"
        },
        kinesthetic: {
          title: "Dockerizar Aplicação ML",
          description: "Tutorial hands-on com FastAPI",
          url: "https://docker-curriculum.com/",
          type: "interactive",
          duration: "30 min"
        }
      }
    }
  ],
  
  challenger: [
    {
      id: 1,
      question: "⚛️ Como computação quântica pode acelerar IA em 1000x?",
      emoji: "⚛️",
      options: {
        visual: {
          title: "Visualizar Qubits",
          description: "Animação de superposição quântica",
          url: "https://www.youtube.com/embed/QuR969uMICM",
          type: "youtube",
          duration: "10 min"
        },
        auditory: {
          title: "Palestra IBM Quantum",
          description: "Cientista explicando quantum advantage",
          url: "https://www.youtube.com/embed/QuR969uMICM",
          type: "youtube",
          duration: "15 min"
        },
        read_write: {
          title: "Paper Nature",
          description: "Quantum Supremacy original paper",
          url: "https://www.nature.com/articles/s41586-019-1666-5",
          type: "article",
          duration: "25 min"
        },
        kinesthetic: {
          title: "Programar Quantum Circuit",
          description: "IBM Quantum Experience hands-on",
          url: "https://quantum-computing.ibm.com/",
          type: "interactive",
          duration: "30 min"
        }
      }
    },
    {
      id: 2,
      question: "🌍 Como escalar IA para impactar 8 bilhões de pessoas?",
      emoji: "🌍",
      options: {
        visual: {
          title: "Ver Arquitetura Global",
          description: "System design planetário visualizado",
          url: "https://www.youtube.com/embed/video-system-design",
          type: "youtube",
          duration: "12 min"
        },
        auditory: {
          title: "Case Study Verbal",
          description: "CEO narrando scaling do WhatsApp",
          url: "https://www.youtube.com/embed/video-whatsapp",
          type: "youtube",
          duration: "15 min"
        },
        read_write: {
          title: "Whitepaper Técnico",
          description: "Google Kubernetes Engine architecture",
          url: "https://cloud.google.com/architecture/",
          type: "article",
          duration: "20 min"
        },
        kinesthetic: {
          title: "Deploy Multi-Region",
          description: "Kubernetes hands-on com GCP",
          url: "https://cloud.google.com/kubernetes-engine/docs/tutorials",
          type: "interactive",
          duration: "40 min"
        }
      }
    }
  ]
};

export default function VARKExperientialAssessment({ 
  explorerLevel = 'curiosity',
  onComplete 
}) {
  const [currentCuriosity, setCurrentCuriosity] = useState(0);
  const [choices, setChoices] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showContent, setShowContent] = useState(false);

  const curiosities = CURIOSITIES_BY_LEVEL[explorerLevel] || CURIOSITIES_BY_LEVEL.curiosity;
  const totalCuriosities = Math.min(3, curiosities.length); // Apenas 3 curiosidades
  const current = curiosities[currentCuriosity];

  const handleChoose = (varkStyle) => {
    setSelectedOption(varkStyle);
    setShowContent(true);
  };

  const handleNext = () => {
    // Registrar escolha
    const newChoices = [...choices, selectedOption];
    setChoices(newChoices);

    if (currentCuriosity < totalCuriosities - 1) {
      // Próxima curiosidade
      setCurrentCuriosity(currentCuriosity + 1);
      setSelectedOption(null);
      setShowContent(false);
    } else {
      // Completou - calcular perfil VARK
      const varkScores = {
        visual: 0,
        auditory: 0,
        read_write: 0,
        kinesthetic: 0
      };

      newChoices.forEach(choice => {
        varkScores[choice]++;
      });

      const total = newChoices.length;
      const percentages = {
        vark_visual: Math.round((varkScores.visual / total) * 100),
        vark_auditory: Math.round((varkScores.auditory / total) * 100),
        vark_read_write: Math.round((varkScores.read_write / total) * 100),
        vark_kinesthetic: Math.round((varkScores.kinesthetic / total) * 100)
      };

      const maxScore = Math.max(...Object.values(varkScores));
      const dominantStyles = Object.keys(varkScores).filter(key => varkScores[key] === maxScore);
      const primaryStyle = dominantStyles.length > 1 ? "multimodal" : dominantStyles[0];

      onComplete({ ...percentages, vark_primary_style: primaryStyle });
    }
  };

  const progress = ((currentCuriosity + 1) / totalCuriosities) * 100;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold" style={{ color: 'var(--primary-teal)' }}>
          Curiosidade {currentCuriosity + 1} de {totalCuriosities}
        </span>
        <div className="flex gap-2">
          {Array.from({ length: totalCuriosities }).map((_, idx) => (
            <div
              key={idx}
              className="w-8 h-2 rounded-full transition-all"
              style={{
                backgroundColor: idx <= currentCuriosity 
                  ? 'var(--primary-teal)' 
                  : 'var(--neutral-medium)'
              }}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showContent ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Curiosidade */}
            <Card className="border-2" style={{ borderColor: 'var(--primary-teal)' }}>
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">{current.emoji}</div>
                <h2 className="text-2xl font-heading font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                  {current.question}
                </h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Escolha como você prefere descobrir a resposta:
                </p>
              </CardContent>
            </Card>

            {/* Opções VARK */}
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(current.options).map(([varkStyle, option]) => {
                const config = VARK_CONFIG[varkStyle];
                const Icon = config.icon;

                return (
                  <motion.div
                    key={varkStyle}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className="cursor-pointer border-2 transition-all hover:shadow-lg"
                      style={{ borderColor: config.color }}
                      onClick={() => handleChoose(varkStyle)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: config.color + '20' }}
                          >
                            <Icon className="w-6 h-6" style={{ color: config.color }} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1 flex items-center gap-2">
                              {option.title}
                              <Badge variant="outline" className="text-xs">
                                {option.duration}
                              </Badge>
                            </h3>
                            <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                              {option.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs" style={{ color: config.color }}>
                              <Play className="w-3 h-3" />
                              <span className="font-semibold">{config.label}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <Card className="border-2" style={{ borderColor: VARK_CONFIG[selectedOption].color }}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: VARK_CONFIG[selectedOption].color }}
                  >
                    {React.createElement(VARK_CONFIG[selectedOption].icon, {
                      className: "w-5 h-5 text-white"
                    })}
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {current.options[selectedOption].title}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {current.options[selectedOption].description}
                    </p>
                  </div>
                </div>

                {/* Embed do conteúdo */}
                <div className="rounded-lg overflow-hidden bg-black" style={{ aspectRatio: '16/9' }}>
                  {current.options[selectedOption].type === 'youtube' ? (
                    <iframe
                      src={current.options[selectedOption].url}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={current.options[selectedOption].title}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-8 bg-gray-100">
                      <div className="text-center">
                        <Sparkles className="w-16 h-16 mx-auto mb-4" style={{ color: VARK_CONFIG[selectedOption].color }} />
                        <p className="mb-4">Clique no botão abaixo para acessar:</p>
                        <Button
                          onClick={() => window.open(current.options[selectedOption].url, '_blank')}
                          style={{ backgroundColor: VARK_CONFIG[selectedOption].color, color: 'white' }}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Abrir Experiência Interativa
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                    {currentCuriosity < totalCuriosities - 1 
                      ? "Explorou essa curiosidade? Vamos para a próxima!"
                      : "Última curiosidade! Depois vamos ver seu perfil de aprendizado."
                    }
                  </p>
                  <Button
                    onClick={handleNext}
                    className="btn-primary"
                    style={{ backgroundColor: 'var(--primary-teal)' }}
                  >
                    {currentCuriosity < totalCuriosities - 1 ? "Próxima Curiosidade →" : "Ver Meu Perfil VARK 🎯"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
