import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader } from 'lucide-react';

/**
 * AI Learning Coach Chat Component
 * Interactive AI assistant for personalized learning support
 */
const AICoachChat = ({ studentContext, lessonContext }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: `Olá! Sou seu Coach de IA pessoal. Estou aqui para ajudá-lo a aprender melhor. Como posso ajudá-lo hoje?`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response (in production, this would call an actual AI API)
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage, studentContext, lessonContext);
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput, studentCtx, lessonCtx) => {
    // This is a placeholder. In production, this would use OpenAI API or similar
    const responses = {
      help: `Claro! Posso ajudá-lo com:
• Explicar conceitos difíceis
• Sugerir recursos adicionais
• Criar planos de estudo personalizados
• Responder perguntas sobre o conteúdo
• Dar dicas de aprendizado

O que você gostaria de explorar?`,
      
      explain: `Vou explicar isso de uma forma mais simples:

${lessonCtx?.currentTopic || 'Este tópico'} pode ser entendido através de exemplos práticos. Pense nisso como...

[Explicação detalhada seria gerada aqui]

Isso ficou mais claro? Posso explicar de outra forma se precisar!`,
      
      quiz: `Ótima ideia! Vou criar algumas perguntas para testar seu conhecimento:

**Questão 1:** [Pergunta baseada no conteúdo]
A) Opção 1
B) Opção 2
C) Opção 3

Qual você acha que é a resposta correta?`,
      
      tips: `Aqui estão algumas dicas personalizadas para você:

📚 **Baseado no seu perfil VARK (${studentCtx?.varkMode || 'Visual'}):**
• Foque em ${studentCtx?.varkMode === 'visual' ? 'diagramas e gráficos' : 'prática hands-on'}
• Use ${studentCtx?.varkMode === 'auditory' ? 'áudio e discussões' : 'anotações escritas'}

⏰ **Melhor horário de estudo:** ${studentCtx?.preferredTime || 'Manhã'}
🎯 **Próximo objetivo:** Completar ${lessonCtx?.nextLesson || 'próxima lição'}

Continue assim!`,
    };

    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('ajuda') || lowerInput.includes('help')) {
      return responses.help;
    } else if (lowerInput.includes('explica') || lowerInput.includes('explain')) {
      return responses.explain;
    } else if (lowerInput.includes('quiz') || lowerInput.includes('teste')) {
      return responses.quiz;
    } else if (lowerInput.includes('dica') || lowerInput.includes('tip')) {
      return responses.tips;
    }
    
    return `Entendi sua pergunta sobre "${userInput}". Deixe-me ajudá-lo com isso...

[Resposta personalizada seria gerada aqui usando IA]

Isso responde sua dúvida? Posso elaborar mais se precisar!`;
  };

  const quickActions = [
    { label: 'Explicar conceito', icon: '💡', action: 'Pode explicar este conceito de forma mais simples?' },
    { label: 'Criar quiz', icon: '📝', action: 'Crie um quiz sobre este tópico' },
    { label: 'Dicas de estudo', icon: '🎯', action: 'Me dê dicas personalizadas de estudo' },
    { label: 'Recursos extras', icon: '📚', action: 'Sugira recursos adicionais para aprender mais' },
  ];

  const handleQuickAction = (action) => {
    setInputMessage(action);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-innova-teal-200 dark:border-innova-teal-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-innova-teal-500 to-innova-teal-600 p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <Bot className="w-6 h-6 text-innova-teal-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">AI Learning Coach</h3>
          <p className="text-sm text-innova-teal-100">Seu assistente pessoal de aprendizado</p>
        </div>
        <Sparkles className="w-6 h-6 text-innova-yellow-300 animate-pulse" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`
              flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
              ${message.role === 'user' 
                ? 'bg-innova-orange-500' 
                : 'bg-innova-teal-500'
              }
            `}>
              {message.role === 'user' ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-white" />
              )}
            </div>
            <div className={`
              flex-1 max-w-[80%] p-3 rounded-lg
              ${message.role === 'user'
                ? 'bg-innova-orange-100 dark:bg-innova-orange-900/30 text-gray-900 dark:text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }
            `}>
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-innova-teal-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <Loader className="w-5 h-5 text-innova-teal-600 dark:text-innova-teal-400 animate-spin" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action.action)}
              className="flex-shrink-0 px-3 py-2 bg-white dark:bg-gray-800 hover:bg-innova-teal-50 dark:hover:bg-innova-teal-900/30 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
            >
              <span>{action.icon}</span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Digite sua pergunta..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-innova-teal-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="px-4 py-2 bg-innova-teal-500 hover:bg-innova-teal-600 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          💡 Faça perguntas, peça explicações ou solicite dicas de estudo personalizadas
        </p>
      </div>
    </div>
  );
};

export default AICoachChat;

// Example usage:
/*
const studentContext = {
  varkMode: 'visual',
  preferredTime: 'Manhã',
  level: 5,
  strengths: ['Python', 'Matemática'],
  weaknesses: ['Inglês'],
};

const lessonContext = {
  currentTopic: 'Funções em Python',
  nextLesson: 'Listas e Tuplas',
  difficulty: 'intermediate',
};

<AICoachChat 
  studentContext={studentContext}
  lessonContext={lessonContext}
/>
*/
