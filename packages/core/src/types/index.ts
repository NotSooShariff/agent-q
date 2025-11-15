/**
 * Core type definitions for Agent Q
 */

/**
 * Agent scope determines where the agent is stored
 */
export type AgentScope = 'project' | 'user';

/**
 * Supported AI models
 */
export type AIModel = 'sonnet' | 'opus' | 'haiku';

/**
 * Agent configuration interface
 */
export interface AgentConfig {
  /** Unique agent identifier (lowercase, alphanumeric, hyphens only) */
  name: string;

  /** Brief description of when to use this agent */
  description: string;

  /** Agent personality and behavior description */
  personality: string;

  /** Areas of expertise */
  expertise?: string[];

  /** Tools the agent can use (undefined = all tools) */
  tools?: string[];

  /** AI model to use */
  model?: AIModel;

  /** Storage scope */
  scope: AgentScope;

  /** System prompt for the agent */
  systemPrompt: string;

  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Agent file representation
 */
export interface Agent {
  /** Agent configuration */
  config: AgentConfig;

  /** Full file path */
  path: string;

  /** Creation timestamp */
  createdAt: Date;

  /** Last modified timestamp */
  updatedAt: Date;
}

/**
 * Template metadata
 */
export interface TemplateMetadata {
  /** Unique template identifier */
  id: string;

  /** Display name */
  name: string;

  /** Template description */
  description: string;

  /** Template author */
  author: string;

  /** Category */
  category: string;

  /** Tags for search */
  tags: string[];

  /** License */
  license: string;

  /** Homepage URL */
  homepage?: string;

  /** Version */
  version: string;
}

/**
 * Template customization variable
 */
export interface TemplateVariable {
  /** Variable name */
  name: string;

  /** Description */
  description: string;

  /** Variable type */
  type: 'string' | 'number' | 'boolean';

  /** Default value */
  default?: string | number | boolean;

  /** Allowed options (for enums) */
  options?: (string | number)[];

  /** Min value (for numbers) */
  min?: number;

  /** Max value (for numbers) */
  max?: number;
}

/**
 * Template definition
 */
export interface Template {
  /** Template version */
  version: string;

  /** Template metadata */
  metadata: TemplateMetadata;

  /** Compatibility requirements */
  compatibility: {
    minVersion: string;
    platforms: string[];
  };

  /** Agent configuration */
  agent: Omit<AgentConfig, 'scope'>;

  /** Customization options */
  customization?: {
    variables: TemplateVariable[];
  };

  /** Usage examples */
  examples?: Array<{
    scenario: string;
    usage: string;
  }>;
}

/**
 * Template installation options
 */
export interface InstallOptions {
  /** Installation scope */
  scope: AgentScope;

  /** Custom variable values */
  variables?: Record<string, string | number | boolean>;

  /** Custom agent name (overrides template) */
  name?: string;
}

/**
 * Search query for templates
 */
export interface SearchQuery {
  /** Search text */
  query?: string;

  /** Filter by category */
  category?: string;

  /** Filter by tags */
  tags?: string[];

  /** Maximum results */
  limit?: number;
}

/**
 * Validation result
 */
export interface ValidationResult {
  /** Is valid */
  valid: boolean;

  /** Validation errors */
  errors: ValidationError[];

  /** Validation warnings */
  warnings: ValidationWarning[];
}

/**
 * Validation error
 */
export interface ValidationError {
  /** Error field */
  field: string;

  /** Error message */
  message: string;

  /** Error code */
  code: string;
}

/**
 * Validation warning
 */
export interface ValidationWarning {
  /** Warning field */
  field: string;

  /** Warning message */
  message: string;

  /** Warning code */
  code: string;
}
