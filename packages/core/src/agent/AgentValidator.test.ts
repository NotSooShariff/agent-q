/**
 * AgentValidator tests
 */

import { AgentValidator } from './AgentValidator';
import type { AgentConfig } from '../types/index';

describe('AgentValidator', () => {
  let validator: AgentValidator;

  beforeEach(() => {
    validator = new AgentValidator();
  });

  describe('validate', () => {
    it('should validate a complete valid configuration', () => {
      const config: AgentConfig = {
        name: 'test-agent',
        description: 'A test agent for validation',
        personality: 'Helpful and friendly',
        systemPrompt: 'You are a test agent designed to help with testing.',
        scope: 'project',
        tools: ['Read', 'Write'],
        model: 'sonnet',
        expertise: ['testing', 'validation'],
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing required fields', () => {
      const config = {
        name: 'test',
      } as any;

      const result = validator.validate(config);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e) => e.field === 'description')).toBe(true);
      expect(result.errors.some((e) => e.field === 'personality')).toBe(true);
      expect(result.errors.some((e) => e.field === 'systemPrompt')).toBe(true);
    });

    it('should detect invalid name', () => {
      const config = {
        name: '../invalid',
        description: 'Test',
        personality: 'Test',
        systemPrompt: 'Test',
        scope: 'project',
      } as any;

      const result = validator.validate(config);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === 'name')).toBe(true);
    });

    it('should detect invalid model', () => {
      const config: any = {
        name: 'test',
        description: 'Test',
        personality: 'Test',
        systemPrompt: 'Test',
        scope: 'project',
        model: 'invalid-model',
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === 'model')).toBe(true);
    });

    it('should generate warnings for short prompts', () => {
      const config: AgentConfig = {
        name: 'test',
        description: 'Test',
        personality: 'Test',
        systemPrompt: 'Short',
        scope: 'project',
      };

      const result = validator.validate(config);

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some((w) => w.field === 'systemPrompt')).toBe(true);
    });

    it('should warn about empty tools array', () => {
      const config: AgentConfig = {
        name: 'test',
        description: 'Test',
        personality: 'Test',
        systemPrompt: 'A longer system prompt that is valid',
        scope: 'project',
        tools: [],
      };

      const result = validator.validate(config);

      expect(result.warnings.some((w) => w.field === 'tools')).toBe(true);
    });
  });

  describe('validateOrThrow', () => {
    it('should not throw for valid config', () => {
      const config: AgentConfig = {
        name: 'test',
        description: 'Test agent',
        personality: 'Helpful',
        systemPrompt: 'You are a helpful test agent.',
        scope: 'project',
      };

      expect(() => validator.validateOrThrow(config)).not.toThrow();
    });

    it('should throw for invalid config', () => {
      const config = {
        name: 'test',
      } as any;

      expect(() => validator.validateOrThrow(config)).toThrow();
    });
  });
});
