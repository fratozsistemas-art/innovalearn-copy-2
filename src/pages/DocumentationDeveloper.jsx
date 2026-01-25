import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CheckCircle2, Code, Rocket, Book } from "lucide-react";
import ReactMarkdown from "react-markdown";

const onboardingGuide = `# 👨‍💻 Guia de Onboarding - Desenvolvedores InnovaLearn

## Bem-vindo! 🎉

Este guia vai te ajudar a começar a desenvolver na InnovaLearn Academy em **1-2 semanas**.

---

## 📋 Checklist de Primeiro Dia

- [ ] Acesso ao repositório GitHub
- [ ] Acesso à plataforma Base44
- [ ] Node.js 18+ instalado
- [ ] VS Code (ou editor preferido) configurado
- [ ] Clone do repositório
- [ ] \`npm install\` executado com sucesso
- [ ] App rodando localmente

---

## 🚀 Setup Inicial (30 minutos)

### 1. Pré-requisitos
\`\`\`bash
# Verificar versões
node --version  # Deve ser 18+
npm --version   # Deve ser 9+
\`\`\`

### 2. Clone e Install
\`\`\`bash
git clone [repo-url]
cd innovalearn-academy
npm install
\`\`\`

### 3. Configuração
\`\`\`bash
# Copiar variáveis de ambiente
cp .env.example .env

# Editar .env com credenciais Base44
# VITE_BASE44_API_KEY=...
# VITE_BASE44_PROJECT_ID=...
\`\`\`

### 4. Rodar Localmente
\`\`\`bash
npm run dev
# App rodando em http://localhost:5173
\`\`\`

---

## 🏗️ Arquitetura (Leitura: 1 hora)

### Estrutura de Pastas
\`\`\`
src/
├── pages/              # Páginas principais (Dashboard, Courses, etc.)
├── components/         # Componentes reutilizáveis
│   ├── ui/            # shadcn/ui components
│   ├── hooks/         # Custom React hooks
│   ├── auth/          # Autenticação
│   ├── common/        # Componentes comuns
│   └── ...
├── entities/          # Schemas JSON (models)
└── Layout.js          # Layout da aplicação
\`\`\`

### Stack Tecnológico
- **Frontend:** React 18 + Vite
- **UI:** shadcn/ui + Tailwind CSS
- **State:** React Query + useState
- **Backend:** Base44 Platform
- **Auth:** Base44 Auth
- **Database:** Base44 Entities (PostgreSQL)
- **AI:** Base44 Integrations (OpenAI)

---

## 📚 Conceitos Principais

### 1. Base44 Entities
São como "tabelas" do banco, definidas via JSON Schema

### 2. Custom Hooks
Centralizam lógica de negócio e data fetching

### 3. AuthGuard
Protege rotas baseado em permissões

### 4. React Query Patterns
Gerencia cache e estado do servidor

---

## 🎯 Tarefas Práticas (Semana 1)

### Dia 1-2: Familiarização
- [ ] Rodar app localmente
- [ ] Navegar por todas as páginas
- [ ] Fazer login como aluno, professor e admin
- [ ] Ler ADRs

### Dia 3-4: Primeiro Bug Fix
- [ ] Pegar um bug do backlog
- [ ] Criar branch: \`fix/[numero-do-bug]\`
- [ ] Implementar correção
- [ ] Testar localmente
- [ ] Abrir Pull Request

### Dia 5: Primeira Feature
- [ ] Pegar uma feature pequena
- [ ] Criar branch: \`feature/[nome-da-feature]\`
- [ ] Implementar
- [ ] Code review com mentor
- [ ] Merge!

---

## ✅ Critérios de Sucesso (2 Semanas)

Ao final de 2 semanas, você deve conseguir:
- [ ] Entender arquitetura geral do sistema
- [ ] Criar/editar entities
- [ ] Criar componentes React
- [ ] Usar React Query para data fetching
- [ ] Implementar features completas (CRUD básico)
- [ ] Fazer code review de outros devs
- [ ] Debuggar problemas comuns

---

**Bem-vindo ao time! 🚀**`;

