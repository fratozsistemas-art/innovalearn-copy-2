# Plano de Aula Detalhado - Discovery Semana 0
## "Descobrindo como as Máquinas Pensam: Meu Classificador de Objetos"

---

**Curso:** Discovery (9+ anos)  
**Módulo:** Semana 0 - Nivelamento e Aplicabilidade  
**Aula:** Semana 0 (Pré-Módulo I)  
**Duração:** 120 minutos (2 horas)  
**Data:** Primeira semana antes do início do Módulo I

---

## VISÃO GERAL DA AULA

Esta aula inaugural introduz os alunos ao universo da Inteligência Artificial através da experimentação científica com Machine Learning. Diferente do Curiosity, aqui os alunos vão além de usar IA - eles vão **ensinar uma máquina a reconhecer objetos**, compreendendo na prática os conceitos de dados, treinamento e classificação.

**Tema Central:** "Ensinando Máquinas a Ver o Mundo"  
**Pergunta Norteadora:** "Como podemos treinar uma inteligência artificial para reconhecer objetos do nosso cotidiano?"  
**Metodologia:** Investigação Científica com Método Experimental  
**Artefato Final:** Classificador de Objetos funcional (exportável/compartilhável)

---

## OBJETIVOS DE APRENDIZAGEM

### Cognitivos
- Compreender o conceito de Machine Learning (aprendizado por exemplos)
- Entender a relação entre quantidade/qualidade de dados e precisão do modelo
- Identificar casos de uso de classificação no mundo real

### Socioemocionais
- Desenvolver paciência e persistência no treinamento de modelos
- Colaborar em duplas para coleta de dados
- Aceitar e aprender com erros da IA (conceito de viés e limitação)

### Técnicos
- Usar Teachable Machine para treinar modelo de classificação
- Coletar e organizar dataset balanceado (mínimo 30 amostras/categoria)
- Testar e validar modelo treinado
- Exportar modelo para uso futuro

---

## MATERIAIS E RECURSOS

### Tecnologia Necessária
- **Computadores** com webcam (1 por dupla - TRABALHO EM DUPLAS)
- **Internet estável** (Teachable Machine funciona no navegador)
- **Projetor** para demonstrações
- **Ferramenta principal:** Teachable Machine (teachablemachine.withgoogle.com)
- **Plano B:** Dataset pré-coletado para treinar offline

### Materiais Físicos para Classificação
**Cada dupla precisa ter acesso a 3-4 objetos comuns:**
- Caneta/lápis
- Celular/calculadora
- Caderno/livro
- Garrafa de água/estojo

*Nota: Objetos do cotidiano escolar garantem disponibilidade imediata*

### Recursos Digitais de Apoio
- **Tutorial Visual** (impresso): "5 Passos para Treinar sua IA"
- **Checklist de Qualidade de Dados** (impresso por dupla)
- **Vídeo de 3min:** "Como funciona o Teachable Machine" (exibir antes do hands-on)

### Preparação Prévia do Educador
- [ ] Testar Teachable Machine em todos os computadores
- [ ] Criar um modelo exemplo com 3 categorias (demonstração)
- [ ] Preparar dataset de emergência (300 imagens salvas localmente)
- [ ] Configurar compartilhamento de modelos (Google Drive da turma)
- [ ] Imprimir checklists e cartões de registro

---

## ESTRUTURA DETALHADA DA AULA (120 minutos)

---

## BLOCO 1: ABERTURA E INVESTIGAÇÃO INICIAL (20 minutos)

### Momento 1.1: Perguntas Provocativas - "Decisões Invisíveis" (10 min)

**Objetivo:** Ativar conhecimento prévio sobre IA no cotidiano

**Dinâmica:**
1. Educador projeta 5 situações na tela:
   - 📱 "Como o celular reconhece seu rosto para desbloquear?"
   - 🎵 "Como o Spotify sabe quais músicas você vai gostar?"
   - 📧 "Como o Gmail sabe que um email é spam?"
   - 📸 "Como o Instagram identifica pessoas em fotos?"
   - 🗣️ "Como a Alexa entende o que você fala?"

2. Alunos discutem em grupos de 3-4 por 4 minutos
3. Cada grupo compartilha 1 hipótese (30 segundos cada)

