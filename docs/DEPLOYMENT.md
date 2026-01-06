# Guía de Deployment Manual

Este documento explica cómo desplegar el Sistema de Tutoría Inteligente a producción de forma **manual**.

---

## Filosofía de Deployment

Este proyecto usa **deployment manual controlado** en vez de CI/CD automático porque:

✅ **Simplicidad:** No requiere configurar GitHub Actions, secrets, ni workflows complejos  
✅ **Control:** El desarrollador decide exactamente cuándo desplegar  
✅ **Transparencia:** Cada paso es visible y entendible  
✅ **Apropiado para MVP:** Un proyecto académico no requiere deploys automáticos  

---

## Prerrequisitos

Antes de hacer el primer deployment, necesitas:

### 1. Cuentas en servicios de hosting

- [x] **Railway** (https://railway.app) - Backend + PostgreSQL
- [x] **Vercel** (https://vercel.com) - Frontend
- [x] **Cloudinary** (https://cloudinary.com) - Almacenamiento de assets

### 2. CLIs instaladas
```bash
# Railway CLI
npm install -g @railway/cli

# Vercel CLI
npm install -g vercel

# Verificar instalación
railway --version
vercel --version
```

### 3. Autenticación
```bash
# Login en Railway
railway login

# Login en Vercel
vercel login
```

---

## Setup Inicial (Primera vez)

### Paso 1: Configurar Railway (Backend + PostgreSQL)

#### 1.1. Crear proyecto
```bash
cd backend
railway init
```

Esto crea un nuevo proyecto en Railway vinculado a tu directorio.

#### 1.2. Agregar PostgreSQL
```bash
railway add --plugin postgresql
```

Railway automáticamente:
- Crea una base de datos PostgreSQL
- Agrega `DATABASE_URL` a las variables de entorno

#### 1.3. Configurar variables de entorno
```bash
# Generar SECRET_KEY
SECRET_KEY=$(openssl rand -hex 32)

# Agregar variables
railway variables set SECRET_KEY=$SECRET_KEY
railway variables set ALGORITHM=HS256
railway variables set ACCESS_TOKEN_EXPIRE_MINUTES=30
railway variables set ENVIRONMENT=production
railway variables set DEBUG=False
railway variables set 'BACKEND_CORS_ORIGINS=["https://sti-frontend.vercel.app"]'
```

**IMPORTANTE:** Reemplaza `sti-frontend.vercel.app` con tu URL real de Vercel (la obtendrás después).

**Cloudinary (configurar cuando implementes videos):**
```bash
railway variables set CLOUDINARY_CLOUD_NAME=tu-cloud-name
railway variables set CLOUDINARY_API_KEY=tu-api-key
railway variables set CLOUDINARY_API_SECRET=tu-api-secret
```

#### 1.4. Deploy inicial
```bash
railway up
```

Espera a que termine. Railway te dará una URL como: `https://sti-backend.railway.app`

#### 1.5. Ejecutar migraciones
```bash
# Conectar a la base de datos en Railway
railway run alembic upgrade head

# Insertar datos iniciales
railway run python scripts/seed_data.py
```

#### 1.6. Verificar
```bash
curl https://sti-backend.railway.app/health
```

Deberías ver:
```json
{
  "status": "healthy",
  "database": "connected",
  "llm": "available"
}
```

---

### Paso 2: Configurar Vercel (Frontend)

#### 2.1. Link del proyecto
```bash
cd frontend
vercel link
```

Responde:
- **Setup and deploy?** → Yes
- **Scope** → Tu usuario
- **Link to existing project?** → No
- **Project name** → sti-frontend (o el que prefieras)
- **Directory** → `./` (estás en frontend/)

Esto crea `.vercel/project.json` con los IDs del proyecto.

#### 2.2. Configurar variable de entorno
```bash
# Reemplaza con tu URL real de Railway
vercel env add VITE_API_BASE_URL production
# Pegar: https://sti-backend.railway.app/api
```

#### 2.3. Deploy inicial
```bash
vercel --prod
```

Vercel te dará una URL como: `https://sti-frontend.vercel.app`

#### 2.4. Actualizar CORS en backend

Ahora que tienes la URL de Vercel, actualiza el backend:
```bash
cd ../backend
railway variables set 'BACKEND_CORS_ORIGINS=["https://sti-frontend.vercel.app"]'

# Redeploy backend para aplicar cambio
railway up
```

---

## Deployment Regular (Después del setup inicial)

### Opción 1: Script Automático (Recomendado)

Desde la raíz del proyecto:
```bash
./deploy.sh
```

Este script:
1. ✅ Ejecuta tests de backend
2. ✅ Ejecuta tests de frontend
3. ✅ Pide confirmación
4. ✅ Despliega backend a Railway
5. ✅ Despliega frontend a Vercel

### Opción 2: Paso a Paso Manual

#### Backend:
```bash
# 1. Tests locales
cd backend
./test.sh

# 2. Deploy
railway up

# 3. Si hay migraciones nuevas
railway run alembic upgrade head
```

#### Frontend:
```bash
# 1. Tests locales
cd frontend
./test.sh

# 2. Deploy
vercel --prod
```

---

## Testing Local Antes de Deploy

### Backend
```bash
cd backend
./test.sh
```

Esto ejecuta:
- Linting con Ruff
- Formato con Black
- Tests con pytest
- Coverage report

### Frontend
```bash
cd frontend
./test.sh
```

Esto ejecuta:
- Linting con ESLint
- Tests con Vitest
- Build de producción

---

## Gestión de Base de Datos

### Crear nueva migración
```bash
cd backend

# Después de modificar modelos en app/models/
alembic revision --autogenerate -m "descripción del cambio"

# Revisar el archivo generado en alembic/versions/

# Aplicar localmente (para probar)
alembic upgrade head

# Aplicar en producción
railway run alembic upgrade head
```

### Rollback de migración
```bash
# Localmente
alembic downgrade -1

# En producción
railway run alembic downgrade -1
```

### Backup de base de datos
```bash
# Conectar al shell de Railway
railway connect postgres

# Dentro del shell:
pg_dump sti_db > backup_$(date +%Y%m%d).sql
```

---

## Rollback de Deployments

### Backend (Railway)

Railway mantiene historial de deployments:

1. Dashboard de Railway → Tu proyecto → Deployments
2. Seleccionar deployment anterior que funcionaba
3. Click en los 3 puntos → "Redeploy"

O desde CLI:
```bash
railway status  # Ver deployments recientes
railway rollback  # Rollback al anterior
```

### Frontend (Vercel)
```bash
# Ver deployments
vercel ls

# Rollback al anterior
vercel rollback
```

O desde dashboard:
1. Vercel Dashboard → Tu proyecto → Deployments
2. Seleccionar deployment anterior
3. "Promote to Production"

---

## Monitoreo Post-Deployment

### Logs en tiempo real

**Backend:**
```bash
railway logs
```

**Frontend:**
```bash
vercel logs
```

### Health Checks
```bash
# Backend health
curl https://sti-backend.railway.app/health

# Frontend (verificar que carga)
curl -I https://sti-frontend.vercel.app
```

### Verificar conectividad Backend-Frontend
```bash
# Desde navegador:
# 1. Abrir DevTools (F12)
# 2. Ir a Network tab
# 3. Navegar por el frontend
# 4. Verificar que las llamadas a /api/ responden 200
```

---

## Troubleshooting

### Error: "DATABASE_URL not found"

**Causa:** Variable de entorno no está configurada en Railway

**Solución:**
```bash
railway variables
# Verificar que DATABASE_URL existe
# Si no existe, el addon de PostgreSQL no está agregado
railway add --plugin postgresql
```

### Error: "CORS policy blocked"

**Causa:** El backend no permite requests desde el frontend

**Solución:**
```bash
railway variables set 'BACKEND_CORS_ORIGINS=["https://tu-url.vercel.app"]'
railway up
```

### Error: "Build failed" en Vercel

**Causa:** Error de compilación de TypeScript o Vite

**Solución:**
```bash
# Probar build localmente
cd frontend
pnpm build

# Ver error específico
# Fix el error
# Deploy de nuevo
vercel --prod
```

### Error: "Cannot connect to database"

**Causa:** PostgreSQL no está iniciado o URL incorrecta

**Solución Railway:**
```bash
railway status  # Ver si PostgreSQL está running
railway restart  # Reiniciar servicios
```

---

## Costos Mensuales

| Servicio | Plan | Costo |
|----------|------|-------|
| Railway | Hobby | $5 USD |
| Vercel | Hobby | $0 USD (gratis) |
| Cloudinary | Free Tier | $0 USD |
| **TOTAL** | | **$5 USD/mes** |

---

## Checklist Pre-Deployment

Antes de cada deployment, verifica:

- [ ] Tests de backend pasan: `cd backend && ./test.sh`
- [ ] Tests de frontend pasan: `cd frontend && ./test.sh`
- [ ] Variables de entorno configuradas en Railway
- [ ] Variables de entorno configuradas en Vercel
- [ ] Migraciones de BD aplicadas (si hay nuevas)
- [ ] `.env` locales NO están en Git
- [ ] Commit y push a GitHub

---

## Checklist Post-Deployment

Después de cada deployment, verifica:

- [ ] Health check responde: `/health` retorna 200
- [ ] Frontend carga correctamente
- [ ] API calls funcionan (DevTools → Network)
- [ ] Login funciona
- [ ] No hay errores en logs: `railway logs` y `vercel logs`
- [ ] Base de datos accesible desde backend

---

## Comandos Útiles
```bash
# Railway
railway status          # Ver estado de servicios
railway logs            # Ver logs en tiempo real
railway logs --tail 100 # Ver últimas 100 líneas
railway variables       # Listar variables de entorno
railway run <cmd>       # Ejecutar comando en Railway
railway connect         # Abrir shell interactivo

# Vercel
vercel ls               # Listar deployments
vercel logs             # Ver logs
vercel env ls           # Listar variables de entorno
vercel inspect <url>    # Inspeccionar deployment
vercel --prod           # Deploy a producción
vercel --debug          # Deploy con debug activado
```

---

## Recursos

- **Railway Docs:** https://docs.railway.app
- **Vercel Docs:** https://vercel.com/docs
- **Alembic Docs:** https://alembic.sqlalchemy.org
