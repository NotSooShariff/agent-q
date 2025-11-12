/**
 * List Agents MCP Tool
 */

import type { AgentManager } from '@agent-q/core';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';

export const LIST_AGENTS_SCHEMA: Tool = {
  name: 'list_agents',
  description:
    'List all available agents, optionally filtered by scope. Shows agent names, descriptions, and metadata.',
  inputSchema: {
    type: 'object',
    properties: {
      scope: {
        type: 'string',
        enum: ['project', 'user', 'all'],
        description: 'Filter by scope: "project", "user", or "all" (default)',
        default: 'all',
      },
    },
  },
};

export async function listAgentsTool(
  agentManager: AgentManager,
  args: unknown
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const typedArgs = args as {
    scope?: 'project' | 'user' | 'all';
  };

  const scope = typedArgs.scope === 'all' || !typedArgs.scope ? undefined : typedArgs.scope;

  // Get agents
  const agents = await agentManager.listAgents(scope);

  if (agents.length === 0) {
    return {
      content: [
        {
          type: 'text',
          text: `No agents found${scope ? ` in ${scope} scope` : ''}.

Use the create_agent tool to create your first agent!`,
        },
      ],
    };
  }

  // Group by scope
  const projectAgents = agents.filter((a) => a.config.scope === 'project');
  const userAgents = agents.filter((a) => a.config.scope === 'user');

  let output = `Found ${agents.length} agent(s):\n\n`;

  if (projectAgents.length > 0) {
    output += `📦 Project Agents (${projectAgents.length}):\n`;
    for (const agent of projectAgents) {
      output += `\n  • ${agent.config.name}\n`;
      output += `    ${agent.config.description}\n`;
      output += `    Model: ${agent.config.model || 'sonnet'}`;
      if (agent.config.tools) {
        output += ` | Tools: ${agent.config.tools.slice(0, 3).join(', ')}${agent.config.tools.length > 3 ? '...' : ''}`;
      }
      output += `\n    Path: ${agent.path}\n`;
    }
  }

  if (userAgents.length > 0) {
    output += `\n👤 User Agents (${userAgents.length}):\n`;
    for (const agent of userAgents) {
      output += `\n  • ${agent.config.name}\n`;
      output += `    ${agent.config.description}\n`;
      output += `    Model: ${agent.config.model || 'sonnet'}`;
      if (agent.config.tools) {
        output += ` | Tools: ${agent.config.tools.slice(0, 3).join(', ')}${agent.config.tools.length > 3 ? '...' : ''}`;
      }
      output += `\n    Path: ${agent.path}\n`;
    }
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
