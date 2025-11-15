#!/usr/bin/env node

/**
 * Agent Q MCP Server
 * Entry point for the Model Context Protocol server
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { AgentManager } from '@agent-q/core';
import { setupTools } from './tools/index.js';

/**
 * Initialize and start the MCP server
 */
async function main(): Promise<void> {
  // Create MCP server instance
  const server = new Server(
    {
      name: 'agent-q',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Initialize agent manager
  const agentManager = new AgentManager();

  // Set up tools
  setupTools(server, agentManager);

  // Handle errors
  server.onerror = (error) => {
    console.error('[MCP Error]', error);
  };

  process.on('SIGINT', async () => {
    await server.close();
    process.exit(0);
  });

  // Start server with stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('Agent Q MCP Server running on stdio');
}

// Start the server
main().catch((error) => {
  console.error('Fatal error starting server:', error);
  process.exit(1);
});
