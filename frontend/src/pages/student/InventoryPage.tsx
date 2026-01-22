/**
 * Página de Inventario del estudiante
 * Muestra solo los items que ya ha desbloqueado/comprado
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ArrowRight
} from 'lucide-react';
import {
  getTodosLosDesbloqueables,
  getDesbloqueablesPorCategoria,
  type CategoriaDesbloqueable,
  type DesbloquableDetallado,
  type RarezaItem
} from '@/types';

export function InventoryPage() {
  const navigate = useNavigate();

  // TODO: Obtener del perfil del estudiante via React Query
  const [_puntosDisponibles] = useState(1250);
  const [_nivelEstudiante] = useState(3);

  // Obtener todos los items y filtrar solo los desbloqueados
  const todosLosItems = getTodosLosDesbloqueables();
  const itemsDesbloqueados = todosLosItems.filter(item => item.estaDesbloqueado);

  // Estadísticas del inventario
  const totalItems = todosLosItems.length;
  const itemsObtenidos = itemsDesbloqueados.length;
  const porcentajeCompletado = Math.round((itemsObtenidos / totalItems) * 100);

  // Contar por categoría
  const contarPorCategoria = (categoria: CategoriaDesbloqueable) => {
    return itemsDesbloqueados.filter(item => item.categoria === categoria).length;
  };

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

  // Renderizar un item del inventario
  const renderItem = (item: DesbloquableDetallado) => {
    return (
      <Card
        key={item.id}
        className="border-2 border-green-200 bg-gradient-to-br from-green-50/50 to-white hover:shadow-lg transition-all"
      >
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            {/* Icono grande */}
            <div className="text-6xl">{item.icono}</div>

            <div className="flex flex-col gap-1 items-end">
              {/* Badge de rareza */}
              <Badge className={`${getRarezaColor(item.rareza)} text-xs`}>
                {item.rareza.toUpperCase()}
              </Badge>

              {/* Badge de gratuito */}
              {item.esGratuito && (
                <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-xs">
                  <Crown className="w-3 h-3 mr-1" />
                  GRATIS
                </Badge>
              )}
            </div>
          </div>

          <CardTitle className="text-lg">{item.nombre}</CardTitle>
          <CardDescription className="text-sm">
            {item.descripcion}
          </CardDescription>

          {/* Información del item */}
          <div className="mt-2 space-y-1 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-yellow-600" />
              <span>Valor: {item.precio} puntos</span>
            </div>
            {item.nivelRequerido > 1 && (
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-purple-600" />
                <span>Requería Nivel {item.nivelRequerido}</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              // TODO: Implementar previsualización o equipar
              console.log('Item seleccionado:', item.nombre);
            }}
          >
            Usar / Previsualizar
          </Button>
        </CardContent>
      </Card>
    );
  };

  // Filtrar items desbloqueados por categoría
  const getItemsDesbloqueadosPorTab = (categoria: CategoriaDesbloqueable | 'todos') => {
    if (categoria === 'todos') {
      return itemsDesbloqueados;
    }
    return getDesbloqueablesPorCategoria(categoria).filter(item => item.estaDesbloqueado);
  };

  // Mensaje cuando no hay items en una categoría
  const MensajeVacio = ({ categoria }: { categoria: string }) => (
    <div className="text-center py-12 space-y-4">
      <Package className="w-16 h-16 mx-auto text-gray-300" />
      <div className="space-y-2">
        <p className="text-lg font-medium text-gray-600">
          Aún no tienes {categoria} desbloqueados
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
  );

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

        {/* Botón a la tienda */}
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

      {/* Estadísticas del inventario */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Progreso general */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Package className="w-8 h-8 mx-auto text-green-600" />
              <div className="text-3xl font-bold text-green-700">
                {itemsObtenidos}/{totalItems}
              </div>
              <div className="text-sm text-gray-700 font-medium">
                Items Desbloqueados
              </div>
              <div className="text-xs text-gray-600">
                {porcentajeCompletado}% Completado
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Temas */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-4xl">🎭</div>
              <div className="text-2xl font-bold text-purple-700">
                {contarPorCategoria('tema')}
              </div>
              <div className="text-sm text-gray-700 font-medium">Temas</div>
            </div>
          </CardContent>
        </Card>

        {/* Colores */}
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-4xl">🎨</div>
              <div className="text-2xl font-bold text-orange-700">
                {contarPorCategoria('color')}
              </div>
              <div className="text-sm text-gray-700 font-medium">Colores</div>
            </div>
          </CardContent>
        </Card>

        {/* Efectos y Más */}
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

      {/* Mensaje si el inventario está vacío */}
      {itemsDesbloqueados.length === 0 && (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <Package className="w-20 h-20 mx-auto text-gray-300" />
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-700">
                  Tu inventario está vacío
                </h2>
                <p className="text-muted-foreground">
                  Comienza a ganar puntos completando ejercicios y visita la tienda para desbloquear tus primeros items
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                <Button
                  size="lg"
                  onClick={() => navigate('/student/practice')}
                  variant="outline"
                >
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

      {/* Tabs por categoría (solo si hay items) */}
      {itemsDesbloqueados.length > 0 && (
        <Tabs defaultValue="todos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="todos">
              Todos ({itemsDesbloqueados.length})
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
              {itemsDesbloqueados.map(renderItem)}
            </div>
          </TabsContent>

          {/* Tab: Temas */}
          <TabsContent value="tema">
            {getItemsDesbloqueadosPorTab('tema').length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getItemsDesbloqueadosPorTab('tema').map(renderItem)}
              </div>
            ) : (
              <MensajeVacio categoria="temas" />
            )}
          </TabsContent>

          {/* Tab: Fondos */}
          <TabsContent value="fondo">
            {getItemsDesbloqueadosPorTab('fondo').length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getItemsDesbloqueadosPorTab('fondo').map(renderItem)}
              </div>
            ) : (
              <MensajeVacio categoria="fondos" />
            )}
          </TabsContent>

          {/* Tab: Colores */}
          <TabsContent value="color">
            {getItemsDesbloqueadosPorTab('color').length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {getItemsDesbloqueadosPorTab('color').map(renderItem)}
              </div>
            ) : (
              <MensajeVacio categoria="colores" />
            )}
          </TabsContent>

          {/* Tab: Música */}
          <TabsContent value="musica">
            {getItemsDesbloqueadosPorTab('musica').length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getItemsDesbloqueadosPorTab('musica').map(renderItem)}
              </div>
            ) : (
              <MensajeVacio categoria="músicas" />
            )}
          </TabsContent>

          {/* Tab: Efectos */}
          <TabsContent value="efecto">
            {getItemsDesbloqueadosPorTab('efecto').length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getItemsDesbloqueadosPorTab('efecto').map(renderItem)}
              </div>
            ) : (
              <MensajeVacio categoria="efectos" />
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
