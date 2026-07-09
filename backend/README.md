# Algo Search — Backend API

A Node.js + Express + MongoDB REST API powering the Coding Problem Search Engine.  
Full-text search is implemented with a custom TF-IDF engine; results exclude private `algozenith` problems.

---

## Table of Contents

1. [Quick Start](#1-quick-start)
2. [Environment Variables](#2-environment-variables)
3. [Scripts](#3-scripts)
4. [Project Structure](#4-project-structure)
5. [Authentication](#5-authentication)
6. [Rate Limits & Caching](#6-rate-limits--caching)
7. [API Reference](#7-api-reference)
   - [Auth Endpoints](#auth-endpoints)
   - [Problem Endpoints](#problem-endpoints)
8. [Running Tests](#8-running-tests)
9. [Seeding the Database](#9-seeding-the-database)

---

## 1. Quick Start

```bash
# 1. Enter the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create your .env file from the example
cp .env.example .env
# Edit .env and fill in MONGO_URI and JWT_SECRET

# 4. Seed the database with sample problems (~45 problems)
npm run seed

# 5. Start the dev server (hot-reload via nodemon)
npm run dev
```

The API will be available at **http://localhost:5000**.  
Health check: **GET http://localhost:5000/health**

---

## 2. Environment Variables

Copy `.env.example` to `.env` and update values:

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port to listen on | `5000` |
| `NODE_ENV` | Runtime environment | `development` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/algo-search` |
| `JWT_SECRET` | Secret key for signing JWTs | `change-me-in-production` |
| `JWT_EXPIRES_IN` | JWT expiry duration | `7d` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:3000` |

---

## 3. Scripts

| Command | Description |
|---|---|
| `npm start` | Run production server (`node server.js`) |
| `npm run dev` | Run dev server with nodemon (hot-reload) |
| `npm test` | Run all Jest tests with coverage |
| `npm run seed` | Clear Problems collection and insert sample data |

---

## 4. Project Structure

```
backend/
├── src/
│   ├── config/db.js          # Mongoose connection
│   ├── models/
│   │   ├── Problem.js        # Problem schema + text index
│   │   └── User.js           # User schema + bcrypt hooks
│   ├── controllers/
│   │   ├── problemController.js
│   │   └── authController.js
│   ├── routes/
│   │   ├── problemRoutes.js
│   │   └── authRoutes.js
│   ├── middleware/
│   │   ├── auth.js           # JWT verify → req.user
│   │   ├── rateLimiter.js    # express-rate-limit configs
│   │   ├── cache.js          # node-cache GET caching
│   │   └── errorHandler.js   # Centralised error + asyncHandler
│   ├── services/
│   │   ├── tfidfService.js   # TF-IDF index + cosine similarity
│   │   └── seedData.js       # DB seed script
│   ├── utils/validators.js   # express-validator rule sets
│   └── app.js                # Express app config
├── tests/
│   ├── helpers/dbHelper.js   # mongodb-memory-server helpers
│   ├── problems.test.js
│   ├── auth.test.js
│   └── security.test.js
├── server.js                 # Entry point
├── .env.example
├── .gitignore
└── package.json
```

---

## 5. Authentication

- **Mechanism**: JWT (JSON Web Token)
- **Header**: `Authorization: Bearer <token>`
- Tokens are returned by `/api/auth/register` and `/api/auth/login`.
- Protected routes require a valid token; admin-only routes additionally require `role: "admin"`.

---

## 6. Rate Limits & Caching

### Rate Limits

| Limiter | Applied To | Max Requests | Window |
|---|---|---|---|
| `apiLimiter` | All `/api/*` routes | 100 | 15 minutes |
| `authLimiter` | `POST /api/auth/login` | 5 | 15 minutes |
| `searchLimiter` | `GET /api/problems/search` | 50 | 15 minutes |

When a limit is exceeded the API returns **HTTP 429** with:
```json
{ "success": false, "message": "Too many requests ...", "error": "Rate limit exceeded" }
```

### Caching

- **Library**: `node-cache` (in-process, LRU-style)
- **TTL**: Search results cached for **5 minutes** (300 s); list cached for **2 minutes**.
- **Cache key**: Full request URL including query string.
- **Invalidation**: Any `POST`, `PUT`, or `DELETE` to `/api/problems` clears all problem-related cache keys.

---

## 7. API Reference

All successful responses follow:
```json
{ "success": true, "data": <payload>, "message": "..." }
```
All error responses follow:
```json
{ "success": false, "message": "Human readable error", "error": "..." }
```

---

### Auth Endpoints

#### `POST /api/auth/register`

Register a new user.

- **Auth required**: No
- **Body**:

| Field | Type | Rules |
|---|---|---|
| `name` | String | 2–50 chars |
| `email` | String | Valid email |
| `password` | String | ≥6 chars, must contain uppercase, lowercase, and digit |

**Example request**:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"Secret1"}'
```

**Example response** (`201 Created`):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "64abc123...",
      "name": "Alice",
      "email": "alice@example.com",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

#### `POST /api/auth/login`

Login with email and password. **Rate limited to 5 requests / 15 min per IP.**

- **Auth required**: No
- **Body**:

| Field | Type |
|---|---|
| `email` | String |
| `password` | String |

**Example request**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"Secret1"}'
```

**Example response** (`200 OK`):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": "...", "name": "Alice", "email": "alice@example.com", "role": "user" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Failure** (`401 Unauthorized`):
```json
{ "success": false, "message": "Invalid email or password" }
```

---

#### `GET /api/auth/me`

Get the currently authenticated user's profile.

- **Auth required**: Yes (`Bearer <token>`)

**Example request**:
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Example response** (`200 OK`):
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "name": "Alice", "email": "alice@example.com", "role": "user" }
  }
}
```

---

### Problem Endpoints

#### `GET /api/problems`

List all problems (paginated). Excludes `source: "algozenith"` problems.

- **Auth required**: No
- **Query params**:

| Param | Type | Description |
|---|---|---|
| `page` | Integer | Page number (default: 1) |
| `limit` | Integer | Items per page (default: 10, max: 100) |
| `difficulty` | String | Filter: `Easy`, `Medium`, or `Hard` |
| `platform` | String | Filter: `LeetCode`, `CodeChef`, `Codeforces` |
| `tags` | String | Filter by tag name |

**Example request**:
```bash
curl "http://localhost:5000/api/problems?page=1&limit=5&difficulty=Easy"
```

**Example response** (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "64abc...",
      "title": "Two Sum",
      "platform": "LeetCode",
      "difficulty": "Easy",
      "tags": ["Array", "Hash Table"],
      "url": "https://leetcode.com/problems/two-sum/",
      "description": "...",
      "constraints": "...",
      "examples": [{ "input": "...", "output": "..." }],
      "source": "scraped",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": { "page": 1, "limit": 5, "total": 45, "pages": 9 }
}
```

---

#### `GET /api/problems/search`

Search problems using TF-IDF ranking. **Cached for 5 min. Rate limited to 50/15 min.**

- **Auth required**: No
- **Query params**:

| Param | Type | Description |
|---|---|---|
| `q` | String | Search query (1–100 chars) |
| `difficulty` | String | Filter: `Easy`/`Medium`/`Hard` |
| `platform` | String | Filter: `LeetCode`/`CodeChef`/`Codeforces` |
| `tags` | String | Filter by tag |
| `page` | Integer | Page (default: 1) |
| `limit` | Integer | Per page (default: 10) |

**Example request**:
```bash
curl "http://localhost:5000/api/problems/search?q=dynamic+programming&difficulty=Medium&page=1&limit=5"
```

**Example response** (`200 OK`):
```json
{
  "success": true,
  "data": [ { "id": "...", "title": "Climbing Stairs", ... } ],
  "pagination": { "page": 1, "limit": 5, "total": 12, "pages": 3 }
}
```

---

#### `GET /api/problems/tags`

Get a sorted list of all distinct tags (for frontend filter UI). **Cached for 5 min.**

- **Auth required**: No

**Example request**:
```bash
curl http://localhost:5000/api/problems/tags
```

**Example response** (`200 OK`):
```json
{
  "success": true,
  "data": ["Array", "Binary Search", "BFS", "DFS", "Dynamic Programming", "Graph", ...]
}
```

---

#### `GET /api/problems/:id`

Get a single problem by its MongoDB ID, plus up to 4 related problems sharing tags.

- **Auth required**: No

**Example request**:
```bash
curl http://localhost:5000/api/problems/64abc123def456
```

**Example response** (`200 OK`):
```json
{
  "success": true,
  "data": {
    "problem": { "id": "64abc...", "title": "Two Sum", ... },
    "relatedProblems": [
      { "id": "64def...", "title": "Three Sum", ... }
    ]
  }
}
```

**Not found** (`404`):
```json
{ "success": false, "message": "Problem not found" }
```

---

#### `POST /api/problems`

Create a new problem. **Admin only.**

- **Auth required**: Yes — `Bearer <token>` with `role: "admin"`
- **Body** (all fields required unless noted):

| Field | Type | Description |
|---|---|---|
| `title` | String | 3–200 chars |
| `platform` | String | `LeetCode` / `CodeChef` / `Codeforces` |
| `difficulty` | String | `Easy` / `Medium` / `Hard` |
| `tags` | String[] | Min 1 tag |
| `url` | String | Valid URL |
| `description` | String | Min 10 chars |
| `constraints` | String | Problem constraints |
| `examples` | Object[] | `[{ input, output }]` min 1 |
| `source` | String | Optional: `scraped` (default) or `algozenith` |

**Example request**:
```bash
curl -X POST http://localhost:5000/api/problems \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Problem",
    "platform": "LeetCode",
    "difficulty": "Medium",
    "tags": ["Array"],
    "url": "https://leetcode.com/problems/new/",
    "description": "Solve this interesting array problem.",
    "constraints": "1 <= n <= 10^5",
    "examples": [{ "input": "[1,2,3]", "output": "6" }]
  }'
```

**Example response** (`201 Created`):
```json
{
  "success": true,
  "message": "Problem created successfully",
  "data": { "id": "...", "title": "New Problem", ... }
}
```

---

#### `PUT /api/problems/:id`

Update a problem. **Admin only.** Same body as POST (all fields validated).

- **Auth required**: Yes — `Bearer <token>` with `role: "admin"`

**Example response** (`200 OK`):
```json
{
  "success": true,
  "message": "Problem updated successfully",
  "data": { "id": "...", "title": "Updated Title", ... }
}
```

---

#### `DELETE /api/problems/:id`

Delete a problem. **Admin only.**

- **Auth required**: Yes — `Bearer <token>` with `role: "admin"`

**Example response** (`200 OK`):
```json
{
  "success": true,
  "message": "Problem deleted successfully",
  "data": {}
}
```

---

## 8. Running Tests

Tests use **Jest** + **Supertest** with an in-memory MongoDB instance (`mongodb-memory-server`) — no real database is required.

```bash
# Run all tests once with coverage report
npm test

# Watch mode (reruns on file changes)
npm run test:watch
```

Test files are located in `tests/`:

| File | What it tests |
|---|---|
| `problems.test.js` | `GET /api/problems` — pagination, filters, algozenith exclusion; `GET /api/problems/search` — TF-IDF, filters |
| `auth.test.js` | Register (success + duplicate + bad data); Login (success + wrong password + missing fields); `GET /api/auth/me` |
| `security.test.js` | Protected routes return 401 without JWT; rate limiter returns 429 after limit |

---

## 9. Seeding the Database

```bash
npm run seed
```

This will:
1. Connect to the MongoDB specified in `MONGO_URI`
2. Drop the existing `problems` collection
3. Insert **~45 realistic sample problems** across LeetCode, CodeChef, and Codeforces covering Easy/Medium/Hard difficulty and a wide variety of tags (Array, DP, Graph, Trees, etc.)

The seed data mirrors the structure of the frontend's mock `data.js` so the two integrate cleanly.

> **Note**: The seed script requires a running MongoDB instance and a valid `.env` file.
