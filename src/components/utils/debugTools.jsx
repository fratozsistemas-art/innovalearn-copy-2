import React from 'react';

/**
 * Ferramentas de Debug e Desenvolvimento
 * 
 * Utilitários para facilitar debugging durante desenvolvimento
 */

// Detectar ambiente de desenvolvimento
const isDevelopment = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

/**
 * Log estruturado com estilo
 */
export function debugLog(message, data = null, type = 'info') {
  if (!isDevelopment) return;

  const styles = {
    info: 'color: #3B82F6; font-weight: bold',
    success: 'color: #10B981; font-weight: bold',
    warning: 'color: #F59E0B; font-weight: bold',
    error: 'color: #EF4444; font-weight: bold'
  };

  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };

  console.log(`%c${icons[type]} ${message}`, styles[type]);
  if (data) {
    console.log(data);
  }
}

/**
 * Medir tempo de execução de uma função
 */
export async function measureTime(fn, label = 'Function') {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  
  debugLog(`${label} executou em ${(end - start).toFixed(2)}ms`, null, 'info');
  
  return result;
}

/**
 * Verificar se um objeto está vazio
 */
export function isEmpty(obj) {
  if (!obj) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
}

/**
 * Pretty print de objetos
 */
export function prettyPrint(obj, title = 'Object') {
  if (!isDevelopment) return;

  console.group(`📦 ${title}`);
  console.log(JSON.stringify(obj, null, 2));
  console.groupEnd();
}

/**
 * Verificar integridade de dados
 */
export function validateData(data, schema, label = 'Data') {
  const errors = [];

  for (const [key, rules] of Object.entries(schema)) {
    const value = data[key];

    if (rules.required && (value === undefined || value === null)) {
      errors.push(`${key} is required`);
    }

    if (rules.type && typeof value !== rules.type) {
      errors.push(`${key} should be ${rules.type}, got ${typeof value}`);
    }

    if (rules.min && value < rules.min) {
      errors.push(`${key} should be >= ${rules.min}`);
    }

    if (rules.max && value > rules.max) {
      errors.push(`${key} should be <= ${rules.max}`);
    }
  }

  if (errors.length > 0) {
    console.group(`❌ Validation Errors in ${label}`);
    errors.forEach(err => console.error(err));
    console.groupEnd();
    return false;
  }

  debugLog(`${label} validation passed`, null, 'success');
  return true;
}

/**
 * Trace de chamadas de função
 */
export function trace(fn, name) {
  return function(...args) {
    debugLog(`→ Calling ${name}`, { args }, 'info');
    const result = fn.apply(this, args);
    debugLog(`← ${name} returned`, { result }, 'success');
    return result;
  };
}

/**
 * Dump do estado atual
 */
export function dumpState(state, label = 'State') {
  if (!isDevelopment) return;

  console.group(`🔍 ${label} Dump`);
  console.table(state);
  console.log('Raw:', state);
  console.groupEnd();
}

/**
 * Verificar memory leaks (básico)
 */
export function checkMemory() {
  if (!performance.memory) {
    console.warn('Performance.memory não disponível neste navegador');
    return;
  }

  const memory = performance.memory;
  console.group('💾 Memory Usage');
  console.log('Used:', Math.round(memory.usedJSHeapSize / 1024 / 1024), 'MB');
  console.log('Total:', Math.round(memory.totalJSHeapSize / 1024 / 1024), 'MB');
  console.log('Limit:', Math.round(memory.jsHeapSizeLimit / 1024 / 1024), 'MB');
  console.groupEnd();
}

/**
 * Comparar dois objetos e mostrar diferenças
 */
export function diff(obj1, obj2, label = 'Diff') {
  const differences = [];

  const allKeys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})]);

  allKeys.forEach(key => {
    const val1 = obj1?.[key];
    const val2 = obj2?.[key];

    if (JSON.stringify(val1) !== JSON.stringify(val2)) {
      differences.push({
        key,
        before: val1,
        after: val2
      });
    }
  });

  if (differences.length > 0) {
    console.group(`🔄 ${label}`);
    console.table(differences);
    console.groupEnd();
  } else {
    debugLog(`${label}: No differences found`, null, 'success');
  }

  return differences;
}

/**
 * Wrapper para React Query debugging
 */
export function debugQuery(queryResult, label = 'Query') {
  if (!isDevelopment) return;

  console.group(`🔍 ${label} Debug`);
  console.log('Status:', queryResult.status);
  console.log('Loading:', queryResult.isLoading);
  console.log('Error:', queryResult.error);
  console.log('Data:', queryResult.data);
  console.log('Stale:', queryResult.isStale);
  console.groupEnd();
}

/**
 * Verificar render performance (React Hook)
 */
export function useRenderCount(componentName) {
  const renderCount = React.useRef(0);

  React.useEffect(() => {
    renderCount.current += 1;
    debugLog(`${componentName} rendered ${renderCount.current} times`, null, 'info');
  });

  return renderCount.current;
}

/**
 * Detectar re-renders desnecessários (React Hook)
 */
export function useWhyDidYouUpdate(name, props) {
  const previousProps = React.useRef();

  React.useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps = {};

      allKeys.forEach(key => {
        if (previousProps.current[key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current[key],
            to: props[key]
          };
        }
      });

      if (Object.keys(changedProps).length > 0) {
        console.group(`🔄 ${name} Props Changed`);
        console.table(changedProps);
        console.groupEnd();
      }
    }

    previousProps.current = props;
  });
}