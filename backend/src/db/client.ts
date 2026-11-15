import { drizzle } from 'drizzle-orm/mysql2';
import { createPool } from 'mysql2/promise';
import * as schema from './schema.js';

export function require_database_url(value: string | undefined): string {
  if (!value) {
    throw new Error('DATABASE_URL is required in backend/.env');
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    // malformed urls and their credentials stay out of error logs
    throw new Error('DATABASE_URL must be a valid mysql connection url');
  }
  if (url.protocol !== 'mysql:' || !url.hostname || url.pathname.length <= 1) {
    throw new Error('DATABASE_URL must identify a mysql database');
  }

  return value;
}

// each backend process shares one pool, and pool.end() releases its connections
// connections open on demand, so /health does not depend on mysql
export function create_database(database_url = process.env['DATABASE_URL']) {
  const pool = createPool({
    uri: require_database_url(database_url),
    connectionLimit: 5,
    connectTimeout: 5000,
    maxIdle: 5,
    idleTimeout: 30000,
    waitForConnections: true,
    queueLimit: 20,
    timezone: 'Z',
    charset: 'utf8mb4',
  });

  return { db: drizzle(pool, { schema, mode: 'default' }), pool };
}

export type database = ReturnType<typeof create_database>['db'];
