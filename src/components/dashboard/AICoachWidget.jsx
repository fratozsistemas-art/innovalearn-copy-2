import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles, ArrowRight, RefreshCw, Target, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { generatePersonalizedPath } from "@/components/ai/PersonalizedLearningEngine";

/**
 * Widget do AI Coach para Dashboard
 * LAZY LOADING - só carrega quando usuário clica
 */
export default function AICoachWidget({ userEmail }) {
  const navigate = useNavigate();
  const [quickInsights, setQuickInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadQuickInsights = async () => {
    if (!userEmail) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const path = await generatePersonalizedPath(userEmail);
      
      // Extract quick insights
      setQuickInsights({
        topPriority: path.recommendations.top_priorities?.[0],
        nextStep: path.nextSteps?.[0],
        motivationalMessage: path.motivationalMessage,
        hasCustomAssignments: path.customAssignments?.length > 0,
        hasRecommendedResources: path.recommendedResources?.length > 0
      });
      setHasLoaded(true);
    } catch (error) {
      console.error('Error loading quick insights:', error);
      
      // Check if rate limit
      if (error?.message?.includes('Rate limit') || error?.message?.includes('429')) {
        setError('rate_limit');
      } else {
        setError('general');
      }
    }
    setLoading(false);
  };

  // LAZY LOADING - não carrega automaticamente
  // useEffect removido - só carrega quando usuário clica

  if (error === 'rate_limit') {
    return (
      <Card className="border-2" style={{ borderColor: 'var(--warning)' }}>
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            ⚠️ Aguarde um momento
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            O sistema está com muitas requisições no momento. 
            Tente novamente em 1 minuto.
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setError(null)}
          >
            Entendi
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (error === 'general') {
    return (
      <Card className="border-2" style={{ borderColor: 'var(--error)' }}>
        <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Erro ao Carregar
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            Não foi possível carregar suas recomendações. 
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={loadQuickInsights}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="border-2" style={{ borderColor: 'var(--primary-teal)' }}>
        <CardContent className="p-8 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin" style={{ color: 'var(--primary-teal)' }} />
          <p className="text-sm text-gray-600">Analisando seu perfil...</p>
        </CardContent>
      </Card>
    );
  }

  if (!hasLoaded && !quickInsights) {
    return (
      <Card className="border-2 hover:shadow-xl transition-all cursor-pointer" 
        style={{ borderColor: 'var(--primary-teal)' }}
        onClick={loadQuickInsights}
      >
        <CardHeader className="bg-gradient-to-r from-teal-500 to-blue-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            🤖 Seu Coach de IA
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" style={{ color: 'var(--primary-teal)' }} />
          <p className="text-sm text-gray-600 mb-4">
            Clique para carregar recomendações personalizadas
          </p>
          <Button
            className="w-full"
            style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Analisar meu Perfil
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!quickInsights) {
    return null;
  }

  return (
    <Card className="border-2 hover:shadow-xl transition-all" style={{ borderColor: 'var(--primary-teal)' }}>
      <CardHeader className="bg-gradient-to-r from-teal-500 to-blue-500 text-white">
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          🤖 Seu Coach de IA
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        
        {/* Motivational Message */}
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--primary-teal-light)' }}>
          <p className="text-sm font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4" style={{ color: 'var(--primary-teal)' }} />
            {quickInsights.motivationalMessage}
          </p>
        </div>

        {/* Top Priority */}
        {quickInsights.topPriority && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4" style={{ color: 'var(--accent-orange)' }} />
              <p className="text-xs font-semibold text-gray-600">PRIORIDADE PRINCIPAL</p>
            </div>
            <p className="font-semibold text-sm">{quickInsights.topPriority.priority}</p>
            <p className="text-xs text-gray-600 mt-1">{quickInsights.topPriority.reason}</p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          {quickInsights.hasCustomAssignments && (
            <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--neutral-light)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--accent-orange)' }}>
                ✨
              </div>
              <p className="text-xs text-gray-600">Tarefas Personalizadas</p>
            </div>
          )}
          {quickInsights.hasRecommendedResources && (
            <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--neutral-light)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--success)' }}>
                📚
              </div>
              <p className="text-xs text-gray-600">Recursos VARK</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <Button
          className="w-full"
          onClick={() => navigate(createPageUrl("AILearningCoach"))}
          style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
        >
          Ver Análise Completa
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}