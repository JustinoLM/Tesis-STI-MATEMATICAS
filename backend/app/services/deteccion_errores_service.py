"""
Service para detección de tipos de error.

Analiza respuestas incorrectas y clasifica el error.
"""

from typing import Optional
from app.models.hints_videos import TipoError
from app.models.problem import Problema


class DeteccionErroresService:
    """Service para detectar tipos de error."""
    
    @staticmethod
    def detectar_tipo_error(
        problema: Problema,
        respuesta_estudiante: float
    ) -> TipoError:
        """
        Analiza la respuesta incorrecta y detecta el tipo de error.
        
        Implementa 6 categorías de detección.
        """
        operando1 = float(problema.operando1)
        operando2 = float(problema.operando2)
        resultado_correcto = float(problema.resultado)
        operacion = problema.operacion.value
        
        # 1. Confundió operación
        if operacion == "resta":
            suma = operando1 + operando2
            if abs(respuesta_estudiante - suma) < 0.01:
                return TipoError.CONFUNDIO_OPERACION
        
        elif operacion == "suma":
            resta = operando1 - operando2
            if abs(respuesta_estudiante - resta) < 0.01:
                return TipoError.CONFUNDIO_OPERACION
        
        # 2. Orden incorrecto (especialmente en resta)
        if operacion == "resta":
            orden_invertido = operando2 - operando1
            if abs(respuesta_estudiante - orden_invertido) < 0.01:
                return TipoError.ORDEN_INCORRECTO
        
        # 3. Desalineación de decimales
        tiene_decimales = '.' in str(operando1) or '.' in str(operando2)
        
        if tiene_decimales:
            # Calcular como si no hubiera decimales
            sin_decimales = DeteccionErroresService._calcular_sin_decimales(
                operando1, operando2, operacion
            )
            
            if sin_decimales is not None and abs(respuesta_estudiante - sin_decimales) < 0.01:
                return TipoError.DESALINEACION_DECIMALES
        
        # 4. Punto mal colocado
        if tiene_decimales and operacion in ["multiplicacion", "division"]:
            # Verificar si tiene el número correcto pero punto mal
            # Ejemplo: 12.5 × 2 = 250 (olvidó el punto, debería ser 25.0)
            
            # Intentar diferentes posiciones del punto
            respuesta_str = str(respuesta_estudiante).replace('.', '')
            resultado_str = str(resultado_correcto).replace('.', '')
            
            if respuesta_str == resultado_str:
                return TipoError.PUNTO_MAL_COLOCADO
        
        # 5. Error en tabla de multiplicar
        if operacion == "multiplicacion":
            # Si ambos son enteros y el error es consistente con tabla
            if operando1 == int(operando1) and operando2 == int(operando2):
                # Verificar si es un error común de tabla
                diff = abs(respuesta_estudiante - resultado_correcto)
                
                # Errores comunes: ±operando1 o ±operando2
                if diff in [operando1, operando2]:
                    return TipoError.ERROR_TABLA
        
        # 6. Error de cálculo general (catch-all)
        return TipoError.ERROR_CALCULO_GENERAL
    
    @staticmethod
    def _calcular_sin_decimales(
        operando1: float,
        operando2: float,
        operacion: str
    ) -> Optional[float]:
        """Calcula como si los números fueran enteros (sin punto decimal)."""
        try:
            # Convertir a string y quitar puntos
            op1_sin_punto = int(str(operando1).replace('.', ''))
            op2_sin_punto = int(str(operando2).replace('.', ''))
            
            if operacion == "suma":
                return float(op1_sin_punto + op2_sin_punto)
            elif operacion == "resta":
                return float(op1_sin_punto - op2_sin_punto)
            elif operacion == "multiplicacion":
                return float(op1_sin_punto * op2_sin_punto)
            elif operacion == "division":
                if op2_sin_punto != 0:
                    return float(op1_sin_punto / op2_sin_punto)
            
        except (ValueError, ZeroDivisionError):
            pass
        
        return None
    
    @staticmethod
    def obtener_descripcion_error(tipo_error: TipoError) -> str:
        """Obtiene descripción amigable del error."""
        descripciones = {
            TipoError.DESALINEACION_DECIMALES: "No alineaste correctamente los puntos decimales",
            TipoError.PUNTO_MAL_COLOCADO: "El punto decimal está en la posición incorrecta",
            TipoError.CONFUNDIO_OPERACION: "Usaste una operación diferente a la solicitada",
            TipoError.ORDEN_INCORRECTO: "El orden de los números afecta el resultado",
            TipoError.ERROR_TABLA: "Revisa las tablas de multiplicar",
            TipoError.ERROR_CALCULO_GENERAL: "Hubo un error en el cálculo"
        }
        
        return descripciones.get(tipo_error, "Error en el cálculo")
