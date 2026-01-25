import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  CheckCircle2, 
  Code, 
  Sparkles,
  Lock,
  AlertTriangle,
  BookOpen,
  Zap
} from "lucide-react";

export default function AIIntegrationDocs() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-3">Integração de IA Segura</h1>
        <p className="text-lg text-gray-600">
          Como usar Inteligência Artificial no InnovaLearn de forma segura e eficiente
        </p>
      </div>

      <Alert className="border-2 border-red-200 bg-red-50">
        <Shield className="w-5 h-5 text-red-600" />
        <AlertDescription className="text-red-900">
          <strong>🔐 Segurança em Primeiro Lugar:</strong> NUNCA exponha chaves de API no frontend!
          A base44 já gerencia isso de forma segura através das integrações.
        </AlertDescription>
      </Alert>

      <Card className="border-2 border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-purple-600" />
            Como a IA está Integrada no InnovaLearn
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <strong>Integração Core.InvokeLLM</strong>
                <p className="text-sm text-gray-600">
                  A base44 fornece a integração <code className="bg-purple-100 px-2 py-1 rounded">Core.InvokeLLM</code> 
                  que já gerencia as chaves de API de forma segura no backend.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <strong>Sem Exposição de Chaves</strong>
                <p className="text-sm text-gray-600">
                  Suas chamadas de IA passam pelo servidor da base44, mantendo as credenciais seguras.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <strong>Rate Limiting Automático</strong>
                <p className="text-sm text-gray-600">
                  A plataforma gerencia limites de uso e otimização automaticamente.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-600" />
            Exemplo Básico: Como Usar a IA
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { InvokeLLM } from "@/integrations/Core";

// Exemplo 1: Pergunta Simples
const response = await InvokeLLM({
  prompt: "Explique IA para uma criança de 6 anos"
});

console.log(response);

// Exemplo 2: Resposta Estruturada (JSON)
const structuredData = await InvokeLLM({
  prompt: "Liste 5 atividades de IA para crianças",
  response_json_schema: {
    type: "object",
    properties: {
      activities: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" }
          }
        }
      }
    }
  }
});

