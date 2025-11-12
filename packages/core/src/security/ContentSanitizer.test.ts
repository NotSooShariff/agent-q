/**
 * ContentSanitizer tests
 */

import { ContentSanitizer } from './ContentSanitizer';
import { ValidationError } from '../errors/index';

describe('ContentSanitizer', () => {
  let sanitizer: ContentSanitizer;

  beforeEach(() => {
    sanitizer = new ContentSanitizer();
  });

  describe('sanitizeDescription', () => {
    it('should accept valid descriptions', () => {
      const description = 'A code reviewer that focuses on security';
      expect(sanitizer.sanitizeDescription(description)).toBe(description);
    });

    it('should trim whitespace', () => {
      const description = '  Test description  ';
      expect(sanitizer.sanitizeDescription(description)).toBe('Test description');
    });

    it('should reject empty descriptions', () => {
      expect(() => sanitizer.sanitizeDescription('')).toThrow(ValidationError);
      expect(() => sanitizer.sanitizeDescription('   ')).toThrow(ValidationError);
    });

    it('should reject descriptions that are too long', () => {
      const longDesc = 'a'.repeat(201);
      expect(() => sanitizer.sanitizeDescription(longDesc)).toThrow(ValidationError);
    });

    it('should remove control characters', () => {
      const description = 'Test\x00description\x01with\x02control';
      const sanitized = sanitizer.sanitizeDescription(description);
      expect(sanitized).not.toContain('\x00');
      expect(sanitized).not.toContain('\x01');
    });
  });

  describe('sanitizeSystemPrompt', () => {
    it('should accept valid system prompts', () => {
      const prompt = 'You are a helpful assistant.';
      expect(sanitizer.sanitizeSystemPrompt(prompt)).toBe(prompt);
    });

    it('should reject empty prompts', () => {
      expect(() => sanitizer.sanitizeSystemPrompt('')).toThrow(ValidationError);
    });

    it('should reject prompts that are too long', () => {
      const longPrompt = 'a'.repeat(50001);
      expect(() => sanitizer.sanitizeSystemPrompt(longPrompt)).toThrow(ValidationError);
    });

    it('should preserve newlines and formatting', () => {
      const prompt = 'Line 1\nLine 2\n\nLine 3';
      expect(sanitizer.sanitizeSystemPrompt(prompt)).toBe(prompt);
    });
  });

  describe('sanitizeTools', () => {
    it('should accept valid tool names', () => {
      const tools = ['Read', 'Write', 'Grep', 'Bash'];
      const result = sanitizer.sanitizeTools(tools);
      expect(result).toEqual(tools);
    });

    it('should filter invalid tool names', () => {
      const tools = ['Read', 'invalid tool', 'Write', '123invalid'];
      const result = sanitizer.sanitizeTools(tools);
      expect(result).toEqual(['Read', 'Write']);
    });

    it('should return undefined for empty array', () => {
      const result = sanitizer.sanitizeTools([]);
      expect(result).toBeUndefined();
    });

    it('should throw if no valid tools provided', () => {
      expect(() => sanitizer.sanitizeTools(['123invalid', '@bad', '!tool'])).toThrow(
        ValidationError
      );
    });
  });

  describe('detectInjectionPatterns', () => {
    it('should detect script tags', () => {
      const content = '<script>alert("xss")</script>';
      expect(sanitizer.detectInjectionPatterns(content)).toBe(true);
    });

    it('should detect javascript protocol', () => {
      const content = 'javascript:alert(1)';
      expect(sanitizer.detectInjectionPatterns(content)).toBe(true);
    });

    it('should detect eval calls', () => {
      const content = 'eval(userInput)';
      expect(sanitizer.detectInjectionPatterns(content)).toBe(true);
    });

    it('should not detect normal content', () => {
      const content = 'This is a normal agent description without any injection.';
      expect(sanitizer.detectInjectionPatterns(content)).toBe(false);
    });
  });

  describe('validateContent', () => {
    it('should pass valid content', () => {
      const content = 'Normal agent description';
      expect(() => sanitizer.validateContent(content)).not.toThrow();
    });

    it('should reject malicious content', () => {
      const content = '<script>alert(1)</script>';
      expect(() => sanitizer.validateContent(content)).toThrow(ValidationError);
    });
  });
});
