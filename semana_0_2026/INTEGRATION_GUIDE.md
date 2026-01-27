# 🔗 Guia de Integração - Semana 0 no Sistema Innova

## 📋 Visão Geral

Este documento descreve como integrar os materiais da Semana 0 no sistema da Innova Academy, considerando a lógica de rotação anual e aplicação uniforme em todos os módulos.

## 🎯 Regras de Negócio

### 1. Aplicação Uniforme por Curso
**Regra:** Todos os módulos (I, II, III, IV) de um curso específico usam a **mesma** aula da Semana 0 no ano corrente.

**Exemplo para 2026:**
```
Curiosity - Módulo I  → semana_0_2026/curiosity/
Curiosity - Módulo II → semana_0_2026/curiosity/
Curiosity - Módulo III → semana_0_2026/curiosity/
Curiosity - Módulo IV → semana_0_2026/curiosity/
```

### 2. Rotação Anual
**Regra:** A cada ano, os materiais da Semana 0 devem ser alternados para oferecer variedade.

**Estrutura de Diretórios:**
```
semana_0_2026/    ← Ano 2026
semana_0_2027/    ← Ano 2027 (novo conteúdo)
semana_0_2028/    ← Ano 2028 (pode reutilizar 2026 ou criar novo)
```

### 3. Timing de Execução
**Regra:** A Semana 0 acontece **antes** do início do Módulo I de cada ciclo.

**Cronograma:**
```
Semana -1: Preparação
Semana 0:  Aula Inaugural (120 min)
Semana 1:  Início Módulo I - Aula 1
```

## 🗄️ Estrutura de Dados Sugerida

### Tabela: `week_zero_lessons`

```sql
CREATE TABLE week_zero_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL,
  course_level VARCHAR(20) NOT NULL, -- 'curiosity', 'discovery', 'pioneer', 'challenger'
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  artifact_name VARCHAR(255), -- Nome do artefato que alunos criarão
  duration_minutes INTEGER DEFAULT 120,
  lesson_plan_path TEXT NOT NULL, -- Caminho para o arquivo .md
  activities_path TEXT, -- Caminho para o arquivo .csv
  methodology VARCHAR(100),
  target_age VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  
  UNIQUE(year, course_level)
);
```

### Dados para 2026:

```sql
INSERT INTO week_zero_lessons (year, course_level, title, subtitle, artifact_name, lesson_plan_path, activities_path, methodology, target_age) VALUES
(2026, 'curiosity', 'Despertar Digital', 'Meu Primeiro Avatar com IA', 'Avatar IA', 'semana_0_2026/curiosity/Semana0_Curiosity_PlanoDetalhado.md', 'semana_0_2026/curiosity/Semana0_Curiosity_Atividades.csv', 'Aprendizagem Lúdica com Entrega Imediata', '6+ anos'),

(2026, 'discovery', 'Descobrindo como as Máquinas Pensam', 'Meu Classificador de Objetos', 'Classificador ML', 'semana_0_2026/discovery/Semana0_Discovery_PlanoDetalhado.md', 'semana_0_2026/discovery/Semana0_Discovery_Atividades.csv', 'Investigação Científica com Método Experimental', '9+ anos'),

(2026, 'pioneer', 'Construindo com Código', 'Meu Primeiro Chatbot Inteligente', 'Chatbot Python', 'semana_0_2026/pioneer/Semana0_Pioneer_PlanoDetalhado.md', 'semana_0_2026/pioneer/Semana0_Pioneer_Atividades.csv', 'Desenvolvimento Guiado com Assistência de IA', '12+ anos'),

(2026, 'challenger', 'Inovando com Dados', 'Meu Primeiro Dashboard de Insights', 'Dashboard de Dados', 'semana_0_2026/challenger/Semana0_Challenger_PlanoDetalhado.md', 'semana_0_2026/challenger/Semana0_Challenger_Atividades.csv', 'Data-Driven Problem Solving', '14+ anos');
```

## 🔄 Lógica de Seleção

### Função: Obter Aula da Semana 0

```javascript
/**
 * Retorna a aula da Semana 0 apropriada baseada no curso e ano
 */
async function getWeekZeroLesson(courseLevel, year = new Date().getFullYear()) {
  const lesson = await db.query(`
    SELECT * FROM week_zero_lessons 
    WHERE course_level = $1 
    AND year = $2 
    AND is_active = true
    LIMIT 1
  `, [courseLevel, year]);
  
  if (!lesson) {
    // Fallback: usar ano anterior se não houver para o ano corrente
    return await db.query(`
      SELECT * FROM week_zero_lessons 
      WHERE course_level = $1 
      AND year < $2 
      AND is_active = true
      ORDER BY year DESC
      LIMIT 1
    `, [courseLevel, year]);
  }
  
  return lesson;
}
```

