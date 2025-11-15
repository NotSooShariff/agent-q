/**
 * Agent utility tests
 */

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument */

import { formatAgentMarkdown, parseAgentMarkdown, validateAgentConfig } from './Agent';
import type { AgentConfig } from '../types/index';

describe('Agent utilities', () => {
  describe('formatAgentMarkdown', () => {
    it('should format agent configuration as markdown', () => {
      const config: AgentConfig = {
        name: 'test-agent',
        description: 'Test agent',
        personality: 'Helpful',
        systemPrompt: 'You are a test agent.',
        scope: 'project',
        tools: ['Read', 'Write'],
        model: 'sonnet',
      };

      const markdown = formatAgentMarkdown(config);

      expect(markdown).toContain('---');
      expect(markdown).toContain('name: test-agent');
      expect(markdown).toContain('description: Test agent');
      expect(markdown).toContain('tools: Read, Write');
      expect(markdown).toContain('model: sonnet');
      expect(markdown).toContain('You are a test agent.');
    });

    it('should handle agents without optional fields', () => {
      const config: AgentConfig = {
        name: 'minimal-agent',
        description: 'Minimal',
        personality: 'Simple',
        systemPrompt: 'Simple prompt.',
        scope: 'user',
      };

      const markdown = formatAgentMarkdown(config);

      expect(markdown).toContain('name: minimal-agent');
      expect(markdown).not.toContain('tools:');
      expect(markdown).not.toContain('model:');
    });
  });

  describe('parseAgentMarkdown', () => {
    it('should parse valid agent markdown', () => {
      const markdown = `---
name: test-agent
description: Test agent
tools: Read, Write
model: sonnet
---

You are a test agent.`;

      const config = parseAgentMarkdown(markdown);

      expect(config.name).toBe('test-agent');
      expect(config.description).toBe('Test agent');
      expect(config.tools).toEqual(['Read', 'Write']);
      expect(config.model).toBe('sonnet');
      expect(config.systemPrompt).toBe('You are a test agent.');
    });

    it('should throw on invalid format', () => {
      const invalid = 'No frontmatter here';
      expect(() => parseAgentMarkdown(invalid)).toThrow();
    });

    it('should throw on missing required fields', () => {
      const markdown = `---
name: test
---

Prompt`;
      expect(() => parseAgentMarkdown(markdown)).toThrow();
    });
  });

  describe('validateAgentConfig', () => {
    it('should validate complete config', () => {
      const config: AgentConfig = {
        name: 'test',
        description: 'Test',
        personality: 'Helpful',
        systemPrompt: 'Prompt',
        scope: 'project',
      };

      expect(validateAgentConfig(config)).toBe(true);
    });

    it('should reject config with missing name', () => {
      const config: any = {
        description: 'Test',
        personality: 'Helpful',
        systemPrompt: 'Prompt',
        scope: 'project',
      };

      expect(validateAgentConfig(config)).toBe(false);
    });

    it('should reject config with invalid scope', () => {
      const config: any = {
        name: 'test',
        description: 'Test',
        personality: 'Helpful',
        systemPrompt: 'Prompt',
        scope: 'invalid',
      };

      expect(validateAgentConfig(config)).toBe(false);
    });

    it('should accept config with valid optional fields', () => {
      const config: AgentConfig = {
        name: 'test',
        description: 'Test',
        personality: 'Helpful',
        systemPrompt: 'Prompt',
        scope: 'project',
        tools: ['Read'],
        model: 'opus',
        expertise: ['security'],
      };

      expect(validateAgentConfig(config)).toBe(true);
    });
  });
});
