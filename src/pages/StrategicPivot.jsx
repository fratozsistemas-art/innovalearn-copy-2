import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  Rocket, 
  Target, 
  Clock,
  DollarSign,
  Users,
  CheckCircle2,
  XCircle
} from "lucide-react";

export default function StrategicPivotPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Alert className="mb-6 border-4 border-red-500 bg-red-50">
        <AlertTriangle className="w-6 h-6 text-red-600" />
        <AlertDescription className="text-lg font-bold text-red-900">
          FEATURE FREEZE ATIVO - Apenas MVV (Minimum Viable Validation) até validação com usuários reais
        </AlertDescription>
      </Alert>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Strategic Pivot: V6.0 para V2.0</h1>
        <p className="text-xl text-gray-600">
          Decisão tomada em 27 de Janeiro de 2025 após CAIO-COS strategic assessment
        </p>
      </div>

      <Card className="mb-6 border-l-4 border-orange-500">
        <CardHeader className="bg-orange-50">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            Diagnóstico: Framework Perfectionism
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg mb-2">Sintomas Identificados:</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>256 lições definidas estruturalmente, mas 0 com conteúdo real</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>VARK scoring 0-100 implementado quando binary match seria suficiente</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>RTIE ML architecture quando rule-based shipparia mais rápido</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>IRT implementation sem 1 questão calibrada com dados reais</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>ZERO testes automatizados = bugs invisíveis</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>ZERO validação com usuários reais = risco total</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
              <p className="font-bold text-red-900 mb-2">Custo Estimado do Perfectionism:</p>
              <ul className="text-sm space-y-1 text-red-800">
                <li>• 3 meses de dev em features que usuários nunca verão</li>
                <li>• R$ 100K+ em risco de infraestrutura não validada</li>
                <li>• Oportunidade perdida: competidor lança v2.0 enquanto construímos v6.0</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 border-l-4 border-green-500">
        <CardHeader className="bg-green-50">
          <CardTitle className="flex items-center gap-2">
            <Rocket className="w-6 h-6 text-green-600" />
            Novo Plano: MVV (Minimum Viable Validation)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Timeline
              </h4>
              <Badge className="bg-blue-600 text-white px-4 py-2 text-lg">
                4 Semanas
              </Badge>
              <p className="text-sm text-gray-600 mt-2">
                Semanas 1-2: Content Sprint<br/>
                Semanas 3-4: Controlled Beta
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Investimento
              </h4>
              <Badge className="bg-green-600 text-white px-4 py-2 text-lg">
                R$ 15-25K
              </Badge>
              <p className="text-sm text-gray-600 mt-2">
                vs R$ 100K+ em infra não validada
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Escopo
              </h4>
              <Badge className="bg-purple-600 text-white px-4 py-2 text-lg">
                3 Professores + 20 Alunos
              </Badge>
              <p className="text-sm text-gray-600 mt-2">
                1 módulo apenas (Curiosity-1)
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-600" />
                Objetivo
              </h4>
              <Badge className="bg-orange-600 text-white px-4 py-2 text-lg">
                Validar Pedagogia
              </Badge>
              <p className="text-sm text-gray-600 mt-2">
                ANTES de investir em escala
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-lg mb-3">Semanas 1-2: Content Sprint</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <strong>Curar 16 lições</strong> para Curiosity Module 1
                    <p className="text-sm text-gray-600">Usar YouTube/Khan Academy/MIT OCW (pipeline auto-curation)</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <strong>VARK tagging manual</strong> de 80 recursos (5 por lição)
                    <p className="text-sm text-gray-600">Boa fé pedagógica, não perfeição técnica</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <strong>PDF lesson plans</strong> para professores (template-based)
                    <p className="text-sm text-gray-600">Não custom, usa template estruturado</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-3">Semanas 3-4: Controlled Beta</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <strong>3 professores</strong> (de rede existente)
                    <p className="text-sm text-gray-600">20 alunos total (6-7 por professor)</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <strong>Single module only</strong>: Curiosity-1 Intro to AI
                    <p className="text-sm text-gray-600">Não tentar validar tudo de uma vez</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <strong>Manual tracking</strong> (Google Sheets se necessário)
                    <p className="text-sm text-gray-600">Não precisa de analytics perfeito agora</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Critérios de Sucesso (Go/No-Go Decision)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border-2 border-green-500">
              <h4 className="font-bold text-green-900 mb-2">BETA SUCCESSFUL - Investir R$ 100K em MVP</h4>
              <ul className="text-sm space-y-1">
                <li>• Professores completam módulo delivery: SIM (3/3)</li>
                <li>• Student completion rate: maior ou igual a 70% (14/20 alunos)</li>
                <li>• VARK satisfaction score: maior ou igual a 7/10</li>
                <li>• Teacher friction: Nenhum blocker identificado</li>
              </ul>
              <p className="mt-3 font-bold text-green-900">
                AÇÃO: Launch 4-week MVP sprint (full platform) + paid pilot 100 students
              </p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-500">
              <h4 className="font-bold text-yellow-900 mb-2">BETA MIXED (50-70%) - Iterar Conteúdo</h4>
              <ul className="text-sm space-y-1">
                <li>• Completion 50-70%</li>
                <li>• VARK score 5-7/10</li>
                <li>• Teacher feedback: Bom mas precisa melhorar X</li>
              </ul>
              <p className="mt-3 font-bold text-yellow-900">
                AÇÃO: Iterar content/delivery por 2 semanas + re-test com nova cohort
              </p>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border-2 border-red-500">
              <h4 className="font-bold text-red-900 mb-2">BETA FAILED (menor que 50%) - PIVOT</h4>
              <ul className="text-sm space-y-1">
                <li>• Completion menor que 50%</li>
                <li>• VARK score menor que 5/10</li>
                <li>• Teachers: Não funciona</li>
              </ul>
              <p className="mt-3 font-bold text-red-900">
                AÇÃO: NÃO investir R$ 100K. Investigar: content quality issue OU pedagogy mismatch
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-red-500">
        <CardHeader className="bg-red-50">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            PARALELO: LGPD Compliance Phase 1 (IMEDIATO)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="mb-4 text-red-900 font-bold">
            Sem Phase 1, UMA reclamação parental pode gerar ANPD investigation e pausar operações durante remediation
          </p>

          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <strong>Contratar consultor LGPD</strong>
                <Badge className="bg-red-600 text-white">R$ 5-8K</Badge>
              </div>
              <p className="text-sm text-gray-600">Auditoria completa, não apenas policy review</p>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <strong>Implementar audit trail</strong>
                <Badge className="bg-red-600 text-white">R$ 2-3K dev</Badge>
              </div>
              <p className="text-sm text-gray-600">Logar quem acessou qual dado, quando (required para ANPD)</p>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <strong>Fluxo de consentimento parental verificável</strong>
                <Badge className="bg-red-600 text-white">R$ 1-2K dev</Badge>
              </div>
              <p className="text-sm text-gray-600">Não apenas checkbox, prova verificável</p>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <strong>Plano de notificação de breach</strong>
                <Badge className="bg-red-600 text-white">R$ 1K doc</Badge>
              </div>
              <p className="text-sm text-gray-600">Protocolo de 72 horas (Art. 48 LGPD)</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-red-100 rounded-lg border-2 border-red-300">
            <p className="font-bold text-red-900 mb-2">Total Phase 1: R$ 10-15K</p>
            <p className="text-sm text-red-800">
              Vs risco de multa até R$ 50M (Art. 52 LGPD: 2% revenue OR R$ 50M per violation)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}