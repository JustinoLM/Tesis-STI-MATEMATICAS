# Guía de Deployment

Este documento explica cómo desplegar el Sistema de Tutoría Inteligente a producción.

## Servicios de Hosting

- **Backend:** Railway (https://railway.app)
- **Frontend:** Vercel (https://vercel.com)
- **Base de Datos:** Railway PostgreSQL (incluido con backend)

---

## Deployment Inicial (Primera vez)

### 1. Configurar Railway (Backend + PostgreSQL)

#### 1.1. Crear cuenta en Railway

1. Visitar https://railway.app
2. Sign up con GitHub
3. Conectar repositorio del proyecto

#### 1.2. Crear proyecto nuevo
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Crear proyecto
railway init
```

#### 1.3. Agregar PostgreSQL

1. Dashboard de Railway → New → Database → PostgreSQL
2. Railway automáticamente agrega `DATABASE_URL` a las variables de entorno

#### 1.4. Configurar variables de entorno

Railway Dashboard → Variables → Add:
```
SECRET_KEY=<generar con: openssl rand -hex 32>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
OLLAMA_BASE_URL=<URL de servicio Ollama en Railway>
CLOUDINARY_CLOUD_NAME=<de Cloudinary dashboard>
CLOUDINARY_API_KEY=<de Cloudinary dashboard>
CLOUDINARY_API_SECRET=<de Cloudinary dashboard>
BACKEND_CORS_ORIGINS=["https://sti-frontend.vercel.app"]
ENVIRONMENT=production
DEBUG=False
```

#### 1.5. Deploy manual inicial
```bash
railway up
```

#### 1.6. Ejecutar migraciones
```bash
railway run alembic upgrade head
railway run python scripts/seed_data.py
```

---

### 2. Configurar Vercel (Frontend)

#### 2.1. Crear cuenta en Vercel

1. Visitar https://vercel.com
2. Sign up con GitHub
3. Import Project → Seleccionar repositorio

#### 2.2. Configurar proyecto

- **Framework Preset:** Vite
- **Root Directory:** `frontend`
- **Build Command:** `pnpm build`
- **Output Directory:** `dist`

#### 2.3. Configurar variables de entorno

Vercel Dashboard → Settings → Environment Variables:
```
VITE_API_BASE_URL=https://sti-backend.railway.app/api
```

**IMPORTANTE:** Reemplazar `sti-backend.railway.app` con tu URL real de Railway.

#### 2.4. Deploy

Vercel despliega automáticamente. Esperar a que termine.

---

### 3. Configurar Deployment Automático (CI/CD)

#### 3.1. Obtener tokens

**Railway Token:**
```bash
railway login
railway token
```

**Vercel Token:**
1. Vercel Dashboard → Settings → Tokens
2. Create Token → Copiar

**Vercel Project IDs:**
```bash
cd frontend
vercel link
# Esto crea .vercel/project.json con org_id y project_id
cat .vercel/project.json
```

#### 3.2. Configurar GitHub Secrets

GitHub Repository → Settings → Secrets and variables → Actions → New repository secret:
```
RAILWAY_TOKEN=<token de Railway>
VERCEL_TOKEN=<token de Vercel>
VERCEL_ORG_ID=<de .vercel/project.json>
VERCEL_PROJECT_ID=<de .vercel/project.json>
```

#### 3.3. Verificar workflows

Los workflows en `.github/workflows/` ahora funcionarán automáticamente:

- **ci.yml:** Se ejecuta en cada push/PR
- **cd.yml:** Despliega en cada merge a main

---

## Deployment Manual (Sin CI/CD)

### Backend (Railway)
```bash
cd backend
railway up --service backend
```

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

---

## Verificación Post-Deployment

### Backend

1. **Health check:**
```bash
curl https://sti-backend.railway.app/health
```

Respuesta esperada:
```json
{
  "status": "healthy",
  "database": "connected",
  "llm": "available"
}
```

2. **Swagger UI:**
Visitar: https://sti-backend.railway.app/docs

### Frontend

1. Visitar: https://sti-frontend.vercel.app
2. Verificar que carga correctamente
3. Abrir DevTools → Network → Verificar que llama a la API correcta

---

## Rollback

### Rollback de Backend (Railway)

Railway mantiene historial de deployments:

1. Dashboard → Deployments
2. Seleccionar deployment anterior
3. Redeploy

### Rollback de Frontend (Vercel)
```bash
vercel rollback
```

O desde dashboard:
1. Vercel Dashboard → Deployments
2. Seleccionar deployment anterior → Promote to Production

---

## Monitoreo

### Logs de Backend (Railway)
```bash
railway logs
```

O desde dashboard: Railway → Deployments → View Logs

### Logs de Frontend (Vercel)

Vercel Dashboard → Deployments → [Deployment] → Runtime Logs

---

## Troubleshooting

### Error: "DATABASE_URL not found"

**Solución:**
1. Verificar que PostgreSQL está agregado en Railway
2. Variables → Verificar que `DATABASE_URL` existe
3. Redeploy

### Error: "CORS policy blocked"

**Solución:**
1. Backend `.env` → `BACKEND_CORS_ORIGINS` incluye URL de Vercel
2. Frontend `.env` → `VITE_API_BASE_URL` apunta a Railway
3. Redeploy ambos servicios

### Error: "Build failed" en Vercel

**Solución:**
1. Verificar que `frontend/package.json` tiene `"build": "tsc && vite build"`
2. Logs de Vercel para ver error específico
3. Probar build local: `cd frontend && pnpm build`

---

## Costos Estimados

| Servicio | Plan | Costo Mensual |
|----------|------|---------------|
| Railway | Hobby | $5 USD |
| Vercel | Hobby | $0 USD (gratis) |
| Cloudinary | Free Tier | $0 USD |
| **TOTAL** | | **$5 USD/mes** |

---

## Checklist de Deployment

- [ ] Cuenta en Railway creada
- [ ] Cuenta en Vercel creada
- [ ] Cuenta en Cloudinary creada
- [ ] PostgreSQL agregado en Railway
- [ ] Variables de entorno configuradas en Railway
- [ ] Variables de entorno configuradas en Vercel
- [ ] Migraciones ejecutadas en producción
- [ ] Seed data insertado
- [ ] GitHub Secrets configurados
- [ ] Health check del backend responde
- [ ] Frontend carga correctamente
- [ ] API calls desde frontend funcionan
- [ ] Logs de errores monitoreados
