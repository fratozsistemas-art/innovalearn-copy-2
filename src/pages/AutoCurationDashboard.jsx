import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  Sparkles,
  Globe,
  BookOpen,
  Filter
} from "lucide-react";
import { runAutoCurationPipeline } from "../components/curadoria/AutoCurationPipeline";
import { useCurrentUser } from "@/components/hooks/useUser";
import CuratorReviewPanel from "../components/curadoria/CuratorReviewPanel";

export default function AutoCurationDashboard() {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();
  
  const [isRunning, setIsRunning] = useState(false);
  const [pipelineResult, setPipelineResult] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [filterStatus, setFilterStatus] = useState('pending_review');

  // Buscar recursos auto-descobertos
  const { data: autoResources = [] } = useQuery({
    queryKey: ['autoResources', filterStatus],
    queryFn: async () => {
      const filters = { auto_discovered: true };
      
      if (filterStatus === 'pending_review') {
        filters.requires_human_review = true;
        filters.curator_approved = false;
      } else if (filterStatus === 'auto_approved') {
        filters.curator_approved = true;
        filters.requires_human_review = false;
      } else if (filterStatus === 'rejected') {
        filters.rejection_reason = { $ne: null };
      }

      return await base44.entities.ExternalResource.filter(filters, '-created_date', 100);
    },
    staleTime: 1000 * 60 * 5
  });

  // Mutation para aprovar recurso
  const approveMutation = useMutation({
    mutationFn: async ({ resourceId, feedback }) => {
      return await base44.entities.ExternalResource.update(resourceId, {
        curator_approved: true,
        requires_human_review: false,
        curator_feedback: feedback,
        curator_email: user.email,
        curator_approval_date: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['autoResources'] });
      setSelectedResource(null);
    }
  });

  // Mutation para rejeitar recurso
  const rejectMutation = useMutation({
    mutationFn: async ({ resourceId, feedback }) => {
      return await base44.entities.ExternalResource.update(resourceId, {
        curator_approved: false,
        requires_human_review: false,
        rejection_reason: feedback || 'Rejeitado pelo curador',
        curator_email: user.email,
        curator_rejection_date: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['autoResources'] });
      setSelectedResource(null);
    }
  });

  const handleRunPipeline = async () => {
    setIsRunning(true);
    setPipelineResult(null);
    
    try {
      const result = await runAutoCurationPipeline();
      setPipelineResult(result);
      queryClient.invalidateQueries({ queryKey: ['autoResources'] });
    } catch (error) {
      console.error('Pipeline error:', error);
      setPipelineResult({ success: false, error: error.message });
    }
    
    setIsRunning(false);
  };

  const stats = {
    total: autoResources.length,
    avgScore: autoResources.length > 0 
      ? Math.round(autoResources.reduce((sum, r) => sum + (r.auto_quality_score || 0), 0) / autoResources.length)
      : 0,
    highQuality: autoResources.filter(r => r.auto_quality_score >= 80).length,
    needsReview: autoResources.filter(r => r.requires_human_review).length
  };

  if (!['administrador', 'coordenador_pedagogico'].includes(user?.user_type)) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--warning)' }} />
        <h2 className="text-2xl font-bold mb-2">Acesso Restrito</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Esta funcionalidade é exclusiva para administradores e coordenadores pedagógicos.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">
              🤖 Curadoria Automática Inteligente
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Sistema automatizado de descoberta, avaliação e curadoria de recursos educacionais
            </p>
          </div>
          <Button 
            onClick={handleRunPipeline}
            disabled={isRunning}
            className="btn-innova-primary"
          >
            {isProcessing ? (
              <>
                <Clock className="w-5 h-5 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Executar Pipeline
              </>
            )}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-innova">
            <CardContent className="p-6 text-center">
              <Globe className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--primary-teal)' }} />
              <div className="text-3xl font-bold mb-1">{stats.total}</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Total Descobertos
              </div>
            </CardContent>
          </Card>

          <Card className="card-innova">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--success)' }} />
              <div className="text-3xl font-bold mb-1">{stats.avgScore}</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Score Médio
              </div>
            </CardContent>
          </Card>

          <Card className="card-innova">
            <CardContent className="p-6 text-center">
              <Sparkles className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--primary-purple)' }} />
              <div className="text-3xl font-bold mb-1">{stats.highQuality}</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Alta Qualidade (≥80)
              </div>
            </CardContent>
          </Card>

          <Card className="card-innova">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--warning)' }} />
              <div className="text-3xl font-bold mb-1">{stats.needsReview}</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Aguardando Revisão
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resultado do Pipeline */}
        {pipelineResult && (
          <Card className="card-innova">
            <CardHeader>
              <CardTitle>📋 Resultado da Última Execução</CardTitle>
            </CardHeader>
            <CardContent>
              {pipelineResult.success ? (
                <div className="space-y-2">
                  <p className="text-success font-semibold">✅ Pipeline executado com sucesso!</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <div className="text-2xl font-bold">{pipelineResult.discovered}</div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Descobertos</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-success">{pipelineResult.auto_approved}</div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Auto-aprovados</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-warning">{pipelineResult.need_review}</div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Precisam Revisão</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-danger">{pipelineResult.rejected}</div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Rejeitados</div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-danger">❌ Erro: {pipelineResult.error}</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tabs de Filtro */}
        <Tabs value={filterStatus} onValueChange={setFilterStatus}>
          <TabsList className="w-full">
            <TabsTrigger value="pending_review" className="flex-1">
              <Clock className="w-4 h-4 mr-2" />
              Aguardando Revisão ({autoResources.filter(r => r.requires_human_review).length})
            </TabsTrigger>
            <TabsTrigger value="auto_approved" className="flex-1">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Auto-Aprovados ({autoResources.filter(r => r.curator_approved && !r.requires_human_review).length})
            </TabsTrigger>
            <TabsTrigger value="all" className="flex-1">
              <Filter className="w-4 h-4 mr-2" />
              Todos ({autoResources.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filterStatus} className="mt-6">
            {selectedResource ? (
              <CuratorReviewPanel
                resource={selectedResource}
                onApprove={(id, feedback) => approveMutation.mutate({ resourceId: id, feedback })}
                onReject={(id, feedback) => rejectMutation.mutate({ resourceId: id, feedback })}
                onRequestChanges={() => setSelectedResource(null)}
              />
            ) : (
              <div className="grid gap-4">
                {autoResources.length === 0 ? (
                  <Card className="card-innova">
                    <CardContent className="p-12 text-center">
                      <BookOpen className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
                      <p style={{ color: 'var(--text-secondary)' }}>
                        Nenhum recurso encontrado com este filtro.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  autoResources.map(resource => (
                    <Card 
                      key={resource.id} 
                      className="card-innova cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => setSelectedResource(resource)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{resource.title}</h3>
                            <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                              {resource.description?.substring(0, 150)}...
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline">{resource.type}</Badge>
                              <Badge variant="outline">{resource.source}</Badge>
                              {resource.requires_human_review && (
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  Revisão Necessária
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div 
                              className="text-3xl font-bold mb-1"
                              style={{ 
                                color: resource.auto_quality_score >= 80 ? 'var(--success)' : 
                                       resource.auto_quality_score >= 60 ? 'var(--warning)' : 'var(--danger)' 
                              }}
                            >
                              {resource.auto_quality_score}
                            </div>
                            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                              Score
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}