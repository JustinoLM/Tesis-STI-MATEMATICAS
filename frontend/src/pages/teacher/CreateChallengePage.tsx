/**
 * Página para crear nuevos desafíos.
 * Formulario con validación para crear desafíos grupales.
 */

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Target } from 'lucide-react';
import { teacherService } from '@/services/teacherService';
import { queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function CreateChallengePage() {
  const navigate = useNavigate();

  // State del formulario
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState('problemas_resueltos');
  const [objetivoCantidad, setObjetivoCantidad] = useState('');
  const [recompensaTexto, setRecompensaTexto] = useState('');
  const [fechaLimite, setFechaLimite] = useState('');
  const [gruposIds, setGruposIds] = useState<number[]>([]);

  // Obtener grupos
  const { data: grupos } = useQuery({
    queryKey: ['teacher', 'groups'],
    queryFn: () => teacherService.getGrupos(),
  });

  // Mutation para crear desafío
  const crearDesafioMutation = useMutation({
    mutationFn: (data: {
      nombre: string;
      descripcion?: string;
      tipo: string;
      objetivo_cantidad: number;
      recompensa_texto?: string;
      grupos_ids: number[];
      fecha_limite?: string;
    }) => teacherService.crearDesafio(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher', 'challenges'] });
      navigate('/teacher/challenges');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !objetivoCantidad || gruposIds.length === 0) {
      return;
    }

    crearDesafioMutation.mutate({
      nombre,
      descripcion: descripcion || undefined,
      tipo,
      objetivo_cantidad: parseInt(objetivoCantidad),
      recompensa_texto: recompensaTexto || undefined,
      grupos_ids: gruposIds,
      fecha_limite: fechaLimite || undefined,
    });
  };

  const toggleGrupo = (grupoId: number) => {
    if (gruposIds.includes(grupoId)) {
      setGruposIds(gruposIds.filter((id) => id !== grupoId));
    } else {
      setGruposIds([...gruposIds, grupoId]);
    }
  };

  const selectAllGroups = () => {
    if (grupos) {
      setGruposIds(grupos.map((g) => g.id));
    }
  };

  const deselectAllGroups = () => {
    setGruposIds([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link to="/teacher/challenges">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Desafíos
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mt-2">Crear Nuevo Desafío</h1>
        <p className="text-muted-foreground">
          Crea un desafío para motivar a tus estudiantes
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          {/* Información Básica */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Desafío</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Desafío *</Label>
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="ej. Resolver 100 problemas esta semana"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción (opcional)</Label>
                <Textarea
                  id="descripcion"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Agrega detalles sobre el desafío"
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Desafío</Label>
                  <select
                    id="tipo"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="problemas_resueltos">Problemas Resueltos</option>
                    <option value="racha_consecutiva">Racha Consecutiva</option>
                    <option value="precision_promedio">Precisión Promedio (%)</option>
                    <option value="nivel_alcanzado">Nivel Alcanzado</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objetivo">Cantidad Objetivo *</Label>
                  <Input
                    id="objetivo"
                    type="number"
                    min="1"
                    value={objetivoCantidad}
                    onChange={(e) => setObjetivoCantidad(e.target.value)}
                    placeholder="ej. 100"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recompensa">Recompensa (opcional)</Label>
                <Input
                  id="recompensa"
                  value={recompensaTexto}
                  onChange={(e) => setRecompensaTexto(e.target.value)}
                  placeholder="ej. 500 monedas + avatar especial"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha_limite">Fecha Límite (opcional)</Label>
                <Input
                  id="fecha_limite"
                  type="date"
                  value={fechaLimite}
                  onChange={(e) => setFechaLimite(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Selección de Grupos */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Grupos Participantes *</CardTitle>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={selectAllGroups}
                  >
                    Seleccionar Todos
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={deselectAllGroups}
                  >
                    Deseleccionar Todos
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {grupos && grupos.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {grupos.map((grupo) => (
                    <label
                      key={grupo.id}
                      className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                        gruposIds.includes(grupo.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-muted hover:border-muted-foreground/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={gruposIds.includes(grupo.id)}
                        onChange={() => toggleGrupo(grupo.id)}
                        className="h-4 w-4"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{grupo.nombre}</p>
                        <p className="text-sm text-muted-foreground">
                          {grupo.cantidad_estudiantes} estudiantes
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    No tienes grupos creados aún
                  </p>
                  <Link to="/teacher/groups/new">
                    <Button variant="link">
                      <Plus className="mr-2 h-4 w-4" />
                      Crear primer grupo
                    </Button>
                  </Link>
                </div>
              )}
              {gruposIds.length === 0 && grupos && grupos.length > 0 && (
                <p className="text-sm text-red-500 mt-3">
                  * Debes seleccionar al menos un grupo
                </p>
              )}
            </CardContent>
          </Card>

          {/* Botones de Acción */}
          <div className="flex gap-3 justify-end">
            <Link to="/teacher/challenges">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={
                !nombre ||
                !objetivoCantidad ||
                gruposIds.length === 0 ||
                crearDesafioMutation.isPending
              }
            >
              {crearDesafioMutation.isPending ? 'Creando...' : 'Crear Desafío'}
            </Button>
          </div>

          {/* Error Message */}
          {crearDesafioMutation.isError && (
            <Card className="border-red-500">
              <CardContent className="p-4">
                <p className="text-sm text-red-500">
                  Error al crear el desafío. Por favor intenta nuevamente.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </form>
    </div>
  );
}
