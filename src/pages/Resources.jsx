import React, { useState, useEffect } from "react";
import { Resource, ExternalResource } from "@/entities/all";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileText, Video, Link as LinkIcon, Image as ImageIcon, Download, Search, ExternalLink } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const typeIcons = {
  pdf: FileText,
  video: Video,
  link: LinkIcon,
  image: ImageIcon,
  document: FileText,
  tutorial: FileText,
  projeto: FileText,
  artigo: FileText
};

const typeColors = {
  pdf: "bg-red-100 text-red-800",
  video: "bg-purple-100 text-purple-800",
  link: "bg-blue-100 text-blue-800",
  image: "bg-green-100 text-green-800",
  document: "bg-orange-100 text-orange-800",
  tutorial: "bg-indigo-100 text-indigo-800",
  projeto: "bg-pink-100 text-pink-800",
  artigo: "bg-amber-100 text-amber-800"
};

const sourceColors = {
  youtube: "bg-red-500 text-white",
  scratch: "bg-orange-500 text-white",
  khan_academy: "bg-teal-500 text-white",
  code_org: "bg-purple-500 text-white",
  outros: "bg-gray-500 text-white"
};

export default function ResourcesPage() {
  const [internalResources, setInternalResources] = useState([]);
  const [externalResources, setExternalResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("external");

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    const [internal, external] = await Promise.all([
      Resource.list(),
      ExternalResource.list()
    ]);
    
    setInternalResources(internal.filter(r => r.public));
    setExternalResources(external.filter(r => r.curator_approved));
  };

  const filteredInternalResources = internalResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || resource.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const filteredExternalResources = externalResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || resource.type === typeFilter;
    const matchesLevel = levelFilter === "all" || resource.target_level === levelFilter;
    return matchesSearch && matchesType && matchesLevel;
  });

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recursos Educacionais</h1>
          <p className="text-gray-600">Materiais de apoio internos e recursos externos curados</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="external">
              <ExternalLink className="w-4 h-4 mr-2" />
              Recursos Externos ({externalResources.length})
            </TabsTrigger>
            <TabsTrigger value="internal">
              <FileText className="w-4 h-4 mr-2" />
              Recursos Internos ({internalResources.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="external" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar recursos externos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-full md:w-48 bg-white">
                  <SelectValue placeholder="Nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Níveis</SelectItem>
                  <SelectItem value="curiosity">Curiosity</SelectItem>
                  <SelectItem value="discovery">Discovery</SelectItem>
                  <SelectItem value="pioneer">Pioneer</SelectItem>
                  <SelectItem value="challenger">Challenger</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48 bg-white">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="tutorial">Tutorial</SelectItem>
                  <SelectItem value="projeto">Projeto</SelectItem>
                  <SelectItem value="artigo">Artigo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExternalResources.map((resource) => {
                const Icon = typeIcons[resource.type] || FileText;
                return (
                  <Card 
                    key={resource.id} 
                    className="hover:shadow-xl transition-all duration-300 border-none bg-white cursor-pointer group"
                    onClick={() => window.open(resource.url, '_blank')}
                  >
                    <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-blue-50">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg flex-1 group-hover:text-blue-900 transition-colors">
                          {resource.title}
                        </CardTitle>
                        <div className={`p-2 rounded-lg ${typeColors[resource.type] || 'bg-gray-100 text-gray-800'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge className={`${sourceColors[resource.source] || 'bg-gray-500 text-white'} border-0`}>
                          {resource.source.replace('_', ' ')}
                        </Badge>
                        <Badge className="bg-purple-100 text-purple-800 border-0">
                          {resource.target_level}
                        </Badge>
                        <Badge variant="outline">
                          {'⭐'.repeat(resource.relevance_score)}
                        </Badge>
                      </div>
                      
                      {resource.subjects && resource.subjects.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {resource.subjects.slice(0, 3).map((subject, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t">
                        <Badge className={`${typeColors[resource.type]} border-0`}>
                          {resource.type.toUpperCase()}
                        </Badge>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-900 transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredExternalResources.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Nenhum recurso externo encontrado</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="internal" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar recursos internos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48 bg-white">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                  <SelectItem value="image">Imagem</SelectItem>
                  <SelectItem value="document">Documento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInternalResources.map((resource) => {
                const Icon = typeIcons[resource.type] || FileText;
                return (
                  <Card 
                    key={resource.id} 
                    className="hover:shadow-xl transition-all duration-300 border-none bg-white cursor-pointer group"
                    onClick={() => window.open(resource.url, '_blank')}
                  >
                    <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-teal-50">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg flex-1 group-hover:text-teal-900 transition-colors">
                          {resource.title}
                        </CardTitle>
                        <div className={`p-2 rounded-lg ${typeColors[resource.type]}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <p className="text-gray-600 text-sm line-clamp-3">{resource.description}</p>
                      
                      <div className="flex items-center justify-between pt-2 border-t">
                        <Badge className={`${typeColors[resource.type]} border-0`}>
                          {resource.type.toUpperCase()}
                        </Badge>
                        <Download className="w-4 h-4 text-gray-400 group-hover:text-teal-900 transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredInternalResources.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Nenhum recurso interno encontrado</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}