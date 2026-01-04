"""
Script para insertar datos iniciales (seed data).

Inserta:
- 6 Narrativas
- Categorías de desbloqueables
- Medallas básicas
- Errores comunes del Buggy Model
"""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal
from app.models import (
    Narrativa,
    CategoriaDesbloqueable, TipoCategoria,
    Medalla,
    ErrorComun,
)


async def seed_narrativas(db: AsyncSession):
    """Insertar las 6 narrativas del sistema."""
    narrativas = [
        {
            "nombre": "Piratas",
            "descripcion": "Aventuras en alta mar, tesoros y mapas",
            "icono_url": "/assets/narrativas/piratas.svg"
        },
        {
            "nombre": "Astronautas",
            "descripcion": "Exploración espacial, planetas y estrellas",
            "icono_url": "/assets/narrativas/astronautas.svg"
        },
        {
            "nombre": "Magos",
            "descripcion": "Magia, hechizos y pociones mágicas",
            "icono_url": "/assets/narrativas/magos.svg"
        },
        {
            "nombre": "Caballeros",
            "descripcion": "Castillos, dragones y espadas legendarias",
            "icono_url": "/assets/narrativas/caballeros.svg"
        },
        {
            "nombre": "Cowboys",
            "descripcion": "Oeste salvaje, caballos y desafíos del rancho",
            "icono_url": "/assets/narrativas/cowboys.svg"
        },
        {
            "nombre": "Princesas Inventoras",
            "descripcion": "Ciencia, invención y creatividad",
            "icono_url": "/assets/narrativas/princesas.svg"
        },
    ]
    
    for data in narrativas:
        narrativa = Narrativa(**data)
        db.add(narrativa)
    
    await db.commit()
    print("✓ 6 narrativas insertadas")


async def seed_categorias_desbloqueables(db: AsyncSession):
    """Insertar categorías de desbloqueables."""
    categorias = [
        TipoCategoria.COLOR,
        TipoCategoria.FORMA,
        TipoCategoria.MUSICA,
        TipoCategoria.FONDO,
        TipoCategoria.FUENTE,
    ]
    
    for tipo in categorias:
        categoria = CategoriaDesbloqueable(nombre=tipo)
        db.add(categoria)
    
    await db.commit()
    print("✓ 5 categorías de desbloqueables insertadas")


async def seed_medallas(db: AsyncSession):
    """Insertar medallas básicas del sistema."""
    medallas = [
        {
            "codigo": "PRIMERA_PRACTICA",
            "nombre": "Primera Práctica",
            "descripcion": "Completaste tu primera práctica",
            "icono_url": "/assets/medallas/primera_practica.svg",
            "condicion_obtencion": {"practicas_completadas": 1},
            "nivel_requerido": None
        },
        {
            "codigo": "DIEZ_CONSECUTIVAS",
            "nombre": "10 Consecutivas",
            "descripcion": "10 respuestas correctas seguidas",
            "icono_url": "/assets/medallas/diez_consecutivas.svg",
            "condicion_obtencion": {"consecutivas_correctas": 10},
            "nivel_requerido": None
        },
        {
            "codigo": "NIVEL_3_ALCANZADO",
            "nombre": "Nivel 3 Alcanzado",
            "descripcion": "Llegaste al nivel 3",
            "icono_url": "/assets/medallas/nivel_3.svg",
            "condicion_obtencion": {"nivel_actual": 3},
            "nivel_requerido": 3
        },
        {
            "codigo": "NIVEL_5_MAESTRO",
            "nombre": "Maestro Nivel 5",
            "descripcion": "Alcanzaste el nivel máximo",
            "icono_url": "/assets/medallas/nivel_5.svg",
            "condicion_obtencion": {"nivel_actual": 5},
            "nivel_requerido": 5
        },
        {
            "codigo": "CIEN_PROBLEMAS",
            "nombre": "100 Problemas",
            "descripcion": "Resolviste 100 problemas",
            "icono_url": "/assets/medallas/cien_problemas.svg",
            "condicion_obtencion": {"problemas_resueltos": 100},
            "nivel_requerido": None
        },
    ]
    
    for data in medallas:
        medalla = Medalla(**data)
        db.add(medalla)
    
    await db.commit()
    print("✓ 5 medallas insertadas")


async def seed_errores_comunes(db: AsyncSession):
    """Insertar errores comunes del Buggy Model."""
    errores = [
        {
            "codigo": "DECIMAL_ALIGN",
            "nombre": "Alineación Incorrecta de Decimales",
            "descripcion": "Alinea números por la derecha en vez de por el punto decimal",
            "operacion_asociada": "+",
            "patron_deteccion": None
        },
        {
            "codigo": "SUBTRACT_SMALLER",
            "nombre": "Siempre Restar el Menor",
            "descripcion": "Siempre resta el número menor del mayor, ignorando el orden",
            "operacion_asociada": "-",
            "patron_deteccion": None
        },
        {
            "codigo": "MULTIPLY_ADD",
            "nombre": "Confunde Multiplicación con Suma",
            "descripcion": "Suma en vez de multiplicar",
            "operacion_asociada": "×",
            "patron_deteccion": None
        },
        {
            "codigo": "DECIMAL_MULTIPLY_SHIFT",
            "nombre": "No Ajusta Decimales al Multiplicar",
            "descripcion": "Olvida ajustar la posición del punto decimal",
            "operacion_asociada": "×",
            "patron_deteccion": None
        },
        {
            "codigo": "DIVISION_REMAINDER_ERROR",
            "nombre": "Error en Manejo de Residuos",
            "descripcion": "No maneja correctamente el residuo en divisiones",
            "operacion_asociada": "÷",
            "patron_deteccion": None
        },
    ]
    
    for data in errores:
        error = ErrorComun(**data)
        db.add(error)
    
    await db.commit()
    print("✓ 5 errores comunes insertados")


async def main():
    """Ejecutar todos los seeds."""
    print("=" * 60)
    print("INSERTANDO DATOS INICIALES (SEED DATA)")
    print("=" * 60)
    print()
    
    async with AsyncSessionLocal() as db:
        await seed_narrativas(db)
        await seed_categorias_desbloqueables(db)
        await seed_medallas(db)
        await seed_errores_comunes(db)
    
    print()
    print("=" * 60)
    print("✅ DATOS INICIALES INSERTADOS CORRECTAMENTE")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
