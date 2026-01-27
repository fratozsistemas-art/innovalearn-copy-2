import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useCurrentUser } from "@/components/hooks/useUser";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Mail, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function UserManagementPage() {
  const { data: user } = useCurrentUser();
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("estudante");
  const [inviting, setInviting] = useState(false);
  const [inviteHistory, setInviteHistory] = useState([]);
  const [bulkInviting, setBulkInviting] = useState(false);

  // Lista pré-definida para convite rápido
  const quickInvites = {
    teachers: [
      "malusenacv@gmail.com",
      "lucasgdb8@gmail.com",
      "matheus.knd2@gmail.com"
    ],
    admins: [
      "mahinaegregora@gmail.com",
      "direcao@inovaacademy.com.br"
    ]
  };

  const handleInvite = async (emailToInvite, typeToInvite) => {
    try {
      const role = typeToInvite === 'administrador' ? 'admin' : 'user';
      await base44.users.inviteUser(emailToInvite, role);
      
      setInviteHistory(prev => [...prev, {
        email: emailToInvite,
        userType: typeToInvite,
        status: 'success',
        timestamp: new Date()
      }]);
      
      toast.success(`Convite enviado para ${emailToInvite}`);
      return true;
    } catch (error) {
      setInviteHistory(prev => [...prev, {
        email: emailToInvite,
        userType: typeToInvite,
        status: 'error',
        error: error.message,
        timestamp: new Date()
      }]);
      
      toast.error(`Erro ao convidar ${emailToInvite}: ${error.message}`);
      return false;
    }
  };

  const handleSingleInvite = async (e) => {
    e.preventDefault();
    if (!email) return;

    setInviting(true);
    await handleInvite(email, userType);
    setInviting(false);
    setEmail("");
  };

  const handleBulkInvite = async () => {
    setBulkInviting(true);
    
    // Convidar professores
    for (const teacherEmail of quickInvites.teachers) {
      await handleInvite(teacherEmail, "instrutor");
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Convidar admins
    for (const adminEmail of quickInvites.admins) {
      await handleInvite(adminEmail, "administrador");
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setBulkInviting(false);
    toast.success("Convites em massa enviados!");
  };

  if (user?.user_type !== 'administrador') {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Acesso Restrito</h1>
        <p className="text-gray-600 mt-2">Apenas administradores podem acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">
            👥 Gestão de Usuários
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Convidar novos professores e administradores
          </p>
        </div>

        {/* Convite Individual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Convidar Usuário Individual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSingleInvite} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input
                  type="email"
                  placeholder="email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Tipo de Usuário</label>
                <Select value={userType} onValueChange={setUserType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="estudante">Estudante</SelectItem>
                    <SelectItem value="instrutor">Instrutor/Professor</SelectItem>
                    <SelectItem value="coordenador_pedagogico">Coordenador Pedagógico</SelectItem>
                    <SelectItem value="administrador">Administrador</SelectItem>
                    <SelectItem value="pai_responsavel">Pai/Responsável</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                type="submit" 
                disabled={inviting}
                className="w-full btn-primary"
              >
                {inviting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar Convite
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Convite em Massa */}
        <Card className="border-2" style={{ borderColor: 'var(--primary-teal)' }}>
          <CardHeader style={{ backgroundColor: 'rgba(0, 169, 157, 0.1)' }}>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Convite em Massa - Time Inicial
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Professores (3)</h4>
              <div className="space-y-1">
                {quickInvites.teachers.map(email => (
                  <div key={email} className="flex items-center gap-2 text-sm">
                    <Badge variant="outline">Instrutor</Badge>
                    <span>{email}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Administradores (2)</h4>
              <div className="space-y-1">
                {quickInvites.admins.map(email => (
                  <div key={email} className="flex items-center gap-2 text-sm">
                    <Badge className="bg-purple-600 text-white">Admin</Badge>
                    <span>{email}</span>
                  </div>
                ))}
              </div>
            </div>
            <Button
              onClick={handleBulkInvite}
              disabled={bulkInviting}
              className="w-full"
              style={{ backgroundColor: 'var(--primary-teal)' }}
            >
              {bulkInviting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando convites...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar Todos os Convites (5 emails)
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Histórico de Convites */}
        {inviteHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Convites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {inviteHistory.slice().reverse().map((invite, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      {invite.status === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium">{invite.email}</p>
                        <p className="text-xs text-gray-600">
                          {invite.userType} • {invite.timestamp.toLocaleTimeString('pt-BR')}
                        </p>
                        {invite.error && (
                          <p className="text-xs text-red-600 mt-1">{invite.error}</p>
                        )}
                      </div>
                    </div>
                    <Badge className={invite.status === 'success' ? 'bg-green-600' : 'bg-red-600'}>
                      {invite.status === 'success' ? 'Enviado' : 'Erro'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}