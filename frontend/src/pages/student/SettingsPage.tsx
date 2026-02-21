/**
 * Página de configuración y personalización — Sección 4.4.6
 *
 * Secciones:
 *   1. Personalización Visual → selector de tema, fondo, color
 *   2. Audio               → toggle + selector de música + volumen
 *   3. Notificaciones      → toggle general + toggles individuales
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Palette, Volume2, Bell, VolumeX, Check, Lock } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import {
  TEMAS,
  getFondosPorTema,
  getMusicasPorTema,
  COLORES,
  FONDOS,
  type Desbloqueable,
} from '@/types/shop';

// ---------------------------------------------------------------
// Sub-componente: Tarjeta de selección genérica
// ---------------------------------------------------------------
interface SelectCardProps {
  item: Desbloqueable;
  isActive: boolean;
  isLocked: boolean;
  onClick: () => void;
  previewContent?: React.ReactNode;
}

function SelectCard({ item, isActive, isLocked, onClick, previewContent }: SelectCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={`
        relative rounded-xl border-2 p-3 text-left transition-all w-full
        ${isActive
          ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/30'
          : isLocked
          ? 'border-dashed border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
          : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50 cursor-pointer'
        }
      `}
    >
      {/* Indicador activo */}
      {isActive && (
        <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
          <Check className="h-3 w-3" />
        </span>
      )}

      {/* Indicador bloqueado */}
      {isLocked && (
        <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 text-white">
          <Lock className="h-3 w-3" />
        </span>
      )}

      {/* Preview o icono */}
      <div className="mb-2 flex items-center justify-center h-14 rounded-lg bg-gray-100 overflow-hidden">
        {previewContent ?? (
          <span className="text-3xl">{item.icono}</span>
        )}
      </div>

      <p className="text-xs font-semibold text-gray-800 truncate">{item.nombre}</p>
    </button>
  );
}

// ---------------------------------------------------------------
// Sub-componente: Toggle switch
// ---------------------------------------------------------------
interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}

