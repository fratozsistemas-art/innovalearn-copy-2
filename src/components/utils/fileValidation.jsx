/**
 * Validação de Arquivos
 * 
 * Valida tipo, tamanho e segurança de arquivos enviados
 */

// Configurações padrão
const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB
const DEFAULT_ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/csv'
];

/**
 * Valida um arquivo antes de upload
 * 
 * @param {File} file - Arquivo a validar
 * @param {Object} options - Opções de validação
 * @param {number} options.maxSize - Tamanho máximo em bytes
 * @param {string[]} options.allowedTypes - Tipos MIME permitidos
 * @param {string[]} options.allowedExtensions - Extensões permitidas
 * @returns {Object} { valid: boolean, error?: string }
 */
export function validateFile(file, options = {}) {
  const {
    maxSize = DEFAULT_MAX_SIZE,
    allowedTypes = DEFAULT_ALLOWED_TYPES,
    allowedExtensions = null
  } = options;

  // Verificar se é um arquivo
  if (!file || !(file instanceof File)) {
    return {
      valid: false,
      error: 'Nenhum arquivo fornecido ou formato inválido'
    };
  }

  // Verificar tamanho
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / 1024 / 1024).toFixed(1);
    const fileSizeMB = (file.size / 1024 / 1024).toFixed(1);
    return {
      valid: false,
      error: `Arquivo muito grande (${fileSizeMB}MB). Máximo: ${maxSizeMB}MB`
    };
  }

  // Verificar tamanho mínimo (1KB) - prevenir arquivos vazios
  if (file.size < 1024) {
    return {
      valid: false,
      error: 'Arquivo muito pequeno ou vazio'
    };
  }

  // Verificar tipo MIME
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de arquivo não permitido (${file.type}). Tipos aceitos: ${allowedTypes.join(', ')}`
    };
  }

  // Verificar extensão (se especificado)
  if (allowedExtensions) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !allowedExtensions.includes(extension)) {
      return {
        valid: false,
        error: `Extensão de arquivo não permitida (.${extension}). Extensões aceitas: ${allowedExtensions.join(', ')}`
      };
    }
  }

  // Verificar nome do arquivo
  if (!isValidFileName(file.name)) {
    return {
      valid: false,
      error: 'Nome de arquivo contém caracteres inválidos'
    };
  }

  return { valid: true };
}

/**
 * Valida múltiplos arquivos
 */
export function validateFiles(files, options = {}) {
  const results = [];
  let allValid = true;

  for (const file of files) {
    const result = validateFile(file, options);
    results.push({ file, ...result });
    if (!result.valid) {
      allValid = false;
    }
  }

  return {
    valid: allValid,
    results
  };
}

/**
 * Valida nome de arquivo
 */
function isValidFileName(fileName) {
  // Permitir apenas caracteres seguros
  const safePattern = /^[a-zA-Z0-9-_. ]+$/;
  
  // Não permitir nomes muito longos
  if (fileName.length > 255) {
    return false;
  }

  // Não permitir caracteres perigosos
  const dangerousChars = ['/', '\\', '<', '>', ':', '"', '|', '?', '*'];
  for (const char of dangerousChars) {
    if (fileName.includes(char)) {
      return false;
    }
  }

  return safePattern.test(fileName);
}

/**
 * Sanitiza nome de arquivo
 */
export function sanitizeFileName(fileName) {
  return fileName
    .replace(/[^a-zA-Z0-9-_. ]/g, '_') // Substituir caracteres inválidos
    .replace(/\s+/g, '_') // Substituir espaços por underscore
    .replace(/_+/g, '_') // Remover underscores duplicados
    .substring(0, 255); // Limitar tamanho
}

/**
 * Valida imagem especificamente
 */
export function validateImage(file, options = {}) {
  const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  return validateFile(file, {
    ...options,
    allowedTypes: imageTypes
  });
}

/**
 * Valida PDF especificamente
 */
export function validatePDF(file, options = {}) {
  return validateFile(file, {
    ...options,
    allowedTypes: ['application/pdf']
  });
}

/**
 * Obter informações do arquivo de forma segura
 */
export function getFileInfo(file) {
  return {
    name: file.name,
    size: file.size,
    sizeFormatted: formatFileSize(file.size),
    type: file.type,
    extension: file.name.split('.').pop()?.toLowerCase(),
    lastModified: new Date(file.lastModified)
  };
}

/**
 * Formatar tamanho de arquivo
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}