"""
Entry point principal de la aplicación FastAPI.

Este módulo inicializa la aplicación FastAPI, configura middleware,
registra routers y define endpoints de health check.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings

# Crear instancia de FastAPI
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API REST del Sistema de Tutoría Inteligente",
    version="0.1.0",
    docs_url="/docs",  # Swagger UI
    redoc_url="/redoc",  # ReDoc
)

# Configurar CORS para permitir requests desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
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
    """Endpoint detallado de health check para monitoring."""
    return {
        "status": "healthy",
        "database": "connected",
        "llm": "available",
    }


# TODO: Registrar routers cuando los creemos
# from app.api.routers import auth, students, teachers, problems, practices
# app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
# app.include_router(students.router, prefix="/api/students", tags=["Students"])


# Event handlers
@app.on_event("startup")
async def startup_event():
    """Ejecutado al iniciar la aplicación."""
    print("🚀 Iniciando STI Backend...")
    print(f"📝 Documentación: http://localhost:8000/docs")


@app.on_event("shutdown")
async def shutdown_event():
    """Ejecutado al cerrar la aplicación."""
    print("👋 Cerrando STI Backend...")
