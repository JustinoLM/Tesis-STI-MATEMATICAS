/**
 * Página de Inventario del estudiante
 * Muestra solo los items que ya ha desbloqueado/comprado (poseido: true)
 */

import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ShoppingBag,
  Sparkles,
  Crown,
  Package,
  TrendingUp,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { studentService, type ItemPoseido } from '@/services/studentService';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Mapa de categoría → rareza visual (el backend no devuelve rareza, la inferimos del precio) */
function inferirRareza(item: ItemPoseido): 'comun' | 'raro' | 'epico' | 'legendario' {
  if (item.es_tema_inicial) return 'comun';
  if (item.precio_puntos === 0) return 'comun';
  if (item.precio_puntos < 200) return 'raro';
  if (item.precio_puntos < 500) return 'epico';
  return 'legendario';
}

function getRarezaColor(rareza: string): string {
  switch (rareza) {
    case 'comun':
      return 'bg-gray-100 text-gray-700 border-gray-300';
    case 'raro':
      return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'epico':
      return 'bg-purple-100 text-purple-700 border-purple-300';
    case 'legendario':
      return 'bg-yellow-100 text-yellow-700 border-yellow-400';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

/** Emoji por defecto según el archivo_referencia del item */
function getIcono(item: ItemPoseido): string {
  const ref = item.archivo_referencia ?? '';
  if (ref.includes('oceano') || ref.includes('ocean')) return '🌊';
  if (ref.includes('espacio') || ref.includes('space')) return '🚀';
  if (ref.includes('bosque') || ref.includes('forest')) return '🌲';
  if (ref.includes('castillo') || ref.includes('castle')) return '🏰';
  if (ref.includes('montaña') || ref.includes('mountain')) return '⛰️';
  if (ref.includes('ciudad') || ref.includes('city')) return '🏙️';
  // Por categoría
  switch (item.categoria) {
    case 'tema':    return '🎭';
    case 'fondo':   return '🖼️';
    case 'color':   return '🎨';
    case 'musica':  return '🎵';
    case 'efecto':  return '✨';
    default:        return '📦';
  }
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function InventoryPage() {
  const navigate = useNavigate();

  // Catálogo completo con flag poseido real desde el backend
  const { data: catalogo, isLoading, isError } = useQuery({
    queryKey: ['catalogo-tienda'],
    queryFn: () => studentService.getCatalogo(),
    staleTime: 1000 * 60 * 5, // 5 min
  });

  // ── Derivar items poseídos ──────────────────────────────────────────────────
  const todosLosItems: ItemPoseido[] = catalogo
    ? [
        ...(catalogo.temas ?? []),
        ...(catalogo.fondos ?? []),
        ...(catalogo.colores ?? []),
        ...(catalogo.musicas ?? []),
        ...(catalogo.efectos ?? []),
      ]
    : [];

  const totalItems = todosLosItems.length;
  const itemsPoseidos = todosLosItems.filter(i => i.poseido);
  const itemsObtenidos = itemsPoseidos.length;
  const porcentajeCompletado = totalItems > 0 ? Math.round((itemsObtenidos / totalItems) * 100) : 0;

  const contarPorCategoria = (cat: string) =>
    itemsPoseidos.filter(i => i.categoria === cat).length;

  const getItemsPorCategoria = (cat: string) =>
    itemsPoseidos.filter(i => i.categoria === cat);

  // ── Render de un item ───────────────────────────────────────────────────────
  const renderItem = (item: ItemPoseido) => {
    const rareza = inferirRareza(item);
    return (
      <Card
        key={item.id}
        className="border-2 border-green-200 bg-gradient-to-br from-green-50/50 to-white hover:shadow-lg transition-all"
      >
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <div className="text-6xl">{getIcono(item)}</div>
            <div className="flex flex-col gap-1 items-end">
              <Badge className={`${getRarezaColor(rareza)} text-xs`}>
                {rareza.toUpperCase()}
              </Badge>
              {item.es_tema_inicial && (
                <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-xs">
                  <Crown className="w-3 h-3 mr-1" />
                  INICIAL
                </Badge>
              )}
            </div>
          </div>

          <CardTitle className="text-lg">{item.nombre}</CardTitle>
          <CardDescription className="text-sm">
            {item.descripcion ?? 'Sin descripción'}
          </CardDescription>

          <div className="mt-2 space-y-1 text-xs text-gray-600">
            {item.precio_puntos > 0 && (
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-600" />
                <span>Valor: {item.precio_puntos} puntos</span>
              </div>
            )}
            {item.nivel_minimo_requerido > 1 && (
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-purple-600" />
                <span>Requería Nivel {item.nivel_minimo_requerido}</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => navigate('/student/settings')}
          >
            Ver en Configuración
          </Button>
        </CardContent>
      </Card>
    );
  };

  // ── Estado de carga ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-3 text-gray-600">Cargando inventario...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-gray-600">No se pudo cargar el inventario.</p>
        <Button onClick={() => navigate('/student/shop')}>Ir a la Tienda</Button>
      </div>
    );
  }

  // ── UI ──────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mi Inventario</h1>
          <p className="text-muted-foreground">
            Tus desbloqueables y personalizaciones
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => navigate('/student/shop')}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          Ir a la Tienda
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Package className="w-8 h-8 mx-auto text-green-600" />
              <div className="text-3xl font-bold text-green-700">
                {itemsObtenidos}/{totalItems}
              </div>
              <div className="text-sm text-gray-700 font-medium">Items Desbloqueados</div>
              <div className="text-xs text-gray-600">{porcentajeCompletado}% Completado</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-4xl">🎭</div>
              <div className="text-2xl font-bold text-purple-700">{contarPorCategoria('tema')}</div>
              <div className="text-sm text-gray-700 font-medium">Temas</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-4xl">🎨</div>
              <div className="text-2xl font-bold text-orange-700">{contarPorCategoria('color')}</div>
              <div className="text-sm text-gray-700 font-medium">Colores</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-4xl">✨</div>
              <div className="text-2xl font-bold text-blue-700">
                {contarPorCategoria('efecto') + contarPorCategoria('fondo') + contarPorCategoria('musica')}
              </div>
              <div className="text-sm text-gray-700 font-medium">Extras</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventario vacío */}
      {itemsPoseidos.length === 0 && (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <Package className="w-20 h-20 mx-auto text-gray-300" />
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-700">Tu inventario está vacío</h2>
                <p className="text-muted-foreground">
                  Completa ejercicios para ganar puntos y visita la tienda para desbloquear items
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                <Button size="lg" variant="outline" onClick={() => navigate('/student/practice')}>
                  Practicar Ahora
                </Button>
                <Button
                  size="lg"
                  onClick={() => navigate('/student/shop')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Explorar Tienda
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs por categoría */}
      {itemsPoseidos.length > 0 && (
        <Tabs defaultValue="todos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="todos">Todos ({itemsPoseidos.length})</TabsTrigger>
            <TabsTrigger value="tema">🎭 Temas</TabsTrigger>
            <TabsTrigger value="fondo">🖼️ Fondos</TabsTrigger>
            <TabsTrigger value="color">🎨 Colores</TabsTrigger>
            <TabsTrigger value="musica">🎵 Música</TabsTrigger>
            <TabsTrigger value="efecto">✨ Efectos</TabsTrigger>
          </TabsList>

          <TabsContent value="todos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {itemsPoseidos.map(renderItem)}
            </div>
          </TabsContent>

          {(['tema', 'fondo', 'color', 'musica', 'efecto'] as const).map(cat => {
            const items = getItemsPorCategoria(cat);
            const labels: Record<string, string> = {
              tema: 'temas', fondo: 'fondos', color: 'colores',
              musica: 'músicas', efecto: 'efectos',
            };
            return (
              <TabsContent key={cat} value={cat}>
                {items.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map(renderItem)}
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <Package className="w-16 h-16 mx-auto text-gray-300" />
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-gray-600">
                        Aún no tienes {labels[cat]} desbloqueados
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Visita la tienda para obtener más items
                      </p>
                    </div>
                    <Button onClick={() => navigate('/student/shop')} className="mt-4">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Ir a la Tienda
                    </Button>
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div>
  );
}
