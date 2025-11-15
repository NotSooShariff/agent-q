/**
 * PathValidator tests
 */

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument */

import { PathValidator } from './PathValidator';
import { SecurityError } from '../errors/index';

describe('PathValidator', () => {
  let validator: PathValidator;

  beforeEach(() => {
    validator = new PathValidator();
  });

  describe('validateAgentName', () => {
    it('should accept valid agent names', () => {
      const validNames = ['code-reviewer', 'test-agent', 'a', 'agent123', 'my-agent-v2'];

      for (const name of validNames) {
        expect(() => validator.validateAgentName(name)).not.toThrow();
      }
    });

    it('should reject names with path traversal', () => {
      const invalidNames = ['../etc/passwd', '..\\windows', 'agent/../other'];

      for (const name of invalidNames) {
        expect(() => validator.validateAgentName(name)).toThrow(SecurityError);
      }
    });

    it('should reject names with slashes', () => {
      expect(() => validator.validateAgentName('agent/name')).toThrow(SecurityError);
      expect(() => validator.validateAgentName('agent\\name')).toThrow(SecurityError);
    });

    it('should reject names that are too long', () => {
      const longName = 'a'.repeat(51);
      expect(() => validator.validateAgentName(longName)).toThrow(SecurityError);
    });

    it('should reject reserved names', () => {
      const reserved = ['con', 'prn', 'aux', 'nul'];

      for (const name of reserved) {
        expect(() => validator.validateAgentName(name)).toThrow(SecurityError);
      }
    });

    it('should reject names with invalid characters', () => {
      const invalidNames = ['agent name', 'agent@123', 'agent#test', 'UPPERCASE'];

      for (const name of invalidNames) {
        expect(() => validator.validateAgentName(name)).toThrow(SecurityError);
      }
    });

    it('should reject empty or null names', () => {
      expect(() => validator.validateAgentName('')).toThrow(SecurityError);
      expect(() => validator.validateAgentName(null as any)).toThrow(SecurityError);
    });
  });

  describe('getAgentPath', () => {
    it('should generate correct project scope path', () => {
      const path = validator.getAgentPath('test-agent', 'project');
      expect(path).toContain('.claude');
      expect(path).toContain('agents');
      expect(path).toContain('test-agent.md');
    });

    it('should generate correct user scope path', () => {
      const path = validator.getAgentPath('test-agent', 'user');
      expect(path).toContain('.claude');
      expect(path).toContain('agents');
      expect(path).toContain('test-agent.md');
    });

    it('should not allow path escape', () => {
      expect(() => validator.getAgentPath('../escape', 'project')).toThrow(SecurityError);
    });
  });

  describe('isPathAllowed', () => {
    it('should allow paths within agent directories', () => {
      const projectPath = validator.getAgentPath('test', 'project');
      expect(validator.isPathAllowed(projectPath)).toBe(true);
    });

    it('should reject paths outside agent directories', () => {
      expect(validator.isPathAllowed('/etc/passwd')).toBe(false);
      expect(validator.isPathAllowed('C:\\Windows\\System32')).toBe(false);
    });
  });
});
