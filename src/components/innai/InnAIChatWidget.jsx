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
  AlertCircle,
  Paperclip,
  Settings,
  Trash2,
  Brain,
  Cpu
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
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const {
    sendMessage,
    conversation,
    loading,
    context,
    proactiveTriggers,
    triggerProactiveMessage,
    provideFeedback,
    clearConversation,
    agentType,
    switchAgent,
    llmProvider,
    switchLLMProvider,
    error
  } = useInnAI(pageContext);

  // Auto-scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // Mostrar sugestão proativa apenas uma vez por sessão
  const [proactiveShownOnce, setProactiveShownOnce] = useState(false);

  useEffect(() => {
    if (proactiveTriggers.length > 0 && !isOpen && !proactiveShownOnce) {
      const urgentTrigger = proactiveTriggers.find(t => t.priority === 'urgent' || t.priority === 'high');
      if (urgentTrigger) {
        setShowProactiveSuggestion(true);
        setProactiveShownOnce(true);
      }
    }
  }, [proactiveTriggers, isOpen, proactiveShownOnce]);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingFiles(true);
    try {
      const uploadedFiles = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          
          const result = await base44.integrations.Core.UploadFile({ file });
          return {
            filename: file.name,
            url: result.file_url,
            type: file.type
          };
        })
      );
      
      setSelectedFiles(prev => [...prev, ...uploadedFiles]);
    } catch (err) {
      console.error('Erro no upload:', err);
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleSend = async () => {
    if ((!message.trim() && selectedFiles.length === 0) || loading) return;

    const userMessage = message;
    const attachments = selectedFiles;
    
    setMessage('');
    setSelectedFiles([]);
    
    await sendMessage(userMessage, { attachments });
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
                    onClick={() => setShowSettings(!showSettings)}
                    title="Configurações"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-white hover:bg-white/20"
                    onClick={clearConversation}
                    title="Nova conversa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
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
                  {/* Settings Panel */}
                  {showSettings && (
                    <div className="p-4 border-b bg-white">
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-semibold mb-2 block">Modo de Conversa</label>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={agentType === 'innai' ? 'default' : 'outline'}
                              onClick={() => switchAgent('innai')}
                              className="flex-1"
                            >
                              <Sparkles className="w-3 h-3 mr-1" />
                              InnAI
                            </Button>
                            <Button
                              size="sm"
                              variant={agentType === 'metacognitive_coach' ? 'default' : 'outline'}
                              onClick={() => switchAgent('metacognitive_coach')}
                              className="flex-1"
                            >
                              <Brain className="w-3 h-3 mr-1" />
                              Coach
                            </Button>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold mb-2 block">Modelo de IA</label>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={llmProvider === 'openai' ? 'default' : 'outline'}
                              onClick={() => switchLLMProvider('openai')}
                              className="flex-1 text-xs"
                            >
                              OpenAI
                            </Button>
                            <Button
                              size="sm"
                              variant={llmProvider === 'anthropic' ? 'default' : 'outline'}
                              onClick={() => switchLLMProvider('anthropic')}
                              className="flex-1 text-xs"
                            >
                              Claude
                            </Button>
                            <Button
                              size="sm"
                              variant={llmProvider === 'maritaca' ? 'default' : 'outline'}
                              onClick={() => switchLLMProvider('maritaca')}
                              className="flex-1 text-xs"
                            >
                              Maritaca
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

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
                            
                            {/* Attachments */}
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {msg.attachments.map((file, idx) => (
                                  <div key={idx} className="flex items-center gap-2 p-2 bg-gray-100 rounded text-xs">
                                    <Paperclip className="w-3 h-3" />
                                    <span className="truncate max-w-[150px]">{file.filename}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            
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
                  <div className="p-4 border-t bg-white space-y-2">
                    {/* Selected Files Preview */}
                    {selectedFiles.length > 0 && (
                      <div className="flex flex-wrap gap-2 pb-2 border-b">
                        {selectedFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center gap-2 px-2 py-1 bg-blue-50 rounded text-xs">
                            <Paperclip className="w-3 h-3" />
                            <span className="truncate max-w-[120px]">{file.filename}</span>
                            <button
                              onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== idx))}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        multiple
                        accept="image/*,.pdf,.txt,.doc,.docx"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading || uploadingFiles}
                        title="Anexar arquivo"
                      >
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={agentType === 'metacognitive_coach' ? 'Reflita sobre seu aprendizado...' : 'Digite sua dúvida sobre IA...'}
                        className="flex-1"
                        disabled={loading}
                      />
                      <Button
                        onClick={handleSend}
                        disabled={loading || (!message.trim() && selectedFiles.length === 0)}
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