/**
 * Custom error classes for Agent Q
 */

/**
 * Base error class for Agent Q
 */
export class AgentQError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AgentQError';
    Object.setPrototypeOf(this, AgentQError.prototype);
  }
}

/**
 * Security-related errors
 */
export class SecurityError extends AgentQError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'SECURITY_ERROR', details);
    this.name = 'SecurityError';
    Object.setPrototypeOf(this, SecurityError.prototype);
  }
}

/**
 * Validation errors
 */
export class ValidationError extends AgentQError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * File system errors
 */
export class FileSystemError extends AgentQError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'FILESYSTEM_ERROR', details);
    this.name = 'FileSystemError';
    Object.setPrototypeOf(this, FileSystemError.prototype);
  }
}

/**
 * Agent not found error
 */
export class AgentNotFoundError extends AgentQError {
  constructor(agentName: string) {
    super(`Agent not found: ${agentName}`, 'AGENT_NOT_FOUND', { agentName });
    this.name = 'AgentNotFoundError';
    Object.setPrototypeOf(this, AgentNotFoundError.prototype);
  }
}

/**
 * Agent already exists error
 */
export class AgentExistsError extends AgentQError {
  constructor(agentName: string) {
    super(`Agent already exists: ${agentName}`, 'AGENT_EXISTS', { agentName });
    this.name = 'AgentExistsError';
    Object.setPrototypeOf(this, AgentExistsError.prototype);
  }
}

/**
 * Template not found error
 */
export class TemplateNotFoundError extends AgentQError {
  constructor(templateId: string) {
    super(`Template not found: ${templateId}`, 'TEMPLATE_NOT_FOUND', { templateId });
    this.name = 'TemplateNotFoundError';
    Object.setPrototypeOf(this, TemplateNotFoundError.prototype);
  }
}

/**
 * Permission error
 */
export class PermissionError extends AgentQError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'PERMISSION_ERROR', details);
    this.name = 'PermissionError';
    Object.setPrototypeOf(this, PermissionError.prototype);
  }
}
