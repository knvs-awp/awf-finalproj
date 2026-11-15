# quick start

node `22.23.2` and npm `10+` are required
mysql `8.0.16+` is needed for database work

1. **install**

   ```powershell
   git clone --branch main https://github.com/knvs-awp/awf-finalproj.git
   cd awf-finalproj
   npm ci
   ```

   `npm ci` installs the versions recorded in the lockfile for all three workspaces
   `contracts/` contains shared types, not a running app

2. **start coding**

   commands below are from the project root, in separate terminal tabs

   | command | purpose | address |
   | --- | --- | --- |
   | `npm run dev:frontend` | frontend with live updates | http://127.0.0.1:5173 |
   | `npm run dev` | backend with automatic restarts | http://127.0.0.1:3000/health |

   frontend screens with mock data and `/health` work without mysql or aws

3. **database work**

   with local mysql running on port `3306`, the full `backend/sql/setup-local.sql` script runs through an administrator connection in workbench

   it creates the `solo101` database and dev account

   first-time env setup and table creation:

   ```powershell
   Copy-Item backend/.env.example backend/.env
   npm run db:migrate
   ```

   `.env` holds local connection settings
   `db:migrate` applies pending table changes without resetting existing data

   for example, after adding an `avatar_url` column in `backend/src/db/schema.ts`:

   ```powershell
   npm run db:generate -- --name add_profile_avatar
   ```

   `generate` writes sql files without changing mysql
   after sql review, `npm run db:migrate` applies them
   first-time setup only applies the existing migrations

   each teammate has separate local data
   credentials in the example are for dev only

   optional vscode extensions: [SQLTools](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools) and [SQLTools MySQL/MariaDB/TiDB](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools-driver-mysql)
   together they show tables and rows and run sql queries in the editor
   their saved connection is separate from the backend's `.env` connection

4. **checks**

   ```powershell
   npm run typecheck
   npm run build
   ```

   `typecheck` finds typescript errors without creating build files
   `build` creates the compiled files in each workspace's `dist/` folder

   both commands work locally
   ci (continuous integration) runs them automatically in github actions after pushes and pull requests
   deployment is a separate step
