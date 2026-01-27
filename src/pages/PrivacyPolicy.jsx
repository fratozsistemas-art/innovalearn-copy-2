import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Shield, Eye, Lock, AlertCircle, Mail, FileText } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: 'var(--primary-teal)' }}
          >
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-heading font-bold" style={{ color: 'var(--text-primary)' }}>
              Política de Privacidade
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Última atualização: 27 de Janeiro de 2026
            </p>
          </div>
        </div>

        {/* Introduction */}
        <Card className="border-l-4" style={{ borderColor: 'var(--primary-teal)' }}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Eye className="w-8 h-8 flex-shrink-0" style={{ color: 'var(--primary-teal)' }} />
              <div>
                <h3 className="text-lg font-semibold mb-2">Transparência em Primeiro Lugar</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  A <strong>InnovaLearn Academy</strong> ("InnovaLearn", "nós" ou "nossa") zela pela privacidade 
                  de todos os estudantes, pais, responsáveis e educadores que fazem parte da nossa comunidade. 
                  Este documento explica de forma clara e transparente como coletamos, usamos, armazenamos e 
                  protegemos seus dados pessoais, sempre em conformidade com a Lei Geral de Proteção de Dados (LGPD).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Info */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Lock className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--primary-teal)' }} />
              <h4 className="font-semibold mb-1">Segurança</h4>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Seus dados são criptografados e protegidos
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Eye className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--success)' }} />
              <h4 className="font-semibold mb-1">Transparência</h4>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Você sempre sabe o que fazemos com seus dados
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Shield className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--accent-orange)' }} />
              <h4 className="font-semibold mb-1">Conformidade</h4>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                100% em conformidade com a LGPD
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
            <CardTitle>1. Quem Somos</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              A InnovaLearn Academy é uma plataforma educacional inovadora que oferece experiências de aprendizado 
              personalizadas para crianças e adolescentes de 6 a 16 anos. Utilizamos inteligência artificial e 
              metodologias pedagógicas modernas para criar jornadas de aprendizado únicas e envolventes.
            </p>
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
              <p className="text-sm font-semibold mb-2">Encarregado de Proteção de Dados (DPO):</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                <Mail className="w-4 h-4 inline mr-2" />
                Email: dpo@innovalearn.com.br
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
            <CardTitle>2. Quais Dados Coletamos</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-2">📝 Dados Cadastrais de Estudantes:</h4>
                <ul className="list-disc list-inside text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                  <li>Nome completo, data de nascimento, CPF</li>
                  <li>Endereço, telefone e email</li>
                  <li>Nível de escolaridade e curso matriculado (Curiosity, Discovery, Pioneer ou Challenger)</li>
                  <li>Informações de responsáveis (nome, CPF, email, telefone)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">👨‍👩‍👧 Dados de Pais e Responsáveis:</h4>
                <ul className="list-disc list-inside text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                  <li>Nome completo, CPF, documento de identidade</li>
                  <li>Endereço completo, telefone e email</li>
                  <li>Grau de parentesco com o estudante</li>
                  <li>Dados de consentimento parental (conforme LGPD)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">👩‍🏫 Dados de Professores e Educadores:</h4>
                <ul className="list-disc list-inside text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                  <li>Nome completo, CPF, documento de identidade</li>
                  <li>Formação acadêmica e certificações</li>
                  <li>Email profissional e telefone</li>
                  <li>Dados bancários para pagamento (quando aplicável)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">📊 Dados de Desempenho e Aprendizado:</h4>
                <ul className="list-disc list-inside text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                  <li>Progresso nas aulas e módulos</li>
                  <li>Notas em atividades e avaliações</li>
                  <li>Tempo dedicado ao estudo</li>
                  <li>Estilo de aprendizado VARK (Visual, Auditivo, Leitura/Escrita, Cinestésico)</li>
                  <li>Interações com o assistente de IA (InnAI)</li>
                  <li>Conquistas, badges e Innova Coins</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">💻 Dados de Navegação e Uso:</h4>
                <ul className="list-disc list-inside text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                  <li>Endereço IP, tipo de navegador e dispositivo</li>
                  <li>Horários de acesso e páginas visitadas</li>
                  <li>Cookies e identificadores de sessão</li>
                  <li>Logs de sistema e eventos de segurança</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
            <CardTitle>3. Por Que Coletamos Seus Dados</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Coletamos e utilizamos seus dados pessoais com base nas seguintes razões legais:
            </p>
            <div className="space-y-3">
              <div className="p-4 rounded-lg border-l-4" style={{ borderColor: 'var(--primary-teal)', backgroundColor: 'var(--neutral-light)' }}>
                <h4 className="font-semibold mb-2">✅ Execução de Contrato</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Para fornecer os serviços educacionais contratados, gerenciar matrículas, processar pagamentos 
                  e entregar conteúdo personalizado aos estudantes.
                </p>
              </div>

              <div className="p-4 rounded-lg border-l-4" style={{ borderColor: 'var(--success)', backgroundColor: 'var(--neutral-light)' }}>
                <h4 className="font-semibold mb-2">📜 Obrigação Legal</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Para cumprir exigências legais, como emissão de certificados, registros escolares e 
                  atendimento a solicitações de órgãos reguladores.
                </p>
              </div>

              <div className="p-4 rounded-lg border-l-4" style={{ borderColor: 'var(--accent-yellow)', backgroundColor: 'var(--neutral-light)' }}>
                <h4 className="font-semibold mb-2">👍 Consentimento</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Quando solicitamos sua autorização expressa, como para envio de comunicações de marketing, 
                  uso de imagens em materiais promocionais ou coleta de dados sensíveis.
                </p>
              </div>

              <div className="p-4 rounded-lg border-l-4" style={{ borderColor: 'var(--accent-orange)', backgroundColor: 'var(--neutral-light)' }}>
                <h4 className="font-semibold mb-2">🎯 Interesse Legítimo</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Para melhorar nossos serviços, personalizar a experiência de aprendizado, prevenir fraudes, 
                  garantir a segurança da plataforma e realizar análises estatísticas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
            <CardTitle>4. Como Usamos Inteligência Artificial</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
              <AlertCircle className="w-6 h-6 flex-shrink-0" style={{ color: 'var(--info)' }} />
              <div>
                <h4 className="font-semibold mb-2">InnAI - Nosso Assistente de IA</h4>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  A InnovaLearn utiliza inteligência artificial para personalizar a experiência de aprendizado. 
                  Nosso assistente InnAI analisa padrões de estudo, preferências e desempenho para:
                </p>
                <ul className="list-disc list-inside text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                  <li>Recomendar conteúdos e atividades adequados ao nível do estudante</li>
                  <li>Adaptar o ritmo e estilo de ensino ao perfil VARK</li>
                  <li>Identificar dificuldades precocemente e sugerir intervenções</li>
                  <li>Gerar feedback personalizado sobre atividades e projetos</li>
                  <li>Responder dúvidas e fornecer suporte educacional 24/7</li>
                </ul>
                <p className="text-sm mt-3 font-semibold" style={{ color: 'var(--primary-teal)' }}>
                  ⚠️ Importante: A IA nunca substitui professores humanos. Ela é uma ferramenta complementar 
                  que potencializa o trabalho dos educadores.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
            <CardTitle>5. Compartilhamento de Dados</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Seus dados podem ser compartilhados apenas nas seguintes situações:
            </p>
            <ul className="list-disc list-inside text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
              <li><strong>Com provedores de serviços:</strong> Empresas que nos auxiliam em hospedagem, 
              processamento de pagamentos, envio de emails e análises (todos com obrigação de confidencialidade)</li>
              <li><strong>Com autoridades:</strong> Quando exigido por lei ou ordem judicial</li>
              <li><strong>Em caso de reestruturação:</strong> Fusão, aquisição ou venda de ativos 
              (sempre garantindo a continuidade da proteção)</li>
              <li><strong>Com seu consentimento:</strong> Quando você autorizar expressamente</li>
            </ul>
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--error)', opacity: 0.1 }}>
              <p className="text-sm font-semibold" style={{ color: 'var(--error)' }}>
                ❌ Nunca vendemos seus dados pessoais para terceiros!
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
            <CardTitle>6. Seus Direitos (LGPD)</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              De acordo com a LGPD, você tem os seguintes direitos sobre seus dados pessoais:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg border">
                <h5 className="font-semibold text-sm mb-1">📋 Confirmação e Acesso</h5>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Confirmar se processamos seus dados e acessá-los
                </p>
              </div>
              <div className="p-3 rounded-lg border">
                <h5 className="font-semibold text-sm mb-1">✏️ Correção</h5>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Corrigir dados incompletos, inexatos ou desatualizados
                </p>
              </div>
              <div className="p-3 rounded-lg border">
                <h5 className="font-semibold text-sm mb-1">🔒 Anonimização</h5>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Solicitar anonimização de dados desnecessários
                </p>
              </div>
              <div className="p-3 rounded-lg border">
                <h5 className="font-semibold text-sm mb-1">📤 Portabilidade</h5>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Receber seus dados em formato estruturado
                </p>
              </div>
              <div className="p-3 rounded-lg border">
                <h5 className="font-semibold text-sm mb-1">🗑️ Eliminação</h5>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Solicitar exclusão de dados (exceto os legalmente obrigatórios)
                </p>
              </div>
              <div className="p-3 rounded-lg border">
                <h5 className="font-semibold text-sm mb-1">ℹ️ Informação</h5>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Saber sobre compartilhamento de dados com terceiros
                </p>
              </div>
              <div className="p-3 rounded-lg border">
                <h5 className="font-semibold text-sm mb-1">🚫 Revogação</h5>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Revogar consentimento a qualquer momento
                </p>
              </div>
              <div className="p-3 rounded-lg border">
                <h5 className="font-semibold text-sm mb-1">⚖️ Oposição</h5>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Opor-se ao tratamento em situações específicas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
            <CardTitle>7. Segurança e Retenção</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-2">🔐 Medidas de Segurança</h4>
                <ul className="list-disc list-inside text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                  <li>Criptografia de dados em trânsito e em repouso</li>
                  <li>Controles de acesso rigorosos e autenticação multifator</li>
                  <li>Monitoramento contínuo de segurança e logs de auditoria</li>
                  <li>Backups regulares e planos de recuperação de desastres</li>
                  <li>Treinamento contínuo da equipe em proteção de dados</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">⏱️ Tempo de Retenção</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Mantemos seus dados apenas pelo tempo necessário para cumprir as finalidades descritas 
                  ou conforme exigido por lei. Dados acadêmicos podem ser retidos por até 5 anos após 
                  o término da relação contratual, conforme legislação educacional.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
            <CardTitle>8. Dados de Menores de Idade</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-lg" style={{ backgroundColor: '#FEF3C7' }}>
              <AlertCircle className="w-6 h-6 flex-shrink-0" style={{ color: 'var(--warning)' }} />
              <div>
                <h4 className="font-semibold mb-2">Proteção Especial para Crianças e Adolescentes</h4>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  A InnovaLearn atende estudantes de 6 a 16 anos. O tratamento de dados de menores 
                  segue regras especiais de proteção:
                </p>
                <ul className="list-disc list-inside text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                  <li><strong>Consentimento Parental:</strong> Exigimos autorização expressa de pais ou responsáveis</li>
                  <li><strong>Finalidade Educacional:</strong> Dados são usados exclusivamente para aprendizado</li>
                  <li><strong>Controles de Privacidade:</strong> Pais têm acesso total aos dados e atividades dos filhos</li>
                  <li><strong>Conteúdo Apropriado:</strong> Todo conteúdo é verificado e adequado à faixa etária</li>
                  <li><strong>Sem Publicidade:</strong> Não exibimos anúncios de terceiros para menores</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
            <CardTitle>9. Cookies e Tecnologias Similares</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência, incluindo:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
              <li><strong>Cookies Essenciais:</strong> Necessários para o funcionamento da plataforma</li>
              <li><strong>Cookies de Desempenho:</strong> Ajudam a entender como você usa o site</li>
              <li><strong>Cookies de Funcionalidade:</strong> Lembram suas preferências e configurações</li>
              <li><strong>Cookies Analíticos:</strong> Permitem análises estatísticas anônimas</li>
            </ul>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Você pode gerenciar cookies nas configurações do seu navegador, mas isso pode afetar 
              algumas funcionalidades da plataforma.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
            <CardTitle>10. Alterações nesta Política</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Esta Política de Privacidade pode ser atualizada periodicamente para refletir mudanças em 
              nossas práticas ou na legislação. Notificaremos você sobre alterações significativas por 
              email ou através de aviso destacado na plataforma.
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Data da última atualização: <strong>27 de Janeiro de 2026</strong>
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4" style={{ borderColor: 'var(--primary-teal)' }}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Mail className="w-8 h-8 flex-shrink-0" style={{ color: 'var(--primary-teal)' }} />
              <div>
                <h3 className="text-lg font-semibold mb-2">Como Entrar em Contato</h3>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Para exercer seus direitos, esclarecer dúvidas ou fazer solicitações relacionadas 
                  aos seus dados pessoais, entre em contato com nosso Encarregado de Proteção de Dados:
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> dpo@innovalearn.com.br</p>
                  <p><strong>Portal de Privacidade:</strong> privacidade.innovalearn.com.br</p>
                  <p><strong>Telefone:</strong> 0800-XXX-XXXX</p>
                </div>
                <p className="text-xs mt-4" style={{ color: 'var(--text-secondary)' }}>
                  Responderemos sua solicitação em até 15 dias úteis, conforme previsto na LGPD.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}