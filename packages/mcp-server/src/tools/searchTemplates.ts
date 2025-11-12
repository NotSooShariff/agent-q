/**
 * Search Templates MCP Tool
 */

import path from 'path';
import { fileURLToPath } from 'url';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { LocalTemplateLoader } from '@agent-q/core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const SEARCH_TEMPLATES_SCHEMA: Tool = {
  name: 'search_templates',
  description:
    'Search for available agent templates. Browse pre-built agent configurations for common development tasks.',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search query (searches name, description, and tags). Leave empty to list all.',
      },
      category: {
        type: 'string',
        description: 'Filter by category (e.g., "code-quality", "debugging", "development")',
      },
    },
  },
};

export async function searchTemplatesTool(
  args: unknown
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const typedArgs = args as {
    query?: string;
    category?: string;
  };

  // Get template directories
  const projectRoot = path.resolve(__dirname, '../../../..');
  const templatesDir = path.join(projectRoot, 'templates');

  const loader = new LocalTemplateLoader([templatesDir]);

  // Search or list all
  let templates = typedArgs.query
    ? await loader.searchTemplates(typedArgs.query)
    : await loader.discoverTemplates();

  // Filter by category if provided
  if (typedArgs.category) {
    templates = templates.filter((t) => t.metadata.category === typedArgs.category);
  }

  if (templates.length === 0) {
    return {
      content: [
        {
          type: 'text',
          text: `No templates found${typedArgs.query ? ` matching "${typedArgs.query}"` : ''}.`,
        },
      ],
    };
  }

  // Format output
  let output = `Found ${templates.length} template(s):\n\n`;

  for (const template of templates) {
    output += `📦 **${template.metadata.name}**\n`;
    output += `   ${template.metadata.description}\n`;
    output += `   Category: ${template.metadata.category}`;
    if (template.metadata.tags.length > 0) {
      output += ` | Tags: ${template.metadata.tags.join(', ')}`;
    }
    output += `\n   Install: use install_template with templateId="${template.metadata.name}"\n\n`;
  }

  output += `\n💡 Use install_template to install any of these templates.`;

  return {
    content: [
      {
        type: 'text',
        text: output,
      },
    ],
  };
}
