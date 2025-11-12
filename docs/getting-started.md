# Getting Started with Agent Q

Welcome to Agent Q! This guide will help you set up and create your first AI agent for Claude Code.

## Installation

### Via npm (Recommended)

```bash
npm install -g @agent-q/mcp
```

### Via npx (No Installation)

Add to your Claude Code config directly - Agent Q will run via npx automatically.

## Configuration

### Step 1: Add to Claude Code

Add Agent Q to your Claude Code configuration file:

**Location**: `~/.claude/config.json`

```json
{
  "mcpServers": {
    "agent-q": {
      "command": "npx",
      "args": ["-y", "@agent-q/mcp"]
    }
  }
}
```

### Step 2: Restart Claude Code

Restart Claude Code to load the Agent Q MCP server.

### Step 3: Verify Installation

In Claude Code, ask:

```
"List my agents"
```

If Agent Q is working, you'll get a response (even if no agents exist yet).

## Creating Your First Agent

### Example 1: Security Code Reviewer

```
User: "Create a security code reviewer agent that focuses on OWASP vulnerabilities"

Claude: [Uses Agent Q to create the agent with this configuration]:
- Name: security-reviewer
- Description: Reviews code for security vulnerabilities
- Personality: Critical but constructive senior security engineer
- Tools: Read, Grep, Glob
- Scope: project
```

The agent file is created at `.claude/agents/security-reviewer.md`

### Example 2: Pair Programmer

```
User: "Create a collaborative pair programming agent who is patient and educational"

Claude: [Creates agent]:
- Name: pair-programmer
- Description: Collaborative coding partner for problem-solving
- Personality: Patient, encouraging mentor
- Scope: user
```

## Using Your Agents

Once created, Claude Code automatically invokes agents based on their descriptions:

```bash
# Automatically uses security-reviewer agent
User: "Review this authentication code"

# Automatically uses pair-programmer agent
User: "Help me implement a caching layer"
```

## Managing Agents

### List All Agents

```
"List all my agents"
```

### Update an Agent

```
"Update the security-reviewer agent to also check for performance issues"
```

### Delete an Agent

```
"Delete the security-reviewer agent from project scope"
```

### Validate Before Creating

```
"Validate this agent config before creating it: ..."
```

## Agent Scopes

### Project Scope (`project`)

- **Location**: `.claude/agents/` (in project directory)
- **Sharing**: Committed to git, shared with team
- **Use Case**: Team-wide agents, project-specific workflows

### User Scope (`user`)

- **Location**: `~/.claude/agents/` (in home directory)
- **Sharing**: Personal only
- **Use Case**: Personal preferences, individual workflows

## Best Practices

### 1. Write Clear Descriptions

The description determines when Claude invokes your agent:

❌ Bad: "Code reviewer"
✅ Good: "Reviews code for security vulnerabilities, performance issues, and best practices"

### 2. Be Specific in System Prompts

Give detailed instructions about:
- Role and expertise
- Specific tasks to perform
- Output format
- Tone and communication style

### 3. Limit Tools Appropriately

- Code reviewer: `Read, Grep, Glob` (read-only)
- Pair programmer: All tools
- Documentation writer: `Read, Write` (specific tools)

### 4. Choose the Right Scope

- Team agents → `project` scope
- Personal preferences → `user` scope

### 5. Test Your Agents

After creating an agent, test it:

```
"Use the security-reviewer agent to review this file"
```

## Example Agent Templates

Agent Q includes several pre-built templates:

- **code-reviewer**: Security and best practices reviewer
- **pair-programmer**: Collaborative coding partner
- **debugger**: Systematic bug finder
- **architect**: System design consultant
- **documentation-writer**: Clear documentation creator

Browse templates in the `templates/` directory.

## Troubleshooting

### Agent Not Being Invoked

1. Check agent description is specific enough
2. Reload Claude Code after creating agents
3. Try explicitly mentioning the agent: "Use the [agent-name] agent"

### Permission Errors

```bash
# Check directory permissions
ls -la .claude/agents/

# Fix if needed
chmod 755 .claude/agents/
```

### Agent File Not Found

- Verify scope (project vs user)
- Check file exists: `ls .claude/agents/`
- Check for typos in agent name

## Next Steps

- [Creating Custom Agents](./guides/creating-agents.md)
- [Agent Best Practices](./guides/best-practices.md)
- [API Reference](./api-reference/mcp-tools.md)
- [Example Templates](../templates/)

## Need Help?

- 📚 [Documentation](https://agent-q.dev/docs)
- 💬 [Discord Community](https://discord.gg/agent-q)
- 🐛 [Report Issues](https://github.com/yourusername/agent-q/issues)
- ⭐ [Star on GitHub](https://github.com/yourusername/agent-q)

Happy agent building! 🕵️
