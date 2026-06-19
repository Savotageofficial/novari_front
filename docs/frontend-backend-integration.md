# Frontend ↔ Backend Integration

Novari uses a Vite React frontend at the repo root and a Django REST API in `Novari/`.

## Environment

### Frontend (`.env.local`)

Copy `.env.example` to `.env.local` and set:

```env
VITE_API_URL=http://localhost:8000
```

`VITE_API_URL` is the Django origin (no trailing slash). API modules call paths like `/api/products/`, so requests resolve to `http://localhost:8000/api/products/`.

API requests go **directly** to Django via `VITE_API_URL` (CORS is enabled for `localhost:5173`). There is **no Vite dev proxy** — do not re-add one. React routes such as `/admin` and `/products` live on the Vite server; proxying those paths to Django would break the SPA.

### Backend (`Novari/.env`)

Copy `Novari/.env.example` to `Novari/.env` and configure — `settings.py` requires `DJANGO_SECRET_KEY` and `DB_PASSWORD` (it raises if either is missing):

```env
DJANGO_SECRET_KEY=dev-insecure-key-change-for-production
DJANGO_DEBUG=true
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
DJANGO_CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
DB_NAME=novari_db
DB_USER=novari_user
DB_PASSWORD=change-me-for-production
DB_HOST=localhost
DB_PORT=5433
```

`Novari/settings.py` defaults to port **5433** to match Docker Compose. Both `docker-compose.yml` and `settings.py` read `DB_PASSWORD` from `.env`, so the value just needs to be consistent between them. Generate a strong `DJANGO_SECRET_KEY` for production with `python -c "import secrets; print(secrets.token_urlsafe(50))"`.

## Local development

Terminal 1 — database (Docker):

```bash
cd Novari
copy .env.example .env   # one-time: create your local env file (required)
docker compose up -d
```

PostgreSQL listens on host port **5433** (`5433:5432` in `docker-compose.yml`). `docker-compose.yml` reads `DB_NAME` / `DB_USER` / `DB_PASSWORD` from `Novari/.env` (the same file `settings.py` reads), so the credentials stay in sync.

> **Port note:** If another Postgres container already uses `5432`, Novari binds to **5433** so both can run side by side.

Terminal 2 — backend:

```bash
cd Novari
# Option A: Pipenv (Pipfile targets Python 3.12)
pipenv install
pipenv run python manage.py migrate
pipenv run python manage.py seed_products
pipenv run python manage.py runserver

# Option B: local venv (e.g. Python 3.14)
python -m venv .venv
.\.venv\Scripts\pip install django djangorestframework django-cors-headers pillow psycopg2-binary
.\.venv\Scripts\python manage.py migrate
.\.venv\Scripts\python manage.py seed_products
.\.venv\Scripts\python manage.py runserver
```

`seed_products` loads the static catalog into PostgreSQL so the storefront has data without manual entry. It also creates an admin user (`admin@novari.test` by default) whose password is read from `SEED_ADMIN_PASSWORD` — if unset, a strong random password is generated and printed to the console.

To create an admin user manually with a strong password:

```bash
.\.venv\Scripts\python manage.py shell -c "from novari_base.models import User; u=User(email='admin@novari.test', name='Admin', role=User.ROLE_ADMIN); u.set_password('REPLACE_WITH_STRONG_PASSWORD'); u.save(); print(u.id)"
```

Terminal 3 — frontend:

```bash
pnpm install
pnpm dev
```

## API mapping

All REST endpoints are under the `/api/` prefix.

| Frontend need | Endpoint | Auth |
|---------------|----------|------|
| Product catalog | `GET /api/products/` | Public |
| Product detail | `GET /api/products/:id/` | Public |
| Admin login | `POST /api/admin/login/` | Public |
| Admin logout | `POST /api/admin/logout/` | `Authorization: <token>` |
| Admin catalog | `GET /api/admin/products/` | Token |
| Create product | `POST /api/admin/products/` | Token |
| Update product | `PATCH /api/admin/products/:id/` | Token |
| Delete product | `DELETE /api/admin/products/:id/` | Token |
| Image upload | `POST /api/admin/upload/` | Token |
| Submit order | `POST /api/orders/` | Public |

Admin auth accepts `Authorization: Bearer <token>` or a raw token. Logout invalidates the server-side token; the frontend should also clear `localStorage`.

## Image upload

Admin image upload uses `POST /api/admin/upload/`:

- **Content-Type:** `multipart/form-data`
- **Field:** `image` (image file)
- **Auth:** `Authorization: Bearer <token>` or raw token
- **Response:** JSON with a URL (e.g. `{ "url": "/media/products/..." }`) to include in the product `images` array

Uploaded files are stored under `MEDIA_ROOT` and served at `MEDIA_URL` in development when Django media serving is enabled. Prefer upload URLs over hard-coded `/assets/...` paths for admin-created products.

## Frontend architecture

- `src/lib/apiClient.ts` — shared `fetch` wrapper and `ApiError`
- `src/lib/env.ts` — `API_BASE_URL` from `VITE_API_URL`
- `src/api/products.ts` — product adapters and public catalog calls
- `src/api/admin.ts` — admin auth, product CRUD, upload, logout
- `src/api/orders.ts` — checkout order submission
- `src/context/ProductProvider.tsx` — shared catalog state for storefront pages
- `src/context/AdminAuthProvider.tsx` — stores admin token in `localStorage`

## Product adapter

Backend fields are normalized in `src/api/products.ts`:

- `price` → `numericPrice`
- `colors` / legacy `color` → `colors[]`
- `images` / legacy `image` → `images[]`
- numeric `id` → zero-padded string (`1` → `"01"`)

Admin inventory fields (`in_stock`, `stock_count`, `sales`) are mapped to `AdminProduct`.

## Verification

```bash
pnpm lint && pnpm build
```

Manual checks:

1. Home and `/products` load catalog data from the API.
2. `/products/:id` resolves a product or shows not found.
3. `/admin` login uses backend credentials and persists token on refresh.
4. Admin logout clears the session (server token + client storage).
5. Admin create/update changes are reflected after catalog reload.
6. Admin image upload returns a URL usable in product `images`.
7. Checkout submits order payload including cart line items.
