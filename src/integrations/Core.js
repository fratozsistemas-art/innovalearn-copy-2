// Base44 SDK Integration Imports
// These integrations use the Base44 client pattern for external service access
// The Base44 vite plugin with legacySDKImports handles the transformation

// Note: These are placeholder exports that will be transformed by the Base44 vite plugin
// when legacySDKImports is enabled. The actual integration handlers are created at runtime
// by the Base44 client.

// AI & LLM Integration
export const InvokeLLM = {};

// Communication Integration
export const SendEmail = {};

// Core Integration Object (for backward compatibility)
export const Core = {
  InvokeLLM,
  SendEmail
};

export default Core;
