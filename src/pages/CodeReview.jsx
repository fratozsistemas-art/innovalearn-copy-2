import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  Target
} from "lucide-react";
import ReactMarkdown from "react-markdown";

const reviewContent = `# 🔍 Review Abrangente do Código - InnovaLearn Academy

## Versão 1.0 | Dezembro 2024

---

## 📊 Resumo Executivo

### ✅ Pontos Fortes

1. **Arquitetura bem estruturada** - Separação clara entre páginas, componentes e hooks
2. **Sistema de autenticação robusto** - AuthGuard com múltiplos níveis de permissão
3. **Hooks customizados reutilizáveis** - useAuth, useCurrentUser, useNormalizedResources
4. **Gamificação bem implementada** - Sistema completo de coins, badges e streaks
5. **React Query para cache** - Gerenciamento eficiente de estado do servidor
6. **Componentes shadcn/ui** - UI consistente e acessível
7. **Documentação completa** - Guias técnicos e pedagógicos bem detalhados

### ⚠️ Áreas de Atenção

1. **Performance** - Algumas páginas carregam muitos dados simultaneamente
2. **Error handling** - Nem todos os componentes têm tratamento de erro adequado
3. **Loading states** - Alguns componentes não mostram skeleton/loading
4. **Validação de dados** - Falta validação em alguns formulários
5. **Testes** - Nenhum teste unitário ou de integração implementado

---

## 🏗️ 1. Arquitetura

### ✅ Bem Implementado

**Estrutura de Pastas Clara:**
\`\`\`
src/
├── pages/              # Páginas principais
├── components/         # Componentes reutilizáveis
│   ├── ui/            # shadcn/ui base components
│   ├── auth/          # Autenticação
│   ├── hooks/         # Hooks customizados
│   └── ...
├── entities/          # Schemas de dados (JSON Schema)
└── integrations/      # APIs externas
\`\`\`

**Separação de Responsabilidades:**
- ✅ Hooks para lógica de negócio
- ✅ Componentes para UI
- ✅ Páginas como orquestradores
- ✅ Utils para funções auxiliares

### ⚠️ Recomendações

**1. Implementar código splitting:**
\`\`\`javascript
// pages/Dashboard.jsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('../components/HeavyComponent'));

export default function Dashboard() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
\`\`\`

**2. Centralizar configurações:**
\`\`\`javascript
// config/app.config.js
export const APP_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FORMATS: ['pdf', 'jpg', 'png'],
  ITEMS_PER_PAGE: 20,
  API_TIMEOUT: 30000
};
\`\`\`

---

## 🔐 2. Segurança

### ✅ Bem Implementado

**1. Sanitização de HTML:**
\`\`\`javascript
// components/utils/sanitize.js
export function sanitizeHTML(html) {
  // Remove tags perigosas
  // Valida URLs
  // Escapa caracteres especiais
}
\`\`\`

**2. AuthGuard para proteção de rotas:**
\`\`\`javascript
<AuthGuard requireUserTypes={['administrador']}>
  <AdminContent />
</AuthGuard>
\`\`\`

**3. Validação de dados:**
\`\`\`javascript
// components/utils/validation.js
export function isValidEmail(email) { /* ... */ }
export function isValidCPF(cpf) { /* ... */ }
\`\`\`

### ⚠️ Vulnerabilidades Potenciais

**1. ❌ CRÍTICO: Uso de dangerouslySetInnerHTML sem sanitização:**

**Problema encontrado em LessonView.jsx:**
\`\`\`javascript
// ❌ INSEGURO
<div dangerouslySetInnerHTML={{ __html: lesson.description }} />
\`\`\`

**✅ CORRETO:**
\`\`\`javascript
import { sanitizeHTML } from '@/components/utils/sanitize';

<div dangerouslySetInnerHTML={{ __html: sanitizeHTML(lesson.description) }} />

// Ou melhor ainda:
import SafeHTML from '@/components/common/SafeHTML';

<SafeHTML content={lesson.description} />
\`\`\`

**2. ⚠️ Validação de uploads:**

**Adicionar validação de tipo e tamanho:**
\`\`\`javascript
// components/utils/fileValidation.js
export function validateFile(file, options = {}) {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB
    allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
  } = options;

  if (file.size > maxSize) {
    throw new Error(\`Arquivo muito grande. Máximo: \${maxSize / 1024 / 1024}MB\`);
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error(\`Tipo não permitido. Use: \${allowedTypes.join(', ')}\`);
  }

  return true;
}
\`\`\`

**3. ⚠️ Rate limiting para integrações:**

**Implementar debounce em buscas:**
\`\`\`javascript
import { useDebouncedCallback } from 'use-debounce';

const debouncedSearch = useDebouncedCallback(
  (value) => {
    // Buscar
  },
  300
);
\`\`\`

---

## ⚡ 3. Performance

### ⚠️ Problemas Identificados

**1. ❌ Carregar todos os dados ao mesmo tempo:**

**Problema em Dashboard.jsx:**
\`\`\`javascript
// ❌ Carrega tudo de uma vez
const [modules, lessons, assignments, progress] = await Promise.all([
  Module.list(),
  Lesson.list(),
  Assignment.list(),
  StudentProgress.list()
]);
\`\`\`

**✅ SOLUÇÃO - Paginação e lazy loading:**
\`\`\`javascript
// Carregar apenas o necessário
const modules = await Module.filter(
  { student_email: user.email },
  '-created_date',
  10 // Apenas 10 mais recentes
);

// Usar infinite scroll para carregar mais
import { useInfiniteQuery } from '@tanstack/react-query';

const {
  data,
  fetchNextPage,
  hasNextPage
} = useInfiniteQuery({
  queryKey: ['lessons'],
  queryFn: ({ pageParam = 0 }) => 
    Lesson.list('-created_date', 20, pageParam * 20),
  getNextPageParam: (lastPage, pages) => 
    lastPage.length === 20 ? pages.length : undefined
});
\`\`\`

**2. ❌ Re-renders desnecessários:**

**Problema: Componentes re-renderizam quando não precisam:**
\`\`\`javascript
// ❌ Cria nova função a cada render
<Button onClick={() => handleClick(item.id)}>
  Click
</Button>
\`\`\`

**✅ SOLUÇÃO - useCallback e useMemo:**
\`\`\`javascript
const handleClick = useCallback((id) => {
  // lógica
}, [dependencies]);

const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
\`\`\`

**3. ❌ Listas sem key única:**

**Sempre use IDs únicos para keys:**
\`\`\`javascript
// ❌ ERRADO
{items.map((item, index) => <Item key={index} {...item} />)}

// ✅ CORRETO
{items.map((item) => <Item key={item.id} {...item} />)}
\`\`\`

---

## 🎨 4. Componentes e UI

### ✅ Bem Implementado

**1. Design System consistente:**
- Variáveis CSS centralizadas
- Componentes shadcn/ui reutilizáveis
- Tema Innova bem definido

**2. Responsividade:**
- Grid adaptativo
- Mobile-first approach
- Breakpoints consistentes

### ⚠️ Melhorias Sugeridas

**1. Adicionar Skeleton Screens:**

\`\`\`javascript
// components/common/SkeletonCard.jsx
export function SkeletonCard() {
  return (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-4 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-20 w-full" />
      </CardContent>
    </Card>
  );
}

// Uso:
{isLoading ? (
  <SkeletonCard />
) : (
  <ActualCard data={data} />
)}
\`\`\`

**2. Estados vazios mais amigáveis:**

\`\`\`javascript
// components/common/EmptyState.jsx
export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action 
}) {
  return (
    <div className="text-center py-12">
      <Icon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {action}
    </div>
  );
}
\`\`\`

---

## 🪝 5. Hooks Customizados

### ✅ Muito Bem Implementado

**Hooks bem estruturados:**
- \`useAuth()\` - Autenticação completa
- \`useCurrentUser()\` - Usuário atual com cache
- \`useNormalizedResources()\` - Normalização de recursos
- \`useNotificationSystem()\` - Sistema de notificações

### ⚠️ Recomendações

**1. Adicionar hooks de otimização:**

\`\`\`javascript
// components/hooks/useDebounce.js
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Uso:
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 500);

useEffect(() => {
  // Buscar apenas quando debounced mudar
  fetchResults(debouncedSearch);
}, [debouncedSearch]);
\`\`\`

**2. Hook para controle de foco:**

\`\`\`javascript
// components/hooks/useFocusTrap.js
export function useFocusTrap(ref) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const focusableElements = element.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    function handleTab(e) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }

    element.addEventListener('keydown', handleTab);
    return () => element.removeEventListener('keydown', handleTab);
  }, [ref]);
}
\`\`\`

---

## 🗄️ 6. Gerenciamento de Dados

### ✅ Bem Implementado

**1. React Query para cache:**
\`\`\`javascript
const { data, isLoading } = useQuery({
  queryKey: ['lessons', moduleId],
  queryFn: () => Lesson.filter({ module_id: moduleId }),
  staleTime: 5 * 60 * 1000 // 5 minutos
});
\`\`\`

**2. Mutations com invalidação:**
\`\`\`javascript
const mutation = useMutation({
  mutationFn: (data) => Lesson.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries(['lessons']);
  }
});
\`\`\`

### ⚠️ Melhorias

**1. Optimistic Updates:**

\`\`\`javascript
const mutation = useMutation({
  mutationFn: updateLesson,
  onMutate: async (newLesson) => {
    // Cancelar queries em andamento
    await queryClient.cancelQueries(['lesson', newLesson.id]);

    // Snapshot do valor anterior
    const previousLesson = queryClient.getQueryData(['lesson', newLesson.id]);

    // Update otimista
    queryClient.setQueryData(['lesson', newLesson.id], newLesson);

    return { previousLesson };
  },
  onError: (err, newLesson, context) => {
    // Reverter em caso de erro
    queryClient.setQueryData(
      ['lesson', newLesson.id],
      context.previousLesson
    );
  }
});
\`\`\`

**2. Persistência local:**

\`\`\`javascript
// components/hooks/useLocalStorage.js
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  };

  return [storedValue, setValue];
}
\`\`\`

---

## 🐛 7. Error Handling

### ⚠️ Inconsistente

**Problemas encontrados:**

**1. Try/catch sem tratamento:**
\`\`\`javascript
// ❌ ERRADO
try {
  const data = await fetchData();
} catch (error) {
  console.error(error); // Apenas log não é suficiente
}
\`\`\`

**✅ CORRETO:**
\`\`\`javascript
try {
  const data = await fetchData();
} catch (error) {
  console.error('Erro ao buscar dados:', error);
  
  // Mostrar feedback ao usuário
  toast.error('Erro ao carregar dados. Tente novamente.');
  
  // Log para monitoramento (se houver)
  if (window.analytics) {
    window.analytics.track('Erro ao buscar dados', {
      error: error.message,
      stack: error.stack
    });
  }
  
  // Retornar estado de erro
  throw error; // Ou return null, dependendo do caso
}
\`\`\`

**2. Error Boundaries limitados:**

\`\`\`javascript
// App.jsx ou Layout.jsx
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" className="p-8 text-center">
      <h2>Algo deu errado 😞</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>
        Tentar novamente
      </button>
    </div>
  );
}

<ErrorBoundary
  FallbackComponent={ErrorFallback}
  onReset={() => window.location.reload()}
>
  <App />
</ErrorBoundary>
\`\`\`

---

## 🧪 8. Testes

### ❌ NÃO IMPLEMENTADO

**Recomendação: Adicionar testes básicos**

**1. Setup de testes:**

\`\`\`bash
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
\`\`\`

**2. Exemplo de teste para componente:**

\`\`\`javascript
// components/auth/AuthGuard.test.jsx
import { render, screen } from '@testing-library/react';
import AuthGuard from './AuthGuard';

describe('AuthGuard', () => {
  it('mostra conteúdo quando autenticado', () => {
    render(
      <AuthGuard>
        <div>Conteúdo Protegido</div>
      </AuthGuard>
    );
    
    expect(screen.getByText('Conteúdo Protegido')).toBeInTheDocument();
  });

  it('mostra mensagem de acesso negado quando não autenticado', () => {
    // Mock do hook useAuth
    render(
      <AuthGuard>
        <div>Conteúdo Protegido</div>
      </AuthGuard>
    );
    
    expect(screen.getByText('Acesso Restrito')).toBeInTheDocument();
  });
});
\`\`\`

**3. Teste de hook:**

\`\`\`javascript
// components/hooks/useAuth.test.js
import { renderHook } from '@testing-library/react';
import { useAuth } from './useAuth';

describe('useAuth', () => {
  it('retorna usuário quando autenticado', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeDefined();
  });
});
\`\`\`

---

## 🎯 9. Prioridades de Ação

### 🔴 CRÍTICAS (Fazer AGORA)

1. **Sanitizar todo HTML user-generated** ⚠️
   - Revisar todos os \`dangerouslySetInnerHTML\`
   - Usar \`sanitizeHTML()\` ou \`<SafeHTML />\`

2. **Adicionar validação de uploads** ⚠️
   - Validar tipo e tamanho de arquivos
   - Implementar scan de vírus (se possível)

3. **Error boundaries em páginas críticas** ⚠️
   - Dashboard, LessonView, Assignments

### 🟡 IMPORTANTES (Fazer em breve)

4. **Implementar loading skeletons**
   - Melhor UX durante carregamentos

5. **Otimizar queries grandes**
   - Paginação em listas longas
   - Lazy loading de imagens

6. **Adicionar testes básicos**
   - Hooks críticos
   - Componentes de autenticação

### 🟢 MELHORIAS (Fazer quando possível)

7. **Code splitting**
   - Lazy load de páginas pesadas

8. **Acessibilidade avançada**
   - Testar com screen readers
   - Adicionar mais ARIA labels

9. **Monitoramento de erros**
   - Integrar Sentry ou similar

---

## 📝 10. Checklist de Qualidade

### Antes de Deploy

- [ ] Todos os \`dangerouslySetInnerHTML\` sanitizados
- [ ] Validação de uploads implementada
- [ ] Error boundaries adicionados
- [ ] Loading states em todas as páginas
- [ ] Testes críticos passando
- [ ] Variáveis de ambiente configuradas
- [ ] Build de produção testado
- [ ] Performance auditada (Lighthouse)
- [ ] Acessibilidade verificada
- [ ] SEO básico implementado

### Monitoramento Contínuo

- [ ] Logs de erro centralizados
- [ ] Métricas de performance
- [ ] Feedback de usuários
- [ ] Análise de uso (analytics)
- [ ] Backups regulares do banco

---

## 🎓 11. Conclusão

**Score Geral: 8.2/10**

**Pontos Fortes:**
- ✅ Arquitetura sólida e escalável
- ✅ Código limpo e bem organizado
- ✅ Boas práticas React seguidas
- ✅ Documentação excelente

**Pontos de Melhoria:**
- ⚠️ Segurança (sanitização)
- ⚠️ Performance (otimizações)
- ⚠️ Testes (cobertura zero)
- ⚠️ Error handling (inconsistente)

**Recomendação:**
O código está em **bom estado para MVP/Beta**, mas precisa de melhorias de segurança e performance antes de produção completa.

**Próximos Passos:**
1. Implementar correções críticas (vermelho)
2. Adicionar testes básicos
3. Otimizar performance
4. Preparar para escala

---

**Última atualização:** Dezembro 2024
**Revisado por:** Base44 AI Assistant
`;

