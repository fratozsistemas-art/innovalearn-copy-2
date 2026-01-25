import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

/**
 * AuthGuard - Componente para proteger conteúdo baseado em autenticação e permissões
 * 
 * Uso:
 * 
 * // Requer apenas autenticação
 * <AuthGuard>
 *   <ConteudoProtegido />
 * </AuthGuard>
 * 
 * // Requer tipos específicos de usuário
 * <AuthGuard requireUserTypes={['administrador', 'coordenador_pedagogico']}>
 *   <ConteudoAdmin />
 * </AuthGuard>
 * 
 * // Requer ser educador
 * <AuthGuard requireEducator>
 *   <ConteudoEducador />
 * </AuthGuard>
 * 
 * // Requer ser staff
 * <AuthGuard requireStaff>
 *   <ConteudoStaff />
 * </AuthGuard>
 * 
 * // Custom fallback
 * <AuthGuard fallback={<MensagemPersonalizada />}>
 *   <Conteudo />
 * </AuthGuard>
 */
export default function AuthGuard({ 
  children, 
  requireUserTypes = null,
  requireEducator = false,
  requireStaff = false,
  requireAdmin = false,
  fallback = null,
  redirectTo = null,
  showLoadingState = true
}) {
  const { 
    user, 
    isLoading, 
    isAuthenticated, 
    isEducator, 
    isStaff,
    isAdmin,
    hasUserType 
  } = useAuth();
  
  const navigate = useNavigate();

  // Loading state
  if (isLoading && showLoadingState) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
            style={{ borderColor: 'var(--primary-teal)' }}
          />
          <p style={{ color: 'var(--text-secondary)' }}>Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Não autenticado
  if (!isAuthenticated) {
    if (redirectTo) {
      navigate(createPageUrl(redirectTo));
      return null;
    }

    if (fallback) return fallback;

    return (
      <Card className="max-w-md mx-auto mt-12 border-2" style={{ borderColor: 'var(--error)' }}>
        <CardHeader style={{ backgroundColor: 'var(--error)', color: 'white' }}>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Autenticação Necessária
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--error)' }} />
          <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
            Você precisa estar autenticado para acessar este conteúdo.
          </p>
          <Button 
            onClick={() => navigate(createPageUrl('Dashboard'))}
            style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
          >
            Ir para Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Verificar permissões
  let hasPermission = true;
  let permissionError = '';

  if (requireAdmin && !isAdmin) {
    hasPermission = false;
    permissionError = 'Apenas administradores podem acessar este conteúdo.';
  } else if (requireEducator && !isEducator) {
    hasPermission = false;
    permissionError = 'Apenas educadores podem acessar este conteúdo.';
  } else if (requireStaff && !isStaff) {
    hasPermission = false;
    permissionError = 'Apenas membros da equipe podem acessar este conteúdo.';
  } else if (requireUserTypes && !hasUserType(requireUserTypes)) {
    hasPermission = false;
    permissionError = 'Você não tem permissão para acessar este conteúdo.';
  }

  // Sem permissão
  if (!hasPermission) {
    if (redirectTo) {
      navigate(createPageUrl(redirectTo));
      return null;
    }

    if (fallback) return fallback;

    return (
      <Card className="max-w-md mx-auto mt-12 border-2" style={{ borderColor: 'var(--warning)' }}>
        <CardHeader style={{ backgroundColor: 'var(--warning)', color: 'white' }}>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Acesso Restrito
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--warning)' }} />
          <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
            {permissionError}
          </p>
          <Button 
            onClick={() => navigate(createPageUrl('Dashboard'))}
            style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
          >
            Voltar ao Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Tem permissão - renderizar conteúdo
  return <>{children}</>;
}