/**
 * Página de búsqueda y listado de estudiantes.
 * Permite buscar estudiantes por nombre o código y ver su información básica.
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, GraduationCap, TrendingUp, Users, Eye } from 'lucide-react';
import { teacherService } from '@/services/teacherService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Por ahora, obtenemos todos los grupos para mostrar estudiantes
  const { data: grupos } = useQuery({
    queryKey: ['teacher', 'groups'],
    queryFn: () => teacherService.getGrupos(),
  });

  // Obtener todos los estudiantes de todos los grupos
  const allStudents = grupos?.flatMap((grupo) =>
    grupo.estudiantes?.map((est) => ({
      ...est,
      grupo_nombre: grupo.nombre,
      grupo_id: grupo.id,
    })) || []
  ) || [];

  // Filtrar estudiantes según búsqueda
  const filteredStudents = searchQuery
    ? allStudents.filter(
        (student) =>
          student.nombre_completo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.codigo_estudiante.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allStudents;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Estudiantes</h1>
        <p className="text-muted-foreground">
          Busca y monitorea el progreso de tus estudiantes
        </p>
      </div>

      {/* Buscador */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o código de estudiante..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Limpiar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allStudents.length}</div>
            <p className="text-xs text-muted-foreground">En todos los grupos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resultados</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredStudents.length}</div>
            <p className="text-xs text-muted-foreground">
              {searchQuery ? 'Coincidencias' : 'Mostrando todos'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Grupos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{grupos?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Grupos activos</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Estudiantes */}
      <Card>
        <CardHeader>
          <CardTitle>
            {searchQuery ? 'Resultados de Búsqueda' : 'Todos los Estudiantes'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? 'No se encontraron resultados' : 'No hay estudiantes'}
              </h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? 'Intenta con otro término de búsqueda'
                  : 'Los estudiantes aparecerán aquí cuando se unan a tus grupos'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Código</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Nombre</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Grupo</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Nivel</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Precisión</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Estado</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredStudents.map((student) => (
                    <tr key={`${student.grupo_id}-${student.estudiante_id}`} className="hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {student.codigo_estudiante}
                        </code>
                      </td>
                      <td className="px-4 py-3 font-medium">{student.nombre_completo}</td>
                      <td className="px-4 py-3">
                        <Link to={`/teacher/groups/${student.grupo_id}`}>
                          <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                            {student.grupo_nombre}
                          </Badge>
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary">Nivel {student.nivel_actual}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <TrendingUp
                            className={`h-4 w-4 ${
                              student.precision_ultimos_15 >= 80
                                ? 'text-green-500'
                                : student.precision_ultimos_15 >= 60
                                ? 'text-yellow-500'
                                : 'text-red-500'
                            }`}
                          />
                          <span className="font-medium">
                            {student.precision_ultimos_15.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={student.activo ? 'default' : 'secondary'}>
                          {student.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link to={`/teacher/students/${student.estudiante_id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalle
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
