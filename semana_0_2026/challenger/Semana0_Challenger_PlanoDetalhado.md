# Plano de Aula Detalhado - Challenger Semana 0
## "Inovando com Dados: Meu Primeiro Dashboard de Insights"

---

**Curso:** Challenger (14+ anos)  
**Módulo:** Semana 0 - Nivelamento e Aplicabilidade  
**Aula:** Semana 0 (Pré-Módulo I)  
**Duração:** 120 minutos (2 horas)  
**Data:** Primeira semana antes do início do Módulo I

---

## VISÃO GERAL DA AULA

Esta aula inaugural posiciona os alunos como **cientistas de dados e solucionadores de problemas globais**, introduzindo análise exploratória de dados (EDA) com Python e visualização profissional. Diferente dos outros cursos, aqui o foco está em extrair insights de dados reais para informar decisões e criar impacto social, estabelecendo mentalidade de inovador.

**Tema Central:** "De Dados a Decisões: Resolvendo Problemas com Análise"  
**Pergunta Norteadora:** "Como posso usar dados e código para entender e resolver problemas reais do mundo?"  
**Metodologia:** Data-Driven Problem Solving com Python  
**Artefato Final:** Dashboard de Análise com Visualizações + Relatório de Insights

---

## OBJETIVOS DE APRENDIZAGEM

### Cognitivos
- Compreender o ciclo de análise de dados (coleta → limpeza → análise → visualização → insights)
- Interpretar visualizações (gráficos de barras, histogramas, tendências)
- Formular hipóteses a partir de dados
- Identificar correlações vs causalidade

### Socioemocionais
- Desenvolver pensamento crítico sobre fontes de dados
- Cultivar curiosidade investigativa ("Por quê?", "E se?")
- Aceitar que dados podem contradizer crenças prévias
- Conectar análise técnica com impacto social

### Técnicos
- Usar pandas para carregar e explorar datasets
- Criar visualizações com matplotlib/seaborn
- Calcular estatísticas descritivas (média, mediana, contagens)
- Documentar análise em Jupyter Notebook
- (Opcional) Usar Google Colab para colaboração

---

## MATERIAIS E RECURSOS

### Tecnologia Necessária
- **Computadores** com acesso à internet (1 por aluno)
- **Ambiente de Desenvolvimento:**
  - **Opção A (preferencial):** Google Colab (notebooks compartilháveis)
  - **Opção B (offline):** Jupyter Notebook local + Anaconda
- **Bibliotecas Python:** pandas, matplotlib, seaborn (pré-instaladas em Colab)
- **Dataset preparado:** CSV com 200-500 linhas sobre tópico social relevante

### Dataset Sugerido (Escolher 1)
1. **Dados de Educação:** Notas de escolas públicas vs privadas (fonte: INEP/fictícia)
2. **Dados Climáticos:** Temperatura de 50 cidades brasileiras em 10 anos (fonte: INMET/NOAA)
3. **Dados de Notícias:** 500 manchetes classificadas por sentimento (positivo/negativo/neutro)
4. **Dados de Desigualdade:** Renda média por região + acesso a serviços (fonte: IBGE simulado)

*Nota: Dataset deve estar PRÉ-LIMPO (sem erros grosseiros) para focar em análise, não limpeza.*

### Materiais Digitais
- **Notebook Template** (70% pronto com células guiadas)
- **Guia Visual:** "Tipos de Gráficos e Quando Usar" (infográfico A3)
- **Checklist de Qualidade de Análise** (impresso por aluno)
- **Banco de Perguntas Analíticas** (30 exemplos para explorar dados)

### Recursos de Apoio
- **Vídeo (5 min):** "Como Dados Mudaram o Mundo" (exemplos: Netflix, Waze, saúde pública)
- **Cheat Sheet:** Comandos Pandas essenciais (impresso)
- **Template de Relatório:** Estrutura para documentar insights

### Preparação Prévia do Educador
- [ ] Escolher e validar dataset (testar carregamento + visualizações)
- [ ] Criar notebook template com células vazias e instruções
- [ ] Preparar 3 visualizações exemplo (mostrar variedade de gráficos)
- [ ] Testar código em Colab (confirmar bibliotecas funcionam)
- [ ] Preparar versão "simplificada" do dataset para alunos iniciantes

---

## ESTRUTURA DETALHADA DA AULA (120 minutos)

---