### Exemplo de Uso no Frontend:

```jsx
// Componente para exibir materiais da Semana 0
function WeekZeroLessonPlan({ courseLevel }) {
  const [lesson, setLesson] = useState(null);
  
  useEffect(() => {
    async function loadLesson() {
      const data = await getWeekZeroLesson(courseLevel);
      setLesson(data);
    }
    loadLesson();
  }, [courseLevel]);
  
  if (!lesson) return <LoadingSpinner />;
  
  return (
    <div className="week-zero-lesson">
      <h1>{lesson.title}</h1>
      <h2>{lesson.subtitle}</h2>
      <div className="metadata">
        <span>Duração: {lesson.duration_minutes} minutos</span>
        <span>Faixa Etária: {lesson.target_age}</span>
        <span>Artefato: {lesson.artifact_name}</span>
      </div>
      <LessonPlanViewer path={lesson.lesson_plan_path} />
      <ActivitiesTable path={lesson.activities_path} />
    </div>
  );
}
```

## 📅 Agendamento Automático

### Tabela: `scheduled_week_zero`

```sql
CREATE TABLE scheduled_week_zero (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_level VARCHAR(20) NOT NULL,
  module_number INTEGER NOT NULL,
  year INTEGER NOT NULL,
  scheduled_date DATE NOT NULL,
  instructor_id UUID REFERENCES users(id),
  room_id UUID REFERENCES rooms(id),
  status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled'
  actual_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(course_level, module_number, year)
);
```

### Função: Agendar Semana 0 Automaticamente

```javascript
/**
 * Agenda a Semana 0 para todos os módulos de um curso no início do ano
 */
async function scheduleWeekZeroForYear(year, courseLevel) {
  const modules = [1, 2, 3, 4]; // Módulos I, II, III, IV
  const lesson = await getWeekZeroLesson(courseLevel, year);
  
  for (const moduleNum of modules) {
    // Calcular data baseado no calendário do módulo
    const moduleStartDate = await getModuleStartDate(year, moduleNum);
    const weekZeroDate = subtractWeeks(moduleStartDate, 1);
    
    await db.query(`
      INSERT INTO scheduled_week_zero 
      (course_level, module_number, year, scheduled_date)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (course_level, module_number, year) 
      DO UPDATE SET scheduled_date = $4
    `, [courseLevel, moduleNum, year, weekZeroDate]);
  }
}
```

## 🎨 Interface de Usuário

### 1. Dashboard do Instrutor

**Componentes necessários:**

```jsx
// Card de preparação para Semana 0
function WeekZeroPreparationCard({ scheduledLesson }) {
  const daysUntil = calculateDaysUntil(scheduledLesson.scheduled_date);
  
  return (
    <Card className="week-zero-prep">
      <h3>Semana 0 - {scheduledLesson.course_level}</h3>
      <p>Em {daysUntil} dias</p>
      <Button onClick={() => viewLessonPlan(scheduledLesson)}>
        Ver Plano de Aula
      </Button>
      <PreparationChecklist lesson={scheduledLesson} />
    </Card>
  );
}

// Checklist de preparação
function PreparationChecklist({ lesson }) {
  const items = [
    { id: 1, text: 'Revisar plano detalhado', done: false },
    { id: 2, text: 'Preparar materiais físicos', done: false },
    { id: 3, text: 'Testar ferramentas digitais', done: false },
    { id: 4, text: 'Configurar ambiente de aula', done: false },
    { id: 5, text: 'Revisar Plano B', done: false }
  ];
  
  return (
    <ChecklistComponent 
      items={items} 
      onUpdate={(itemId, done) => updateChecklistItem(lesson.id, itemId, done)}
    />
  );
}
```

### 2. Visualizador de Plano de Aula

```jsx
function LessonPlanViewer({ path }) {
  const [content, setContent] = useState('');
  
  useEffect(() => {
    async function loadMarkdown() {
      const response = await fetch(`/api/content/${path}`);
      const text = await response.text();
      setContent(text);
    }
    loadMarkdown();
  }, [path]);
  
  return (
    <div className="lesson-plan-viewer">
      <MarkdownRenderer content={content} />
      <DownloadButton path={path} />
      <PrintButton content={content} />
    </div>
  );
}
```

