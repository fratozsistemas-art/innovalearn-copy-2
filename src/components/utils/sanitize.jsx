/**
 * Utilitários de Sanitização de Dados
 * 
 * Protege contra XSS (Cross-Site Scripting) e outros ataques de injeção
 * 
 * IMPORTANTE: Esta é uma implementação básica. Para produção, considere usar
 * bibliotecas especializadas como DOMPurify ou sanitize-html
 */

/**
 * Remove tags HTML perigosas e atributos inseguros
 */
export function sanitizeHTML(html) {
  if (!html || typeof html !== 'string') return '';

  // Lista de tags permitidas (whitelist)
  const allowedTags = [
    'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre',
    'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div', 'span'
  ];

  // Atributos permitidos por tag
  const allowedAttributes = {
    'a': ['href', 'title', 'target'],
    'img': ['src', 'alt', 'title', 'width', 'height'],
    'div': ['class'],
    'span': ['class'],
    'td': ['colspan', 'rowspan'],
    'th': ['colspan', 'rowspan'],
  };

  // Criar um elemento temporário para parsing
  const temp = document.createElement('div');
  temp.innerHTML = html;

  // Função recursiva para limpar nós
  function cleanNode(node) {
    // Se é um nó de texto, retornar como está
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    }

    // Se é um elemento
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();

      // Se a tag não é permitida, retornar apenas o conteúdo texto
      if (!allowedTags.includes(tagName)) {
        return node.textContent;
      }

      // Criar novo elemento limpo
      const cleanElement = document.createElement(tagName);

      // Copiar apenas atributos permitidos
      if (allowedAttributes[tagName]) {
        allowedAttributes[tagName].forEach(attr => {
          if (node.hasAttribute(attr)) {
            let value = node.getAttribute(attr);
            
            // Validações específicas por atributo
            if (attr === 'href' || attr === 'src') {
              value = sanitizeURL(value);
            }
            
            if (value) {
              cleanElement.setAttribute(attr, value);
            }
          }
        });
      }

      // Processar filhos recursivamente
      Array.from(node.childNodes).forEach(child => {
        const cleanChild = cleanNode(child);
        if (typeof cleanChild === 'string') {
          cleanElement.appendChild(document.createTextNode(cleanChild));
        } else if (cleanChild) {
          cleanElement.appendChild(cleanChild);
        }
      });

      return cleanElement;
    }

    return null;
  }

  // Limpar todos os nós filhos
  const cleaned = document.createElement('div');
  Array.from(temp.childNodes).forEach(child => {
    const cleanChild = cleanNode(child);
    if (typeof cleanChild === 'string') {
      cleaned.appendChild(document.createTextNode(cleanChild));
    } else if (cleanChild) {
      cleaned.appendChild(cleanChild);
    }
  });

  return cleaned.innerHTML;
}

/**
 * Sanitiza URLs para prevenir javascript: e data: URIs maliciosos
 */
export function sanitizeURL(url) {
  if (!url || typeof url !== 'string') return '';

  // Remover espaços em branco
  url = url.trim();

  // Protocolos permitidos
  const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];

  try {
    // Tentar criar URL para validar
    const urlObj = new URL(url, window.location.origin);
    
    // Verificar se o protocolo é permitido
    if (!allowedProtocols.includes(urlObj.protocol)) {
      console.warn('⚠️ Protocolo não permitido:', urlObj.protocol);
      return '';
    }

    return urlObj.href;
  } catch (e) {
    // Se não é uma URL válida, verificar se é um caminho relativo
    if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
      return url;
    }

    console.warn('⚠️ URL inválida:', url);
    return '';
  }
}

/**
 * Remove caracteres especiais perigosos de strings
 */
export function sanitizeString(str) {
  if (!str || typeof str !== 'string') return '';

  return str
    .replace(/[<>]/g, '') // Remove < e >
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+=/gi, '') // Remove event handlers (onclick=, onload=, etc)
    .trim();
}

/**
 * Sanitiza objeto removendo propriedades perigosas
 */
export function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  const cleaned = {};

  for (const [key, value] of Object.entries(obj)) {
    // Sanitizar a chave
    const cleanKey = sanitizeString(key);

    // Sanitizar o valor baseado no tipo
    if (typeof value === 'string') {
      cleaned[cleanKey] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      cleaned[cleanKey] = sanitizeObject(value);
    } else {
      cleaned[cleanKey] = value;
    }
  }

  return cleaned;
}

/**
 * Escapa caracteres HTML para exibição segura de texto
 */
export function escapeHTML(text) {
  if (!text || typeof text !== 'string') return '';

  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Valida e sanitiza email
 */
export function sanitizeEmail(email) {
  if (!email || typeof email !== 'string') return '';

  email = email.trim().toLowerCase();

  // Regex simples para validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return '';
  }

  return email;
}

/**
 * Sanitiza número de telefone
 */
export function sanitizePhone(phone) {
  if (!phone || typeof phone !== 'string') return '';

  // Remove tudo exceto números, +, (), - e espaços
  return phone.replace(/[^\d+() -]/g, '').trim();
}

/**
 * Sanitiza CPF/CNPJ (apenas números)
 */
export function sanitizeDocument(doc) {
  if (!doc || typeof doc !== 'string') return '';

  // Remove tudo exceto números
  return doc.replace(/\D/g, '');
}

/**
 * Valida e sanitiza data
 */
export function sanitizeDate(date) {
  if (!date) return null;

  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return null;
    }
    return d.toISOString();
  } catch (e) {
    return null;
  }
}

/**
 * Sanitiza entrada de busca/pesquisa
 */
export function sanitizeSearchQuery(query) {
  if (!query || typeof query !== 'string') return '';

  return query
    .replace(/[<>\"']/g, '') // Remove caracteres perigosos
    .replace(/\s+/g, ' ') // Normaliza espaços
    .trim()
    .substring(0, 200); // Limita tamanho
}

/**
 * Wrapper para uso seguro com dangerouslySetInnerHTML
 */
export function createSafeHTML(html) {
  return {
    __html: sanitizeHTML(html)
  };
}