/**
 * Root & Health routes plugin
 * @param {import('fastify').FastifyInstance} fastify
 */
export async function rootRoutes(fastify) {
  fastify.get('/', async (request, reply) => {
    return {
      name: 'Fastify API Backend',
      version: '1.0.0',
      status: 'healthy',
      docs: '/api/items'
    };
  });

  fastify.get('/health', async (request, reply) => {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
  });
}
