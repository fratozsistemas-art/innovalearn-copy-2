import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Activity
} from "lucide-react";

export default function SystemHealthPage() {
  const [checks, setChecks] = useState({
    base44Client: { status: 'checking', message: 'Verificando...' },
    entities: { status: 'checking', message: 'Verificando...' },
    auth: { status: 'checking', message: 'Verificando...' },
    navigation: { status: 'checking', message: 'Verificando...' }
  });

  useEffect(() => {
    runHealthChecks();
  }, []);

  const runHealthChecks = async () => {
    // Check 1: base44Client
    try {
      const { base44 } = await import("@/api/base44Client");
      updateCheck('base44Client', 'success', 'Base44 Client carregado');
      
      // Check 2: Entities
      try {
        await base44.entities.User.list();
        updateCheck('entities', 'success', 'Entidades acessíveis');
      } catch (error) {
        updateCheck('entities', 'warning', `Entidades: ${error.message}`);
      }

      // Check 3: Auth
      try {
        const user = await base44.auth.me();
        updateCheck('auth', 'success', user ? 'Autenticado' : 'Não autenticado (OK)');
      } catch (error) {
        if (error.message?.includes('not authenticated')) {
          updateCheck('auth', 'success', 'Sistema de auth funcionando');
        } else {
          updateCheck('auth', 'error', `Auth: ${error.message}`);
        }
      }

      // Check 4: Navigation
      try {
        const { createPageUrl } = await import("@/utils");
        const url = createPageUrl('Dashboard');
        updateCheck('navigation', 'success', `Navigation OK (${url})`);
      } catch (error) {
        updateCheck('navigation', 'error', `Navigation: ${error.message}`);
      }

    } catch (error) {
      updateCheck('base44Client', 'error', `Erro: ${error.message}`);
      updateCheck('entities', 'error', 'Não verificado');
      updateCheck('auth', 'error', 'Não verificado');
      updateCheck('navigation', 'error', 'Não verificado');
    }
  };

  const updateCheck = (key, status, message) => {
    setChecks(prev => ({
      ...prev,
      [key]: { status, message }
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-400 animate-pulse" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const allSuccess = Object.values(checks).every(c => c.status === 'success');

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">
            Status do Sistema
          </h1>
          <p className="text-gray-600">
            Verificando componentes principais da aplicação
          </p>
        </div>

        {allSuccess && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-2" />
            <p className="text-lg font-semibold text-green-800">
              Todos os sistemas operacionais! ✅
            </p>
          </div>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Verificações de Saúde</CardTitle>
              <Button onClick={runHealthChecks} size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Verificar Novamente
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(checks).map(([key, check]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(check.status)}
                    <div>
                      <p className="font-semibold capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {check.message}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(check.status)}>
                    {check.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Navegador</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm font-mono">
              <div className="flex justify-between">
                <span className="text-gray-600">User Agent:</span>
                <span className="text-right max-w-md truncate">{navigator.userAgent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">URL:</span>
                <span>{window.location.href}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Online:</span>
                <span>{navigator.onLine ? '✅ Sim' : '❌ Não'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Idioma:</span>
                <span>{navigator.language}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Console do Navegador</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Abra o console do navegador (F12) para ver logs detalhados de erros.
            </p>
            <pre className="mt-4 p-4 bg-gray-900 text-green-400 rounded text-xs overflow-auto">
{`// Para verificar erros:
console.error // Mostra erros
console.warn  // Mostra avisos
console.log   // Mostra logs gerais

// Verificar Base44:
await base44.auth.me()
await base44.entities.User.list()`}
            </pre>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}