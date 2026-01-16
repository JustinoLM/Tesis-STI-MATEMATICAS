"""
Service para comunicación con Ollama.

Wrapper para llamadas HTTP a Ollama + DeepSeek.
"""

import httpx
import time
from typing import Optional, Dict
from fastapi import HTTPException, status

from app.core.config import settings


class OllamaService:
    """Service para interactuar con Ollama."""
    
    def __init__(
        self,
        base_url: str = None,
        model: str = None,
        timeout: int = 60
    ):
        """
        Inicializa el servicio de Ollama.
        
        Args:
            base_url: URL base de Ollama (default: desde settings)
            model: Modelo a usar (default: desde settings)
            timeout: Timeout en segundos para requests
        """
        self.base_url = base_url or getattr(settings, 'OLLAMA_URL', 'http://localhost:11434')
        self.model = model or getattr(settings, 'OLLAMA_MODEL', 'deepseek-r1:7b')
        self.timeout = timeout
        self.client = httpx.AsyncClient(timeout=timeout)
    
    async def generate(
        self,
        prompt: str,
        system: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None
    ) -> str:
        """
        Genera texto usando Ollama.
        
        Args:
            prompt: Prompt para el modelo
            system: System prompt opcional
            temperature: Temperatura de generación (0-1)
            max_tokens: Máximo de tokens a generar
        
        Returns:
            Texto generado por el modelo
        
        Raises:
            HTTPException: Si hay error en la comunicación
        """
        inicio = time.time()
        
        try:
            # Preparar payload
            payload = {
                "model": self.model,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": temperature,
                }
            }
            
            if system:
                payload["system"] = system
            
            if max_tokens:
                payload["options"]["num_predict"] = max_tokens
            
            # Llamar a Ollama
            response = await self.client.post(
                f"{self.base_url}/api/generate",
                json=payload
            )
            
            response.raise_for_status()
            data = response.json()
            
            tiempo_ms = int((time.time() - inicio) * 1000)
            
            return data.get("response", "")
            
        except httpx.TimeoutException:
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail=f"Timeout al comunicarse con Ollama después de {self.timeout}s"
            )
        except httpx.HTTPError as e:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Error al comunicarse con Ollama: {str(e)}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error inesperado con Ollama: {str(e)}"
            )
    
    async def check_health(self) -> Dict[str, any]:
        """
        Verifica que Ollama esté disponible.
        
        Returns:
            Dict con información de salud del servicio
        """
        try:
            response = await self.client.get(f"{self.base_url}/api/tags")
            response.raise_for_status()
            
            data = response.json()
            models = data.get("models", [])
            
            # Verificar si el modelo configurado está disponible
            model_available = any(
                m.get("name") == self.model for m in models
            )
            
            return {
                "status": "healthy",
                "base_url": self.base_url,
                "model_configured": self.model,
                "model_available": model_available,
                "available_models": [m.get("name") for m in models]
            }
            
        except Exception as e:
            return {
                "status": "unhealthy",
                "base_url": self.base_url,
                "error": str(e)
            }
    
    async def close(self):
        """Cierra el cliente HTTP."""
        await self.client.aclose()


# ============================================
# Prompts Pre-definidos
# ============================================

