import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  outDir: 'dist',
  clean: true,
  bundle: true,
  // Don't bundle MCP SDK - it should be an external dependency
  external: ['@modelcontextprotocol/sdk'],
  // Bundle @agent-q/core into the output
  noExternal: ['@agent-q/core'],
  // Skip DTS generation for now (bundling makes types less useful anyway)
  dts: false,
  // Keep the shebang for CLI usage
  shims: true,
  // Source maps for debugging
  sourcemap: true,
  // Target modern Node.js
  target: 'node18',
  // Ensure correct module resolution
  splitting: false,
  treeshake: true,
});
