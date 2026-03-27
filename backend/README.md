# Backend for AI Planner

Simple Express API with MongoDB.

## Setup

1. Copy `.env` from example or create with `MONGO_URI` and `JWT_SECRET`.
2. `npm install` to fetch dependencies.
3. `npm start` to run server.

## Routes
- `POST /api/auth/register` — register user
- `POST /api/auth/login` — login, returns token
- `POST /api/study` (protected) — save study plan
- `GET /api/study` (protected) — fetch user's plan
- `POST /api/session` (protected) — save focus session
- `GET /api/session` (protected) — fetch sessions

JWT is expected in `Authorization: Bearer <token>`.
