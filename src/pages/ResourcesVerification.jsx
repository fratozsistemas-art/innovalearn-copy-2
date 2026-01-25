import React, { useState, useEffect } from "react";
import { ExternalResource } from "@/entities/all";
import { User } from "@/entities/User";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Save
} from "lucide-react";

export default function ResourcesVerificationPage() {
  const [user, setUser] = useState(null);
  const [resources, setResources] = useState([]);
  const [editedResources, setEditedResources] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);

      const allResources = await ExternalResource.list();
      // Ordenar por target_level e title
      allResources.sort((a, b) => {
        if (a.target_level !== b.target_level) {
          const levels = ['curiosity', 'discovery', 'pioneer', 'challenger'];
          return levels.indexOf(a.target_level) - levels.indexOf(b.target_level);
        }
        return a.title.localeCompare(b.title);
      });
      
      setResources(allResources);
    } catch (error) {
      console.error("Erro ao carregar recursos:", error);
    }
    setLoading(false);
  };

  const handleUrlChange = (resourceId, newUrl) => {
    setEditedResources(prev => ({
      ...prev,
      [resourceId]: newUrl
    }));
  };

  const handleSave = async (resource) => {
    setSaving(true);
    try {
      const newUrl = editedResources[resource.id] || resource.url;
      await ExternalResource.update(resource.id, {
        url: newUrl
      });
      
      // Remover da lista de editados
      const updated = { ...editedResources };
      delete updated[resource.id];
      setEditedResources(updated);
      
      // Recarregar dados
      await loadData();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar: " + error.message);
    }
    setSaving(false);
  };

  const testUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    const updates = Object.entries(editedResources);
    
    for (const [resourceId, newUrl] of updates) {
      try {
        await ExternalResource.update(resourceId, { url: newUrl });
      } catch (error) {
        console.error(`Erro ao salvar recurso ${resourceId}:`, error);
      }
    }
    
    setEditedResources({});
    await loadData();
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: 'var(--primary-teal)' }} />
          <p>Carregando recursos...</p>
        </div>
      </div>
    );
  }

  if (!['administrador', 'coordenador_pedagogico'].includes(user?.user_type)) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--warning)' }} />
        <h2 className="text-2xl font-bold mb-2">Acesso Restrito</h2>
        <p>Esta página é exclusiva para administradores e coordenadores.</p>
      </div>
    );
  }

  const hasEdits = Object.keys(editedResources).length > 0;

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Verificação de Recursos Externos</h1>
            <p className="text-gray-600">
              Total: {resources.length} recursos | Editados: {Object.keys(editedResources).length}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Recarregar
            </Button>
            {hasEdits && (
              <Button 
                onClick={handleSaveAll}
                disabled={saving}
                style={{ backgroundColor: 'var(--success)', color: 'white' }}
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Todos ({Object.keys(editedResources).length})
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {resources.map((resource) => {
            const currentUrl = editedResources[resource.id] || resource.url;
            const isUrlValid = testUrl(currentUrl);
            const hasEdit = editedResources[resource.id] !== undefined;

            return (
              <Card key={resource.id} className={`border-2 ${hasEdit ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2">{resource.title}</h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}>
                              {resource.target_level}
                            </Badge>
                            <Badge variant="outline">{resource.type}</Badge>
                            <Badge variant="outline">{resource.source}</Badge>
                            {resource.curator_approved && (
                              <Badge style={{ backgroundColor: 'var(--success)', color: 'white' }}>
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Aprovado
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isUrlValid ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">URL Atual:</label>
                        <div className="flex gap-2">
                          <Input
                            value={currentUrl}
                            onChange={(e) => handleUrlChange(resource.id, e.target.value)}
                            className={`flex-1 ${!isUrlValid ? 'border-red-500' : ''}`}
                            placeholder="https://..."
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => window.open(currentUrl, '_blank')}
                            disabled={!isUrlValid}
                            title="Testar link"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                        {!isUrlValid && (
                          <p className="text-sm text-red-600">⚠️ URL inválida</p>
                        )}
                      </div>

                      {resource.description && (
                        <div>
                          <label className="text-sm font-semibold text-gray-700">Descrição:</label>
                          <p className="text-sm text-gray-600">{resource.description}</p>
                        </div>
                      )}

                      {hasEdit && (
                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={() => handleSave(resource)}
                            disabled={saving || !isUrlValid}
                            size="sm"
                            style={{ backgroundColor: 'var(--success)', color: 'white' }}
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Salvar
                          </Button>
                          <Button
                            onClick={() => {
                              const updated = { ...editedResources };
                              delete updated[resource.id];
                              setEditedResources(updated);
                            }}
                            size="sm"
                            variant="outline"
                          >
                            Cancelar
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

      </div>
    </div>
  );
}