solo101 frontend tests
1. Install the test tooling (npm pins the versions in package.json): npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom
2. Add these scripts to package.json: "test": "vitest run", "test:watch": "vitest"
3. Copy the files from this folder into the project, keeping paths:
    vite.config.ts (replaces the existing one; adds the test block)
    src/test/setup.ts
    src/app.test.tsx
    src/main.test.tsx
4. Run: npm test