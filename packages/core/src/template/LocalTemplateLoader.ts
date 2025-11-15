/**
 * Local template loader - loads templates from filesystem
 */

import fs from 'fs/promises';
import path from 'path';
import { parseAgentMarkdown } from '../agent/Agent.js';
import type { Template, Agent, AgentConfig, InstallOptions } from '../types/index.js';
import { TemplateNotFoundError, FileSystemError } from '../errors/index.js';
import { AgentManager } from '../agent/AgentManager.js';

/**
 * Loads templates from local filesystem
 */
export class LocalTemplateLoader {
  private templateDirs: string[];
  private agentManager: AgentManager;

  constructor(templateDirs: string[] = []) {
    this.templateDirs = templateDirs;
    this.agentManager = new AgentManager();
  }

  /**
   * Discover all available templates
   */
  async discoverTemplates(): Promise<Template[]> {
    const templates: Template[] = [];

    for (const dir of this.templateDirs) {
      try {
        const exists = await this.dirExists(dir);
        if (!exists) continue;

        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
          if (!entry.isDirectory()) continue;

          try {
            const template = await this.loadTemplate(path.join(dir, entry.name));
            templates.push(template);
          } catch (error) {
            console.warn(`Failed to load template from ${entry.name}:`, error);
          }
        }
      } catch (error) {
        console.warn(`Failed to read template directory ${dir}:`, error);
      }
    }

    return templates;
  }

  /**
   * Load a specific template by ID
   */
  async loadTemplate(templatePath: string): Promise<Template> {
    const agentFile = path.join(templatePath, 'agent.md');
    const readmeFile = path.join(templatePath, 'README.md');

    // Check if agent.md exists
    const agentExists = await this.fileExists(agentFile);
    if (!agentExists) {
      throw new TemplateNotFoundError(path.basename(templatePath));
    }

    try {
      // Read agent configuration
      const agentContent = await fs.readFile(agentFile, 'utf-8');
      const agentConfig = parseAgentMarkdown(agentContent);

      // Read README if exists
      let description = agentConfig.description;
      const readmeExists = await this.fileExists(readmeFile);
      if (readmeExists) {
        const readmeContent = await fs.readFile(readmeFile, 'utf-8');
        // Extract first paragraph as description
        const firstPara = readmeContent.split('\n\n')[1];
        if (firstPara) {
          description = firstPara.replace(/[#*`]/g, '').trim();
        }
      }

      // Build template
      const template: Template = {
        version: '1.0',
        metadata: {
          id: `local/${agentConfig.name}`,
          name: agentConfig.name,
          description: description || agentConfig.description,
          author: 'Agent Q',
          category: this.inferCategory(agentConfig.name),
          tags: this.inferTags(agentConfig.name, agentConfig.description),
          license: 'MIT',
          version: '1.0.0',
        },
        compatibility: {
          minVersion: '1.0.0',
          platforms: ['darwin', 'linux', 'win32'],
        },
        agent: agentConfig,
        customization: {
          variables: [],
        },
      };

      return template;
    } catch (error) {
      throw new FileSystemError(`Failed to load template from ${templatePath}`, {
        path: templatePath,
        originalError: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Install a template as an agent
   */
  async installTemplate(template: Template, options: InstallOptions): Promise<Agent> {
    const config: AgentConfig = {
      ...template.agent,
      name: options.name || template.agent.name,
      scope: options.scope,
    };

    // Apply variable substitutions if provided
    if (options.variables && template.customization?.variables) {
      // Apply variables to system prompt
      let systemPrompt = config.systemPrompt;
      for (const [key, value] of Object.entries(options.variables)) {
        const placeholder = `{{ ${key} }}`;
        systemPrompt = systemPrompt.replaceAll(placeholder, String(value));
      }
      config.systemPrompt = systemPrompt;
    }

    // Create the agent
    return await this.agentManager.createAgent(config);
  }

  /**
   * Search templates by query
   */
  async searchTemplates(query: string): Promise<Template[]> {
    const allTemplates = await this.discoverTemplates();

    if (!query || query.trim().length === 0) {
      return allTemplates;
    }

    const lowerQuery = query.toLowerCase();

    return allTemplates.filter((template) => {
      return (
        template.metadata.name.toLowerCase().includes(lowerQuery) ||
        template.metadata.description.toLowerCase().includes(lowerQuery) ||
        template.metadata.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    });
  }

  /**
   * Get templates by category
   */
  async getTemplatesByCategory(category: string): Promise<Template[]> {
    const allTemplates = await this.discoverTemplates();
    return allTemplates.filter((t) => t.metadata.category === category);
  }

  /**
   * Infer category from agent name
   */
  private inferCategory(name: string): string {
    if (name.includes('review')) return 'code-quality';
    if (name.includes('debug')) return 'debugging';
    if (name.includes('test')) return 'testing';
    if (name.includes('doc')) return 'documentation';
    if (name.includes('architect')) return 'architecture';
    if (name.includes('pair')) return 'development';
    return 'general';
  }

  /**
   * Infer tags from name and description
   */
  private inferTags(name: string, description: string): string[] {
    const tags = new Set<string>();
    const text = `${name} ${description}`.toLowerCase();

    const keywords = [
      'security',
      'performance',
      'testing',
      'debugging',
      'documentation',
      'review',
      'code-quality',
      'refactoring',
      'architecture',
      'collaboration',
    ];

    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        tags.add(keyword);
      }
    }

    return Array.from(tags);
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

  /**
   * Check if directory exists
   */
  private async dirExists(dirPath: string): Promise<boolean> {
    try {
      const stats = await fs.stat(dirPath);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }
}
