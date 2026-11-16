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
