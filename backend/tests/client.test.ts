import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import { create_database, require_database_url } from '../src/db/client.js';

const valid_url = 'mysql://solo101:solo101_local@127.0.0.1:3306/solo101';

describe('require_database_url', () => {
  it('returns a valid mysql url unchanged', () => {
    assert.equal(require_database_url(valid_url), valid_url);
  });

  it('accepts a url without credentials or port', () => {
    const url = 'mysql://localhost/solo101';
    assert.equal(require_database_url(url), url);
  });

  it('throws when the value is undefined', () => {
    assert.throws(() => require_database_url(undefined), /DATABASE_URL is required/);
  });

  it('throws when the value is an empty string', () => {
    assert.throws(() => require_database_url(''), /DATABASE_URL is required/);
  });

  it('throws for a malformed url', () => {
    assert.throws(() => require_database_url('not a url'), /must be a valid mysql connection url/);
  });

  it('does not leak credentials from a malformed url into the error', () => {
    const secret = 'super_secret_pw';
    try {
      require_database_url(`mysql://user:${secret}@[bad host/db`);
      assert.fail('expected an error');
    } catch (error) {
      assert.ok(error instanceof Error);
      assert.ok(!error.message.includes(secret));
    }
  });

  it('throws for a non-mysql protocol', () => {
    assert.throws(
      () => require_database_url('postgres://user:pw@127.0.0.1:5432/solo101'),
      /must identify a mysql database/,
    );
  });

  it('throws when the database name is missing', () => {
    assert.throws(
      () => require_database_url('mysql://user:pw@127.0.0.1:3306'),
      /must identify a mysql database/,
    );
    assert.throws(
      () => require_database_url('mysql://user:pw@127.0.0.1:3306/'),
      /must identify a mysql database/,
    );
  });
});


describe('create_database', () => {
  const original = process.env['DATABASE_URL'];

  afterEach(() => {
    if (original === undefined) delete process.env['DATABASE_URL'];
    else process.env['DATABASE_URL'] = original;
  });

  it('returns a drizzle instance and a pool without connecting', async () => {
    const { db, pool } = create_database(valid_url);
    try {
      assert.ok(db);
      assert.equal(typeof pool.end, 'function');
    } finally {
      await pool.end();
    }
  });

  it('configures the pool from the url', async () => {
    const { pool } = create_database(valid_url);
    try {
      // mysql2 keeps the parsed connection settings on pool.pool.config.connectionConfig
      const config = (pool as any).pool.config.connectionConfig;
      assert.equal(config.host, '127.0.0.1');
      assert.equal(config.port, 3306);
      assert.equal(config.user, 'solo101');
      assert.equal(config.database, 'solo101');
      assert.equal((pool as any).pool.config.connectionLimit, 5);
    } finally {
      await pool.end();
    }
  });

  it('falls back to process.env.DATABASE_URL', async () => {
    process.env['DATABASE_URL'] = valid_url;
    const { pool } = create_database();
    try {
      assert.equal((pool as any).pool.config.connectionConfig.database, 'solo101');
    } finally {
      await pool.end();
    }
  });

  it('throws when no url is given and the env var is unset', () => {
    delete process.env['DATABASE_URL'];
    assert.throws(() => create_database(), /DATABASE_URL is required/);
  });

  it('throws for an invalid url', () => {
    assert.throws(() => create_database('http://example.com/db'), /must identify a mysql database/);
  });
});
