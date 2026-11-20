import Fastify from 'fastify';
import cors from '@fastify/cors';
import { rootRoutes } from './routes/root.js';
import { itemRoutes } from './routes/items.js';

/**
 * Fastify application factory
 * @param {import('fastify').FastifyServerOptions} opts
 */
export async function buildApp(opts = {}) {
  const app = Fastify(opts);

  // Register plugins
  await app.register(cors, {
    origin: true // Adjust according to requirements in production
  });

  // Custom 404 handler
  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: `Route ${request.method}:${request.url} not found`
    });
  });

  // Global error handler
  app.setErrorHandler((error, request, reply) => {
    app.log.error(error);

    const statusCode = error.statusCode || 500;
    reply.status(statusCode).send({
      statusCode,
      error: error.name || 'InternalServerError',
      message: error.message || 'Something went wrong'
    });
  });

  // Register modular routes
  await app.register(rootRoutes);
  await app.register(itemRoutes, { prefix: '/api/items' });

  return app;
}
