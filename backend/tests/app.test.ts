import assert from 'node:assert/strict';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import { app } from '../src/app.js';

describe('app', () => {
    let server: Server;
    let base_url: string;

    before(async () => {
        await new Promise<void>((resolve) => {
            server = app.listen(0, '127.0.0.1', resolve);
        });
        const { port } = server.address() as AddressInfo;
        base_url = `http://127.0.0.1:${port}`;
    });

    after(async () => {
        await new Promise<void>((resolve, reject) => {
            server.close((error) => (error ? reject(error) : resolve()));
        });
    });

    describe('GET /health', () => {
    it('responds 200 with status ok', async () => {
      const response = await fetch(`${base_url}/health`);
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), { status: 'ok' });
    });

    it('responds with a json content type', async () => {
      const response = await fetch(`${base_url}/health`);
      assert.match(response.headers.get('content-type') ?? '', /application\/json/);
    });

    it('does not require a database connection', async () => {
      // no DATABASE_URL is configured for this suite and the route must still work
      const response = await fetch(`${base_url}/health`);
      assert.equal(response.status, 200);
    });
  });



});