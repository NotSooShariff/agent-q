/**
 * Create Agent MCP Tool
 */

import type { AgentManager } from '@agent-q/core';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';

export const CREATE_AGENT_SCHEMA: Tool = {
  name: 'create_agent',
  description:
    'Create a new Claude Code agent with custom personality and behavior. The agent will be saved as a markdown file and can be automatically invoked by Claude Code based on its description.',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description:
          'Unique agent identifier (lowercase, alphanumeric, hyphens only). Example: "security-reviewer"',
        pattern: '^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$',
      },
      description: {
        type: 'string',
        description:
          'Brief description of when to use this agent (max 200 chars). Claude Code uses this to decide when to invoke the agent. Example: "Reviews code for security vulnerabilities and best practices"',
        maxLength: 200,
      },
      personality: {
        type: 'string',
        description:
          'Agent personality and behavior traits. Example: "Critical, detail-oriented senior engineer who is direct but constructive"',
        maxLength: 500,
      },
      systemPrompt: {
        type: 'string',
        description:
          'Detailed system prompt that defines the agent\'s role, capabilities, and approach. This is the main instruction set for the agent.',
      },
      scope: {
        type: 'string',
        enum: ['project', 'user'],
        description:
          'Storage scope: "project" (stored in .claude/agents/, shared with team) or "user" (stored in ~/.claude/agents/, personal)',
        default: 'project',
      },
      tools: {
        type: 'array',
        items: { type: 'string' },
        description:
          'Optional: List of tools the agent can use (e.g., ["Read", "Grep", "Edit"]). If omitted, agent has access to all tools.',
      },
      model: {
        type: 'string',
        enum: ['sonnet', 'opus', 'haiku'],
        description: 'Optional: Claude model to use. Defaults to sonnet.',
      },
      expertise: {
        type: 'array',
        items: { type: 'string' },
        description:
          'Optional: Areas of expertise (e.g., ["security", "performance", "testing"])',
      },
    },
    required: ['name', 'description', 'personality', 'systemPrompt', 'scope'],
  },
};

export async function createAgentTool(
  agentManager: AgentManager,
  args: unknown
): Promise<{ content: Array<{ type: string; text: string }> }> {
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

  // Create the agent
  const agent = await agentManager.createAgent(typedArgs);

  const scopeMessage =
    agent.config.scope === 'project'
      ? 'shared with your team via git'
      : 'stored in your user directory';

  return {
    content: [
      {
        type: 'text',
        text: `✅ Successfully created agent: ${agent.config.name}

📍 Location: ${agent.path}
📦 Scope: ${agent.config.scope} (${scopeMessage})
🤖 Model: ${agent.config.model || 'sonnet'}
🔧 Tools: ${agent.config.tools ? agent.config.tools.join(', ') : 'all tools'}

The agent is now available and Claude Code will automatically invoke it based on the description:
"${agent.config.description}"

You may need to reload Claude Code to see the agent in action.`,
      },
    ],
  };
}