**Conceito-Revelação:**
- Educador: "Todas essas tecnologias usam MACHINE LEARNING - máquinas que aprendem com exemplos!"
- "Hoje vocês vão criar uma IA que aprende da mesma forma!"

---

### Momento 1.2: Autoavaliação - "Minha Jornada de Descoberta" (10 min)

**Objetivo:** Identificar interesses e nivelar expectativas

**Atividade Individual (papel A5):**

```
┌─────────────────────────────────────────┐
│  MINHA JORNADA DE DESCOBERTA            │
├─────────────────────────────────────────┤
│ 1. Já usei IA antes? □ Sim □ Não        │
│    Se sim, qual? ___________________    │
│                                         │
│ 2. Três coisas que quero investigar     │
│    com IA neste curso:                  │
│    a) ____________________________      │
│    b) ____________________________      │
│    c) ____________________________      │
│                                         │
│ 3. Marque seu nível:                    │
│    □ Nunca programei                    │
│    □ Já fiz jogos/blocos (Scratch)      │
│    □ Já escrevi código (Python, etc.)   │
│                                         │
│ 4. Meu maior medo com tecnologia:       │
│    _______________________________      │
└─────────────────────────────────────────┘
```

**Compartilhamento:**
- Alunos compartilham item 2 (tópicos de interesse) com a turma
- Educador agrupa interesses comuns no quadro (ex: saúde, jogos, ambiente)

**Aplicação:**
- Esses tópicos serão usados em projetos futuros do módulo

---

## BLOCO 2: ÉTICA EM IA - O CLASSIFICADOR ERRADO (30 minutos)

### Momento 2.1: Jogo Experimental - "Enganando a Máquina" (20 min)

**Objetivo:** Compreender viés de dados através de experiência prática

**Setup do Experimento:**

Educador prepara previamente (ou faz ao vivo) um modelo PROPOSITALMENTE RUIM no Teachable Machine:

**Modelo Falho: "Frutas"**
- **Categoria 1 "Maçã":** 10 fotos de maçãs vermelhas apenas
- **Categoria 2 "Banana":** 15 fotos de bananas maduras (amarelas)
- **Categoria 3 "Laranja":** 8 fotos de laranjas

**Fase 1 - Demonstração do Erro (8 min):**

1. Educador mostra o modelo funcionando "bem" com as frutas usadas no treino
2. Então testa com:
   - Maçã VERDE → modelo classifica como "Banana" ❌
   - Banana VERDE → modelo não reconhece ❌
   - Limão → modelo confunde com "Banana" ❌

3. Educador pergunta: **"Por que a IA está errando tanto?"**

**Fase 2 - Investigação em Grupos (8 min):**

Alunos em grupos de 4 recebem cartão com perguntas:

```
🔍 INVESTIGAÇÃO: POR QUE A IA FALHOU?

1. Quantas fotos foram usadas para treinar? _______
2. As fotos eram todas parecidas ou variadas?
3. O que faltou ensinar para a IA?
4. Como poderíamos melhorar esse modelo?

CONCLUSÃO DO GRUPO:
_________________________________________
```

**Fase 3 - Síntese Coletiva (4 min):**

Educador guia para conceitos-chave:
- ✅ **Quantidade de dados importa** (mínimo de amostras)
- ✅ **Diversidade importa** (maçãs vermelhas E verdes)
- ✅ **Contexto importa** (fundo, iluminação)
- ✅ **Balanceamento importa** (10 de cada, não 100 de uma e 5 de outra)

**Conceito Formal Introduzido:**
> **"VIÉS DE DADOS: Quando a IA aprende apenas com exemplos limitados, ela erra em situações novas. Nossa responsabilidade é treinar com dados diversos e representativos!"**

---

### Momento 2.2: Criando Nossa Regra - "Por Que a IA Erra?" (10 min)

**Objetivo:** Formular princípio ético sobre qualidade de dados

**Atividade Individual:**

Cada aluno completa a frase em tira de papel colorido:

> **"Para a IA aprender direito, os dados devem ser _____________ e _____________"**
>
> Exemplos: "variados e suficientes" / "diversos e equilibrados" / "honestos e completos"

**Mural Coletivo:**
- Colar todas as regras em cartolina "Nosso Compromisso com Dados de Qualidade"
- Educador fotografa para referência futura

**Discussão Bônus (se houver tempo):**
- "O que acontece se uma IA de reconhecimento facial foi treinada só com fotos de pessoas brancas?" (introduzir justiça algorítmica)

