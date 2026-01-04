"""
Router de autenticación.

Endpoints para login, registro y gestión de tokens.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db

router = APIRouter()

# OAuth2 scheme para extraer token de headers
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(
    db: AsyncSession = Depends(get_db)
):
    """
    Registra un nuevo usuario (estudiante o profesor).
    
    TODO: Implementar lógica de registro
    1. Verificar que email no exista
    2. Hashear contraseña
    3. Crear usuario en BD
    4. Generar token JWT
    5. Retornar usuario + token
    """
    return {
        "message": "Register endpoint - TODO: Implementar",
        "info": "Este endpoint creará usuarios y retornará JWT token"
    }


@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    """
    Autentica un usuario y retorna JWT token.
    
    TODO: Implementar lógica de login
    1. Buscar usuario por email
    2. Verificar contraseña
    3. Generar token JWT con user_id y role
    4. Retornar token
    """
    return {
        "message": "Login endpoint - TODO: Implementar",
        "expected_response": {
            "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
            "token_type": "bearer"
        }
    }


@router.get("/me")
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
    """
    Obtiene información del usuario autenticado actual.
    
    TODO: Implementar obtención de usuario actual
    1. Decodificar token JWT
    2. Extraer user_id del payload
    3. Buscar usuario en BD
    4. Retornar datos del usuario
    """
    return {
        "message": "Get current user endpoint - TODO: Implementar"
    }


@router.post("/refresh")
async def refresh_token(
    token: str = Depends(oauth2_scheme),
):
    """
    Refresca un JWT token existente.
    
    TODO: Implementar refresh de token
    """
    return {
        "message": "Refresh token endpoint - TODO: Implementar"
    }
