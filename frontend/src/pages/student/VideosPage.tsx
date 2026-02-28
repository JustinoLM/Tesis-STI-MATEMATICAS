/**
 * Página de Videos Educativos Guardados (Sección 4.4.4)
 * GET /videos/gallery
 *
 * Muestra la galería personal de videos guardados durante la práctica.
 * Máximo 10 videos (FIFO).
 */

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Video,
  Play,
  CheckCircle2,
  Clock,
  BookOpen,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { studentService, type VideoEducativoResponse } from '@/services/studentService';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuracion(segundos: number): string {
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function getOperacionLabel(op: string): string {
  const labels: Record<string, string> = {
    suma: 'Suma',
    resta: 'Resta',
    multiplicacion: 'Multiplicación',
    division: 'División',
  };
  return labels[op] ?? op;
}

function getOperacionEmoji(op: string): string {
  const emojis: Record<string, string> = {
    suma: '➕',
    resta: '➖',
    multiplicacion: '✖️',
    division: '➗',
  };
  return emojis[op] ?? '📐';
}

// ─── Sub-componente: tarjeta de video ─────────────────────────────────────────

function VideoCard({ video }: { video: VideoEducativoResponse }) {
  const porcentaje =
    video.duracion_segundos > 0
      ? Math.min(100, Math.round((video.progreso_segundos / video.duracion_segundos) * 100))
      : 0;

  const estaCompleto = video.visto || porcentaje >= 95;

  return (
    <Card
      className={`transition-all hover:shadow-lg ${
        estaCompleto
          ? 'border-green-200 bg-gradient-to-br from-white to-green-50/30'
          : 'border-blue-100 bg-gradient-to-br from-white to-blue-50/20'
      }`}
    >
      <CardContent className="p-4 space-y-3">
        {/* Thumbnail / Icono */}
        <div className="relative">
          {video.thumbnail_url ? (
            <img
              src={video.thumbnail_url}
              alt={video.titulo}
              className="w-full h-32 object-cover rounded-md"
            />
          ) : (
            <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-md flex items-center justify-center">
              <Video className="h-12 w-12 text-blue-400" />
            </div>
          )}

          {/* Duración */}
          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded font-mono">
            {formatDuracion(video.duracion_segundos)}
          </span>

          {/* Estado visto */}
          {estaCompleto && (
            <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Visto
            </span>
          )}
        </div>

        {/* Info */}
        <div className="space-y-1">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2">{video.titulo}</h3>
          {video.descripcion && (
            <p className="text-xs text-gray-500 line-clamp-2">{video.descripcion}</p>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs">
            {getOperacionEmoji(video.operacion)} {getOperacionLabel(video.operacion)}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Nivel {video.nivel_dificultad}
          </Badge>
          {video.fuente === 'youtube' && (
            <Badge variant="outline" className="text-xs text-red-600 border-red-200">
              YouTube
            </Badge>
          )}
        </div>

        {/* Barra de progreso */}
        {!estaCompleto && porcentaje > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Progreso
              </span>
              <span>{porcentaje}%</span>
            </div>
            <Progress value={porcentaje} className="h-1.5" />
          </div>
        )}

        {/* Botón ver */}
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-md bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors"
        >
          <Play className="h-4 w-4" />
          {estaCompleto ? 'Ver de nuevo' : porcentaje > 0 ? 'Continuar' : 'Ver video'}
          <ExternalLink className="h-3 w-3 opacity-70" />
        </a>
      </CardContent>
    </Card>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────────

export function VideosPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['galeria-videos'],
    queryFn: () => studentService.getGaleriaVideos(),
    staleTime: 1000 * 60 * 2, // 2 min (cambia cuando el estudiante practica)
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Video className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold">Mis Videos</h1>
        </div>
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            <Video className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No se pudieron cargar los videos.</p>
            <p className="text-sm mt-1">Intenta de nuevo más tarde.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const videos = data?.videos ?? [];
  const total = data?.total ?? 0;
  const maximo = data?.maximo ?? 10;
  const vistos = videos.filter(v => v.visto || (v.duracion_segundos > 0 && v.progreso_segundos / v.duracion_segundos >= 0.95)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Video className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold">Mis Videos</h1>
        </div>
        {total > 0 && (
          <span className="text-sm text-gray-500">
            {total}/{maximo} guardados · {vistos} vistos
          </span>
        )}
      </div>

      {/* Capacidad de la galería */}
      {total > 0 && (
        <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700">
          <BookOpen className="h-4 w-4 shrink-0" />
          <span>
            Tu galería puede guardar hasta <strong>{maximo} videos</strong>. Cuando se llene,
            el más antiguo se eliminará automáticamente.
          </span>
        </div>
      )}

      {/* Galería */}
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center text-gray-500">
            <Video className="h-16 w-16 mx-auto mb-4 text-gray-200" />
            <h2 className="text-lg font-semibold text-gray-400 mb-2">
              Aún no tienes videos guardados
            </h2>
            <p className="text-sm max-w-xs mx-auto">
              Cuando practiques y el sistema detecte un error, te recomendará videos para
              ayudarte. Puedes guardarlos aquí para verlos después.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
