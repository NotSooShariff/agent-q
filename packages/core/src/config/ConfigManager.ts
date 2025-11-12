/**
 * Configuration management for Agent Q
 */

import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { FileSystemError } from '../errors/index.js';

/**
 * Agent Q configuration
 */
export interface AgentQConfig {
  /** Default scope for new agents */
  defaultScope: 'project' | 'user';

  /** Template registry URL */
  registryUrl: string;

  /** Enable telemetry (opt-in) */
  telemetryEnabled: boolean;

  /** Audit log path */
  auditLogPath: string;

  /** Custom metadata */
  [key: string]: unknown;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: AgentQConfig = {
  defaultScope: 'project',
  registryUrl: 'https://registry.agent-q.dev',
  telemetryEnabled: false,
  auditLogPath: path.join(os.homedir(), '.claude', 'agent-q', 'audit.log'),
};

/**
 * Manages Agent Q configuration
 */
export class ConfigManager {
  private configPath: string;
  private config: AgentQConfig | null = null;

  constructor(configPath?: string) {
    this.configPath =
      configPath || path.join(os.homedir(), '.claude', 'agent-q', 'config.json');
  }

  /**
   * Load configuration from disk
   */
  async load(): Promise<AgentQConfig> {
    try {
      const exists = await this.fileExists(this.configPath);

      if (!exists) {
        // Return default config if file doesn't exist
        this.config = { ...DEFAULT_CONFIG };
        return this.config;
      }

      const content = await fs.readFile(this.configPath, 'utf-8');
      const loadedConfig = JSON.parse(content) as Partial<AgentQConfig>;

      // Merge with defaults
      this.config = {
        ...DEFAULT_CONFIG,
        ...loadedConfig,
      };

      return this.config;
    } catch (error) {
      throw new FileSystemError('Failed to load configuration', {
        path: this.configPath,
        originalError: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Save configuration to disk
   */
  async save(config: AgentQConfig): Promise<void> {
    try {
      // Ensure directory exists
      const dir = path.dirname(this.configPath);
      await fs.mkdir(dir, { recursive: true });

      // Write config
      await fs.writeFile(this.configPath, JSON.stringify(config, null, 2), 'utf-8');

      this.config = config;
    } catch (error) {
      throw new FileSystemError('Failed to save configuration', {
        path: this.configPath,
        originalError: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Get configuration value
   */
  async get<K extends keyof AgentQConfig>(key: K): Promise<AgentQConfig[K]> {
    if (!this.config) {
      await this.load();
    }

    return this.config![key];
  }

  /**
   * Set configuration value
   */
  async set<K extends keyof AgentQConfig>(key: K, value: AgentQConfig[K]): Promise<void> {
    if (!this.config) {
      await this.load();
    }

    this.config![key] = value;
    await this.save(this.config!);
  }

  /**
   * Get all configuration
   */
  async getAll(): Promise<AgentQConfig> {
    if (!this.config) {
      await this.load();
    }

    return { ...this.config! };
  }

  /**
   * Reset to default configuration
   */
  async reset(): Promise<void> {
    this.config = { ...DEFAULT_CONFIG };
    await this.save(this.config);
  }

  /**
   * Check if file exists
   */
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}
