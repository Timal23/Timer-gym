import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const tmpDir = resolve('.vite-tmp');
mkdirSync(tmpDir, { recursive: true });

const result = spawnSync('npx', ['vite', 'build'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, TMPDIR: tmpDir, TEMP: tmpDir, TMP: tmpDir }
});

process.exit(result.status ?? 1);
