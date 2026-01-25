
import React, { useState, useEffect } from "react";
import { ExternalResource, Module, Lesson } from "@/entities/all";
import { User } from "@/entities/User";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Plus,
  Download
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { useDebounce } from "@/components/hooks/useDebounce";
import { PageLoadingSkeleton } from "@/components/common/LoadingSkeleton";

export default function ResourcesDashboardPage() {
  const [user, setUser] = useState(null);
  const [allResources, setAllResources] = useState([]); // Renamed from 'resources'
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  // removed [filteredResources, setFilteredResources] as it will be a derived value
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [approvalFilter, setApprovalFilter] = useState("all");
  const [selectedType, setSelectedType] = useState("all"); // New state for type filter
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    source: "outros",
    type: "artigo",
    relevance_score: 2,
    target_level: "curiosity",
    module_id: "",
    lesson_id: "",
    primary_vark: "visual",
    language: "pt-BR",
    difficulty: "beginner",
    estimated_time_minutes: 30,
    description: "",
    curator_approved: false
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);

      const [resourcesData, modulesData, lessonsData] = await Promise.all([
        ExternalResource.list(),
        Module.list(),
        Lesson.list()
      ]);

      setAllResources(resourcesData); // Updated to setAllResources
      setModules(modulesData);
      setLessons(lessonsData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  // PASSO 5: Debounce na busca
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Removed applyFilters useCallback and its useEffect as filtering is now derived.

  // Derived filteredResources based on all filters
  const filteredResources = allResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    // The outline mentioned 'selectedCategory', but there's no 'category' field in resource or UI.
    // Assuming 'sourceFilter' covers category-like filtering, or it was a placeholder not to be implemented.
    // Keeping existing filters and adding 'matchesType'.
    const matchesLevel = levelFilter === "all" || resource.target_level === levelFilter;
    const matchesSource = sourceFilter === "all" || resource.source === sourceFilter;
    const matchesApproval = approvalFilter === "all" ||
                            (approvalFilter === "approved" && resource.curator_approved === true) ||
                            (approvalFilter === "pending" && resource.curator_approved === false);

    return matchesSearch && matchesType && matchesLevel && matchesSource && matchesApproval;
  });

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = () => {
    setEditingResource(null);
    setFormData({
      title: "",
      url: "",
      source: "outros",
      type: "artigo",
      relevance_score: 2,
      target_level: "curiosity",
      module_id: "",
      lesson_id: "",
      primary_vark: "visual",
      language: "pt-BR",
      difficulty: "beginner",
      estimated_time_minutes: 30,
      description: "",
      curator_approved: false
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title || "",
      url: resource.url || "",
      source: resource.source || "outros",
      type: resource.type || "artigo",
      relevance_score: resource.relevance_score || 2,
      target_level: resource.target_level || "curiosity",
      module_id: resource.module_id || "",
      lesson_id: resource.lesson_id || "",
      primary_vark: resource.primary_vark || "visual",
      language: resource.language || "pt-BR",
      difficulty: resource.difficulty || "beginner",
      estimated_time_minutes: resource.estimated_time_minutes || 30,
      description: resource.description || "",
      curator_approved: resource.curator_approved || false
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const dataToSave = {
        ...formData,
        // Ensure module_id and lesson_id are null if empty string
        module_id: formData.module_id || null,
        lesson_id: formData.lesson_id || null,
        vark_alignment: [formData.primary_vark],
        added_by: user.email,
        last_verified: new Date().toISOString()
      };

      if (editingResource) {
        await ExternalResource.update(editingResource.id, dataToSave);
      } else {
        await ExternalResource.create(dataToSave);
      }

      setIsDialogOpen(false);
      await loadData();
    } catch (error) {
      console.error("Error saving resource:", error);
      alert(`Erro ao salvar recurso: ${error.message || 'Verifique o console para mais detalhes.'}`);
    }
  };

  const handleDelete = async (resourceId) => {
    if (confirm("Tem certeza que deseja deletar este recurso?")) {
      try {
        await ExternalResource.delete(resourceId);
        await loadData();
      } catch (error) {
        console.error("Error deleting resource:", error);
        alert(`Erro ao deletar recurso: ${error.message || 'Verifique o console para mais detalhes.'}`);
      }
    }
  };

  const toggleApproval = async (resource) => {
    try {
      await ExternalResource.update(resource.id, {
        curator_approved: !resource.curator_approved
      });
      await loadData();
    } catch (error) {
      console.error("Error updating approval:", error);
      alert(`Erro ao atualizar aprovação: ${error.message || 'Verifique o console para mais detalhes.'}`);
    }
  };

  const getModuleName = (moduleId) => {
    const module = modules.find(m => m.id === moduleId);
    return module ? module.title : "-";
  };

  const getLessonName = (lessonId) => {
    const lesson = lessons.find(l => l.id === lessonId);
    return lesson ? lesson.title : "-";
  };

  const exportToCSV = () => {
    const headers = ["Título", "URL", "Fonte", "Tipo", "Nível", "Módulo", "Lição", "VARK", "Idioma", "Dificuldade", "Tempo (min)", "Aprovado", "Descrição"];
    const rows = filteredResources.map(r => [
      `"${r.title.replace(/"/g, '""')}"`, // Handle commas and quotes in title
      r.url,
      r.source,
      r.type,
      r.target_level,
      getModuleName(r.module_id),
      getLessonName(r.lesson_id),
      r.primary_vark || "-",
      r.language || "-",
      r.difficulty || "-",
      r.estimated_time_minutes || "-",
      r.curator_approved ? "Sim" : "Não",
      `"${r.description?.replace(/"/g, '""') || ''}"` // Handle commas and quotes in description
    ]);

    const csv = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recursos_externos.csv";
    document.body.appendChild(a); // Required for Firefox
    a.click();
    document.body.removeChild(a); // Clean up
    window.URL.revokeObjectURL(url); // Release object URL
  };

  // PASSO 2: Loading skeleton
  if (loading) {
    return <PageLoadingSkeleton />;
  }

  if (!['administrador', 'coordenador_pedagogico', 'instrutor'].includes(user?.user_type)) {
    return (
      <div className="p-8 text-center">
        <p>Acesso restrito a administradores, coordenadores e instrutores.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-full mx-auto space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold" style={{ color: 'var(--text-primary)' }}>
              Dashboard de Recursos Externos
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Gerencie os recursos educacionais curados
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportToCSV} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
            <Button onClick={handleCreate} style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Recurso
            </Button>
          </div>
        </div>

        <Card className="card-innova border-none shadow-lg">
          <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4"> {/* Adjusted grid-cols for new filter */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Níveis</SelectItem>
                  <SelectItem value="curiosity">Curiosity</SelectItem>
                  <SelectItem value="discovery">Discovery</SelectItem>
                  <SelectItem value="pioneer">Pioneer</SelectItem>
                  <SelectItem value="challenger">Challenger</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Fonte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Fontes</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="khan_academy">Khan Academy</SelectItem>
                  <SelectItem value="code_org">Code.org</SelectItem>
                  <SelectItem value="scratch">Scratch</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>

              {/* New Type Filter */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="tutorial">Tutorial</SelectItem>
                  <SelectItem value="projeto">Projeto</SelectItem>
                  <SelectItem value="artigo">Artigo</SelectItem>
                  <SelectItem value="modelo_3d">Modelo 3D</SelectItem>
                </SelectContent>
              </Select>

              <Select value={approvalFilter} onValueChange={setApprovalFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="approved">Aprovados</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4 flex gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span>Total: {allResources.length}</span> {/* Updated to allResources */}
              <span>Filtrados: {filteredResources.length}</span>
              <span>Aprovados: {allResources.filter(r => r.curator_approved).length}</span> {/* Updated to allResources */}
            </div>
          </CardContent>
        </Card>

        <Card className="card-innova border-none shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Fonte</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Nível</TableHead>
                    <TableHead>Módulo</TableHead>
                    <TableHead>Lição</TableHead>
                    <TableHead>VARK</TableHead>
                    <TableHead>Idioma</TableHead>
                    <TableHead>Dificuldade</TableHead>
                    <TableHead>Tempo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResources.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate">{resource.title}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{resource.source}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{resource.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}>
                          {resource.target_level}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{getModuleName(resource.module_id)}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{getLessonName(resource.lesson_id)}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{resource.primary_vark || "-"}</Badge>
                      </TableCell>
                      <TableCell>{resource.language || "-"}</TableCell>
                      <TableCell>{resource.difficulty || "-"}</TableCell>
                      <TableCell>{resource.estimated_time_minutes || "-"}min</TableCell>
                      <TableCell>
                        <button
                          onClick={() => toggleApproval(resource)}
                          className="flex items-center gap-1"
                        >
                          {resource.curator_approved ? (
                            <Badge className="bg-green-100 text-green-800 border-0">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Aprovado
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800 border-0">
                              <XCircle className="w-3 h-3 mr-1" />
                              Pendente
                            </Badge>
                          )}
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(resource.url, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(resource)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(resource.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingResource ? "Editar Recurso" : "Adicionar Novo Recurso"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do recurso educacional externo
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div>
                <Label>Título *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: Introdução a Machine Learning"
                  required
                />
              </div>

              <div>
                <Label>URL *</Label>
                <Input
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  placeholder="https://..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Fonte</Label>
                  <Select value={formData.source} onValueChange={(value) => setFormData({...formData, source: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="khan_academy">Khan Academy</SelectItem>
                      <SelectItem value="code_org">Code.org</SelectItem>
                      <SelectItem value="scratch">Scratch</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tipo</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Vídeo</SelectItem>
                      <SelectItem value="tutorial">Tutorial</SelectItem>
                      <SelectItem value="projeto">Projeto</SelectItem>
                      <SelectItem value="artigo">Artigo</SelectItem>
                      <SelectItem value="modelo_3d">Modelo 3D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Nível</Label>
                  <Select value={formData.target_level} onValueChange={(value) => setFormData({...formData, target_level: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="curiosity">Curiosity</SelectItem>
                      <SelectItem value="discovery">Discovery</SelectItem>
                      <SelectItem value="pioneer">Pioneer</SelectItem>
                      <SelectItem value="challenger">Challenger</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Relevância</Label>
                  <Select value={String(formData.relevance_score)} onValueChange={(value) => setFormData({...formData, relevance_score: Number(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Complementar</SelectItem>
                      <SelectItem value="2">2 - Recomendado</SelectItem>
                      <SelectItem value="3">3 - Essencial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tempo (min)</Label>
                  <Input
                    type="number"
                    value={formData.estimated_time_minutes}
                    onChange={(e) => setFormData({...formData, estimated_time_minutes: Number(e.target.value)})}
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Módulo (opcional)</Label>
                  <Select
                    value={formData.module_id || ""} // Use empty string for Select to correctly display "Nenhum"
                    onValueChange={(value) => setFormData({...formData, module_id: value || null, lesson_id: ""})} // Reset lesson when module changes
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={null}>Nenhum</SelectItem> {/* Empty string for "Nenhum" */}
                      {modules.map(m => (
                        <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Lição (opcional)</Label>
                  <Select
                    value={formData.lesson_id || ""} // Use empty string for Select to correctly display "Nenhuma"
                    onValueChange={(value) => setFormData({...formData, lesson_id: value || null})}
                    disabled={!formData.module_id} // Disable if no module is selected
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={null}>Nenhuma</SelectItem> {/* Empty string for "Nenhuma" */}
                      {lessons.filter(l => l.module_id === formData.module_id).map(l => ( // Filter lessons by selected module
                        <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>VARK Primário</Label>
                  <Select value={formData.primary_vark} onValueChange={(value) => setFormData({...formData, primary_vark: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visual">Visual</SelectItem>
                      <SelectItem value="auditory">Auditivo</SelectItem>
                      <SelectItem value="read_write">Leitura/Escrita</SelectItem>
                      <SelectItem value="kinesthetic">Cinestésico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Idioma</Label>
                  <Select value={formData.language} onValueChange={(value) => setFormData({...formData, language: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português</SelectItem>
                      <SelectItem value="en">Inglês</SelectItem>
                      <SelectItem value="es">Espanhol</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Dificuldade</Label>
                  <Select value={formData.difficulty} onValueChange={(value) => setFormData({...formData, difficulty: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Iniciante</SelectItem>
                      <SelectItem value="intermediate">Intermediário</SelectItem>
                      <SelectItem value="advanced">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Descrição</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descreva brevemente o recurso..."
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="curator_approved"
                  checked={formData.curator_approved}
                  onChange={(e) => setFormData({...formData, curator_approved: e.target.checked})}
                  className="w-4 h-4 text-primary-teal focus:ring-primary-teal border-gray-300 rounded"
                />
                <Label htmlFor="curator_approved">Aprovado pelo curador</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}>
                {editingResource ? "Salvar Alterações" : "Criar Recurso"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
