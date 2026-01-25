import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Extrai o ID do vídeo do YouTube de várias URLs
 */
const getYouTubeVideoId = (url) => {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
};

/**
 * YouTubePlayer - Componente para exibir vídeos do YouTube embedados
 * 
 * @param {string} url - URL do vídeo do YouTube
 * @param {string} title - Título do vídeo (para acessibilidade)
 * @param {string} aspectRatio - Proporção de tela (padrão: "16/9")
 * @param {boolean} showExternalLink - Se deve mostrar botão para abrir no YouTube (padrão: false)
 */
export default function YouTubePlayer({ 
  url, 
  title = "Vídeo do YouTube", 
  aspectRatio = "16/9",
  showExternalLink = false 
}) {
  const videoId = getYouTubeVideoId(url);

  if (!videoId) {
    return (
      <Alert>
        <AlertDescription className="flex items-center justify-between">
          <span>Não foi possível carregar o vídeo</span>
          {showExternalLink && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(url, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Abrir no YouTube
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  // URL de embed do YouTube com parâmetros otimizados
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg bg-black">
      <div style={{ position: 'relative', paddingBottom: aspectRatio === "16/9" ? "56.25%" : "75%", height: 0 }}>
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none'
          }}
          loading="lazy"
        />
      </div>
      
      {/* Link alternativo para abrir no YouTube - APENAS se showExternalLink=true */}
      {showExternalLink && (
        <div className="absolute bottom-3 right-3 z-10">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.open(url, '_blank')}
            className="bg-black/70 hover:bg-black/90 text-white border-0 backdrop-blur-sm"
          >
            <ExternalLink className="w-3 h-3 mr-2" />
            Abrir no YouTube
          </Button>
        </div>
      )}
    </div>
  );
}