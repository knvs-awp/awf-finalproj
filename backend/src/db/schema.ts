import { randomUUID } from 'node:crypto';
import { sql } from 'drizzle-orm';
import { char, check, datetime, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

// drizzle generates uuid strings on insert, while raw sql inserts require an id
export const profiles = mysqlTable('profiles', {
  id: char('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  display_name: varchar('display_name', { length: 80 }).notNull(),
  bio: varchar('bio', { length: 500 }).notNull().default(''),
  city: varchar('city', { length: 100 }),
  region: varchar('region', { length: 100 }),
  country_code: varchar('country_code', { length: 2 }),
  created_at: datetime('created_at', { mode: 'date', fsp: 3 }).notNull().default(sql`(utc_timestamp(3))`),
  updated_at: datetime('updated_at', { mode: 'date', fsp: 3 }).notNull().default(sql`(utc_timestamp(3))`),
}, (table) => [
  check('profiles_display_name_not_blank', sql`char_length(trim(${table.display_name})) > 0`),
  check('profiles_city_not_blank', sql`${table.city} is null or char_length(trim(${table.city})) > 0`),
  check('profiles_region_not_blank', sql`${table.region} is null or char_length(trim(${table.region})) > 0`),
  check('profiles_country_code_format', sql`${table.country_code} is null or regexp_like(${table.country_code}, '^[A-Z]{2}$', 'c')`),
]);

// these types are derived from the database definitions rather than copied by hand
// public request and response types are exported separately by @solo101/contracts
export type profile_record = typeof profiles.$inferSelect;
export type new_profile = typeof profiles.$inferInsert;
