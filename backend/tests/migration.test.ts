import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { getTableConfig } from 'drizzle-orm/mysql-core';
import { profiles } from '../src/db/schema.js';

const drizzle_dir = fileURLToPath(new URL('../drizzle/', import.meta.url));
const read = (relative: string) => readFileSync(drizzle_dir + relative, 'utf8');

const journal = JSON.parse(read('meta/_journal.json'));
const sql = read('0000_create_profiles.sql');
const config = getTableConfig(profiles);

describe('migrations', () => {
  it('journals the initial migration and its sql file exists', () => {
    assert.equal(journal.dialect, 'mysql');
    assert.equal(journal.entries.length, 1);
    assert.equal(journal.entries[0].tag, '0000_create_profiles');
    assert.ok(sql.length > 0);
  });

  it('creates the profiles table', () => {
    assert.match(sql, /CREATE TABLE `profiles`/);
  });

  it('includes every schema column', () => {
    for (const c of config.columns) {
      assert.ok(sql.includes(`\`${c.name}\``), `missing column ${c.name}`);
    }
  });

  it('includes every schema check constraint', () => {
    for (const check of config.checks) {
      assert.ok(sql.includes(`CONSTRAINT \`${check.name}\` CHECK`), `missing check ${check.name}`);
    }
  });

  it('keeps the primary key on id', () => {
    assert.match(sql, /PRIMARY KEY\(`id`\)/);
  });

  it('keeps the snapshot in sync with the schema columns', () => {
    const snapshot = JSON.parse(read('meta/0000_snapshot.json'));
    const snapshot_columns = Object.keys(snapshot.tables.profiles.columns).sort();
    assert.deepEqual(snapshot_columns, config.columns.map((c) => c.name).sort());
  });
});