---

## BLOCO 3: INTERVALO E PREPARAÇÃO (10 minutos)

### Para os Alunos:
- Lanche e movimento livre (5 min)
- Formar duplas para o projeto (duplas escolhidas ou educador organiza por nível) (2 min)

### Para o Educador (simultâneo):
- [ ] Abrir Teachable Machine em todos os computadores
- [ ] Verificar webcams funcionando
- [ ] Distribuir objetos físicos para cada dupla (ou confirmar que têm seus materiais)
- [ ] Preparar cronômetro visível para gestão de tempo

### Preparação das Duplas (3 min):
Cada dupla recebe:
- 1 computador com webcam
- 3 objetos para classificar
- 1 "Checklist de Treinamento" (documento impresso)

---

## BLOCO 4: PROJETO MÃO NA MASSA - "Classificador de Objetos" (50 minutos)

### Momento 4.1: Demonstração ao Vivo - "Criando Meu Primeiro Modelo" (8 min)

**Objetivo:** Ensinar o fluxo completo do Teachable Machine

**Demonstração do Educador (projetada):**

**Passo 1 - Criar Projeto (1 min):**
- Acessar teachablemachine.withgoogle.com
- Escolher "Image Project" → "Standard image model"

**Passo 2 - Adicionar Classes (1 min):**
- Renomear "Class 1" para "Caneta"
- Criar "Class 2" → "Caderno"
- Criar "Class 3" → "Garrafa"

**Passo 3 - Coletar Dados (3 min):**
- Mostrar como segurar objeto na webcam
- Clicar "Hold to Record" (gravar 3-4 segundos por posição)
- **IMPORTANTE:** Variar ângulos, distância, fundo
- Meta: mínimo 50 amostras por classe (20 segundos de gravação)

**Passo 4 - Treinar Modelo (2 min):**
- Clicar "Train Model"
- Aguardar treinamento (15-60 segundos)
- Explicar: "A IA está aprendendo padrões nessas imagens!"

**Passo 5 - Testar e Validar (1 min):**
- Mostrar objeto na webcam
- IA exibe probabilidades em tempo real
- Testar com ângulos diferentes, objetos parcialmente cobertos

**Dicas Verbalizadas:**
- "Movam o objeto devagar enquanto gravam!"
- "Se a IA errar, adicionem mais exemplos desse tipo!"
- "O fundo também importa - variem a posição!"

---

### Momento 4.2: Treinamento em Duplas - "Escola de IA" (35 min)

**Objetivo:** Cada dupla criar modelo funcional de classificação

**Estrutura de Trabalho:**

```
┌───────────────────────────────────────────────┐
│  CHECKLIST DE TREINAMENTO - DUPLA ___        │
├───────────────────────────────────────────────┤
│ FASE 1: PLANEJAMENTO (5 min)                 │
│  □ Escolher 3 objetos claros e diferentes    │
│  □ Dar nomes descritivos às classes          │
│  □ Decidir quem segura/quem opera o mouse    │
│                                               │
│ FASE 2: COLETA DE DADOS (15 min)             │
│  □ Classe 1: _____ (min. 50 amostras)        │
│     Variar: □ ângulos □ distância □ fundo    │
│  □ Classe 2: _____ (min. 50 amostras)        │
│     Variar: □ ângulos □ distância □ fundo    │
│  □ Classe 3: _____ (min. 50 amostras)        │
│     Variar: □ ângulos □ distância □ fundo    │
│                                               │
│ FASE 3: TREINAMENTO (2 min)                  │
│  □ Clicar "Train Model"                      │
│  □ Aguardar conclusão                        │
│                                               │
│ FASE 4: TESTES (10 min)                      │
│  □ Testar cada objeto (sucesso? □ Sim □ Não) │
│  □ Testar com ângulos estranhos              │
│  □ Tentar "enganar" a IA                     │
│  □ Se erros > 30%: adicionar mais dados      │
│                                               │
│ FASE 5: EXPORTAR (3 min)                     │
│  □ Clicar "Export Model"                     │
│  □ Escolher "Shareable Link"                 │
│  □ Copiar link e salvar no documento         │
│                                               │
│ PRECISÃO FINAL: _____% (sucesso nos testes)  │
└───────────────────────────────────────────────┘
```

