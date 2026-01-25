import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Shield, Code } from 'lucide-react';

export default function EnvironmentSetup() {
  // Exemplo de variáveis de ambiente disponíveis
  const envExamples = {
    MODE: 'development',
    DEV: true,
    PROD: false,
    BASE_URL: '/'
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Configuração de Variáveis de Ambiente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              <strong>Base44 Platform:</strong> As credenciais da aplicação são gerenciadas
              automaticamente pelo SDK Base44. Não é necessário configurar manualmente
              o APP_ID na maioria dos casos.
            </AlertDescription>
          </Alert>

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Code className="w-4 h-4" />
              Variáveis de Ambiente (Exemplo)
            </h3>
            <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm space-y-1">
              {Object.entries(envExamples).map(([key, value]) => (
                <div key={key}>
                  <span className="text-purple-600">VITE_{key}</span>
                  <span className="text-gray-600"> = </span>
                  <span className="text-green-600">
                    {typeof value === 'boolean' ? value.toString() : `"${value}"`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Instruções para Configuração Manual:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Crie um arquivo <code className="bg-gray-200 px-1 rounded">.env</code> na raiz do projeto</li>
              <li>Adicione suas variáveis com o prefixo <code className="bg-gray-200 px-1 rounded">VITE_</code></li>
              <li>Adicione <code className="bg-gray-200 px-1 rounded">.env</code> ao <code className="bg-gray-200 px-1 rounded">.gitignore</code></li>
              <li>Reinicie o servidor de desenvolvimento</li>
              <li>Acesse via <code className="bg-gray-200 px-1 rounded">import.meta.env.VITE_SUA_VAR</code></li>
            </ol>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Importante</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Nunca commite arquivos .env com dados sensíveis</li>
              <li>• Use diferentes valores para dev/staging/production</li>
              <li>• Não exponha API keys no frontend - use backend/proxy</li>
              <li>• Valide variáveis obrigatórias na inicialização</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exemplo de Arquivo .env</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`# Base44 Configuration
VITE_APP_ID=your_app_id_here

# API Configuration  
VITE_API_URL=https://api.base44.com

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false

# Environment
VITE_ENVIRONMENT=development`}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exemplo de Uso no Código</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-900 text-blue-300 p-4 rounded-lg overflow-x-auto text-sm">
{`// Acessar variáveis de ambiente
const apiUrl = import.meta.env.VITE_API_URL;
const isDev = import.meta.env.DEV;

// Configuração condicional
if (import.meta.env.PROD) {
  // Configurações de produção
} else {
  // Configurações de desenvolvimento
}

// Helper para obter variável com fallback
function getEnvVar(varName, fallback = null) {
  const value = import.meta.env[varName];
  return value || fallback;
}

const apiEndpoint = getEnvVar('VITE_API_URL', 'https://api.default.com');`}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🔒 Boas Práticas de Segurança</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-green-600 mb-2">✅ FAZER:</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Usar variáveis de ambiente para configurações sensíveis</li>
                <li>• Prefixar variáveis públicas com VITE_</li>
                <li>• Adicionar .env ao .gitignore</li>
                <li>• Criar .env.example como template</li>
                <li>• Validar variáveis necessárias na inicialização</li>
                <li>• Usar valores diferentes para dev/staging/prod</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-red-600 mb-2">❌ NÃO FAZER:</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Commitar arquivos .env no git</li>
                <li>• Colocar secrets reais no .env.example</li>
                <li>• Usar variáveis de ambiente para dados públicos</li>
                <li>• Expor API keys no frontend (sempre use backend/proxy)</li>
                <li>• Usar mesmas credenciais em todos os ambientes</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}