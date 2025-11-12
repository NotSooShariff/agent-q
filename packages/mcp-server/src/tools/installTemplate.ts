/**
 * Install Template MCP Tool
 */

import path from 'path';
import { fileURLToPath } from 'url';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { LocalTemplateLoader } from '@agent-q/core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const INSTALL_TEMPLATE_SCHEMA: Tool = {
  name: 'install_template',
  description:
    'Install an agent from a pre-built template. Templates are ready-to-use agent configurations for common tasks.',
  inputSchema: {
    type: 'object',
    properties: {
      templateId: {
        type: 'string',
        description:
          'Template identifier (e.g., "code-reviewer", "pair-programmer", "debugger")',
      },
      scope: {
        type: 'string',
        enum: ['project', 'user'],
        description: 'Installation scope: "project" or "user"',
        default: 'project',
      },
      customName: {
        type: 'string',
        description: 'Optional: Custom name for the installed agent (defaults to template name)',
      },
    },
    required: ['templateId', 'scope'],
  },
};

export async function installTemplateTool(
  args: unknown
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const typedArgs = args as {
    templateId: string;
    scope: 'project' | 'user';
    customName?: string;
  };

  // Get template directories
  const projectRoot = path.resolve(__dirname, '../../../..');
  const templatesDir = path.join(projectRoot, 'templates');

  const loader = new LocalTemplateLoader([templatesDir]);

  // Discover all templates
  const templates = await loader.discoverTemplates();

  // Find matching template
  const template = templates.find(
    (t) =>
      t.metadata.id.includes(typedArgs.templateId) ||
      t.metadata.name === typedArgs.templateId
  );

  if (!template) {
    const available = templates.map((t) => t.metadata.name).join(', ');
    return {
      content: [
        {
          type: 'text',
          text: `❌ Template not found: ${typedArgs.templateId}

Available templates: ${available}

Use the search_templates tool to see all available templates.`,
        },
      ],
    };
  }

  // Install the template
  const agent = await loader.installTemplate(template, {
    scope: typedArgs.scope,
    name: typedArgs.customName,
  });

  return {
    content: [
      {
        type: 'text',
        text: `✅ Successfully installed template: ${template.metadata.name}

📍 Agent Name: ${agent.config.name}
📦 Scope: ${agent.config.scope}
📁 Location: ${agent.path}
🤖 Model: ${agent.config.model || 'sonnet'}
🔧 Tools: ${agent.config.tools ? agent.config.tools.join(', ') : 'all tools'}

📝 Description: ${template.metadata.description}

The agent is ready to use! Claude Code will automatically invoke it when appropriate.`,
      },
    ],
  };
}