**Gestão do Tempo:**
Educador anuncia em voz alta:
- "5 minutos para planejamento! Comecem!"
- "15 minutos para coleta de dados! Variem os ângulos!"
- "Hora de treinar! Cliquem no botão azul!"
- "10 minutos finais para testar e refinar!"

**Suporte Contínuo:**
- Educador + assistente circulam entre as duplas
- Resolver problemas técnicos imediatamente
- Dar feedback qualitativo: "Ótimo! Tente agora com o objeto mais longe da câmera"

**Desafios Progressivos (para duplas rápidas):**
1. ⭐ **Desafio Bronze:** Adicionar 4ª classe
2. ⭐⭐ **Desafio Prata:** Conseguir 95%+ de precisão
3. ⭐⭐⭐ **Desafio Ouro:** Fazer modelo funcionar no escuro (com lanterna)

---

### Momento 4.3: Exportação e Compartilhamento (7 min)

**Objetivo:** Salvar modelo para uso futuro e compartilhar

**Processo Estruturado:**

**Passo 1 - Exportar (3 min por dupla):**
1. Clicar em "Export Model" (botão no topo)
2. Aba "Upload (shareable link)"
3. Clicar "Upload my model"
4. Aguardar upload (30-60 segundos)
5. Copiar o link gerado

**Passo 2 - Registrar (2 min):**
Duplas preenchem ficha digital/impressa:

```
CERTIFICADO DE TREINAMENTO DE IA
Dupla: _________________ Data: ___/___/___
Modelo: Classificador de _______________
Classes treinadas:
1. _____________ (_____ amostras)
2. _____________ (_____ amostras)
3. _____________ (_____ amostras)
Precisão estimada: _____%
Link do modelo: _________________________
```

**Passo 3 - Repositório Coletivo (2 min):**
- Educador cria planilha Google Sheets projetada
- Cada dupla adiciona uma linha com seu link e descrição
- Título: "Galeria de IAs da Turma Discovery 2026"

**Artefato Final Completo:**
✅ Modelo funcional de classificação  
✅ Link compartilhável  
✅ Registro documentado  
✅ Disponível para uso em aulas futuras  

---

## BLOCO 5: DEMONSTRAÇÃO E FECHAMENTO (10 minutos)

### Momento 5.1: Galeria de Modelos - "Testando as IAs dos Colegas" (7 min)

**Objetivo:** Celebrar criações e praticar teste entre pares

**Formato "Feira de Ciências Rápida":**

1. **Rodízio de Duplas (5 min):**
   - Metade das duplas fica em seus computadores (anfitriões)
   - Metade visita outras estações (visitantes)
   - Após 2,5 min, invertem os papéis

2. **Protocolo de Visita:**
   - Anfitriões demonstram seu modelo (30 seg)
   - Visitantes testam com os objetos (30 seg)
   - Visitantes dão 1 feedback positivo ("Adorei que reconhece até de longe!")

3. **Votação Relâmpago (2 min):**
   - Categorias: "Modelo Mais Preciso", "Desafio Mais Criativo", "Melhor Variedade de Dados"
   - Alunos votam levantando a mão (não pode votar em si mesmo)
   - Vencedores recebem adesivo "Cientista de Dados"

---

### Momento 5.2: Reflexão Guiada - "O Que Descobrimos Sobre ML?" (3 min)

**Perguntas Reflexivas:**

Educador pergunta e anota respostas no quadro:

1. **"O que foi mais difícil no treinamento?"**
   - Respostas esperadas: coletar dados variados, fazer IA não confundir objetos parecidos

2. **"Se vocês fossem treinar uma IA para algo sério (ex: detectar doenças), o que fariam diferente?"**
   - Guiar para: mais dados, especialistas validando, testar muito antes de usar

3. **"Onde vocês usariam essa tecnologia no mundo real?"**
   - Exemplos: segurança (detectar pessoas), indústria (produtos defeituosos), medicina (exames)

**Síntese do Educador:**
> "Hoje vocês fizeram o que cientistas de dados fazem profissionalmente: coletaram dados, treinaram um modelo, testaram e refinaram. Isso é Machine Learning real!"

---

## BLOCO 6: CONEXÃO COM CASA (Last 5 minutes already included in 120 total)

### 📝 Homework (Individual):

**"Missão: Caçador de IA no Cotidiano"**

