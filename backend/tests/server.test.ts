import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:net';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const run_args = ['--import', 'tsx', 'src/server.ts'];

function run_server(env: Record<string, string>) {
  return spawnSync(process.execPath, run_args, {
    cwd: root,
    env: { PATH: process.env['PATH'] ?? '', ...env },
    encoding: 'utf8',
    timeout: 15000,
  });
}

async function free_port(): Promise<number> {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.once('error', reject);
    probe.listen(0, '127.0.0.1', () => {
      const { port } = probe.address() as { port: number };
      probe.close(() => resolve(port));
    });
  });
}

describe('server startup', () => {
  for (const bad of ['abc', '0', '-1', '65536', '3000.5']) {
    it(`rejects PORT=${bad}`, () => {
      const result = run_server({ PORT: bad });
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /port must be a whole number between 1 and 65535/);
    });
  }

  it('starts, serves /health and logs the address', async () => {
    const port = await free_port();
    const child = spawn(process.execPath, run_args, {
      cwd: root,
      env: { PATH: process.env['PATH'] ?? '', HOST: '127.0.0.1', PORT: String(port) },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    try {
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('server did not start in time')), 15000);
        let output = '';
        child.stdout.on('data', (chunk) => {
          output += chunk;
          if (output.includes(`server listening on http://127.0.0.1:${port}`)) {
            clearTimeout(timer);
            resolve();
          }
        });
        child.once('exit', (code) => {
          clearTimeout(timer);
          reject(new Error(`server exited early with code ${code}`));
        });
      });

      const response = await fetch(`http://127.0.0.1:${port}/health`);
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), { status: 'ok' });
    } finally {
      child.kill();
    }
  });
});