function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none
          ${checked ? 'bg-primary' : 'bg-gray-200'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform
            ${checked ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------
// Página principal
// ---------------------------------------------------------------
export function SettingsPage() {
  const {
    temaActivoId,
    colorActivoId,
    audioActivado,
    volumen,
    notificacionesActivadas,
    notifDesafios,
    notifLogros,
    notifRecordatorios,
    preferenciasPorTema,
    setTemaActivo,
    setFondoActivo,
    setMusicaActiva,
    setColorActivo,
    setAudioActivado,
    setVolumen,
    setNotificacionesActivadas,
    setNotifDesafios,
    setNotifLogros,
    setNotifRecordatorios,
    getTemaActivo,
    getFondoActivo,
    getMusicaActiva,
  } = useThemeStore();

  const temaActivo = getTemaActivo();
  const fondoActivo = getFondoActivo();
  const musicaActiva = getMusicaActiva();
  const prefsDelTema = preferenciasPorTema[temaActivoId];

  // Fondos del tema activo (index 1, 2, 3 con fondoTipo)
  const fondosDelTema = getFondosPorTema(temaActivoId);

  // Músicas del tema activo
  const musicasDelTema = getMusicasPorTema(temaActivoId);

  // TODO: En producción, obtener del perfil del estudiante via React Query
  // para saber qué items tiene desbloqueados
  const itemDesbloqueado = (_id: string) => true; // Simulado: todo desbloqueado para pruebas

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Configuración</h1>
      </div>

      {/* ================================================================
          SECCIÓN 1: PERSONALIZACIÓN VISUAL
          ================================================================ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-purple-600" />
            Personalización Visual
          </CardTitle>
          <CardDescription>
            Elige tu tema narrativo, fondo y color de interfaz
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* ---- Selector de Tema ---- */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Tema Narrativo</h3>
              <Badge variant="outline" className="text-xs">
                {temaActivo?.icono} {temaActivo?.nombre}
              </Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {TEMAS.map(tema => {
                const desbloqueado = tema.esGratuito || itemDesbloqueado(tema.id);
                return (
                  <SelectCard
                    key={tema.id}
                    item={tema}
                    isActive={temaActivoId === tema.id}
                    isLocked={!desbloqueado}
                    onClick={() => desbloqueado && setTemaActivo(tema.id)}
                    previewContent={
                      <div
                        className="w-full h-full flex flex-col items-center justify-center gap-1"
                        style={{ background: tema.config?.colorAccent ?? '#F3F4F6' }}
                      >
                        <span className="text-2xl">{tema.icono}</span>
                        <div
                          className="w-6 h-1.5 rounded-full"
                          style={{ background: tema.config?.colorPrimario }}
                        />
                      </div>
                    }
                  />
                );
              })}
            </div>

            {/* Vocabulario del tema activo */}
            {temaActivo && temaActivoId !== 'tema-default' && (
              <div
                className="mt-3 rounded-lg px-4 py-3 text-sm border"
                style={{
                  background: temaActivo.config?.colorAccent ?? '#F3F4F6',
                  borderColor: temaActivo.config?.colorPrimario + '40',
                }}
              >
                <p className="font-medium" style={{ color: temaActivo.config?.colorSecundario }}>
                  Vista previa del vocabulario:
                </p>
                <p className="mt-1 text-gray-700 italic">
                  "{temaActivo.config?.vocabulario?.correcto}"
                </p>
              </div>
            )}
          </div>

          {/* ---- Selector de Fondo ---- */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Fondo de Práctica</h3>
              {fondoActivo ? (
                <Badge variant="outline" className="text-xs">
                  {fondoActivo.icono} {fondoActivo.nombre}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  Sin fondo
                </Badge>
              )}
            </div>

            {temaActivoId === 'tema-default' ? (
              /* Tema clásico: solo fondos genéricos */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                <button
                  onClick={() => setFondoActivo(null)}
                  className={`
                    relative rounded-xl border-2 p-3 text-center transition-all
                    ${!prefsDelTema?.fondoActivoId
                      ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/30'
                      : 'border-dashed border-gray-300 hover:border-primary/50 hover:bg-gray-50'
                    }
                  `}
                >
                  {!prefsDelTema?.fondoActivoId && (
                    <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                  <div className="mb-2 flex items-center justify-center h-14 rounded-lg bg-gray-50 border border-dashed border-gray-300">
                    <span className="text-2xl">🚫</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-500">Sin fondo</p>
                </button>
                {FONDOS.filter(f => !f.config?.temaId).map(fondo => {
                  const desbloqueado = itemDesbloqueado(fondo.id);
                  const isActive = prefsDelTema?.fondoActivoId === fondo.id;
                  return (
                    <SelectCard
                      key={fondo.id}
                      item={fondo}
                      isActive={isActive}
                      isLocked={!desbloqueado}
                      onClick={() => desbloqueado && setFondoActivo(fondo.id)}
                      previewContent={
                        fondo.config?.urlImagen ? (
                          <img src={fondo.config.urlImagen} alt={fondo.nombre} className="w-full h-full object-cover" />
                        ) : fondo.config?.colorHex ? (
                          <div className="w-full h-full rounded-lg" style={{ background: fondo.config.colorHex }} />
                        ) : undefined
                      }
                    />
                  );
                })}
              </div>
            ) : (
              /* Temas narrativos: 3 slots fijos por tipo + opción sin fondo */
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Sin fondo */}
                <button
                  onClick={() => setFondoActivo(null)}
                  className={`
                    relative rounded-xl border-2 p-3 text-center transition-all
                    ${!prefsDelTema?.fondoActivoId
                      ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/30'
                      : 'border-dashed border-gray-300 hover:border-primary/50 hover:bg-gray-50'
                    }
                  `}
                >
                  {!prefsDelTema?.fondoActivoId && (
                    <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                  <div className="mb-2 flex items-center justify-center h-14 rounded-lg bg-gray-50 border border-dashed border-gray-300">
                    <span className="text-2xl">🚫</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-500">Sin fondo</p>
                </button>

                {/* Los 3 slots fijos: ilustración, dibujo, estampado */}
                {(
                  [
                    { tipo: 'ilustracion' as const, etiqueta: 'Ilustración',  descripcionDefault: 'Escena del tema' },
                    { tipo: 'dibujo'      as const, etiqueta: 'Dibujo',       descripcionDefault: 'Arte del tema'   },
                    { tipo: 'estampado'   as const, etiqueta: 'Estampado',    descripcionDefault: 'Patrón del tema' },
                  ]
                ).map(({ tipo, etiqueta, descripcionDefault }) => {
                  const fondo = fondosDelTema.find(f => f.config?.fondoTipo === tipo);
                  const isActive = fondo ? prefsDelTema?.fondoActivoId === fondo.id : false;
                  const desbloqueado = fondo ? itemDesbloqueado(fondo.id) : false;

                  return (
                    <button
                      key={tipo}
                      onClick={() => fondo && desbloqueado && setFondoActivo(fondo.id)}
                      disabled={!fondo || !desbloqueado}
                      className={`
                        relative rounded-xl border-2 p-3 text-left transition-all w-full
                        ${isActive
                          ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/30'
                          : !fondo || !desbloqueado
                          ? 'border-dashed border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                          : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50 cursor-pointer'
                        }
                      `}
                    >
                      {isActive && (
                        <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                      {fondo && !desbloqueado && (
                        <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 text-white">
                          <Lock className="h-3 w-3" />
                        </span>
                      )}
                      {/* Preview */}
                      <div className="mb-2 flex items-center justify-center h-14 rounded-lg bg-gray-100 overflow-hidden">
                        {fondo?.config?.urlImagen ? (
                          <img
                            src={fondo.config.urlImagen}
                            alt={fondo.nombre}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : (
                          <span className="text-2xl">{fondo?.icono ?? '🖼️'}</span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-gray-700">{etiqueta}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {fondo ? fondo.nombre : descripcionDefault}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ---- Selector de Color de Interfaz ---- */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Color de Interfaz</h3>
              {colorActivoId ? (
                <Badge variant="outline" className="text-xs">
                  {COLORES.find(c => c.id === colorActivoId)?.icono}{' '}
                  {COLORES.find(c => c.id === colorActivoId)?.nombre}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  Color del tema
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {/* Opción "Color del tema" */}
              <button
                onClick={() => setColorActivo(null)}
                title="Usar color del tema"
                className={`
                  relative h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all
                  ${!colorActivoId
                    ? 'border-primary ring-2 ring-primary/50 scale-110'
                    : 'border-gray-300 hover:border-gray-400'
                  }
                `}
                style={{ background: temaActivo?.config?.colorPrimario ?? '#3B82F6' }}
              >
                {!colorActivoId && (
                  <Check className="h-4 w-4 text-white drop-shadow" />
                )}
              </button>

              {COLORES.map(color => {
                const desbloqueado = itemDesbloqueado(color.id);
                const isActive = colorActivoId === color.id;
                const isGradient = color.config?.colorHex?.startsWith('linear-gradient');

                return (
                  <button
                    key={color.id}
                    onClick={() => desbloqueado && setColorActivo(color.id)}
                    disabled={!desbloqueado}
                    title={color.nombre}
                    className={`
                      relative h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all
                      ${isActive
                        ? 'border-gray-800 ring-2 ring-gray-400 scale-110'
                        : !desbloqueado
                        ? 'border-dashed border-gray-200 opacity-40 cursor-not-allowed'
                        : 'border-transparent hover:border-gray-400 hover:scale-105'
                      }
                    `}
                    style={{
                      background: isGradient
                        ? color.config?.colorHex
                        : color.config?.colorHex ?? '#ccc',
                    }}
                  >
                    {isActive && (
                      <Check className="h-4 w-4 text-white drop-shadow" />
                    )}
                    {!desbloqueado && (
                      <Lock className="h-3 w-3 text-gray-400" />
                    )}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              El primer círculo usa el color del tema activo. Los demás son colores personalizados de tu inventario.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ================================================================
          SECCIÓN 2: AUDIO
          ================================================================ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {audioActivado
              ? <Volume2 className="h-5 w-5 text-blue-600" />
              : <VolumeX className="h-5 w-5 text-gray-400" />
            }
            Audio
          </CardTitle>
          <CardDescription>
            Música de fondo durante la práctica
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Toggle general */}
          <Toggle
            checked={audioActivado}
            onChange={setAudioActivado}
            label="Música activada"
            description="Reproduce música de fondo mientras practicas"
          />

          {audioActivado && (
            <>
              {/* Control de volumen */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Volumen</span>
                  <span className="text-sm text-muted-foreground">{volumen}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volumen}
                  onChange={e => setVolumen(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              {/* Selector de música del tema activo */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Música del tema
                    <span className="ml-1 text-muted-foreground font-normal">
                      ({temaActivo?.nombre})
                    </span>
                  </h3>
                  {musicaActiva ? (
                    <Badge variant="outline" className="text-xs">
                      {musicaActiva.icono} {musicaActiva.nombre}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      Sin música
                    </Badge>
                  )}
                </div>

                {temaActivoId === 'tema-default' ? (
                  <p className="text-sm text-muted-foreground py-3 text-center">
                    El tema Clásico no tiene música. Elige un tema narrativo para desbloquear las canciones.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    {/* Opción "Sin música" */}
                    <button
                      onClick={() => setMusicaActiva(null)}
                      className={`
                        rounded-xl border-2 p-3 text-left transition-all
                        ${!prefsDelTema?.musicaActivaId
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-dashed border-gray-300 hover:border-primary/50'
                        }
                      `}
                    >
                      <div className="flex flex-col items-center gap-1 text-center">
                        <span className="text-2xl">🔇</span>
                        <p className="text-xs font-semibold text-gray-600">Sin música</p>
                        <p className="text-xs text-muted-foreground">Silencio</p>
                        {!prefsDelTema?.musicaActivaId && (
                          <Check className="h-4 w-4 text-primary mt-1" />
                        )}
                      </div>
                    </button>

                    {/* Los 3 slots fijos por tipo semántico */}
                    {(
                      [
                        { tipo: 'tranquila',  etiqueta: 'Tranquila',   descripcion: 'Para concentrarse', icono: '🎵' },
                        { tipo: 'energetica', etiqueta: 'Energética',  descripcion: 'Para motivarse',    icono: '🎸' },
                        { tipo: 'ambiente',   etiqueta: 'Ambiente',    descripcion: 'Sonidos del tema',  icono: '🌿' },
                      ] as const
                    ).map(({ tipo, etiqueta, descripcion, icono }) => {
                      // Buscar la canción del tema activo que corresponde a este tipo
                      const musica = musicasDelTema.find(m => m.config?.musicaTipo === tipo);
                      const isActive = musica ? prefsDelTema?.musicaActivaId === musica.id : false;
                      const desbloqueado = musica ? itemDesbloqueado(musica.id) : false;

                      return (
                        <button
                          key={tipo}
                          onClick={() => musica && desbloqueado && setMusicaActiva(musica.id)}
                          disabled={!musica || !desbloqueado}
                          title={musica?.nombre ?? `${etiqueta} (no disponible)`}
                          className={`
                            rounded-xl border-2 p-3 text-center transition-all
                            ${isActive
                              ? 'border-primary bg-primary/5 shadow-sm'
                              : !musica || !desbloqueado
                              ? 'border-dashed border-gray-200 opacity-50 cursor-not-allowed'
                              : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50 cursor-pointer'
                            }
                          `}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-2xl">{musica?.icono ?? icono}</span>
                            <p className="text-xs font-semibold text-gray-800">{etiqueta}</p>
                            <p className="text-xs text-muted-foreground leading-tight">
                              {musica ? musica.nombre : descripcion}
                            </p>
                            {isActive && <Check className="h-4 w-4 text-primary mt-1" />}
                            {musica && !desbloqueado && <Lock className="h-3 w-3 text-gray-400 mt-1" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* ================================================================
          SECCIÓN 3: NOTIFICACIONES
          ================================================================ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-500" />
            Notificaciones
          </CardTitle>
          <CardDescription>
            Controla qué alertas quieres recibir
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="divide-y">
            <Toggle
              checked={notificacionesActivadas}
              onChange={setNotificacionesActivadas}
              label="Notificaciones activadas"
              description="Activa o desactiva todas las notificaciones"
            />

            {notificacionesActivadas && (
              <>
                <Toggle
                  checked={notifDesafios}
                  onChange={setNotifDesafios}
                  label="Desafíos grupales"
                  description="Aviso cuando el profesor crea un nuevo desafío"
                />
                <Toggle
                  checked={notifLogros}
                  onChange={setNotifLogros}
                  label="Logros y medallas"
                  description="Aviso cuando obtienes una nueva insignia"
                />
                <Toggle
                  checked={notifRecordatorios}
                  onChange={setNotifRecordatorios}
                  label="Recordatorios de práctica"
                  description="Aviso para no perder tu racha de estudio"
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