Encontre e fotografe/desenhe **3 exemplos** de onde classificação automática é usada:
- Exemplos: reconhecimento facial, filtros de Instagram, detecção de objetos em carros autônomos
- Para cada um, escrever: "O que está sendo classificado?" e "Como isso ajuda as pessoas?"

**Formato de Entrega:**
- Documento digital (Google Docs) OU
- Cartaz físico com imagens coladas

---

### 👨‍👩‍👧 Family Work (Com a Família):

**"Ensine Alguém a Treinar uma IA"**

1. Mostrar o modelo criado para 1-2 pessoas da família
2. Deixar elas testarem com objetos de casa
3. Explicar (com suas palavras): "Como ensinei a máquina a reconhecer"
4. Perguntar: "Que tipo de IA você gostaria que existisse?" e registrar a resposta

**Entrega:**
- Áudio/vídeo de 1 min explicando OU
- Texto de 5 linhas no formulário online

---

## AVALIAÇÃO E REGISTRO

### Critérios de Sucesso da Aula

| Aspecto | Indicador de Sucesso |
|:---|:---|
| **Compreensão de ML** | ≥80% explicam "a IA aprende com exemplos" |
| **Modelo Funcional** | ≥85% das duplas criam modelo que funciona |
| **Qualidade de Dados** | ≥70% coletam ≥50 amostras/classe com variação |
| **Consciência de Viés** | ≥90% identificam problema de dados no experimento falho |
| **Colaboração** | ≥95% das duplas trabalham de forma equilibrada |

### Registro do Educador (Por Dupla)

```
Dupla: _________________ | Computador nº ___

✅ Modelo Completo: □ Sim □ Parcial □ Não
✅ Precisão Estimada: _____%
✅ Classes Treinadas: ___________________
✅ Demonstrou compreensão de viés: □ Sim □ Não
✅ Nível de autonomia: □ Alto □ Médio □ Baixo

Observações especiais:
_______________________________________
```

---

## PLANO B (CONTINGÊNCIAS)

### Cenário 1: Internet Instável Durante Treinamento

**Solução A - Dataset Pré-coletado:**
1. Educador tem pasta com 150 imagens organizadas (50 de cada categoria: caneta, caderno, garrafa)
2. Alunos fazem upload manual dessas imagens no Teachable Machine (modo "Upload")
3. Continuam processo normalmente

**Solução B - Demonstração Guiada:**
1. Se múltiplos computadores falharem, fazer treinamento coletivo em 1 computador
2. Projetar na tela e narrar cada passo
3. Alunos anotam observações e simulam processo em papel (flowchart do treinamento)

---

### Cenário 2: Webcam Não Funciona

**Solução A - Usar Celulares:**
1. Alunos tiram fotos com celular dos objetos (variando ângulos)
2. Transferem via cabo/WhatsApp Web para computador
3. Upload manual no Teachable Machine

**Solução B - Modo de Arquivos:**
1. Usar banco de imagens Creative Commons (preparado previamente)
2. Alunos escolhem 3 categorias de objetos (ex: cachorros, gatos, pássaros)
3. Treinar modelo com imagens da internet

---

### Cenário 3: Teachable Machine Fora do Ar

**Solução C - Atividade Analógica:**
1. "Jogo do Classificador Humano"
2. Educador mostra 30 imagens impressas misturadas
3. Alunos em grupos classificam manualmente em 3 categorias
4. Cronometrar tempo e contar erros
5. Discussão: "Imaginem fazer isso com 1 milhão de imagens - é por isso que precisamos de IA!"

**Solução D - Vídeo Documentário:**
1. Exibir mini-documentário (15 min): "Como o Google Photos reconhece pessoas"
2. Discussão guiada sobre o processo
3. Desenhar diagrama coletivo no quadro do fluxo de ML

---

## CONEXÃO COM O MÓDULO I

Esta Semana 0 estabelece fundações técnicas:

| Conceito da Semana 0 | Evolução no Módulo I |
|:---|:---|
| **Classificação de objetos** | Aula 1-2: Classificação de lixo (aplicação ambiental) |
| **Coleta de dados** | Aula 3-4: Criar datasets para projetos reais |
| **Viés e qualidade** | Aula 5-7: Ética em projetos com impacto social |
| **Teste e validação** | Aula 8-16: Ciclo iterativo de desenvolvimento |
| **Teachable Machine** | Ferramenta recorrente em projetos do módulo |

---

