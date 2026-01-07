"""
Dependencies de FastAPI para inyección de dependencias.

Proporciona sesión de BD, usuario actual, y verificación de roles.
"""

from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService
from app.models.user import Usuario, Estudiante, Profesor, TipoUsuario

from app.repositories.problem_repository import ProblemRepository
from app.services.problem_service import ProblemService


# OAuth2 scheme para extraer token del header Authorization
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


# ============================================
# Dependencies de Base de Datos
# ============================================

async def get_user_repository(
    db: AsyncSession = Depends(get_db)
) -> UserRepository:
    """Dependency para obtener UserRepository."""
    return UserRepository(db)


async def get_auth_service(
    user_repo: UserRepository = Depends(get_user_repository)
) -> AuthService:
    """Dependency para obtener AuthService."""
    return AuthService(user_repo)


# ============================================
# Dependencies de Autenticación
# ============================================

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    auth_service: AuthService = Depends(get_auth_service)
) -> Usuario:
    """
    Dependency que obtiene el usuario actual desde el token JWT.
    
    Uso:
        @app.get("/protected")
        async def protected_route(user: Usuario = Depends(get_current_user)):
            return {"user_id": user.id}
    """
    return await auth_service.get_current_user(token)


async def get_current_active_user(
    current_user: Usuario = Depends(get_current_user)
) -> Usuario:
    """
    Dependency que verifica que el usuario esté activo.
    
    Nota: Ya se verifica en get_current_user, pero se mantiene
    por compatibilidad con FastAPI patterns.
    """
    if not current_user.activo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario inactivo"
        )
    return current_user


# ============================================
# Dependencies de Roles Específicos
# ============================================

async def get_current_student(
    current_user: Usuario = Depends(get_current_active_user)
) -> Estudiante:
    """
    Dependency que verifica que el usuario actual sea estudiante.
    
    Uso:
        @app.get("/student-only")
        async def student_route(student: Estudiante = Depends(get_current_student)):
            return {"estudiante": student.nombre_completo}
    """
    if not isinstance(current_user, Estudiante):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Este endpoint es solo para estudiantes"
        )
    return current_user


async def get_current_teacher(
    current_user: Usuario = Depends(get_current_active_user)
) -> Profesor:
    """
    Dependency que verifica que el usuario actual sea profesor.
    
    Uso:
        @app.get("/teacher-only")
        async def teacher_route(teacher: Profesor = Depends(get_current_teacher)):
            return {"profesor": teacher.nombre_completo}
    """
    if not isinstance(current_user, Profesor):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Este endpoint es solo para profesores"
        )
    return current_user


# ============================================
# Type Aliases para anotaciones limpias
# ============================================

# Anotaciones tipo para usar en endpoints
CurrentUser = Annotated[Usuario, Depends(get_current_active_user)]
CurrentStudent = Annotated[Estudiante, Depends(get_current_student)]
CurrentTeacher = Annotated[Profesor, Depends(get_current_teacher)]
DBSession = Annotated[AsyncSession, Depends(get_db)]
AuthServiceDep = Annotated[AuthService, Depends(get_auth_service)]


# ============================================
# Dependencies de Problem Service
# ============================================

async def get_problem_repository(
    db: AsyncSession = Depends(get_db)
) -> ProblemRepository:
    return ProblemRepository(db)


async def get_problem_service(
    problem_repo: ProblemRepository = Depends(get_problem_repository)
) -> ProblemService:
    return ProblemService(problem_repo)



# Type alias para ProblemService
ProblemServiceDep = Annotated[ProblemService, Depends(get_problem_service)]
