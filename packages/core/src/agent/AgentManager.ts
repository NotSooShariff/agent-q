/**
 * High-level agent management operations
 */

import type { Agent, AgentConfig, AgentScope } from '../types/index.js';
import { AgentExistsError, AgentNotFoundError } from '../errors/index.js';
import { AgentRepository } from './AgentRepository.js';
import { AgentValidator } from './AgentValidator.js';
import { ContentSanitizer } from '../security/ContentSanitizer.js';

/**
 * Manages agent lifecycle and operations
 */
export class AgentManager {
  private repository: AgentRepository;
  private validator: AgentValidator;
  private sanitizer: ContentSanitizer;

  constructor() {
    this.repository = new AgentRepository();
    this.validator = new AgentValidator();
    this.sanitizer = new ContentSanitizer();
  }

  /**
   * Create a new agent
   */
  async createAgent(config: Partial<AgentConfig>): Promise<Agent> {
    // Validate configuration
    this.validator.validateOrThrow(config);

    // Check if agent already exists
    const exists = await this.repository.exists(config.name!, config.scope!);
    if (exists) {
      throw new AgentExistsError(config.name!);
    }

    // Sanitize all content
    const sanitizedConfig: AgentConfig = {
      name: config.name!,
      description: this.sanitizer.sanitizeDescription(config.description!),
      personality: this.sanitizer.sanitizePersonality(config.personality!),
      systemPrompt: this.sanitizer.sanitizeSystemPrompt(config.systemPrompt!),
      scope: config.scope!,
      expertise: this.sanitizer.sanitizeExpertise(config.expertise),
      tools: this.sanitizer.sanitizeTools(config.tools),
      model: config.model,
      metadata: config.metadata,
    };

    // Save agent
    return await this.repository.save(sanitizedConfig);
  }

  /**
   * Update an existing agent
   */
  async updateAgent(name: string, scope: AgentScope, updates: Partial<AgentConfig>): Promise<Agent> {
    // Check if agent exists
    const exists = await this.repository.exists(name, scope);
    if (!exists) {
      throw new AgentNotFoundError(name);
    }

    // Load existing agent
    const existingAgent = await this.repository.load(name, scope);

    // Merge updates with existing config
    const updatedConfig: Partial<AgentConfig> = {
      ...existingAgent.config,
      ...updates,
      name, // Name can't be changed
      scope, // Scope can't be changed
    };

    // Validate merged config
    this.validator.validateOrThrow(updatedConfig);

    // Sanitize updated fields
    const sanitizedConfig: AgentConfig = {
      name,
      description: this.sanitizer.sanitizeDescription(updatedConfig.description!),
      personality: this.sanitizer.sanitizePersonality(updatedConfig.personality!),
      systemPrompt: this.sanitizer.sanitizeSystemPrompt(updatedConfig.systemPrompt!),
      scope,
      expertise: this.sanitizer.sanitizeExpertise(updatedConfig.expertise),
      tools: this.sanitizer.sanitizeTools(updatedConfig.tools),
      model: updatedConfig.model,
      metadata: updatedConfig.metadata,
    };

    // Save updated agent
    return await this.repository.save(sanitizedConfig);
  }

  /**
   * Delete an agent
   */
  async deleteAgent(name: string, scope: AgentScope): Promise<void> {
    return await this.repository.delete(name, scope);
  }

  /**
   * Get an agent by name and scope
   */
  async getAgent(name: string, scope: AgentScope): Promise<Agent> {
    return await this.repository.load(name, scope);
  }

  /**
   * List all agents
   */
  async listAgents(scope?: AgentScope): Promise<Agent[]> {
    if (scope) {
      return await this.repository.listByScope(scope);
    }
    return await this.repository.listAll();
  }

  /**
   * Check if an agent exists
   */
  async agentExists(name: string, scope: AgentScope): Promise<boolean> {
    return await this.repository.exists(name, scope);
  }

  /**
   * Validate agent configuration without creating it
   */
  validateConfig(config: Partial<AgentConfig>): ReturnType<AgentValidator['validate']> {
    return this.validator.validate(config);
  }
}