export default function CodeReviewPage() {
  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-heading font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Review Abrangente do Código
            </h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Análise completa da qualidade, segurança e performance
            </p>
          </div>
        </div>

        {/* Score Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-2" style={{ borderColor: 'var(--success)' }}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" 
                style={{ backgroundColor: 'var(--success)' }}>
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold mb-1" style={{ color: 'var(--success)' }}>8.2</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Score Geral</div>
            </CardContent>
          </Card>

          <Card className="border-2" style={{ borderColor: 'var(--warning)' }}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" 
                style={{ backgroundColor: 'var(--warning)' }}>
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold mb-1" style={{ color: 'var(--warning)' }}>3</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Críticos</div>
            </CardContent>
          </Card>

          <Card className="border-2" style={{ borderColor: 'var(--info)' }}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" 
                style={{ backgroundColor: 'var(--info)' }}>
                <Info className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold mb-1" style={{ color: 'var(--info)' }}>6</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Importantes</div>
            </CardContent>
          </Card>

          <Card className="border-2" style={{ borderColor: 'var(--primary-teal)' }}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" 
                style={{ backgroundColor: 'var(--primary-teal)' }}>
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold mb-1" style={{ color: 'var(--primary-teal)' }}>9</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Melhorias</div>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <Card className="card-innova border-none shadow-lg">
          <CardContent className="p-8">
            <div 
              className="prose prose-slate max-w-none"
              style={{ 
                color: 'var(--text-primary)',
                fontSize: '15px',
                lineHeight: '1.8'
              }}
            >
              <ReactMarkdown>{reviewContent}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}