# Semana 0 - Nivelamento e Aplicabilidade (2026)

## 📌 Visão Geral

Este diretório contém todos os materiais da **Semana 0** (aula de nivelamento e aplicabilidade) para o ano de 2026. A Semana 0 é uma aula inaugural que acontece antes do início do Módulo I, com duração de 120 minutos (2 horas).

## 🎯 Conceito de Rotação Anual

- **Todos os módulos de um curso têm a mesma aula na Semana 0**
- **A cada ano, a aula da Semana 0 deve ser alternada** para oferecer variedade aos alunos que retornam
- Esta estrutura permite manter diferentes versões anuais (semana_0_2026, semana_0_2027, etc.)

## 📁 Estrutura de Diretórios

```
semana_0_2026/
├── README.md (este arquivo)
├── README_MASTER.md (documentação completa do pacote)
├── curiosity/
│   ├── Semana0_Curiosity_PlanoDetalhado.md
│   └── Semana0_Curiosity_Atividades.csv
├── discovery/
│   ├── Semana0_Discovery_PlanoDetalhado.md
│   └── Semana0_Discovery_Atividades.csv
├── pioneer/
│   ├── Semana0_Pioneer_PlanoDetalhado.md
│   └── Semana0_Pioneer_Atividades.csv
└── challenger/
    ├── Semana0_Challenger_PlanoDetalhado.md
    └── Semana0_Challenger_Atividades.csv
```

## 🎓 Cursos e Artefatos

### 1. Curiosity (6+ anos)
**Tema:** "Despertar Digital: Meu Primeiro Avatar com IA"  
**Artefato:** Avatar IA gerado por prompts  
**Foco:** Criatividade lúdica com IA generativa  
**Arquivos:**
- `Semana0_Curiosity_PlanoDetalhado.md` - Plano de aula completo (19 KB)
- `Semana0_Curiosity_Atividades.csv` - Tabela de atividades estruturadas (2.9 KB)

### 2. Discovery (9+ anos)
**Tema:** "Descobrindo como as Máquinas Pensam: Meu Classificador de Objetos"  
**Artefato:** Classificador de Objetos (Machine Learning)  
**Foco:** Experimentação científica com Teachable Machine  
**Arquivos:**
- `Semana0_Discovery_PlanoDetalhado.md` - Plano de aula completo (24 KB)
- `Semana0_Discovery_Atividades.csv` - Tabela de atividades estruturadas (2.4 KB)

### 3. Pioneer (12+ anos)
**Tema:** "Construindo com Código: Meu Primeiro Chatbot Inteligente"  
**Artefato:** Chatbot em Python  
**Foco:** Programação com assistência de IA (Pair Programming com ChatGPT)  
**Arquivos:**
- `Semana0_Pioneer_PlanoDetalhado.md` - Plano de aula completo (29 KB)
- `Semana0_Pioneer_Atividades.csv` - Tabela de atividades estruturadas (2.3 KB)

### 4. Challenger (14+ anos)
**Tema:** "Inovando com Dados: Meu Primeiro Dashboard de Insights"  
**Artefato:** Dashboard interativo de análise de dados  
**Foco:** Data Science com Python e visualização profissional  
**Arquivos:**
- `Semana0_Challenger_PlanoDetalhado.md` - Plano de aula completo (32 KB)
- `Semana0_Challenger_Atividades.csv` - Tabela de atividades estruturadas (2.4 KB)

## 📊 Formato dos Arquivos

### Planos Detalhados (.md)
Cada plano de aula contém:
- **Visão Geral:** Objetivos, tema central, metodologia
- **Estrutura de Blocos:** Divisão temporal da aula (120 min)
- **Atividades Detalhadas:** Descrição completa de cada atividade
- **Materiais Necessários:** Físicos e digitais
- **Avaliações:** Critérios e instrumentos
- **Planos B:** Alternativas para contingências
- **Homework e Family Work:** Extensões da aprendizagem

### Tabelas de Atividades (.csv)
Formato estruturado com colunas:
- Aula, Curso, Bloco, Atividade, Tipo, Duração (min)
- Objetivo, Materiais Físicos, Recursos Digitais, Tecnologia
- Avaliação, Homework, Family Work, Plano B