// Exemplo 3: Com Contexto da Internet
const contextualResponse = await InvokeLLM({
  prompt: "Últimas notícias sobre IA na educação?",
  add_context_from_internet: true
});`}
          </pre>
        </CardContent>
      </Card>

      <Card className="border-2 border-green-200">
        <CardHeader className="bg-green-50">
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-green-600" />
            Exemplos Avançados no InnovaLearn
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-purple-100 text-purple-800">Já Implementado</Badge>
              <h3 className="font-bold text-lg">InnAI Chatbot</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Assistente virtual personalizado por nível
            </p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
{`const response = await InvokeLLM({
  prompt: personaPrompt + "\\n\\nAluno: " + userMessage,
  response_json_schema: {
    type: "object",
    properties: {
      message: { type: "string" },
      suggested_actions: { type: "array" }
    }
  }
});`}
            </pre>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-purple-100 text-purple-800">Já Implementado</Badge>
              <h3 className="font-bold text-lg">Análise de Lacunas de Conteúdo</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              IA analisa lições e identifica gaps
            </p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
{`const analysis = await InvokeLLM({
  prompt: "Analise esta lição...",
  add_context_from_internet: true,
  response_json_schema: {
    type: "object",
    properties: {
      gaps: { type: "array" }
    }
  }
});`}
            </pre>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-purple-100 text-purple-800">Já Implementado</Badge>
              <h3 className="font-bold text-lg">Análise Preditiva de Risco</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Identifica alunos em risco de evasão
            </p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
{`// Análise baseada em múltiplos fatores
const riskScore = calculateRiskScore(
  student, 
  enrollments, 
  assignments
);`}
            </pre>
          </div>

        </CardContent>
      </Card>

      <Card className="border-2 border-orange-200">
        <CardHeader className="bg-orange-50">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-600" />
            Novos Casos de Uso Possíveis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-lg border-2 border-orange-100 bg-orange-50/50">
              <h4 className="font-bold mb-2">📝 Correção Automática</h4>
              <p className="text-sm text-gray-600 mb-2">
                IA analisa submissões e fornece feedback
              </p>
              <code className="text-xs bg-white px-2 py-1 rounded">AutoGrader</code>
            </div>

            <div className="p-4 rounded-lg border-2 border-orange-100 bg-orange-50/50">
              <h4 className="font-bold mb-2">🎨 Gerador de Atividades</h4>
              <p className="text-sm text-gray-600 mb-2">
                Cria atividades baseadas no perfil VARK
              </p>
              <code className="text-xs bg-white px-2 py-1 rounded">ActivityGenerator</code>
            </div>

            <div className="p-4 rounded-lg border-2 border-orange-100 bg-orange-50/50">
              <h4 className="font-bold mb-2">💬 Resumos Automáticos</h4>
              <p className="text-sm text-gray-600 mb-2">
                Resume lições em formatos por idade
              </p>
              <code className="text-xs bg-white px-2 py-1 rounded">LessonSummarizer</code>
            </div>

            <div className="p-4 rounded-lg border-2 border-orange-100 bg-orange-50/50">
              <h4 className="font-bold mb-2">🔍 Busca Semântica</h4>
              <p className="text-sm text-gray-600 mb-2">
                Encontra recursos por significado
              </p>
              <code className="text-xs bg-white px-2 py-1 rounded">SemanticSearch</code>
            </div>

            <div className="p-4 rounded-lg border-2 border-orange-100 bg-orange-50/50">
              <h4 className="font-bold mb-2">🎯 Recomendações</h4>
              <p className="text-sm text-gray-600 mb-2">
                Sugere atividades baseado no histórico
              </p>
              <code className="text-xs bg-white px-2 py-1 rounded">SmartRecommender</code>
            </div>

            <div className="p-4 rounded-lg border-2 border-orange-100 bg-orange-50/50">
              <h4 className="font-bold mb-2">📊 Relatórios Auto</h4>
              <p className="text-sm text-gray-600 mb-2">
                Gera relatórios narrativos
              </p>
              <code className="text-xs bg-white px-2 py-1 rounded">ReportGenerator</code>
            </div>

          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-teal-200">
        <CardHeader className="bg-teal-50">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Boas Práticas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 mt-1" />
              <div>
                <strong>Use JSON Schema</strong>
                <p className="text-sm text-gray-600">
                  Respostas estruturadas são mais confiáveis
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 mt-1" />
              <div>
                <strong>Adicione contexto</strong>
                <p className="text-sm text-gray-600">
                  Inclua idade, nível e preferências do aluno
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 mt-1" />
              <div>
                <strong>Loading states</strong>
                <p className="text-sm text-gray-600">
                  Mostre feedback visual durante chamadas
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 mt-1" />
              <div>
                <strong>Cache com React Query</strong>
                <p className="text-sm text-gray-600">
                  Otimize respostas que não mudam
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-1" />
              <div>
                <strong>Tenha fallback</strong>
                <p className="text-sm text-gray-600">
                  Sempre tenha alternativa se IA falhar
                </p>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-purple-200">
        <CardHeader className="bg-purple-50">
          <CardTitle>Hook Customizado para IA</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { useState } from 'react';
import { InvokeLLM } from '@/integrations/Core';

export function useAIAssistant() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const askAI = async (prompt, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await InvokeLLM({
        prompt,
        ...options
      });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { askAI, loading, error };
}

// Uso:
const { askAI, loading } = useAIAssistant();
const answer = await askAI("Como ensinar loops?");`}
          </pre>
        </CardContent>
      </Card>

      <Alert className="border-2 border-green-200 bg-green-50">
        <CheckCircle2 className="w-5 h-5 text-green-600" />
        <AlertDescription className="text-green-900">
          <strong>✅ Tudo Pronto!</strong> Integração de IA configurada e protegida pela base44.
        </AlertDescription>
      </Alert>

    </div>
  );
}