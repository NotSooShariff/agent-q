/**
 * Delete Agent MCP Tool
 */

import type { AgentManager } from '@agent-q/core';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';

export const DELETE_AGENT_SCHEMA: Tool = {
  name: 'delete_agent',
  description: 'Delete an agent permanently. This action cannot be undone.',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Agent name to delete',
      },
      scope: {
        type: 'string',
        enum: ['project', 'user'],
        description: 'Agent scope (where to find it)',
      },
    },
    required: ['name', 'scope'],
  },
};

export async function deleteAgentTool(
  agentManager: AgentManager,
  args: unknown
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const typedArgs = args as {
    name: string;
    scope: 'project' | 'user';
  };

  // Delete the agent
  await agentManager.deleteAgent(typedArgs.name, typedArgs.scope);

  return {
    content: [
      {
        type: 'text',
        text: `✅ Successfully deleted agent: ${typedArgs.name}

The agent has been permanently removed from ${typedArgs.scope} scope.

You may need to reload Claude Code to reflect this change.`,
      },
    ],
  };
}