## 🔄 Implementação no Sistema

### Como Usar Estes Materiais

1. **No Início do Ano Letivo:** 
   - Todos os módulos (I, II, III, IV) de cada curso usam a mesma aula da Semana 0
   - Exemplo: Todos os módulos do Curiosity em 2026 usam `curiosity/Semana0_Curiosity_PlanoDetalhado.md`

2. **Referência no Banco de Dados:**
   ```javascript
   // Exemplo de referência
   {
     course: "curiosity",
     year: 2026,
     week: 0,
     lesson_plan: "semana_0_2026/curiosity/Semana0_Curiosity_PlanoDetalhado.md",
     activities: "semana_0_2026/curiosity/Semana0_Curiosity_Atividades.csv"
   }
   ```

3. **Alternância Anual:**
   - 2026: `semana_0_2026/`
   - 2027: `semana_0_2027/` (nova versão)
   - 2028: Pode reutilizar `semana_0_2026/` ou criar nova

## 🎯 Objetivos Pedagógicos da Semana 0

### Comuns a Todos os Cursos:
1. **Nivelamento:** Identificar conhecimentos prévios e estilos de aprendizagem (VARK)
2. **Aplicabilidade:** Demonstrar imediatamente o poder e uso prático da IA
3. **Engajamento:** Criar artefato concreto na primeira aula (entrega imediata)
4. **Ética:** Estabelecer princípios éticos desde o início
5. **Comunidade:** Formar conexões entre alunos e com o instrutor

### Diferenciação por Faixa Etária:
- **Curiosity (6+):** Lúdico, visual, narrativo, sensorial
- **Discovery (9+):** Científico, experimental, hands-on
- **Pioneer (12+):** Técnico, prático, profissional
- **Challenger (14+):** Analítico, estratégico, orientado a impacto

## 📝 Notas de Implementação

### Preparação do Instrutor:
- Revisar plano detalhado com 1 semana de antecedência
- Preparar materiais físicos (ver seção de cada curso)
- Testar ferramentas digitais (IA generativa, Teachable Machine, Colab, etc.)
- Preparar templates e recursos auxiliares

### Preparação da Sala:
- Verificar projetor e conectividade
- Organizar estações de trabalho conforme metodologia
- Preparar materiais físicos por atividade
- Testar acesso às plataformas online

### Checklist Pré-Aula:
- [ ] Materiais físicos organizados
- [ ] Links e recursos digitais funcionando
- [ ] Ambiente de desenvolvimento configurado (quando aplicável)
- [ ] Formulários de avaliação preparados
- [ ] Plano B revisado e materiais disponíveis

## 🔗 Integração com Plataforma

### Funcionalidades Recomendadas:
1. **Visualização de Planos:** Interface para professores visualizarem planos detalhados
2. **Checklist Interativo:** Para preparação de aula
3. **Registro de Avaliações:** Formulários integrados para registro diagnóstico
4. **Galeria de Artefatos:** Espaço para alunos compartilharem criações
5. **Timeline da Aula:** Visualização da estrutura temporal de 120 minutos

## 📅 Cronograma de Execução

**Timing da Semana 0:**
- Acontece **antes** do início do Módulo I
- Primeira semana de cada ciclo letivo
- Agende com 2 semanas de antecedência mínima

**Exemplo de Calendário:**
- Semana -1: Preparação de materiais
- Semana 0: Execução da aula inaugural
- Semana 1: Início do Módulo I

## 📚 Documentação Adicional

Para mais detalhes sobre o contexto completo, metodologias e implementação, consulte:
- `README_MASTER.md` - Documentação técnica completa do pacote

## 🔄 Manutenção e Atualizações

### Versionamento:
- Cada ano mantém seu diretório próprio (`semana_0_YYYY`)
- Permite comparação entre versões
- Facilita reutilização de materiais bem-sucedidos

### Feedback e Melhorias:
- Coletar feedback dos instrutores após execução
- Documentar ajustes necessários para próxima versão
- Manter histórico de modificações

---

**Criado por:** Innova Academy  
**Versão:** 2026  
**Última Atualização:** Janeiro 2026  
**Contato:** [Adicionar informações de contato]
