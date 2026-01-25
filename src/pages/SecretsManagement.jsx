import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  Key, 
  Eye, 
  EyeOff, 
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Lock,
  Sparkles,
  Brain,
  Globe,
  Zap,
  TrendingUp,
  MessageSquare,
  Flag
} from "lucide-react";
import { useCurrentUser } from "@/components/hooks/useUser";

const configuredSecrets = [
  {
    name: "OPENAI_API_KEY",
    description: "Chave de API da OpenAI para GPT-4",
    status: "configured",
    provider: "OpenAI",
    model: "GPT-4",
    usedIn: [
      {
        feature: "InnAI Assistant",
        description: "Chatbot personalizado por nível",
        page: "All pages (widget)",
        icon: Sparkles
      },
      {
        feature: "AutoGrader",
        description: "Correção automática",
        page: "Assignments",
        icon: Brain
      },
      {
        feature: "Auto-Curation",
        description: "Avaliação de recursos",
        page: "AutoCurationDashboard",
        icon: Globe
      },
      {
        feature: "Assignment Generator",
        description: "Geração de exercícios",
        page: "AssignmentGenerator",
        icon: Zap
      },
      {
        feature: "Content Gap Ideas",
        description: "Sugestões para gaps",
        page: "ContentGapAnalysis",
        icon: Brain
      },
      {
        feature: "Difficulty Predictions",
        description: "Predição de dificuldades",
        page: "EarlyWarningDashboard",
        icon: AlertTriangle
      }
    ],
    estimatedMonthlyCost: "~$50-200/mês",
    rateLimit: "10,000 tokens/min (Tier 1)",
    documentation: "https://platform.openai.com/docs",
    dashboardUrl: "https://platform.openai.com/usage"
  },
  {
    name: "ANTHROPIC_API_KEY",
    description: "Chave de API da Anthropic para Claude",
    status: "configured",
    provider: "Anthropic",
    model: "Claude 3.5 Sonnet",
    usedIn: [
      {
        feature: "InnAI Assistant (alternativo)",
        description: "Pode usar Claude como fallback",
        page: "All pages (widget)",
        icon: MessageSquare
      },
      {
        feature: "Content Analysis",
        description: "Análise profunda de conteúdo",
        page: "Multiple pages",
        icon: Brain
      }
    ],
    estimatedMonthlyCost: "~$30-150/mês",
    rateLimit: "40,000 tokens/min (Tier 1)",
    documentation: "https://docs.anthropic.com/claude/reference",
    dashboardUrl: "https://console.anthropic.com"
  },
  {
    name: "MARITACA_API_KEY",
    description: "Chave de API da Maritaca AI para Sabiá-3",
    status: "configured",
    provider: "Maritaca AI",
    model: "Sabiá-3.1",
    country: "🇧🇷 Brasil",
    usedIn: [
      {
        feature: "LLM Brasileiro (PT-BR nativo)",
        description: "Modelo treinado em português brasileiro",
        page: "Disponível para integrações",
        icon: Flag
      },
      {
        feature: "Content Generation",
        description: "Geração de conteúdo em português",
        page: "Multiple pages",
        icon: Brain
      }
    ],
    estimatedMonthlyCost: "~$20-100/mês",
    rateLimit: "Conforme plano contratado",
    documentation: "https://plataforma.maritaca.ai/documentacao",
    dashboardUrl: "https://plataforma.maritaca.ai",
    apiEndpoint: "https://chat.maritaca.ai/api/chat/completions"
  }
];

