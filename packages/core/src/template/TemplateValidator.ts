/**
 * Template validation
 */

import type { Template, ValidationResult, ValidationError as VError } from '../types/index.js';

/**
 * Validates template definitions
 */
export class TemplateValidator {
  /**
   * Validate a template
   */
  validate(template: Partial<Template>): ValidationResult {
    const errors: VError[] = [];

    // Validate version
    if (!template.version) {
      errors.push({
        field: 'version',
        message: 'Version is required',
        code: 'REQUIRED',
      });
    }

    // Validate metadata
    if (!template.metadata) {
      errors.push({
        field: 'metadata',
        message: 'Metadata is required',
        code: 'REQUIRED',
      });
    } else {
      if (!template.metadata.id) {
        errors.push({
          field: 'metadata.id',
          message: 'Template ID is required',
          code: 'REQUIRED',
        });
      }
      if (!template.metadata.name) {
        errors.push({
          field: 'metadata.name',
          message: 'Template name is required',
          code: 'REQUIRED',
        });
      }
      if (!template.metadata.description) {
        errors.push({
          field: 'metadata.description',
          message: 'Template description is required',
          code: 'REQUIRED',
        });
      }
    }

    // Validate agent config
    if (!template.agent) {
      errors.push({
        field: 'agent',
        message: 'Agent configuration is required',
        code: 'REQUIRED',
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings: [],
    };
  }
}