### 3. Galeria de Artefatos

```jsx
function WeekZeroArtifactsGallery({ courseLevel, year }) {
  const [artifacts, setArtifacts] = useState([]);
  
  useEffect(() => {
    async function loadArtifacts() {
      const data = await fetchStudentArtifacts(courseLevel, year, 0);
      setArtifacts(data);
    }
    loadArtifacts();
  }, [courseLevel, year]);
  
  return (
    <div className="artifacts-gallery">
      <h2>Artefatos da Semana 0 - {courseLevel} ({year})</h2>
      <div className="gallery-grid">
        {artifacts.map(artifact => (
          <ArtifactCard key={artifact.id} artifact={artifact} />
        ))}
      </div>
    </div>
  );
}
```

## 📊 Relatórios e Analytics

### Métricas a Coletar:

```sql
CREATE TABLE week_zero_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheduled_lesson_id UUID REFERENCES scheduled_week_zero(id),
  students_present INTEGER,
  artifacts_completed INTEGER,
  average_engagement_score DECIMAL(3,2), -- 0.00 a 5.00
  vark_assessments_completed INTEGER,
  ethics_discussions_completed BOOLEAN,
  instructor_feedback TEXT,
  improvement_suggestions TEXT,
  collected_at TIMESTAMP DEFAULT NOW()
);
```

### Dashboard de Analytics:

```javascript
async function getWeekZeroAnalytics(year, courseLevel = null) {
  let query = `
    SELECT 
      w.course_level,
      COUNT(DISTINCT w.id) as total_lessons,
      AVG(m.students_present) as avg_attendance,
      AVG(m.average_engagement_score) as avg_engagement,
      SUM(m.artifacts_completed) as total_artifacts
    FROM scheduled_week_zero w
    LEFT JOIN week_zero_metrics m ON m.scheduled_lesson_id = w.id
    WHERE w.year = $1
  `;
  
  const params = [year];
  
  if (courseLevel) {
    query += ` AND w.course_level = $2`;
    params.push(courseLevel);
  }
  
  query += ` GROUP BY w.course_level`;
  
  return await db.query(query, params);
}
```

## 🔔 Notificações e Lembretes

### Sistema de Alertas:

```javascript
async function scheduleWeekZeroReminders(scheduledLesson) {
  const reminders = [
    { days_before: 7, message: 'Semana 0 em 1 semana! Hora de revisar o plano.' },
    { days_before: 3, message: 'Semana 0 em 3 dias! Prepare os materiais físicos.' },
    { days_before: 1, message: 'Semana 0 amanhã! Teste as ferramentas digitais.' },
    { days_before: 0, message: 'Semana 0 hoje! Boa aula! 🚀' }
  ];
  
  for (const reminder of reminders) {
    const reminderDate = subtractDays(scheduledLesson.scheduled_date, reminder.days_before);
    
    await scheduleNotification({
      user_id: scheduledLesson.instructor_id,
      type: 'week_zero_reminder',
      title: `Semana 0 - ${scheduledLesson.course_level}`,
      message: reminder.message,
      scheduled_for: reminderDate,
      action_url: `/week-zero/lesson/${scheduledLesson.id}`
    });
  }
}
```

## 🔄 Fluxo de Trabalho Completo

### 1. Início do Ano Letivo
```
1. Administrador define calendário do ano
2. Sistema agenda automaticamente Semana 0 para todos os cursos/módulos
3. Instrutores recebem notificação de agendamento
4. Checklist de preparação é criado
```

### 2. Preparação (1-2 semanas antes)
```
1. Instrutor recebe primeiro lembrete (7 dias antes)
2. Instrutor revisa plano de aula através da plataforma
3. Sistema mostra checklist de materiais necessários
4. Instrutor marca itens como preparados
5. Lembretes subsequentes são enviados (3 dias, 1 dia antes)
```

### 3. Execução (Dia da Aula)
```
1. Instrutor recebe lembrete no dia
2. Acessa plano de aula via mobile/tablet durante execução
3. Registra presença dos alunos
4. Alunos criam e submetem artefatos via plataforma
5. Instrutor preenche avaliações diagnósticas (VARK, etc.)
```

### 4. Pós-Aula
```
1. Instrutor registra feedback e sugestões de melhoria
2. Artefatos dos alunos são publicados na galeria
3. Métricas são coletadas e armazenadas
4. Sistema gera relatório de execução
5. Coordenação recebe dashboard consolidado
```

## 🎯 Pontos de Integração Críticos

