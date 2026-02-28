/**
 * Página de práctica del estudiante.
 *
 * Flujo real con backend:
 * 1. Al montar → POST /adaptive/practice/start → obtiene sesion_id + todos los problemas
 * 2. Al verificar → POST /practices/{id}/submit-problem → valida, registra, devuelve siguiente
 * 3. Cuando sesion_completada=true → GET /gamification/session/{id}/rewards → resultados
 * 4. Pistas → POST /hints/request → contenido real (LLM para nivel 3)
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
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
import { Lightbulb, Check, ChevronRight, Home, AlertCircle, Eraser, Loader2 } from 'lucide-react';
import { ProblemGrid, FeedbackDetallado } from '@/components/problems';
import { HintModal } from '@/components/problems/HintModal';
import { HintDisplay } from '@/components/problems/HintDisplay';
import { SessionResults } from '@/components/practice';
import type { Operacion, RespuestaValidacion } from '@/types';
import { validarRespuesta } from '@/utils';
import {
  studentService,
  type ProblemaBE,
  type RecompensasSesionResponse,
} from '@/services/studentService';

// ─── Tipos locales ────────────────────────────────────────────────────────────

/** Problema tal como lo usa el UI (con campos numéricos ya parseados) */
interface ProblemaUI {
  id: number;
  operacion: Operacion;
  numero1: number;
  numero2: number;
  nivel_dificultad: number;
  cantidad_decimales: number;
  pregunta: string;
}

