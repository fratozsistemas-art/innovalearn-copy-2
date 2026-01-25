
import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { TeacherTrainingCourse, TeacherTrainingProgress } from "@/entities/all";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, 
  BookOpen, 
  Code,
  Users,
  Target,
  Award,
  PlayCircle,
  CheckCircle2,
  Clock,
  Brain,
  Lightbulb
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ResourcesList from "../components/common/ResourcesList";
import { useNormalizedResources } from "@/components/hooks/useNormalizedResources";

const categoryInfo = {
  metodologia: {
    name: 'Metodologia CAIO',
    icon: Brain,
    color: 'var(--primary-teal)',
    description: 'Framework CAIO e personalização adaptativa'
  },
  tecnologia: {
    name: 'Tecnologia',
    icon: Code,
    color: 'var(--info)',
    description: 'Python, IA e ferramentas tecnológicas'
  },
  pedagogia: {
    name: 'Pedagogia',
    icon: BookOpen,
    color: 'var(--success)',
    description: 'Estratégias pedagógicas e VARK'
  },
  gestao_sala: {
    name: 'Gestão de Sala',
    icon: Users,
    color: 'var(--accent-orange)',
    description: 'Gestão de sala de aula e engajamento'
  },
  avaliacao: {
    name: 'Avaliação',
    icon: Target,
    color: 'var(--warning)',
    description: 'Métodos de avaliação e feedback'
  },
  soft_skills: {
    name: 'Soft Skills',
    icon: Lightbulb,
    color: 'var(--accent-yellow)',
    description: 'Desenvolvimento de competências socioemocionais'
  }
};

function CourseCard({ course, progress, onStart }) {
  const Icon = categoryInfo[course.category]?.icon || BookOpen;
  const categoryColor = categoryInfo[course.category]?.color || 'var(--primary-teal)';
  const isCompleted = progress?.progress_percentage === 100;
  const isInProgress = progress && progress.progress_percentage > 0 && progress.progress_percentage < 100;

  // Normalizar recursos do curso
  const normalizedResources = useNormalizedResources({
    lesson: null,
    propsResources: course.resources,
    frontmatter: null
  });

  return (
    <Card className="card-innova border-none overflow-hidden hover:shadow-xl transition-shadow">
      {course.thumbnail_url && (
        <div className="h-48 overflow-hidden">
          <img 
            src={course.thumbnail_url} 
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: categoryColor }}
            >
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <Badge style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}>
                {categoryInfo[course.category]?.name}
              </Badge>
            </div>
          </div>
          {isCompleted && (
            <Badge style={{ backgroundColor: 'var(--success)', color: 'white' }}>
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Concluído
            </Badge>
          )}
        </div>

        <h3 className="font-heading text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          {course.title}
        </h3>
        
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          {course.description}
        </p>

        <div className="flex items-center gap-4 text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {course.duration_hours}h
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            {course.modules?.length || 0} módulos
          </div>
        </div>

        {progress && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Progresso</span>
              <span className="text-sm font-bold" style={{ color: categoryColor }}>
                {progress.progress_percentage}%
              </span>
            </div>
            <Progress value={progress.progress_percentage} className="h-2" />
          </div>
        )}

        {/* Recursos do Curso */}
        {normalizedResources.length > 0 && (
          <div className="mb-4">
            <ResourcesList resources={normalizedResources} />
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={() => onStart(course)}
            className="flex-1"
            style={{ backgroundColor: categoryColor, color: 'white' }}
          >
            {isCompleted ? (
              <>
                <Award className="w-4 h-4 mr-2" />
                Revisar Curso
              </>
            ) : isInProgress ? (
              <>
                <PlayCircle className="w-4 h-4 mr-2" />
                Continuar
              </>
            ) : (
              <>
                <PlayCircle className="w-4 h-4 mr-2" />
                Iniciar Curso
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TeacherTrainingPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [myProgress, setMyProgress] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    
    try {
      const userData = await User.me();
      setUser(userData);

      if (!['administrador', 'coordenador_pedagogico', 'instrutor'].includes(userData.user_type)) {
        setLoading(false);
        return;
      }

      // Carregar cursos de capacitação
      const allCourses = await TeacherTrainingCourse.filter({ status: 'published' });
      setCourses(allCourses);

      // Carregar progresso do professor
      const progressData = await TeacherTrainingProgress.filter({ 
        teacher_email: userData.email 
      });
      
      const progressMap = {};
      progressData.forEach(p => {
        progressMap[p.course_id] = p;
      });
      setMyProgress(progressMap);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
    
    setLoading(false);
  };

  const handleStartCourse = (course) => {
    navigate(createPageUrl("TeacherTrainingCourse") + `?courseId=${course.id}`);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
            style={{ borderColor: 'var(--primary-teal)' }}
          />
          <p style={{ color: 'var(--text-secondary)' }}>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!['administrador', 'coordenador_pedagogico', 'instrutor'].includes(user?.user_type)) {
    return (
      <div className="p-8 text-center">
        <GraduationCap className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--warning)' }} />
        <h2 className="text-2xl font-bold mb-2">Acesso Restrito</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Esta área é exclusiva para educadores e gestores.
        </p>
      </div>
    );
  }

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(c => c.category === selectedCategory);

  const totalCourses = courses.length;
  const completedCourses = Object.values(myProgress).filter(p => p.progress_percentage === 100).length;
  const inProgressCourses = Object.values(myProgress).filter(p => p.progress_percentage > 0 && p.progress_percentage < 100).length;
  const overallProgress = totalCourses > 0 
    ? Math.round(Object.values(myProgress).reduce((sum, p) => sum + (p.progress_percentage || 0), 0) / totalCourses)
    : 0;

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl p-8 text-white shadow-2xl"
          style={{ background: 'linear-gradient(135deg, var(--primary-teal) 0%, var(--primary-navy) 100%)' }}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-heading font-bold mb-3">
              Capacitação Docente
            </h1>
            <p className="text-xl opacity-90 mb-6">
              Desenvolva suas competências para ser um educador de excelência na Innova Academy
            </p>
            
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <div className="text-3xl font-bold mb-1">{totalCourses}</div>
                <div className="text-sm opacity-90">Cursos Disponíveis</div>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <div className="text-3xl font-bold mb-1">{completedCourses}</div>
                <div className="text-sm opacity-90">Concluídos</div>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <div className="text-3xl font-bold mb-1">{inProgressCourses}</div>
                <div className="text-sm opacity-90">Em Andamento</div>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <div className="text-3xl font-bold mb-1">{overallProgress}%</div>
                <div className="text-sm opacity-90">Progresso Geral</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros por Categoria */}
        <Card className="card-innova border-none">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-3">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                style={selectedCategory === 'all' ? { backgroundColor: 'var(--primary-teal)', color: 'white' } : {}}
              >
                Todos os Cursos ({courses.length})
              </Button>
              {Object.entries(categoryInfo).map(([key, info]) => {
                const Icon = info.icon;
                const count = courses.filter(c => c.category === key).length;
                
                return (
                  <Button
                    key={key}
                    variant={selectedCategory === key ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(key)}
                    style={selectedCategory === key ? { backgroundColor: info.color, color: 'white' } : {}}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {info.name} ({count})
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Lista de Cursos */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                progress={myProgress[course.id]}
                onStart={handleStartCourse}
              />
            ))
          ) : (
            <Card className="col-span-2 card-innova">
              <CardContent className="p-12 text-center">
                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-xl font-semibold mb-2">Nenhum curso encontrado</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Não há cursos disponíveis nesta categoria no momento.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
