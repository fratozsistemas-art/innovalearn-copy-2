
import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Search, 
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Mail,
  Plus,
  BookOpen,
  Edit,
  Trash2,
  UserPlus,
  UserMinus,
  Pause,
  Play
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useDebounce } from "@/components/hooks/useDebounce";
import { useCurrentUser } from "@/components/hooks/useUser"; // Use the new hook
import { useNotificationSystem } from "@/components/hooks/useNotificationSystem";

const modulesData = {
  'curiosity-1': { name: 'Sustentabilidade e IA', level: 'curiosity', semester: 1 },
  'curiosity-2': { name: 'Astrofísica para Pequenos', level: 'curiosity', semester: 2 },
  'curiosity-3': { name: 'Ritmo e Algoritmos', level: 'curiosity', semester: 3 },
  'curiosity-4': { name: 'Dinheirinho Digital', level: 'curiosity', semester: 4 },
  'discovery-1': { name: 'ClimatePredict', level: 'discovery', semester: 1 },
  'discovery-2': { name: 'SkyNet', level: 'discovery', semester: 2 },
  'discovery-3': { name: 'MusicChess', level: 'discovery', semester: 3 },
  'discovery-4': { name: 'FinanceAI', level: 'discovery', semester: 4 },
  'pioneer-1': { name: 'CerradoWatch', level: 'pioneer', semester: 1 },
  'pioneer-2': { name: 'SETI-AI', level: 'pioneer', semester: 2 },
  'pioneer-3': { name: 'ArtStrategy', level: 'pioneer', semester: 3 },
  'pioneer-4': { name: 'EthicalFinAI', level: 'pioneer', semester: 4 },
  'challenger-1': { name: 'EarthAI', level: 'challenger', semester: 1 },
  'challenger-2': { name: 'SpaceAI', level: 'challenger', semester: 2 },
  'challenger-3': { name: 'CulturalAI', level: 'challenger', semester: 3 },
  'challenger-4': { name: 'GlobalFinAI', level: 'challenger', semester: 4 },
  'challenger-5': { name: 'Unicorn Startup', level: 'challenger', semester: 5 }
};

