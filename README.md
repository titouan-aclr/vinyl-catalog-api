# Vinyl Catalog API

A small REST API exploring **AdonisJS 6**, **Kysely**, and the **repository pattern**.

The domain is a music catalogue where a *release* (a product) is sold in several
physical *variants* — LP, CD, coloured pressings… — each with its own SKU, price,
and stock.

> A focused learning/demo project, not a production application.

## Tech stack

- **AdonisJS 6** (slim starter) — HTTP framework, IoC container, ace CLI
- **Kysely** + **mysql2** — typed SQL query builder (no ORM)
- **MySQL 8.4** — via Docker for local development
- **VineJS** — request validation
- **TypeScript**

## Getting started

### Prerequisites

- Node.js 20.6+
- pnpm
- Docker

### Setup

```bash
pnpm install
cp .env.example .env
node ace generate:key                            # generate APP_KEY into .env

docker compose -f docker-compose.dev.yml up -d   # start MySQL 8.4
node ace db:migrate                              # create the schema
pnpm dev                                         # http://localhost:3333
```

Explore the endpoints with **`api.http`** (VS Code *REST Client* extension, or the
built-in JetBrains HTTP Client).

## Architecture

```
route → controller → (service) → repository → Kysely → MySQL
              └ validator (VineJS)
```

- **Controllers** stay thin: validate the input, call a repository/service, map the
  result to an HTTP response. No SQL, no business logic.
- **Validators** (VineJS) turn raw input into typed, validated payloads.
- **Services** hold business logic and transactions — added only where needed.
- **Repositories** own all Kysely queries. They are bound in the IoC container and
  receive the Kysely connection by injection, which keeps them easy to test.

## Design decisions

- **Kysely over an ORM** — a typed query builder gives full control over the SQL and
  no hidden N+1s, while keeping end-to-end type safety. Trade-off: the `Database`
  types are maintained by hand (mitigable with `kysely-codegen`).
- **Repository pattern + IoC injection** — controllers depend on repositories
  (abstractions), never on the raw connection.
- **Executor pattern for transactions** — stock methods accept an optional executor
  (connection *or* transaction), so a service can compose them inside
  `db.transaction()`. Only the methods that need it carry it.
- **A service only where there is business logic** — plain CRUD goes straight from
  controller to repository; `VariantService` exists for the stock adjustment.
- **Transactional, oversell-safe stock** — `adjustStock` locks the row with
  `SELECT … FOR UPDATE`, forbids negative stock, and transitions the status
  (`sold_out` ↔ `available`) — all atomic.
- **Money as integer cents** — no floating-point money.
- **camelCase API over a snake_case schema** — bridged by Kysely's `CamelCasePlugin`.
- **Domain errors mapped centrally** — services and repositories throw
  framework-agnostic errors; the global exception handler is the single place that
  maps them to HTTP status codes.

## API

| Method | Path | Description |
| --- | --- | --- |
| POST | `/products` | Create a product |
| GET | `/products` | List products (paginated) |
| GET | `/products/:id` | Get a product |
| POST | `/products/:productId/variants` | Create a variant |
| GET | `/products/:productId/variants` | List a product's variants |
| PATCH | `/variants/:id/stock` | Adjust stock by a delta (transactional) |

See `api.http` for request bodies and error cases (409, 422, 404).
