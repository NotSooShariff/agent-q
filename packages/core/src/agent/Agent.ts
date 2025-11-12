/**
 * Agent model and utilities
 */

import type { Agent, AgentConfig, ClaudeModel } from '../types/index.js';

/**
 * Format agent configuration as Markdown with YAML frontmatter
 */
export function formatAgentMarkdown(config: AgentConfig): string {
  const {
    name,
    description,
    tools,
    model,
    systemPrompt,
  } = config;

  // Build YAML frontmatter
  const frontmatter: string[] = [
    '---',
    `name: ${name}`,
    `description: ${description}`,
  ];

  if (tools && tools.length > 0) {
    frontmatter.push(`tools: ${tools.join(', ')}`);
  }

  if (model) {
    frontmatter.push(`model: ${model}`);
  }

  frontmatter.push('---');

  // Combine frontmatter and system prompt
  return `${frontmatter.join('\n')}\n\n${systemPrompt}\n`;
}

/**
 * Parse agent markdown file
 */
export function parseAgentMarkdown(content: string): Omit<AgentConfig, 'scope'> {
  // Extract frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n\n([\s\S]*)$/);

  if (!frontmatterMatch) {
    throw new Error('Invalid agent file format: missing YAML frontmatter');
  }

  const [, frontmatterContent, systemPrompt] = frontmatterMatch;

  if (!frontmatterContent || !systemPrompt) {
    throw new Error('Invalid agent file format: missing content');
  }

  // Parse YAML frontmatter (simple parser for our specific format)
  const config: Partial<AgentConfig> = {
    systemPrompt: systemPrompt.trim(),
  };

  const lines = frontmatterContent.split('\n');

  for (const line of lines) {
    const [key, ...valueParts] = line.split(':');
    if (!key || valueParts.length === 0) continue;

    const value = valueParts.join(':').trim();

    switch (key.trim()) {
      case 'name':
        config.name = value;
        break;
      case 'description':
        config.description = value;
        break;
      case 'tools':
        config.tools = value.split(',').map((t) => t.trim());
        break;
      case 'model':
        config.model = value as ClaudeModel;
        break;
    }
  }

  // Validate required fields
  if (!config.name || !config.description || !config.systemPrompt) {
    throw new Error('Invalid agent file: missing required fields (name, description, systemPrompt)');
  }

  return config as Omit<AgentConfig, 'scope'>;
}

/**
 * Validate agent configuration
 */
export function validateAgentConfig(config: Partial<AgentConfig>): config is AgentConfig {
  if (!config.name || typeof config.name !== 'string') {
    return false;
  }

  if (!config.description || typeof config.description !== 'string') {
    return false;
  }

  if (!config.personality || typeof config.personality !== 'string') {
    return false;
  }

  if (!config.scope || !['project', 'user'].includes(config.scope)) {
    return false;
  }

  if (!config.systemPrompt || typeof config.systemPrompt !== 'string') {
    return false;
  }

  if (config.tools !== undefined && !Array.isArray(config.tools)) {
    return false;
  }

  if (config.model !== undefined && !['sonnet', 'opus', 'haiku'].includes(config.model)) {
    return false;
  }

  return true;
}

/**
 * Create agent object from config and path
 */
export function createAgent(config: AgentConfig, filePath: string): Agent {
  const now = new Date();

  return {
    config,
    path: filePath,
    createdAt: now,
    updatedAt: now,
  };
}
