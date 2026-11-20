import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from '../src/app.js';

describe('Fastify Backend API', async () => {
  const app = await buildApp();

  test('GET / returns metadata and status', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/'
    });

    assert.equal(res.statusCode, 200);
    const body = res.json();
    assert.equal(body.status, 'healthy');
    assert.equal(body.version, '1.0.0');
  });

  test('GET /health returns ok uptime', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/health'
    });

    assert.equal(res.statusCode, 200);
    const body = res.json();
    assert.equal(body.status, 'ok');
    assert.ok(typeof body.uptime === 'number');
  });

  test('CRUD /api/items works properly', async () => {
    // 1. List items
    const listRes = await app.inject({
      method: 'GET',
      url: '/api/items'
    });
    assert.equal(listRes.statusCode, 200);
    const items = listRes.json();
    assert.ok(Array.isArray(items));
    assert.ok(items.length >= 2);

    // 2. Create new item
    const createRes = await app.inject({
      method: 'POST',
      url: '/api/items',
      payload: {
        title: 'Test Fastify item',
        description: 'Created in automated test'
      }
    });
    assert.equal(createRes.statusCode, 201);
    const createdItem = createRes.json();
    assert.equal(createdItem.title, 'Test Fastify item');
    assert.ok(createdItem.id);

    // 3. Get item by id
    const getRes = await app.inject({
      method: 'GET',
      url: `/api/items/${createdItem.id}`
    });
    assert.equal(getRes.statusCode, 200);
    assert.equal(getRes.json().id, createdItem.id);

    // 4. Update item
    const updateRes = await app.inject({
      method: 'PUT',
      url: `/api/items/${createdItem.id}`,
      payload: {
        title: 'Updated title',
        done: true
      }
    });
    assert.equal(updateRes.statusCode, 200);
    assert.equal(updateRes.json().title, 'Updated title');
    assert.equal(updateRes.json().done, true);

    // 5. Delete item
    const deleteRes = await app.inject({
      method: 'DELETE',
      url: `/api/items/${createdItem.id}`
    });
    assert.equal(deleteRes.statusCode, 200);

    // 6. Verify deleted
    const verifyRes = await app.inject({
      method: 'GET',
      url: `/api/items/${createdItem.id}`
    });
    assert.equal(verifyRes.statusCode, 404);
  });

  test('POST /api/items validation fails on missing title', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/items',
      payload: {
        description: 'Missing title property'
      }
    });
    assert.equal(res.statusCode, 400);
  });
});
