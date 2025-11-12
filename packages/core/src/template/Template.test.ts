/**
 * Template utility tests
 */

import {
  applyTemplateVariables,
  validateTemplateVariables,
  getDefaultVariables,
} from './Template';
import type { TemplateVariable } from '../types/index';

describe('Template utilities', () => {
  describe('applyTemplateVariables', () => {
    it('should replace single variable', () => {
      const template = 'Hello {{ name }}!';
      const variables = { name: 'World' };
      const result = applyTemplateVariables(template, variables);
      expect(result).toBe('Hello World!');
    });

    it('should replace multiple variables', () => {
      const template = '{{ greeting }} {{ name }}, welcome to {{ place }}!';
      const variables = { greeting: 'Hello', name: 'Alice', place: 'Wonderland' };
      const result = applyTemplateVariables(template, variables);
      expect(result).toBe('Hello Alice, welcome to Wonderland!');
    });

    it('should handle numeric variables', () => {
      const template = 'Your score is {{ score }}';
      const variables = { score: 100 };
      const result = applyTemplateVariables(template, variables);
      expect(result).toBe('Your score is 100');
    });

    it('should handle boolean variables', () => {
      const template = 'Enabled: {{ enabled }}';
      const variables = { enabled: true };
      const result = applyTemplateVariables(template, variables);
      expect(result).toBe('Enabled: true');
    });
  });

  describe('validateTemplateVariables', () => {
    it('should validate correct variables', () => {
      const schema: TemplateVariable[] = [
        {
          name: 'language',
          description: 'Programming language',
          type: 'string',
          options: ['JavaScript', 'TypeScript', 'Python'],
        },
      ];

      const variables = { language: 'TypeScript' };
      const result = validateTemplateVariables(variables, schema);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing required variables', () => {
      const schema: TemplateVariable[] = [
        {
          name: 'required',
          description: 'Required field',
          type: 'string',
        },
      ];

      const variables = {};
      const result = validateTemplateVariables(variables, schema);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate type mismatch', () => {
      const schema: TemplateVariable[] = [
        {
          name: 'count',
          description: 'Count',
          type: 'number',
        },
      ];

      const variables = { count: 'not a number' as any };
      const result = validateTemplateVariables(variables, schema);

      expect(result.valid).toBe(false);
    });

    it('should validate number ranges', () => {
      const schema: TemplateVariable[] = [
        {
          name: 'level',
          description: 'Level',
          type: 'number',
          min: 1,
          max: 10,
        },
      ];

      expect(validateTemplateVariables({ level: 5 }, schema).valid).toBe(true);
      expect(validateTemplateVariables({ level: 0 }, schema).valid).toBe(false);
      expect(validateTemplateVariables({ level: 11 }, schema).valid).toBe(false);
    });

    it('should use default values', () => {
      const schema: TemplateVariable[] = [
        {
          name: 'optional',
          description: 'Optional',
          type: 'string',
          default: 'default-value',
        },
      ];

      const variables = {};
      const result = validateTemplateVariables(variables, schema);

      expect(result.valid).toBe(true);
    });
  });

  describe('getDefaultVariables', () => {
    it('should extract default values', () => {
      const schema: TemplateVariable[] = [
        {
          name: 'var1',
          description: 'Var 1',
          type: 'string',
          default: 'default1',
        },
        {
          name: 'var2',
          description: 'Var 2',
          type: 'number',
          default: 42,
        },
        {
          name: 'var3',
          description: 'Var 3',
          type: 'string',
        },
      ];

      const defaults = getDefaultVariables(schema);

      expect(defaults).toEqual({
        var1: 'default1',
        var2: 42,
      });
    });
  });
});
