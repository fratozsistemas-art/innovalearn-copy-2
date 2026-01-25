import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  BarChart3, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon,
  Download,
  RefreshCw,
  Sparkles,
  Target,
  Activity,
  Eye
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { useCurrentUser } from "@/components/hooks/useUser";

const COLORS = ['#00A99D', '#FF6F3C', '#FFC857', '#3498DB', '#9B59B6', '#27AE60', '#E74C3C', '#F39C12'];

const CHART_TYPES = [
  { value: 'bar', label: 'Gráfico de Barras', icon: BarChart3 },
  { value: 'line', label: 'Gráfico de Linha', icon: LineChartIcon },
  { value: 'area', label: 'Gráfico de Área', icon: Activity },
  { value: 'pie', label: 'Gráfico de Pizza', icon: PieChartIcon },
  { value: 'radar', label: 'Gráfico Radar', icon: Target }
];

const DATA_SOURCES = [
  { value: 'student_progress', label: 'Progresso dos Alunos', entity: 'StudentProgress' },
  { value: 'enrollments', label: 'Matrículas por Curso', entity: 'Enrollment' },
  { value: 'assignments', label: 'Tarefas e Entregas', entity: 'Assignment' },
  { value: 'gamification', label: 'Gamificação e XP', entity: 'GamificationProfile' },
  { value: 'vark_distribution', label: 'Distribuição VARK', entity: 'User' },
  { value: 'class_performance', label: 'Performance por Turma', entity: 'Class' }
];

