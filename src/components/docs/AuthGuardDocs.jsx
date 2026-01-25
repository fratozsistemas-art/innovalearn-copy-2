import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Shield, Lock, Users, Key } from 'lucide-react';

export default function AuthGuardDocs() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-3xl">
            <Shield className="w-8 h-8 text-blue-600" />
            AuthGuard - Documentação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Visão Geral</h3>
            <p className="text-gray-600">
              O <code>AuthGuard</code> é um componente que protege conteúdo baseado em
              autenticação e permissões de usuário. Ele simplifica a implementação de
              controle de acesso na aplicação.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Exemplos de Uso</h3>

            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Proteção Básica (Apenas Autenticação)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-white p-4 rounded-lg overflow-x-auto">
{`<AuthGuard>
  <ConteudoProtegido />
</AuthGuard>`}
                </pre>
              </CardContent>
            </Card>

            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Proteção por Tipo de Usuário
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-white p-4 rounded-lg overflow-x-auto">
{`// Apenas administradores
<AuthGuard requireUserTypes={['administrador']}>
  <PainelAdmin />
</AuthGuard>

// Administradores ou Coordenadores
<AuthGuard requireUserTypes={['administrador', 'coordenador_pedagogico']}>
  <FerramentasGestao />
</AuthGuard>`}
                </pre>
              </CardContent>
            </Card>

            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Proteção por Role
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-white p-4 rounded-lg overflow-x-auto">
{`// Apenas educadores (admin, coordenador, instrutor)
<AuthGuard requireEducator>
  <FerramentasProfessor />
</AuthGuard>

// Apenas staff (não-alunos)
<AuthGuard requireStaff>
  <DashboardStaff />
</AuthGuard>

// Apenas admins
<AuthGuard requireAdmin>
  <ConfiguracoesAvancadas />
</AuthGuard>`}
                </pre>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Props Disponíveis</h3>
            <div className="space-y-2">
              <div className="p-3 bg-gray-50 rounded-lg">
                <code className="text-sm font-mono">requireUserTypes</code>
                <span className="text-gray-600 text-sm ml-2">: string | string[]</span>
                <p className="text-sm text-gray-600 mt-1">
                  Tipos de usuário permitidos (administrador, instrutor, aluno, etc.)
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <code className="text-sm font-mono">requireEducator</code>
                <span className="text-gray-600 text-sm ml-2">: boolean</span>
                <p className="text-sm text-gray-600 mt-1">
                  Requer que seja educador (admin, coordenador ou instrutor)
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <code className="text-sm font-mono">requireStaff</code>
                <span className="text-gray-600 text-sm ml-2">: boolean</span>
                <p className="text-sm text-gray-600 mt-1">
                  Requer que seja staff (qualquer tipo exceto aluno ou pai)
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <code className="text-sm font-mono">requireAdmin</code>
                <span className="text-gray-600 text-sm ml-2">: boolean</span>
                <p className="text-sm text-gray-600 mt-1">
                  Requer que seja administrador (role === 'admin')
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <code className="text-sm font-mono">fallback</code>
                <span className="text-gray-600 text-sm ml-2">: ReactNode</span>
                <p className="text-sm text-gray-600 mt-1">
                  Componente customizado a mostrar quando não tem permissão
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <code className="text-sm font-mono">redirectTo</code>
                <span className="text-gray-600 text-sm ml-2">: string</span>
                <p className="text-sm text-gray-600 mt-1">
                  Página para redirecionar se não tiver permissão
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <code className="text-sm font-mono">showLoadingState</code>
                <span className="text-gray-600 text-sm ml-2">: boolean</span>
                <p className="text-sm text-gray-600 mt-1">
                  Mostrar loading enquanto verifica autenticação (default: true)
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Hook useAuth</h3>
            <p className="text-gray-600 mb-4">
              Para casos mais complexos, use o hook <code>useAuth</code> diretamente:
            </p>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
{`import { useAuth } from '@/components/hooks/useAuth';

function MyComponent() {
  const { 
    user, 
    isAuthenticated, 
    isEducator,
    hasUserType 
  } = useAuth();

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return (
    <div>
      <h1>Olá, {user.full_name}!</h1>
      
      {isEducator && <TeacherTools />}
      
      {hasUserType(['administrador']) && <AdminPanel />}
    </div>
  );
}`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}