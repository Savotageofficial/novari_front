# Handoff: Novari Backend ↔ Frontend Integration

**Date:** 2026-06-19  
**Workspace:** `C:\Projects\novari`  
**Status:** Integration implemented and verified (lint/build/tests green); manual E2E on user's machine recommended

---

## Goal

Dynamic React storefront + admin backed by Django REST API in `Novari/`. Catalog, admin CRUD, checkout orders, image upload, seed data, and auth hardening are in place.

**Do not duplicate these artifacts — read them first:**

| Artifact | Path |
|----------|------|
| Integration guide | `C:\Projects\novari\docs\frontend-backend-integration.md` |
| Prior handoff (workspace) | `C:\Projects\novari\plans\novari-backend-frontend-integration-handoff.md` |
| Agent conventions | `C:\Projects\novari\AGENTS.md` |
| Original plan (user Cursor plans) | `c:\Users\remedy\.cursor\plans\backend_frontend_integration_0f2a1c37.plan.md` |

---

## What was completed this session

### Infrastructure / fixes

- **PostgreSQL port conflict:** Another project's container occupied `:5432`. Novari Docker Compose binds **host port 5433**; `Novari/settings.py` defaults `DB_PORT=5433` via env.
- **Vite proxy removed:** Broad `/admin` and `/products` proxies sent browser navigation to Django (DRF 405 on `/admin/login/`). API calls use `VITE_API_URL` + CORS directly.
- **Upload field fix:** `apiUploadFile` sends multipart field `image` (matches backend).

### Backend (`Novari/`)

- REST routes under **`/api/`** prefix (`novari_base/urls.py`)
- Django built-in admin at **`/django-admin/`** (not `/admin/`)
- **`POST /api/admin/upload/`** — image upload (JPEG/PNG/WebP, 5MB max) → `media/products/`
- **`POST /api/admin/logout/`** — invalidates token
- Auth: `Bearer <token>` or raw token; **30-day** token expiry via `AdminToken.created_at`
- `serialize_product(..., request)` — absolute URLs for `/media/...` paths
- `DJANGO_SECRET_KEY` from env (`Novari/.env.example`)
- **`python manage.py seed_products`** — 4 sample products + admin user if DB empty
- **`novari_base/tests/test_api.py`** — 4 tests, all passing
- MEDIA served in DEBUG (`Novari/urls.py`)

### Frontend (`src/`)

- All API paths use `/api/...` with `VITE_API_URL=http://localhost:8000`
- **`AdminImageUpload.tsx`** — upload in add-product drawer + product details
- Admin **delete** button with confirm; **catalog reload** after add/update/delete (`onCatalogChange` → `useProducts().reload`)
- **`AdminAuthProvider`** — server logout on sign-out
- Improved **`ApiError`** messages (401/404/400)
- **`.env.local`** created at repo root
- ESLint ignores `Novari/` (venv noise)

### Verification run

```
pnpm lint          — pass
pnpm build         — pass
manage.py test novari_base — 4/4 pass
```

---

## Local dev quick start

```powershell
# Terminal 1 — database + API
cd C:\Projects\novari\Novari
docker compose up -d
.\.venv\Scripts\python manage.py migrate
.\.venv\Scripts\python manage.py seed_products
.\.venv\Scripts\python manage.py runserver

# Terminal 2 — frontend
cd C:\Projects\novari
pnpm dev
```

**Env (frontend):** copy `.env.example` → `.env.local`, set `VITE_API_URL=http://localhost:8000` (no `/api` suffix — paths in code include it).

**Env (backend):** optional `Novari/.env` from `Novari/.env.example` (`DB_*`, `DJANGO_SECRET_KEY`).

**Seed admin:** created by `seed_products` if no users exist — credentials printed to console; see integration doc for shell one-liner to create manually.

**Postgres:** host port **5433** (not 5432) when using Docker Compose.

---

## API route map