## BLOCO 1: PROVOCAÇÃO E DIAGNÓSTICO (20 minutos)

### Momento 1.1: Desafio Global - "Escolha Seu Problema" (10 min)

**Objetivo:** Conectar análise de dados a impacto social real

**Atividade Provocativa:**

Educador projeta 3 problemas globais na tela:

```
🌍 PROBLEMA A: CRISE HÍDRICA
"Algumas regiões têm água em excesso, outras em escassez. 
Como dados podem ajudar a distribuir melhor?"

🏥 PROBLEMA B: DESIGUALDADE EM SAÚDE
"Por que algumas comunidades têm acesso a hospitais e outras não? 
O que os dados revelam sobre isso?"

🗞️ PROBLEMA C: DESINFORMAÇÃO
"Como analisar milhões de notícias para identificar padrões 
de notícias falsas?"
```

**Votação Individual (2 min):**
- Alunos levantam a mão para o problema que mais os interessa
- Educador conta e visualiza resultado no quadro

**Discussão Guiada (5 min):**
Educador pergunta (para cada problema mais votado):
1. "Que DADOS vocês precisariam para entender esse problema?"
   - Exemplos esperados: consumo de água por região, localização de hospitais, fonte de notícias
2. "Como vocês VISUALIZARIAM esses dados?"
   - Exemplos: mapas, gráficos de linha, comparações
3. "Que DECISÃO poderia ser tomada com essa análise?"
   - Exemplos: construir reservatórios, abrir postos de saúde, regular redes sociais

**Conceito Revelado:**
> "Isso é CIÊNCIA DE DADOS aplicada a problemas reais. Hoje vocês vão fazer exatamente isso: pegar dados, analisar e gerar insights para uma decisão."

---

### Momento 1.2: Autoavaliação - "Meu Perfil de Inovador" (10 min)

**Objetivo:** Mapear conhecimento técnico e ambições

**Formulário Individual:**

```
┌──────────────────────────────────────────────┐
│  PERFIL DO INOVADOR CHALLENGER               │
├──────────────────────────────────────────────┤
│ 1. Minha experiência com dados:              │
│    □ Nunca analisei dados                    │
│    □ Já usei Excel/Planilhas                 │
│    □ Já programei com Python                 │
│    □ Conheço pandas/análise de dados         │
│                                              │
│ 2. Problema global que quero resolver:       │
│    _____________________________________     │
│    _____________________________________     │
│                                              │
│ 3. Se eu tivesse acesso a qualquer dado,     │
│    eu analisaria:                            │
│    _____________________________________     │
│                                              │
│ 4. Marque suas habilidades:                  │
│    □ Visualizar dados (gráficos)             │
│    □ Programar em Python                     │
│    □ Apresentar ideias publicamente          │
│    □ Trabalhar em equipe                     │
│    □ Pesquisar fontes confiáveis             │
│                                              │
│ 5. Minha maior dúvida sobre IA/Dados:        │
│    _____________________________________     │
└──────────────────────────────────────────────┘
```

**Compartilhamento Seletivo (5 min):**
- Item 2 (problema que querem resolver): educador agrupa em categorias
  - 🌍 Meio Ambiente
  - 👥 Justiça Social
  - 💡 Tecnologia/Inovação
  - 🏥 Saúde Pública
  - Outras

- Item 3 (dados que analisariam): 3-4 alunos compartilham
  - Educador conecta com datasets reais (ex: "Esses dados existem no IBGE!")

**Aplicação:**
> "Ao longo do módulo, vocês vão trabalhar em projetos baseados nessas áreas de interesse. Hoje começamos com um dataset preparado, mas logo vocês escolherão seus próprios dados."

---

## BLOCO 2: ÉTICA E IMPACTO DE DADOS (30 minutos)

### Momento 2.1: Debate - "O Algoritmo de Empregos Justo" (20 min)

**Objetivo:** Compreender viés algorítmico e responsabilidade sistêmica

**Caso Real Adaptado (Educador apresenta):**

**Slide 1 - Contexto:**
> "Em 2018, a Amazon desenvolveu uma IA para filtrar currículos automaticamente. O sistema analisava milhares de candidatos e selecionava os 'melhores' para entrevista."

**Slide 2 - O Problema Descoberto:**
> "Após 1 ano, perceberam que a IA estava DISCRIMINANDO mulheres. Currículos com palavras como 'clube feminino de xadrez' ou 'universidade feminina' recebiam pontuação menor."

