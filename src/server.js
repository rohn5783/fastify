import { buildApp } from './app.js';

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const app = await buildApp({
  logger: {
    level: process.env.LOG_LEVEL || 'info'
  }
});

// Graceful shutdown handling
const signals = ['SIGINT', 'SIGTERM'];
for (const signal of signals) {
  process.on(signal, async () => {
    app.log.info(`Received ${signal}, closing server gracefully...`);
    try {
      await app.close();
      app.log.info('Server closed successfully');
      process.exit(0);
    } catch (err) {
      app.log.error(err, 'Error during shutdown');
      process.exit(1);
    }
  });
}

try {
  await app.listen({ port: PORT, host: HOST });
  console.log(`Server listening at http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
