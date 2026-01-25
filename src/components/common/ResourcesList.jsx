import React from "react";
import { ExternalLink, FileText, Video, Link as LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNormalizedResources } from "@/components/hooks/useNormalizedResources";

export default function ResourcesList({ resources, lesson, frontmatter }) {
  // Usar hook de normalização
  const normalizedResources = useNormalizedResources({
    lesson,
    propsResources: resources,
    frontmatter
  });
  
  if (!normalizedResources.length) return null;

  const getResourceIcon = (resource) => {
    const type = resource.type?.toLowerCase();
    if (type === 'video') return <Video className="w-4 h-4" />;
    if (type === 'pdf' || type === 'document') return <FileText className="w-4 h-4" />;
    return <LinkIcon className="w-4 h-4" />;
  };

  return (
    <section className="mt-6 p-6 rounded-xl" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
        <FileText className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
        Recursos Adicionais
      </h3>
      
      <div className="space-y-3">
        {normalizedResources.map((resource, i) => {
          const icon = getResourceIcon(resource);

          return (
            <div 
              key={i} 
              className="flex items-start gap-3 p-4 rounded-lg hover:shadow-md transition-all"
              style={{ backgroundColor: 'var(--background)' }}
            >
              <div 
                className="p-2 rounded-lg flex-shrink-0"
                style={{ backgroundColor: 'var(--primary-teal)20', color: 'var(--primary-teal)' }}
              >
                {icon}
              </div>
              
              <div className="flex-1 min-w-0">
                {resource.url ? (
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium hover:underline flex items-center gap-2 group"
                    style={{ color: 'var(--primary-teal)' }}
                  >
                    <span className="truncate">{resource.title}</span>
                    <ExternalLink className="w-4 h-4 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                  </a>
                ) : (
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {resource.title}
                  </span>
                )}
                
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {resource.type && (
                    <Badge variant="outline" className="text-xs">
                      {resource.type}
                    </Badge>
                  )}
                  {resource.vark_style && (
                    <Badge 
                      className="text-xs border-0"
                      style={{ 
                        backgroundColor: 'var(--accent-yellow)20', 
                        color: 'var(--accent-yellow)' 
                      }}
                    >
                      VARK: {resource.vark_style}
                    </Badge>
                  )}
                </div>
                
                {resource.description && (
                  <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                    {resource.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}