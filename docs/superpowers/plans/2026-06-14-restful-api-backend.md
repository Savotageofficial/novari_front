# Novari RESTful API Backend Plan

> **Goal:** Replace all hard-coded data in the current React frontend with a production-ready RESTful backend that serves products, categories, colors, admin inventory data, and authentication.

## 1. Overview

The current Novari storefront keeps the entire product catalog (`src/data/products.ts`), color swatches (`src/data/colors.ts`), sizes (`src/data/sizes.ts`), and admin seed data in the client bundle. This plan defines a backend API that owns that data, plus the admin inventory fields (`inStock`, `stockCount`, `sales`) currently generated on the fly.

**Scope**

- Public read-only catalog APIs for the storefront (`Home`, `Products`, `ProductDetail`).
- Admin authentication and session management (replaces the hard-coded `ADMIN_PASSWORD`).
- Admin CRUD for products, inventory, and dashboard statistics.
- Image asset hosting (products currently share a single placeholder image).
- Optional but recommended: contact/order capture endpoint so the cart has somewhere to land.

**Base URL**

```text
Production:  https://api.novari.com/v1
Staging:     https://api-staging.novari.com/v1
Local:       http://localhost:4000/v1
```

All endpoints are prefixed with `/v1`. Versioning is URL-based; when a breaking change is required, a new `/v2` prefix is introduced and `/v1` is deprecated with a 6-month sunset window.

**Global headers**

```text
Content-Type: application/json
Accept:       application/json
```

---

## 2. Authentication & Authorization

### Public endpoints

No authentication required. Rate-limited by IP.

### Admin endpoints

Require a valid access token in the `Authorization` header:

```text
Authorization: Bearer <access_token>
```

### Token strategy

- Short-lived **access tokens**: JWT, `exp` = 15 minutes, signed with `JWT_ACCESS_SECRET`.
- Long-lived **refresh tokens**: opaque random string stored in `refresh_tokens` table, `exp` = 7 days, single-use, rotated on every refresh.
- Tokens are issued on `/v1/admin/login`.
- Access tokens contain `sub` (admin user id) and `role`.

### Roles

| Role    | Description                                |
| ------- | ------------------------------------------ |
| `admin` | Full product, inventory, and stats access. |

For this project, only one admin role is required. The schema supports `role` so additional roles (e.g., `viewer`, `editor`) can be added without a migration.

---

## 3. Error Handling

### Standard error envelope