**Slide 3 - A Causa:**
> "A IA foi treinada com dados históricos da empresa: currículos de CONTRATADOS dos últimos 10 anos. Como a maioria eram homens (área de tecnologia), a IA 'aprendeu' que ser homem era uma 'característica de sucesso'."

**Discussão em Grupos de 4 (10 min):**

Cada grupo recebe cartão com perguntas:

```
🔍 ANÁLISE DO CASO AMAZON

1. Onde estava o erro?
   □ No código da IA
   □ Nos dados de treinamento
   □ Na decisão de usar IA para isso
   □ Em todos acima

2. Quem é responsável por esse viés?
   ___________________________________

3. Como poderiam ter evitado?
   ___________________________________

4. Esse problema existe em outros algoritmos?
   Onde? (Dê 2 exemplos)
   a) ________________________________
   b) ________________________________

PROPOSTA DO GRUPO:
Como garantir que IA de recrutamento seja justa?
___________________________________
```

**Síntese Coletiva (8 min):**

Educador conduz discussão para conceitos-chave:

✅ **Viés nos dados = viés na IA**
> "Se dados históricos refletem discriminação passada, a IA perpetua essa discriminação."

✅ **Responsabilidade do desenvolvedor**
> "Cientista de dados deve SEMPRE perguntar: 'Esses dados representam o mundo que QUEREMOS, ou o que TÍNHAMOS?'"

✅ **Auditoria de algoritmos**
> "IAs usadas em decisões importantes (emprego, crédito, justiça) devem ser testadas por equipes diversas."

✅ **Transparência algorítmica**
> "Pessoas afetadas por decisões de IA têm direito de saber: 'Por que fui rejeitado?'"

**Conexão com Legislação:**
- Breve menção à **Lei Geral de Proteção de Dados (LGPD)** no Brasil
- **AI Act** da União Europeia (regulamentação de IA de alto risco)

---

### Momento 2.2: Criando Nosso "Checklist de Impacto Ético" (10 min)

**Objetivo:** Ferramenta prática para avaliar projetos de dados

**Atividade Individual:**

Cada aluno cria seu checklist personalizado com 5 itens obrigatórios:

```
┌─────────────────────────────────────────────┐
│  CHECKLIST DE IMPACTO ÉTICO - DADOS E IA   │
│  Criado por: ___________________           │
├─────────────────────────────────────────────┤
│ Antes de lançar qualquer projeto com       │
│ dados/IA, verificar:                        │
│                                             │
│ ✅ 1. Os dados representam DIVERSIDADE?    │
│      (ex: diferentes gêneros, regiões...)   │
│                                             │
│ ✅ 2. Quem pode ser PREJUDICADO?           │
│      (se o sistema errar)                   │
│                                             │
│ ✅ 3. A decisão é EXPLICÁVEL?              │
│      (consigo dizer "por que?")             │
│                                             │
│ ✅ 4. Houve TESTE com dados diversos?      │
│                                             │
│ ✅ 5. [ITEM PERSONALIZADO DO ALUNO]        │
│    _____________________________________    │
│                                             │
│ Se alguma resposta for "NÃO", PARAR e      │
│ corrigir antes de prosseguir.               │
└─────────────────────────────────────────────┘
```

**Item 5 Personalizado - Exemplos:**
- "Os dados foram coletados com consentimento?"
- "A análise beneficia a comunidade afetada?"
- "Consultei especialistas do domínio (educadores, médicos, etc.)?"

**Compromisso Coletivo:**
- Todos assinam seus checklists
- Educador digitaliza e compartilha em repositório da turma
- Usar em TODOS os projetos futuros

---

## BLOCO 3: INTERVALO E SETUP TÉCNICO (10 minutos)

### Para os Alunos (5 min):
- Pausa ativa

### Para o Educador + Alunos (5 min - SIMULTÂNEO):

**Setup do Ambiente de Análise:**

**Opção A - Google Colab (Preferencial):**
1. Educador compartilha link do notebook template
2. Alunos acessam e fazem cópia: "File" → "Save a copy in Drive"
3. Teste rápido de execução:
   ```python
   import pandas as pd
   import matplotlib.pyplot as plt
   print("✅ Ambiente pronto para análise!")
   ```

**Opção B - Jupyter Local:**
1. Abrir Anaconda Navigator → Jupyter Notebook
2. Criar novo notebook "Dashboard_Semana0"
3. Importar bibliotecas (testar execução)