## RECURSOS ADICIONAIS PARA O EDUCADOR

### Vocabulário-Chave da Aula
- **Machine Learning:** "Área da IA onde máquinas aprendem com exemplos"
- **Classificação:** "Organizar coisas em categorias (como separar frutas por tipo)"
- **Dataset:** "Conjunto de dados usado para treinar a IA"
- **Treinamento:** "Processo onde a IA aprende padrões nos dados"
- **Viés:** "Quando a IA erra porque foi treinada com dados limitados"
- **Modelo:** "A IA treinada, pronta para usar"

### Perguntas Frequentes dos Alunos

| Pergunta | Resposta Sugerida |
|:---|:---|
| "Por que preciso de tantas fotos?" | "Quanto mais exemplos, melhor a IA entende variações. É como estudar mais exemplos antes da prova!" |
| "Minha IA está errando muito" | "Vamos investigar juntos: os dados são variados? Tem fundo diferente? Vamos adicionar mais exemplos dos casos que erram" |
| "Posso treinar com pessoas?" | "Sim, mas precisamos de autorização. Hoje vamos focar em objetos para praticar" |
| "Quanto tempo demora para treinar?" | "Com nossos dados, 30-60 segundos. IAs profissionais podem levar dias!" |

---

## CHECKLIST PRÉ-AULA (EDUCADOR)

**1 Semana Antes:**
- [ ] Testar Teachable Machine em todos os computadores + webcams
- [ ] Criar modelo de demonstração (frutas com viés)
- [ ] Preparar dataset de backup (150 imagens locais)
- [ ] Imprimir checklists e fichas de registro (1 por dupla)
- [ ] Preparar objetos físicos (ou listar o que alunos devem trazer)
- [ ] Criar planilha Google Sheets para repositório de modelos

**1 Dia Antes:**
- [ ] Confirmar internet estável (testar velocidade)
- [ ] Organizar duplas (nivelar habilidades)
- [ ] Enviar lembrete: "Tragam 3 objetos pequenos de casa"
- [ ] Preparar cronômetro/timer visível

**1 Hora Antes:**
- [ ] Abrir Teachable Machine em todos os navegadores
- [ ] Testar todas as webcams
- [ ] Distribuir objetos físicos nas mesas
- [ ] Preparar projetor com demonstração

**Durante a Aula:**
- [ ] Fotografar modelos para portfólio
- [ ] Anotar tempo real gasto em cada fase (ajustar próximas turmas)
- [ ] Registrar duplas que precisam suporte extra

**Após a Aula:**
- [ ] Salvar links de todos os modelos em documento mestre
- [ ] Compartilhar galeria com responsáveis
- [ ] Documentar ajustes necessários
- [ ] Arquivar "Regras de Dados" para referência

---

## EXTENSÕES OPCIONAIS (Se Houver Tempo Extra)

### 1. Desafio "IA vs Humano"
- Competição: Quem classifica mais rápido (modelo de IA vs aluno cronometrado)?
- Discussão: Quando humanos são melhores? Quando IA é melhor?

### 2. Projeto "Classificador Útil"
- Duplas pensam em aplicação real para seu modelo
- Ex: "Organizador de materiais escolares", "Detector de reciclagem"
- Apresentação de 1 minuto do caso de uso

### 3. Evolução do Modelo
- Adicionar 4ª e 5ª classes
- Treinar com objetos mais complexos (ex: frutas reais)

---

## CONSIDERAÇÕES FINAIS

Esta aula foi desenhada para ser a **porta de entrada científica** no ML para alunos de 9+ anos. O sucesso está em:

🔬 **Método Científico** (hipótese → experimento → análise)  
🤝 **Colaboração** (trabalho em duplas equilibrado)  
📊 **Dados** (compreensão de qualidade > quantidade)  
⚖️ **Ética** (viés e responsabilidade desde o início)  
🏆 **Artefato Funcional** (modelo exportável e reutilizável)  

O aluno deve sair dessa aula pensando:  
> *"Eu TREINEI uma Inteligência Artificial! Agora entendo como máquinas aprendem. Que outros problemas eu posso resolver com isso?"*

---

**Versão:** 1.0  
**Data de Criação:** Janeiro 2026  
**Autor:** Equipe Pedagógica Innova Academy  
**Revisão:** Implementando Opção B (Classificador de Objetos) com planos B robustos
