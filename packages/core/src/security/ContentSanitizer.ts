/**
 * Content sanitization to prevent injection attacks
 */

import { ValidationError } from '../errors/index.js';

/**
 * Sanitizes and validates content for security
 */
export class ContentSanitizer {
  private static readonly MAX_DESCRIPTION_LENGTH = 200;
  private static readonly MAX_SYSTEM_PROMPT_LENGTH = 50000;
  private static readonly MAX_PERSONALITY_LENGTH = 500;

  /**
   * Sanitize agent description
   */
  sanitizeDescription(description: string): string {
    if (!description || typeof description !== 'string') {
      throw new ValidationError('Description is required', { field: 'description' });
    }

    // Trim whitespace
    const trimmed = description.trim();

    if (trimmed.length === 0) {
      throw new ValidationError('Description cannot be empty', { field: 'description' });
    }

    if (trimmed.length > ContentSanitizer.MAX_DESCRIPTION_LENGTH) {
      throw new ValidationError(
        `Description exceeds maximum length of ${ContentSanitizer.MAX_DESCRIPTION_LENGTH}`,
        {
          field: 'description',
          maxLength: ContentSanitizer.MAX_DESCRIPTION_LENGTH,
        }
      );
    }

    // Remove control characters except newlines and tabs
    const sanitized = trimmed.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

    return sanitized;
  }

  /**
   * Sanitize personality description
   */
  sanitizePersonality(personality: string): string {
    if (!personality || typeof personality !== 'string') {
      throw new ValidationError('Personality is required', { field: 'personality' });
    }

    const trimmed = personality.trim();

    if (trimmed.length === 0) {
      throw new ValidationError('Personality cannot be empty', { field: 'personality' });
    }

    if (trimmed.length > ContentSanitizer.MAX_PERSONALITY_LENGTH) {
      throw new ValidationError(
        `Personality exceeds maximum length of ${ContentSanitizer.MAX_PERSONALITY_LENGTH}`,
        {
          field: 'personality',
          maxLength: ContentSanitizer.MAX_PERSONALITY_LENGTH,
        }
      );
    }

    // Remove control characters except newlines and tabs
    const sanitized = trimmed.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

    return sanitized;
  }

  /**
   * Sanitize system prompt
   */
  sanitizeSystemPrompt(prompt: string): string {
    if (!prompt || typeof prompt !== 'string') {
      throw new ValidationError('System prompt is required', { field: 'systemPrompt' });
    }

    const trimmed = prompt.trim();

    if (trimmed.length === 0) {
      throw new ValidationError('System prompt cannot be empty', { field: 'systemPrompt' });
    }

    if (trimmed.length > ContentSanitizer.MAX_SYSTEM_PROMPT_LENGTH) {
      throw new ValidationError(
        `System prompt exceeds maximum length of ${ContentSanitizer.MAX_SYSTEM_PROMPT_LENGTH}`,
        {
          field: 'systemPrompt',
          maxLength: ContentSanitizer.MAX_SYSTEM_PROMPT_LENGTH,
        }
      );
    }

    // Remove null bytes and other dangerous control characters
    // Keep newlines, tabs, and carriage returns for formatting
    const sanitized = trimmed.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    return sanitized;
  }

  /**
   * Sanitize expertise array
   */
  sanitizeExpertise(expertise?: string[]): string[] | undefined {
    if (!expertise) {
      return undefined;
    }

    if (!Array.isArray(expertise)) {
      throw new ValidationError('Expertise must be an array', { field: 'expertise' });
    }

    return expertise
      .filter((item) => typeof item === 'string' && item.trim().length > 0)
      .map((item) => item.trim().slice(0, 50)) // Limit each item to 50 chars
      .slice(0, 20); // Limit to 20 items
  }

  /**
   * Sanitize tools array
   */
  sanitizeTools(tools?: string[]): string[] | undefined {
    if (!tools) {
      return undefined;
    }

    if (!Array.isArray(tools)) {
      throw new ValidationError('Tools must be an array', { field: 'tools' });
    }

    // Tool names should be alphanumeric with underscores
    const toolPattern = /^[a-zA-Z][a-zA-Z0-9_]*$/;

    const sanitized = tools
      .filter((tool) => {
        if (typeof tool !== 'string') return false;
        const trimmed = tool.trim();
        return trimmed.length > 0 && toolPattern.test(trimmed);
      })
      .map((tool) => tool.trim());

    if (sanitized.length === 0 && tools.length > 0) {
      throw new ValidationError('No valid tools provided', {
        field: 'tools',
        pattern: toolPattern.source,
      });
    }

    return sanitized.length > 0 ? sanitized : undefined;
  }

  /**
   * Detect potential injection patterns
   */
  detectInjectionPatterns(content: string): boolean {
    // Patterns that might indicate injection attempts
    const suspiciousPatterns = [
      /<script[^>]*>.*?<\/script>/gi, // Script tags
      /javascript:/gi, // JavaScript protocol
      /on\w+\s*=\s*["'][^"']*["']/gi, // Event handlers
      /eval\s*\(/gi, // Eval calls
      /expression\s*\(/gi, // CSS expressions
      /import\s+.*from/gi, // ES6 imports (potential code injection)
    ];

    return suspiciousPatterns.some((pattern) => pattern.test(content));
  }

  /**
   * Validate content doesn't contain suspicious patterns
   */
  validateContent(content: string): void {
    if (this.detectInjectionPatterns(content)) {
      throw new ValidationError('Content contains potentially malicious patterns', {
        field: 'content',
      });
    }
  }
}