**Distribuir Materiais:**
- Cheat Sheet de Pandas
- Checklist de Qualidade de Análise
- Template de Relatório de Insights

---

## BLOCO 4: PROJETO MÃO NA MASSA - "Dashboard de Análise" (50 minutos)

### Momento 4.1: Demonstração - "Do CSV à Visualização em 5 Passos" (12 min)

**Objetivo:** Mostrar fluxo completo de análise exploratória

**Demonstração ao Vivo (Educador codifica projetando):**

**Dataset Exemplo: "Educação em 50 Escolas Brasileiras"**
Colunas: `escola`, `regiao`, `tipo` (pública/privada), `nota_matematica`, `nota_portugues`, `n_alunos`

---

**PASSO 1 - Carregar Dados (2 min):**

```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Carregar dataset
df = pd.read_csv('educacao_escolas.csv')

# Primeiras linhas
print("📊 Dataset carregado com sucesso!")
df.head()
```

**Educador verbaliza:**
> "Sempre comece OLHANDO os dados. Nunca analise sem ver como são."

---

**PASSO 2 - Entender Estrutura (2 min):**

```python
# Informações básicas
print("Total de linhas:", len(df))
print("Colunas:", df.columns.tolist())

# Estatísticas descritivas
df.describe()
```

**Conceitos destacados:**
- Média, mediana, desvio padrão
- Valores mínimos e máximos (detectar outliers)

---

**PASSO 3 - Perguntar ao Dado (2 min):**

**Pergunta 1:** "Qual região tem melhor desempenho em matemática?"

```python
# Nota média por região
media_por_regiao = df.groupby('regiao')['nota_matematica'].mean()
print(media_por_regiao)
```

**Pergunta 2:** "Escolas públicas ou privadas têm notas mais altas?"

```python
# Comparar por tipo
df.groupby('tipo')[['nota_matematica', 'nota_portugues']].mean()
```

---

**PASSO 4 - Visualizar (4 min):**

**Visualização 1 - Gráfico de Barras:**
```python
# Nota média de matemática por região
media_por_regiao.plot(kind='bar', color='steelblue', figsize=(8,5))
plt.title('Desempenho em Matemática por Região')
plt.ylabel('Nota Média')
plt.xlabel('Região')
plt.xticks(rotation=45)
plt.show()
```

**Visualização 2 - Comparação Pública vs Privada:**
```python
# Boxplot comparativo
df.boxplot(column='nota_matematica', by='tipo', figsize=(8,5))
plt.title('Distribuição de Notas: Pública vs Privada')
plt.suptitle('')  # Remove título padrão
plt.show()
```

**Educador destaca:**
> "Gráficos revelam padrões que tabelas escondem!"

---

**PASSO 5 - Extrair Insights (2 min):**

```python
# Documentar descobertas
print("🔍 INSIGHTS PRINCIPAIS:")
print("1. Região Sul tem maior média em matemática (7.8)")
print("2. Escolas privadas têm nota 1.5 pontos acima de públicas")
print("3. Variação dentro de escolas públicas é MAIOR (mais desigualdade)")
print("\n💡 RECOMENDAÇÃO:")
print("Focar investimento em escolas públicas das regiões Norte e Nordeste")
```

---

**Síntese do Educador:**
> "Vocês acabaram de ver o trabalho de um cientista de dados profissional: dados brutos → análise → visualização → insights acionáveis. Agora é a vez de vocês!"

---

### Momento 4.2: Análise Exploratória Guiada - "Seu Dashboard" (30 min)

**Objetivo:** Alunos criarem análise completa de dataset preparado

**Estrutura do Notebook Template:**

O notebook fornecido tem células com **instruções + código parcial**:

---

**CÉLULA 1 - Setup:**
```python
# TODO: Importar bibliotecas necessárias
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Configuração de estilo
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (10, 6)

print("✅ Ambiente configurado!")
```

---

**CÉLULA 2 - Carregamento:**
```python
# TODO: Carregar o dataset fornecido
# df = pd.read_csv('________.csv')  # Complete com o nome do arquivo

# Verificar carregamento
print(f"Dataset carregado: {len(df)} linhas")
df.head()
```

---

**CÉLULA 3 - Exploração Básica:**
```python
# TODO: Explorar estrutura dos dados

# 1. Quantas linhas e colunas?
# print(df.shape)

# 2. Quais são as colunas?
# print(df.columns)

# 3. Tipos de dados
# print(df.dtypes)

# 4. Estatísticas descritivas
# df.describe()
```

