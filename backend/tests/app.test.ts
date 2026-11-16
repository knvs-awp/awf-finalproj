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

    


});