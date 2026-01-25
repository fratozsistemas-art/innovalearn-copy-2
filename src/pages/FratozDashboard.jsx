
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Building2,
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Activity,
  Target,
  Award,
  Clock,
  Globe,
  Shield,
  Zap
} from "lucide-react";
import { useCurrentUser } from "@/components/hooks/useUser";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

/**
 * Fratoz Dashboard - Visão Executiva Multi-Tenant
 * 
 * Dashboard B2B para gestão de todas escolas clientes
 */

const HEALTH_COLORS = {
  critical: '#EF4444',
  high: '#F97316',
  medium: '#F59E0B',
  low: '#10B981'
};

const TIER_BENEFITS = {
  basic: { name: 'Basic', color: '#94A3B8', features: ['IA Assistant', 'Analytics Básico'] },
  professional: { name: 'Professional', color: '#3B82F6', features: ['+ Analytics Avançado', '+ Conteúdo Custom'] },
  enterprise: { name: 'Enterprise', color: '#8B5CF6', features: ['+ White-Label', '+ API', '+ SSO', '+ Suporte Prioritário'] }
};

export default function FratozDashboardPage() {
  const { data: user } = useCurrentUser();
  const navigate = useNavigate();

  // Verificar permissão
  if (user && user.user_type !== 'administrador') {
    return (
      <div className="p-8 text-center">
        <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
        <h2 className="text-2xl font-bold mb-2">Acesso Restrito</h2>
        <p className="text-gray-600">Apenas administradores Fratoz podem acessar este dashboard.</p>
      </div>
    );
  }

  // Buscar dados
  const { data: tenants = [], isLoading: tenantsLoading } = useQuery({
    queryKey: ['tenants'],
    queryFn: () => base44.entities.Tenant.list(),
    refetchInterval: 60000 // Refresh a cada minuto
  });

  const { data: usageLogs = [] } = useQuery({
    queryKey: ['tenantUsage', 'all'],
    queryFn: () => base44.entities.TenantUsageLog.list(),
  });

  const { data: benchmarks = [] } = useQuery({
    queryKey: ['tenantBenchmarks'],
    queryFn: () => base44.entities.TenantBenchmark.list()
  });

  // Calcular métricas agregadas
  const totalTenants = tenants.length;
  const activeTenants = tenants.filter(t => t.status === 'active').length;
  const trialTenants = tenants.filter(t => t.status === 'trial').length;
  const churnRisk = tenants.filter(t => {
    const risk = t.health_metrics?.churn_risk;
    return risk === 'high' || risk === 'critical';
  }).length;

  const totalStudents = tenants.reduce((sum, t) => {
    return sum + (t.subscription_details?.current_students || 0);
  }, 0);
  
  const totalRevenue = tenants.reduce((sum, t) => {
    const price = t.subscription_details?.price_per_student || 0;
    const students = t.subscription_details?.current_students || 0;
    return sum + (price * students);
  }, 0);

  const avgHealthScore = tenants.length > 0
    ? tenants.reduce((sum, t) => sum + (t.health_metrics?.health_score || 0), 0) / tenants.length
    : 0;

  const avgNPS = tenants.length > 0
    ? tenants.reduce((sum, t) => sum + (t.health_metrics?.nps_score || 0), 0) / tenants.length
    : 0;

  if (tenantsLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
            style={{ borderColor: 'var(--primary-teal)' }}
          />
          <p style={{ color: 'var(--text-secondary)' }}>Carregando dashboard Fratoz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-heading font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Fratoz Command Center
            </h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Gestão Multi-Tenant B2B
            </p>
          </div>
          <Button 
            onClick={() => navigate(createPageUrl("TenantManagement"))}
            style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
          >
            <Building2 className="w-4 h-4 mr-2" />
            Gerenciar Tenants
          </Button>
        </div>

        {/* KPIs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4" style={{ borderColor: 'var(--primary-teal)' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Building2 className="w-8 h-8" style={{ color: 'var(--primary-teal)' }} />
                <Badge style={{ backgroundColor: 'var(--success)', color: 'white' }}>
                  +{trialTenants} trial
                </Badge>
              </div>
              <div className="text-3xl font-bold mb-1">{totalTenants}</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Escolas Clientes
              </div>
              <div className="text-xs mt-2" style={{ color: 'var(--success)' }}>
                {activeTenants} ativas • {trialTenants} em trial
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4" style={{ borderColor: 'var(--accent-yellow)' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8" style={{ color: 'var(--accent-yellow)' }} />
                <TrendingUp className="w-5 h-5" style={{ color: 'var(--success)' }} />
              </div>
              <div className="text-3xl font-bold mb-1">{totalStudents.toLocaleString('pt-BR')}</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Alunos Ativos
              </div>
              <div className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                Across all tenants
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4" style={{ borderColor: 'var(--success)' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8" style={{ color: 'var(--success)' }} />
                <Badge style={{ backgroundColor: 'var(--success)', color: 'white' }}>
                  MRR
                </Badge>
              </div>
              <div className="text-3xl font-bold mb-1">
                R$ {(totalRevenue / 1000).toFixed(1)}k
              </div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Receita Mensal
              </div>
              <div className="text-xs mt-2" style={{ color: 'var(--success)' }}>
                +12% vs. mês anterior
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4" style={{ borderColor: churnRisk > 0 ? 'var(--error)' : 'var(--success)' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-8 h-8" style={{ color: churnRisk > 0 ? 'var(--error)' : 'var(--success)' }} />
                {churnRisk > 0 && (
                  <Badge style={{ backgroundColor: 'var(--error)', color: 'white' }}>
                    Atenção
                  </Badge>
                )}
              </div>
              <div className="text-3xl font-bold mb-1">{churnRisk}</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Risco de Churn
              </div>
              <div className="text-xs mt-2" style={{ color: churnRisk > 0 ? 'var(--error)' : 'var(--success)' }}>
                {churnRisk === 0 ? 'Todos clientes saudáveis ✅' : 'Requer intervenção imediata'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Health Overview */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
                Health Score Médio
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl font-bold" style={{ color: avgHealthScore >= 70 ? 'var(--success)' : avgHealthScore >= 40 ? 'var(--warning)' : 'var(--error)' }}>
                  {avgHealthScore.toFixed(0)}
                </div>
                <div className="flex-1">
                  <Progress value={avgHealthScore} className="h-3 mb-2" />
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {avgHealthScore >= 70 ? 'Excelente saúde da carteira' : avgHealthScore >= 40 ? 'Atenção necessária' : 'Risco crítico'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
                  <div className="text-2xl font-bold" style={{ color: 'var(--success)' }}>
                    {tenants.filter(t => (t.health_metrics?.health_score || 0) >= 70).length}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Saudáveis (≥70)</div>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
                  <div className="text-2xl font-bold" style={{ color: 'var(--error)' }}>
                    {tenants.filter(t => (t.health_metrics?.health_score || 0) < 40).length}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Críticos (<40)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" style={{ color: 'var(--accent-yellow)' }} />
                NPS Médio
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl font-bold" style={{ color: avgNPS >= 50 ? 'var(--success)' : avgNPS >= 0 ? 'var(--warning)' : 'var(--error)' }}>
                  {avgNPS.toFixed(0)}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold mb-2">
                    {avgNPS >= 50 ? '🎉 Excelente!' : avgNPS >= 0 ? '😐 Pode Melhorar' : '😞 Ação Urgente'}
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Net Promoter Score (Satisfação dos Clientes)
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-secondary)' }}>Promotores (9-10)</span>
                  <span className="font-semibold" style={{ color: 'var(--success)' }}>
                    {tenants.filter(t => (t.health_metrics?.nps_score || 0) >= 9).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-secondary)' }}>Neutros (7-8)</span>
                  <span className="font-semibold" style={{ color: 'var(--warning)' }}>
                    {tenants.filter(t => {
                      const nps = t.health_metrics?.nps_score || 0;
                      return nps >= 7 && nps < 9;
                    }).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-secondary)' }}>Detratores (0-6)</span>
                  <span className="font-semibold" style={{ color: 'var(--error)' }}>
                    {tenants.filter(t => (t.health_metrics?.nps_score || 0) < 7).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Tenants */}
        <Card>
          <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
              Todas as Escolas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {tenants.map((tenant) => {
                const healthScore = tenant.health_metrics?.health_score || 0;
                const churnRiskLevel = tenant.health_metrics?.churn_risk || 'low';
                const tier = TIER_BENEFITS[tenant.subscription_tier] || TIER_BENEFITS.basic;

                return (
                  <div
                    key={tenant.id}
                    className="p-4 rounded-lg border-2 hover:shadow-md transition-all cursor-pointer"
                    style={{ 
                      borderColor: HEALTH_COLORS[churnRiskLevel],
                      backgroundColor: 'white'
                    }}
                    onClick={() => navigate(createPageUrl("TenantDashboard") + `?id=${tenant.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold text-lg">{tenant.tenant_name}</h4>
                          <Badge style={{ backgroundColor: tier.color, color: 'white' }}>
                            {tier.name}
                          </Badge>
                          {tenant.white_label_enabled && (
                            <Badge variant="outline">
                              <Globe className="w-3 h-3 mr-1" />
                              White-Label
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span style={{ color: 'var(--text-secondary)' }}>Alunos: </span>
                            <span className="font-semibold">{tenant.subscription_details?.current_students || 0}</span>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-secondary)' }}>MRR: </span>
                            <span className="font-semibold">
                              R$ {((tenant.subscription_details?.price_per_student || 0) * (tenant.subscription_details?.current_students || 0)).toFixed(0)}
                            </span>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-secondary)' }}>Status: </span>
                            <Badge 
                              variant="outline"
                              style={{ 
                                borderColor: tenant.status === 'active' ? 'var(--success)' : 'var(--warning)',
                                color: tenant.status === 'active' ? 'var(--success)' : 'var(--warning)'
                              }}
                            >
                              {tenant.status}
                            </Badge>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-secondary)' }}>Health: </span>
                            <span className="font-semibold" style={{ color: healthScore >= 70 ? 'var(--success)' : healthScore >= 40 ? 'var(--warning)' : 'var(--error)' }}>
                              {healthScore.toFixed(0)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge 
                          style={{ 
                            backgroundColor: HEALTH_COLORS[churnRiskLevel],
                            color: 'white'
                          }}
                        >
                          {churnRiskLevel === 'low' && 'Baixo Risco'}
                          {churnRiskLevel === 'medium' && 'Risco Moderado'}
                          {churnRiskLevel === 'high' && 'Alto Risco'}
                          {churnRiskLevel === 'critical' && '🚨 Crítico'}
                        </Badge>
                        <Button size="sm" variant="outline">
                          Ver Detalhes →
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
