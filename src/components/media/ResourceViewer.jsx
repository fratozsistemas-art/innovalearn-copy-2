import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, Link as LinkIcon, Download } from "lucide-react";
import YouTubePlayer from "./YouTubePlayer";

/**
 * ResourceViewer - Visualizador universal de recursos dentro da plataforma
 * 
 * Mantém alunos na plataforma ao invés de abrir links externos
 */

const isYouTubeUrl = (url) => {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be');
};

const isPDFUrl = (url) => {
  if (!url) return false;
  return url.toLowerCase().endsWith('.pdf') || url.includes('pdf');
};

const isImageUrl = (url) => {
  if (!url) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
};

export default function ResourceViewer({ resource, isOpen, onClose, onAccessComplete }) {
  const [startTime] = useState(Date.now());

  const handleClose = () => {
    // Calcular tempo gasto
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    if (onAccessComplete) {
      onAccessComplete({
        time_spent_seconds: timeSpent,
        completed: timeSpent > 30 // Considera completado se passou mais de 30s
      });
    }
    
    onClose();
  };

  if (!resource) return null;

  const renderContent = () => {
    const url = resource.url;

    // YouTube Video
    if (isYouTubeUrl(url)) {
      return (
        <div className="w-full">
          <YouTubePlayer 
            url={url} 
            title={resource.title}
            showExternalLink={false} // NÃO mostrar link externo
          />
          {resource.description && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">{resource.description}</p>
            </div>
          )}
        </div>
      );
    }

    // PDF
    if (isPDFUrl(url)) {
      return (
        <div className="w-full h-[600px]">
          <iframe
            src={url}
            title={resource.title}
            className="w-full h-full rounded-lg border-2 border-gray-200"
            style={{ minHeight: '600px' }}
          />
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              onClick={() => window.open(url, '_blank')}
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar PDF
            </Button>
          </div>
        </div>
      );
    }

    // Imagem
    if (isImageUrl(url)) {
      return (
        <div className="w-full flex flex-col items-center">
          <img 
            src={url} 
            alt={resource.title}
            className="max-w-full max-h-[600px] rounded-lg shadow-lg"
          />
          {resource.description && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg w-full">
              <p className="text-sm text-gray-700">{resource.description}</p>
            </div>
          )}
        </div>
      );
    }

    // Website/Link genérico - embed em iframe
    return (
      <div className="w-full">
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <AlertDescription className="flex items-center justify-between">
            <span className="text-sm">
              Conteúdo externo carregado de forma segura dentro da plataforma
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(url, '_blank')}
            >
              <LinkIcon className="w-3 h-3 mr-2" />
              Abrir em nova aba
            </Button>
          </AlertDescription>
        </Alert>
        <iframe
          src={url}
          title={resource.title}
          className="w-full rounded-lg border-2 border-gray-200"
          style={{ minHeight: '600px', height: '70vh' }}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold mb-2">
                {resource.title}
              </DialogTitle>
              {resource.type && (
                <Badge variant="outline" className="mb-2">
                  {resource.type}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="mt-4">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}