export default function ClassManagementPage() {
  const { data: user } = useCurrentUser(); // Use useCurrentUser hook
  const { showSuccess, showError, executeWithFeedback } = useNotificationSystem();

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]); // This will now hold User objects for students in the selected class
  // const [classStudentRelations, setClassStudentRelations] = useState([]); // Removed, relationships are on User object
  const [allStudents, setAllStudents] = useState([]); // All student users in the system
  const [allTeachers, setAllTeachers] = useState([]); // All teacher users in the system
  const [classTeachers, setClassTeachers] = useState([]); // This will now hold User objects for teachers in the selected class
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const debouncedSearch = useDebounce(searchTerm, 300);
  
  // Dialogs states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [isTeacherDialogOpen, setIsTeacherDialogOpen] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState(null); // This will hold a User object

  // Form states
  const [newClassName, setNewClassName] = useState("");
  const [newClassLevel, setNewClassLevel] = useState("curiosity");
  const [newClassYear, setNewClassYear] = useState(new Date().getFullYear());
  const [newClassSemester, setNewClassSemester] = useState(1);
  const [newClassModule, setNewClassModule] = useState("");
  const [newClassMaxStudents, setNewClassMaxStudents] = useState(25);
  const [selectedStudentToEnroll, setSelectedStudentToEnroll] = useState(""); // Holds student email
  const [selectedTeacherToAdd, setSelectedTeacherToAdd] = useState(""); // Holds teacher email
  const [selectedTeacherRole, setSelectedTeacherRole] = useState("titular");

  // OTIMIZAÇÃO: Carregar dados da turma apenas quando selecionada
  const loadClassData = useCallback(async (classId) => {
    try {
      // Get all users from the system
      const allSystemUsers = await base44.entities.User.list();
      
      // Filter students who are actively enrolled in this specific class
      const enrolledStudents = allSystemUsers.filter(u =>
        u.user_type === 'aluno' &&
        u.enrolled_classes?.some(ec => ec.class_id === classId && ec.status !== 'withdrawn')
      );
      
      // Filter teachers who are actively assigned to this specific class
      const assignedTeachers = allSystemUsers.filter(u =>
        u.user_type === 'instrutor' &&
        u.assigned_classes?.some(ac => ac.class_id === classId && ac.active)
      );

      setStudents(enrolledStudents);
      setClassTeachers(assignedTeachers);
    } catch (error) {
      console.error("Error loading class data:", error);
      showError("Erro ao carregar dados da turma: " + error.message);
    }
  }, [showError]);

  const loadData = useCallback(async () => {
    if (!user) return; // Wait for user data to be available
    
    setLoading(true);
    try {
      // Load all system users once
      const allSystemUsers = await base44.entities.User.list();
      setAllStudents(allSystemUsers.filter(u => u.user_type === 'aluno'));
      setAllTeachers(allSystemUsers.filter(u => u.user_type === 'instrutor'));

      // Load classes based on user type
      let userClasses = [];
      
      if (['administrador', 'coordenador_pedagogico'].includes(user.user_type)) {
        userClasses = await base44.entities.Class.list();
      } else if (['instrutor', 'secretaria'].includes(user.user_type)) {
        // Get class IDs the current user is assigned to
        const assignedClassIds = user.assigned_classes?.filter(ac => ac.active).map(ac => ac.class_id) || [];
        
        if (assignedClassIds.length > 0) {
          const allClasses = await base44.entities.Class.list();
          userClasses = allClasses.filter(c => assignedClassIds.includes(c.id));
        }
      }

      setClasses(userClasses);

      // Load data for the first class or the previously selected one
      if (userClasses.length > 0) {
        // Ensure selectedClass is still valid, or pick the first one
        const currentSelected = selectedClass && userClasses.find(c => c.id === selectedClass.id)
                                ? selectedClass
                                : userClasses[0];
        setSelectedClass(currentSelected);
        await loadClassData(currentSelected.id);
      } else {
        setSelectedClass(null);
        setStudents([]);
        setClassTeachers([]);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      showError("Erro ao carregar dados iniciais: " + error.message);
    }
    setLoading(false);
  }, [user, selectedClass, loadClassData, showError]); // Add user to dependency array

  useEffect(() => {
    loadData();
  }, [loadData, user]); // Add user as a dependency since loadData depends on it

  const handleClassSelect = async (classItem) => {
    setSelectedClass(classItem);
    await loadClassData(classItem.id);
  };

  const handleCreateClass = async () => {
    if (!newClassName.trim() || !newClassModule) {
      showError("Por favor, preencha o nome da turma e selecione o módulo.");
      return;
    }

    await executeWithFeedback({
      asyncFn: async () => {
        const moduleInfo = modulesData[newClassModule];

        const newClass = await base44.entities.Class.create({
          name: newClassName,
          explorer_level: moduleInfo.level,
          year: newClassYear,
          semester: moduleInfo.semester,
          status: 'active',
          max_students: newClassMaxStudents
        });

        // If the current user is an instructor, auto-assign them to the new class
        if (user && user.user_type === 'instrutor') {
          // Add the new class assignment to the user's assigned_classes array
          const updatedAssignedClasses = [
            ...(user.assigned_classes || []),
            {
              class_id: newClass.id,
              role: 'titular', // Default role for the creator instructor
              active: true
            }
          ];
          // Update the current user's profile with the new assignment
          await base44.auth.updateMe({
            assigned_classes: updatedAssignedClasses
          });
        }

        setIsCreateDialogOpen(false);
        setNewClassName("");
        setNewClassLevel("curiosity");
        setNewClassModule("");
        setNewClassYear(new Date().getFullYear());
        setNewClassMaxStudents(25);
        // newClassSemester is derived from moduleInfo, no need to set explicitly here after module selection.
        await loadData();
      },
      loadingMessage: 'Criando turma...',
      successMessage: 'Turma criada com sucesso!',
      errorMessage: 'Erro ao criar turma'
    });
  };

  const handleEditClass = async () => {
    if (!selectedClass) return;

    await executeWithFeedback({
      asyncFn: async () => {
        await base44.entities.Class.update(selectedClass.id, {
          name: newClassName,
          explorer_level: newClassLevel,
          year: newClassYear,
          semester: newClassSemester,
          max_students: newClassMaxStudents
        });

        setIsEditDialogOpen(false);
        await loadData();
      },
      loadingMessage: 'Atualizando turma...',
      successMessage: 'Turma atualizada com sucesso!',
      errorMessage: 'Erro ao atualizar turma'
    });
  };

  const openEditDialog = () => {
    if (selectedClass) {
      setNewClassName(selectedClass.name);
      setNewClassLevel(selectedClass.explorer_level);
      setNewClassYear(selectedClass.year);
      setNewClassSemester(selectedClass.semester);
      setNewClassMaxStudents(selectedClass.max_students || 25);
      // For editing, we don't necessarily update module via selection, just the specific semester/level values
      // If module choice is dynamic upon level change, this would need more logic.
      const currentModuleKey = Object.keys(modulesData).find(key => 
        modulesData[key].level === selectedClass.explorer_level && modulesData[key].semester === selectedClass.semester
      );
      setNewClassModule(currentModuleKey || "");
      setIsEditDialogOpen(true);
    }
  };

  const handleEnrollStudent = async () => {
    if (!selectedStudentToEnroll || !selectedClass) {
      showError("Por favor, selecione um aluno para matricular.");
      return;
    }

    await executeWithFeedback({
      asyncFn: async () => {
        const studentToEnroll = allStudents.find(s => s.email === selectedStudentToEnroll);
        
        if (!studentToEnroll) {
          throw new Error("Aluno não encontrado no sistema.");
        }

        // Check if student is already enrolled in this class (active or transferred)
        const alreadyEnrolled = studentToEnroll.enrolled_classes?.some(ec => 
          ec.class_id === selectedClass.id && ec.status !== 'withdrawn'
        );

        if (alreadyEnrolled) {
          throw new Error("Aluno já está matriculado nesta turma ou possui um vínculo ativo/pausado.");
        }

        // Create a new enrollment entry for the student
        const newEnrollmentEntry = {
          class_id: selectedClass.id,
          enrollment_date: new Date().toISOString().split('T')[0],
          status: 'active',
          attendance_rate: 0 // Initialize attendance rate
        };

        const updatedEnrollments = [...(studentToEnroll.enrolled_classes || []), newEnrollmentEntry];

        // Update the student's user profile with the new enrollment
        await base44.entities.User.update(studentToEnroll.id, {
          enrolled_classes: updatedEnrollments
        });

        // Also create a separate Enrollment entity (if still needed for other processes, e.g., for analytics not tied to User)
        const moduleKey = `${selectedClass.explorer_level}-${selectedClass.semester}`;
        if (modulesData[moduleKey]) {
          await base44.entities.Enrollment.create({
            student_email: selectedStudentToEnroll,
            course_id: selectedClass.explorer_level,
            module_id: moduleKey,
            progress: 0,
            started_at: new Date().toISOString()
          });
        }

        setIsEnrollDialogOpen(false);
        setSelectedStudentToEnroll("");
        await loadClassData(selectedClass.id); // Reload class data to show updated student list
      },
      loadingMessage: 'Matriculando aluno...',
      successMessage: 'Aluno matriculado com sucesso!',
      errorMessage: 'Erro ao matricular aluno'
    });
  };

  const handlePauseStudent = async (studentEmail) => {
    if (!selectedClass) return;
    
    await executeWithFeedback({
      asyncFn: async () => {
        const studentToUpdate = students.find(s => s.email === studentEmail);
        if (!studentToUpdate) {
          throw new Error("Aluno não encontrado na lista atual da turma.");
        }

        const enrollmentIndex = studentToUpdate.enrolled_classes?.findIndex(ec => 
          ec.class_id === selectedClass.id
        );

        if (enrollmentIndex === -1 || !studentToUpdate.enrolled_classes) {
          throw new Error("Vínculo de aluno com a turma não encontrado.");
        }

        const currentEnrollment = studentToUpdate.enrolled_classes[enrollmentIndex];
        const newStatus = currentEnrollment.status === 'active' ? 'transferred' : 'active';
        
        const updatedEnrollments = studentToUpdate.enrolled_classes.map((ec, idx) =>
          idx === enrollmentIndex
            ? { ...ec, status: newStatus }
            : ec
        );

        await base44.entities.User.update(studentToUpdate.id, {
          enrolled_classes: updatedEnrollments
        });
        await loadClassData(selectedClass.id);
      },
      loadingMessage: 'Atualizando matrícula do aluno...',
      successMessage: (studentEmail) => `Matrícula do aluno ${studentEmail} atualizada com sucesso!`,
      errorMessage: 'Erro ao pausar/reativar matrícula'
    });
  };

  const handleRemoveStudent = async () => {
    if (!studentToRemove || !selectedClass) return;

    await executeWithFeedback({
      asyncFn: async () => {
        const enrollmentIndex = studentToRemove.enrolled_classes?.findIndex(ec => 
          ec.class_id === selectedClass.id
        );

        if (enrollmentIndex === -1 || !studentToRemove.enrolled_classes) {
          throw new Error("Vínculo de aluno com a turma não encontrado.");
        }
        
        const updatedEnrollments = studentToRemove.enrolled_classes.map((ec, idx) =>
          idx === enrollmentIndex
            ? { ...ec, status: 'withdrawn', withdrawal_date: new Date().toISOString().split('T')[0] } // Mark as withdrawn
            : ec
        );

        await base44.entities.User.update(studentToRemove.id, {
          enrolled_classes: updatedEnrollments
        });

        setStudentToRemove(null);
        await loadClassData(selectedClass.id);
      },
      loadingMessage: `Removendo ${studentToRemove.full_name || studentToRemove.email}...`,
      successMessage: `Aluno ${studentToRemove.full_name || studentToRemove.email} removido com sucesso!`,
      errorMessage: 'Erro ao remover aluno'
    });
  };

  const handleAddTeacher = async () => {
    if (!selectedTeacherToAdd || !selectedClass) {
      showError("Por favor, selecione um professor para adicionar.");
      return;
    }

    await executeWithFeedback({
      asyncFn: async () => {
        const teacherToAdd = allTeachers.find(t => t.email === selectedTeacherToAdd);
        if (!teacherToAdd) {
          throw new Error("Professor não encontrado no sistema.");
        }

        const alreadyAssigned = teacherToAdd.assigned_classes?.some(ac => 
          ac.class_id === selectedClass.id && ac.active === true
        );

        if (alreadyAssigned) {
          throw new Error("Professor já está vinculado ativamente a esta turma!");
        }
        
        // Add new assignment to the teacher's assigned_classes
        const newAssignmentEntry = {
          class_id: selectedClass.id,
          role: selectedTeacherRole,
          active: true
        };

        const updatedAssignments = [...(teacherToAdd.assigned_classes || []), newAssignmentEntry];

        // Update the teacher's user profile with the new assignment
        await base44.entities.User.update(teacherToAdd.id, {
          assigned_classes: updatedAssignments
        });

        setIsTeacherDialogOpen(false);
        setSelectedTeacherToAdd("");
        await loadClassData(selectedClass.id); // Reload class data to show updated teacher list
      },
      loadingMessage: 'Adicionando professor...',
      successMessage: 'Professor adicionado com sucesso!',
      errorMessage: 'Erro ao adicionar professor'
    });
  };

  const handleRemoveTeacher = async (teacherToRemove) => { // teacherToRemove is now a User object
    await executeWithFeedback({
      asyncFn: async () => {
        const assignmentIndex = teacherToRemove.assigned_classes?.findIndex(ac => 
          ac.class_id === selectedClass.id
        );

        if (assignmentIndex === -1 || !teacherToRemove.assigned_classes) {
          throw new Error("Vínculo do professor com a turma não encontrado.");
        }

        const updatedAssignments = teacherToRemove.assigned_classes.map((ac, idx) =>
          idx === assignmentIndex
            ? { ...ac, active: false } // Mark as inactive
            : ac
        );

        await base44.entities.User.update(teacherToRemove.id, {
          assigned_classes: updatedAssignments
        });
        await loadClassData(selectedClass.id);
      },
      loadingMessage: 'Removendo professor...',
      successMessage: 'Professor removido com sucesso!',
      errorMessage: 'Erro ao remover professor'
    });
  };

  // OTIMIZAÇÃO: Calcular stats apenas para alunos ativos e sem fazer requisições adicionais
  const getStudentStats = (studentEmail) => {
    // Versão simplificada sem dados de Enrollment/Assignment/Progress
    // para evitar sobrecarga de API
    return {
      avgProgress: 0,
      completedLessons: 0,
      pendingAssignments: 0,
      lateAssignments: 0,
      daysSinceAccess: null,
      enrollmentsCount: 0
    };
  };

  const getRiskLevel = (stats) => {
    // Versão simplificada
    return { level: 'low', color: 'var(--success)', label: 'Saudável' };
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.full_name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         student.email.toLowerCase().includes(debouncedSearch.toLowerCase());
    return matchesSearch;
  });

  const totalStudents = students.length;
  // Filter students array based on their enrolled_classes status for the selected class
  const activeStudents = students.filter(s =>
    s.enrolled_classes?.some(ec => ec.class_id === selectedClass?.id && ec.status === 'active')
  ).length;
  const atRiskStudents = 0; // Simplificado
  const avgClassProgress = 0; // Simplificado

  const levelInfo = {
    curiosity: { name: 'Curiosity', color: 'var(--info)' },
    discovery: { name: 'Discovery', color: 'var(--success)' },
    pioneer: { name: 'Pioneer', color: 'var(--accent-orange)' },
    challenger: { name: 'Challenger', color: 'var(--error)' }
  };

  const canManage = ['administrador', 'coordenador_pedagogico'].includes(user?.user_type);

  // PASSO 2: Loading skeleton
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

  if (!['administrador', 'coordenador_pedagogico', 'instrutor', 'secretaria'].includes(user?.user_type)) {
    return (
      <div className="p-8 text-center">
        <Users className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--warning)' }} />
        <h2 className="text-2xl font-bold mb-2">Acesso Restrito</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Esta área é exclusiva para educadores e gestores.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Gestão de Turmas
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Gerencie suas turmas e acompanhe os alunos
            </p>
          </div>
          
          {canManage && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Turma
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader className="border-b border-gray-200 pb-4">
                  <DialogTitle className="text-gray-900 text-xl font-bold">Criar Nova Turma</DialogTitle>
                  <DialogDescription className="text-gray-600 text-base">
                    Preencha os dados da nova turma
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-gray-900 font-semibold text-sm">Nome da Turma</Label>
                    <Input
                      placeholder="Ex: Turma A - Curiosity 2025"
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      className="text-gray-900 bg-gray-50 border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-900 font-semibold text-sm">Nível</Label>
                    <Select value={newClassLevel} onValueChange={setNewClassLevel}>
                      <SelectTrigger className="text-gray-900 bg-gray-50 border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="curiosity">Curiosity (6+)</SelectItem>
                        <SelectItem value="discovery">Discovery (9+)</SelectItem>
                        <SelectItem value="pioneer">Pioneer (12+)</SelectItem>
                        <SelectItem value="challenger">Challenger (14+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-900 font-semibold text-sm">Módulo</Label>
                    <Select value={newClassModule} onValueChange={setNewClassModule}>
                      <SelectTrigger className="text-gray-900 bg-gray-50 border-gray-300">
                        <SelectValue placeholder="Selecione o módulo" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {Object.entries(modulesData)
                          .filter(([, data]) => data.level === newClassLevel)
                          .map(([id, data]) => (
                            <SelectItem key={id} value={id}>
                              Semestre {data.semester} - {data.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-900 font-semibold text-sm">Ano Letivo</Label>
                      <Input
                        type="number"
                        value={newClassYear}
                        onChange={(e) => setNewClassYear(parseInt(e.target.value))}
                        className="text-gray-900 bg-gray-50 border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-900 font-semibold text-sm">Máx. Alunos</Label>
                      <Input
                        type="number"
                        value={newClassMaxStudents}
                        onChange={(e) => setNewClassMaxStudents(parseInt(e.target.value))}
                        className="text-gray-900 bg-gray-50 border-gray-300"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter className="border-t border-gray-200 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="border-gray-300">
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleCreateClass}
                    style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
                  >
                    Criar Turma
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {classes.length > 0 ? (
          <>
            <Card className="card-innova border-none shadow-lg">
              <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading">Selecione uma Turma</CardTitle>
                  {canManage && selectedClass && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={openEditDialog}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar Turma
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {classes.map((classItem) => {
                    const levelConfig = levelInfo[classItem.explorer_level];
                    const moduleInfo = modulesData[`${classItem.explorer_level}-${classItem.semester}`];
                    
                    return (
                      <Card
                        key={classItem.id}
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                          selectedClass?.id === classItem.id ? 'ring-2' : ''
                        }`}
                        style={{
                          ...(selectedClass?.id === classItem.id && {
                            borderColor: levelConfig.color
                          })
                        }}
                        onClick={() => handleClassSelect(classItem)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                              {classItem.name}
                            </h3>
                            <Badge style={{ backgroundColor: levelConfig.color, color: 'white' }}>
                              {levelConfig.name}
                            </Badge>
                          </div>
                          {moduleInfo && (
                            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                              Módulo: {moduleInfo.name}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {classItem.year} - S{classItem.semester}
                            </span>
                            <Badge variant="outline">
                              {classItem.status === 'active' ? 'Ativa' : 'Arquivada'}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {selectedClass && (
              <>
                {/* Gestão de Professores */}
                <Card className="card-innova border-none shadow-lg">
                  <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-heading">Professores da Turma</CardTitle>
                      {canManage && (
                        <Dialog open={isTeacherDialogOpen} onOpenChange={setIsTeacherDialogOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <UserPlus className="w-4 h-4 mr-2" />
                              Adicionar Professor
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-white">
                            <DialogHeader className="border-b border-gray-200 pb-4">
                              <DialogTitle className="text-gray-900 text-xl font-bold">Adicionar Professor</DialogTitle>
                              <DialogDescription className="text-gray-600 text-base">
                                Selecione um professor para vincular à turma
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label className="text-gray-900 font-semibold text-sm">Professor</Label>
                                <Select value={selectedTeacherToAdd} onValueChange={setSelectedTeacherToAdd}>
                                  <SelectTrigger className="text-gray-900 bg-gray-50 border-gray-300">
                                    <SelectValue placeholder="Selecione um professor" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white">
                                    {allTeachers
                                      .filter(t => !t.assigned_classes?.some(ac => ac.class_id === selectedClass.id && ac.active))
                                      .map((teacher) => (
                                        <SelectItem key={teacher.id} value={teacher.email}>
                                          {teacher.full_name || teacher.email}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-gray-900 font-semibold text-sm">Função</Label>
                                <Select value={selectedTeacherRole} onValueChange={setSelectedTeacherRole}>
                                  <SelectTrigger className="text-gray-900 bg-gray-50 border-gray-300">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white">
                                    <SelectItem value="titular">Titular</SelectItem>
                                    <SelectItem value="auxiliar">Auxiliar</SelectItem>
                                    <SelectItem value="substituto">Substituto</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <DialogFooter className="border-t border-gray-200 pt-4">
                              <Button variant="outline" onClick={() => setIsTeacherDialogOpen(false)} className="border-gray-300">
                                Cancelar
                              </Button>
                              <Button onClick={handleAddTeacher} style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}>
                                Adicionar
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {classTeachers.length > 0 ? (
                      <div className="space-y-3">
                        {classTeachers.map((teacher) => {
                          const teacherAssignment = teacher.assigned_classes?.find(ac => ac.class_id === selectedClass.id);
                          if (!teacherAssignment || !teacherAssignment.active) return null; // Only show active assignments
                          
                          return (
                            <div key={teacher.id} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
                              <div>
                                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                                  {teacher.full_name || teacher.email}
                                </p>
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                  {teacher.email}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                  {teacherAssignment.role === 'titular' && 'Professor Titular'}
                                  {teacherAssignment.role === 'auxiliar' && 'Professor Auxiliar'}
                                  {teacherAssignment.role === 'substituto' && 'Professor Substituto'}
                                </Badge>
                                {canManage && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleRemoveTeacher(teacher)} // Pass the full teacher (User) object
                                    title="Remover professor"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-6" style={{ color: 'var(--text-secondary)' }}>
                        <Users className="w-12 h-12 mx-auto mb-2 opacity-30" />
                        <p>Nenhum professor vinculado a esta turma</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Stats Cards - Simplificados */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="card-innova border-none">
                    <CardContent className="p-6 text-center">
                      <Users className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--primary-teal)' }} />
                      <div className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                        {totalStudents}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total de Alunos</div>
                    </CardContent>
                  </Card>

                  <Card className="card-innova border-none">
                    <CardContent className="p-6 text-center">
                      <CheckCircle2 className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--success)' }} />
                      <div className="text-3xl font-bold mb-1" style={{ color: 'var(--success)' }}>
                        {activeStudents}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Ativos</div>
                    </CardContent>
                  </Card>

                  <Card className="card-innova border-none">
                    <CardContent className="p-6 text-center">
                      <AlertTriangle className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--error)' }} />
                      <div className="text-3xl font-bold mb-1" style={{ color: 'var(--error)' }}>
                        {atRiskStudents}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Em Risco</div>
                    </CardContent>
                  </Card>

                  <Card className="card-innova border-none">
                    <CardContent className="p-6 text-center">
                      <TrendingUp className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--info)' }} />
                      <div className="text-3xl font-bold mb-1" style={{ color: 'var(--info)' }}>
                        {avgClassProgress}%
                      </div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Progresso Médio</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Search and Actions */}
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                      style={{ color: 'var(--text-secondary)' }} 
                    />
                    <Input
                      placeholder="Buscar aluno por nome ou email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      style={{ backgroundColor: 'var(--background)' }}
                    />
                  </div>
                  {(canManage || user?.user_type === 'secretaria') && (
                    <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
                      <DialogTrigger asChild>
                        <Button style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Matricular Aluno
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white">
                        <DialogHeader className="border-b border-gray-200 pb-4">
                          <DialogTitle className="text-gray-900 text-xl font-bold">Matricular Aluno na Turma</DialogTitle>
                          <DialogDescription className="text-gray-600 text-base">
                            Selecione um aluno para matricular em {selectedClass.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label className="text-gray-900 font-semibold text-sm">Aluno</Label>
                            <Select value={selectedStudentToEnroll} onValueChange={setSelectedStudentToEnroll}>
                              <SelectTrigger className="text-gray-900 bg-gray-50 border-gray-300">
                                <SelectValue placeholder="Selecione um aluno" />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                {allStudents
                                  .filter(s => !s.enrolled_classes?.some(ec => 
                                    ec.class_id === selectedClass.id && ec.status !== 'withdrawn'
                                  ))
                                  .map((student) => (
                                    <SelectItem key={student.id} value={student.email}>
                                      {student.full_name || student.email}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter className="border-t border-gray-200 pt-4">
                          <Button variant="outline" onClick={() => setIsEnrollDialogOpen(false)} className="border-gray-300">
                            Cancelar
                          </Button>
                          <Button 
                            onClick={handleEnrollStudent}
                            style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
                          >
                            Matricular
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                {/* Students List */}
                <Card className="card-innova border-none shadow-lg">
                  <CardHeader style={{ backgroundColor: 'var(--neutral-light)', borderBottom: '1px solid var(--neutral-medium)' }}>
                    <CardTitle className="font-heading">Alunos da Turma</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {filteredStudents.map((student) => {
                        // Find the specific enrollment for the selected class on the student object
                        const studentEnrollment = student.enrolled_classes?.find(ec => ec.class_id === selectedClass.id);
                        const studentStatus = studentEnrollment?.status;
                        
                        return (
                          <div
                            key={student.id}
                            className="p-4 rounded-xl border hover:shadow-md transition-all"
                            style={{ 
                              backgroundColor: 'var(--background)',
                              borderColor: 'var(--neutral-medium)',
                              borderWidth: '1px'
                            }}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                                    {student.full_name || student.email}
                                  </h4>
                                  {studentStatus && (
                                    <Badge variant="outline">
                                      {studentStatus === 'active' ? 'Ativo' : studentStatus === 'transferred' ? 'Pausado' : 'Retirado'}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                  {student.email}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Mail className="w-4 h-4 mr-2" />
                                  Contatar
                                </Button>
                                {(canManage || user?.user_type === 'secretaria') && studentStatus !== 'withdrawn' && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handlePauseStudent(student.email)}
                                      title={studentStatus === 'active' ? "Pausar matrícula" : "Reativar matrícula"}
                                    >
                                      {studentStatus === 'active' ? (
                                        <Pause className="w-4 h-4" />
                                      ) : (
                                        <Play className="w-4 h-4" />
                                      )}
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => setStudentToRemove(student)} // Pass the full student (User) object
                                      title="Remover da turma"
                                    >
                                      <UserMinus className="w-4 h-4 text-red-500" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {filteredStudents.length === 0 && (
                      <div className="text-center py-12">
                        <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p style={{ color: 'var(--text-secondary)' }}>
                          Nenhum aluno encontrado nesta turma
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="bg-white">
                <DialogHeader className="border-b border-gray-200 pb-4">
                  <DialogTitle className="text-gray-900 text-xl font-bold">Editar Turma</DialogTitle>
                  <DialogDescription className="text-gray-600 text-base">
                    Atualize as informações da turma
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-gray-900 font-semibold text-sm">Nome da Turma</Label>
                    <Input
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      className="text-gray-900 bg-gray-50 border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-900 font-semibold text-sm">Nível</Label>
                    <Select value={newClassLevel} onValueChange={setNewClassLevel}>
                      <SelectTrigger className="text-gray-900 bg-gray-50 border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="curiosity">Curiosity (6+)</SelectItem>
                        <SelectItem value="discovery">Discovery (9+)</SelectItem>
                        <SelectItem value="pioneer">Pioneer (12+)</SelectItem>
                        <SelectItem value="challenger">Challenger (14+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-900 font-semibold text-sm">Ano Letivo</Label>
                      <Input
                        type="number"
                        value={newClassYear}
                        onChange={(e) => setNewClassYear(parseInt(e.target.value))}
                        className="text-gray-900 bg-gray-50 border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-900 font-semibold text-sm">Semestre</Label>
                      <Select value={newClassSemester.toString()} onValueChange={(v) => setNewClassSemester(parseInt(v))}>
                        <SelectTrigger className="text-gray-900 bg-gray-50 border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="1">1º Semestre</SelectItem>
                          <SelectItem value="2">2º Semestre</SelectItem>
                          <SelectItem value="3">3º Semestre</SelectItem>
                          <SelectItem value="4">4º Semestre</SelectItem>
                          <SelectItem value="5">5º Semestre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-900 font-semibold text-sm">Máx. Alunos</Label>
                    <Input
                      type="number"
                      value={newClassMaxStudents}
                      onChange={(e) => setNewClassMaxStudents(parseInt(e.target.value))}
                      className="text-gray-900 bg-gray-50 border-gray-300"
                    />
                  </div>
                </div>
                <DialogFooter className="border-t border-gray-200 pt-4">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-gray-300">
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleEditClass}
                    style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
                  >
                    Salvar Alterações
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <AlertDialog open={!!studentToRemove} onOpenChange={() => setStudentToRemove(null)}>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader className="border-b border-gray-200 pb-4">
                  <AlertDialogTitle className="text-gray-900 text-xl font-bold">Remover Aluno da Turma</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-600 text-base">
                    Tem certeza que deseja remover {studentToRemove?.full_name || studentToRemove?.email} desta turma?
                    Esta ação marcará o aluno como "retirado" mas manterá seu histórico.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="border-t border-gray-200 pt-4">
                  <AlertDialogCancel className="border-gray-300">Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleRemoveStudent} style={{ backgroundColor: 'var(--error)', color: 'white' }}>
                    Remover
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : (
          <Card className="card-innova border-none">
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Nenhuma Turma Encontrada
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                {canManage
                  ? 'Crie sua primeira turma para começar'
                  : 'Você ainda não está associado a nenhuma turma'}
              </p>
              {canManage && (
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeira Turma
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
