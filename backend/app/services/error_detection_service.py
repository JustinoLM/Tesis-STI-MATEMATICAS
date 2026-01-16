"""
Service para detección de tipos de error.

Analiza respuestas incorrectas y clasifica el tipo de error cometido.
"""

from typing import Optional
from app.models.problem import Problema, Operacion
from app.models.hints_videos import TipoError


class ErrorDetectionService:
    """Service para detectar y clasificar errores matemáticos."""
    
    @staticmethod
    def detectar_tipo_error(
        problema: Problema,
        respuesta_estudiante: float
    ) -> TipoError:
        """
        Analiza la respuesta incorrecta y determina el tipo de error.
        
        Implementa 6 categorías de detección:
        1. desalineacion_decimales
        2. punto_mal_colocado
        3. confundio_operacion
        4. orden_incorrecto
        5. error_tabla
        6. error_calculo_general (catch-all)
        """
        op1 = float(problema.operando1)
        op2 = float(problema.operando2)
        resultado_correcto = float(problema.resultado)
        operacion = problema.operacion
        
        # 1. Confundió operación (suma cuando debía restar, etc.)
        if operacion == Operacion.RESTA:
            suma = op1 + op2
            if abs(respuesta_estudiante - suma) < 0.01:
                return TipoError.CONFUNDIO_OPERACION
        
        if operacion == Operacion.SUMA:
            resta = op1 - op2
            if abs(respuesta_estudiante - abs(resta)) < 0.01:
                return TipoError.CONFUNDIO_OPERACION
        
        # 2. Orden incorrecto (8 - 12 = 4 en vez de -4)
        if operacion == Operacion.RESTA:
            resta_invertida = op2 - op1
            if abs(respuesta_estudiante - abs(resta_invertida)) < 0.01:
                return TipoError.ORDEN_INCORRECTO
        
        # 3. Desalineación de decimales (operó sin alinear puntos)
        if ErrorDetectionService._tiene_decimales(op1, op2):
            # Simular operación sin decimales
            sin_decimales = ErrorDetectionService._operar_sin_decimales(
                op1, op2, operacion
            )
            
            if sin_decimales and abs(respuesta_estudiante - sin_decimales) < 0.01:
                return TipoError.DESALINEACION_DECIMALES
        
        # 4. Punto mal colocado (multiplicación/división)
        if operacion in [Operacion.MULTIPLICACION, Operacion.DIVISION]:
            if ErrorDetectionService._tiene_decimales(op1, op2):
                # Verificar si olvidó contar decimales
                punto_mal = ErrorDetectionService._resultado_punto_mal_colocado(
                    op1, op2, operacion, resultado_correcto, respuesta_estudiante
                )
                if punto_mal:
                    return TipoError.PUNTO_MAL_COLOCADO
        
        # 5. Error en tabla de multiplicar (solo enteros)
        if operacion == Operacion.MULTIPLICACION:
            if ErrorDetectionService._son_enteros(op1, op2):
                # Verificar si es error de tabla cercano
                if ErrorDetectionService._es_error_tabla(op1, op2, respuesta_estudiante):
                    return TipoError.ERROR_TABLA
        
        # 6. Error de cálculo general (catch-all)
        return TipoError.ERROR_CALCULO_GENERAL
    
    @staticmethod
    def _tiene_decimales(num1: float, num2: float) -> bool:
        """Verifica si alguno de los números tiene decimales."""
        return num1 % 1 != 0 or num2 % 1 != 0
    
    @staticmethod
    def _son_enteros(num1: float, num2: float) -> bool:
        """Verifica si ambos números son enteros."""
        return num1 % 1 == 0 and num2 % 1 == 0
    
    @staticmethod
    def _operar_sin_decimales(
        op1: float,
        op2: float,
        operacion: Operacion
    ) -> Optional[float]:
        """
        Simula la operación ignorando los decimales.
        
        Ejemplo: 14.5 + 8.3 → 145 + 83 = 228
        """
        try:
            # Convertir a enteros quitando el punto
            str1 = str(op1).replace('.', '')
            str2 = str(op2).replace('.', '')
            
            int1 = int(str1)
            int2 = int(str2)
            
            if operacion == Operacion.SUMA:
                return float(int1 + int2)
            elif operacion == Operacion.RESTA:
                return float(abs(int1 - int2))
            elif operacion == Operacion.MULTIPLICACION:
                return float(int1 * int2)
            elif operacion == Operacion.DIVISION and int2 != 0:
                return float(int1 / int2)
            
            return None
        except:
            return None
    
    @staticmethod
    def _resultado_punto_mal_colocado(
        op1: float,
        op2: float,
        operacion: Operacion,
        correcto: float,
        respuesta: float
    ) -> bool:
        """
        Verifica si el error es por colocar mal el punto decimal.
        
        Ejemplo: 12.5 × 2 = 25.0 (correcto)
        Estudiante: 250 (olvidó contar decimales)
        """
        # Multiplicaciones de respuesta por potencias de 10
        for potencia in [10, 100, 1000, 0.1, 0.01, 0.001]:
            variante = correcto * potencia
            if abs(respuesta - variante) < 0.01:
                return True
        
        return False
    
    @staticmethod
    def _es_error_tabla(op1: float, op2: float, respuesta: float) -> bool:
        """
        Verifica si es un error común de tabla de multiplicar.
        
        Ejemplo: 6 × 7 = 48 (pensó 6 × 8)
        """
        op1_int = int(op1)
        op2_int = int(op2)
        
        # Verificar si la respuesta coincide con tablas cercanas
        for i in range(-2, 3):  # ±2 números
            if i == 0:
                continue
            
            # Variar operando1
            alternativa1 = (op1_int + i) * op2_int
            if abs(respuesta - alternativa1) < 0.01:
                return True
            
            # Variar operando2
            alternativa2 = op1_int * (op2_int + i)
            if abs(respuesta - alternativa2) < 0.01:
                return True
        
        return False
    
    @staticmethod
    def get_descripcion_error(tipo_error: TipoError) -> str:
        """Obtiene una descripción amigable del tipo de error."""
        descripciones = {
            TipoError.DESALINEACION_DECIMALES: 
                "Parece que no alineaste correctamente los puntos decimales",
            
            TipoError.PUNTO_MAL_COLOCADO: 
                "El punto decimal no está en la posición correcta",
            
            TipoError.CONFUNDIO_OPERACION: 
                "Verifica que estés usando la operación correcta (suma, resta, etc.)",
            
            TipoError.ORDEN_INCORRECTO: 
                "Revisa el orden de los números en la operación",
            
            TipoError.ERROR_TABLA: 
                "Parece que hay un error en la tabla de multiplicar",
            
            TipoError.ERROR_CALCULO_GENERAL: 
                "Hay un error en el cálculo, revisa cada paso"
        }
        
        return descripciones.get(tipo_error, "Verifica tu respuesta")
