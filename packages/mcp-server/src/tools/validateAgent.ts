/**
 * Validate Agent MCP Tool
 */

import type { AgentManager } from '@agent-q/core';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';

export const VALIDATE_AGENT_SCHEMA: Tool = {
  name: 'validate_agent',
  description:
    'Validate an agent configuration without creating it. Useful for checking if a configuration is valid before saving.',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Agent name',
      },
      description: {
        type: 'string',
        description: 'Agent description',
      },
      personality: {
        type: 'string',
        description: 'Agent personality',
      },
      systemPrompt: {
        type: 'string',
        description: 'System prompt',
      },
      scope: {
        type: 'string',
        enum: ['project', 'user'],
        description: 'Agent scope',
      },
      tools: {
        type: 'array',
        items: { type: 'string' },
        description: 'Tools list',
      },
      model: {
        type: 'string',
        enum: ['sonnet', 'opus', 'haiku'],
        description: 'AI model',
      },
      expertise: {
        type: 'array',
        items: { type: 'string' },
        description: 'Expertise areas',
      },
    },
    required: ['name', 'description', 'personality', 'systemPrompt', 'scope'],
  },
};

export function validateAgentTool(
  agentManager: AgentManager,
  args: unknown
): { content: Array<{ type: string; text: string }> } {
  const typedArgs = args as {
    name: string;
    description: string;
    personality: string;
    systemPrompt: string;
    scope: 'project' | 'user';
    tools?: string[];
    model?: 'sonnet' | 'opus' | 'haiku';
    expertise?: string[];
  };

  // Validate the configuration
  const result = agentManager.validateConfig(typedArgs);

  let output = '';

  if (result.valid) {
    output = `✅ Agent configuration is valid!\n\n`;
    output += `Agent: ${typedArgs.name}\n`;
    output += `Description: ${typedArgs.description}\n`;
    output += `Scope: ${typedArgs.scope}\n`;

    if (result.warnings.length > 0) {
      output += `\n⚠️  Warnings:\n`;
      for (const warning of result.warnings) {
        output += `  • ${warning.field}: ${warning.message}\n`;
      }
    }

    output += `\nYou can safely create this agent using the create_agent tool.`;
  } else {
    output = `❌ Agent configuration has errors:\n\n`;
    for (const error of result.errors) {
      output += `  • ${error.field}: ${error.message}\n`;
    }

    if (result.warnings.length > 0) {
      output += `\n⚠️  Warnings:\n`;
      for (const warning of result.warnings) {
        output += `  • ${warning.field}: ${warning.message}\n`;
      }
    }

    output += `\nPlease fix these errors before creating the agent.`;
  }

  return {
    content: [
      {
        type: 'text',
        text: output,
      },
    ],
  };
}