const troubleshootingGuide = `# 🔧 Guia de Troubleshooting

## Problemas Comuns e Soluções

### 🚨 App Não Carrega / Tela Branca

**Soluções:**
1. Clear cache + rebuild
2. Verificar .env
3. Verificar ErrorBoundary

### 🔐 Problemas de Autenticação

**Causa Comum:** Usuário sem \`onboarding_completed\`

### 📊 React Query Issues

**Sintoma:** Dados não atualizam
**Causa:** Query não sendo invalidada

### 🎨 Problemas de UI/Styling

**Verificar:**
- tailwind.config.js
- CSS foi importado
- Classes são válidas

---

## 🐛 Erros Comuns

### 1. "Cannot read property 'X' of undefined"
Use optional chaining: \`object?.property\`

### 2. "React Hook 'useX' is called conditionally"
Hooks devem ser chamados incondicionalmente no topo do componente

### 3. "Too many re-renders"
Não chamar setState diretamente no render

---

## 🔍 Como Debuggar

1. Console.log estratégico
2. React DevTools
3. Network Tab
4. Breakpoints

---

**Dica:** Mantenha este documento aberto enquanto desenvolve! 💡`;

const disasterRecoveryPlan = `# 🚨 Plano de Disaster Recovery

## RTO e RPO Definidos

### RTO (Recovery Time Objective)
- **Dados Críticos:** < 1 hora
- **Sistema Completo:** < 2 horas

### RPO (Recovery Point Objective)
- **Dados de Progresso:** < 15 minutos
- **Configurações:** < 1 hora

---

## 🛡️ Estratégia de Backup (Base44)

- **Frequência:** Contínua
- **Retenção:** 30 dias
- **Tipo:** Incremental + Full diário
- **Localização:** Multi-região

---

## 🚨 Cenários de Desastre

### 1. Corrupção de Banco de Dados
**Tempo de Recovery:** ~1 hora

### 2. Delete Acidental em Massa
**Tempo de Recovery:** ~50 minutos

### 3. Ataque Ransomware/Hack
**Tempo de Recovery:** ~2-3 horas

### 4. Falha Completa da Base44
**Depende da Base44** (normalmente < 2 horas)

---

## 📋 Checklist de DR Drill

### Mensal: Quick Restore Test
- [ ] Escolher 1 entity aleatória
- [ ] Deletar alguns registros (ambiente teste)
- [ ] Restaurar do backup
- [ ] Documentar tempo

### Trimestral: Full DR Drill
- [ ] Simular cenário completo
- [ ] Medir RTO/RPO real
- [ ] Documentar lições

---

**🚨 Em caso de emergência, siga os procedimentos! 🚨**`;

export default function DocumentationDeveloperPage() {
  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Documentação para Desenvolvedores</h1>
          <p className="text-gray-600">
            Guias completos para onboarding, troubleshooting e disaster recovery
          </p>
        </div>

        <Tabs defaultValue="onboarding" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="onboarding">
              <Rocket className="w-4 h-4 mr-2" />
              Onboarding
            </TabsTrigger>
            <TabsTrigger value="troubleshooting">
              <Code className="w-4 h-4 mr-2" />
              Troubleshooting
            </TabsTrigger>
            <TabsTrigger value="disaster-recovery">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Disaster Recovery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="onboarding">
            <Card>
              <CardContent className="p-8 prose prose-sm max-w-none">
                <ReactMarkdown>{onboardingGuide}</ReactMarkdown>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="troubleshooting">
            <Card>
              <CardContent className="p-8 prose prose-sm max-w-none">
                <ReactMarkdown>{troubleshootingGuide}</ReactMarkdown>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="disaster-recovery">
            <Card>
              <CardContent className="p-8 prose prose-sm max-w-none">
                <ReactMarkdown>{disasterRecoveryPlan}</ReactMarkdown>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-8" style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="w-5 h-5" />
              Recursos Adicionais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Links Úteis:</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Base44 Docs</li>
                  <li>• React Query Docs</li>
                  <li>• Tailwind Docs</li>
                  <li>• shadcn/ui Docs</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Contatos:</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Slack: #dev-innovalearn</li>
                  <li>• Email: dev@innovalearn.com.br</li>
                  <li>• Daily: 10h</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}