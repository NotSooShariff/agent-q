/**
 * MCP Tools setup
 */

import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import type { AgentManager } from '@agent-q/core';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { createAgentTool, CREATE_AGENT_SCHEMA } from './createAgent.js';
import { updateAgentTool, UPDATE_AGENT_SCHEMA } from './updateAgent.js';
import { deleteAgentTool, DELETE_AGENT_SCHEMA } from './deleteAgent.js';
import { listAgentsTool, LIST_AGENTS_SCHEMA } from './listAgents.js';
import { validateAgentTool, VALIDATE_AGENT_SCHEMA } from './validateAgent.js';
import { installTemplateTool, INSTALL_TEMPLATE_SCHEMA } from './installTemplate.js';
import { searchTemplatesTool, SEARCH_TEMPLATES_SCHEMA } from './searchTemplates.js';

/**
 * Set up all MCP tools
 */
export function setupTools(server: Server, agentManager: AgentManager): void {
  // Register tool list handler
  server.setRequestHandler(ListToolsRequestSchema, () => {
    return {
      tools: [
        CREATE_AGENT_SCHEMA,
        UPDATE_AGENT_SCHEMA,
        DELETE_AGENT_SCHEMA,
        LIST_AGENTS_SCHEMA,
        VALIDATE_AGENT_SCHEMA,
        INSTALL_TEMPLATE_SCHEMA,
        SEARCH_TEMPLATES_SCHEMA,
      ],
    };
  });

  // Register tool call handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case 'create_agent':
          return await createAgentTool(agentManager, args);

        case 'update_agent':
          return await updateAgentTool(agentManager, args);

        case 'delete_agent':
          return await deleteAgentTool(agentManager, args);

        case 'list_agents':
          return await listAgentsTool(agentManager, args);

        case 'validate_agent':
          return validateAgentTool(agentManager, args);

        case 'install_template':
          return await installTemplateTool(args);

        case 'search_templates':
          return await searchTemplatesTool(args);

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text' as const,
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  });
}
