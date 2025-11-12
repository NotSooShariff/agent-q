#!/bin/bash

# Prepare Agent Q for release
# This script runs pre-release checks and builds

set -e

echo "🔍 Running pre-release checks..."

# Check if on main branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
  echo "❌ Must be on main branch to release. Currently on: $BRANCH"
  exit 1
fi

# Check if working directory is clean
if [ -n "$(git status --porcelain)" ]; then
  echo "❌ Working directory is not clean. Please commit or stash changes."
  exit 1
fi

echo "✅ Git checks passed"

# Run tests
echo "🧪 Running tests..."
pnpm test
echo "✅ All tests passed"

# Run linter
echo "🔍 Running linter..."
pnpm lint
echo "✅ Linting passed"

# Type check
echo "🔍 Type checking..."
pnpm type-check
echo "✅ Type check passed"

# Build packages
echo "🔨 Building packages..."
pnpm build
echo "✅ Build successful"

# Build plugin
echo "📦 Building plugin bundle..."
cd packages/plugin
pnpm build
cd ../..
echo "✅ Plugin bundle created"

# Version information
VERSION=$(node -p "require('./packages/mcp-server/package.json').version")
echo ""
echo "🎉 Agent Q v$VERSION is ready for release!"
echo ""
echo "Next steps:"
echo "  1. Create and push tag: git tag v$VERSION && git push origin v$VERSION"
echo "  2. GitHub Actions will automatically publish to npm"
echo "  3. Create GitHub release with release notes"
echo ""
