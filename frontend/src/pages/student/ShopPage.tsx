/**
 * Inventario/Tienda del estudiante
 * Muestra todos los desbloqueables organizados por categoría
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Lock,
  ShoppingCart,
  Sparkles,
  Crown,
  Check,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import {
  getTodosLosDesbloqueables,
  getDesbloqueablesPorCategoria,
  type CategoriaDesbloqueable,
  type DesbloquableDetallado,
  type RarezaItem
} from '@/types';

export function ShopPage() {
  // TODO: Obtener del perfil del estudiante via React Query
  const [puntosDisponibles] = useState(1250);
  const [nivelEstudiante] = useState(3); // Nivel del sistema adaptativo

  const todosLosItems = getTodosLosDesbloqueables();

  // Función para obtener el color del badge según la rareza
  const getRarezaColor = (rareza: RarezaItem): string => {
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
  };

  // Función para manejar la compra
  const handleComprar = (item: DesbloquableDetallado) => {
    if (puntosDisponibles >= item.precio && nivelEstudiante >= item.nivelRequerido) {
      console.log('Comprando:', item.nombre);
      // TODO: Mutation para comprar via React Query
      alert(`¡Has comprado ${item.nombre}!`);
    }
  };

  // Renderizar un item de la tienda
  const renderItem = (item: DesbloquableDetallado) => {
    const puedeComprar = !item.estaDesbloqueado &&
                         puntosDisponibles >= item.precio &&
                         nivelEstudiante >= item.nivelRequerido;

    const nivelBloqueado = nivelEstudiante < item.nivelRequerido;
    const puntosBloqueado = puntosDisponibles < item.precio;

    return (
      <Card
        key={item.id}
        className={`
          transition-all hover:shadow-lg
          ${item.estaDesbloqueado ? 'border-green-300 bg-green-50/30' : ''}
          ${nivelBloqueado ? 'opacity-60' : ''}
        `}
      >
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            {/* Icono grande */}
            <div className="text-6xl">{item.icono}</div>

            <div className="flex flex-col gap-1">
              {/* Badge de rareza */}
              <Badge className={`${getRarezaColor(item.rareza)} text-xs`}>
                {item.rareza.toUpperCase()}
              </Badge>

              {/* Estado */}
              {item.estaDesbloqueado && (
                <Badge className="bg-green-100 text-green-700 border-green-300">
                  <Check className="w-3 h-3 mr-1" />
                  Desbloqueado
                </Badge>
              )}

              {item.esGratuito && !item.estaDesbloqueado && (
                <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                  ¡GRATIS!
                </Badge>
              )}
            </div>
          </div>

          <CardTitle className="text-lg">{item.nombre}</CardTitle>
          <CardDescription className="text-sm">
            {item.descripcion}
          </CardDescription>

          {/* Requisitos */}
          <div className="mt-2 space-y-1 text-xs">
            {item.nivelRequerido > 1 && (
              <div className={`flex items-center gap-1 ${nivelBloqueado ? 'text-red-600' : 'text-gray-600'}`}>
                <TrendingUp className="w-3 h-3" />
                <span>Requiere Nivel {item.nivelRequerido}</span>
                {nivelBloqueado && (
                  <span className="text-red-600 font-medium">
                    (Tu nivel: {nivelEstudiante})
                  </span>
                )}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between">
            {/* Precio */}
            <div className="flex items-center gap-2">
              <Sparkles className={`h-5 w-5 ${puntosBloqueado ? 'text-gray-400' : 'text-yellow-600'}`} />
              <span className={`font-bold text-xl ${puntosBloqueado ? 'text-gray-400' : 'text-gray-900'}`}>
                {item.precio}
              </span>
              <span className="text-sm text-gray-500">pts</span>
            </div>

            {/* Botón de acción */}
            {item.estaDesbloqueado ? (
              <Button variant="outline" disabled size="sm">
                <Check className="h-4 w-4 mr-2" />
                En inventario
              </Button>
            ) : nivelBloqueado ? (
              <Button variant="secondary" disabled size="sm">
                <Lock className="h-4 w-4 mr-2" />
                Nivel {item.nivelRequerido}
              </Button>
            ) : item.esGratuito ? (
              <Button
                onClick={() => handleComprar(item)}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <Crown className="h-4 w-4 mr-2" />
                Reclamar
              </Button>
            ) : (
              <Button
                onClick={() => handleComprar(item)}
                disabled={!puedeComprar}
                size="sm"
              >
                {puntosBloqueado ? (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    {item.precio - puntosDisponibles} pts faltantes
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Comprar
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Filtrar items por categoría
  const getItemsPorTab = (categoria: CategoriaDesbloqueable | 'todos') => {
    if (categoria === 'todos') {
      return todosLosItems;
    }
    return getDesbloqueablesPorCategoria(categoria);
  };

  return (
    <div className="space-y-6">
      {/* Header con puntos disponibles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tienda de Desbloqueables</h1>
          <p className="text-muted-foreground">
            Personaliza tu experiencia con temas, colores, música y efectos
          </p>
        </div>

        {/* Card de puntos */}
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
          <CardContent className="pt-6 pb-4 px-6">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-yellow-600" />
                <span className="text-3xl font-bold text-yellow-700">
                  {puntosDisponibles}
                </span>
              </div>
              <span className="text-sm text-gray-600 font-medium">
                Puntos Disponibles
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información de nivel */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <span className="text-blue-900">
              <strong>Tu nivel actual: {nivelEstudiante}</strong> - Algunos items requieren niveles más altos para desbloquearse.
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Tabs por categoría */}
      <Tabs defaultValue="todos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="todos">
            Todos
          </TabsTrigger>
          <TabsTrigger value="tema">
            🎭 Temas
          </TabsTrigger>
          <TabsTrigger value="fondo">
            🖼️ Fondos
          </TabsTrigger>
          <TabsTrigger value="color">
            🎨 Colores
          </TabsTrigger>
          <TabsTrigger value="musica">
            🎵 Música
          </TabsTrigger>
          <TabsTrigger value="efecto">
            ✨ Efectos
          </TabsTrigger>
        </TabsList>

        {/* Tab: Todos */}
        <TabsContent value="todos">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todosLosItems.map(renderItem)}
          </div>
        </TabsContent>

        {/* Tab: Temas */}
        <TabsContent value="tema">
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Los temas cambian la narrativa completa de tu experiencia de aprendizaje.
              Cada tema incluye colores, efectos de victoria y una historia única.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getItemsPorTab('tema').map(renderItem)}
            </div>
          </div>
        </TabsContent>

        {/* Tab: Fondos */}
        <TabsContent value="fondo">
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Personaliza el fondo de tus ejercicios con estos diseños únicos.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getItemsPorTab('fondo').map(renderItem)}
            </div>
          </div>
        </TabsContent>

        {/* Tab: Colores */}
        <TabsContent value="color">
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Dale un toque personal con tu color favorito. Algunos colores premium requieren nivel 2.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {getItemsPorTab('color').map(renderItem)}
            </div>
          </div>
        </TabsContent>

        {/* Tab: Música */}
        <TabsContent value="musica">
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Música de fondo para mejorar tu concentración. <strong>Requiere nivel 3.</strong>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getItemsPorTab('musica').map(renderItem)}
            </div>
          </div>
        </TabsContent>

        {/* Tab: Efectos */}
        <TabsContent value="efecto">
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Efectos especiales que aparecen cuando resuelves problemas correctamente.
              Los efectos avanzados requieren niveles más altos.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getItemsPorTab('efecto').map(renderItem)}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
