/**
 * Página de práctica del estudiante.
 * Con 3 intentos por problema.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Lightbulb,
  Check,
  ChevronRight,
  Home,
  AlertCircle,
  Eraser
} from 'lucide-react';
import { ProblemGrid, FeedbackDetallado } from '@/components/problems';
import { HintModal } from '@/components/problems/HintModal';
import { HintDisplay } from '@/components/problems/HintDisplay';
import { SessionResults } from '@/components/practice';
import { Problema, Operacion, RespuestaValidacion } from '@/types';
import { validarRespuesta } from '@/utils';

export function PracticePage() {
  const navigate = useNavigate();

  // TODO: Obtener de practiceStore + React Query
  const [problemas] = useState<Problema[]>([
    {
      id: 1,
      operacion: 'SUMA' as Operacion,
      numero1: 234.5,
      numero2: 156.3,
      resultado: 390.8,
      nivel_dificultad: 3,
      cantidad_decimales: 1,
      pregunta: 'Resuelve: 234.5 + 156.3',
    },
    {
      id: 2,
      operacion: 'MULTIPLICACION' as Operacion,
      numero1: 245,
      numero2: 123,
      resultado: 30135,
      nivel_dificultad: 3,
      cantidad_decimales: 0,
      pregunta: 'Resuelve: 245 × 123',
    },
    {
      id: 3,
      operacion: 'RESTA' as Operacion,
      numero1: 500.75,
      numero2: 234.5,
      resultado: 266.25,
      nivel_dificultad: 3,
      cantidad_decimales: 2,
      pregunta: 'Resuelve: 500.75 − 234.5',
    },
    // Casos de División
    {
      id: 4,
      operacion: 'DIVISION' as Operacion,
      numero1: 12.5,
      numero2: 2.5,
      resultado: 5,
      nivel_dificultad: 2,
      cantidad_decimales: 1,
      pregunta: 'Resuelve: 12.5 ÷ 2.5 (Normalización del divisor)',
    },
    {
      id: 5,
      operacion: 'DIVISION' as Operacion,
      numero1: 12.5,
      numero2: 5,
      resultado: 2.5,
      nivel_dificultad: 2,
      cantidad_decimales: 1,
      pregunta: 'Resuelve: 12.5 ÷ 5 (División vertical)',
    },
    {
      id: 6,
      operacion: 'DIVISION' as Operacion,
      numero1: 125,
      numero2: 25,
      resultado: 5,
      nivel_dificultad: 1,
      cantidad_decimales: 0,
      pregunta: 'Resuelve: 125 ÷ 25 (División natural)',
    },
    {
      id: 7,
      operacion: 'DIVISION' as Operacion,
      numero1: 3.75,
      numero2: 1.5,
      resultado: 2.5,
      nivel_dificultad: 3,
      cantidad_decimales: 2,
      pregunta: 'Resuelve: 3.75 ÷ 1.5 (Normalización con 2 decimales)',
    },
  ]);

  const [indiceProblemActual, setIndiceProblemActual] = useState(0);
  const [respuestaEstudiante, setRespuestaEstudiante] = useState('');
  const [intentosRestantes, setIntentosRestantes] = useState(3);
  const [mostrarFeedback, setMostrarFeedback] = useState(false);
  const [esRespuestaCorrecta, setEsRespuestaCorrecta] = useState(false);
  const [validacionDetallada, setValidacionDetallada] = useState<RespuestaValidacion | null>(null);
  const [modalPistaAbierto, setModalPistaAbierto] = useState(false);
  const [pistaActual, setPistaActual] = useState<{ nivel: 1 | 2 | 3; contenido: string } | null>(null);
  const [pistasUsadas, setPistasUsadas] = useState<number[]>([]);
  const [puntosDisponibles] = useState(1250);
  const [limpiarKey, setLimpiarKey] = useState(0);
  const [clearIncorrectTrigger, setClearIncorrectTrigger] = useState(0);

  // Estado de resultados de sesión
  const [sesionCompletada, setSesionCompletada] = useState(false);
  const [resultadosProblemas, setResultadosProblemas] = useState<boolean[]>([]);

  const problemaActual = problemas[indiceProblemActual];
  const progreso = Math.round(((indiceProblemActual + 1) / problemas.length) * 100);

  const handleVerificar = () => {
    if (!respuestaEstudiante) return;

    // Usar función de validación centralizada
    const validacion = validarRespuesta(
      problemaActual.operacion,
      respuestaEstudiante,
      problemaActual.numero1,
      problemaActual.numero2,
      problemaActual.resultado
    );

    setMostrarFeedback(true);
    setEsRespuestaCorrecta(validacion.esCorrecta);
    setValidacionDetallada(validacion);

    if (!validacion.esCorrecta) {
      setIntentosRestantes(intentosRestantes - 1);
    }
  };

  const handleSiguiente = () => {
    // Registrar resultado del problema actual
    setResultadosProblemas(prev => [...prev, esRespuestaCorrecta]);

    if (indiceProblemActual < problemas.length - 1) {
      setIndiceProblemActual(indiceProblemActual + 1);
      setRespuestaEstudiante('');
      setMostrarFeedback(false);
      setEsRespuestaCorrecta(false);
      setValidacionDetallada(null);
      setIntentosRestantes(3);
      setPistasUsadas([]);
    } else {
      // Sesión completada - mostrar pantalla de resultados
      setSesionCompletada(true);
    }
  };

  const handleReintentar = () => {
    setMostrarFeedback(false);
    // Limpiar solo los inputs incorrectos
    setClearIncorrectTrigger(prev => prev + 1);
  };

  const handleLimpiar = () => {
    setRespuestaEstudiante('');
    setLimpiarKey(prev => prev + 1);
  };

  const handleSolicitarPista = (nivel: 1 | 2 | 3) => {
    // Mock de contenido de pista
    const contenidos = {
      1: 'Recuerda alinear los números por las unidades, decenas y centenas antes de operar.',
      2: 'Para esta operación, comienza desde las unidades (derecha) y avanza hacia la izquierda.',
      3: `El resultado correcto es aproximadamente ${Math.floor(problemaActual.resultado / 10) * 10}...`,
    };

    setPistaActual({
      nivel,
      contenido: contenidos[nivel],
    });
    setPistasUsadas([...pistasUsadas, nivel]);

    // TODO: Restar puntos si es nivel 3
    if (nivel === 3) {
      console.log('Restar 10 puntos');
    }
  };

  // Si la sesión está completada, mostrar pantalla de resultados
  if (sesionCompletada) {
    const problemasCorrectos = resultadosProblemas.filter(Boolean).length;
    const operacionesPracticadas = Array.from(
      new Set(problemas.map(p => p.operacion))
    ) as Operacion[];

    // Mock de datos de gamificación (TODO: obtener del backend)
    const puntosGanados = problemasCorrectos * 50;
    const medallasObtenidas: string[] = [];

    if (problemasCorrectos === problemas.length) {
      medallasObtenidas.push('Perfección Total');
    }
    if (problemasCorrectos >= problemas.length * 0.8) {
      medallasObtenidas.push('Experto en Matemáticas');
    }

    return (
      <SessionResults
        totalProblemas={problemas.length}
        problemasCorrectos={problemasCorrectos}
        operacionesPracticadas={operacionesPracticadas}
        nivelActual={3} // TODO: obtener del perfil del estudiante
        progresoNivel={65} // TODO: calcular basado en desempeño
        operacionesDominadas={
          problemasCorrectos === problemas.length ? operacionesPracticadas : []
        }
        puntosGanados={puntosGanados}
        medallasObtenidas={medallasObtenidas}
        rachaActual={7} // TODO: obtener del perfil del estudiante
        onContinuar={() => navigate('/student/dashboard')}
        onVerDetalles={() => {
          // TODO: Implementar vista detallada
          console.log('Ver detalles');
        }}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header compacto con progreso */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold">
                  Problema {indiceProblemActual + 1} de {problemas.length}
                </h2>
                <p className="text-muted-foreground">{problemaActual.pregunta}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/student/dashboard')}
            >
              <Home className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
          <Progress value={progreso} className="h-2" />
        </CardContent>
      </Card>

      {/* Intentos restantes */}
      {!mostrarFeedback && intentosRestantes < 3 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Te quedan <strong>{intentosRestantes}</strong> intento{intentosRestantes !== 1 ? 's' : ''}
          </AlertDescription>
        </Alert>
      )}

      {/* Problema */}
      <Card>
        <CardHeader>
          <CardTitle>
            {problemaActual.operacion === 'SUMA' && 'Suma'}
            {problemaActual.operacion === 'RESTA' && 'Resta'}
            {problemaActual.operacion === 'MULTIPLICACION' && 'Multiplicación'}
            {problemaActual.operacion === 'DIVISION' && 'División'}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ProblemGrid
            key={`problem-${indiceProblemActual}-${limpiarKey}`}
            operacion={problemaActual.operacion}
            numero1={problemaActual.numero1}
            numero2={problemaActual.numero2}
            resultado={problemaActual.resultado}
            onAnswerChange={setRespuestaEstudiante}
            showFeedback={mostrarFeedback}
            clearIncorrectTrigger={clearIncorrectTrigger}
          />
        </CardContent>
      </Card>

      {/* Acciones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setModalPistaAbierto(true)}
          disabled={mostrarFeedback}
        >
          <Lightbulb className="h-5 w-5 mr-2" />
          Pista ({pistasUsadas.length}/3)
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="lg"
              disabled={mostrarFeedback || !respuestaEstudiante}
            >
              <Eraser className="h-5 w-5 mr-2" />
              Limpiar
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Limpiar todas las respuestas?</AlertDialogTitle>
              <AlertDialogDescription>
                Esto borrará todas las respuestas que has ingresado en este problema. Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleLimpiar}>
                Sí, limpiar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {!mostrarFeedback ? (
          <Button
            size="lg"
            onClick={handleVerificar}
            disabled={!respuestaEstudiante}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Check className="h-5 w-5 mr-2" />
            Confirmar Respuesta
          </Button>
        ) : esRespuestaCorrecta ? (
          <Button
            size="lg"
            onClick={handleSiguiente}
            className="bg-green-600 hover:bg-green-700"
          >
            <ChevronRight className="h-5 w-5 mr-2" />
            Siguiente
          </Button>
        ) : intentosRestantes > 0 ? (
          <Button
            size="lg"
            onClick={handleReintentar}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Reintentar ({intentosRestantes} restantes)
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={handleSiguiente}
            variant="outline"
          >
            <ChevronRight className="h-5 w-5 mr-2" />
            Saltar Problema
          </Button>
        )}
      </div>

      {/* Feedback visual */}
      {mostrarFeedback && (
        <>
          <Card className={esRespuestaCorrecta ? 'border-green-500 bg-green-50' : 'border-orange-500 bg-orange-50'}>
            <CardContent className="pt-6 text-center">
              {esRespuestaCorrecta ? (
                <div className="space-y-2">
                  <div className="text-6xl">🎉</div>
                  <p className="text-2xl font-bold text-green-700">¡Excelente!</p>
                  <p className="text-gray-600">Tu respuesta es correcta</p>
                </div>
              ) : intentosRestantes > 0 ? (
                <div className="space-y-2">
                  <div className="text-6xl">💭</div>
                  <p className="text-2xl font-bold text-orange-700">Intenta de nuevo</p>
                  <p className="text-gray-600">Revisa tu respuesta, te quedan {intentosRestantes} intentos</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-6xl">📚</div>
                  <p className="text-2xl font-bold text-red-700">Sin intentos</p>
                  <p className="text-gray-600">La respuesta correcta era: {problemaActual.resultado}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Feedback detallado */}
          {validacionDetallada && !esRespuestaCorrecta && (
            <FeedbackDetallado
              esCorrecta={validacionDetallada.esCorrecta}
              resultadoCorrecto={validacionDetallada.resultadoCorrecto}
              pasosIntermediosCorrectos={validacionDetallada.pasosIntermediosCorrectos}
              operacion={problemaActual.operacion}
            />
          )}
        </>
      )}

      {/* Modal para seleccionar nivel de pista */}
      <HintModal
        open={modalPistaAbierto}
        onClose={() => setModalPistaAbierto(false)}
        onRequestHint={handleSolicitarPista}
        puntosDisponibles={puntosDisponibles}
        pistasUsadas={pistasUsadas}
      />

      {/* Display de pista solicitada */}
      {pistaActual && (
        <HintDisplay
          open={!!pistaActual}
          onClose={() => setPistaActual(null)}
          nivel={pistaActual.nivel}
          contenido={pistaActual.contenido}
        />
      )}
    </div>
  );
}
