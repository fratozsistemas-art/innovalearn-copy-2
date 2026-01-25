import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  ThumbsUp, 
  ThumbsDown,
  ExternalLink,
  Coins,
  Minimize2,
  Maximize2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useInnAI } from "../hooks/useInnAI";
import { useCurrentUser } from "../hooks/useUser";
import { useNavigate } from "react-router-dom";

export default function InnAIChatWidget({ pageContext }) {
  const { data: user } = useCurrentUser();
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [showProactiveSuggestion, setShowProactiveSuggestion] = useState(false);
  const messagesEndRef = useRef(null);

  const {
    sendMessage,
    conversation,
    loading,
    context,
    proactiveTriggers,
    triggerProactiveMessage,
    provideFeedback,
    clearConversation,
    error
  } = useInnAI(pageContext);

  // Auto-scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // Mostrar sugestão proativa se houver gatilhos de alta prioridade
  useEffect(() => {
    if (proactiveTriggers.length > 0 && !isOpen) {
      const urgentTrigger = proactiveTriggers.find(t => t.priority === 'urgent' || t.priority === 'high');
      if (urgentTrigger) {
        setShowProactiveSuggestion(true);
        
        // Auto-abrir chat após 5 segundos se não interagir
        const timer = setTimeout(() => {
          setIsOpen(true);
          setShowProactiveSuggestion(false);
          triggerProactiveMessage(urgentTrigger);
        }, 5000);

        return () => clearTimeout(timer);
      }
    }
  }, [proactiveTriggers, isOpen, triggerProactiveMessage]);

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message;
    setMessage('');
    
    await sendMessage(userMessage);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleActionClick = (action) => {
    if (action.url) {
      navigate(action.url);
    }
  };

  const handleProactiveSuggestionClick = () => {
    setIsOpen(true);
    setShowProactiveSuggestion(false);
    
    if (proactiveTriggers.length > 0) {
      const firstTrigger = proactiveTriggers[0];
      triggerProactiveMessage(firstTrigger);
    }
  };

  // Não renderizar se não houver usuário
  if (!user) {
    console.log('🤖 InnAI: Aguardando usuário autenticado...');
    return null;
  }

  // Não renderizar se onboarding não completado
  if (!user.onboarding_completed) {
    console.log('🤖 InnAI: Aguardando conclusão do onboarding...');
    return null;
  }

  const personaColors = {
    curiosity: '#3498DB',
    discovery: '#27AE60',
    pioneer: '#FF6F3C',
    challenger: '#E74C3C'
  };

  const personaColor = personaColors[user.explorer_level] || personaColors.curiosity;

  return (
    <>
      {/* Sugestão Proativa */}
      <AnimatePresence>
        {showProactiveSuggestion && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50"
          >
            <Card 
              className="p-4 max-w-xs shadow-2xl cursor-pointer hover:shadow-3xl transition-all border-2"
              style={{ borderColor: personaColor }}
              onClick={handleProactiveSuggestionClick}
            >
              <div className="flex items-start gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: personaColor }}
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm mb-1">InnAI tem uma mensagem!</p>
                  <p className="text-xs text-gray-600">
                    Clique para ver
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProactiveSuggestion(false);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão Flutuante */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center z-50 transition-all"
          style={{ backgroundColor: personaColor }}
        >
          <MessageCircle className="w-8 h-8 text-white" />
          {proactiveTriggers.length > 0 && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
            >
              {proactiveTriggers.length}
            </motion.div>
          )}
        </motion.button>
      )}

      {/* Janela de Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]"
            style={{ height: isMinimized ? '60px' : '600px', maxHeight: 'calc(100vh - 3rem)' }}
          >
            <Card className="h-full flex flex-col shadow-2xl border-2" style={{ borderColor: personaColor }}>
              {/* Header */}
              <div 
                className="p-4 flex items-center justify-between border-b"
                style={{ backgroundColor: personaColor }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">InnAI</h3>
                    <p className="text-xs text-white/80">
                      {context ? 'Online' : 'Carregando...'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-white hover:bg-white/20"
                    onClick={() => setIsMinimized(!isMinimized)}
                  >
                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-white hover:bg-white/20"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {/* Mensagens */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {conversation.length === 0 && (
                      <div className="text-center py-12">
                        <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: personaColor }} />
                        <p className="text-gray-600 mb-2">Oi, {user.explorer_name || user.full_name}!</p>
                        <p className="text-sm text-gray-500">
                          Estou aqui para ajudar com qualquer dúvida sobre IA!
                        </p>
                      </div>
                    )}

                    {conversation.map((msg, index) => (
                      <div key={index}>
                        <div
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl p-3 ${
                              msg.role === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white border shadow-sm'
                            }`}
                          >
                            {msg.role === 'assistant' && msg.proactive && (
                              <Badge className="mb-2 text-xs" style={{ backgroundColor: personaColor, color: 'white' }}>
                                💡 Sugestão Proativa
                              </Badge>
                            )}
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            
                            {msg.role === 'assistant' && !msg.error && (
                              <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => provideFeedback(index, 'helpful')}
                                >
                                  <ThumbsUp className="w-3 h-3 mr-1" />
                                  Útil
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => provideFeedback(index, 'not_helpful')}
                                >
                                  <ThumbsDown className="w-3 h-3 mr-1" />
                                  Não Útil
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Ações Sugeridas */}
                        {msg.role === 'assistant' && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2 ml-2">
                            {msg.suggestedActions.map((action, actionIndex) => (
                              <Button
                                key={actionIndex}
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => handleActionClick(action)}
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        )}

                        {/* Recompensa */}
                        {msg.role === 'assistant' && msg.gamificationReward && (
                          <div className="flex items-center gap-2 mt-2 ml-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                            <Coins className="w-4 h-4 text-yellow-600" />
                            <span className="text-xs font-semibold text-yellow-800">
                              +{msg.gamificationReward.coins} Innova Coins!
                            </span>
                          </div>
                        )}
                      </div>
                    ))}

                    {loading && (
                      <div className="flex justify-start">
                        <div className="bg-white border shadow-sm rounded-2xl p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: personaColor, animationDelay: '0ms' }} />
                            <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: personaColor, animationDelay: '150ms' }} />
                            <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: personaColor, animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}

                    {error && (
                      <div className="flex justify-start">
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-3 max-w-[80%]">
                          <div className="flex items-center gap-2 text-red-800 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <p>Erro ao processar mensagem. Tente novamente.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t bg-white">
                    <div className="flex items-center gap-2">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Digite sua dúvida sobre IA..."
                        className="flex-1"
                        disabled={loading}
                      />
                      <Button
                        onClick={handleSend}
                        disabled={loading || !message.trim()}
                        style={{ backgroundColor: personaColor, color: 'white' }}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>

                    {context?.engagement?.risk_score > 60 && (
                      <div className="mt-2 p-2 bg-orange-50 rounded-lg border border-orange-200">
                        <p className="text-xs text-orange-800">
                          💡 Percebo que pode estar com dificuldades. Estou aqui para ajudar!
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}