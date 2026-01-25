import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, Keyboard, Volume2, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

/**
 * Documentação de Acessibilidade
 */
export default function AccessibilityDocs() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-3xl">
            <Eye className="w-8 h-8 text-blue-600" />
            Guia de Acessibilidade - Innova Academy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Este guia documenta as práticas de acessibilidade implementadas na plataforma
            e fornece orientações para desenvolvimento inclusivo.
          </p>

          <Tabs defaultValue="aria">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="aria">ARIA</TabsTrigger>
              <TabsTrigger value="keyboard">Teclado</TabsTrigger>
              <TabsTrigger value="screen-readers">Screen Readers</TabsTrigger>
              <TabsTrigger value="checklist">Checklist</TabsTrigger>
            </TabsList>

            {/* ARIA */}
            <TabsContent value="aria" className="space-y-6">
              <Alert>
                <Eye className="w-4 h-4" />
                <AlertDescription>
                  <strong>ARIA (Accessible Rich Internet Applications)</strong> fornece atributos
                  para tornar conteúdo web dinâmico mais acessível para tecnologias assistivas.
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Atributos ARIA Essenciais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">✅ BOAS PRÁTICAS:</h4>
                    <pre className="bg-green-50 p-4 rounded-lg overflow-x-auto border border-green-200 text-sm">
{`// Botões semânticos
<button aria-label="Fechar modal">
  <X />
</button>

// Regiões da página
<main role="main" aria-label="Conteúdo principal">
  <section role="region" aria-labelledby="section-title">
    <h2 id="section-title">Título da Seção</h2>
  </section>
</main>

// Estados dinâmicos
<button aria-pressed={isActive} aria-label="Filtrar por categoria">
  Filtrar
</button>

// Anúncios para screen readers
<div role="status" aria-live="polite" aria-atomic="true">
  {message}
</div>

// Navegação
<nav aria-label="Navegação principal">
  <ul role="list">
    <li><a href="/">Início</a></li>
  </ul>
</nav>

// Inputs
<label htmlFor="email">Email</label>
<input 
  id="email"
  type="email"
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby="email-error"
/>
{hasError && (
  <span id="email-error" role="alert">
    Email inválido
  </span>
)}`}
                    </pre>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Volume2 className="w-4 h-4" />
                      Níveis de aria-live
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><code>polite</code> - Anuncia quando o usuário está inativo (padrão)</li>
                      <li><code>assertive</code> - Interrompe para anunciar imediatamente</li>
                      <li><code>off</code> - Não anuncia mudanças</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Teclado */}
            <TabsContent value="keyboard" className="space-y-6">
              <Alert>
                <Keyboard className="w-4 h-4" />
                <AlertDescription>
                  <strong>Navegação por Teclado</strong> é essencial para usuários que não podem
                  usar mouse ou preferem navegar com teclado.
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Teclas de Navegação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <kbd className="px-2 py-1 bg-gray-200 rounded text-sm font-mono">Tab</kbd>
                      <p className="text-sm mt-2">Navega para próximo elemento focável</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <kbd className="px-2 py-1 bg-gray-200 rounded text-sm font-mono">Shift + Tab</kbd>
                      <p className="text-sm mt-2">Navega para elemento anterior</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <kbd className="px-2 py-1 bg-gray-200 rounded text-sm font-mono">Enter</kbd>
                      <p className="text-sm mt-2">Ativa links e botões</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <kbd className="px-2 py-1 bg-gray-200 rounded text-sm font-mono">Space</kbd>
                      <p className="text-sm mt-2">Ativa botões e checkboxes</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <kbd className="px-2 py-1 bg-gray-200 rounded text-sm font-mono">Esc</kbd>
                      <p className="text-sm mt-2">Fecha modals e dropdowns</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <kbd className="px-2 py-1 bg-gray-200 rounded text-sm font-mono">Setas</kbd>
                      <p className="text-sm mt-2">Navega em listas e menus</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Implementação de Navegação por Teclado</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
{`// Tornar div clicável acessível por teclado
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
  aria-label="Abrir detalhes"
>
  Clique aqui
</div>

// Usar useAccessibility hook
import { useAccessibility } from '@/components/hooks/useAccessibility';

function MyModal({ isOpen }) {
  const { createFocusTrap } = useAccessibility();

  useEffect(() => {
    if (isOpen) {
      const cleanup = createFocusTrap('#modal-container');
      return cleanup;
    }
  }, [isOpen, createFocusTrap]);

  return <div id="modal-container">...</div>;
}`}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Screen Readers */}
            <TabsContent value="screen-readers" className="space-y-6">
              <Alert>
                <Volume2 className="w-4 h-4" />
                <AlertDescription>
                  <strong>Screen Readers</strong> convertem conteúdo visual em áudio ou braille
                  para usuários com deficiência visual.
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Hook useAccessibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
{`import { useAccessibility } from '@/components/hooks/useAccessibility';

function MyComponent() {
  const { 
    announce, 
    setPageTitle,
    announcePageChange 
  } = useAccessibility();

  // Definir título da página
  useEffect(() => {
    setPageTitle('Dashboard');
  }, []);

  // Anunciar ações
  const handleSave = async () => {
    await saveData();
    announce('Dados salvos com sucesso', 'polite');
  };

  // Anunciar erros
  const handleError = (error) => {
    announce(\`Erro: \${error.message}\`, 'assertive');
  };

  return ...;
}`}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Classe .sr-only (Screen Reader Only)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Use a classe <code>.sr-only</code> para texto visível apenas para screen readers:
                  </p>
                  <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
{`// No CSS global
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

// Uso em JSX
<button>
  <TrashIcon />
  <span className="sr-only">Excluir item</span>
</button>`}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Checklist */}
            <TabsContent value="checklist" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Checklist de Acessibilidade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* HTML Semântico */}
                    <div>
                      <h4 className="font-semibold mb-3 text-lg">HTML Semântico</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-sm">Usar tags semânticas (&lt;header&gt;, &lt;nav&gt;, &lt;main&gt;, &lt;footer&gt;)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-sm">Hierarquia de headings correta (h1 → h2 → h3)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-sm">Listas com &lt;ul&gt;/&lt;ol&gt; e &lt;li&gt;</span>
                        </label>
                      </div>
                    </div>

                    {/* ARIA */}
                    <div>
                      <h4 className="font-semibold mb-3 text-lg">ARIA</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-sm">aria-label em ícones e botões sem texto</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-sm">role apropriado em elementos customizados</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-sm">aria-live para conteúdo dinâmico</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-sm">aria-invalid e aria-describedby em formulários</span>
                        </label>
                      </div>
                    </div>

                    {/* Teclado */}
                    <div>
                      <h4 className="font-semibold mb-3 text-lg">Navegação por Teclado</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-sm">Todos os elementos interativos são focáveis (tabIndex)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-sm">Ordem de foco lógica</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-sm">Enter/Space ativam elementos clicáveis</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-sm">Esc fecha modals</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-sm">Focus trap em modals</span>
                        </label>
                      </div>
                    </div>

                    {/* Visual */}
                    <div>
                      <h4 className="font-semibold mb-3 text-lg">Visual</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-sm">Contraste mínimo 4.5:1 para texto normal</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-sm">Contraste mínimo 3:1 para texto grande</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-sm">Indicador visual de foco</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-sm">Texto redimensionável até 200%</span>
                        </label>
                      </div>
                    </div>

                    {/* Formulários */}
                    <div>
                      <h4 className="font-semibold mb-3 text-lg">Formulários</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-sm">Labels associados a inputs (htmlFor/id)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-sm">Mensagens de erro claras e associadas (aria-describedby)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-sm">Campos obrigatórios marcados (aria-required)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-sm">Autocomplete apropriado</span>
                        </label>
                      </div>
                    </div>

                    {/* Imagens */}
                    <div>
                      <h4 className="font-semibold mb-3 text-lg">Imagens e Mídia</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-sm">Alt text descritivo em imagens</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-sm">alt="" em imagens decorativas</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-sm">Legendas em vídeos</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Alert className="bg-blue-50 border-blue-200">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <AlertDescription>
                  <strong>Ferramentas de Teste:</strong>
                  <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                    <li>Lighthouse (Chrome DevTools) - Auditoria automática</li>
                    <li>axe DevTools - Extensão para Chrome/Firefox</li>
                    <li>WAVE - Avaliação visual de acessibilidade</li>
                    <li>Navegue pelo site usando apenas teclado</li>
                    <li>Teste com screen reader (NVDA, JAWS, VoiceOver)</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}