---

**CÉLULA 4 - Perguntas Analíticas (Núcleo do Projeto):**

```python
# MISSÃO: Responder PELO MENOS 3 perguntas usando os dados

# ===== PERGUNTA 1: [ESCOLHA UMA PERGUNTA] =====
# Exemplos:
# - Qual categoria tem maior valor médio?
# - Há diferença entre grupos A e B?
# - Como os valores mudaram ao longo do tempo?

# SEU CÓDIGO AQUI:




# ===== PERGUNTA 2: [ESCOLHA OUTRA PERGUNTA] =====

# SEU CÓDIGO AQUI:




# ===== PERGUNTA 3: [ESCOLHA MAIS UMA] =====

# SEU CÓDIGO AQUI:



```

**Banco de Perguntas Sugeridas (Projetado na parede):**

```
💡 PERGUNTAS PARA EXPLORAR DADOS:

COMPARAÇÕES:
- Qual categoria tem maior/menor valor?
- Grupo A é diferente de Grupo B?
- Qual período teve melhor desempenho?

DISTRIBUIÇÕES:
- Como os valores estão espalhados?
- Há valores extremos (outliers)?
- Qual é o valor mais comum (moda)?

RELAÇÕES:
- X aumenta quando Y aumenta?
- Existe padrão entre duas variáveis?

TEMPO:
- Como mudou ao longo dos anos?
- Há tendência de crescimento/queda?

PROPORÇÕES:
- Que % representa cada categoria?
- Qual é a participação de cada grupo?
```

---

**CÉLULA 5 - Visualizações (Mínimo 3):**

```python
# MISSÃO: Criar 3 GRÁFICOS DIFERENTES

# ===== GRÁFICO 1: Gráfico de Barras =====
# (Para comparações de categorias)

# MODELO:
# df['coluna_categoria'].value_counts().plot(kind='bar')
# plt.title('SEU TÍTULO')
# plt.show()




# ===== GRÁFICO 2: Gráfico de Linha =====
# (Para séries temporais ou tendências)

# MODELO:
# df.plot(x='coluna_x', y='coluna_y', kind='line')
# plt.title('SEU TÍTULO')
# plt.show()




# ===== GRÁFICO 3: Gráfico à sua escolha =====
# Opções: scatter, box, hist, pie

# SEU CÓDIGO AQUI:



```

---

**CÉLULA 6 - Insights e Recomendações:**

```python
# MISSÃO: Documentar INSIGHTS (descobertas) e RECOMENDAÇÕES (o que fazer)

print("=" * 50)
print("🔍 PRINCIPAIS DESCOBERTAS:")
print("=" * 50)

# TODO: Listar 3-5 insights baseados na análise

print("\n1. [Insight 1 - Complete baseado nos dados]")
# Exemplo: "A região Norte tem 30% menos acesso a internet que o Sul"

print("\n2. [Insight 2]")

print("\n3. [Insight 3]")

print("\n" + "=" * 50)
print("💡 RECOMENDAÇÕES:")
print("=" * 50)

# TODO: Propor 2-3 ações baseadas nos insights

print("\n→ [Recomendação 1]")
# Exemplo: "Investir em infraestrutura de internet na região Norte"

print("\n→ [Recomendação 2]")

print("\n→ [Recomendação 3]")
```

---

**GESTÃO DO TEMPO:**

Educador anuncia em voz alta marcos temporais:

- **00-05 min:** "Carreguem o dataset e explorem a estrutura!"
- **05-15 min:** "Respondam as 3 perguntas analíticas!"
- **15-25 min:** "Criem as 3 visualizações!"
- **25-30 min:** "Documentem insights e finalizem!"

**Suporte Contínuo:**
- Educador + assistente circulam entre os alunos
- Dar dicas específicas: "Que tal usar `.groupby()` para agrupar por região?"
- Incentivar alunos avançados a ajudar colegas

**Níveis de Complexidade (Diferenciação):**

🟢 **Iniciante:** 
- Usar apenas `.mean()`, `.count()`, gráficos básicos
- Foco em 3 visualizações simples

🟡 **Intermediário:**
- Combinar múltiplos `.groupby()`
- Criar gráficos com múltiplas variáveis (cores, tamanhos)

