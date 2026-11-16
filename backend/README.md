I added a test suite for the backend. Please run npm install && npm test.

Inside backend there is new tests/ folder and a "test" script in package.json. It uses Node’s built-in test runner (node:test) with existing tsx, so there are no new dependencies. Run it with npm test.

What the tests cover:

app.test.ts: starts the Express app on a random port and checks that GET /health returns 200, {status: "ok"} and a JSON content type. It also checks that unknown paths and non-GET methods on /health return 404.

client.test.ts: checks require_database_url for valid URLs, a missing or empty value, malformed URLs, wrong protocols and a missing database name. It also checks that a malformed URL’s credentials don’t leak into the error. create_database is tested for pool setup from the URL, falling back to the DATABASE_URL env var, and throwing on bad input. The pool connects lazily, so no MySQL is needed.

schema.test.ts: checks the profiles table’s columns, primary key, nullability, length limits, the bio default, the UUID default for id, and the four check constraints.

migration.test.ts: checks that the migration SQL, journal and snapshot match schema.ts, so a schema change without a regenerated migration fails the tests.

server.test.ts: starts the real server as a child process. Invalid PORT values (abc, 0, -1, 65536, 3000.5) must fail with the port error. A valid start must log its address and serve /health.