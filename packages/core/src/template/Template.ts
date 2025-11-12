/**
 * Template model and utilities
 */

import type { TemplateVariable } from '../types/index.js';

/**
 * Apply variable substitutions to a template string
 */
export function applyTemplateVariables(
  template: string,
  variables: Record<string, string | number | boolean>
): string {
  let result = template;

  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{ ${key} }}`;
    result = result.replaceAll(placeholder, String(value));
  }

  return result;
}

/**
 * Validate template variable values against schema
 */
export function validateTemplateVariables(
  variables: Record<string, string | number | boolean>,
  schema: TemplateVariable[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const varDef of schema) {
    const value = variables[varDef.name];

    // Check if value is provided (or has default)
    if (value === undefined && varDef.default === undefined) {
      errors.push(`Missing required variable: ${varDef.name}`);
      continue;
    }

    if (value !== undefined) {
      // Type check
      const actualType = typeof value;
      if (actualType !== varDef.type) {
        errors.push(
          `Variable ${varDef.name} has wrong type: expected ${varDef.type}, got ${actualType}`
        );
        continue;
      }

      // Range check for numbers
      if (varDef.type === 'number' && typeof value === 'number') {
        if (varDef.min !== undefined && value < varDef.min) {
          errors.push(`Variable ${varDef.name} is below minimum: ${varDef.min}`);
        }
        if (varDef.max !== undefined && value > varDef.max) {
          errors.push(`Variable ${varDef.name} is above maximum: ${varDef.max}`);
        }
      }

      // Options check
      if (varDef.options && varDef.type !== 'boolean') {
        const numericOrStringValue = value as string | number;
        if (!varDef.options.includes(numericOrStringValue)) {
          errors.push(
            `Variable ${varDef.name} must be one of: ${varDef.options.join(', ')}`
          );
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get default values for template variables
 */
export function getDefaultVariables(schema: TemplateVariable[]): Record<string, string | number | boolean> {
  const defaults: Record<string, string | number | boolean> = {};

  for (const varDef of schema) {
    if (varDef.default !== undefined) {
      defaults[varDef.name] = varDef.default;
    }
  }

  return defaults;
}
