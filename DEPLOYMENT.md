# WellSync Vaxi - Deployment Setup & Requirements

## 🚀 Quick Start

```bash
# Test locally
docker-compose up -d

# Access services
Frontend: http://localhost:3000
Backend: http://localhost:8000/health
API Docs: http://localhost:8000/docs
```

## 📋 What Was Added

### Docker & Containerization
- `docker-compose.yml` - Local development
- `Backend/Dockerfile` - Production backend
- `Frontend/Dockerfile` - Production frontend
- `.dockerignore` files - Build optimization

### CI/CD Pipelines
- `.github/workflows/security.yml` - Security scanning
- `.github/workflows/backend.yml` - Backend tests & build
- `.github/workflows/frontend.yml` - Frontend build

### Application Hardening
- `Backend/app/core/health.py` - Health checks & validation
- Updated `Backend/app/main.py` - Startup validation

### Environment Templates
- `Backend/.env.example` - Backend configuration template
- `Frontend/.env.example` - Frontend configuration template

## 🔧 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql+asyncpg://...
GITHUB_TOKEN=github_pat_...
GOOGLE_AI_API_KEY=...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
APP_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_GOOGLE_AI_API_KEY=...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 📦 Deployment Steps

### 1. Local Testing (5 min)
```bash
docker-compose up -d
# Verify at http://localhost:3000
docker-compose down
```

### 2. Frontend Deployment (Vercel)
```bash
cd Frontend
vercel --prod
```
Set environment variables in Vercel dashboard.

### 3. Backend Deployment (Render/Railway)
1. Push to GitHub
2. Connect to Render or Railway
3. Set environment variables from `Backend/.env`
4. Deploy

Build command: `pip install -r requirements.txt`
Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### 4. Database Migrations
```bash
cd Backend
alembic upgrade head
```

### 5. Verify Production
```bash
curl https://your-backend-domain.com/health
```

## ✅ Verification Checklist

Before deployment:
- [ ] Test locally: `docker-compose up -d`
- [ ] Frontend builds: `npm run build`
- [ ] Backend syntax: `python -m py_compile app/main.py`
- [ ] Health endpoint works: `/health`
- [ ] Environment variables set
- [ ] Database migrations ready

After deployment:
- [ ] Frontend loads at production URL
- [ ] Backend health endpoint responds
- [ ] Voice functionality works
- [ ] Tool calls work (get_household_dependents, get_child_vaccination_status)
- [ ] Logs are being collected

## 🔐 Security

- ✅ All Vapi code removed
- ✅ Supabase configured
- ✅ Environment validation on startup
- ✅ Health checks implemented
- ✅ Security scanning enabled in CI/CD
- ✅ .env files in .gitignore

## 📞 Troubleshooting

### Docker Issues
```bash
docker-compose logs -f
docker-compose down
```

### Frontend Build Issues
```bash
cd Frontend
rm -rf .next node_modules
npm install
npm run build
```

### Backend Issues
```bash
cd Backend
python -m py_compile app/main.py
python -c "from app.core.config import get_settings; print(get_settings())"
```

### Database Connection
```bash
psql postgresql://user:password@host:port/database
```

## 📚 Key Files

- `docker-compose.yml` - Local development orchestration
- `Backend/Dockerfile` - Backend container
- `Frontend/Dockerfile` - Frontend container
- `Backend/app/core/health.py` - Health checks
- `.github/workflows/` - CI/CD automation
- `DEPLOYMENT.md` - This file

## 🎯 Migration Status

- ✅ Vapi → Gemini Live (complete)
- ✅ Neon → Supabase (complete)
- ✅ All code cleaned up
- ✅ All configuration updated

## ⏱️ Time to Production

- Local testing: 5 minutes
- Frontend deployment: 10 minutes
- Backend deployment: 10 minutes
- Database migrations: 2 minutes
- Production verification: 5 minutes
- **Total: ~30 minutes**

## 🚀 You're Ready!

Your application is ready for production deployment. Start with local testing using `docker-compose up -d`, then follow the deployment steps above.

Questions? Check the troubleshooting section or review the GitHub Actions logs for CI/CD issues.
