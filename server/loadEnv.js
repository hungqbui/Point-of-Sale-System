import { config } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { existsSync } from 'fs';

// Determine the project root (directory containing this file).
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Loads environment variables from a .env file placed in the server folder
 * (adjacent to this file) if it exists. If the file is missing, we quietly
 * fallback to the current process environment so exported shell vars still work.
 */
export function loadEnv() {
  const envPath = resolve(__dirname, '.env');
  if (existsSync(envPath)) {
    config({ path: envPath });
  }
}

