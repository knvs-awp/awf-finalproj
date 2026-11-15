import { defineConfig } from 'drizzle-kit';

// migration generation reads the model without connecting to mysql
export default defineConfig({
  dialect: 'mysql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  strict: true,
});
