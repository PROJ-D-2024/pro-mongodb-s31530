# MongoDB Assignment — PRO Organization

**Language:** English  
**Scope:** MongoDB data modeling, CRUD, indexing, aggregation, simple API, and deployment basics  
**Publish target:** New GitHub repository under the `PRO` organization

---

## 🎯 Learning Objectives
By the end of this assignment, you will be able to:
1. Design a document schema for a real-world domain using MongoDB.
2. Implement CRUD operations and basic validation (using Mongoose or native driver).
3. Create useful indexes and measure their impact.
4. Write non-trivial aggregation pipelines.
5. Expose a minimal REST API for your data model.
6. Seed realistic test data.
7. Document and automate using GitHub Actions.

---

## 🧪 Project Theme (choose one)
Pick **one** domain and stick to it throughout the assignment:
- **BookHub** — books, authors, reviews, users
- **MovieCritic** — movies, directors, actors, ratings, users
- **ShopSmart** — products, categories, orders, customers
- **SocialLite** — users, posts, comments, reactions

You may adapt field names to your taste, but keep the required features below.

---

## ✅ Requirements

### 1) Data Model
- Define at least **3 collections** with meaningful references or embeddings.
- Use **Mongoose** (recommended) or the native Node.js MongoDB driver.
- Include validation rules (required fields, enums, min/max, custom validators).

### 2) CRUD + API
- Implement endpoints for **create/read/update/delete** for the core entity (e.g., `books`, `movies`, `products`, or `posts`).  
- Provide **query filters** (e.g., `?q=`, `?minRating=`, `?category=`).  
- Implement **pagination** (`limit`, `page`) and **sorting** (`sort` by field, asc/desc).

### 3) Indexing
- Create at least **3 indexes** (compound index counts as 1). Explain each in the README and why it helps.
- Demonstrate impact using `explain()` output before/after (paste screenshots or JSON snippets in the repo).

### 4) Aggregations
- Create at least **2 pipelines** doing something non-trivial, e.g.:
  - Top N items by average rating in last 90 days
  - Average order value per customer segment
  - Most active users per week
  - Text search ranks (if using text index)
- Expose them via `/analytics/*` endpoints or run from a script.

### 5) Seeding
- Provide a `npm run seed` script that inserts **>=200** realistic documents across collections.

### 6) Tests & Lint
- Add at least **1 unit test** and **1 request-level test** (can be against a local MongoDB or mocked).  
- Include ESLint with a standard config and make CI pass.

### 7) Docs
- Update this README:
  - Data model diagram or description
  - Indexes list and justification
  - Aggregation descriptions
  - Example requests & responses
  - Local dev & Docker instructions
  - Performance notes (briefly)

### 8) CI
- GitHub Actions workflow that runs `npm ci`, `npm run lint`, and `npm test` on pushes and PRs.

---

## 📦 Provided Starter
This repo includes:
- `docker-compose.yml` — local MongoDB (no auth) + Mongo Express
- Minimal **Express + Mongoose** API with `User` and `Review` examples
- Seed script
- Jest + Supertest baseline
- ESLint config
- GitHub Actions workflow

> Replace the example domain with your chosen one as you implement the full solution.

---

## 🚀 Quick Start

### 1) Local (Node 18+)
```bash
cp .env.example .env
npm ci
npm run dev
```

### 2) With Docker (recommended)
```bash
docker compose up -d
# MongoDB:   mongodb://localhost:27017
# Mongo-Express UI: http://localhost:8081
```

### 3) Seed data
```bash
npm run seed
```

### 4) Example requests
```bash
# Health
curl http://localhost:3000/health

# Users (CRUD)
curl -X POST http://localhost:3000/users -H 'Content-Type: application/json' -d '{"email":"a@b.com","name":"Alice"}'
curl http://localhost:3000/users?q=ali&limit=5&page=1&sort=name:asc
curl -X PATCH http://localhost:3000/users/<id> -H 'Content-Type: application/json' -d '{"name":"Alice L."}'
curl -X DELETE http://localhost:3000/users/<id>

# Analytics (example aggregation)
curl http://localhost:3000/analytics/top-reviewers?limit=5
```

---

## 🧰 Scripts
```bash
npm run dev       # start with nodemon
npm run start     # start production
npm run seed      # seed sample data
npm run lint      # run eslint
npm test          # run tests
```

---

## 🗃️ MongoDB Connection
- Default URL: `mongodb://localhost:27017/pro_assignment`
- Override via env var: `MONGODB_URI`

---
