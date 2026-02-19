/**
 * Gestión de desafíos del profesor.
 * Lista de desafíos activos y completados con progreso por grupo.
 */

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Plus,
  Target,
  Calendar,
  Trophy,
  Users,
  CheckCircle,
  Trash2,
} from 'lucide-react';
import { teacherService } from '@/services/teacherService';
import { queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function ChallengesPage() {
  const [selectedTab, setSelectedTab] = useState<'active' | 'completed'>('active');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [desafioToDelete, setDesafioToDelete] = useState<number | null>(null);

  // Obtener desafíos
  const { data: desafios, isLoading } = useQuery({
    queryKey: ['teacher', 'challenges'],
    queryFn: () => teacherService.getDesafios(),
  });

  // Mutation para eliminar desafío
  const eliminarDesafioMutation = useMutation({
    mutationFn: (desafioId: number) => teacherService.eliminarDesafio(desafioId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher', 'challenges'] });
      setDeleteDialogOpen(false);
      setDesafioToDelete(null);
    },
  });

  // Filtrar desafíos por tab
  const filteredDesafios = desafios?.filter((d) => {
    if (d.eliminado) return false;
    if (selectedTab === 'active') return !d.completado;
    return d.completado;
  });

  // Contar desafíos
  const activeCount = desafios?.filter((d) => !d.completado && !d.eliminado).length || 0;
  const completedCount = desafios?.filter((d) => d.completado && !d.eliminado).length || 0;

  const handleDeleteClick = (desafioId: number) => {
    setDesafioToDelete(desafioId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (desafioToDelete) {
      eliminarDesafioMutation.mutate(desafioToDelete);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Desafíos</h1>
          <p className="text-muted-foreground">
            Gestiona desafíos para motivar a tus estudiantes
          </p>
        </div>
        <Link to="/teacher/challenges/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Crear Desafío
          </Button>
        </Link>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Desafíos</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{desafios?.filter((d) => !d.eliminado).length || 0}</div>
            <p className="text-xs text-muted-foreground">Activos y completados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activeCount}</div>
            <p className="text-xs text-muted-foreground">En progreso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados</CardTitle>
            <Trophy className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <p className="text-xs text-muted-foreground">Logrados</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Filtrado */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Desafíos</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">
                Activos ({activeCount})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completados ({completedCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-6">
              {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                  Cargando desafíos...
                </div>
              ) : filteredDesafios && filteredDesafios.length > 0 ? (
                <div className="space-y-4">
                  {filteredDesafios.map((desafio) => (
                    <Card key={desafio.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        {/* Header del Desafío */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-xl font-semibold">{desafio.nombre}</h3>
                              <Badge variant={desafio.completado ? 'default' : 'outline'}>
                                {desafio.completado ? 'Completado' : 'En progreso'}
                              </Badge>
                            </div>
                            {desafio.descripcion && (
                              <p className="text-sm text-muted-foreground">
                                {desafio.descripcion}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Target className="h-4 w-4" />
                                Meta: {desafio.objetivo_cantidad} {desafio.tipo}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(desafio.fecha_creacion).toLocaleDateString('es-ES')}
                              </span>
                              {desafio.fecha_limite && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  Límite: {new Date(desafio.fecha_limite).toLocaleDateString('es-ES')}
                                </span>
                              )}
                            </div>
                            {desafio.recompensa_texto && (
                              <div className="flex items-center gap-2 text-sm">
                                <Trophy className="h-4 w-4 text-yellow-500" />
                                <span className="font-medium">{desafio.recompensa_texto}</span>
                              </div>
                            )}
                          </div>
                          {!desafio.completado && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(desafio.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>

                        {/* Progreso por Grupo */}
                        {desafio.progreso_grupos && desafio.progreso_grupos.length > 0 && (
                          <div className="space-y-3 border-t pt-4">
                            <h4 className="font-semibold text-sm flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Progreso por Grupo
                            </h4>
                            {desafio.progreso_grupos.map((progreso) => (
                              <div key={progreso.grupo_id} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{progreso.nombre_grupo}</span>
                                    {progreso.completado && (
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    )}
                                  </div>
                                  <span className="text-muted-foreground">
                                    {progreso.progreso_actual} / {progreso.objetivo_cantidad} ({progreso.porcentaje.toFixed(0)}%)
                                  </span>
                                </div>
                                <Progress value={progreso.porcentaje} className="h-2" />
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  {selectedTab === 'active' ? (
                    <>
                      <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No hay desafíos activos
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Crea un desafío para motivar a tus estudiantes
                      </p>
                      <Link to="/teacher/challenges/new">
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Crear Primer Desafío
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Trophy className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No hay desafíos completados
                      </h3>
                      <p className="text-muted-foreground">
                        Los desafíos completados aparecerán aquí
                      </p>
                    </>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialog de Confirmación para Eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar desafío?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El desafío será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={eliminarDesafioMutation.isPending}
              className="bg-red-500 hover:bg-red-600"
            >
              {eliminarDesafioMutation.isPending ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
