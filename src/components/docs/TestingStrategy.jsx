import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, Code, TestTube, FileCode } from "lucide-react";

/**
 * TestingStrategy - Documentação da Estratégia de Testes
 * 
 * Como a plataforma base44 não suporta instalação de dependências de teste,
 * esta documentação explica como validar e garantir qualidade do código
 */
export default function TestingStrategy() {
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Estratégia de Testes - Innova Academy</h1>
        <p className="text-gray-600">
          Guia completo para garantir qualidade e prevenir regressões
        </p>
      </div>

      <Alert>
        <AlertTriangle className="w-4 h-4" />
        <AlertDescription>
          <strong>Limitação da Plataforma:</strong> A plataforma base44 não suporta instalação 
          de bibliotecas de teste como Vitest ou React Testing Library. Esta documentação 
          apresenta estratégias alternativas de validação e boas práticas.
        </AlertDescription>
      </Alert>

      {/* Abordagem de Validação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5" />
            Abordagem de Validação Manual
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">1. Testes Visuais</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>Testar cada funcionalidade manualmente no preview</li>
              <li>Verificar responsividade em diferentes tamanhos de tela</li>
              <li>Testar com diferentes tipos de usuários (admin, aluno, etc.)</li>
              <li>Validar fluxos completos (login → navegação → ações)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">2. Validação de Dados</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>Usar validação Zod em formulários críticos</li>
              <li>Implementar sanitização de dados (ver SafeHTML e utils/sanitize)</li>
              <li>Validar tipos com PropTypes ou TypeScript comments</li>
              <li>Testar edge cases com dados inválidos</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3. Console Logging Estruturado</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>Usar console.group para logs organizados</li>
              <li>Implementar sistema de notificações (já presente)</li>
              <li>Registrar erros com contexto completo</li>
              <li>Usar ErrorBoundary para capturar crashes</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Checklist de Testes Manuais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Checklist de Testes Manuais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Badge>Autenticação</Badge>
              </h3>
              <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Login com credenciais válidas</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Tentativa de login com credenciais inválidas</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Logout e redirecionamento correto</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Proteção de rotas (AuthGuard)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Persistência de sessão após refresh</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Badge>Onboarding</Badge>
              </h3>
              <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Novo usuário é redirecionado para onboarding</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Questionário VARK completo e funcionando</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Cálculo correto dos scores VARK</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Salvar dados do explorador</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Redirecionamento para curso de Ética em IA</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Badge>Curso de Ética em IA</Badge>
              </h3>
              <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Todos os módulos carregam corretamente</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Quizzes funcionam e pontuam</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Checklist final funciona</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Certificado é gerado</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Usuário é redirecionado após conclusão</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Badge>Dashboard</Badge>
              </h3>
              <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Estatísticas carregam corretamente</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Progresso dos módulos exibe dados reais</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Tarefas pendentes são listadas</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Recomendações são geradas</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Badge>Cursos e Lições</Badge>
              </h3>
              <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Lista de cursos carrega por nível</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Navegação entre módulos funciona</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Visualização de lições individual</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Vídeos e conteúdos carregam</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Marcar lição como concluída</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Progresso é atualizado corretamente</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Badge>Tarefas (Homework, Familywork, Extramile)</Badge>
              </h3>
              <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Aluno pode submeter tarefa</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Status muda para "aguardando verificação"</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Professor/Responsável pode verificar</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Innova Coins são creditados</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Feedback é exibido ao aluno</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Badge>Gamificação</Badge>
              </h3>
              <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Innova Coins são creditados corretamente</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Badges são desbloqueados</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Histórico de coins funciona</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Streak de dias consecutivos</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Badge>Perfil de Usuário</Badge>
              </h3>
              <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Editar nome e informações</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Visualizar perfil VARK</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Estatísticas de progresso</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Badge>Admin/Educadores</Badge>
              </h3>
              <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Analytics carregam com dados reais</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Gestão de turmas funciona</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Planos de aula são exibidos</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Recursos podem ser gerenciados</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Lacunas de conteúdo são identificadas</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Badge>Acessibilidade</Badge>
              </h3>
              <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Navegação completa por teclado (Tab/Shift+Tab)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Indicadores de foco visíveis</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>aria-labels em elementos interativos</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Contraste de cores adequado</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Textos alternativos em imagens</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Badge>Performance</Badge>
              </h3>
              <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Páginas carregam em menos de 2 segundos</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Sem re-renders excessivos (React DevTools)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Imagens otimizadas e lazy loading</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Queries em cache (React Query)</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Badge>Segurança</Badge>
              </h3>
              <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Rotas protegidas com AuthGuard</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Sanitização de HTML perigoso</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Validação de URLs externas</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Inputs validados com Zod</span>
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exemplos de Testes (Conceituais) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Exemplos de Testes (Se pudéssemos usar Vitest)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-sm">sanitize.js - Teste de Sanitização</h3>
              <pre className="text-xs bg-white p-3 rounded overflow-x-auto">
{`import { describe, it, expect } from 'vitest';
import { sanitizeHTML, sanitizeURL } from './sanitize';

describe('sanitizeHTML', () => {
  it('deve remover scripts maliciosos', () => {
    const malicious = '<p>Hello</p><script>alert("XSS")</script>';
    const result = sanitizeHTML(malicious);
    expect(result).not.toContain('<script>');
    expect(result).toContain('<p>Hello</p>');
  });

  it('deve permitir tags seguras', () => {
    const safe = '<p><strong>Bold</strong> text</p>';
    const result = sanitizeHTML(safe);
    expect(result).toBe(safe);
  });
});

describe('sanitizeURL', () => {
  it('deve bloquear javascript: URLs', () => {
    const malicious = 'javascript:alert("XSS")';
    const result = sanitizeURL(malicious);
    expect(result).toBe('');
  });

  it('deve permitir URLs HTTP(S)', () => {
    const safe = 'https://example.com';
    const result = sanitizeURL(safe);
    expect(result).toBe(safe);
  });
});`}
              </pre>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-sm">useAuth - Teste de Hook</h3>
              <pre className="text-xs bg-white p-3 rounded overflow-x-auto">
{`import { renderHook } from '@testing-library/react';
import { useAuth } from './useAuth';

describe('useAuth', () => {
  it('deve retornar user quando autenticado', async () => {
    const { result } = renderHook(() => useAuth());
    
    // Aguardar carregamento
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeDefined();
  });

  it('deve identificar tipo de usuário corretamente', async () => {
    const { result } = renderHook(() => useAuth());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.hasUserType('aluno')).toBe(true);
  });
});`}
              </pre>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-sm">QuickStats - Teste de Componente</h3>
              <pre className="text-xs bg-white p-3 rounded overflow-x-auto">
{`import { render, screen } from '@testing-library/react';
import QuickStats from './QuickStats';
import { BookOpen } from 'lucide-react';

describe('QuickStats', () => {
  const defaultProps = {
    icon: BookOpen,
    title: 'Módulos Ativos',
    value: '3',
    subtitle: 'Em progresso',
    color: '#00A99D'
  };

  it('deve renderizar corretamente', () => {
    render(<QuickStats {...defaultProps} />);
    
    expect(screen.getByText('Módulos Ativos')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Em progresso')).toBeInTheDocument();
  });

  it('deve ter atributos de acessibilidade', () => {
    render(<QuickStats {...defaultProps} />);
    
    const card = screen.getByRole('article');
    expect(card).toHaveAttribute('aria-label');
    expect(card).toHaveAttribute('tabIndex', '0');
  });

  it('não deve re-renderizar com props iguais (memo)', () => {
    const { rerender } = render(<QuickStats {...defaultProps} />);
    const firstRender = screen.getByText('3');
    
    rerender(<QuickStats {...defaultProps} />);
    const secondRender = screen.getByText('3');
    
    // Mesmo elemento = não re-renderizou
    expect(firstRender).toBe(secondRender);
  });
});`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ferramentas de Debugging */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode className="w-5 h-5" />
            Ferramentas de Debugging
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h3 className="font-semibold mb-2">React Developer Tools</h3>
            <p className="text-sm text-gray-600 mb-2">
              Extensão do Chrome/Firefox para inspecionar componentes React
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Visualizar hierarquia de componentes</li>
              <li>Inspecionar props e state</li>
              <li>Identificar re-renders desnecessários (Profiler)</li>
              <li>Editar props em tempo real</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">React Query DevTools</h3>
            <p className="text-sm text-gray-600 mb-2">
              Já integrado na aplicação (ambiente de desenvolvimento)
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Visualizar cache de queries</li>
              <li>Monitorar status de loading/error</li>
              <li>Invalidar cache manualmente</li>
              <li>Ver histórico de fetches</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Console do Navegador</h3>
            <p className="text-sm text-gray-600 mb-2">
              Use console.log estratégico para debugging
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>console.group() para logs organizados</li>
              <li>console.table() para dados tabulares</li>
              <li>console.time() para medir performance</li>
              <li>console.trace() para stack traces</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Boas Práticas */}
      <Card>
        <CardHeader>
          <CardTitle>Boas Práticas de Desenvolvimento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
              <div>
                <strong>Validação de Entrada:</strong> Sempre valide dados de entrada com Zod ou validação customizada
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
              <div>
                <strong>Error Boundaries:</strong> Use ErrorBoundary para capturar crashes de componentes
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
              <div>
                <strong>Memoização:</strong> Use React.memo, useMemo, useCallback para otimizar performance
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
              <div>
                <strong>Sanitização:</strong> Sempre sanitize HTML e URLs antes de renderizar
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
              <div>
                <strong>Acessibilidade:</strong> Adicione aria-labels, roles e suporte a teclado
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
              <div>
                <strong>Loading States:</strong> Sempre mostre feedback visual durante operações assíncronas
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
              <div>
                <strong>Error Handling:</strong> Capture e trate erros apropriadamente, mostrando mensagens amigáveis
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}