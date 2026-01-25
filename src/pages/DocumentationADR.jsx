import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";

const adr001 = `# ADR 001: Escolha da Plataforma Base44

## Status
Aceito

## Contexto
Precisávamos de uma plataforma para desenvolvimento rápido de aplicações educacionais com:
- Sistema de autenticação robusto
- Gerenciamento de banco de dados
- APIs para integrações (especialmente IA)
- Hospedagem e infraestrutura
- Baixa complexidade de setup

## Decisão
Escolhemos a plataforma Base44 como foundation para InnovaLearn Academy.

## Razões

### Vantagens
1. **Autenticação Built-in** - Sistema completo de login, convites, gerenciamento de usuários
2. **Entities System** - Schema-based data modeling com validação automática
3. **Integration Framework** - APIs pré-configuradas (LLM, Email, File Upload)
4. **Zero DevOps** - Hospedagem, deployment, backups automáticos
5. **Rapid Development** - Foco em lógica de negócio, não em infraestrutura

### Desvantagens
1. **Vendor Lock-in** - Dependência da plataforma Base44
2. **Limitações** - Menos controle sobre infraestrutura
3. **Custo** - Pricing baseado em uso pode escalar

## Consequências

### Positivas
- ✅ Desenvolvimento 3-4x mais rápido
- ✅ Menos código de infraestrutura para manter
- ✅ Segurança gerenciada pela plataforma
- ✅ Atualizações automáticas

### Negativas
- ⚠️ Migração futura seria complexa
- ⚠️ Dependência de uptime da Base44
- ⚠️ Customizações limitadas

## Alternativas Consideradas
1. **Firebase** - Boa opção, mas menos flexível para IA/ML
2. **Supabase** - Open source, mas mais complexo de gerenciar
3. **Custom Backend** - Máximo controle, mas desenvolvimento muito mais lento

## Revisão
Este documento deve ser revisado quando:
- Base44 apresentar limitações críticas
- Escala ultrapassar 100k usuários ativos
- Custo mensal > R$ 10k

---
**Autor:** Equipe Técnica InnovaLearn  
**Data:** Dezembro 2024  
**Última Revisão:** Dezembro 2024`;

const adr002 = `# ADR 002: React Query para State Management

## Status
Aceito

## Contexto
Precisávamos de uma solução para gerenciar estado do servidor, cache de dados, e sincronização entre cliente e servidor.

## Decisão
Usar React Query (@tanstack/react-query) como solução principal de state management para dados do servidor.

## Razões

### Vantagens
1. **Cache Inteligente** - Gerencia cache automaticamente com stale/fresh states
2. **Optimistic Updates** - Atualizações otimistas para melhor UX
3. **Background Refetching** - Mantém dados atualizados automaticamente
4. **Hooks API** - Integração perfeita com React Hooks
5. **DevTools** - Ferramentas de desenvolvimento excelentes
6. **TypeScript Support** - Tipagem forte e autocomplete

### Por que NÃO Redux?
- Redux é overkill para state do servidor
- React Query resolve 90% dos casos de uso
- Menos boilerplate (actions, reducers, sagas)
- Performance superior para data fetching

## Padrões Implementados

### Hooks Customizados
\`\`\`javascript
// components/hooks/useUser.js
export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    staleTime: 5 * 60 * 1000 // 5 minutos
  });
}
\`\`\`

### Mutations com Invalidação
\`\`\`javascript
const mutation = useMutation({
  mutationFn: (data) => base44.entities.Lesson.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries(['lessons']);
  }
});
\`\`\`

## Consequências

### Positivas
- ✅ Código mais limpo e conciso
- ✅ Cache automático reduz requests
- ✅ Loading/Error states gerenciados
- ✅ Performance excelente

### Negativas
- ⚠️ Curva de aprendizado inicial
- ⚠️ Precisa pensar em query keys corretamente
- ⚠️ State local ainda precisa useState/useReducer

## State Local vs Server State

**Use React Query para:**
- Dados do banco (entities)
- APIs externas
- Dados que precisam de cache

**Use useState/useReducer para:**
- UI state (modals, tabs, forms)
- State que não precisa persistir
- State altamente transitório

## Configuração

\`\`\`javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});
\`\`\`

---
**Autor:** Equipe Técnica InnovaLearn  
**Data:** Dezembro 2024`;

export default function DocumentationADRPage() {
  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Architecture Decision Records (ADRs)</h1>
          <p className="text-gray-600">
            Documentação das decisões arquiteturais importantes do projeto
          </p>
        </div>

        <Tabs defaultValue="adr001" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="adr001">ADR-001: Base44</TabsTrigger>
            <TabsTrigger value="adr002">ADR-002: React Query</TabsTrigger>
          </TabsList>

          <TabsContent value="adr001">
            <Card>
              <CardContent className="p-8 prose prose-sm max-w-none">
                <ReactMarkdown>{adr001}</ReactMarkdown>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="adr002">
            <Card>
              <CardContent className="p-8 prose prose-sm max-w-none">
                <ReactMarkdown>{adr002}</ReactMarkdown>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}