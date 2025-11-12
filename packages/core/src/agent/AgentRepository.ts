/**
 * Agent file system operations
 */

import fs from 'fs/promises';
import path from 'path';
import type { Agent, AgentConfig, AgentScope } from '../types/index.js';
import { AgentNotFoundError, FileSystemError } from '../errors/index.js';
import { formatAgentMarkdown, parseAgentMarkdown } from './Agent.js';
import { PermissionManager } from '../security/PermissionManager.js';
import { PathValidator } from '../security/PathValidator.js';

/**
 * Handles agent persistence operations
 */
export class AgentRepository {
  private permissionManager: PermissionManager;
  private pathValidator: PathValidator;

  constructor() {
    this.permissionManager = new PermissionManager();
    this.pathValidator = new PathValidator();
  }

  /**
   * Save agent to disk
   */
  async save(config: AgentConfig): Promise<Agent> {
    const filePath = this.pathValidator.getAgentPath(config.name, config.scope);

    // Ensure parent directory exists
    const dirPath = path.dirname(filePath);
    await this.permissionManager.ensureDirectory(dirPath);

    // Verify write permission
    await this.permissionManager.verifyWritePermission(filePath);

    // Format as markdown
    const content = formatAgentMarkdown(config);

    try {
      // Write file
      await fs.writeFile(filePath, content, 'utf-8');

      // Get file stats
      const stats = await this.permissionManager.getStats(filePath);

      // Create agent object
      return {
        config,
        path: filePath,
        createdAt: stats.created,
        updatedAt: stats.modified,
      };
    } catch (error) {
      throw new FileSystemError(`Failed to save agent: ${config.name}`, {
        name: config.name,
        path: filePath,
        originalError: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Load agent from disk
   */
  async load(name: string, scope: AgentScope): Promise<Agent> {
    const filePath = this.pathValidator.getAgentPath(name, scope);

    // Verify file exists and is readable
    await this.permissionManager.verifyReadPermission(filePath);

    try {
      // Read file
      const content = await fs.readFile(filePath, 'utf-8');

      // Parse markdown
      const parsedConfig = parseAgentMarkdown(content);

      // Get file stats
      const stats = await this.permissionManager.getStats(filePath);

      // Create full config
      const config: AgentConfig = {
        ...parsedConfig,
        scope,
        // These might not be in the file but are required
        personality: parsedConfig.description, // Fallback
      };

      return {
        config,
        path: filePath,
        createdAt: stats.created,
        updatedAt: stats.modified,
      };
    } catch (error) {
      if (error instanceof FileSystemError) {
        throw error;
      }

      throw new FileSystemError(`Failed to load agent: ${name}`, {
        name,
        path: filePath,
        originalError: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Delete agent from disk
   */
  async delete(name: string, scope: AgentScope): Promise<void> {
    const filePath = this.pathValidator.getAgentPath(name, scope);

    // Check if file exists
    const exists = await this.permissionManager.exists(filePath);
    if (!exists) {
      throw new AgentNotFoundError(name);
    }

    // Verify write permission
    await this.permissionManager.verifyWritePermission(filePath);

    try {
      await fs.unlink(filePath);
    } catch (error) {
      throw new FileSystemError(`Failed to delete agent: ${name}`, {
        name,
        path: filePath,
        originalError: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Check if agent exists
   */
  async exists(name: string, scope: AgentScope): Promise<boolean> {
    try {
      const filePath = this.pathValidator.getAgentPath(name, scope);
      return await this.permissionManager.exists(filePath);
    } catch {
      return false;
    }
  }

  /**
   * List all agents in a directory
   */
  async listByScope(scope: AgentScope): Promise<Agent[]> {
    const dirPath = this.pathValidator.getAgentBaseDir(scope);

    // Check if directory exists
    const exists = await this.permissionManager.exists(dirPath);
    if (!exists) {
      return [];
    }

    try {
      const files = await fs.readdir(dirPath);

      // Filter for .md files
      const agentFiles = files.filter((file) => file.endsWith('.md'));

      // Load each agent
      const agents: Agent[] = [];

      for (const file of agentFiles) {
        try {
          const name = path.basename(file, '.md');
          const agent = await this.load(name, scope);
          agents.push(agent);
        } catch (error) {
          // Skip invalid agent files
          console.warn(`Failed to load agent from ${file}:`, error);
        }
      }

      return agents;
    } catch (error) {
      throw new FileSystemError(`Failed to list agents in ${scope} scope`, {
        scope,
        path: dirPath,
        originalError: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * List all agents (both scopes)
   */
  async listAll(): Promise<Agent[]> {
    const [projectAgents, userAgents] = await Promise.all([
      this.listByScope('project'),
      this.listByScope('user'),
    ]);

    return [...projectAgents, ...userAgents];
  }
}
