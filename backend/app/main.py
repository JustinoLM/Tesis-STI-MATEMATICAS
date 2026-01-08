"""
Entry point principal de la aplicación FastAPI.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.routers import auth, problems, adaptive, practices

# Crear instancia de FastAPI
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API REST del Sistema de Tutoría Inteligente",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar routers
app.include_router(auth.router, prefix="/api/auth", tags=["Autenticación"])
app.include_router(problems.router, prefix="/api/problems", tags=["Problemas"])
app.include_router(adaptive.router, prefix="/api/adaptive", tags=["Sistema Adaptativo"])
app.include_router(practices.router, prefix="/api/practices", tags=["Prácticas e Intentos"])


# Health check endpoints
@app.get("/", tags=["Health"])
async def root():
    """Endpoint básico de health check."""
    return {
        "message": "STI API - Sistema de Tutoría Inteligente",
        "status": "online",
        "version": "0.1.0",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Endpoint detallado de health check."""
    return {
        "status": "healthy",
        "database": "connected",
        "environment": settings.ENVIRONMENT,
    }


# Event handlers
@app.on_event("startup")
async def startup_event():
    """Ejecutado al iniciar la aplicación."""
    print("=" * 60)
    print("🚀 INICIANDO STI BACKEND")
    print("=" * 60)
    print(f"Environment: {settings.ENVIRONMENT}")
    print(f"Debug: {settings.DEBUG}")
    print(f"API Docs: http://localhost:8000/docs")
    print("=" * 60)


@app.on_event("shutdown")
async def shutdown_event():
    """Ejecutado al cerrar la aplicación."""
    print("👋 Cerrando STI Backend...")
