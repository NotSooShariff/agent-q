# Contributing to Agent Q

Thank you for your interest in contributing to Agent Q! This document provides guidelines for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and considerate in your interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- Clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Version information
- Operating system
- Relevant logs or screenshots

### Suggesting Features

Feature requests are welcome! Please provide:

- Clear and descriptive title
- Detailed description of the proposed feature
- Use cases and benefits
- Possible implementation approach (optional)

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes:**
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed
3. **Ensure tests pass:** `pnpm test`
4. **Ensure code builds:** `pnpm build`
5. **Run linter:** `pnpm lint`
6. **Commit your changes** with clear, descriptive messages
7. **Push to your fork** and submit a pull request

## Development Setup

```bash
# Clone the repository
git clone https://github.com/NotSooShariff/agent-q.git
cd agent-q

# Install dependencies
pnpm install

# Build packages
pnpm build

# Run tests
pnpm test

# Run linter
pnpm lint
```

## Project Structure

```
agent-q/
├── packages/
│   ├── core/          # Core business logic
│   └── mcp-server/    # MCP server implementation
├── templates/         # Agent templates
├── docs/             # Documentation
└── .github/          # GitHub workflows and templates
```

## Coding Guidelines

### TypeScript

- Use TypeScript strict mode
- Provide type annotations for public APIs
- Avoid `any` types
- Use meaningful variable and function names

### Testing

- Write tests for all new functionality
- Maintain test coverage >90%
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### Commits

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: bug fix
docs: documentation changes
test: add or update tests
chore: maintenance tasks
refactor: code refactoring
```

## Security

If you discover a security vulnerability, please email security@agent-q.dev instead of creating a public issue.

## Questions?

Feel free to:
- Open a discussion on GitHub
- Join our Discord community
- Check our documentation

Thank you for contributing! 🎉
