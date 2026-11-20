// In-memory data store for demonstration
let items = [
  { id: '1', title: 'Learn Fastify', description: 'Explore Fastify plugins and hooks', done: false },
  { id: '2', title: 'Build REST API', description: 'Create CRUD endpoints with JSON schema validation', done: true }
];

/**
 * Items CRUD routes with Fastify JSON Schema validation
 * @param {import('fastify').FastifyInstance} fastify
 */
export async function itemRoutes(fastify) {
  // Reusable schemas
  const itemSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string' },
      description: { type: 'string' },
      done: { type: 'boolean' }
    }
  };

  // GET /api/items - List all items
  fastify.get(
    '/',
    {
      schema: {
        response: {
          200: {
            type: 'array',
            items: itemSchema
          }
        }
      }
    },
    async (request, reply) => {
      return items;
    }
  );

  // GET /api/items/:id - Get single item
  fastify.get(
    '/:id',
    {
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' }
          }
        },
        response: {
          200: itemSchema
        }
      }
    },
    async (request, reply) => {
      const { id } = request.params;
      const item = items.find((i) => i.id === id);

      if (!item) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: `Item with id '${id}' not found`
        });
      }

      return item;
    }
  );

  // POST /api/items - Create item
  fastify.post(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string', minLength: 1 },
            description: { type: 'string', default: '' },
            done: { type: 'boolean', default: false }
          }
        },
        response: {
          201: itemSchema
        }
      }
    },
    async (request, reply) => {
      const { title, description = '', done = false } = request.body;
      const newItem = {
        id: String(Date.now()),
        title,
        description,
        done
      };

      items.push(newItem);
      reply.status(201);
      return newItem;
    }
  );

  // PUT /api/items/:id - Update item
  fastify.put(
    '/:id',
    {
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' }
          }
        },
        body: {
          type: 'object',
          properties: {
            title: { type: 'string', minLength: 1 },
            description: { type: 'string' },
            done: { type: 'boolean' }
          }
        },
        response: {
          200: itemSchema
        }
      }
    },
    async (request, reply) => {
      const { id } = request.params;
      const index = items.findIndex((i) => i.id === id);

      if (index === -1) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: `Item with id '${id}' not found`
        });
      }

      items[index] = {
        ...items[index],
        ...request.body
      };

      return items[index];
    }
  );

  // DELETE /api/items/:id - Delete item
  fastify.delete(
    '/:id',
    {
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' }
          }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              id: { type: 'string' }
            }
          }
        }
      }
    },
    async (request, reply) => {
      const { id } = request.params;
      const index = items.findIndex((i) => i.id === id);

      if (index === -1) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: `Item with id '${id}' not found`
        });
      }

      items.splice(index, 1);
      return { message: 'Item deleted successfully', id };
    }
  );
}
