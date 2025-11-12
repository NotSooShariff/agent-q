/**
 * Build script for Agent Q plugin bundle
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const archiver = require('archiver');

const OUTPUT_DIR = path.join(__dirname, 'dist');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'agent-q-plugin.tar.gz');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Create archive
const output = fs.createWriteStream(OUTPUT_FILE);
const archive = archiver('tar', {
  gzip: true,
  gzipOptions: { level: 9 },
});

output.on('close', () => {
  console.log(`✅ Plugin bundle created: ${OUTPUT_FILE}`);
  console.log(`📦 Total bytes: ${archive.pointer()}`);
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);

// Add files to archive
archive.file('plugin.json', { name: 'plugin.json' });
archive.file('README.md', { name: 'README.md' });
archive.directory('agents/', 'agents');

archive.finalize();