Every error response uses the same JSON shape:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description",
    "field": "optional_field_name",
    "details": {}
  }
}
```

### Common HTTP status codes

| Status | Meaning                                                                 |
| ------ | ----------------------------------------------------------------------- |
| 200    | Success (GET, PATCH).                                                   |
| 201    | Created (POST).                                                         |
| 204    | No Content (DELETE).                                                    |
| 400    | Bad Request — validation failed or malformed input.                     |
| 401    | Unauthorized — missing or invalid access token.                         |
| 403    | Forbidden — valid token but insufficient permissions.                   |
| 404    | Not Found — resource does not exist.                                    |
| 409    | Conflict — resource already exists or idempotency key reused.           |
| 422    | Unprocessable Entity — semantic validation failure (e.g., discount > 100). |
| 429    | Too Many Requests — rate limit exceeded.                                |
| 500    | Internal Server Error — unexpected server failure.                      |

### Common error codes

| Code                      | When it occurs                                  |
| ------------------------- | ----------------------------------------------- |
| `INVALID_REQUEST`         | Malformed JSON or missing required fields.      |
| `VALIDATION_ERROR`        | Input fails schema validation.                  |
| `UNAUTHORIZED`            | Missing/invalid/expired access token.           |
| `FORBIDDEN`               | Insufficient role permissions.                  |
| `RESOURCE_NOT_FOUND`      | Product, category, or color not found.          |
| `RESOURCE_CONFLICT`       | Duplicate SKU/slug or conflicting state.        |
| `RATE_LIMIT_EXCEEDED`     | Client exceeded request quota.                  |
| `INTERNAL_SERVER_ERROR`   | Unexpected server error.                        |

---

## 4. Endpoints

---

### Endpoint 1: List Products

**Endpoint:** `GET /v1/products`

**Description:** Returns the public product catalog. Supports filtering by category, color, price range, discount status, search, sorting, and pagination. Used by the `Products` page and the `LatestDrops` section on `Home`.

**Input Schema**

| Parameter   | Type      | In     | Required | Description                                                                   |
| ----------- | --------- | ------ | -------- | ----------------------------------------------------------------------------- |
| `category`  | string    | query  | No       | Filter by category slug, e.g., `t-shirts`. Repeatable: `category=t-shirts&category=hoodies`. |
| `color`     | string    | query  | No       | Filter by color name, e.g., `Obsidian`. Repeatable.                           |
| `minPrice`  | integer   | query  | No       | Minimum effective price (after discount).                                     |
| `maxPrice`  | integer   | query  | No       | Maximum effective price (after discount).                                     |
| `discounted`| boolean   | query  | No       | `true` returns only products with `discount > 0`.                             |
| `q`         | string    | query  | No       | Search product `name` and `description` (case-insensitive prefix/ILIKE).      |
| `sort`      | string    | query  | No       | One of: `name`, `price`, `discount`, `createdAt`. Default: `createdAt`.       |
| `order`     | string    | query  | No       | `asc` or `desc`. Default: `desc` for `createdAt`, `asc` otherwise.            |
| `page`      | integer   | query  | No       | Page number, 1-based. Default: `1`.                                           |
| `limit`     | integer   | query  | No       | Page size. Default: `20`, max: `100`.                                         |

**Output Schema**

Status: `200 OK`

```json
{
  "data": [
    {
      "id": "01",
      "name": "Premium Tee",
      "slug": "premium-tee",
      "price": 450,
      "discount": 10,
      "effectivePrice": 405,
      "formattedPrice": "405 EGP",
      "description": "Essential forms engineered to outlive the trend cycle...",
      "images": [
        { "id": "img_1", "url": "https://cdn.novari.com/products/premium-tee-obsidian.webp", "alt": "Premium Tee in Obsidian" }
      ],
      "category": {
        "id": "cat_1",
        "name": "T-Shirts",
        "slug": "t-shirts"
      },
      "colors": [
        { "name": "Obsidian", "hex": "#070707" },
        { "name": "Bone", "hex": "#E5E5E5" },
        { "name": "Ashe", "hex": "#7A7A7A" }
      ],
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-06-01T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 19,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

**Authentication & Authorization:** Public. No token required.

**Error Handling**

| Status | Code                | Meaning                                      |
| ------ | ------------------- | -------------------------------------------- |
| 400    | `VALIDATION_ERROR`  | `limit` > 100 or invalid `sort` value.       |
| 500    | `INTERNAL_SERVER_ERROR` | Database failure.                        |

**Pagination & Filtering**

- Cursor-based pagination is preferred for infinite scroll, but offset-based (`page`/`limit`) is used here because the storefront needs direct page links and predictable total counts.
- Filters are combined with `AND` logic. Multi-value params (`category`, `color`) use `IN` clauses.
- Full-text search uses a `tsvector` column in PostgreSQL (`name` + `description`) or a database-native ILIKE fallback for small catalogs.

**Rate Limiting:** 100 requests per minute per IP.

---

### Endpoint 2: Get Single Product

**Endpoint:** `GET /v1/products/:id`

**Description:** Returns full details for a single product. Used by `ProductDetail`. The `:id` parameter accepts the public product id (e.g., `01`).

**Input Schema**

| Parameter | Type   | In   | Required | Description         |
| --------- | ------ | ---- | -------- | ------------------- |
| `id`      | string | path | Yes      | Public product id.  |

**Output Schema**

Status: `200 OK`

```json
{
  "data": {
    "id": "01",
    "name": "Premium Tee",
    "slug": "premium-tee",
    "price": 450,
    "discount": 10,
    "effectivePrice": 405,
    "formattedPrice": "405 EGP",
    "description": "Essential forms engineered to outlive the trend cycle...",
    "images": [
      { "id": "img_1", "url": "https://cdn.novari.com/products/premium-tee-obsidian.webp", "alt": "Premium Tee in Obsidian" }
    ],
    "category": {
      "id": "cat_1",
      "name": "T-Shirts",
      "slug": "t-shirts"
    },
    "colors": [
      { "name": "Obsidian", "hex": "#070707" },
      { "name": "Bone", "hex": "#E5E5E5" },
      { "name": "Ashe", "hex": "#7A7A7A" }
    ],
    "sizes": ["S", "M", "L", "XL"],
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-06-01T12:00:00Z"
  }
}
```

**Authentication & Authorization:** Public. No token required.

**Error Handling**

| Status | Code                 | Meaning                          |
| ------ | -------------------- | -------------------------------- |
| 404    | `RESOURCE_NOT_FOUND` | Product with given id not found. |
| 500    | `INTERNAL_SERVER_ERROR` | Database failure.             |

**Pagination & Filtering:** Not applicable.

**Rate Limiting:** 100 requests per minute per IP.

---

### Endpoint 3: List Categories

**Endpoint:** `GET /v1/categories`

**Description:** Returns all product categories. Used by `ProductFilters` to populate the category filter and by product forms.

**Input Schema**

No parameters.

**Output Schema**

Status: `200 OK`

```json
{
  "data": [
    { "id": "cat_1", "name": "T-Shirts", "slug": "t-shirts", "productCount": 8 },
    { "id": "cat_2", "name": "Hoodies", "slug": "hoodies", "productCount": 3 },
    { "id": "cat_3", "name": "Bottoms", "slug": "bottoms", "productCount": 3 },
    { "id": "cat_4", "name": "Accessories", "slug": "accessories", "productCount": 4 },
    { "id": "cat_5", "name": "Outerwear", "slug": "outerwear", "productCount": 2 }
  ]
}
```

**Authentication & Authorization:** Public. No token required.

**Error Handling**

| Status | Code                    | Meaning           |
| ------ | ----------------------- | ----------------- |
| 500    | `INTERNAL_SERVER_ERROR` | Database failure. |

**Pagination & Filtering:** Not applicable; categories are a small, controlled vocabulary.

**Rate Limiting:** 100 requests per minute per IP.

---

### Endpoint 4: List Colors

**Endpoint:** `GET /v1/colors`

**Description:** Returns all available product colors with their swatch hex values. Used by `ColorSelector`, `ProductFilters`, and the admin color picker.

**Input Schema**

No parameters.

**Output Schema**

Status: `200 OK`

```json
{
  "data": [
    { "id": "col_1", "name": "Obsidian", "hex": "#070707" },
    { "id": "col_2", "name": "Bone", "hex": "#E5E5E5" },
    { "id": "col_3", "name": "Ashe", "hex": "#7A7A7A" },
    { "id": "col_4", "name": "Gold", "hex": "#7A6751" }
  ]
}
```

**Authentication & Authorization:** Public. No token required.

**Error Handling**

| Status | Code                    | Meaning           |
| ------ | ----------------------- | ----------------- |
| 500    | `INTERNAL_SERVER_ERROR` | Database failure. |

**Pagination & Filtering:** Not applicable; colors are a small, controlled vocabulary.

**Rate Limiting:** 100 requests per minute per IP.

---

### Endpoint 5: Admin Login

**Endpoint:** `POST /v1/admin/login`

**Description:** Authenticates an admin user and returns access/refresh tokens. Replaces the hard-coded `ADMIN_PASSWORD` in `src/data/admin.ts`.

**Input Schema**

| Field      | Type   | In   | Required | Description                  |
| ---------- | ------ | ---- | -------- | ---------------------------- |
| `email`    | string | body | Yes      | Admin email. Max 255 chars.  |
| `password` | string | body | Yes      | Admin password. Min 12 chars.|

```json
{
  "email": "admin@novari.com",
  "password": "secure-password-123"
}
```

**Output Schema**

Status: `200 OK`

```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "opaque_random_string_64_chars",
    "expiresIn": 900,
    "tokenType": "Bearer",
    "admin": {
      "id": "adm_1",
      "email": "admin@novari.com",
      "role": "admin"
    }
  }
}
```

**Authentication & Authorization:** Public. Credentials are verified against the `admins` table.

**Error Handling**

| Status | Code                | Meaning                                            |
| ------ | ------------------- | -------------------------------------------------- |
| 400    | `VALIDATION_ERROR`  | Missing `email` or `password`.                     |
| 401    | `UNAUTHORIZED`      | Invalid email or password.                         |
| 429    | `RATE_LIMIT_EXCEEDED` | Too many failed login attempts.                  |
| 500    | `INTERNAL_SERVER_ERROR` | Database or signing failure.                   |

**Pagination & Filtering:** Not applicable.

**Rate Limiting:** 5 attempts per 15 minutes per IP; 10 attempts per hour per email.

---

### Endpoint 6: Refresh Admin Token

**Endpoint:** `POST /v1/admin/refresh`

**Description:** Issues a new access token and rotates the refresh token. The old refresh token is invalidated after use.

**Input Schema**

| Field           | Type   | In   | Required | Description              |
| --------------- | ------ | ---- | -------- | ------------------------ |
| `refreshToken`  | string | body | Yes      | Valid refresh token.     |

```json
{
  "refreshToken": "opaque_random_string_64_chars"
}
```

**Output Schema**

Status: `200 OK`

```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "new_opaque_random_string_64_chars",
    "expiresIn": 900,
    "tokenType": "Bearer"
  }
}
```

**Authentication & Authorization:** Public. Requires a valid, unused refresh token.

**Error Handling**

| Status | Code                | Meaning                              |
| ------ | ------------------- | ------------------------------------ |
| 400    | `VALIDATION_ERROR`  | Missing `refreshToken`.              |
| 401    | `UNAUTHORIZED`      | Refresh token invalid or expired.    |
| 500    | `INTERNAL_SERVER_ERROR` | Database or signing failure.     |

**Pagination & Filtering:** Not applicable.

**Rate Limiting:** 30 requests per minute per IP.

---

### Endpoint 7: List Admin Products

**Endpoint:** `GET /v1/admin/products`

**Description:** Returns products with admin-only fields (`inStock`, `stockCount`, `sales`) for the admin panel. Supports search, category filter, stock filter, sorting, and pagination.

**Input Schema**

| Parameter     | Type    | In     | Required | Description                                                            |
| ------------- | ------- | ------ | -------- | ---------------------------------------------------------------------- |
| `q`           | string  | query  | No       | Search product `name`.                                                 |
| `category`    | string  | query  | No       | Filter by category id or slug.                                         |
| `stock`       | string  | query  | No       | One of: `all`, `in`, `out`. Default: `all`.                            |
| `sort`        | string  | query  | No       | One of: `name`, `price`, `discount`, `stockCount`, `sales`. Default: `name`. |
| `order`       | string  | query  | No       | `asc` or `desc`. Default: `asc`.                                       |
| `page`        | integer | query  | No       | Default: `1`.                                                          |
| `limit`       | integer | query  | No       | Default: `20`, max: `100`.                                             |

Headers:

```text
Authorization: Bearer <access_token>
```

**Output Schema**

Status: `200 OK`

```json
{
  "data": [
    {
      "id": "01",
      "name": "Premium Tee",
      "slug": "premium-tee",
      "price": 450,
      "discount": 10,
      "effectivePrice": 405,
      "description": "Essential forms engineered to outlive the trend cycle...",
      "images": [
        { "id": "img_1", "url": "https://cdn.novari.com/products/premium-tee-obsidian.webp", "alt": "Premium Tee in Obsidian" }
      ],
      "category": { "id": "cat_1", "name": "T-Shirts", "slug": "t-shirts" },
      "colors": [
        { "name": "Obsidian", "hex": "#070707" },
        { "name": "Bone", "hex": "#E5E5E5" },
        { "name": "Ashe", "hex": "#7A7A7A" }
      ],
      "inStock": true,
      "stockCount": 25,
      "sales": 142,
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-06-01T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 19,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

**Authentication & Authorization:** Requires valid `admin` access token.

**Error Handling**

| Status | Code                 | Meaning                                  |
| ------ | -------------------- | ---------------------------------------- |
| 401    | `UNAUTHORIZED`       | Missing or invalid access token.         |
| 403    | `FORBIDDEN`          | Valid token but non-admin role.          |
| 400    | `VALIDATION_ERROR`   | Invalid `sort`, `stock`, or `limit`.     |
| 500    | `INTERNAL_SERVER_ERROR` | Database failure.                    |

**Pagination & Filtering**

- Same offset pagination strategy as the public products endpoint.
- `stock=in` filters `inStock = true`; `stock=out` filters `inStock = false`.

**Rate Limiting:** 200 requests per minute per admin user.

---

### Endpoint 8: Create Product

**Endpoint:** `POST /v1/admin/products`

**Description:** Creates a new product with inventory and color associations. Used by the admin panel.

**Input Schema**

Headers:

```text
Authorization: Bearer <access_token>
Content-Type: application/json
```

Body:

| Field         | Type     | Required | Constraints                                          |
| ------------- | -------- | -------- | ---------------------------------------------------- |
| `name`        | string   | Yes      | 1-120 chars.                                         |
| `slug`        | string   | Yes      | Unique, URL-safe, 1-150 chars.                       |
| `price`       | integer  | Yes      | > 0, EGP (minor unit not used; store as EGP).        |
| `discount`    | integer  | No       | 0-100. Default: `0`.                                 |
| `description` | string   | Yes      | 1-2000 chars.                                        |
| `categoryId`  | string   | Yes      | Valid category id.                                   |
| `colorIds`    | string[] | Yes      | At least one valid color id.                         |
| `imageUrls`   | string[] | No       | Array of HTTPS image URLs. Max 10.                   |
| `inStock`     | boolean  | No       | Default: `true`.                                     |
| `stockCount`  | integer  | No       | >= 0. Default: `0`.                                  |
| `sales`       | integer  | No       | >= 0. Default: `0`.                                  |

```json
{
  "name": "Archive Tee",
  "slug": "archive-tee",
  "price": 500,
  "discount": 0,
  "description": "A reissued essential with a lived-in feel...",
  "categoryId": "cat_1",
  "colorIds": ["col_1", "col_2", "col_4"],
  "imageUrls": ["https://cdn.novari.com/products/archive-tee-obsidian.webp"],
  "inStock": true,
  "stockCount": 30,
  "sales": 0
}
```

**Output Schema**

Status: `201 Created`

```json
{
  "data": {
    "id": "02",
    "name": "Archive Tee",
    "slug": "archive-tee",
    "price": 500,
    "discount": 0,
    "effectivePrice": 500,
    "description": "A reissued essential with a lived-in feel...",
    "images": [
      { "id": "img_2", "url": "https://cdn.novari.com/products/archive-tee-obsidian.webp", "alt": "Archive Tee" }
    ],
    "category": { "id": "cat_1", "name": "T-Shirts", "slug": "t-shirts" },
    "colors": [
      { "name": "Obsidian", "hex": "#070707" },
      { "name": "Bone", "hex": "#E5E5E5" },
      { "name": "Gold", "hex": "#7A6751" }
    ],
    "inStock": true,
    "stockCount": 30,
    "sales": 0,
    "createdAt": "2026-06-14T10:00:00Z",
    "updatedAt": "2026-06-14T10:00:00Z"
  }
}
```

**Authentication & Authorization:** Requires valid `admin` access token.

**Error Handling**

| Status | Code                 | Meaning                                       |
| ------ | -------------------- | --------------------------------------------- |
| 400    | `VALIDATION_ERROR`   | Missing/invalid fields or `discount` > 100.   |
| 401    | `UNAUTHORIZED`       | Missing/invalid access token.                 |
| 403    | `FORBIDDEN`          | Non-admin role.                               |
| 409    | `RESOURCE_CONFLICT`  | `slug` already exists.                        |
| 422    | `VALIDATION_ERROR`   | `categoryId` or `colorIds` reference non-existent records. |
| 500    | `INTERNAL_SERVER_ERROR` | Database failure.                       |

**Pagination & Filtering:** Not applicable.

**Rate Limiting:** 30 product mutations per minute per admin user.

---

### Endpoint 9: Update Product

**Endpoint:** `PATCH /v1/admin/products/:id`

**Description:** Partially updates a product's details, inventory, or color associations. Used when the admin edits fields inline or expands a row.

**Input Schema**

Headers:

```text
Authorization: Bearer <access_token>
Content-Type: application/json
```

Path parameter: `id` (product id).

Body (all fields optional):

| Field         | Type     | Constraints                                   |
| ------------- | -------- | --------------------------------------------- |
| `name`        | string   | 1-120 chars.                                  |
| `slug`        | string   | Unique, URL-safe, 1-150 chars.                |
| `price`       | integer  | > 0.                                          |
| `discount`    | integer  | 0-100.                                        |
| `description` | string   | 1-2000 chars.                                 |
| `categoryId`  | string   | Valid category id.                            |
| `colorIds`    | string[] | At least one valid color id if provided.      |
| `imageUrls`   | string[] | Array of HTTPS image URLs. Max 10.            |
| `inStock`     | boolean  |                                               |
| `stockCount`  | integer  | >= 0.                                         |
| `sales`       | integer  | >= 0.                                         |

```json
{
  "price": 480,
  "discount": 15,
  "stockCount": 12,
  "inStock": true
}
```

**Output Schema**

Status: `200 OK`

Returns the updated product object (same shape as Create Product response).

**Authentication & Authorization:** Requires valid `admin` access token.

**Error Handling**

| Status | Code                 | Meaning                                       |
| ------ | -------------------- | --------------------------------------------- |
| 400    | `VALIDATION_ERROR`   | Invalid field values.                         |
| 401    | `UNAUTHORIZED`       | Missing/invalid access token.                 |
| 403    | `FORBIDDEN`          | Non-admin role.                               |
| 404    | `RESOURCE_NOT_FOUND` | Product id not found.                         |
| 409    | `RESOURCE_CONFLICT`  | Updated `slug` already exists.                |
| 422    | `VALIDATION_ERROR`   | `categoryId` or `colorIds` reference non-existent records. |
| 500    | `INTERNAL_SERVER_ERROR` | Database failure.                       |

**Pagination & Filtering:** Not applicable.

**Rate Limiting:** 30 product mutations per minute per admin user.

---

### Endpoint 10: Delete Product

**Endpoint:** `DELETE /v1/admin/products/:id`

**Description:** Soft-deletes a product from the catalog. Soft delete preserves order history and sales data.

**Input Schema**

Headers:

```text
Authorization: Bearer <access_token>
```

Path parameter: `id` (product id).

**Output Schema**

Status: `204 No Content`

No body.

**Authentication & Authorization:** Requires valid `admin` access token.

**Error Handling**

| Status | Code                 | Meaning                       |
| ------ | -------------------- | ----------------------------- |
| 401    | `UNAUTHORIZED`       | Missing/invalid access token. |
| 403    | `FORBIDDEN`          | Non-admin role.               |
| 404    | `RESOURCE_NOT_FOUND` | Product id not found.         |
| 500    | `INTERNAL_SERVER_ERROR` | Database failure.        |

**Pagination & Filtering:** Not applicable.

**Rate Limiting:** 10 deletions per minute per admin user.

---

### Endpoint 11: Toggle Product Color

**Endpoint:** `POST /v1/admin/products/:id/toggle-color`

**Description:** Adds or removes a color from a product. This is an RPC-style action because it is a state transition on a relationship, not a pure resource update. It matches the existing `toggleColor` behavior in the frontend admin panel.

**Input Schema**

Headers:

```text
Authorization: Bearer <access_token>
Content-Type: application/json
```

Path parameter: `id` (product id).

Body:

| Field     | Type   | Required | Description          |
| --------- | ------ | -------- | -------------------- |
| `colorId` | string | Yes      | Valid color id.      |

```json
{
  "colorId": "col_4"
}
```

**Output Schema**

Status: `200 OK`

Returns the updated product object with the new color list.

**Authentication & Authorization:** Requires valid `admin` access token.

**Error Handling**

| Status | Code                 | Meaning                          |
| ------ | -------------------- | -------------------------------- |
| 400    | `VALIDATION_ERROR`   | Missing `colorId`.               |
| 401    | `UNAUTHORIZED`       | Missing/invalid access token.    |
| 403    | `FORBIDDEN`          | Non-admin role.                  |
| 404    | `RESOURCE_NOT_FOUND` | Product or color id not found.   |
| 422    | `VALIDATION_ERROR`   | Cannot remove the last color from a product. |
| 500    | `INTERNAL_SERVER_ERROR` | Database failure.           |

**Pagination & Filtering:** Not applicable.

**Rate Limiting:** 30 product mutations per minute per admin user.

---

### Endpoint 12: Admin Dashboard Statistics

**Endpoint:** `GET /v1/admin/stats`

**Description:** Returns aggregated metrics for the admin dashboard: total products, total sales, low-stock count, and estimated revenue.

**Input Schema**

Headers:

```text
Authorization: Bearer <access_token>
```

No parameters.

**Output Schema**

Status: `200 OK`

```json
{
  "data": {
    "totalProducts": 19,
    "totalSales": 1247,
    "lowStock": 3,
    "revenue": 824150
  }
}
```

`revenue` is calculated as `SUM(effective_price * sales)` across all products, in EGP as an integer.

**Authentication & Authorization:** Requires valid `admin` access token.

**Error Handling**

| Status | Code                 | Meaning                       |
| ------ | -------------------- | ----------------------------- |
| 401    | `UNAUTHORIZED`       | Missing/invalid access token. |
| 403    | `FORBIDDEN`          | Non-admin role.               |
| 500    | `INTERNAL_SERVER_ERROR` | Database failure.        |

**Pagination & Filtering:** Not applicable.

**Rate Limiting:** 60 requests per minute per admin user.

---

### Endpoint 13: Submit Order / Contact

**Endpoint:** `POST /v1/orders`

**Description:** Captures a customer order initiated from the cart drawer. This gives the cart a backend destination without building a full payment gateway integration in v1. Orders are created with status `pending` and fulfilled manually via admin.

**Input Schema**

| Field           | Type     | Required | Description                                    |
| --------------- | -------- | -------- | ---------------------------------------------- |
| `customerName`  | string   | Yes      | 1-100 chars.                                   |
| `customerEmail` | string   | Yes      | Valid email, max 255 chars.                    |
| `customerPhone` | string   | Yes      | 5-20 chars.                                    |
| `items`         | array    | Yes      | At least one item.                             |
| `items[].productId` | string | Yes    | Valid product id.                              |
| `items[].color` | string   | Yes      | Valid color name.                              |
| `items[].size`  | string   | Yes      | One of `S`, `M`, `L`, `XL`.                    |
| `items[].quantity` | integer | Yes   | >= 1.                                          |
| `notes`         | string   | No       | Max 1000 chars.                                |

```json
{
  "customerName": "Ahmed Hassan",
  "customerEmail": "ahmed@example.com",
  "customerPhone": "+20 100 123 4567",
  "items": [
    {
      "productId": "01",
      "color": "Obsidian",
      "size": "L",
      "quantity": 2
    }
  ],
  "notes": "Please gift wrap."
}
```

**Output Schema**

Status: `201 Created`

```json
{
  "data": {
    "id": "ord_12345",
    "status": "pending",
    "total": 810,
    "currency": "EGP",
    "customerName": "Ahmed Hassan",
    "customerEmail": "ahmed@example.com",
    "items": [
      {
        "id": "oi_1",
        "product": {
          "id": "01",
          "name": "Premium Tee",
          "price": 450,
          "discount": 10,
          "effectivePrice": 405
        },
        "color": "Obsidian",
        "size": "L",
        "quantity": 2,
        "lineTotal": 810
      }
    ],
    "createdAt": "2026-06-14T10:00:00Z"
  }
}
```

**Authentication & Authorization:** Public. No token required.

**Error Handling**

| Status | Code                 | Meaning                                            |
| ------ | -------------------- | -------------------------------------------------- |
| 400    | `VALIDATION_ERROR`   | Missing/invalid fields or empty `items`.           |
| 404    | `RESOURCE_NOT_FOUND` | A `productId` or selected color does not exist.    |
| 409    | `RESOURCE_CONFLICT`  | Product is out of stock or requested quantity exceeds stock. |
| 422    | `VALIDATION_ERROR`   | Invalid `size` value.                              |
| 500    | `INTERNAL_SERVER_ERROR` | Database failure.                            |

**Pagination & Filtering:** Not applicable.

**Rate Limiting:** 10 submissions per minute per IP; 50 per hour per IP.

---

## 5. Database Schema

### Technology

**PostgreSQL 16+** with Prisma ORM.

- ACID transactions for order creation and inventory decrements.
- Native JSONB if needed for flexible image metadata.
- Full-text search via `tsvector` for product search.

### Entity Relationship Diagram (text)

```text
admins ||--o{ refresh_tokens : has
categories ||--o{ products : contains
colors ||--o{ product_colors : mapped
products ||--o{ product_colors : has
products ||--o{ product_images : has
products ||--o{ order_items : includes
orders ||--|{ order_items : contains
```

### Tables

#### `admins`

| Column        | Type        | Constraints                        |
| ------------- | ----------- | ---------------------------------- |
| `id`          | uuid        | PK, default gen_random_uuid()      |
| `email`       | varchar(255)| UNIQUE, NOT NULL                   |
| `passwordHash`| text        | NOT NULL (Argon2id)                |
| `role`        | varchar(50) | NOT NULL, default 'admin'          |
| `createdAt`   | timestamptz | NOT NULL, default now()            |
| `updatedAt`   | timestamptz | NOT NULL, default now()            |

#### `refresh_tokens`

| Column        | Type        | Constraints                        |
| ------------- | ----------- | ---------------------------------- |
| `id`          | uuid        | PK                                 |
| `adminId`     | uuid        | FK → admins(id), ON DELETE CASCADE |
| `tokenHash`   | text        | UNIQUE, NOT NULL                   |
| `expiresAt`   | timestamptz | NOT NULL                           |
| `createdAt`   | timestamptz | NOT NULL, default now()            |
| `revokedAt`   | timestamptz | NULL                               |

Store a SHA-256 hash of the token, not the token itself.

#### `categories`

| Column        | Type         | Constraints                        |
| ------------- | ------------ | ---------------------------------- |
| `id`          | uuid         | PK                                 |
| `name`        | varchar(120) | NOT NULL                           |
| `slug`        | varchar(150) | UNIQUE, NOT NULL                   |
| `sortOrder`   | integer      | NOT NULL, default 0                |
| `createdAt`   | timestamptz  | NOT NULL, default now()            |

#### `colors`

| Column        | Type         | Constraints                        |
| ------------- | ------------ | ---------------------------------- |
| `id`          | uuid         | PK                                 |
| `name`        | varchar(50)  | UNIQUE, NOT NULL                   |
| `hex`         | char(7)      | NOT NULL (e.g., `#070707`)         |
| `createdAt`   | timestamptz  | NOT NULL, default now()            |

#### `products`

| Column        | Type         | Constraints                        |
| ------------- | ------------ | ---------------------------------- |
| `id`          | uuid         | PK                                 |
| `publicId`    | varchar(20)  | UNIQUE, NOT NULL, e.g., `01`       |
| `name`        | varchar(120) | NOT NULL                           |
| `slug`        | varchar(150) | UNIQUE, NOT NULL                   |
| `price`       | integer      | NOT NULL, CHECK > 0                |
| `discount`    | integer      | NOT NULL, default 0, CHECK 0..100  |
| `description` | text         | NOT NULL                           |
| `categoryId`  | uuid         | FK → categories(id)                |
| `inStock`     | boolean      | NOT NULL, default true             |
| `stockCount`  | integer      | NOT NULL, default 0, CHECK >= 0    |
| `sales`       | integer      | NOT NULL, default 0, CHECK >= 0    |
| `isDeleted`   | boolean      | NOT NULL, default false            |
| `searchVector`| tsvector     | Generated from name + description  |
| `createdAt`   | timestamptz  | NOT NULL, default now()            |
| `updatedAt`   | timestamptz  | NOT NULL, default now()            |

`effectivePrice` is computed at query time: `ROUND(price * (1 - discount / 100.0))`.

`publicId` preserves the short, display-friendly ids the frontend already uses.

#### `product_colors` (junction)

| Column        | Type        | Constraints                        |
| ------------- | ----------- | ---------------------------------- |
| `productId`   | uuid        | FK → products(id), ON DELETE CASCADE |
| `colorId`     | uuid        | FK → colors(id), ON DELETE CASCADE |
| PK            | (productId, colorId) |                             |

#### `product_images`

| Column        | Type         | Constraints                        |
| ------------- | ------------ | ---------------------------------- |
| `id`          | uuid         | PK                                 |
| `productId`   | uuid         | FK → products(id), ON DELETE CASCADE |
| `url`         | text         | NOT NULL                           |
| `alt`         | varchar(255) | NOT NULL, default ''               |
| `sortOrder`   | integer      | NOT NULL, default 0                |
| `createdAt`   | timestamptz  | NOT NULL, default now()            |

#### `orders`

| Column          | Type         | Constraints                        |
| --------------- | ------------ | ---------------------------------- |
| `id`            | uuid         | PK                                 |
| `publicId`      | varchar(50)  | UNIQUE, NOT NULL                   |
| `customerName`  | varchar(100) | NOT NULL                           |
| `customerEmail` | varchar(255) | NOT NULL                           |
| `customerPhone` | varchar(20)  | NOT NULL                           |
| `status`        | varchar(50)  | NOT NULL, default 'pending'        |
| `total`         | integer      | NOT NULL, CHECK >= 0               |
| `currency`      | varchar(3)   | NOT NULL, default 'EGP'            |
| `notes`         | text         | NULL                               |
| `createdAt`     | timestamptz  | NOT NULL, default now()            |
| `updatedAt`     | timestamptz  | NOT NULL, default now()            |

#### `order_items`

| Column        | Type         | Constraints                        |
| ------------- | ------------ | ---------------------------------- |
| `id`          | uuid         | PK                                 |
| `orderId`     | uuid         | FK → orders(id), ON DELETE CASCADE |
| `productId`   | uuid         | FK → products(id)                  |
| `productName` | varchar(120) | NOT NULL (snapshot at order time)  |
| `price`       | integer      | NOT NULL (effective price snapshot)|
| `color`       | varchar(50)  | NOT NULL                           |
| `size`        | varchar(10)  | NOT NULL                           |
| `quantity`    | integer      | NOT NULL, CHECK > 0                |
| `lineTotal`   | integer      | NOT NULL, CHECK >= 0               |

### Indexes

```sql
CREATE INDEX idx_products_category ON products(categoryId) WHERE isDeleted = false;
CREATE INDEX idx_products_search ON products USING GIN(searchVector);
CREATE INDEX idx_products_price ON products(price) WHERE isDeleted = false;
CREATE INDEX idx_product_colors_product ON product_colors(productId);
CREATE INDEX idx_product_colors_color ON product_colors(colorId);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(createdAt);
```

---

## 6. Technology Stack

| Layer                  | Technology                                            | Rationale                                                      |
| ---------------------- | ----------------------------------------------------- | -------------------------------------------------------------- |
| Language               | Node.js 22 LTS + TypeScript                           | Same language as frontend tooling; large ecosystem.            |
| Framework              | Express 5 or NestJS 11                                | Express for simplicity; NestJS if the team wants opinionated structure. |
| ORM                    | Prisma 6                                              | Type-safe migrations, queries, and schema management.          |
| Database               | PostgreSQL 16                                         | ACID, full-text search, mature hosting.                        |
| Cache                  | Redis 7                                               | Session/token store, rate-limit counters, catalog cache.       |
| Auth                   | JWT (access) + opaque refresh tokens                  | Stateless access tokens; revocable refresh tokens.             |
| Validation             | Zod                                                   | Shareable schemas between frontend and backend.                |
| Image hosting          | Cloudinary or AWS S3 + CloudFront                     | CDN delivery, image transforms, easy uploads.                  |
| Logging                | Pino                                                  | Fast, structured JSON logs.                                    |
| Monitoring             | OpenTelemetry + Prometheus + Grafana                  | Metrics, traces, and alerting.                                 |
| Testing                | Vitest (unit), Supertest (integration), Playwright (E2E) | Aligns with Vite/Vitest frontend tooling.                  |
| Documentation          | OpenAPI 3.1 (Swagger UI)                              | Auto-generated, interactive docs.                              |
| Containerization       | Docker + Docker Compose                               | Reproducible local and CI environments.                        |
| CI/CD                  | GitHub Actions                                        | Lint, test, build, migrate, deploy.                            |
| Hosting                | Railway / Render / Fly.io / AWS ECS                   | Managed Postgres + Redis; easy deploy from Git.                |

### Package manager

Use `pnpm` to match the frontend workspace policy. The backend can live in a new `apps/api/` directory inside the existing monorepo or in a separate repo. Keeping it in `apps/api/` is recommended so product types can be shared.

---

## 7. Deployment Considerations

### Environment variables

| Variable                | Required | Description                                      |
| ----------------------- | -------- | ------------------------------------------------ |
| `NODE_ENV`              | Yes      | `development`, `staging`, `production`.          |
| `PORT`                  | Yes      | HTTP server port, e.g., `4000`.                  |
| `DATABASE_URL`          | Yes      | PostgreSQL connection string.                    |
| `REDIS_URL`             | Yes      | Redis connection string.                         |
| `JWT_ACCESS_SECRET`     | Yes      | Secret for signing access tokens.                |
| `JWT_REFRESH_SECRET`    | Yes      | Secret for signing refresh token payloads.       |
| `ACCESS_TOKEN_TTL`      | No       | Seconds. Default: `900`.                         |
| `REFRESH_TOKEN_TTL`     | No       | Seconds. Default: `604800` (7 days).             |
| `CORS_ORIGIN`           | Yes      | Frontend origin, e.g., `https://novari.com`.     |
| `RATE_LIMIT_PUBLIC`     | No       | Requests per minute per IP. Default: `100`.      |
| `RATE_LIMIT_ADMIN`      | No       | Requests per minute per admin. Default: `200`.   |
| `CLOUDINARY_CLOUD_NAME` | Yes*     | Required if using Cloudinary.                    |
| `CLOUDINARY_API_KEY`    | Yes*     | Required if using Cloudinary.                    |
| `CLOUDINARY_API_SECRET` | Yes*     | Required if using Cloudinary.                    |
| `LOG_LEVEL`             | No       | `debug`, `info`, `warn`, `error`. Default: `info`. |

### Security best practices

1. **HTTPS only** in production; HSTS header enabled.
2. **CORS** restricted to the known frontend origin.
3. **Helmet** for security headers (CSP, X-Frame-Options, etc.).
4. **Argon2id** for admin password hashing.
5. **Parameterized queries** via Prisma to prevent SQL injection.
6. **Input validation** via Zod on every route.
7. **Rate limiting** on public endpoints and strict limits on login.
8. **JWT secrets** rotated regularly; old secrets accepted during a grace period.
9. **Refresh tokens** hashed (SHA-256) before storage and single-use.
10. **No secrets in logs**; redact tokens and passwords.
11. **SQL migrations** versioned and run in CI/CD before deployment.
12. **File uploads** validated (type, size) and scanned if possible; never store on local disk in production.

### Scaling

- **Horizontal scaling:** Keep the API stateless so multiple containers can share the load.
- **Database connection pooling:** Use PgBouncer or Prisma Accelerate for serverless/concurrent loads.
- **Caching:** Cache `/v1/products`, `/v1/categories`, and `/v1/colors` in Redis with a 5-minute TTL; invalidate on product mutations.
- **CDN:** Serve product images from a CDN with transforms (e.g., `f_auto,q_auto,w_800`).
- **Read replicas:** If read traffic grows, route public catalog queries to read replicas.
- **Rate limiting:** Use Redis-backed rate limiter so limits work across multiple server instances.

### Deployment pipeline

1. **PR checks:** `pnpm lint`, `pnpm test`, `pnpm typecheck`, `pnpm db:migrate:check`.
2. **Build:** Docker image built and pushed to registry.
3. **Staging deploy:** Run migrations, deploy to staging, run smoke tests.
4. **Production deploy:** Blue-green or canary deploy; run migrations before traffic shift.
5. **Rollback:** Keep the previous Docker image tag for instant rollback.

### Health checks

| Endpoint              | Purpose                                       |
| --------------------- | --------------------------------------------- |
| `GET /health`         | Liveness probe; returns `200 { status: "ok" }`. |
| `GET /health/ready`   | Readiness probe; checks DB and Redis connectivity. |
| `GET /health/metrics` | Prometheus metrics (if not on a separate port). |

### Backup & recovery

- Daily automated PostgreSQL snapshots.
- Test restore procedure monthly.
- Point-in-time recovery enabled on managed Postgres.

---

## 8. Frontend Migration Notes

1. **Replace `src/data/products.ts`** with a `useProducts` hook that calls `GET /v1/products`.
2. **Replace `getProductById`** with `GET /v1/products/:id`.
3. **Replace hard-coded `COLOR_OPTIONS`** with `GET /v1/colors`.
4. **Replace hard-coded categories** with `GET /v1/categories`.
5. **Replace `src/data/admin.ts`** with `POST /v1/admin/login` and token storage in `httpOnly` cookies or secure local storage.
6. **Replace `useAdminProducts` seed data** with `GET /v1/admin/products` and mutations (`PATCH`, `POST /toggle-color`).
7. **Replace `calculateAdminStats`** with `GET /v1/admin/stats`.
8. **Cart checkout** should call `POST /v1/orders`.

---

## 9. OpenAPI Skeleton

```yaml
openapi: 3.1.0
info:
  title: Novari API
  version: 1.0.0
servers:
  - url: https://api.novari.com/v1
paths:
  /products:
    get:
      summary: List products
      parameters:
        - name: category
          in: query
          schema: { type: string }
        - name: color
          in: query
          schema: { type: string }
        - name: minPrice
          in: query
          schema: { type: integer }
        - name: maxPrice
          in: query
          schema: { type: integer }
        - name: q
          in: query
          schema: { type: string }
        - name: page
          in: query
          schema: { type: integer, default: 1 }
        - name: limit
          in: query
          schema: { type: integer, default: 20, maximum: 100 }
      responses:
        '200':
          description: Paginated product list
          content:
            application/json:
              schema:
                type: object
                properties:
                  data: { type: array, items: { $ref: '#/components/schemas/Product' } }
                  pagination: { $ref: '#/components/schemas/Pagination' }
  /products/{id}:
    get:
      summary: Get product by id
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string }
      responses:
        '200':
          description: Product details
          content:
            application/json:
              schema:
                type: object
                properties:
                  data: { $ref: '#/components/schemas/Product' }
        '404': { $ref: '#/components/responses/NotFound' }
  /admin/login:
    post:
      summary: Admin login
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email: { type: string, format: email }
                password: { type: string, minLength: 12 }
              required: [email, password]
      responses:
        '200':
          description: Tokens and admin info
        '401': { $ref: '#/components/responses/Unauthorized' }
  /admin/products:
    get:
      summary: List admin products
      security: [bearerAuth: []]
      responses:
        '200': { description: Paginated admin product list }
    post:
      summary: Create product
      security: [bearerAuth: []]
      responses:
        '201': { description: Product created }
  /admin/products/{id}:
    patch:
      summary: Update product
      security: [bearerAuth: []]
      responses:
        '200': { description: Product updated }
    delete:
      summary: Delete product
      security: [bearerAuth: []]
      responses:
        '204': { description: Product deleted }
  /admin/products/{id}/toggle-color:
    post:
      summary: Toggle product color
      security: [bearerAuth: []]
      responses:
        '200': { description: Color toggled }
  /admin/stats:
    get:
      summary: Admin dashboard stats
      security: [bearerAuth: []]
      responses:
        '200': { description: Stats object }
  /orders:
    post:
      summary: Submit order
      responses:
        '201': { description: Order created }

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  schemas:
    Product:
      type: object
      properties:
        id: { type: string }
        name: { type: string }
        slug: { type: string }
        price: { type: integer }
        discount: { type: integer }
        effectivePrice: { type: integer }
        description: { type: string }
        images: { type: array, items: { type: object } }
        category: { type: object }
        colors: { type: array, items: { type: object } }
    Pagination:
      type: object
      properties:
        page: { type: integer }
        limit: { type: integer }
        totalItems: { type: integer }
        totalPages: { type: integer }
        hasNextPage: { type: boolean }
        hasPrevPage: { type: boolean }
  responses:
    NotFound:
      description: Resource not found
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                type: object
                properties:
                  code: { type: string }
                  message: { type: string }
    Unauthorized:
      description: Unauthorized
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                type: object
                properties:
                  code: { type: string }
                  message: { type: string }
```

---

## 10. Versioning & Future Changes

### Likely changes within 12 months

1. **Payment integration:** `/v1/orders` will gain a `paymentProvider` field and webhooks. This can be added as new fields without breaking existing clients.
2. **Product variants:** Products may move from flat `price`/`stockCount` to size/color variant matrices. This will require a v2 product model because the response shape changes structurally.

### Strategy

- Additive changes (new fields, new endpoints, new query params) ship under `/v1`.
- Breaking structural changes (variant matrices, removed fields) ship under `/v2` with a 6-month deprecation notice for `/v1`.
- Clients should check the `Sunset` HTTP header on deprecated endpoints.