export default function SecretsManagementPage() {
  const { data: user } = useCurrentUser();
  const [showKeyPreview, setShowKeyPreview] = useState({});

  const toggleKeyPreview = (secretName) => {
    setShowKeyPreview(prev => ({
      ...prev,
      [secretName]: !prev[secretName]
    }));
  };

  if (!user || user.user_type !== 'administrador') {
    return (
      <div className="p-8 text-center">
        <Shield className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--error)' }} />
        <h2 className="text-2xl font-bold mb-2">Acesso Restrito</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Apenas administradores podem gerenciar secrets.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">
            🔐 Gerenciamento de Secrets
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {configuredSecrets.length} API Keys configurados de forma segura
          </p>
        </div>

        <Alert className="border-2" style={{ borderColor: 'var(--success)', backgroundColor: 'var(--success-light)' }}>
          <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--success)' }} />
          <AlertDescription>
            <p className="font-semibold mb-1">✅ Armazenamento Seguro</p>
            <p className="text-sm">
              Seus secrets são criptografados no servidor Base44 e nunca expostos no frontend.
            </p>
          </AlertDescription>
        </Alert>

        <Card className="border-2" style={{ borderColor: 'var(--info)' }}>
          <CardHeader style={{ backgroundColor: 'var(--info)', color: 'white' }}>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Boas Práticas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Nunca exponha no frontend</p>
                  <p className="text-gray-600">Secrets são server-side</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Rotacione periodicamente</p>
                  <p className="text-gray-600">A cada 90 dias</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Monitore uso e custos</p>
                  <p className="text-gray-600">Dashboard dos provedores</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Múltiplos provedores = Redundância</p>
                  <p className="text-gray-600">3 LLMs: OpenAI, Anthropic, Maritaca 🇧🇷</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-heading font-bold">Secrets Configurados</h2>
          
          {configuredSecrets.map((secret, index) => {
            const FirstIcon = secret.usedIn[0]?.icon || Key;
            const isKeyVisible = showKeyPreview[secret.name];
            
            return (
              <Card key={index} className="border-2" style={{ borderColor: 'var(--primary-teal)' }}>
                <CardHeader style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      <Key className="w-6 h-6" />
                      {secret.name}
                      {secret.country && (
                        <span className="text-xl">{secret.country}</span>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-white/20 border-0">
                        {secret.provider}
                      </Badge>
                      <Badge className="bg-white/20 border-0">
                        ✓ Ativo
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm opacity-90 mt-2">{secret.description}</p>
                  <p className="text-xs opacity-75 mt-1">Modelo: {secret.model}</p>
                </CardHeader>
                
                <CardContent className="p-6 space-y-6">
                  
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">Valor:</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleKeyPreview(secret.name)}
                      >
                        {isKeyVisible ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                        {isKeyVisible ? 'Ocultar' : 'Mostrar'}
                      </Button>
                    </div>
                    <div className="p-4 bg-gray-900 rounded-lg font-mono text-sm text-green-400">
                      {isKeyVisible ? (
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          <span>
                            {secret.provider === 'OpenAI' && 'sk-proj-••••••••••••••••••••••••••••'}
                            {secret.provider === 'Anthropic' && 'sk-ant-api03-••••••••••••••••••••••••••••'}
                            {secret.provider === 'Maritaca AI' && 'mk-••••••••••••••••••••••••••••'}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          <span>••••••••••••••••••••••••••••••••</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      ⚠️ Nunca compartilhe sua API key
                    </p>
                  </div>

                  {secret.apiEndpoint && (
                    <div>
                      <h4 className="font-semibold mb-2">Endpoint:</h4>
                      <div className="p-3 bg-gray-100 rounded-lg font-mono text-xs break-all">
                        {secret.apiEndpoint}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold mb-3">Usado em {secret.usedIn.length} funcionalidades:</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {secret.usedIn.map((usage, idx) => {
                        const Icon = usage.icon;
                        return (
                          <div key={idx} className="p-4 rounded-lg border-2 border-gray-200">
                            <div className="flex items-start gap-3">
                              <div 
                                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
                              >
                                <Icon className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-semibold text-sm mb-1">{usage.feature}</h5>
                                <p className="text-xs text-gray-600 mb-2">{usage.description}</p>
                                <Badge variant="outline" className="text-xs">
                                  {usage.page}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-blue-50">
                      <p className="text-xs text-gray-600 mb-1">Custo Estimado</p>
                      <p className="text-lg font-bold text-blue-900">{secret.estimatedMonthlyCost}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-purple-50">
                      <p className="text-xs text-gray-600 mb-1">Rate Limit</p>
                      <p className="text-sm font-bold text-purple-900">{secret.rateLimit}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-green-50">
                      <p className="text-xs text-gray-600 mb-1">Status</p>
                      <Badge className="bg-green-600 text-white">Ativo</Badge>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => window.open(secret.documentation, '_blank')}
                      className="flex-1"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Docs
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.open(secret.dashboardUrl, '_blank')}
                      className="flex-1"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Como Usar Secrets</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="p-4 bg-gray-900 rounded-lg">
              <p className="text-xs text-gray-400 mb-2">Exemplo (OpenAI):</p>
              <pre className="text-sm text-green-400 font-mono overflow-x-auto">
{`// Secret OPENAI_API_KEY injetado automaticamente
const response = await base44.integrations.Core.InvokeLLM({
  prompt: "Sua pergunta aqui"
});`}
              </pre>
            </div>

            <div className="p-4 bg-gray-900 rounded-lg">
              <p className="text-xs text-gray-400 mb-2">Exemplo (Maritaca - uso manual):</p>
              <pre className="text-sm text-green-400 font-mono overflow-x-auto">
{`// Para usar Maritaca, você precisa fazer fetch direto
const response = await fetch('https://chat.maritaca.ai/api/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${process.env.MARITACA_API_KEY}\`
  },
  body: JSON.stringify({
    model: "sabia-3.1",
    messages: [{ role: "user", content: "Olá!" }]
  })
});`}
              </pre>
            </div>

            <div className="p-4 rounded-lg bg-green-50 border-2 border-green-200">
              <p className="text-sm font-semibold text-green-900 mb-2">🇧🇷 Vantagens da Maritaca (Sabiá-3):</p>
              <ul className="text-sm text-green-800 space-y-1">
                <li>✅ Modelo treinado especificamente em português brasileiro</li>
                <li>✅ Melhor compreensão de contexto cultural BR</li>
                <li>✅ Custos potencialmente menores que OpenAI</li>
                <li>✅ Apoio à tecnologia nacional</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-purple-50">
              <p className="text-sm font-semibold text-purple-900 mb-2">💡 Estratégia Multi-LLM:</p>
              <p className="text-sm text-purple-800">
                Com 3 provedores configurados, você pode:
              </p>
              <ul className="text-sm text-purple-800 space-y-1 mt-2">
                <li>• <strong>GPT-4:</strong> Tarefas complexas em inglês</li>
                <li>• <strong>Claude:</strong> Análises longas e detalhadas</li>
                <li>• <strong>Sabiá-3:</strong> Conteúdo em português brasileiro</li>
              </ul>
            </div>

            <Alert className="border-2" style={{ borderColor: 'var(--warning)' }}>
              <AlertTriangle className="w-5 h-5" style={{ color: 'var(--warning)' }} />
              <AlertDescription>
                <p className="font-semibold mb-1">⚠️ NUNCA:</p>
                <ul className="text-sm space-y-1 mt-2">
                  <li>• Coloque keys no código</li>
                  <li>• Commite secrets no Git</li>
                  <li>• Compartilhe em chat/email</li>
                  <li>• Use no frontend</li>
                </ul>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Links Úteis</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-3">OpenAI:</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => window.open('https://platform.openai.com/api-keys', '_blank')}
                    className="justify-start"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    API Keys
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open('https://platform.openai.com/usage', '_blank')}
                    className="justify-start"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Usage & Billing
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Anthropic:</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => window.open('https://console.anthropic.com/settings/keys', '_blank')}
                    className="justify-start"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    API Keys
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open('https://console.anthropic.com', '_blank')}
                    className="justify-start"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Console
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Maritaca AI 🇧🇷:</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => window.open('https://plataforma.maritaca.ai', '_blank')}
                    className="justify-start"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Plataforma
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open('https://plataforma.maritaca.ai/documentacao', '_blank')}
                    className="justify-start"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Documentação
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}