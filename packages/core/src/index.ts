/**
 * Agent Q Core - Business logic for agent management
 * @packageDocumentation
 */

// Agent exports
export * from './agent/Agent.js';
export * from './agent/AgentManager.js';
export * from './agent/AgentValidator.js';
export * from './agent/AgentRepository.js';

// Template exports
export * from './template/Template.js';
export * from './template/TemplateRegistry.js';
export * from './template/TemplateValidator.js';
export * from './template/LocalTemplateLoader.js';

// Security exports
export * from './security/PathValidator.js';
export * from './security/ContentSanitizer.js';
export * from './security/PermissionManager.js';

// Config exports
export * from './config/ConfigManager.js';

// Error exports
export * from './errors/index.js';

// Types (excluding ValidationError to avoid conflict)
export type {
  AgentScope,
  ClaudeModel,
  AgentConfig,
  Agent,
  TemplateMetadata,
  TemplateVariable,
  Template,
  InstallOptions,
  SearchQuery,
  ValidationResult,
  ValidationWarning,
} from './types/index.js';
