/**
 * Utilitários de Validação de Dados
 * 
 * Fornece validadores reutilizáveis para formulários e dados da API
 */

/**
 * Valida email
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Valida CPF
 */
export function isValidCPF(cpf) {
  if (!cpf || typeof cpf !== 'string') return false;

  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, '');

  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Valida primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(9))) return false;

  // Valida segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(10))) return false;

  return true;
}

/**
 * Valida telefone brasileiro
 */
export function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;

  // Remove caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '');

  // Verifica se tem 10 ou 11 dígitos (com ou sem 9 na frente)
  return cleaned.length === 10 || cleaned.length === 11;
}

/**
 * Valida URL
 */
export function isValidURL(url) {
  if (!url || typeof url !== 'string') return false;

  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Valida data
 */
export function isValidDate(date) {
  if (!date) return false;

  const d = new Date(date);
  return !isNaN(d.getTime());
}

/**
 * Valida se data está no futuro
 */
export function isDateInFuture(date) {
  if (!isValidDate(date)) return false;
  return new Date(date) > new Date();
}

/**
 * Valida se data está no passado
 */
export function isDateInPast(date) {
  if (!isValidDate(date)) return false;
  return new Date(date) < new Date();
}

/**
 * Valida senha forte
 */
export function isStrongPassword(password) {
  if (!password || typeof password !== 'string') return false;

  // Mínimo 8 caracteres
  if (password.length < 8) return false;

  // Pelo menos uma letra maiúscula
  if (!/[A-Z]/.test(password)) return false;

  // Pelo menos uma letra minúscula
  if (!/[a-z]/.test(password)) return false;

  // Pelo menos um número
  if (!/\d/.test(password)) return false;

  // Pelo menos um caractere especial
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;

  return true;
}

/**
 * Valida número de pontos/nota
 */
export function isValidScore(score, min = 0, max = 100) {
  if (typeof score !== 'number') return false;
  if (isNaN(score)) return false;
  return score >= min && score <= max;
}

/**
 * Valida string não vazia
 */
export function isNonEmptyString(str) {
  return typeof str === 'string' && str.trim().length > 0;
}

/**
 * Valida comprimento de string
 */
export function isValidLength(str, min = 1, max = Infinity) {
  if (typeof str !== 'string') return false;
  const length = str.trim().length;
  return length >= min && length <= max;
}

/**
 * Valida se é número inteiro positivo
 */
export function isPositiveInteger(num) {
  return Number.isInteger(num) && num > 0;
}

/**
 * Valida array não vazio
 */
export function isNonEmptyArray(arr) {
  return Array.isArray(arr) && arr.length > 0;
}

/**
 * Valida objeto não vazio
 */
export function isNonEmptyObject(obj) {
  return obj && typeof obj === 'object' && Object.keys(obj).length > 0;
}

/**
 * Valida se valor está em lista de opções válidas
 */
export function isInEnum(value, validOptions) {
  return validOptions.includes(value);
}

/**
 * Valida formato de ID (UUID ou similar)
 */
export function isValidId(id) {
  if (!id || typeof id !== 'string') return false;
  
  // Aceita UUID ou IDs alfanuméricos com hífen/underscore
  const idRegex = /^[a-zA-Z0-9_-]+$/;
  return idRegex.test(id);
}

/**
 * Validador genérico que retorna objeto com sucesso e erros
 */
export function validate(value, validators) {
  const errors = [];

  for (const validator of validators) {
    const result = validator(value);
    if (result !== true) {
      errors.push(result);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Cria validador customizado
 */
export function createValidator(fn, errorMessage) {
  return (value) => {
    return fn(value) ? true : errorMessage;
  };
}

// Validadores pré-configurados para uso com validate()
export const validators = {
  required: createValidator(
    (v) => v !== null && v !== undefined && v !== '',
    'Este campo é obrigatório'
  ),
  
  email: createValidator(
    isValidEmail,
    'Email inválido'
  ),
  
  cpf: createValidator(
    isValidCPF,
    'CPF inválido'
  ),
  
  phone: createValidator(
    isValidPhone,
    'Telefone inválido'
  ),
  
  url: createValidator(
    isValidURL,
    'URL inválida'
  ),
  
  minLength: (min) => createValidator(
    (v) => typeof v === 'string' && v.length >= min,
    `Mínimo de ${min} caracteres`
  ),
  
  maxLength: (max) => createValidator(
    (v) => typeof v === 'string' && v.length <= max,
    `Máximo de ${max} caracteres`
  ),
  
  pattern: (regex, message) => createValidator(
    (v) => regex.test(v),
    message || 'Formato inválido'
  ),
};