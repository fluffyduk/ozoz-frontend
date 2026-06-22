# Ozoz Frontend

React + TypeScript + Vite frontend for the Ozoz marketplace demo.

## Local Development

Create a local `.env` file from the example:

```sh
cp .env.example .env
```

Set API endpoints:

```env
VITE_DOMAIN=http://localhost:5000
VITE_ORDERS_API_URL=http://localhost:5001
```

Run the app:

```sh
npm install
npm run dev
```

Useful checks:

```sh
npm run build
npm run lint
```

## Docker

The production Docker image builds the Vite app into `dist` and serves it with nginx.
Runtime API URLs are generated into `/env.js` when the container starts, so the same image can be reused across environments.

Start with Docker Compose:

```sh
cp .env.example .env
docker compose up --build
```

Open:

```text
http://localhost:8080
```

Docker env variables:

```env
FRONTEND_PORT=8080
VITE_DOMAIN=http://localhost:5000
VITE_ORDERS_API_URL=http://localhost:5001
```

`FRONTEND_PORT` controls the host port. The container always listens on port `80`.

## Runtime Config

`public/env.js` is used for local Vite development. In Docker, nginx startup generates `/usr/share/nginx/html/env.js` from container environment variables:

- `VITE_DOMAIN` for products API
- `VITE_ORDERS_API_URL` for orders API

The app falls back to Vite build-time env values if runtime config is empty.

## Docker Smoke Check

After `docker compose up --build`:

- open `/`, `/admin`, `/basket`, `/my-orders`;
- refresh those routes directly to verify nginx SPA fallback;
- open `/env.js` and confirm it contains runtime API URLs;
- confirm product pages like `/products/:id` also refresh through `index.html`.

Do not commit `.env`; commit `.env.example` only.
