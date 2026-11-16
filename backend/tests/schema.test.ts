import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getTableConfig } from 'drizzle-orm/mysql-core';
import { profiles } from '../src/db/schema.js';

const config = getTableConfig(profiles);
const column = (name: string) => {
  const found = config.columns.find((c) => c.name === name);
  assert.ok(found, `column ${name} should exist`);
  return found as any;
};

describe('profiles schema', () => {
  it('is named profiles', () => {
    assert.equal(config.name, 'profiles');
  });

  it('defines exactly the expected columns', () => {
    assert.deepEqual(
      config.columns.map((c) => c.name).sort(),
      ['bio', 'city', 'country_code', 'created_at', 'display_name', 'id', 'region', 'updated_at'],
    );
  });

  it('uses id as the only primary key', () => {
    const primary = config.columns.filter((c) => c.primary).map((c) => c.name);
    assert.deepEqual(primary, ['id']);
  });

  it('sizes the id column for a uuid', () => {
    assert.equal(column('id').length, 36);
  });

  it('generates a uuid for id on insert', () => {
    const generated = column('id').defaultFn();
    assert.match(generated, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    assert.notEqual(generated, column('id').defaultFn());
  });

  it('marks required columns as not null', () => {
    for (const name of ['id', 'display_name', 'bio', 'created_at', 'updated_at']) {
      assert.equal(column(name).notNull, true, name);
    }
  });

  it('leaves location columns nullable', () => {
    for (const name of ['city', 'region', 'country_code']) {
      assert.equal(column(name).notNull, false, name);
    }
  });

  it('applies the documented length limits', () => {
    assert.equal(column('display_name').length, 80);
    assert.equal(column('bio').length, 500);
    assert.equal(column('city').length, 100);
    assert.equal(column('region').length, 100);
    assert.equal(column('country_code').length, 2);
  });

  it('defaults bio to an empty string', () => {
    assert.equal(column('bio').default, '');
    assert.equal(column('bio').hasDefault, true);
  });

  it('defaults timestamps in the database', () => {
    assert.equal(column('created_at').hasDefault, true);
    assert.equal(column('updated_at').hasDefault, true);
  });

  it('declares the four check constraints', () => {
    assert.deepEqual(
      config.checks.map((c) => c.name).sort(),
      [
        'profiles_city_not_blank',
        'profiles_country_code_format',
        'profiles_display_name_not_blank',
        'profiles_region_not_blank',
      ],
    );
  });
});
