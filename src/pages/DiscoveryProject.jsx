import React, { useState, useEffect, useCallback } from "react";
import { DiscoveryProject, PythonAssessment } from "@/entities/all";
import { User } from "@/entities/User";
import { InvokeLLM } from "@/integrations/Core";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Save, 
  Code,
  BarChart3,
  Users,
  CheckCircle2
} from "lucide-react";

const MonacoEditor = React.lazy(() => import('@monaco-editor/react'));

export default function DiscoveryProjectPage() {
  const [user, setUser] = useState(null);
  const [project, setProject] = useState(null);
  const [pythonCode, setPythonCode] = useState('# Seu código Python aqui\nimport pandas as pd\nimport numpy as np\n\n');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadProject = useCallback(async () => {
    const userData = await User.me();
    setUser(userData);

    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (projectId) {
      const projectData = await DiscoveryProject.filter({ id: projectId });
      if (projectData.length > 0) {
        setProject(projectData[0]);
        setPythonCode(projectData[0].python_code || '# Seu código Python aqui\nimport pandas as pd\nimport numpy as np\n\n');
      }
    }
  }, []);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  const runCode = async () => {
    setIsRunning(true);
    setOutput('🚀 Executando código Python...\n\n');

    try {
      const result = await InvokeLLM({
        prompt: `
Você é um interpretador Python educacional para crianças de 9+ anos.

CÓDIGO SUBMETIDO:
\`\`\`python
${pythonCode}
\`\`\`

TAREFA:
1. Analise o código Python
2. Simule a execução e retorne o output esperado
3. Se houver erros, explique de forma amigável para crianças
4. Se o código usar pandas/numpy/scikit-learn, simule outputs realistas

Retorne APENAS o output da execução ou mensagem de erro amigável.
`,
        response_json_schema: {
          type: "object",
          properties: {
            output: { type: "string" },
            has_error: { type: "boolean" },
            error_message: { type: "string" },
            execution_time: { type: "number" }
          }
        }
      });

      if (result.has_error) {
        setOutput(`❌ Erro encontrado:\n\n${result.error_message}\n\n💡 Dica: Revise seu código e tente novamente!`);
      } else {
        setOutput(`✅ Código executado com sucesso!\n\nOutput:\n${result.output}\n\n⏱️ Tempo de execução: ${result.execution_time}ms`);
      }

    } catch (error) {
      setOutput(`❌ Erro ao executar código:\n\n${error.message}`);
    }

    setIsRunning(false);
  };

  const saveProject = async () => {
    setIsSaving(true);

    try {
      await DiscoveryProject.update(project.id, {
        python_code: pythonCode,
        status: determineProjectStatus(pythonCode)
      });

      setOutput('💾 Projeto salvo com sucesso!\n\n');

    } catch (error) {
      setOutput(`❌ Erro ao salvar: ${error.message}`);
    }

    setIsSaving(false);
  };

  const assessCode = async () => {
    setOutput('🤖 Avaliando seu código Python...\n\n');

    try {
      const assessment = await InvokeLLM({
        prompt: `
Você é um avaliador de código Python para estudantes de 9+ anos no programa Discovery.

CÓDIGO SUBMETIDO:
\`\`\`python
${pythonCode}
\`\`\`

AVALIE:
1. Correção sintática (0-100)
2. Estruturação do código (0-100)
3. Eficiência algorítmica (0-100)
4. Uso de bibliotecas (0-100)
5. Qualidade de documentação (0-100)
6. Conformidade PEP8 (0-100)

Forneça:
- Scores numéricos
- Feedback construtivo e amigável
- 3 sugestões de melhoria específicas
- Próximos passos de aprendizado
`,
        response_json_schema: {
          type: "object",
          properties: {
            syntax_correctness: { type: "number" },
            code_structure: { type: "number" },
            algorithm_efficiency: { type: "number" },
            library_usage: { type: "number" },
            documentation_quality: { type: "number" },
            pep8_compliance: { type: "number" },
            overall_score: { type: "number" },
            feedback: { type: "string" },
            improvements: { type: "array", items: { type: "string" } },
            next_steps: { type: "array", items: { type: "string" } }
          }
        }
      });

      await PythonAssessment.create({
        student_email: user.email,
        project_id: project.id,
        code_submitted: pythonCode,
        ...assessment
      });

      setOutput(`
📊 AVALIAÇÃO DO SEU CÓDIGO PYTHON

Score Geral: ${assessment.overall_score}/100

📈 Detalhes:
- Sintaxe: ${assessment.syntax_correctness}/100
- Estrutura: ${assessment.code_structure}/100
- Eficiência: ${assessment.algorithm_efficiency}/100
- Uso de Bibliotecas: ${assessment.library_usage}/100
- Documentação: ${assessment.documentation_quality}/100
- PEP8: ${assessment.pep8_compliance}/100

💬 Feedback:
${assessment.feedback}

🎯 Sugestões de Melhoria:
${assessment.improvements.map((imp, idx) => `${idx + 1}. ${imp}`).join('\n')}

📚 Próximos Passos:
${assessment.next_steps.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}
      `);

    } catch (error) {
      setOutput(`❌ Erro na avaliação: ${error.message}`);
    }
  };

  const determineProjectStatus = (code) => {
    if (code.includes('import') && code.length > 200) return 'modeling';
    if (code.includes('pd.read') || code.includes('DataFrame')) return 'eda';
    return 'planning';
  };

  if (!project) {
    return <div className="p-8">Carregando projeto...</div>;
  }

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-[1800px] mx-auto space-y-6">
        <Card className="card-innova border-none shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-heading">
                  {project.project_name}
                </CardTitle>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Módulo: {project.module_id}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={saveProject}
                  disabled={isSaving}
                  variant="outline"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </Button>
                <Button 
                  onClick={runCode}
                  disabled={isRunning}
                  className="btn-primary"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isRunning ? 'Executando...' : 'Executar'}
                </Button>
                <Button 
                  onClick={assessCode}
                  style={{ backgroundColor: 'var(--accent-orange)', color: 'white' }}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Avaliar Código
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="card-innova border-none shadow-lg">
            <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
              <CardTitle className="flex items-center gap-2 font-heading">
                <Code className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
                Editor Python
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <React.Suspense fallback={<div className="p-4">Carregando editor...</div>}>
                <MonacoEditor
                  height="600px"
                  language="python"
                  theme="vs-dark"
                  value={pythonCode}
                  onChange={(value) => setPythonCode(value || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true
                  }}
                />
              </React.Suspense>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="card-innova border-none shadow-lg">
              <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
                <CardTitle className="flex items-center gap-2 font-heading">
                  <BarChart3 className="w-5 h-5" style={{ color: 'var(--success)' }} />
                  Output
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <pre 
                  className="p-4 rounded-lg overflow-auto"
                  style={{ 
                    backgroundColor: '#1e1e1e',
                    color: '#d4d4d4',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    minHeight: '300px',
                    maxHeight: '300px'
                  }}
                >
                  {output || '⚡ Pronto para executar seu código Python!\n\nClique em "Executar" para ver o resultado.'}
                </pre>
              </CardContent>
            </Card>

            {project.stakeholders && project.stakeholders.length > 0 && (
              <Card className="card-innova border-none shadow-lg">
                <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
                  <CardTitle className="flex items-center gap-2 font-heading">
                    <Users className="w-5 h-5" style={{ color: 'var(--info)' }} />
                    Stakeholders Reais
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {project.stakeholders.map((stakeholder, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: 'var(--neutral-light)' }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4" style={{ color: 'var(--info)' }} />
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {stakeholder.name}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {stakeholder.organization}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}