### 1. Sistema de Arquivos
- **Localização:** `/home/user/webapp/semana_0_2026/`
- **Acesso:** Via API de conteúdo estático
- **Formato:** Markdown (.md) e CSV (.csv)

### 2. Banco de Dados
- Tabelas: `week_zero_lessons`, `scheduled_week_zero`, `week_zero_metrics`
- Relacionamentos: Com `users`, `rooms`, `students`, `student_artifacts`

### 3. API Endpoints

```javascript
// Listar lições da Semana 0
GET /api/week-zero/lessons?year=2026&course=curiosity

// Obter plano de aula específico
GET /api/week-zero/lessons/:id/plan

// Obter atividades
GET /api/week-zero/lessons/:id/activities

// Agendar Semana 0
POST /api/week-zero/schedule
{
  "course_level": "curiosity",
  "module_number": 1,
  "year": 2026,
  "scheduled_date": "2026-02-01",
  "instructor_id": "uuid",
  "room_id": "uuid"
}

// Registrar métricas
POST /api/week-zero/metrics
{
  "scheduled_lesson_id": "uuid",
  "students_present": 15,
  "artifacts_completed": 14,
  "average_engagement_score": 4.5,
  "instructor_feedback": "Excelente engajamento..."
}

// Upload de artefato do aluno
POST /api/week-zero/artifacts
{
  "student_id": "uuid",
  "scheduled_lesson_id": "uuid",
  "artifact_type": "image",
  "file": <multipart-file>,
  "description": "Meu avatar IA"
}
```

## 📱 Considerações Mobile

### Acesso Offline:
```javascript
// Service Worker para cache de planos de aula
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('week-zero-v1').then((cache) => {
      return cache.addAll([
        '/semana_0_2026/curiosity/Semana0_Curiosity_PlanoDetalhado.md',
        '/semana_0_2026/discovery/Semana0_Discovery_PlanoDetalhado.md',
        '/semana_0_2026/pioneer/Semana0_Pioneer_PlanoDetalhado.md',
        '/semana_0_2026/challenger/Semana0_Challenger_PlanoDetalhado.md'
      ]);
    })
  );
});
```

## 🧪 Testes Recomendados

### 1. Testes de Integração
```javascript
describe('Week Zero Integration', () => {
  it('should schedule week zero for all modules', async () => {
    await scheduleWeekZeroForYear(2026, 'curiosity');
    const scheduled = await getScheduledWeekZero(2026, 'curiosity');
    expect(scheduled).toHaveLength(4); // 4 módulos
  });
  
  it('should retrieve correct lesson plan for year and course', async () => {
    const lesson = await getWeekZeroLesson('curiosity', 2026);
    expect(lesson.lesson_plan_path).toContain('semana_0_2026/curiosity');
  });
  
  it('should fallback to previous year if current not available', async () => {
    const lesson = await getWeekZeroLesson('curiosity', 2027);
    expect(lesson.year).toBe(2026); // Usa 2026 como fallback
  });
});
```

### 2. Testes de UI
```javascript
describe('Week Zero UI Components', () => {
  it('should render lesson plan correctly', async () => {
    render(<LessonPlanViewer path="semana_0_2026/curiosity/..." />);
    await waitFor(() => {
      expect(screen.getByText(/Despertar Digital/i)).toBeInTheDocument();
    });
  });
  
  it('should show preparation checklist', () => {
    render(<PreparationChecklist lesson={mockLesson} />);
    expect(screen.getByText(/Revisar plano detalhado/i)).toBeInTheDocument();
  });
});
```

## 📝 Checklist de Implementação

- [ ] Criar tabelas no banco de dados
- [ ] Inserir dados da Semana 0 2026
- [ ] Implementar API endpoints
- [ ] Criar componentes de UI
- [ ] Implementar sistema de notificações
- [ ] Configurar agendamento automático
- [ ] Criar sistema de métricas
- [ ] Implementar galeria de artefatos
- [ ] Configurar cache offline (PWA)
- [ ] Escrever testes de integração
- [ ] Documentar APIs
- [ ] Treinar instrutores na plataforma

## 🎓 Treinamento de Instrutores

### Materiais de Treinamento:
1. **Vídeo Tutorial:** Como usar a plataforma para Semana 0
2. **Guia Rápido:** Checklist de preparação
3. **FAQ:** Perguntas frequentes sobre Semana 0
4. **Suporte:** Canal dedicado para dúvidas

---

**Versão:** 1.0  
**Última Atualização:** Janeiro 2026  
**Próxima Revisão:** Preparação para Semana 0 2027