class OllamaPrompts:
    """Biblioteca de prompts para diferentes tareas."""
    
    @staticmethod
    def generar_pista_nivel_3(
        operacion: str,
        operando1: float,
        operando2: float,
        resultado: float,
        respuesta_incorrecta: float
    ) -> str:
        """Prompt para generar pista nivel 3."""
        return f"""Eres un tutor de matemáticas para niños de 5to grado (10-11 años).

Un estudiante está resolviendo: {operando1} {operacion} {operando2}

La respuesta correcta es: {resultado}
La respuesta del estudiante fue: {respuesta_incorrecta}

Tu tarea: Genera una pista que casi revele la respuesta pero sin darla directamente.

Reglas:
- Máximo 2-3 oraciones
- Usa lenguaje simple para niños de 10-11 años
- No uses la palabra "respuesta correcta" ni reveles el número exacto
- Guía hacia el proceso correcto
- Sé alentador y positivo

Ejemplo de pista buena:
"Si multiplicas los números sin los puntos decimales obtienes 4000. Ahora piensa: ¿cuántos decimales hay en total? Coloca el punto contando desde la derecha."

Genera la pista:"""
    
    @staticmethod
    def generar_enunciado_narrativo(
        operacion: str,
        operando1: float,
        operando2: float,
        tema: str,
        variacion: int
    ) -> str:
        """Prompt para generar enunciado narrativo temático."""
        
        # Vocabulario por tema
        vocabularios = {
            "pirates": {
                "objetos": ["monedas de oro", "cofres", "mapas del tesoro", "perlas", "joyas"],
                "verbos": ["encontró", "capturó", "robó", "descubrió", "perdió"],
                "lugares": ["puerto", "isla", "barco", "cueva", "tesoro"],
                "personajes": ["capitán", "tripulación", "bucanero", "pirata"]
            },
            "astronauts": {
                "objetos": ["unidades de combustible", "muestras espaciales", "herramientas", "contenedores", "experimentos"],
                "verbos": ["recogió", "consumió", "almacenó", "transportó", "perdió"],
                "lugares": ["nave espacial", "estación espacial", "planeta", "satélite", "módulo"],
                "personajes": ["astronauta", "comandante", "tripulación", "científico"]
            },
            "magicians": {
                "objetos": ["pociones mágicas", "hechizos", "estrellas mágicas", "cristales", "varitas"],
                "verbos": ["conjuró", "usó", "creó", "transformó", "perdió"],
                "lugares": ["torre", "laboratorio", "bosque encantado", "castillo", "cueva mágica"],
                "personajes": ["mago", "aprendiz", "hechicero", "brujo"]
            },
            "knights": {
                "objetos": ["escudos", "espadas", "armaduras", "medallas", "monedas"],
                "verbos": ["ganó", "perdió", "encontró", "usó", "guardó"],
                "lugares": ["castillo", "reino", "batalla", "fortaleza", "torneo"],
                "personajes": ["caballero", "escudero", "rey", "guerrero"]
            },
            "cowboys": {
                "objetos": ["balas", "lazos", "sombreros", "botas", "dólares"],
                "verbos": ["encontró", "perdió", "compró", "vendió", "guardó"],
                "lugares": ["rancho", "pueblo", "desierto", "cantina", "establo"],
                "personajes": ["vaquero", "sheriff", "forajido", "ranchero"]
            },
            "princesses": {
                "objetos": ["engranajes", "tornillos", "inventos", "herramientas", "planos"],
                "verbos": ["creó", "diseñó", "construyó", "reparó", "mejoró"],
                "lugares": ["taller", "palacio", "laboratorio", "jardín", "biblioteca"],
                "personajes": ["princesa inventora", "asistente", "ingeniera", "científica"]
            }
        }
        
        vocab = vocabularios.get(tema, vocabularios["pirates"])
        
        # Mapeo de operaciones a contextos
        operacion_map = {
            "suma": "sumar/juntar",
            "resta": "restar/quitar",
            "multiplicacion": "multiplicar/agrupar",
            "division": "dividir/repartir"
        }
        
        operacion_texto = operacion_map.get(operacion, operacion)
        
        return f"""Eres un escritor de problemas matemáticos para niños de 5to grado.

Crea un enunciado narrativo corto para este problema:
- Operación: {operacion_texto}
- Números: {operando1} y {operando2}
- Tema: {tema}
- Variación: #{variacion} (debe ser diferente si ya generaste otras)

Vocabulario sugerido para {tema}:
- Objetos: {', '.join(vocab['objetos'])}
- Verbos: {', '.join(vocab['verbos'])}
- Lugares: {', '.join(vocab['lugares'])}
- Personajes: {', '.join(vocab['personajes'])}

Reglas CRÍTICAS:
1. Máximo 2 oraciones
2. Termina con pregunta clara
3. NO incluyas la operación matemática (solo el contexto)
4. Usa los números exactos: {operando1} y {operando2}
5. Apropiado para niños de 10-11 años
6. Variación #{variacion} debe ser DIFERENTE de otras versiones

Ejemplo para tema pirates, operación suma:
"El capitán encontró un cofre con 12.5 monedas de oro. Su tripulación capturó otro barco con 8.3 monedas más. ¿Cuántas monedas tienen en total?"

Genera SOLO el enunciado narrativo (sin explicaciones adicionales):"""
    
    @staticmethod
    def generar_multiples_variaciones(
        operacion: str,
        operando1: float,
        operando2: float,
        tema: str,
        num_variaciones: int = 3
    ) -> str:
        """Prompt para generar múltiples variaciones a la vez."""
        
        vocabularios = {
            "pirates": "monedas de oro, cofres, mapas, perlas, tesoros",
            "astronauts": "combustible, muestras, experimentos, herramientas, contenedores",
            "magicians": "pociones, hechizos, cristales, estrellas mágicas, varitas",
            "knights": "escudos, espadas, medallas, armaduras, monedas",
            "cowboys": "balas, lazos, dólares, sombreros, botas",
            "princesses": "engranajes, inventos, planos, herramientas, tornillos"
        }
        
        vocab = vocabularios.get(tema, vocabularios["pirates"])
        
        return f"""Genera {num_variaciones} enunciados narrativos DIFERENTES para este problema matemático:

Operación: {operacion}
Números: {operando1} y {operando2}
Tema: {tema}

Vocabulario de {tema}: {vocab}

Reglas:
- Cada enunciado debe ser ÚNICO (diferente personaje, situación, o contexto)
- Máximo 2 oraciones cada uno
- Termina con pregunta
- NO incluyas la operación matemática
- Apropiado para niños de 10-11 años

Formato de respuesta (ESTRICTO):
VARIACION_1: [enunciado aquí]
VARIACION_2: [enunciado aquí]
VARIACION_3: [enunciado aquí]

Genera ahora:"""
