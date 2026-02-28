"""
Script para re-seed SOLO de medallas.

Borra todas las medallas existentes (y los registros de medallas ganadas
por estudiantes, por FK) y las reinsertar con la definición actualizada.

Uso:
    cd backend
    poetry run python scripts/reseed_medallas.py
"""

import asyncio
import sys
import os

# Asegurar que el módulo app esté en el path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import select, text
from app.core.database import AsyncSessionLocal
from app.models.gamification import Medalla, CategoriaMedalla


async def reseed_medallas():
    A = CategoriaMedalla.APRENDIZAJE
    V = CategoriaMedalla.VOLUMEN
    E = CategoriaMedalla.EXPLORACION
    D = CategoriaMedalla.DESAFIOS

    medallas = [
        # ── Aprendizaje: Progresión general (5) ────────────────────────────
        {
            "nombre": "Principiante",
            "descripcion": "Completaste el diagnóstico inicial. ¡Bienvenido al viaje!",
            "categoria": A,
            "criterio": {"tipo": "diagnostico"},
            "imagen_url": "🌱",
            "orden": 1,
        },
        {
            "nombre": "Aprendiz",
            "descripcion": "Alcanzaste el Nivel 2. Vas aprendiendo bien.",
            "categoria": A,
            "criterio": {"tipo": "nivel", "operacion": "general", "nivel": 2},
            "imagen_url": "📗",
            "orden": 2,
        },
        {
            "nombre": "Competente",
            "descripcion": "Nivel 3 alcanzado. ¡Ya dominas las bases!",
            "categoria": A,
            "criterio": {"tipo": "nivel", "operacion": "general", "nivel": 3},
            "imagen_url": "📘",
            "orden": 3,
        },
        {
            "nombre": "Avanzado",
            "descripcion": "Nivel 4 alcanzado. Estás muy cerca de la cima.",
            "categoria": A,
            "criterio": {"tipo": "nivel", "operacion": "general", "nivel": 4},
            "imagen_url": "📙",
            "orden": 4,
        },
        {
            "nombre": "Maestro",
            "descripcion": "Nivel 5 alcanzado. ¡Eres un maestro de las matemáticas!",
            "categoria": A,
            "criterio": {"tipo": "nivel", "operacion": "general", "nivel": 5},
            "imagen_url": "🏆",
            "orden": 5,
        },
        # ── Aprendizaje: Dominio por operación (4) ──────────────────────────
        {
            "nombre": "Sumador",
            "descripcion": "Alcanzaste Nivel 3 en sumas de decimales.",
            "categoria": A,
            "criterio": {"tipo": "nivel", "operacion": "suma", "nivel": 3},
            "imagen_url": "➕",
            "orden": 6,
        },
        {
            "nombre": "Restador",
            "descripcion": "Alcanzaste Nivel 3 en restas de decimales.",
            "categoria": A,
            "criterio": {"tipo": "nivel", "operacion": "resta", "nivel": 3},
            "imagen_url": "➖",
            "orden": 7,
        },
        {
            "nombre": "Multiplicador",
            "descripcion": "Alcanzaste Nivel 3 en multiplicación de decimales.",
            "categoria": A,
            "criterio": {"tipo": "nivel", "operacion": "multiplicacion", "nivel": 3},
            "imagen_url": "✖️",
            "orden": 8,
        },
        {
            "nombre": "Divisor",
            "descripcion": "Alcanzaste Nivel 3 en división de decimales.",
            "categoria": A,
            "criterio": {"tipo": "nivel", "operacion": "division", "nivel": 3},
            "imagen_url": "➗",
            "orden": 9,
        },
        {
            "nombre": "Matemático Completo",
            "descripcion": "Nivel 3 en todas las operaciones. ¡Dominio total!",
            "categoria": A,
            "criterio": {"tipo": "nivel_todas", "nivel": 3},
            "imagen_url": "🧮",
            "orden": 10,
        },
        # ── Volumen (3) ──────────────────────────────────────────────────────
        {
            "nombre": "100 Club",
            "descripcion": "Resolviste 100 problemas. ¡El esfuerzo da frutos!",
            "categoria": V,
            "criterio": {"tipo": "volumen", "cantidad": 100},
            "imagen_url": "💯",
            "orden": 11,
        },
        {
            "nombre": "500 Club",
            "descripcion": "500 problemas resueltos. ¡Eres increíble!",
            "categoria": V,
            "criterio": {"tipo": "volumen", "cantidad": 500},
            "imagen_url": "🔥",
            "orden": 12,
        },
        {
            "nombre": "1000 Club",
            "descripcion": "1000 problemas resueltos. ¡Leyenda!",
            "categoria": V,
            "criterio": {"tipo": "volumen", "cantidad": 1000},
            "imagen_url": "💎",
            "orden": 13,
        },
        # ── Exploración (2) ──────────────────────────────────────────────────
        {
            "nombre": "Explorador",
            "descripcion": "Completaste una práctica con cada uno de los 6 temas disponibles.",
            "categoria": E,
            "criterio": {"tipo": "exploracion_temas", "temas_requeridos": 6},
            "imagen_url": "🗺️",
            "orden": 14,
        },
        {
            "nombre": "Coleccionista",
            "descripcion": "Compraste 20 items diferentes en la tienda.",
            "categoria": E,
            "criterio": {"tipo": "coleccionista", "cantidad": 20},
            "imagen_url": "🛍️",
            "orden": 15,
        },
        # ── Desafíos (3) ─────────────────────────────────────────────────────
        {
            "nombre": "Colaborador",
            "descripcion": "Participaste en 1 desafío grupal completado.",
            "categoria": D,
            "criterio": {"tipo": "desafio_grupal", "cantidad": 1},
            "imagen_url": "🤝",
            "orden": 16,
        },
        {
            "nombre": "Cooperador",
            "descripcion": "Participaste en 3 desafíos grupales completados.",
            "categoria": D,
            "criterio": {"tipo": "desafio_grupal", "cantidad": 3},
            "imagen_url": "🫂",
            "orden": 17,
        },
        {
            "nombre": "Líder de Equipo",
            "descripcion": "Participaste en 5 desafíos grupales completados. ¡Un verdadero líder!",
            "categoria": D,
            "criterio": {"tipo": "desafio_grupal", "cantidad": 5},
            "imagen_url": "👑",
            "orden": 18,
        },
        # ── Secretas (7) ─────────────────────────────────────────────────────
        # Una por operación al llegar a Nivel 5
        {
            "nombre": "Suma Perfeccionada",
            "descripcion": "Alcanzaste el Nivel 5 en sumas de decimales. ¡Eres imparable!",
            "categoria": A,
            "criterio": {"tipo": "nivel", "operacion": "suma", "nivel": 5},
            "imagen_url": "➕",
            "orden": 19,
            "es_secreta": True,
        },
        {
            "nombre": "Resta Perfeccionada",
            "descripcion": "Alcanzaste el Nivel 5 en restas de decimales. ¡Maestría total!",
            "categoria": A,
            "criterio": {"tipo": "nivel", "operacion": "resta", "nivel": 5},
            "imagen_url": "➖",
            "orden": 20,
            "es_secreta": True,
        },
        {
            "nombre": "Multiplicación Perfeccionada",
            "descripcion": "Alcanzaste el Nivel 5 en multiplicación de decimales. ¡Extraordinario!",
            "categoria": A,
            "criterio": {"tipo": "nivel", "operacion": "multiplicacion", "nivel": 5},
            "imagen_url": "✖️",
            "orden": 21,
            "es_secreta": True,
        },
        {
            "nombre": "División Perfeccionada",
            "descripcion": "Alcanzaste el Nivel 5 en división de decimales. ¡Increíble dominio!",
            "categoria": A,
            "criterio": {"tipo": "nivel", "operacion": "division", "nivel": 5},
            "imagen_url": "➗",
            "orden": 22,
            "es_secreta": True,
        },
        # Nivel 5 global
        {
            "nombre": "¿Eres un profesor?",
            "descripcion": "Alcanzaste el Nivel 5 global. ¡Tu conocimiento no tiene límites!",
            "categoria": A,
            "criterio": {"tipo": "nivel", "operacion": "general", "nivel": 5},
            "imagen_url": "🌟",
            "orden": 23,
            "es_secreta": True,
        },
        # Coleccionista total de la tienda
        {
            "nombre": "¡Todo es Mío!",
            "descripcion": "Compraste absolutamente todos los items de la tienda. ¡El dueño del lugar!",
            "categoria": E,
            "criterio": {"tipo": "coleccionista", "cantidad": 63},
            "imagen_url": "🛒",
            "orden": 24,
            "es_secreta": True,
        },
        # Racha perfecta
        {
            "nombre": "Perfeccionista",
            "descripcion": "Lograste una racha de 50 sesiones perfectas consecutivas. ¡Leyenda!",
            "categoria": V,
            "criterio": {"tipo": "racha", "cantidad": 50},
            "imagen_url": "🚀",
            "orden": 25,
            "es_secreta": True,
        },
    ]

    async with AsyncSessionLocal() as db:
        # 1. Borrar registros de medallas ganadas por estudiantes (FK)
        await db.execute(text("DELETE FROM estudiante_medalla"))
        await db.flush()

        # 2. Borrar medallas existentes
        existing = await db.execute(select(Medalla))
        existing_medals = existing.scalars().all()
        count_old = len(existing_medals)
        for m in existing_medals:
            await db.delete(m)
        await db.flush()

        # 3. Insertar nuevas medallas
        for data in medallas:
            db.add(Medalla(**data))
        await db.commit()

        secretas = sum(1 for m in medallas if m.get("es_secreta"))
        visibles = len(medallas) - secretas
        print(f"\n✅ Medallas actualizadas:")
        print(f"   • {count_old} medallas antiguas eliminadas")
        print(f"   • {len(medallas)} medallas insertadas ({visibles} visibles + {secretas} secretas)")
        print(f"\n   Medallas secretas nuevas:")
        for m in medallas:
            if m.get("es_secreta"):
                print(f"   [{m['imagen_url']}] {m['nombre']}")


if __name__ == "__main__":
    asyncio.run(reseed_medallas())
