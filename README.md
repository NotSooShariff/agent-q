# Agent Q

> Professional AI Agent Management via Model Context Protocol (MCP)

[![npm version](https://badge.fury.io/js/%40notsooshariff%2Fagent-q.svg)](https://www.npmjs.com/package/@notsooshariff/agent-q)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

## Overview

Agent Q is a Model Context Protocol (MCP) server that enables you to create, manage, and organize specialized AI agents for any MCP-compatible AI tool. With 120+ pre-built agent templates covering everything from code review to DevOps, Agent Q helps you streamline your AI workflows.

### Key Features

- **120+ Agent Templates** - Pre-configured specialists ready to use
- **Full Agent Lifecycle** - Create, update, delete, and manage agents
- **MCP Standard Compliant** - Works with any MCP-compatible AI tool
- **Security-Focused** - Path validation and content sanitization
- **TypeScript-First** - Full type safety and IntelliSense support
- **Zero Config** - Works out of the box with sensible defaults

## Quick Start

### Installation

```bash
# Using npx (recommended)
npx @notsooshariff/agent-q

# Or install globally
npm install -g @notsooshariff/agent-q
```

### Configuration

Add Agent Q to your MCP-compatible AI tool:

**Standard Configuration:**
```json
{
  "mcpServers": {
    "agent-q": {
      "command": "npx",
      "args": ["-y", "@notsooshariff/agent-q"]
    }
  }
}
```

### Tool-Specific Setup

<details>
<summary><b>Claude Desktop</b></summary>

Edit your configuration file:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

Add the standard config above.

</details>

<details>
<summary><b>Claude Code</b></summary>

Use the CLI to add Agent Q:

```bash
claude mcp add agent-q npx @notsooshariff/agent-q
```

Or manually edit `~/.claude/config.json` with the standard config.

</details>

<details>
<summary><b>VS Code (with Copilot)</b></summary>

Install via VS Code CLI:

```bash
code --add-mcp '{"name":"agent-q","command":"npx","args":["-y","@notsooshariff/agent-q"]}'
```

Or follow the MCP install guide and use the standard config.

</details>

<details>
<summary><b>Cursor</b></summary>

1. Go to Cursor Settings → MCP → Add new MCP Server
2. Name: `agent-q`
3. Command type with: `npx @notsooshariff/agent-q`
4. Click "Add"

</details>

<details>
<summary><b>Amp (VS Code Extension)</b></summary>

Update your `settings.json`:

```json
"amp.mcpServers": {
  "agent-q": {
    "command": "npx",
    "args": ["-y", "@notsooshariff/agent-q"]
  }
}
```

Or use the CLI:
```bash
amp mcp add agent-q -- npx @notsooshariff/agent-q
```

</details>

<details>
<summary><b>Goose</b></summary>

1. Go to Advanced settings → Extensions → Add custom extension
2. Name: `agent-q`
3. Type: STDIO
4. Command: `npx @notsooshariff/agent-q`
5. Click "Add Extension"

</details>

<details>
<summary><b>Codex</b></summary>

Use the CLI:
```bash
codex mcp add agent-q npx "@notsooshariff/agent-q"
```

Or edit `~/.codex/config.toml`:
```toml
[mcp_servers.agent-q]
command = "npx"
args = ["-y", "@notsooshariff/agent-q"]
```

</details>

<details>
<summary><b>Factory</b></summary>

Use the CLI:
```bash
droid mcp add agent-q "npx @notsooshariff/agent-q"
```

Or type `/mcp` within Factory droid for the interactive UI.

</details>

<details>
<summary><b>Kiro</b></summary>

Edit `.kiro/settings/mcp.json`:
```json
{
  "mcpServers": {
    "agent-q": {
      "command": "npx",
      "args": ["-y", "@notsooshariff/agent-q"]
    }
  }
}
```

</details>

<details>
<summary><b>opencode</b></summary>

Edit `~/.config/opencode/opencode.json`:
```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "agent-q": {
      "type": "local",
      "command": ["npx", "@notsooshariff/agent-q"],
      "enabled": true
    }
  }
}
```

</details>

<details>
<summary><b>Windsurf</b></summary>

Follow Windsurf MCP documentation and use the standard config above.

</details>

<details>
<summary><b>Warp</b></summary>

Go to Settings → AI → Manage MCP Servers → + Add

Or use the slash command `/add-mcp` and paste the standard config.

</details>

<details>
<summary><b>LM Studio</b></summary>

Go to Program (right sidebar) → Install → Edit mcp.json

Use the standard config above.

</details>

## Available Tools

Agent Q provides 7 MCP tools for managing your agents:

### Core Tools
- **`create_agent`** - Create a new specialized agent with custom personality and behavior
- **`update_agent`** - Modify an existing agent's configuration
- **`delete_agent`** - Remove an agent
- **`list_agents`** - View all available agents (project and user scope)
- **`validate_agent`** - Check if an agent configuration is valid

### Template Tools
- **`install_template`** - Install an agent from the template library
- **`search_templates`** - Browse available templates by category

## Agent Templates

Agent Q includes **120+ pre-built agent templates** across multiple categories:

### Development & Engineering
- Backend Developer, Frontend Developer, Fullstack Developer
- Mobile Developer, Game Developer, Embedded Systems Developer
- Python Expert, TypeScript Expert, Go Specialist, Rust Specialist
- React Specialist, Node.js Specialist, GraphQL Specialist

### DevOps & Infrastructure
- DevOps Engineer, SRE, Platform Engineer
- Cloud Architect, Container Security Expert
- CI/CD Engineer, Configuration Manager
- Monitoring Specialist, Disaster Recovery Specialist

### Security & Compliance
- Security Analyst, Security Architect, Penetration Tester
- Cryptography Expert, OWASP Specialist
- Vulnerability Researcher, Threat Modeler
- Authentication Expert, Authorization Specialist
- Compliance Auditor, License Compliance Checker

### Quality & Testing
- QA Engineer, Test Automation Engineer
- E2E Tester, Performance Tester, Accessibility Tester
- Chaos Engineer, Compatibility Tester
- Bug Hunter, Static Analysis Expert

### Data & Analytics
- Data Engineer, Data Scientist, Data Analyst
- Machine Learning Engineer, Big Data Engineer
- Analytics Engineer, BI Analyst
- ETL Developer, Data Visualization Specialist

### Architecture & Design
- System Architect, Software Architect, Microservices Architect
- API Designer, Database Administrator
- Design System Architect, Cache Architect

### Documentation & Content
- Technical Writer, Documentation Specialist
- Tutorial Creator, README Writer
- Architecture Documenter, Code Commentor
- Release Notes Writer, Wiki Maintainer

### Project Management
- Engineering Manager, Technical Lead, Scrum Master
- Product Manager, Project Manager, Agile Coach
- Release Manager, Program Manager

### Specialized Roles
- Code Reviewer, Pair Programmer, Debugger
- Performance Engineer, Memory Management Specialist
- Refactoring Specialist, Legacy Code Expert
- Technical Debt Manager, Dependency Auditor

_...and many more!_

## Usage Example

After installation, your AI tool can automatically invoke Agent Q tools:

```typescript
// Creating a specialized code review agent
User: "Create a security-focused code review agent"

AI: [Uses Agent Q's create_agent tool]
✅ Agent created: security-code-reviewer
📍 Location: .claude/agents/security-code-reviewer.md
🔧 Tools: Read, Grep, Glob

// Installing from templates
User: "Install the devops engineer template"

AI: [Uses Agent Q's install_template tool]
✅ Installed: devops-engineer
```

## Project Structure

```
agent-q/
├── packages/
│   ├── core/           # Core business logic
│   │   ├── agent/      # Agent management
│   │   ├── security/   # Security & validation
│   │   ├── template/   # Template system
│   │   └── config/     # Configuration
│   │
│   ├── mcp-server/     # MCP server implementation
│   │   └── tools/      # 7 MCP tools
│   │
│   └── plugin/         # Plugin bundle
│
└── templates/          # 120+ agent templates
```

## Agent Scopes

Agents can be stored in two scopes:

- **Project Scope** (`.claude/agents/`) - Shared with your team via git
- **User Scope** (`~/.claude/agents/`) - Personal agents stored in your home directory

## Security

Agent Q includes multiple security layers:

- **Path Validation** - Prevents directory traversal attacks
- **Content Sanitization** - Blocks XSS and injection attempts
- **Input Validation** - Type checking and format validation
- **Permission Checks** - File system safety verification

## Development

### Prerequisites

- Node.js ≥ 18.0.0
- pnpm ≥ 9.0.0

### Setup

```bash
# Clone the repository
git clone https://github.com/NotSooShariff/agent-q.git
cd agent-q

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test
```

### Project Commands

```bash
pnpm build          # Build all packages
pnpm dev            # Watch mode for development
pnpm test           # Run test suite
pnpm lint           # Lint code
pnpm type-check     # TypeScript type checking
pnpm clean          # Clean build artifacts
```

## Requirements

- Node.js 18 or higher
- npm 9 or higher
- An MCP-compatible AI tool

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Adding New Templates

1. Create a new directory in `templates/`
2. Add an `agent.md` file with the agent configuration
3. Include a README.md with documentation
4. Submit a pull request

## License

MIT © Agent Q Team

## Acknowledgments

Built with:
- [Model Context Protocol SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- TypeScript
- Turborepo
- pnpm

---

**Ready to supercharge your AI workflows?** Install Agent Q today!

```bash
npx @notsooshariff/agent-q
```
