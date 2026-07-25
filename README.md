# 🌌 Galaxcy Coordinator

> Production-ready space exploration PWA — explore the universe from your smartphone

![Galaxcy Banner](https://img.shields.io/badge/Galaxcy-Space%20Explorer-00d4ff?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🗺️ **Interactive 3D Space Map** | Three.js solar system with real planet orbits |
| 🔭 **Sky Finder** | GPS-based sky view with ISS pass predictions |
| 🔍 **Celestial Search** | Search stars, galaxies, nebulae, black holes |
| 🌌 **Galaxy Explorer** | Deep-dive into major galaxies |
| 🪐 **Planet Database** | Full solar system data and orbit simulations |
| 🚀 **NASA Live Feed** | APOD, Near-Earth Objects, Mars Rover, Space Weather |
| 🤖 **AI Astronomy Assistant** | Claude-powered streaming chatbot |
| 📅 **Space Events** | Meteor showers, eclipses, launches, alignments |
| 🧪 **Space Quizzes** | Test your astronomy knowledge |
| 🔔 **Real-time Notifications** | ISS passes, rare events via WebSocket |
| 👤 **User Accounts** | Favorites, watchlists, observation logs |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- NASA API Key (free at https://api.nasa.gov)
- Anthropic API Key (for AI assistant)

---

### Option A — Docker (Recommended, easiest)

```bash
# 1. Clone and enter project
cd galaxcy

# 2. Copy environment files
cp backend/.env.example backend/.env

# 3. Edit backend/.env — add your API keys:
#    NASA_API_KEY=your_key
#    ANTHROPIC_API_KEY=sk-ant-...
#    JWT_SECRET=your-random-32-char-secret

# 4. Start all services (PostgreSQL + Redis + Backend)
docker-compose up -d

# 5. Run database migrations and seed
docker exec galaxcy_backend npx prisma migrate deploy
docker exec galaxcy_backend npx tsx prisma/seed.ts

# 6. Start frontend (in a new terminal)
cd frontend
cp .env.example .env
npm install
npm run dev

# 7. Open http://localhost:5173 🎉
```

---

### Option B — Manual Setup

#### Step 1 — Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (new terminal)
cd frontend
npm install
```

#### Step 2 — Setup PostgreSQL

```bash
# With Docker (easiest)
docker run -d \
  --name galaxcy_postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=galaxcy_secret \
  -e POSTGRES_DB=galaxcy \
  -p 5432:5432 \
  postgres:16-alpine

# Or use any PostgreSQL 14+ instance
```

#### Step 3 — Setup Redis

```bash
docker run -d \
  --name galaxcy_redis \
  -p 6379:6379 \
  redis:7-alpine
```

#### Step 4 — Configure Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your values:
```

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://postgres:galaxcy_secret@localhost:5432/galaxcy
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production-32chars
NASA_API_KEY=DEMO_KEY          # Get free key at https://api.nasa.gov/
ANTHROPIC_API_KEY=sk-ant-...   # Get at https://console.anthropic.com/
GOOGLE_CLIENT_ID=              # Optional: for Google OAuth
FRONTEND_URL=http://localhost:5173
```

#### Step 5 — Database Setup

```bash
cd backend

# Generate Prisma client
npm run db:generate

# Run migrations (creates all tables)
npm run db:migrate

# Seed with sample data
npm run db:seed
```

#### Step 6 — Start Backend

```bash
cd backend
npm run dev
# API running at http://localhost:4000
# Health check: http://localhost:4000/health
```

#### Step 7 — Configure & Start Frontend

```bash
cd frontend
cp .env.example .env
# .env:
# VITE_API_URL=http://localhost:4000/api

npm run dev
# App running at http://localhost:5173
```

---

## 📁 Project Structure

```
galaxcy/
├── frontend/          # React 18 PWA
│   └── src/
│       ├── pages/     # Route components
│       ├── components/# Shared UI
│       ├── api/       # API client
│       ├── store/     # Zustand state
│       └── lib/       # Utilities
├── backend/           # Node.js API
│   └── src/
│       ├── routes/    # Express routes
│       ├── middleware/ # Auth, validation
│       ├── jobs/      # Background workers
│       ├── websocket/ # Socket.io
│       └── lib/       # Prisma, Redis, Logger
└── docker-compose.yml # Full stack setup
```

---

## 🔑 API Keys Required

| Service | URL | Free Tier |
|---|---|---|
| NASA API | https://api.nasa.gov/ | ✅ 1000 req/hour |
| Anthropic | https://console.anthropic.com/ | 💳 Pay per use |
| Google OAuth | https://console.cloud.google.com/ | ✅ Free |

---

## 🌐 API Endpoints

```
GET  /health                    — Health check
POST /api/auth/register         — Register
POST /api/auth/login            — Login
POST /api/auth/google           — Google OAuth
GET  /api/auth/me               — Current user

GET  /api/celestial/search      — Search objects (?q=&type=&page=)
GET  /api/celestial/featured/objects — Featured objects
GET  /api/celestial/:slug       — Object detail
POST /api/celestial/:id/favorite — Toggle favorite

GET  /api/nasa/apod             — Astronomy Picture of the Day
GET  /api/nasa/neo              — Near-Earth Objects
GET  /api/nasa/mars-rover       — Mars rover photos
GET  /api/nasa/space-weather    — Space weather
GET  /api/nasa/iss              — ISS live position
GET  /api/nasa/iss/passes       — ISS pass times (?lat=&lon=)

GET  /api/events                — Space events
GET  /api/events/upcoming       — Next 5 events
POST /api/ai/chat               — AI assistant (streaming SSE)

GET  /api/user/favorites        — User favorites
GET  /api/user/observations     — Observation log
GET  /api/user/watchlists       — Watchlists

GET  /api/quizzes               — Available quizzes
POST /api/quizzes/:id/submit    — Submit answers
```

---

## 🚀 Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Deploy dist/ to Vercel, Netlify, or any static host
```

### Backend → Railway / Render
```bash
# Set environment variables in Railway/Render dashboard
# Deploy from GitHub
# Railway detects Node.js automatically
```

### Full Stack → Docker
```bash
docker-compose -f docker-compose.yml up -d
```

---

## 🛠 Development Scripts

```bash
# Backend
npm run dev          # Dev server with hot reload
npm run build        # TypeScript compile
npm run db:studio    # Prisma Studio GUI
npm run db:seed      # Reseed database

# Frontend
npm run dev          # Vite dev server
npm run build        # Production build
npm run preview      # Preview production build
```

---

## 📱 PWA Features
- ✅ Installable on Android/iOS
- ✅ Offline caching (Workbox)
- ✅ Background sync
- ✅ Push notifications (via WebSocket)
- ✅ Mobile-first responsive UI

---

## 🏗 Tech Stack

**Frontend:** React 18 · TypeScript · Tailwind CSS · Three.js · React Three Fiber · Framer Motion · Zustand · React Query · Vite · PWA

**Backend:** Node.js 20 · Express.js · TypeScript · Prisma ORM · PostgreSQL · Redis · Socket.io · BullMQ · Anthropic SDK

**APIs:** NASA Open API · Open Notify (ISS) · Anthropic Claude

---

Built with ❤️ by Galaxcy Team
