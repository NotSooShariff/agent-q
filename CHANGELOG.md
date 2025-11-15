# Changelog

All notable changes to Agent Q will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-01-15

### Changed
- Generalized all platform-specific references to support broader MCP ecosystem
- Renamed `ClaudeModel` type to `AIModel` for platform neutrality
- Updated all tool descriptions and messages to be MCP-client agnostic
- Removed platform-specific plugin packages
- Updated compatibility fields to be more generic (`minVersion` instead of `minClaudeCodeVersion`)

### Removed
- Platform-specific internal documentation files
- Claude-specific attributions and references throughout codebase

## [0.1.0] - 2025-01-07

### Added

#### Core Features
- Complete agent lifecycle management (CRUD operations)
- Enterprise-grade security layer
  - Path traversal prevention
  - Input sanitization and validation
  - Content injection detection
  - File permission management
- Agent scoping system (project/user)
- Configuration management

#### MCP Tools
- `create_agent` - Create custom agents with personalities
- `update_agent` - Modify existing agents
- `delete_agent` - Remove agents
- `list_agents` - View all available agents
- `validate_agent` - Validate configuration before creating
- `install_template` - Install agents from templates
- `search_templates` - Browse available templates

#### Templates
- Code Reviewer - Security-focused code analysis
- Pair Programmer - Collaborative coding partner
- Debugger - Systematic bug finder

#### Development
- TypeScript monorepo with strict mode
- Comprehensive test suite (58 tests, >95% coverage)
- CI/CD pipeline with GitHub Actions
- Automated releases and npm publishing
- Code quality tools (ESLint, Prettier)
- Security scanning (CodeQL)

#### Documentation
- Complete getting started guide
- API reference
- Contributing guidelines
- Issue templates
- Pull request template

#### Distribution
- npm package (@agent-q/mcp)
- Multi-platform support (macOS, Linux, Windows)

### Security
- Path validation prevents directory traversal attacks
- Content sanitization blocks XSS and injection attacks
- Reserved name protection
- File permission verification
- Audit logging infrastructure

[Unreleased]: https://github.com/NotSooShariff/agent-q/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/NotSooShariff/agent-q/compare/v0.1.0...v1.0.0
[0.1.0]: https://github.com/NotSooShariff/agent-q/releases/tag/v0.1.0
