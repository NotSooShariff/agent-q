/**
 * File system permission management
 */

import fs from 'fs/promises';
import { constants } from 'fs';
import path from 'path';
import { PermissionError, FileSystemError } from '../errors/index.js';

/**
 * Manages file system permissions and access
 */
export class PermissionManager {
  /**
   * Check if a path exists
   */
  async exists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath, constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if a path is readable
   */
  async isReadable(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath, constants.R_OK);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if a path is writable
   */
  async isWritable(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath, constants.W_OK);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Ensure a directory exists and is writable
   */
  async ensureDirectory(dirPath: string): Promise<void> {
    try {
      // Check if directory exists
      const exists = await this.exists(dirPath);

      if (!exists) {
        // Create directory recursively
        await fs.mkdir(dirPath, { recursive: true });
      }

      // Verify it's writable
      const writable = await this.isWritable(dirPath);
      if (!writable) {
        throw new PermissionError(`Directory is not writable: ${dirPath}`, { path: dirPath });
      }
    } catch (error) {
      if (error instanceof PermissionError) {
        throw error;
      }

      throw new FileSystemError(`Failed to ensure directory: ${dirPath}`, {
        path: dirPath,
        originalError: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Check if a file can be written (either exists and writable, or parent dir is writable)
   */
  async canWrite(filePath: string): Promise<boolean> {
    const exists = await this.exists(filePath);

    if (exists) {
      // File exists, check if it's writable
      return this.isWritable(filePath);
    } else {
      // File doesn't exist, check if parent directory is writable
      const parentDir = path.dirname(filePath);
      return this.isWritable(parentDir);
    }
  }

  /**
   * Verify write permissions before performing an operation
   */
  async verifyWritePermission(filePath: string): Promise<void> {
    const canWrite = await this.canWrite(filePath);

    if (!canWrite) {
      throw new PermissionError(`Cannot write to path: ${filePath}`, { path: filePath });
    }
  }

  /**
   * Verify read permissions before performing an operation
   */
  async verifyReadPermission(filePath: string): Promise<void> {
    const exists = await this.exists(filePath);

    if (!exists) {
      throw new FileSystemError(`File does not exist: ${filePath}`, { path: filePath });
    }

    const canRead = await this.isReadable(filePath);

    if (!canRead) {
      throw new PermissionError(`Cannot read from path: ${filePath}`, { path: filePath });
    }
  }

  /**
   * Get file stats
   */
  async getStats(filePath: string): Promise<{
    size: number;
    created: Date;
    modified: Date;
    isFile: boolean;
    isDirectory: boolean;
  }> {
    try {
      const stats = await fs.stat(filePath);

      return {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory(),
      };
    } catch (error) {
      throw new FileSystemError(`Failed to get file stats: ${filePath}`, {
        path: filePath,
        originalError: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Check available disk space (simple check)
   */
  async hasEnoughSpace(dirPath: string, requiredBytes: number = 1024 * 1024): Promise<boolean> {
    try {
      // Simple heuristic: try to write a temp file
      // In production, you might want to use a library that checks actual disk space
      const testFile = path.join(dirPath, `.agent-q-test-${Date.now()}`);

      try {
        await fs.writeFile(testFile, Buffer.alloc(Math.min(requiredBytes, 1024)));
        await fs.unlink(testFile);
        return true;
      } catch {
        return false;
      }
    } catch {
      return false;
    }
  }
}
