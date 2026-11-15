// the javascript extension matches the file that node loads after typescript compiles it
import { app } from './app.js';

const host = process.env['HOST'] ?? '127.0.0.1';
const port = Number(process.env['PORT'] ?? '3000');

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('port must be a whole number between 1 and 65535');
}

app.listen(port, host, () => {
  console.info(`server listening on http://${host}:${port}`);
});
