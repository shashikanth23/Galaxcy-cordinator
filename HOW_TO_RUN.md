# 🌌 Galaxcy Coordinator — Complete Setup & Run Guide

---

## ⚡ FASTEST START (3 commands)

```bash
# 1. Enter the project folder
cd galaxcy

# 2. Run automated setup (installs everything, starts databases, seeds data)
./setup.sh

# 3. Start the app
./start.sh
```

Open **http://localhost:5173** in your browser 🎉

---

## 📋 PREREQUISITES (Install these first)

### 1. Node.js v20+
```bash
# Check if installed:
node -v   # Should show v20.x.x or higher

# Install if missing:
# Windows/Mac: https://nodejs.org/en/download
# Ubuntu/Debian:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2. Docker Desktop (for databases — easiest option)
```bash
# Download: https://www.docker.com/products/docker-desktop/
# After install, verify:
docker --version
docker compose version
```

### 3. API Keys (free to get)

| Key | Where to get | Required? |
|-----|-------------|-----------|
| `NASA_API_KEY` | https://api.nasa.gov/ (click "Generate API Key") | Optional (DEMO_KEY works) |
| `ANTHROPIC_API_KEY` | https://console.anthropic.com/ | Required for AI assistant |
| `JWT_SECRET` | Any random string 32+ chars | Required |

---

## 🔧 STEP-BY-STEP SETUP

### Step 1 — Get the project ready
```bash
cd galaxcy
```

### Step 2 — Set up environment variables
```bash
cp backend/.env.example backend/.env
```

Now open `backend/.env` in any text editor and fill in:
```env
JWT_SECRET=any-random-string-at-least-32-characters-long
NASA_API_KEY=DEMO_KEY                    # or your real key from api.nasa.gov
ANTHROPIC_API_KEY=sk-ant-your-key-here  # from console.anthropic.com
```

### Step 3 — Start databases
```bash
# With Docker (recommended):
docker compose up -d postgres redis

# Verify they're running:
docker compose ps
```

### Step 4 — Install and set up backend
```bash
cd backend
npm install                    # Install packages (~2 min)
npx prisma generate            # Generate database client
npx prisma db push             # Create database tables
npx tsx prisma/seed.ts         # Add sample data
```

### Step 5 — Install frontend
```bash
cd ../frontend
npm install                    # Install packages (~2 min)
```

### Step 6 — Start the app

**Option A — Use the script (easiest):**
```bash
cd ..
./start.sh
```

**Option B — Two separate terminals:**
```bash
# Terminal 1 (Backend):
cd backend
npm run dev
# Should show: 🚀 Galaxcy API running on port 4000

# Terminal 2 (Frontend):
cd frontend
npm run dev
# Should show: http://localhost:5173/
```

### Step 7 — Open in browser
Visit **http://localhost:5173**

---

## 🪟 WINDOWS USERS

Windows requires slightly different commands:

```powershell
# Copy env file
copy backend\.env.example backend\.env

# Edit backend\.env in Notepad
notepad backend\.env

# Install & setup backend
cd backend
npm install
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts

# Start backend (PowerShell 1)
npm run dev

# Install & start frontend (PowerShell 2)
cd ..\frontend
npm install
npm run dev
```

For Docker on Windows: install **Docker Desktop** and use **WSL2 backend**.

---

## 🍎 MAC USERS

```bash
# Install Node.js via Homebrew (if not installed)
brew install node

# Install Docker Desktop from docker.com
# OR install PostgreSQL and Redis via brew:
brew install postgresql@16 redis
brew services start postgresql@16
brew services start redis

# Then follow the Linux steps above
```

---

## 🐳 DOCKER-ONLY (Full stack in containers)

Run everything including the backend in Docker:

```bash
# Copy and edit env
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys

# Build and start everything
docker compose up -d

# Run migrations (first time only)
docker compose exec backend npx prisma db push
docker compose exec backend npx tsx prisma/seed.ts

# View logs
docker compose logs -f backend
```

---

## 🔍 VERIFY IT'S WORKING

After starting, check these URLs:

| URL | What you should see |
|-----|-------------------|
| http://localhost:5173 | Galaxcy app homepage |
| http://localhost:4000/health | `{"status":"ok","timestamp":"..."}` |
| http://localhost:4000/api/nasa/apod | Today's astronomy picture data |
| http://localhost:4000/api/events | Space events list |

---

## 🗄️ DATABASE MANAGEMENT

```bash
# View database in browser GUI:
cd backend
npx prisma studio
# Opens at http://localhost:5555