export default function DataVisualizationPage() {
  const { data: user } = useCurrentUser();
  const [chartType, setChartType] = useState('bar');
  const [dataSource, setDataSource] = useState('student_progress');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chartConfig, setChartConfig] = useState({
    title: 'Meu Gráfico',
    xAxisKey: 'name',
    dataKeys: ['value'],
    colors: COLORS
  });

  // Fetch data based on selected source
  const { data: rawData, isLoading: dataLoading, refetch } = useQuery({
    queryKey: ['visualization-data', dataSource],
    queryFn: async () => {
      const sourceConfig = DATA_SOURCES.find(s => s.value === dataSource);
      if (!sourceConfig) return [];

      switch (dataSource) {
        case 'student_progress': {
          const progress = await base44.entities.StudentProgress.list();
          const users = await base44.entities.User.list();
          
          // Aggregate by student
          const studentMap = {};
          progress.forEach(p => {
            if (!studentMap[p.student_email]) {
              studentMap[p.student_email] = {
                total: 0,
                completed: 0,
                avgScore: 0,
                scores: []
              };
            }
            studentMap[p.student_email].total++;
            if (p.completed) studentMap[p.student_email].completed++;
            if (p.quiz_score) studentMap[p.student_email].scores.push(p.quiz_score);
          });

          return Object.entries(studentMap).map(([email, stats]) => {
            const user = users.find(u => u.email === email);
            const avgScore = stats.scores.length > 0 
              ? stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length 
              : 0;
            
            return {
              name: user?.full_name || email.split('@')[0],
              completed: stats.completed,
              total: stats.total,
              completionRate: Math.round((stats.completed / stats.total) * 100),
              avgScore: Math.round(avgScore)
            };
          });
        }

        case 'enrollments': {
          const enrollments = await base44.entities.Enrollment.list();
          const courseMap = {};
          
          enrollments.forEach(e => {
            if (!courseMap[e.course_id]) {
              courseMap[e.course_id] = {
                count: 0,
                avgProgress: 0,
                totalProgress: 0
              };
            }
            courseMap[e.course_id].count++;
            courseMap[e.course_id].totalProgress += (e.progress || 0);
          });

          return Object.entries(courseMap).map(([course, stats]) => ({
            name: course.charAt(0).toUpperCase() + course.slice(1),
            students: stats.count,
            avgProgress: Math.round(stats.totalProgress / stats.count)
          }));
        }

        case 'assignments': {
          const assignments = await base44.entities.Assignment.list();
          const statusMap = {
            pending: 0,
            submitted: 0,
            graded: 0,
            late: 0
          };

          assignments.forEach(a => {
            statusMap[a.status] = (statusMap[a.status] || 0) + 1;
          });

          return Object.entries(statusMap).map(([status, count]) => ({
            name: status === 'pending' ? 'Pendente' :
                  status === 'submitted' ? 'Submetida' :
                  status === 'graded' ? 'Corrigida' : 'Atrasada',
            value: count
          }));
        }

        case 'gamification': {
          const profiles = await base44.entities.GamificationProfile.list();
          const users = await base44.entities.User.list();

          return profiles
            .sort((a, b) => (b.innova_coins || 0) - (a.innova_coins || 0))
            .slice(0, 10)
            .map(p => {
              const user = users.find(u => u.email === p.student_email);
              return {
                name: user?.full_name || p.student_email.split('@')[0],
                coins: p.innova_coins || 0,
                level: p.level || 1,
                badges: p.badges?.length || 0
              };
            });
        }

        case 'vark_distribution': {
          const users = await base44.entities.User.list();
          const varkMap = {
            visual: 0,
            auditory: 0,
            read_write: 0,
            kinesthetic: 0,
            multimodal: 0
          };

          users.forEach(u => {
            if (u.vark_primary_style) {
              varkMap[u.vark_primary_style]++;
            }
          });

          return Object.entries(varkMap).map(([style, count]) => ({
            name: style === 'visual' ? 'Visual' :
                  style === 'auditory' ? 'Auditivo' :
                  style === 'read_write' ? 'Leitura/Escrita' :
                  style === 'kinesthetic' ? 'Cinestésico' : 'Multimodal',
            value: count
          }));
        }

        default:
          return [];
      }
    },
    enabled: !!dataSource
  });

  useEffect(() => {
    if (rawData && rawData.length > 0) {
      setChartData(rawData);
      
      // Auto-configure based on data structure
      const firstItem = rawData[0];
      const keys = Object.keys(firstItem);
      const nameKey = keys.find(k => k === 'name') || keys[0];
      const valueKeys = keys.filter(k => k !== 'name' && typeof firstItem[k] === 'number');

      setChartConfig(prev => ({
        ...prev,
        xAxisKey: nameKey,
        dataKeys: valueKeys.length > 0 ? valueKeys : ['value']
      }));
    }
  }, [rawData]);

  const renderChart = () => {
    if (!chartData || chartData.length === 0) {
      return (
        <div className="h-96 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Selecione uma fonte de dados</p>
          </div>
        </div>
      );
    }

    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 60 }
    };

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={chartConfig.xAxisKey} 
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              {chartConfig.dataKeys.map((key, idx) => (
                <Bar 
                  key={key} 
                  dataKey={key} 
                  fill={COLORS[idx % COLORS.length]}
                  name={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={chartConfig.xAxisKey}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              {chartConfig.dataKeys.map((key, idx) => (
                <Line 
                  key={key} 
                  type="monotone"
                  dataKey={key} 
                  stroke={COLORS[idx % COLORS.length]}
                  strokeWidth={2}
                  name={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={chartConfig.xAxisKey}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              {chartConfig.dataKeys.map((key, idx) => (
                <Area 
                  key={key} 
                  type="monotone"
                  dataKey={key} 
                  stroke={COLORS[idx % COLORS.length]}
                  fill={COLORS[idx % COLORS.length]}
                  fillOpacity={0.6}
                  name={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey={chartConfig.dataKeys[0]}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey={chartConfig.xAxisKey} />
              <PolarRadiusAxis />
              {chartConfig.dataKeys.map((key, idx) => (
                <Radar 
                  key={key}
                  name={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  dataKey={key} 
                  stroke={COLORS[idx % COLORS.length]} 
                  fill={COLORS[idx % COLORS.length]} 
                  fillOpacity={0.6} 
                />
              ))}
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const exportChart = async (format) => {
    // Simple export - in production, use html2canvas or similar
    const chartTitle = `${chartConfig.title}-${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'json') {
      const dataStr = JSON.stringify(chartData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${chartTitle}.json`;
      link.click();
    } else if (format === 'csv') {
      const headers = Object.keys(chartData[0]);
      const csvContent = [
        headers.join(','),
        ...chartData.map(row => headers.map(h => row[h]).join(','))
      ].join('\n');
      
      const dataBlob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${chartTitle}.csv`;
      link.click();
    }
  };

  if (!user) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">
              📊 Visualização de Dados
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Crie gráficos interativos e analise tendências
            </p>
          </div>
          <Badge className="border-0" style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}>
            <Sparkles className="w-4 h-4 mr-1" />
            Interativo
          </Badge>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Controls Panel */}
          <Card className="lg:col-span-1 border-2" style={{ borderColor: 'var(--primary-teal)' }}>
            <CardHeader style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}>
              <CardTitle className="text-lg">Configurações</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div>
                <Label className="mb-2 block font-semibold">Fonte de Dados</Label>
                <Select value={dataSource} onValueChange={setDataSource}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DATA_SOURCES.map(source => (
                      <SelectItem key={source.value} value={source.value}>
                        {source.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-2">
                  {chartData.length} registros
                </p>
              </div>

              <div>
                <Label className="mb-2 block font-semibold">Tipo de Gráfico</Label>
                <div className="space-y-2">
                  {CHART_TYPES.map(type => {
                    const Icon = type.icon;
                    return (
                      <Button
                        key={type.value}
                        variant={chartType === type.value ? 'default' : 'outline'}
                        className="w-full justify-start"
                        onClick={() => setChartType(type.value)}
                        style={chartType === type.value ? {
                          backgroundColor: 'var(--primary-teal)',
                          color: 'white'
                        } : {}}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {type.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => refetch()}
                  disabled={dataLoading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${dataLoading ? 'animate-spin' : ''}`} />
                  Atualizar Dados
                </Button>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Exportar:</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => exportChart('json')}
                      disabled={!chartData.length}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      JSON
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => exportChart('csv')}
                      disabled={!chartData.length}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      CSV
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chart Display */}
          <Card className="lg:col-span-3 border-2" style={{ borderColor: 'var(--neutral-medium)' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-heading">
                  {DATA_SOURCES.find(s => s.value === dataSource)?.label || 'Gráfico'}
                </CardTitle>
                <Badge variant="outline">
                  {CHART_TYPES.find(t => t.value === chartType)?.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {dataLoading ? (
                <div className="h-96 flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 animate-spin" style={{ color: 'var(--primary-teal)' }} />
                </div>
              ) : (
                <div className="space-y-6">
                  {renderChart()}
                  
                  {chartData.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
                      <div className="text-center">
                        <p className="text-2xl font-bold" style={{ color: 'var(--primary-teal)' }}>
                          {chartData.length}
                        </p>
                        <p className="text-xs text-gray-600">Pontos de Dados</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold" style={{ color: 'var(--success)' }}>
                          {chartConfig.dataKeys.length}
                        </p>
                        <p className="text-xs text-gray-600">Métricas</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold" style={{ color: 'var(--info)' }}>
                          {CHART_TYPES.find(t => t.value === chartType)?.label.split(' ')[2] || chartType}
                        </p>
                        <p className="text-xs text-gray-600">Tipo</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold" style={{ color: 'var(--accent-orange)' }}>
                          Live
                        </p>
                        <p className="text-xs text-gray-600">Dados em Tempo Real</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Insights */}
        {chartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
                Insights Rápidos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
                  <p className="text-sm text-gray-600 mb-1">Total de Registros</p>
                  <p className="text-2xl font-bold">{chartData.length}</p>
                </div>
                
                {chartConfig.dataKeys.map((key, idx) => {
                  const values = chartData.map(d => d[key]).filter(v => typeof v === 'number');
                  if (values.length === 0) return null;
                  
                  const avg = values.reduce((a, b) => a + b, 0) / values.length;
                  const max = Math.max(...values);
                  
                  return (
                    <div key={key} className="p-4 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
                      <p className="text-sm text-gray-600 mb-1">
                        {key.charAt(0).toUpperCase() + key.slice(1)} (Média)
                      </p>
                      <p className="text-2xl font-bold" style={{ color: COLORS[idx % COLORS.length] }}>
                        {avg.toFixed(1)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Máximo: {max}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}