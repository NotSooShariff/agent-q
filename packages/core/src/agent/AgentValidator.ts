/**
 * Agent validation logic
 */

import type { AgentConfig, ValidationResult, ValidationError, ValidationWarning } from '../types/index.js';
import { ContentSanitizer } from '../security/ContentSanitizer.js';
import { PathValidator } from '../security/PathValidator.js';

/**
 * Validates agent configurations
 */
export class AgentValidator {
  private contentSanitizer: ContentSanitizer;
  private pathValidator: PathValidator;

  constructor() {
    this.contentSanitizer = new ContentSanitizer();
    this.pathValidator = new PathValidator();
  }

  /**
   * Validate an agent configuration
   */
  validate(config: Partial<AgentConfig>): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate name
    try {
      if (!config.name) {
        errors.push({
          field: 'name',
          message: 'Name is required',
          code: 'REQUIRED',
        });
      } else {
        this.pathValidator.validateAgentName(config.name);
      }
    } catch (error) {
      errors.push({
        field: 'name',
        message: error instanceof Error ? error.message : String(error),
        code: 'INVALID',
      });
    }

    // Validate description
    try {
      if (!config.description) {
        errors.push({
          field: 'description',
          message: 'Description is required',
          code: 'REQUIRED',
        });
      } else {
        this.contentSanitizer.sanitizeDescription(config.description);
      }
    } catch (error) {
      errors.push({
        field: 'description',
        message: error instanceof Error ? error.message : String(error),
        code: 'INVALID',
      });
    }

    // Validate personality
    try {
      if (!config.personality) {
        errors.push({
          field: 'personality',
          message: 'Personality is required',
          code: 'REQUIRED',
        });
      } else {
        this.contentSanitizer.sanitizePersonality(config.personality);
      }
    } catch (error) {
      errors.push({
        field: 'personality',
        message: error instanceof Error ? error.message : String(error),
        code: 'INVALID',
      });
    }

    // Validate system prompt
    try {
      if (!config.systemPrompt) {
        errors.push({
          field: 'systemPrompt',
          message: 'System prompt is required',
          code: 'REQUIRED',
        });
      } else {
        this.contentSanitizer.sanitizeSystemPrompt(config.systemPrompt);
        this.contentSanitizer.validateContent(config.systemPrompt);
      }
    } catch (error) {
      errors.push({
        field: 'systemPrompt',
        message: error instanceof Error ? error.message : String(error),
        code: 'INVALID',
      });
    }

    // Validate scope
    if (!config.scope) {
      errors.push({
        field: 'scope',
        message: 'Scope is required',
        code: 'REQUIRED',
      });
    } else if (!['project', 'user'].includes(config.scope)) {
      errors.push({
        field: 'scope',
        message: 'Scope must be either "project" or "user"',
        code: 'INVALID',
      });
    }

    // Validate model (optional)
    if (config.model !== undefined && !['sonnet', 'opus', 'haiku'].includes(config.model)) {
      errors.push({
        field: 'model',
        message: 'Model must be one of: sonnet, opus, haiku',
        code: 'INVALID',
      });
    }

    // Validate tools (optional)
    if (config.tools !== undefined) {
      try {
        this.contentSanitizer.sanitizeTools(config.tools);
      } catch (error) {
        errors.push({
          field: 'tools',
          message: error instanceof Error ? error.message : String(error),
          code: 'INVALID',
        });
      }
    }

    // Validate expertise (optional)
    if (config.expertise !== undefined) {
      try {
        this.contentSanitizer.sanitizeExpertise(config.expertise);
      } catch (error) {
        errors.push({
          field: 'expertise',
          message: error instanceof Error ? error.message : String(error),
          code: 'INVALID',
        });
      }
    }

    // Warnings
    if (config.systemPrompt && config.systemPrompt.length < 50) {
      warnings.push({
        field: 'systemPrompt',
        message: 'System prompt is very short, consider adding more details',
        code: 'TOO_SHORT',
      });
    }

    if (config.tools && config.tools.length === 0) {
      warnings.push({
        field: 'tools',
        message: 'Empty tools array will be treated as undefined (agent gets all tools)',
        code: 'EMPTY_ARRAY',
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate and throw if invalid
   */
  validateOrThrow(config: Partial<AgentConfig>): asserts config is AgentConfig {
    const result = this.validate(config);

    if (!result.valid) {
      const errorMessages = result.errors.map((e) => `${e.field}: ${e.message}`).join(', ');
      throw new Error(`Agent validation failed: ${errorMessages}`);
    }
  }
}
