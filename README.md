# Fastify REST Backend

A clean, high-performance, and modular REST API backend built with [Fastify](https://fastify.dev/) and Node.js.

## Features

- **Fast & Lightweight**: Built with Fastify v5.
- **Modular Architecture**: Clean separation between application factory (`src/app.js`), server bootstrap (`src/server.js`), and route plugins (`src/routes/`).
- **CORS enabled**: Uses `@fastify/cors`.
- **JSON Schema Validation & Serialization**: High-speed request validation and response filtering.
- **Graceful Shutdown**: Listens to `SIGINT` and `SIGTERM` signals.
- **Built-in Node.js Testing**: Tests written with Node's native test runner (`node:test`) and Fastify's `.inject()`.

## Project Structure

```text
├── src/
│   ├── app.js            # Fastify app factory (plugins, handlers, route registration)
│   ├── server.js         # Server runner & graceful shutdown
│   └── routes/
│       ├── root.js       # Health check & root routes (/, /health)
│       └── items.js      # REST CRUD endpoints with JSON Schema validation
├── test/
│   └── app.test.js       # Unit/integration tests using app.inject()
├── .env.example          # Environment variables template
├── package.json
└── README.md
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Server

```bash
# Production mode
npm start

# Development mode (auto-reload on changes with Node --watch)
npm run dev
```

The server will be available at: [http://localhost:3000](http://localhost:3000)

### 3. Run Tests

```bash
npm test
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API info and status |
| `GET` | `/health` | Health check endpoint (uptime, timestamp) |
| `GET` | `/api/items` | List all items |
| `GET` | `/api/items/:id` | Get single item by ID |
| `POST` | `/api/items` | Create new item (`{ "title": "...", "description": "..." }`) |
| `PUT` | `/api/items/:id` | Update item |
| `DELETE` | `/api/items/:id` | Delete item |

### Sample cURL Commands

#### Health Check
```bash
curl http://localhost:3000/health
```

#### Get All Items
```bash
curl http://localhost:3000/api/items
```

#### Create Item
```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk, eggs, coffee"}'
```

#### Update Item
```bash
curl -X PUT http://localhost:3000/api/items/1 \
  -H "Content-Type: application/json" \
  -d '{"done": true}'
```

#### Delete Item
```bash
curl -X DELETE http://localhost:3000/api/items/1
```
