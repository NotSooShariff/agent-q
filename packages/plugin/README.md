# Agent Q Plugin

The official Claude Code plugin for Agent Q - Enterprise-grade Agent Template Manager.

## What's Included

This plugin provides:

- **MCP Server**: Full Agent Q functionality via Model Context Protocol
- **Pre-built Agents**: 3 ready-to-use agent templates
  - Code Reviewer - Security-focused code analysis
  - Pair Programmer - Collaborative coding partner
  - Debugger - Systematic bug finder

## Installation

### Via Claude Code

```bash
claude plugin install agent-q
```

### Manual Installation

1. Download the plugin bundle
2. Extract to `~/.claude/plugins/agent-q/`
3. Restart Claude Code

## Quick Start

Once installed, you can:

### Use Pre-installed Agents

The plugin automatically installs 3 agents to your user scope:

```
User: "Review this code for security issues"
→ Claude automatically uses the code-reviewer agent

User: "Help me debug this function"
→ Claude automatically uses the debugger agent
```

### Create Custom Agents

```
User: "Create a documentation writer agent"
Claude: [Uses Agent Q MCP to create custom agent]
```

### Browse Templates

```
User: "Search for available agent templates"
Claude: [Shows all available templates]
```

### Install Templates

```
User: "Install the code-reviewer template"
Claude: [Installs template as an agent]
```

## Available MCP Tools

- `create_agent` - Create custom agents
- `update_agent` - Modify existing agents
- `delete_agent` - Remove agents
- `list_agents` - View all agents
- `validate_agent` - Check configuration
- `search_templates` - Browse templates
- `install_template` - Install from template

## Configuration

Configure Agent Q in your Claude Code settings:

```json
{
  "agentQ": {
    "defaultScope": "project",
    "templateDirectory": "/custom/path/to/templates"
  }
}
```

## Documentation

- [Getting Started](https://github.com/yourusername/agent-q/blob/main/docs/getting-started.md)
- [Creating Agents](https://github.com/yourusername/agent-q/blob/main/docs/guides/creating-agents.md)
- [API Reference](https://github.com/yourusername/agent-q/blob/main/docs/api-reference/mcp-tools.md)

## Support

- [Report Issues](https://github.com/yourusername/agent-q/issues)
- [Discussions](https://github.com/yourusername/agent-q/discussions)
- [Discord Community](https://discord.gg/agent-q)

## License

MIT © Agent Q Team