| Endpoint | Method | Auth |
|----------|--------|------|
| `/api/products/` | GET | Public |
| `/api/products/:id/` | GET | Public |
| `/api/admin/login/` | POST | Public |
| `/api/admin/logout/` | POST | Token |
| `/api/admin/products/` | GET, POST | Token |
| `/api/admin/products/:id/` | PATCH, DELETE | Token |
| `/api/admin/upload/` | POST (multipart `image`) | Token |
| `/api/orders/` | POST | Public |

---

## Key files

| Area | Paths |
|------|-------|
| Backend views/urls | `Novari/novari_base/views.py`, `urls.py`, `serializers.py` |
| Seed | `Novari/novari_base/management/commands/seed_products.py` |
| Tests | `Novari/novari_base/tests/test_api.py` |
| API client | `src/lib/apiClient.ts`, `src/lib/env.ts` |
| API modules | `src/api/{products,admin,orders,types}.ts` |
| Catalog state | `src/context/ProductProvider.tsx`, `src/hooks/useProducts.ts` |
| Admin | `src/hooks/useAdminProducts.ts`, `src/pages/Admin.tsx`, `src/components/admin/*` |
| Image upload UI | `src/components/admin/AdminImageUpload.tsx` |
| Docker DB | `Novari/docker-compose.yml` |

---

## What remains / optional next work

| Item | Notes |
|------|-------|
| **Manual E2E** | User should walk checklist in `docs/frontend-backend-integration.md` on their machine |
| **Production secrets** | Move DB password and `SECRET_KEY` to env only; never commit `.env` |
| **Deploy docs** | Static frontend + Django API + Postgres; CORS for prod domain |
| **Image strategy** | Uploaded URLs are `http://localhost:8000/media/...`; prod needs CDN or same-origin |
| **Admin UX** | Multi-image drag-and-drop, upload progress, token refresh UX |
| **More tests** | Upload, logout, admin CRUD integration tests |
| **Sizes** | Still static in `src/data/sizes.ts` |

---

## Gotchas for next agent

1. **`VITE_API_URL` must NOT end with `/api`** — client paths already include `/api/`.
2. **Do not re-add Vite proxy** for `/admin` or `/products` — breaks React routes.
3. **`pipenv` may not be on PATH** — use `Novari/.venv` (Python 3.14) or install Pipenv + Python 3.12 per Pipfile.
4. **Port 5432** may be used by another Docker project; Novari uses **5433**.
5. **Django admin** is at `/django-admin/`; React admin is at `localhost:5173/admin`.

---

## Suggested skills

Invoke at the start of the next session as appropriate:

1. **`executing-plans`** or **`subagent-driven-development`** — if continuing structured todos or parallel workstreams.
2. **`systematic-debugging`** — API/CORS/auth/upload failures during E2E.
3. **`comprehensive-frontend`** / **`react-patterns`** — admin UX, catalog state, upload flows.
4. **`backend-development`** — Django media, migrations, API contract changes.
5. **`api-design`** — if adding endpoints or versioning `/api/`.
6. **`typescript-pro`** — strict typing around upload/multipart clients.
7. **`review-bugbot`** or **`review-security`** — before merge if user wants review.
8. **`handoff`** — when ending another session (this document's skill).

---

## Session context

- User continued integration handoff; fixed Postgres auth (wrong server on 5432), removed Vite proxy bug for `/admin`, then requested all improvement items plus admin image upload via parallel subagents (`composer-2.5`).
- Subagents completed backend, frontend, and docs; parent agent fixed upload field name (`image`), `VITE_API_URL` doc inconsistency, and ESLint ignore for `Novari/`.
- User asked how to view DB tables (psql semicolons, port 5433); empty tables expected until `seed_products` or admin CRUD.
- No git commits were made in this session unless user committed separately.

**Next agent first action:** Confirm `docker compose up -d`, `migrate`, `seed_products`, `runserver`, and `pnpm dev`; run manual E2E checklist in `docs/frontend-backend-integration.md`; test image upload in admin and verify images on storefront.
