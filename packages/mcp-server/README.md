# Agent Q

> Professional AI Agent Management via Model Context Protocol (MCP)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

## Overview

Agent Q is a Model Context Protocol (MCP) server that enables you to create, manage, and organize specialized AI agents for any MCP-compatible AI tool. With **120+ pre-built agent templates** covering everything from code review to DevOps, security, data science, and more, Agent Q helps you streamline your AI workflows.

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
# Using npx (recommended - no installation needed)
npx @notsooshariff/agent-q

# Or install globally
npm install -g @notsooshariff/agent-q
```

### Configuration

Add Agent Q to your MCP-compatible AI tool's configuration:

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

## Supported AI Tools

Agent Q works with 15+ MCP-compatible AI tools:

- **Claude Desktop & Claude Code**
- **VS Code (with GitHub Copilot)**
- **Cursor**
- **Amp**
- **Goose**
- **Codex**
- **Factory**
- **Kiro**
- **opencode**
- **Windsurf**
- **Warp**
- **LM Studio**
- **Qodo Gen**
- And more...

### Tool-Specific Setup

<details>
<summary><b>Claude Desktop</b></summary>

Edit your configuration file:
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

Add the standard config above.

</details>

<details>
<summary><b>Claude Code</b></summary>

Use the CLI:
```bash
claude mcp add agent-q npx @notsooshariff/agent-q
```

Or manually edit `~/.claude/config.json` with the standard config.

</details>

<details>
<summary><b>VS Code (with Copilot)</b></summary>

```bash
code --add-mcp '{"name":"agent-q","command":"npx","args":["-y","@notsooshariff/agent-q"]}'
```

</details>

<details>
<summary><b>Cursor</b></summary>

1. Settings → MCP → Add new MCP Server
2. Name: `agent-q`
3. Command: `npx @notsooshariff/agent-q`

</details>

<details>
<summary><b>Other Tools</b></summary>

For other MCP-compatible tools, use the standard configuration above. Most tools follow the same pattern.

</details>

## Available Tools

Agent Q provides **7 MCP tools** for managing your agents:

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
Backend Developer, Frontend Developer, Fullstack Developer, Mobile Developer, Game Developer, Embedded Systems Developer, Python Expert, TypeScript Expert, Go Specialist, Rust Specialist, React Specialist, Node.js Specialist, GraphQL Specialist

### DevOps & Infrastructure
DevOps Engineer, SRE, Platform Engineer, Cloud Architect, Container Security Expert, CI/CD Engineer, Configuration Manager, Monitoring Specialist, Disaster Recovery Specialist

### Security & Compliance
Security Analyst, Security Architect, Penetration Tester, Cryptography Expert, OWASP Specialist, Vulnerability Researcher, Threat Modeler, Authentication Expert, Authorization Specialist, Compliance Auditor

### Quality & Testing
QA Engineer, Test Automation Engineer, E2E Tester, Performance Tester, Accessibility Tester, Chaos Engineer, Compatibility Tester, Bug Hunter, Static Analysis Expert

### Data & Analytics
Data Engineer, Data Scientist, Data Analyst, Machine Learning Engineer, Big Data Engineer, Analytics Engineer, BI Analyst, ETL Developer, Data Visualization Specialist

### Architecture & Design
System Architect, Software Architect, Microservices Architect, API Designer, Database Administrator, Design System Architect, Cache Architect

### Documentation & Content
Technical Writer, Documentation Specialist, Tutorial Creator, README Writer, Architecture Documenter, Code Commentor, Release Notes Writer, Wiki Maintainer

### Project Management
Engineering Manager, Technical Lead, Scrum Master, Product Manager, Project Manager, Agile Coach, Release Manager, Program Manager

### Specialized Roles
Code Reviewer, Pair Programmer, Debugger, Performance Engineer, Memory Management Specialist, Refactoring Specialist, Legacy Code Expert, Technical Debt Manager

**...and 80+ more!**

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

## Requirements

- Node.js 18 or higher
- npm 9 or higher
- An MCP-compatible AI tool

## Documentation

For detailed documentation, guides, and examples, visit:
- **GitHub Repository:** https://github.com/NotSooShariff/agent-q
- **Getting Started Guide:** https://github.com/NotSooShariff/agent-q/blob/main/docs/getting-started.md
- **Contributing:** https://github.com/NotSooShariff/agent-q/blob/main/CONTRIBUTING.md

## Development

To contribute or run locally:

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

For issues, feature requests, or contributions, visit our [GitHub repository](https://github.com/NotSooShariff/agent-q).
