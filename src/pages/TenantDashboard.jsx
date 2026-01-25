
import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Users,
  BarChart3,
  Award,
  Activity,
  Settings,
  CreditCard,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { useCurrentUser } from "@/components/hooks/useUser";

/**
 * Dashboard Individual de Tenant (Escola)
 * 
 * Visão executiva institucional para cada escola cliente
 */

export default function TenantDashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: user } = useCurrentUser();
  const urlParams = new URLSearchParams(location.search);
  const tenantId = urlParams.get('id');

  const { data: tenant, isLoading } = useQuery({
    queryKey: ['tenant', tenantId],
    queryFn: async () => {
      const tenants = await base44.entities.Tenant.filter({ id: tenantId });
      return tenants[0] || null;
    },
    enabled: !!tenantId
  });

  const { data: benchmark } = useQuery({
    queryKey: ['benchmark', tenantId],
    queryFn: async () => {
      const benchmarks = await base44.entities.TenantBenchmark.filter({ tenant_id: tenantId }, '-benchmark_date', 1);
      return benchmarks[0] || null;
    },
    enabled: !!tenantId
  });

  const { data: usageLogs = [] } = useQuery({
    queryKey: ['usage', tenantId],
    queryFn: () => base44.entities.TenantUsageLog.filter({ tenant_id: tenantId }, '-date', 30),
    enabled: !!tenantId
  });

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--primary-teal)' }} />
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
        <h2 className="text-2xl font-bold mb-2">Tenant não encontrado</h2>
        <Button onClick={() => navigate(createPageUrl("FratozDashboard"))}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>
    );
  }

  const healthScore = tenant.health_metrics?.health_score || 0;
  const churnRisk = tenant.health_metrics?.churn_risk || 'low';

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(createPageUrl("FratozDashboard"))}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <div className="flex items-center gap-3">
                {tenant.branding?.logo_url && (
                  <img src={tenant.branding.logo_url} alt="Logo" className="w-12 h-12 rounded-lg" />
                )}
                <h1 className="text-4xl font-heading font-bold">{tenant.tenant_name}</h1>
                <Badge style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}>
                  {tenant.subscription_tier}
                </Badge>
              </div>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                {tenant.tenant_slug}.innova.academy
              </p>
            </div>
          </div>
          <Button 
            onClick={() => navigate(createPageUrl("TenantSettings") + `?id=${tenant.id}`)}
            variant="outline"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>
        </div>

        {/* Health Alert */}
        {(churnRisk === 'high' || churnRisk === 'critical') && (
          <Alert className="border-2" style={{ borderColor: 'var(--error)', backgroundColor: 'var(--error)' + '10' }}>
            <AlertTriangle className="w-5 h-5" style={{ color: 'var(--error)' }} />
            <AlertDescription>
              <p className="font-semibold mb-1">Cliente em Risco de Churn</p>
              <p className="text-sm">
                Health Score: {healthScore.toFixed(0)} | Última atividade: {tenant.health_metrics?.last_login ? new Date(tenant.health_metrics.last_login).toLocaleDateString('pt-BR') : 'Nunca'}
              </p>
              <Button size="sm" className="mt-2" style={{ backgroundColor: 'var(--error)', color: 'white' }}>
                Ação Imediata Necessária
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8" style={{ color: 'var(--primary-teal)' }} />
              </div>
              <div className="text-3xl font-bold mb-1">{tenant.subscription_details?.current_students || 0}</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Alunos Ativos
              </div>
              <Progress 
                value={(tenant.subscription_details?.current_students / tenant.subscription_details?.max_students) * 100} 
                className="h-2 mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-8 h-8" style={{ color: 'var(--success)' }} />
                <CheckCircle2 className="w-5 h-5" style={{ color: healthScore >= 70 ? 'var(--success)' : 'var(--error)' }} />
              </div>
              <div className="text-3xl font-bold mb-1">{healthScore.toFixed(0)}</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Health Score
              </div>
              <Progress 
                value={healthScore} 
                className="h-2 mt-2"
                style={{ backgroundColor: healthScore >= 70 ? 'var(--success)' : 'var(--error)' }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <CreditCard className="w-8 h-8" style={{ color: 'var(--accent-yellow)' }} />
              </div>
              <div className="text-3xl font-bold mb-1">
                R$ {((tenant.subscription_details?.price_per_student || 0) * (tenant.subscription_details?.current_students || 0)).toFixed(0)}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                MRR (Receita Mensal)
              </div>
              <div className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                R$ {tenant.subscription_details?.price_per_student || 0} por aluno
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8" style={{ color: 'var(--info)' }} />
              </div>
              <div className="text-3xl font-bold mb-1">{tenant.health_metrics?.nps_score || 0}</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                NPS Score
              </div>
              <div className="text-xs mt-2" style={{ color: (tenant.health_metrics?.nps_score || 0) >= 50 ? 'var(--success)' : 'var(--warning)' }}>
                {(tenant.health_metrics?.nps_score || 0) >= 50 ? 'Excelente' : 'Pode Melhorar'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benchmarking */}
        {benchmark && (
          <Card>
            <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
                Benchmarking vs. Mercado
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-semibold mb-3">Taxa de Conclusão</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="text-2xl font-bold mb-1">
                        {benchmark.metrics?.completion_rate?.toFixed(1)}%
                      </div>
                      <Progress value={benchmark.metrics?.completion_rate || 0} className="h-2" />
                    </div>
                    <div className="text-right">
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Média: {benchmark.industry_averages?.completion_rate?.toFixed(1)}%
                      </div>
                      <div className="text-sm font-semibold">
                        P{benchmark.percentile_ranking?.completion_rate || 0}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-3">Engajamento</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="text-2xl font-bold mb-1">
                        {benchmark.metrics?.engagement_rate?.toFixed(1)}%
                      </div>
                      <Progress value={benchmark.metrics?.engagement_rate || 0} className="h-2" />
                    </div>
                    <div className="text-right">
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Média: {benchmark.industry_averages?.engagement_rate?.toFixed(1)}%
                      </div>
                      <div className="text-sm font-semibold">
                        P{benchmark.percentile_ranking?.engagement_rate || 0}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-3">Evasão</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="text-2xl font-bold mb-1">
                        {benchmark.metrics?.dropout_rate?.toFixed(1)}%
                      </div>
                      <Progress value={100 - (benchmark.metrics?.dropout_rate || 0)} className="h-2" />
                    </div>
                    <div className="text-right">
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Média: {benchmark.industry_averages?.dropout_rate?.toFixed(1)}%
                      </div>
                      <div className="text-sm font-semibold">
                        P{benchmark.percentile_ranking?.dropout_rate || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {benchmark.insights && benchmark.insights.length > 0 && (
                <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--info)' + '10' }}>
                  <p className="text-sm font-semibold mb-2">Insights:</p>
                  <ul className="space-y-1 text-sm">
                    {benchmark.insights.map((insight, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span>•</span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