🔴 **Avançado:**
- Calcular correlações (`.corr()`)
- Criar subplots (múltiplos gráficos em uma figura)
- Aplicar filtros complexos com `.query()`

---

### Momento 4.3: Teste de Qualidade e Refinamento (8 min)

**Objetivo:** Validar análise e melhorar visualizações

**Checklist de Qualidade (Projetar):**

```
✅ MEU DASHBOARD ESTÁ COMPLETO?

DADOS:
□ Carreguei o dataset sem erros?
□ Explorei a estrutura (linhas, colunas, tipos)?

ANÁLISE:
□ Respondi pelo menos 3 perguntas?
□ Usei funções como .mean(), .groupby(), .count()?

VISUALIZAÇÕES:
□ Criei 3 gráficos diferentes?
□ Todos os gráficos têm TÍTULO descritivo?
□ Eixos estão ROTULADOS (xlabel, ylabel)?
□ Cores são legíveis?

INSIGHTS:
□ Listei 3+ descobertas baseadas nos dados?
□ Propus 2+ recomendações acionáveis?

DOCUMENTAÇÃO:
□ Adicionei comentários no código?
□ Células executam sem erro?
```

**Atividade de Validação (5 min):**
1. Aluno ao lado revisa checklist do colega
2. Dá 1 sugestão de melhoria
3. Aluno implementa a sugestão

**Refinamento Final (3 min):**
- Melhorar títulos de gráficos
- Ajustar cores para melhor contraste
- Adicionar comentários explicativos

---

## BLOCO 5: SHOWCASE E APRENDIZADOS (10 minutos)

### Momento 5.1: Galeria de Dashboards - "Insights Relâmpago" (7 min)

**Formato "TED Talk de 1 Minuto":**

4-5 alunos voluntários apresentam:

**Roteiro de Apresentação (60 segundos cada):**
1. **Contexto (10 seg):** "Analisei dados sobre ________"
2. **Insight mais surpreendente (20 seg):** "Descobri que ________"
3. **Visualização favorita (15 seg):** [Mostrar gráfico na tela]
4. **Recomendação (15 seg):** "Com base nisso, sugiro ________"

**Feedback da Turma:**
- Após cada apresentação, turma faz gesto:
  - 🤯 "Insight surpreendente!"
  - 📊 "Visualização incrível!"
  - 💡 "Recomendação aplicável!"

---

### Momento 5.2: Reflexão Coletiva (3 min)

**Perguntas Guiadas:**

1. **"O que mais surpreendeu vocês nos dados?"**
   - 2-3 respostas rápidas

2. **"Qual foi o gráfico mais difícil de fazer? Por quê?"**
   - Normalizar dificuldade técnica

3. **"Se vocês pudessem analisar QUALQUER dado do mundo, qual seria?"**
   - Conectar com projetos futuros

**Síntese do Educador:**
> "Hoje vocês fizeram análise exploratória de dados profissional. Empresas pagam cientistas de dados para fazer exatamente isso: transformar números em decisões. Vocês já sabem fazer!"

---

## BLOCO 6: CONEXÃO COM CASA E PRÓXIMOS PASSOS (10 minutos)

### 📝 **Homework (Individual):**

**"Missão: Expanda Seu Dashboard"**

Escolha 1 desafio para fazer em casa:

**Nível 1 (Iniciante):**
- Adicionar 2 novas visualizações diferentes das feitas na aula
- Responder 2 novas perguntas sobre o dataset

**Nível 2 (Intermediário):**
- Calcular correlações entre variáveis numéricas (`.corr()`)
- Criar gráfico de dispersão (scatter) mostrando relação entre 2 variáveis
- Adicionar análise de tendência temporal (se dataset tiver datas)

**Nível 3 (Avançado):**
- Encontrar NOVO dataset relacionado ao tema (Kaggle, IBGE, data.gov)
- Fazer análise comparativa (dataset da aula vs novo dataset)
- Criar apresentação de slides (5 slides) com principais insights

**Formato de Entrega:**
- Notebook Colab atualizado (compartilhar link) OU
- Arquivo .ipynb + PDF com visualizações

---

### 👨‍👩‍👧 **Family Work (Com a Família):**

**"Insights para a Família"**

1. **Apresente seu dashboard** para 1-2 familiares (10 min)
2. **Explique 1 gráfico** em linguagem simples (sem jargões técnicos)
3. **Pergunte:** "Que dado sobre nossa família/comunidade você gostaria que eu analisasse?"
4. **Colete ideias:** Anotar 3 sugestões de análises futuras

