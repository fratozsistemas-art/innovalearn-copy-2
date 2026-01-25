import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Mail, User, Calendar, Reply } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

export default function SecureMessaging({ parentEmail, studentEmail, onMessagesRead }) {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [view, setView] = useState('inbox'); // 'inbox', 'sent', 'compose'
  const [newMessage, setNewMessage] = useState({
    to_email: '',
    subject: '',
    body: '',
    priority: 'normal'
  });

  useEffect(() => {
    loadMessages();
    loadRecipients();
  }, [parentEmail, studentEmail]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const received = await base44.entities.Message.filter({
        to_email: parentEmail
      }, '-created_date', 50);

      const sent = await base44.entities.Message.filter({
        from_email: parentEmail
      }, '-created_date', 50);

      setMessages([...received, ...sent]);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
    setLoading(false);
  };

  const loadRecipients = async () => {
    try {
      const allUsers = await base44.entities.User.list();
      
      const teacherUsers = allUsers.filter(u => 
        ['instrutor', 'coordenador_pedagogico'].includes(u.user_type)
      );
      
      const adminUsers = allUsers.filter(u => 
        ['administrador', 'secretaria'].includes(u.user_type)
      );

      setTeachers(teacherUsers);
      setAdmins(adminUsers);
    } catch (error) {
      console.error('Error loading recipients:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.to_email || !newMessage.subject || !newMessage.body) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      await base44.entities.Message.create({
        from_email: parentEmail,
        to_email: newMessage.to_email,
        subject: newMessage.subject,
        body: newMessage.body,
        message_type: 'parent_to_teacher',
        priority: newMessage.priority,
        student_email: studentEmail,
        read: false,
        replied: false
      });

      toast.success('Mensagem enviada com sucesso!');
      setNewMessage({ to_email: '', subject: '', body: '', priority: 'normal' });
      setView('sent');
      await loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erro ao enviar mensagem');
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await base44.entities.Message.update(messageId, {
        read: true,
        read_at: new Date().toISOString()
      });
      await loadMessages();
      if (onMessagesRead) onMessagesRead();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleReply = (message) => {
    setNewMessage({
      to_email: message.from_email,
      subject: `Re: ${message.subject}`,
      body: `\n\n--- Mensagem Original ---\nDe: ${message.from_email}\nData: ${format(new Date(message.created_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}\n${message.body}`,
      priority: 'normal'
    });
    setView('compose');
  };

  const receivedMessages = messages.filter(m => m.to_email === parentEmail);
  const sentMessages = messages.filter(m => m.from_email === parentEmail);
  const unreadCount = receivedMessages.filter(m => !m.read).length;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
            style={{ borderColor: 'var(--primary-teal)' }}
          />
          <p>Carregando mensagens...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-4 gap-6">
      
      {/* Sidebar */}
      <div className="md:col-span-1 space-y-2">
        <Button
          variant={view === 'compose' ? 'default' : 'outline'}
          className="w-full justify-start"
          onClick={() => setView('compose')}
          style={view === 'compose' ? { backgroundColor: 'var(--primary-teal)', color: 'white' } : {}}
        >
          <Send className="w-4 h-4 mr-2" />
          Nova Mensagem
        </Button>

        <Button
          variant={view === 'inbox' ? 'default' : 'outline'}
          className="w-full justify-start"
          onClick={() => setView('inbox')}
          style={view === 'inbox' ? { backgroundColor: 'var(--primary-teal)', color: 'white' } : {}}
        >
          <Mail className="w-4 h-4 mr-2" />
          Caixa de Entrada
          {unreadCount > 0 && (
            <Badge className="ml-auto" style={{ backgroundColor: 'var(--error)', color: 'white' }}>
              {unreadCount}
            </Badge>
          )}
        </Button>

        <Button
          variant={view === 'sent' ? 'default' : 'outline'}
          className="w-full justify-start"
          onClick={() => setView('sent')}
          style={view === 'sent' ? { backgroundColor: 'var(--primary-teal)', color: 'white' } : {}}
        >
          <Send className="w-4 h-4 mr-2" />
          Enviadas
        </Button>
      </div>

      {/* Main Content */}
      <div className="md:col-span-3">
        
        {/* Compose View */}
        {view === 'compose' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
                Nova Mensagem
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Destinatário *</Label>
                <Select value={newMessage.to_email} onValueChange={(v) => setNewMessage({...newMessage, to_email: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o destinatário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem disabled>--- Professores ---</SelectItem>
                    {teachers.map(t => (
                      <SelectItem key={t.id} value={t.email}>
                        👨‍🏫 {t.full_name}
                      </SelectItem>
                    ))}
                    <SelectItem disabled>--- Administração ---</SelectItem>
                    {admins.map(a => (
                      <SelectItem key={a.id} value={a.email}>
                        🏢 {a.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Prioridade</Label>
                <Select value={newMessage.priority} onValueChange={(v) => setNewMessage({...newMessage, priority: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Assunto *</Label>
                <Input
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                  placeholder="Assunto da mensagem..."
                />
              </div>

              <div>
                <Label>Mensagem *</Label>
                <Textarea
                  value={newMessage.body}
                  onChange={(e) => setNewMessage({...newMessage, body: e.target.value})}
                  placeholder="Digite sua mensagem..."
                  rows={10}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSendMessage} style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Mensagem
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setNewMessage({ to_email: '', subject: '', body: '', priority: 'normal' })}
                >
                  Limpar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Inbox View */}
        {view === 'inbox' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
                Caixa de Entrada ({unreadCount} não lidas)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedMessage ? (
                <div className="space-y-4">
                  <Button variant="ghost" onClick={() => setSelectedMessage(null)}>
                    ← Voltar
                  </Button>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg mb-2">{selectedMessage.subject}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            De: {selectedMessage.from_email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(selectedMessage.created_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </span>
                        </div>
                      </div>
                      <Badge 
                        style={selectedMessage.priority === 'urgent' 
                          ? { backgroundColor: 'var(--error)', color: 'white' }
                          : selectedMessage.priority === 'high'
                          ? { backgroundColor: 'var(--warning)', color: 'white' }
                          : { backgroundColor: 'var(--info)', color: 'white' }
                        }
                      >
                        {selectedMessage.priority === 'urgent' ? 'URGENTE' :
                         selectedMessage.priority === 'high' ? 'Alta' :
                         selectedMessage.priority === 'normal' ? 'Normal' : 'Baixa'}
                      </Badge>
                    </div>

                    <div className="prose max-w-none">
                      <p className="whitespace-pre-wrap">{selectedMessage.body}</p>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button onClick={() => handleReply(selectedMessage)}>
                        <Reply className="w-4 h-4 mr-2" />
                        Responder
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {receivedMessages.length > 0 ? (
                    receivedMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-4 border rounded-lg cursor-pointer hover:shadow-md transition-all ${
                          !msg.read ? 'bg-blue-50 border-blue-200' : 'bg-white'
                        }`}
                        onClick={() => {
                          setSelectedMessage(msg);
                          if (!msg.read) handleMarkAsRead(msg.id);
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {!msg.read && (
                                <div className="w-2 h-2 rounded-full bg-blue-600" />
                              )}
                              <h4 className={`font-semibold ${!msg.read ? 'text-blue-900' : 'text-gray-900'}`}>
                                {msg.subject}
                              </h4>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">De: {msg.from_email}</p>
                            <p className="text-sm text-gray-500 line-clamp-2">{msg.body}</p>
                          </div>
                          <div className="text-xs text-gray-500">
                            {format(new Date(msg.created_date), 'dd/MM', { locale: ptBR })}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Mail className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p>Nenhuma mensagem na caixa de entrada</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Sent View */}
        {view === 'sent' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
                Mensagens Enviadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sentMessages.length > 0 ? (
                  sentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer"
                      onClick={() => setSelectedMessage(msg)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{msg.subject}</h4>
                          <p className="text-sm text-gray-600 mb-2">Para: {msg.to_email}</p>
                          <p className="text-sm text-gray-500 line-clamp-2">{msg.body}</p>
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(msg.created_date), 'dd/MM', { locale: ptBR })}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Send className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Nenhuma mensagem enviada</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}