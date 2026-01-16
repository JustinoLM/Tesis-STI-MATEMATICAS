"""
Service para generación de enunciados narrativos.

Genera enunciados temáticos con LLM y los cachea en BD.
"""

import time
import json
import random
from typing import Optional, List
from fastapi import HTTPException

from app.repositories.hints_videos_repository import HintsVideosRepository
from app.repositories.adaptive_repository import AdaptiveRepository
from app.services.ollama_service import OllamaService, OllamaPrompts
from app.models.problem import Problema


class EnunciadosService:
    """Service para enunciados narrativos."""
    
    def __init__(
        self,
        hints_videos_repo: HintsVideosRepository,
        adaptive_repo: AdaptiveRepository,
        ollama_service: OllamaService
    ):
        self.hints_videos_repo = hints_videos_repo
        self.adaptive_repo = adaptive_repo
        self.ollama_service = ollama_service
    
    async def obtener_enunciado_narrativo(
        self,
        problema_id: int,
        tema: str
    ) -> str:
        """
        Obtiene enunciado narrativo para un problema.
        
        Lazy loading: Si no existe, lo genera. Si existe, retorna aleatorio.
        """
        problema = await self.adaptive_repo.get_problema(problema_id)
        
        if not problema:
            raise HTTPException(404, "Problema no encontrado")
        
        # Verificar si ya tiene enunciados generados
        if problema.enunciado_tematico:
            try:
                enunciados_json = json.loads(problema.enunciado_tematico)
                
                # Verificar si tiene enunciados para este tema
                if tema in enunciados_json and enunciados_json[tema]:
                    # Seleccionar uno aleatorio
                    return random.choice(enunciados_json[tema])
                
            except (json.JSONDecodeError, KeyError):
                pass
        
        # No tiene enunciados para este tema → Generar
        enunciados = await self._generar_enunciados_tema(problema, tema)
        
        # Guardar en BD
        await self._guardar_enunciados(problema, tema, enunciados)
        
        # Retornar uno aleatorio
        return random.choice(enunciados)
    
    async def _generar_enunciados_tema(
        self,
        problema: Problema,
        tema: str,
        num_variaciones: int = 3
    ) -> List[str]:
        """Genera 3 variaciones de enunciados con LLM."""
        
        prompt = OllamaPrompts.generar_multiples_variaciones(
            operacion=problema.operacion.value,
            operando1=float(problema.operando1),
            operando2=float(problema.operando2),
            tema=tema,
            num_variaciones=num_variaciones
        )
        
        inicio = time.time()
        
        try:
            respuesta = await self.ollama_service.generate(
                prompt=prompt,
                temperature=0.8,  # Más creatividad
                max_tokens=300
            )
            
            tiempo_ms = int((time.time() - inicio) * 1000)
            
            # Parsear respuesta
            enunciados = self._parsear_variaciones(respuesta)
            
            # Registrar generación exitosa
            await self.hints_videos_repo.registrar_generacion_llm(
                tipo="enunciado_narrativo",
                prompt_usado=prompt,
                respuesta_llm=respuesta,
                modelo=self.ollama_service.model,
                problema_id=problema.id,
                tema=tema,
                tiempo_generacion_ms=tiempo_ms,
                exitoso=True
            )
            
            return enunciados
            
        except Exception as e:
            # Registrar error
            await self.hints_videos_repo.registrar_generacion_llm(
                tipo="enunciado_narrativo",
                prompt_usado=prompt,
                respuesta_llm="",
                modelo=self.ollama_service.model,
                problema_id=problema.id,
                tema=tema,
                exitoso=False,
                error=str(e)
            )
            
            # Fallback genérico
            return self._generar_enunciados_fallback(problema, tema)
    
    def _parsear_variaciones(self, respuesta: str) -> List[str]:
        """
        Parsea la respuesta del LLM en formato:
        VARIACION_1: [enunciado]
        VARIACION_2: [enunciado]
        VARIACION_3: [enunciado]
        """
        enunciados = []
        
        for i in range(1, 4):
            marker = f"VARIACION_{i}:"
            
            if marker in respuesta:
                # Extraer texto después del marker
                start = respuesta.index(marker) + len(marker)
                
                # Encontrar el final (siguiente marker o final de string)
                end = len(respuesta)
                for j in range(i + 1, 5):
                    next_marker = f"VARIACION_{j}:"
                    if next_marker in respuesta:
                        end = respuesta.index(next_marker)
                        break
                
                enunciado = respuesta[start:end].strip()
                
                if enunciado:
                    enunciados.append(enunciado)
        
        # Si no se pudo parsear correctamente, usar la respuesta completa como fallback
        if len(enunciados) < 3:
            # Intentar split por líneas
            lineas = [l.strip() for l in respuesta.split('\n') if l.strip()]
            
            if len(lineas) >= 3:
                return lineas[:3]
            else:
                # Fallback extremo
                return [respuesta] * 3
        
        return enunciados
    
    def _generar_enunciados_fallback(
        self,
        problema: Problema,
        tema: str
    ) -> List[str]:
        """Genera enunciados genéricos como fallback."""
        op1 = float(problema.operando1)
        op2 = float(problema.operando2)
        
        templates = {
            "suma": [
                f"Tienes {op1} y recibes {op2} más. ¿Cuántos tienes en total?",
                f"Si juntas {op1} con {op2}, ¿cuántos tienes?",
                f"Empiezas con {op1} y añades {op2}. ¿Cuál es el resultado?"
            ],
            "resta": [
                f"Tienes {op1} y usas {op2}. ¿Cuántos te quedan?",
                f"De {op1}, quitas {op2}. ¿Cuántos quedan?",
                f"Si reduces {op1} en {op2}, ¿cuál es el resultado?"
            ],
            "multiplicacion": [
                f"Si tienes {op1} grupos de {op2}, ¿cuántos hay en total?",
                f"Multiplica {op1} por {op2}. ¿Cuál es el resultado?",
                f"¿Cuánto es {op1} veces {op2}?"
            ],
            "division": [
                f"Si divides {op1} entre {op2}, ¿cuánto obtienes?",
                f"Reparte {op1} en {op2} partes iguales. ¿Cuánto es cada parte?",
                f"¿Cuántas veces cabe {op2} en {op1}?"
            ]
        }
        
        return templates.get(problema.operacion.value, templates["suma"])
    
    async def _guardar_enunciados(
        self,
        problema: Problema,
        tema: str,
        enunciados: List[str]
    ) -> None:
        """Guarda enunciados en el problema."""
        # Cargar JSON existente o crear nuevo
        enunciados_json = {}
        
        if problema.enunciado_tematico:
            try:
                enunciados_json = json.loads(problema.enunciado_tematico)
            except json.JSONDecodeError:
                pass
        
        # Agregar nuevos enunciados
        enunciados_json[tema] = enunciados
        
        # Guardar
        problema.enunciado_tematico = json.dumps(enunciados_json, ensure_ascii=False)
        problema.tema = tema  # Último tema usado
        
        await self.adaptive_repo.update_problema(problema)