**Desafio Bônus:**
- Coletar dados reais da família (ex: gastos mensais, tempo de tela, exercício)
- Fazer mini-análise (pode ser no Excel ou papel) e apresentar

**Entrega:**
- Documento com sugestões da família
- (Opcional) Foto/vídeo da apresentação

---

## AVALIAÇÃO E REGISTRO

### Critérios de Sucesso da Aula

| Aspecto | Indicador de Sucesso |
|:---|:---|
| **Dashboard Funcional** | ≥85% dos alunos criam análise completa |
| **Visualizações** | ≥80% criam 3+ gráficos com títulos/rótulos |
| **Insights** | ≥75% extraem 3+ descobertas relevantes |
| **Código Executável** | ≥90% dos notebooks rodam sem erros |
| **Consciência Ética** | 100% criam checklist de impacto |
| **Pensamento Crítico** | ≥70% propõem recomendações acionáveis |

### Registro Individual do Educador

```
Aluno: _________________ | Experiência Prévia: □ Nenhuma □ Excel □ Python

✅ Dashboard Completo: □ Sim □ Parcial □ Incompleto
✅ Qualidade das Visualizações:
   □ Excelente (3+ gráficos claros e rotulados)
   □ Bom (3 gráficos básicos)
   □ Precisa melhorar (gráficos sem títulos/rótulos)
✅ Profundidade da Análise:
   □ Avançada (correlações, tendências complexas)
   □ Intermediária (agrupamentos, comparações)
   □ Básica (estatísticas descritivas simples)
✅ Insights Gerados:
   □ ≥5 insights relevantes
   □ 3-4 insights
   □ <3 insights ou superficiais
✅ Autonomia: □ Alta □ Média □ Baixa (precisou suporte constante)

Potencial destacado / Área para desenvolvimento:
________________________________________________
```

---

## PLANO B (CONTINGÊNCIAS)

### Cenário 1: Colab/Internet Instável

**Solução A - Jupyter Local:**
1. Mudar para Anaconda/Jupyter instalado localmente
2. Dataset já está salvo em pen drive/pasta da rede local
3. Continuar análise offline

**Solução B - Excel + PowerPoint:**
1. Abrir dataset no Excel
2. Criar gráficos usando ferramentas do Excel
3. Análise manual com calculadora (médias, contagens)
4. Documentar insights em PowerPoint

---

### Cenário 2: Bibliotecas Não Funcionam

**Solução A - Análise Manual:**
1. Imprimir dataset em papel (versão reduzida, 50 linhas)
2. Calcular estatísticas manualmente
3. Desenhar gráficos em cartolina/quadro branco
4. Discussão: "Isso é por que precisamos de código - automatizar!"

**Solução B - Ferramentas Online:**
1. Google Sheets (carregar CSV)
2. Criar gráficos usando interface do Sheets
3. Discussão sobre limitações vs Python

---

### Cenário 3: Dataset Corrompido

**Solução C - Dataset Backup:**
1. Educador tem 3 datasets alternativos prontos
2. Mudar rapidamente para dataset de backup
3. Mesmas perguntas analíticas se aplicam

---

## CONEXÃO COM O MÓDULO I

Esta Semana 0 estabelece competências para ciência de dados aplicada:

| Conceito da Semana 0 | Evolução no Módulo I |
|:---|:---|
| **Análise exploratória** | Aula 1-4: EDA avançada com datasets complexos |
| **Visualizações básicas** | Aula 5-8: Dashboards interativos (Plotly, Dash) |
| **Pandas básico** | Aula 9-12: Manipulação avançada e joins |
| **Insights de dados** | Aula 13-16: Machine Learning para predições |
| **Ética de dados** | Checklist usado em TODOS os projetos |
| **Apresentação de análise** | Pitch final para stakeholders reais |

---

## RECURSOS ADICIONAIS PARA O EDUCADOR

### Vocabulário-Chave da Aula
- **Dataset:** "Conjunto organizado de dados (geralmente em tabelas)"
- **DataFrame:** "Estrutura de dados do Pandas (como uma planilha)"
- **Análise Exploratória (EDA):** "Primeira fase: entender os dados antes de modelar"
- **Visualização:** "Representação gráfica de dados"
- **Insight:** "Descoberta ou compreensão extraída dos dados"
- **Outlier:** "Valor muito diferente dos demais (extremo)"
- **Correlação:** "Relação entre duas variáveis (quando uma muda, a outra também)"
- **Viés:** "Distorção sistemática nos dados ou algoritmo"

