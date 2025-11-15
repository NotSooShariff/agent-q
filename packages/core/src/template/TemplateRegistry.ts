/**
 * Template registry for discovering and installing templates
 */

import type { Template, SearchQuery, InstallOptions, Agent } from '../types/index.js';
import { TemplateNotFoundError } from '../errors/index.js';

/**
 * Template registry client (will connect to remote registry in future)
 */
export class TemplateRegistry {
  constructor(_registryUrl: string = 'https://registry.agent-q.dev') {
    // Will be used in future implementation
  }

  /**
   * Search for templates
   * TODO: Implement actual registry API calls
   */
  search(_query: SearchQuery): Promise<Template[]> {
    // For now, return empty array (will implement in Phase 3)
    console.warn('Template registry not yet implemented');
    return Promise.resolve([]);
  }

  /**
   * Get a specific template by ID
   * TODO: Implement actual registry API calls
   */
  get(templateId: string): Promise<Template> {
    // Stub implementation
    return Promise.reject(new TemplateNotFoundError(templateId));
  }

  /**
   * Install a template as an agent
   * TODO: Implement actual installation logic
   */
  async install(templateId: string, _options: InstallOptions): Promise<Agent> {
    // Stub implementation
    await this.get(templateId); // This will throw TemplateNotFoundError

    // Will implement full installation in Phase 3
    throw new Error('Template installation not yet implemented');
  }

  /**
   * List featured templates
   * TODO: Implement actual registry API calls
   */
  listFeatured(): Promise<Template[]> {
    console.warn('Template registry not yet implemented');
    return Promise.resolve([]);
  }

  /**
   * List templates by category
   * TODO: Implement actual registry API calls
   */
  listByCategory(_category: string): Promise<Template[]> {
    console.warn('Template registry not yet implemented');
    return Promise.resolve([]);
  }
}
