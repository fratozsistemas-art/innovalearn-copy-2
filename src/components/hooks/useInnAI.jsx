import { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { buildStudentContext, detectProactiveTriggers } from '../innai/contextBuilder';
import { useCurrentUser } from './useUser';
import { useQueryClient } from '@tanstack/react-query';
import { PERSONAS } from '../innai/personas';

export function useInnAI(pageContext = null) {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();
  
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [context, setContext] = useState(null);
  const [proactiveTriggers, setProactiveTriggers] = useState([]);
  const [interactionStartTime, setInteractionStartTime] = useState(null);

  // Construir contexto quando usuário carregar
  useEffect(() => {
    if (user?.email && user?.onboarding_completed) {
      console.log('🤖 InnAI: Construindo contexto para', user.email);
      buildStudentContext(user.email, pageContext)
        .then(ctx => {
          console.log('✅ InnAI: Contexto construído', ctx);
          setContext(ctx);
          
          // Detectar gatilhos proativos
          const triggers = detectProactiveTriggers(ctx);
          console.log('🎯 InnAI: Triggers detectados:', triggers.length);
          setProactiveTriggers(triggers);
        })
        .catch(err => {
          console.error('❌ InnAI: Erro construindo contexto:', err);
          setContext(getDefaultContext(user.email, pageContext));
        });
    }
  }, [user, pageContext]);

  // Enviar mensagem
  const sendMessage = useCallback(async (userMessage, options = {}) => {
    if (!user) {
      console.error('❌ InnAI: Sem usuário autenticado');
      return null;
    }
    
    if (!userMessage.trim()) {
      console.warn('⚠️ InnAI: Mensagem vazia');
      return null;
    }

    console.log('📤 InnAI: Enviando mensagem:', userMessage);
    setInteractionStartTime(Date.now());
    setLoading(true);
    setError(null);

    // Adicionar mensagem do usuário à conversa
    const newUserMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    
    setConversation(prev => [...prev, newUserMessage]);

    try {
      // Selecionar persona baseado no nível
      const explorerLevel = user.explorer_level || 'curiosity';
      const persona = PERSONAS[explorerLevel] || PERSONAS.curiosity;
      
      console.log('🎭 InnAI: Usando persona:', explorerLevel);

      // Construir prompt com contexto
      const contextPrompt = buildContextPrompt(context, user, conversation, userMessage, explorerLevel);
      
      console.log('🔄 InnAI: Chamando LLM...');

      // Chamar LLM
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${persona.systemPrompt}\n\n${contextPrompt}`,
        add_context_from_internet: options.needsExternalInfo || false
      });

      console.log('✅ InnAI: Resposta recebida');

      // Processar resposta
      const assistantMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        suggestedActions: detectActionsInResponse(response, context),
        gamificationReward: detectRewardInResponse(response)
      };

      setConversation(prev => [...prev, assistantMessage]);

      // Salvar log da interação
      const interactionDuration = interactionStartTime 
        ? Math.floor((Date.now() - interactionStartTime) / 1000)
        : 0;

      try {
        await base44.entities.InnAIInteractionLog.create({
          student_email: user.email,
          persona_level: explorerLevel,
          user_message: userMessage,
          assistant_message: response,
          context_snapshot: context,
          suggested_actions: assistantMessage.suggestedActions,
          gamification_reward: assistantMessage.gamificationReward,
          interaction_duration_seconds: interactionDuration,
          proactive_trigger: options.proactiveTrigger || null
        });
      } catch (logError) {
        console.error('⚠️ InnAI: Erro salvando log (não crítico):', logError);
      }

      // Se houve recompensa, atualizar gamificação
      if (assistantMessage.gamificationReward?.coins) {
        try {
          const gamProfiles = await base44.entities.GamificationProfile.filter({ 
            student_email: user.email 
          });

          if (gamProfiles.length > 0) {
            const gamProfile = gamProfiles[0];
            await base44.entities.GamificationProfile.update(gamProfile.id, {
              innova_coins: (gamProfile.innova_coins || 0) + assistantMessage.gamificationReward.coins,
              total_coins_earned: (gamProfile.total_coins_earned || 0) + assistantMessage.gamificationReward.coins,
              coin_history: [
                ...(gamProfile.coin_history || []),
                {
                  action: 'innai_interaction',
                  coins: assistantMessage.gamificationReward.coins,
                  timestamp: new Date().toISOString(),
                  description: assistantMessage.gamificationReward.reason || 'Interação produtiva com InnAI'
                }
              ]
            });

            queryClient.invalidateQueries({ queryKey: ['gamificationProfile'] });
          }
        } catch (gamError) {
          console.error('⚠️ InnAI: Erro atualizando gamificação (não crítico):', gamError);
        }
      }

      setLoading(false);
      return {
        message: response,
        suggestedActions: assistantMessage.suggestedActions,
        gamificationReward: assistantMessage.gamificationReward
      };

    } catch (err) {
      console.error('❌ InnAI: Erro enviando mensagem:', err);
      setLoading(false);
      setError(err);
      
      const errorMessage = {
        role: 'assistant',
        content: 'Desculpe, tive um problema técnico ao processar sua pergunta. Pode tentar novamente em alguns segundos?',
        timestamp: new Date().toISOString(),
        error: true
      };
      
      setConversation(prev => [...prev, errorMessage]);
      return null;
    }
  }, [user, context, conversation, interactionStartTime, queryClient]);

  // Iniciar conversa proativa
  const triggerProactiveMessage = useCallback(async (trigger) => {
    if (!trigger) return;

    console.log('🎯 InnAI: Acionando mensagem proativa:', trigger.type);

    const proactiveMessage = {
      role: 'assistant',
      content: trigger.message,
      timestamp: new Date().toISOString(),
      proactive: true,
      trigger: trigger.type,
      suggestedActions: trigger.suggested_actions || []
    };

    setConversation(prev => [...prev, proactiveMessage]);

    // Log da interação proativa
    if (user) {
      try {
        await base44.entities.InnAIInteractionLog.create({
          student_email: user.email,
          persona_level: user.explorer_level || 'curiosity',
          user_message: '[PROACTIVE_TRIGGER]',
          assistant_message: trigger.message,
          context_snapshot: context,
          suggested_actions: trigger.suggested_actions || [],
          proactive_trigger: trigger.type
        });
      } catch (err) {
        console.error('⚠️ InnAI: Erro salvando log proativo (não crítico):', err);
      }
    }
  }, [user, context]);

  // Fornecer feedback sobre resposta
  const provideFeedback = useCallback(async (messageIndex, feedback) => {
    if (!user) return;

    try {
      // Buscar último log da interação
      const logs = await base44.entities.InnAIInteractionLog.filter({
        student_email: user.email
      }, '-created_date', 1);

      if (logs.length > 0) {
        await base44.entities.InnAIInteractionLog.update(logs[0].id, {
          user_feedback: feedback
        });
        console.log('✅ InnAI: Feedback registrado:', feedback);
      }
    } catch (err) {
      console.error('⚠️ InnAI: Erro registrando feedback (não crítico):', err);
    }
  }, [user]);

  // Limpar conversa
  const clearConversation = useCallback(() => {
    setConversation([]);
    console.log('🧹 InnAI: Conversa limpa');
  }, []);

  return {
    sendMessage,
    conversation,
    loading,
    error,
    context,
    proactiveTriggers,
    triggerProactiveMessage,
    provideFeedback,
    clearConversation
  };
}

// ===========================
// FUNÇÕES AUXILIARES
// ===========================

function buildContextPrompt(context, user, conversation, userMessage, explorerLevel) {
  if (!context) {
    return `**MENSAGEM DO ALUNO:**\n${userMessage}\n\n**RESPONDA:** De forma clara e adaptada ao nível ${explorerLevel}.`;
  }

  return `**CONTEXTO DO ALUNO - INNOVA ACADEMY:**

**Nome:** ${context.student?.name || 'Aluno'}
**Nível:** ${explorerLevel}
**Página Atual:** ${context.current?.page || 'Dashboard'}

**PERFORMANCE:**
- Lições Completadas: ${context.performance?.total_lessons_completed || 0}
- Média de Notas: ${context.performance?.average_score?.toFixed(0) || 'N/A'}%
- Taxa de Conclusão: ${context.performance?.completion_rate || 0}%

**ENGAJAMENTO:**
- Dias sem atividade: ${context.engagement?.days_since_last_activity || 0}
- Tarefas Pendentes: ${context.engagement?.pending_tasks || 0}
- Score de Risco: ${context.engagement?.risk_score || 0}/100

**ESTILO DE APRENDIZADO:**
- VARK Primário: ${context.profiles?.vark?.primary_style || 'multimodal'}

**HISTÓRICO RECENTE:**
${conversation.slice(-3).map(msg => `${msg.role === 'user' ? 'Aluno' : 'InnAI'}: ${msg.content}`).join('\n')}

**MENSAGEM ATUAL:**
${userMessage}

**RESPONDA:**
1. De forma personalizada ao perfil do aluno
2. Focado em Inteligência Artificial
3. Adaptado ao nível ${explorerLevel}
4. Se apropriado, sugira ações específicas
5. Se a interação for produtiva, mencione recompensa de 5-10 Innova Coins`;
}

function getDefaultContext(studentEmail, pageContext) {
  return {
    student: {
      name: 'Aluno',
      email: studentEmail,
      explorer_level: 'curiosity'
    },
    current: {
      page: pageContext || 'Dashboard'
    },
    performance: {
      total_lessons_completed: 0,
      average_score: null,
      completion_rate: 0
    },
    engagement: {
      days_since_last_activity: 0,
      pending_tasks: 0,
      risk_score: 0
    },
    profiles: {
      vark: {
        primary_style: 'multimodal'
      }
    }
  };
}

function detectActionsInResponse(response, context) {
  const actions = [];

  // Detectar menções a lições
  if (response.toLowerCase().includes('próxima lição') || response.toLowerCase().includes('continuar estudando')) {
    actions.push({
      type: 'open_lesson',
      label: 'Ver Próxima Lição',
      url: '/Courses'
    });
  }

  // Detectar sugestão de revisão
  if (response.toLowerCase().includes('revisar') || response.toLowerCase().includes('reforçar')) {
    actions.push({
      type: 'review_concept',
      label: 'Revisar Conceitos',
      url: '/Resources'
    });
  }

  // Detectar sugestão de prática
  if (response.toLowerCase().includes('praticar') || response.toLowerCase().includes('exercício')) {
    actions.push({
      type: 'practice_quiz',
      label: 'Fazer Exercícios',
      url: '/Assignments'
    });
  }

  return actions;
}

function detectRewardInResponse(response) {
  // Detectar menção a Innova Coins
  const coinsMatch = response.match(/(\d+)\s*innova\s*coins?/i);
  
  if (coinsMatch) {
    return {
      coins: parseInt(coinsMatch[1]),
      reason: 'Interação produtiva com InnAI'
    };
  }

  return null;
}