### Comandos Pandas Essenciais (Cheat Sheet)

```python
# Carregar dados
df = pd.read_csv('arquivo.csv')

# Explorar
df.head()           # Primeiras 5 linhas
df.shape            # (linhas, colunas)
df.describe()       # Estatísticas descritivas
df.info()           # Tipos de dados

# Analisar
df['coluna'].mean()                    # Média
df['coluna'].value_counts()            # Contagem
df.groupby('categoria')['valor'].mean()# Média por grupo

# Filtrar
df[df['coluna'] > 10]                  # Linhas onde coluna > 10

# Visualizar
df['coluna'].plot(kind='bar')          # Gráfico de barras
df.plot(x='col1', y='col2')            # Gráfico de linha
```

---

## CHECKLIST PRÉ-AULA (EDUCADOR)

**1 Semana Antes:**
- [ ] Escolher e validar dataset (testar análise completa)
- [ ] Criar notebook template com células guiadas
- [ ] Preparar 3 visualizações exemplo
- [ ] Gravar vídeo "Como Dados Mudaram o Mundo" (5 min)
- [ ] Imprimir materiais (Cheat Sheets, Checklists, Banco de Perguntas)
- [ ] Preparar datasets backup (3 opções)

**1 Dia Antes:**
- [ ] Compartilhar link do Colab com alunos
- [ ] Confirmar que todos têm conta Google
- [ ] Testar carregamento do dataset em Colab
- [ ] Enviar lembrete: "Tragam perguntas que gostariam de responder com dados"

**1 Hora Antes:**
- [ ] Testar internet e Colab em todos os computadores
- [ ] Abrir notebook de demonstração
- [ ] Preparar projetor (fonte grande, gráficos visíveis)
- [ ] Ter datasets salvos localmente (backup)

**Durante a Aula:**
- [ ] Circular entre alunos (não ficar só demonstrando)
- [ ] Fotografar dashboards interessantes
- [ ] Anotar perguntas analíticas criativas dos alunos
- [ ] Resolver problemas técnicos prontamente

**Após a Aula:**
- [ ] Salvar todos os notebooks dos alunos
- [ ] Criar repositório GitHub da turma (opcional)
- [ ] Enviar feedback individual (destaques + sugestão)
- [ ] Documentar ajustes para próxima turma

---

## EXTENSÕES OPCIONAIS (Tempo Extra ou Avançados)

### 1. Análise de Sentimento de Textos
```python
# Usar dataset de notícias/tweets
from textblob import TextBlob

def analisar_sentimento(texto):
    return TextBlob(texto).sentiment.polarity

df['sentimento'] = df['texto'].apply(analisar_sentimento)
df['sentimento'].hist()
```

### 2. Mapas Interativos (Dados Geográficos)
```python
import folium

# Criar mapa de calor de dados por estado
mapa = folium.Map(location=[-15, -50], zoom_start=4)
# [Adicionar camadas com dados]
mapa.save('mapa_dados.html')
```

### 3. Dashboard Interativo com Plotly
```python
import plotly.express as px

fig = px.bar(df, x='regiao', y='valor', color='categoria')
fig.show()
```

---

## CONSIDERAÇÕES FINAIS

Esta aula foi desenhada para ser a **porta de entrada ao mundo da ciência de dados com consciência social** para alunos de 14+ anos. O sucesso está em:

📊 **Dados Reais** (não exemplos artificiais, problemas do mundo real)  
🧠 **Pensamento Crítico** (questionar dados, buscar viés)  
📈 **Visualização Clara** (comunicar insights efetivamente)  
⚖️ **Ética desde o Início** (impacto e responsabilidade)  
🏆 **Artefato Profissional** (dashboard reutilizável e compartilhável)  

O aluno deve sair dessa aula pensando:  
> *"Eu ANALISEI dados reais e descobri coisas que não sabia! Agora sei que posso usar dados para entender e resolver problemas do mundo. Quero fazer isso em escala!"*

---

**Versão:** 1.0  
**Data de Criação:** Janeiro 2026  
**Autor:** Equipe Pedagógica Innova Academy  
**Revisão:** Implementando Opção A (Dashboard de Exploração com dataset pré-preparado) e planos B robustos