# Reset database (wipe and re-seed):
npx prisma db push --force-reset
npx tsx prisma/seed.ts

# Add a migration after schema changes:
npx prisma migrate dev --name your-change-name
```

---

## 🐛 TROUBLESHOOTING

### "Cannot connect to database"
```bash
# Check if Docker containers are running:
docker compose ps

# Restart databases:
docker compose restart postgres redis

# Check DATABASE_URL in backend/.env:
cat backend/.env | grep DATABASE_URL
```

### "Port 4000 already in use"
```bash
# Find and kill the process:
lsof -ti:4000 | xargs kill -9    # Mac/Linux
netstat -ano | findstr :4000      # Windows (find PID, then taskkill /PID xxxx /F)
```

### "Port 5173 already in use"
```bash
lsof -ti:5173 | xargs kill -9
```

### Frontend can't connect to API
```bash
# Check frontend/.env:
cat frontend/.env
# Should contain: VITE_API_URL=http://localhost:4000/api

# Check backend is actually running:
curl http://localhost:4000/health
```

### AI assistant not working
- Ensure `ANTHROPIC_API_KEY` is set in `backend/.env`
- Must be logged in (create an account first)
- Check backend logs: `cd backend && npm run dev`

### NASA data not loading
- `NASA_API_KEY=DEMO_KEY` works but has rate limits (30 req/hour)
- Get a free key at https://api.nasa.gov/ for higher limits

### Prisma errors
```bash
cd backend
npx prisma generate          # Regenerate client
npx prisma db push           # Sync schema
```

---

## 📱 INSTALL AS MOBILE APP (PWA)

1. Open **http://localhost:5173** in Chrome/Safari on your phone
2. Tap the **Share** button (iOS) or **Menu** button (Android)
3. Tap **"Add to Home Screen"**
4. Galaxcy appears as an app on your home screen!

---

## 🏗️ PROJECT STRUCTURE QUICK REFERENCE

```
galaxcy/
├── setup.sh          ← Run first (one-time setup)
├── start.sh          ← Run to start the app
├── stop.sh           ← Run to stop everything
├── docker-compose.yml
│
├── frontend/         ← React app (port 5173)
│   ├── src/
│   │   ├── pages/    ← Home, Map, SkyFinder, Search...
│   │   ├── components/
│   │   ├── api/      ← API calls to backend
│   │   └── store/    ← Zustand state
│   └── package.json
│
└── backend/          ← Node.js API (port 4000)
    ├── src/
    │   ├── routes/   ← auth, celestial, nasa, ai...
    │   ├── middleware/
    │   └── jobs/     ← background workers
    ├── prisma/
    │   ├── schema.prisma   ← database schema
    │   └── seed.ts         ← sample data
    └── package.json
```

---

## 🚀 DEPLOY TO PRODUCTION

### Frontend → Vercel (free)
```bash
cd frontend
npm run build          # Creates dist/ folder
# Push to GitHub, connect repo to vercel.com
# Vercel auto-deploys on every push
```

### Backend → Railway (free tier)
```bash
# 1. Push code to GitHub
# 2. Go to railway.app → New Project → Deploy from GitHub
# 3. Add environment variables in Railway dashboard
# 4. Railway auto-detects Node.js and deploys
```

### Database → Supabase (free PostgreSQL)
```bash
# 1. Create project at supabase.com
# 2. Get connection string
# 3. Update DATABASE_URL in backend/.env (or Railway env vars)
```

---

## 📞 QUICK COMMAND REFERENCE

```bash
./setup.sh           # First-time setup (run once)
./start.sh           # Start everything
./stop.sh            # Stop everything

# Backend commands (in backend/ folder)
npm run dev          # Start with hot reload
npm run build        # Build for production
npm run db:studio    # Open database GUI
npm run db:seed      # Re-seed sample data

# Frontend commands (in frontend/ folder)
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

---

*Built with ❤️ | React · Node.js · PostgreSQL · Three.js · NASA APIs · Claude AI*
