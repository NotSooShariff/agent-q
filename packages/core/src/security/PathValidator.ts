/**
 * Path validation to prevent security vulnerabilities
 */

import path from 'path';
import os from 'os';
import { SecurityError } from '../errors/index.js';
import type { AgentScope } from '../types/index.js';

/**
 * Validates and constructs safe file paths for agents
 */
export class PathValidator {
  private static readonly AGENT_NAME_PATTERN = /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/;
  private static readonly MAX_NAME_LENGTH = 50;

  /**
   * Validate an agent name
   */
  validateAgentName(name: string): void {
    if (!name || typeof name !== 'string') {
      throw new SecurityError('Agent name is required', { field: 'name' });
    }

    if (name.length > PathValidator.MAX_NAME_LENGTH) {
      throw new SecurityError(
        `Agent name exceeds maximum length of ${PathValidator.MAX_NAME_LENGTH}`,
        { field: 'name', maxLength: PathValidator.MAX_NAME_LENGTH }
      );
    }

    // Check for path traversal patterns
    if (name.includes('..') || name.includes('/') || name.includes('\\')) {
      throw new SecurityError('Agent name contains invalid characters (path traversal detected)', {
        field: 'name',
        invalidChars: ['..', '/', '\\'],
      });
    }

    // Validate pattern
    if (!PathValidator.AGENT_NAME_PATTERN.test(name)) {
      throw new SecurityError(
        'Agent name must be lowercase alphanumeric with hyphens (cannot start/end with hyphen)',
        { field: 'name', pattern: PathValidator.AGENT_NAME_PATTERN.source }
      );
    }

    // Prevent reserved names
    const reservedNames = ['con', 'prn', 'aux', 'nul', 'com1', 'lpt1'];
    if (reservedNames.includes(name.toLowerCase())) {
      throw new SecurityError('Agent name is reserved', {
        field: 'name',
        reservedNames,
      });
    }
  }

  /**
   * Get the base directory for agents based on scope
   */
  getAgentBaseDir(scope: AgentScope): string {
    if (scope === 'project') {
      return path.join(process.cwd(), '.claude', 'agents');
    } else {
      return path.join(os.homedir(), '.claude', 'agents');
    }
  }

  /**
   * Construct a safe path for an agent file
   */
  getAgentPath(name: string, scope: AgentScope): string {
    this.validateAgentName(name);

    const baseDir = this.getAgentBaseDir(scope);
    const agentPath = path.join(baseDir, `${name}.md`);

    // Extra safety: ensure the resolved path is within the base directory
    const normalizedPath = path.normalize(agentPath);
    const normalizedBase = path.normalize(baseDir);

    if (!normalizedPath.startsWith(normalizedBase)) {
      throw new SecurityError('Resolved path is outside the allowed directory', {
        field: 'name',
        attemptedPath: normalizedPath,
        allowedBase: normalizedBase,
      });
    }

    return agentPath;
  }

  /**
   * Validate that a path is within allowed directories
   */
  isPathAllowed(filePath: string): boolean {
    try {
      const normalizedPath = path.normalize(filePath);

      // Check against both project and user directories
      const projectBase = this.getAgentBaseDir('project');
      const userBase = this.getAgentBaseDir('user');

      return (
        normalizedPath.startsWith(path.normalize(projectBase)) ||
        normalizedPath.startsWith(path.normalize(userBase))
      );
    } catch {
      return false;
    }
  }
}