/** Resultado de cada problema al final de la sesión */
interface ResultadoProblema {
  correcto: boolean;
  operacion: Operacion;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const OPERACION_MAP: Record<string, Operacion> = {
  '+': 'SUMA',
  '-': 'RESTA',
  '×': 'MULTIPLICACION',
  '÷': 'DIVISION',
  SUMA: 'SUMA',
  RESTA: 'RESTA',
  MULTIPLICACION: 'MULTIPLICACION',
  DIVISION: 'DIVISION',
};

const OPERACION_LABEL: Record<Operacion, string> = {
  SUMA: 'Suma',
  RESTA: 'Resta',
  MULTIPLICACION: 'Multiplicación',
  DIVISION: 'División',
};

function mapearProblema(be: ProblemaBE): ProblemaUI {
  const op = OPERACION_MAP[String(be.operacion).toUpperCase()] ?? 'SUMA';
  const n1 = Number(be.numero1);
  const n2 = Number(be.numero2);
  const opSimbolo =
    op === 'SUMA' ? '+' : op === 'RESTA' ? '−' : op === 'MULTIPLICACION' ? '×' : '÷';
  return {
    id: be.id,
    operacion: op,
    numero1: n1,
    numero2: n2,
    nivel_dificultad: be.nivel_dificultad,
    cantidad_decimales: be.cantidad_decimales,
    pregunta: be.pregunta ?? `Resuelve: ${n1} ${opSimbolo} ${n2}`,
  };
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function PracticePage() {
  const navigate = useNavigate();

  // ── Estado de sesión ──────────────────────────────────────────────────────
  const [sesionId, setSesionId] = useState<number | null>(null);
  const [problemas, setProblemas] = useState<ProblemaUI[]>([]);
  const [mensajeIntro, setMensajeIntro] = useState('');
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [errorSesion, setErrorSesion] = useState<string | null>(null);

  // ── Estado del problema actual ────────────────────────────────────────────
  const [indiceProblemActual, setIndiceProblemActual] = useState(0);
  const [respuestaEstudiante, setRespuestaEstudiante] = useState('');
  const [intentosRestantes, setIntentosRestantes] = useState(3);
  const [mostrarFeedback, setMostrarFeedback] = useState(false);
  const [esRespuestaCorrecta, setEsRespuestaCorrecta] = useState(false);
  const [validacionDetallada, setValidacionDetallada] = useState<RespuestaValidacion | null>(null);
  const [respuestaCorrectaBE, setRespuestaCorrectaBE] = useState<string | null>(null);
  const [limpiarKey, setLimpiarKey] = useState(0);
  const [clearIncorrectTrigger, setClearIncorrectTrigger] = useState(0);

  // ── Tiempo de resolución ──────────────────────────────────────────────────
  const tiempoInicioProblema = useRef<number>(Date.now());

  // ── Pistas ────────────────────────────────────────────────────────────────
  const [modalPistaAbierto, setModalPistaAbierto] = useState(false);
  const [pistaActual, setPistaActual] = useState<{ nivel: 1 | 2 | 3; contenido: string } | null>(
    null
  );
  const [pistasUsadas, setPistasUsadas] = useState<number[]>([]);
  const [cargandoPista, setCargandoPista] = useState(false);

  // ── Resultados de sesión ──────────────────────────────────────────────────
  const [sesionCompletada, setSesionCompletada] = useState(false);
  const [resultadosProblemas, setResultadosProblemas] = useState<ResultadoProblema[]>([]);
  const [recompensas, setRecompensas] = useState<RecompensasSesionResponse | null>(null);

  // ── Derivados ─────────────────────────────────────────────────────────────
  const problemaActual = problemas[indiceProblemActual] ?? null;
  const progreso =
    problemas.length > 0
      ? Math.round(((indiceProblemActual + 1) / problemas.length) * 100)
      : 0;

  // ── Mutation de envío de respuesta ────────────────────────────────────────

  const submitMutation = useMutation({
    mutationFn: ({
      problemaId,
      respuesta,
      tiempoResolucion,
    }: {
      problemaId: number;
      respuesta: number;
      tiempoResolucion: number;
    }) => studentService.enviarRespuesta(sesionId!, problemaId, respuesta, tiempoResolucion),

    onSuccess: async (data) => {
      setMostrarFeedback(true);
      setEsRespuestaCorrecta(data.es_correcto);
      setIntentosRestantes(data.intentos_restantes);

      if (!data.es_correcto && data.respuesta_correcta) {
        setRespuestaCorrectaBE(data.respuesta_correcta);
      }

      // Feedback visual local (pasos intermedios)
      if (problemaActual) {
        const respNum = parseFloat(respuestaEstudiante.replace(',', '.'));
        const respCorrecta = data.respuesta_correcta
          ? parseFloat(data.respuesta_correcta)
          : respNum;
        const validacion = validarRespuesta(
          problemaActual.operacion,
          String(respNum),
          problemaActual.numero1,
          problemaActual.numero2,
          data.es_correcto ? respNum : respCorrecta
        );
        setValidacionDetallada(validacion);
      }

      // Sesión terminada: completar → calcular puntos → pedir recompensas
      if (data.sesion_completada) {
        setResultadosProblemas((prev) => [
          ...prev,
          { correcto: data.es_correcto, operacion: problemaActual?.operacion ?? 'SUMA' },
        ]);
        try {
          await studentService.finalizarPractica(sesionId!);
        } catch {
          // Si falla el complete, igual continuamos para mostrar resultados
        }
        try {
          const recs = await studentService.getRecompensasSesion(sesionId!);
          setRecompensas(recs);
        } catch {
          // Si falla, igual mostramos la pantalla de resultados
        }
        setSesionCompletada(true);
      }
    },
  });

  // ── Iniciar sesión al montar ──────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;
    setCargandoSesion(true);
    setErrorSesion(null);

    studentService
      .iniciarPractica()
      .then((data) => {
        if (cancelled) return;
        setSesionId(data.sesion_id);
        setProblemas(data.problemas.map(mapearProblema));
        setMensajeIntro(data.mensaje_intro);
        tiempoInicioProblema.current = Date.now();
      })
      .catch((err: Error) => {
        if (cancelled) return;
        // Si el error es por diagnóstico pendiente, redirigir automáticamente
        if (err.message.toLowerCase().includes('diagnóstico') || err.message.toLowerCase().includes('diagnostico')) {
          navigate('/student/diagnostic', { replace: true });
        } else {
          setErrorSesion(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) setCargandoSesion(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Reiniciar timer cuando cambia de problema
  useEffect(() => {
    tiempoInicioProblema.current = Date.now();
  }, [indiceProblemActual]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleVerificar = useCallback(() => {
    if (!respuestaEstudiante || !problemaActual || sesionId === null) return;
    const tiempoSegundos = Math.max(
      1,
      Math.round((Date.now() - tiempoInicioProblema.current) / 1000)
    );
    const respuestaNum = parseFloat(respuestaEstudiante.replace(',', '.'));
    if (isNaN(respuestaNum)) return;

    submitMutation.mutate({
      problemaId: problemaActual.id,
      respuesta: respuestaNum,
      tiempoResolucion: tiempoSegundos,
    });
  }, [respuestaEstudiante, problemaActual, sesionId, submitMutation]);

  const handleSiguiente = useCallback(() => {
    // Registrar resultado antes de avanzar (solo si no fue auto-registrado por sesion_completada)
    setResultadosProblemas((prev) => [
      ...prev,
      { correcto: esRespuestaCorrecta, operacion: problemaActual?.operacion ?? 'SUMA' },
    ]);
    setIndiceProblemActual((prev) => prev + 1);
    setRespuestaEstudiante('');
    setMostrarFeedback(false);
    setEsRespuestaCorrecta(false);
    setValidacionDetallada(null);
    setRespuestaCorrectaBE(null);
    setIntentosRestantes(3);
    setPistasUsadas([]);
    setPistaActual(null);
  }, [esRespuestaCorrecta, problemaActual]);

  const handleReintentar = useCallback(() => {
    setMostrarFeedback(false);
    setClearIncorrectTrigger((prev) => prev + 1);
  }, []);

  const handleLimpiar = useCallback(() => {
    setRespuestaEstudiante('');
    setLimpiarKey((prev) => prev + 1);
  }, []);

  const handleSolicitarPista = useCallback(
    async (nivel: 1 | 2 | 3) => {
      if (!sesionId || !problemaActual || cargandoPista) return;
      setModalPistaAbierto(false);
      setCargandoPista(true);
      try {
        const pista = await studentService.solicitarPista(sesionId, problemaActual.id, nivel);
        setPistaActual({ nivel, contenido: pista.contenido });
        setPistasUsadas((prev) => [...prev, nivel]);
      } catch {
        // Fallback genérico si el servicio de pistas falla
        const fallback: Record<number, string> = {
          1: 'Recuerda alinear los números por el punto decimal antes de operar.',
          2: 'Comienza desde las unidades (derecha) y avanza hacia la izquierda.',
          3: 'Revisa cuidadosamente cada paso de la operación.',
        };
        setPistaActual({ nivel, contenido: fallback[nivel] });
        setPistasUsadas((prev) => [...prev, nivel]);
      } finally {
        setCargandoPista(false);
      }
    },
    [sesionId, problemaActual, cargandoPista]
  );

  // ── Pantalla de carga ─────────────────────────────────────────────────────

  if (cargandoSesion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-muted-foreground">Preparando tu práctica...</p>
      </div>
    );
  }

  // ── Pantalla de error ─────────────────────────────────────────────────────

  if (errorSesion) {
    return (
      <div className="max-w-md mx-auto mt-20 space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorSesion}</AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/student/dashboard')} className="w-full">
          Volver al inicio
        </Button>
      </div>
    );
  }

  // ── Pantalla de resultados ────────────────────────────────────────────────

  if (sesionCompletada) {
    const problemasCorrectos = resultadosProblemas.filter((r) => r.correcto).length;
    const operacionesPracticadas = Array.from(
      new Set(resultadosProblemas.map((r) => r.operacion))
    ) as Operacion[];

    return (
      <SessionResults
        totalProblemas={problemas.length}
        problemasCorrectos={problemasCorrectos}
        operacionesPracticadas={operacionesPracticadas}
        nivelActual={problemaActual?.nivel_dificultad ?? 1}
        progresoNivel={Math.round((problemasCorrectos / Math.max(problemas.length, 1)) * 100)}
        operacionesDominadas={
          problemasCorrectos === problemas.length ? operacionesPracticadas : []
        }
        puntosGanados={recompensas?.puntos_ganados ?? 0}
        medallasObtenidas={recompensas?.medallas_nuevas.map((m) => m.nombre) ?? []}
        rachaActual={0}
        onContinuar={() => navigate('/student/dashboard')}
        onVerDetalles={() => navigate('/student/progress')}
      />
    );
  }

  if (!problemaActual) return null;

  // ── Vista principal ───────────────────────────────────────────────────────

  const enviando = submitMutation.isPending;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Mensaje introductorio (solo al primer problema) */}
      {indiceProblemActual === 0 && mensajeIntro && (
        <Alert>
          <AlertDescription>{mensajeIntro}</AlertDescription>
        </Alert>
      )}

      {/* Header con progreso */}
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
            Te quedan <strong>{intentosRestantes}</strong> intento
            {intentosRestantes !== 1 ? 's' : ''}
          </AlertDescription>
        </Alert>
      )}

      {/* Problema */}
      <Card>
        <CardHeader>
          <CardTitle>{OPERACION_LABEL[problemaActual.operacion]}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ProblemGrid
            key={`problem-${indiceProblemActual}-${limpiarKey}`}
            operacion={problemaActual.operacion}
            numero1={problemaActual.numero1}
            numero2={problemaActual.numero2}
            resultado={0}
            onAnswerChange={setRespuestaEstudiante}
            showFeedback={mostrarFeedback}
            clearIncorrectTrigger={clearIncorrectTrigger}
          />
        </CardContent>
      </Card>

      {/* Acciones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pista */}
        <Button
          variant="outline"
          size="lg"
          onClick={() => setModalPistaAbierto(true)}
          disabled={mostrarFeedback || cargandoPista || pistasUsadas.length >= 3}
        >
          {cargandoPista ? (
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          ) : (
            <Lightbulb className="h-5 w-5 mr-2" />
          )}
          Pista ({pistasUsadas.length}/3)
        </Button>

        {/* Limpiar */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="lg"
              disabled={mostrarFeedback || !respuestaEstudiante || enviando}
            >
              <Eraser className="h-5 w-5 mr-2" />
              Limpiar
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Limpiar todas las respuestas?</AlertDialogTitle>
              <AlertDialogDescription>
                Esto borrará todas las respuestas que has ingresado. No se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleLimpiar}>Sí, limpiar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Verificar / Siguiente / Reintentar */}
        {!mostrarFeedback ? (
          <Button
            size="lg"
            onClick={handleVerificar}
            disabled={!respuestaEstudiante || enviando}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {enviando ? (
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <Check className="h-5 w-5 mr-2" />
            )}
            {enviando ? 'Verificando...' : 'Confirmar Respuesta'}
          </Button>
        ) : esRespuestaCorrecta ? (
          <Button size="lg" onClick={handleSiguiente} className="bg-green-600 hover:bg-green-700">
            <ChevronRight className="h-5 w-5 mr-2" />
            Siguiente
          </Button>
        ) : intentosRestantes > 0 ? (
          <Button size="lg" onClick={handleReintentar} className="bg-orange-600 hover:bg-orange-700">
            Reintentar ({intentosRestantes} restantes)
          </Button>
        ) : (
          <Button size="lg" onClick={handleSiguiente} variant="outline">
            <ChevronRight className="h-5 w-5 mr-2" />
            Siguiente Problema
          </Button>
        )}
      </div>

      {/* Feedback visual */}
      {mostrarFeedback && (
        <>
          <Card
            className={
              esRespuestaCorrecta
                ? 'border-green-500 bg-green-50'
                : 'border-orange-500 bg-orange-50'
            }
          >
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
                  <p className="text-gray-600">
                    Revisa tu respuesta, te quedan {intentosRestantes} intento
                    {intentosRestantes !== 1 ? 's' : ''}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-6xl">📚</div>
                  <p className="text-2xl font-bold text-red-700">Sin intentos</p>
                  {respuestaCorrectaBE && (
                    <p className="text-gray-600">
                      La respuesta correcta era: <strong>{respuestaCorrectaBE}</strong>
                    </p>
                  )}
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

      {/* Modal de pistas */}
      <HintModal
        open={modalPistaAbierto}
        onClose={() => setModalPistaAbierto(false)}
        onRequestHint={handleSolicitarPista}
        puntosDisponibles={0}
        pistasUsadas={pistasUsadas}
      />

      {/* Display de pista */}
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
