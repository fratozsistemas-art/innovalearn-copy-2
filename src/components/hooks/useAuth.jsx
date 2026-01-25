import { useCurrentUser } from './useUser';

/**
 * Hook para gerenciar autenticação e autorização
 * 
 * Fornece informações sobre o usuário atual e helpers para verificar permissões
 */
export function useAuth() {
  const { data: user, isLoading, error } = useCurrentUser();

  const isAuthenticated = !!user && !error;
  const isAdmin = user?.role === 'admin';
  
  // Verificar tipos de usuário específicos
  const userTypes = {
    isAdministrador: user?.user_type === 'administrador',
    isCoordenador: user?.user_type === 'coordenador_pedagogico',
    isInstrutor: user?.user_type === 'instrutor',
    isGerente: user?.user_type === 'gerente',
    isFinanceiro: user?.user_type === 'financeiro',
    isSecretaria: user?.user_type === 'secretaria',
    isPaiResponsavel: user?.user_type === 'pai_responsavel',
    isAluno: user?.user_type === 'aluno',
  };

  // Verificar se é educador (admin, coordenador ou instrutor)
  const isEducator = userTypes.isAdministrador || userTypes.isCoordenador || userTypes.isInstrutor;

  // Verificar se é staff (qualquer usuário que não seja aluno ou pai)
  const isStaff = user?.user_type && !['aluno', 'pai_responsavel'].includes(user.user_type);

  /**
   * Verificar se usuário tem um dos tipos especificados
   */
  const hasUserType = (types) => {
    if (!user) return false;
    const typeArray = Array.isArray(types) ? types : [types];
    return typeArray.includes(user.user_type);
  };

  /**
   * Verificar se usuário tem permissão para acessar um nível de curso
   */
  const hasLevelAccess = (level) => {
    if (!user) return false;
    
    // Admins e coordenadores têm acesso a tudo
    if (userTypes.isAdministrador || userTypes.isCoordenador) return true;
    
    // Verificar se é o nível do aluno
    return user.explorer_level === level;
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    isEducator,
    isStaff,
    ...userTypes,
    hasUserType,
    hasLevelAccess,
  };
}