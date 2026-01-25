
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle2, Code, Lock } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

/**
 * Documentação de Segurança e Boas Práticas
 */
export default function SecurityDocs() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-3xl">
            <Shield className="w-8 h-8 text-green-600" />
            Guia de Segurança - Innova Academy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Este guia documenta as práticas de segurança implementadas na plataforma
            e fornece orientações para desenvolvimento seguro.
          </p>

          <Tabs defaultValue="sanitization">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="sanitization">Sanitização</TabsTrigger>
              <TabsTrigger value="validation">Validação</TabsTrigger>
              <TabsTrigger value="auth">Autenticação</TabsTrigger>
              <TabsTrigger value="best-practices">Boas Práticas</TabsTrigger>
            </TabsList>

            {/* Sanitização */}
            <TabsContent value="sanitization" className="space-y-6">
              <Alert>
                <Shield className="w-4 h-4" />
                <AlertDescription>
                  <strong>Sanitização</strong> remove ou escapa caracteres perigosos de dados
                  de entrada para prevenir ataques XSS (Cross-Site Scripting).
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Sanitização de HTML
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">❌ NUNCA FAÇA ISSO:</h4>
                    <pre className="bg-red-50 p-4 rounded-lg overflow-x-auto border border-red-200">
{`// PERIGOSO - Dados não sanitizados
<div dangerouslySetInnerHTML={{ __html: userInput }} />`}
                    </pre>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-green-600">✅ FAÇA ISSO:</h4>
                    <pre className="bg-green-50 p-4 rounded-lg overflow-x-auto border border-green-200">
{`import { sanitizeHTML, createSafeHTML } from '@/components/utils/sanitize';

// Opção 1: Sanitizar antes
const cleaned = sanitizeHTML(userInput);
<div dangerouslySetInnerHTML={{ __html: cleaned }} />

// Opção 2: Usar helper
<div dangerouslySetInnerHTML={createSafeHTML(userInput)} />

// Opção 3: Melhor - evitar dangerouslySetInnerHTML
<div>{userInput}</div> // React escapa automaticamente`}
                    </pre>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Quando usar dangerouslySetInnerHTML?
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Apenas quando absolutamente necessário (conteúdo markdown, rich text)</li>
                      <li>SEMPRE sanitizar o HTML antes</li>
                      <li>Preferir componentes do React quando possível</li>
                      <li>Documentar o motivo do uso no código</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Funções de Sanitização Disponíveis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <code className="text-sm font-mono">sanitizeHTML(html)</code>
                      <p className="text-sm text-gray-600 mt-1">
                        Remove tags e atributos HTML perigosos
                      </p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <code className="text-sm font-mono">sanitizeURL(url)</code>
                      <p className="text-sm text-gray-600 mt-1">
                        Valida e sanitiza URLs (previne javascript:, data:, etc)
                      </p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <code className="text-sm font-mono">sanitizeString(str)</code>
                      <p className="text-sm text-gray-600 mt-1">
                        Remove caracteres especiais perigosos
                      </p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <code className="text-sm font-mono">escapeHTML(text)</code>
                      <p className="text-sm text-gray-600 mt-1">
                        Escapa HTML para exibição segura de texto
                      </p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <code className="text-sm font-mono">sanitizeEmail(email)</code>
                      <p className="text-sm text-gray-600 mt-1">
                        Valida e normaliza endereços de email
                      </p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <code className="text-sm font-mono">sanitizeSearchQuery(query)</code>
                      <p className="text-sm text-gray-600 mt-1">
                        Sanitiza queries de busca
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Validação */}
            <TabsContent value="validation" className="space-y-6">
              <Alert>
                <CheckCircle2 className="w-4 h-4" />
                <AlertDescription>
                  <strong>Validação</strong> garante que os dados estejam no formato correto
                  e atendam aos requisitos antes de serem processados.
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Validadores Disponíveis</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
{`import { 
  isValidEmail, 
  isValidCPF, 
  isValidPhone,
  isValidURL,
  isStrongPassword,
  validate,
  validators
} from '@/components/utils/validation';

// Validação simples
if (!isValidEmail(email)) {
  showError('Email inválido');
}

// Validação composta
const { isValid, errors } = validate(password, [
  validators.required,
  validators.minLength(8),
  createValidator(
    (v) => /[A-Z]/.test(v),
    'Deve conter letra maiúscula'
  )
]);

if (!isValid) {
  showError('Senha inválida', errors.join(', '));
}`}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Validação em Formulários</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
{`import { sanitizeEmail, sanitizeDocument, sanitizeString } from '@/components/utils/sanitize';

// Validar antes de submeter
const handleSubmit = async (data) => {
  // Validar email
  if (!isValidEmail(data.email)) {
    showError('Email inválido');
    return;
  }

  // Validar CPF
  if (!isValidCPF(data.cpf)) {
    showError('CPF inválido');
    return;
  }

  // Sanitizar antes de enviar
  const sanitizedData = {
    ...data,
    email: sanitizeEmail(data.email),
    cpf: sanitizeDocument(data.cpf),
    notes: sanitizeString(data.notes)
  };

  await saveData(sanitizedData);
};`}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Autenticação */}
            <TabsContent value="auth" className="space-y-6">
              <Alert>
                <Lock className="w-4 h-4" />
                <AlertDescription>
                  <strong>Autenticação e Autorização</strong> controlam quem pode acessar
                  o que na aplicação.
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Protegendo Rotas e Componentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
{`import AuthGuard from '@/components/auth/AuthGuard';
import { useAuth } from '@/components/hooks/useAuth';

// Proteger componente inteiro
export default function AdminPage() {
  return (
    <AuthGuard requireUserTypes={['administrador']}>
      <AdminContent />
    </AuthGuard>
  );
}

// Proteger partes específicas
export default function MixedPage() {
  const { isEducator, hasUserType } = useAuth();

  return (
    <div>
      <PublicContent />
      
      {isEducator && <TeacherTools />}
      
      <AuthGuard requireStaff>
        <StaffSection />
      </AuthGuard>
    </div>
  );
}`}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Hook useAuth</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
{`const {
  user,              // Dados do usuário atual
  isLoading,         // Carregando dados
  isAuthenticated,   // Está autenticado?
  isAdmin,           // É admin?
  isEducator,        // É educador?
  isStaff,           // É staff?
  hasUserType,       // Função para verificar tipo
  hasLevelAccess,    // Função para verificar acesso a nível
} = useAuth();

// Verificar tipo específico
if (hasUserType(['administrador', 'coordenador_pedagogico'])) {
  // Código para admin/coordenador
}

// Verificar acesso a nível
if (hasLevelAccess('challenger')) {
  // Código para Challenger
}`}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Boas Práticas */}
            <TabsContent value="best-practices" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Checklist de Segurança</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Sanitizar HTML antes de usar dangerouslySetInnerHTML</strong>
                        <p className="text-sm text-gray-600">Use sanitizeHTML() ou createSafeHTML()</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Validar dados de entrada</strong>
                        <p className="text-sm text-gray-600">Use validators antes de processar dados</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Proteger rotas sensíveis</strong>
                        <p className="text-sm text-gray-600">Use AuthGuard para páginas administrativas</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Sanitizar URLs</strong>
                        <p className="text-sm text-gray-600">Use sanitizeURL() para links externos</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Nunca confiar em dados do cliente</strong>
                        <p className="text-sm text-gray-600">Sempre validar e sanitizar no backend também</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Registrar erros apropriadamente</strong>
                        <p className="text-sm text-gray-600">Use useNotificationSystem para logging estruturado</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Usar HTTPS em produção</strong>
                        <p className="text-sm text-gray-600">Garantir comunicação criptografada</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Limitar tamanho de inputs</strong>
                        <p className="text-sm text-gray-600">Prevenir ataques de DOS via inputs gigantes</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Vulnerabilidades Comuns a Evitar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-800 mb-2">❌ XSS (Cross-Site Scripting)</h4>
                      <p className="text-sm text-red-700">
                        Injeção de scripts maliciosos. <strong>Prevenir:</strong> Sanitizar HTML,
                        evitar dangerouslySetInnerHTML, usar React (escapa automaticamente).
                      </p>
                    </div>

                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-800 mb-2">❌ SQL Injection</h4>
                      <p className="text-sm text-red-700">
                        Manipulação de queries SQL. <strong>Prevenir:</strong> Base44 SDK usa prepared statements,
                        mas sempre valide dados antes de queries.
                      </p>
                    </div>

                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-800 mb-2">❌ Broken Access Control</h4>
                      <p className="text-sm text-red-700">
                        Acesso não autorizado a recursos. <strong>Prevenir:</strong> Usar AuthGuard,
                        verificar permissões no backend.
                      </p>
                    </div>

                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-800 mb-2">❌ Exposure of Sensitive Data</h4>
                      <p className="text-sm text-red-700">
                        Vazamento de dados sensíveis. <strong>Prevenir:</strong> Não logar senhas/tokens,
                        usar HTTPS, criptografar dados sensíveis.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
