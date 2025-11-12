/**
 * Update Agent MCP Tool
 */

import type { AgentManager } from '@agent-q/core';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';

export const UPDATE_AGENT_SCHEMA: Tool = {
  name: 'update_agent',
  description: 'Update an existing agent\'s configuration. Only provided fields will be updated.',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Agent name to update',
      },
      scope: {
        type: 'string',
        enum: ['project', 'user'],
        description: 'Agent scope (where to find it)',
      },
      description: {
        type: 'string',
        description: 'Updated description',
        maxLength: 200,
      },
      personality: {
        type: 'string',
        description: 'Updated personality',
        maxLength: 500,
      },
      systemPrompt: {
        type: 'string',
        description: 'Updated system prompt',
      },
      tools: {
        type: 'array',
        items: { type: 'string' },
        description: 'Updated tools list',
      },
      model: {
        type: 'string',
        enum: ['sonnet', 'opus', 'haiku'],
        description: 'Updated model',
      },
      expertise: {
        type: 'array',
        items: { type: 'string' },
        description: 'Updated expertise areas',
      },
    },
    required: ['name', 'scope'],
  },
};

export async function updateAgentTool(
  agentManager: AgentManager,
  args: unknown
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const typedArgs = args as {
    name: string;
    scope: 'project' | 'user';
    description?: string;
    personality?: string;
    systemPrompt?: string;
    tools?: string[];
    model?: 'sonnet' | 'opus' | 'haiku';
    expertise?: string[];
  };

  const { name, scope, ...updates } = typedArgs;

  // Update the agent
  const agent = await agentManager.updateAgent(name, scope, updates);

  return {
    content: [
      {
        type: 'text',
        text: `✅ Successfully updated agent: ${agent.config.name}

📍 Location: ${agent.path}
🕐 Updated: ${agent.updatedAt.toLocaleString()}

Updated fields: ${Object.keys(updates).join(', ')}

You may need to reload Claude Code to see the changes.`,
      },
    ],
  };
}
