/**
 * Página de Medallero - Muestra todas las medallas/insignias del estudiante.
 * Total: 18 medallas organizadas por categorías
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Lock, Star } from 'lucide-react';

interface BadgeData {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: 'aprendizaje' | 'volumen' | 'exploracion' | 'desafios' | 'secretas';
  unlocked: boolean;
  unlockedAt?: string;
  isSecret?: boolean;
}

export function BadgesPage() {
  // TODO: Obtener de React Query en subsección posterior
  const badges: BadgeData[] = [
    // Por Aprendizaje (10 medallas)
    {
      id: 1,
      name: 'Principiante',
      description: 'Completar diagnóstico inicial',
      icon: '🌱',
      category: 'aprendizaje',
      unlocked: true,
      unlockedAt: '2024-01-10',
    },
    {
      id: 2,
      name: 'Aprendiz',
      description: 'Alcanzar nivel 2',
      icon: '📚',
      category: 'aprendizaje',
      unlocked: true,
      unlockedAt: '2024-01-15',
    },
    {
      id: 3,
      name: 'Competente',
      description: 'Alcanzar nivel 3',
      icon: '🎓',
      category: 'aprendizaje',
      unlocked: true,
      unlockedAt: '2024-01-22',
    },
    {
      id: 4,
      name: 'Avanzado',
      description: 'Alcanzar nivel 4',
      icon: '🏆',
      category: 'aprendizaje',
      unlocked: false,
    },
    {
      id: 5,
      name: 'Maestro',
      description: 'Alcanzar nivel 5',
      icon: '👑',
      category: 'aprendizaje',
      unlocked: false,
    },
    {
      id: 6,
      name: 'Sumador',
      description: 'Nivel 3 en sumas',
      icon: '➕',
      category: 'aprendizaje',
      unlocked: true,
      unlockedAt: '2024-01-20',
    },
    {
      id: 7,
      name: 'Restador',
      description: 'Nivel 3 en restas',
      icon: '➖',
      category: 'aprendizaje',
      unlocked: false,
    },
    {
      id: 8,
      name: 'Multiplicador',
      description: 'Nivel 3 en multiplicación',
      icon: '✖️',
      category: 'aprendizaje',
      unlocked: false,
    },
    {
      id: 9,
      name: 'Divisor',
      description: 'Nivel 3 en división',
      icon: '➗',
      category: 'aprendizaje',
      unlocked: false,
    },
    {
      id: 10,
      name: 'Matemático Completo',
      description: 'Nivel 3 en todas las operaciones',
      icon: '🧮',
      category: 'aprendizaje',
      unlocked: false,
    },

    // Por Volumen (3 medallas)
    {
      id: 11,
      name: '100 Club',
      description: '100 problemas resueltos',
      icon: '💯',
      category: 'volumen',
      unlocked: true,
      unlockedAt: '2024-01-18',
    },
    {
      id: 12,
      name: '500 Club',
      description: '500 problemas resueltos',
      icon: '🎯',
      category: 'volumen',
      unlocked: false,
    },
    {
      id: 13,
      name: '1000 Club',
      description: '1000 problemas resueltos',
      icon: '🌟',
      category: 'volumen',
      unlocked: false,
    },

    // Por Exploración (2 medallas)
    {
      id: 14,
      name: 'Explorador',
      description: 'Completar 1 práctica con cada uno de los 6 temas',
      icon: '🔍',
      category: 'exploracion',
      unlocked: false,
    },
    {
      id: 15,
      name: 'Coleccionista',
      description: 'Comprar 20 ítems diferentes',
      icon: '🎨',
      category: 'exploracion',
      unlocked: false,
    },

    // Por Desafíos (3 medallas)
    {
      id: 16,
      name: 'Colaborador',
      description: 'Participar en 1 desafío grupal completado',
      icon: '🤝',
      category: 'desafios',
      unlocked: false,
    },
    {
      id: 17,
      name: 'Cooperador',
      description: 'Completar 3 desafíos grupales',
      icon: '👥',
      category: 'desafios',
      unlocked: false,
    },
    {
      id: 18,
      name: 'Líder de Equipo',
      description: 'Completar 5 desafíos grupales',
      icon: '⭐',
      category: 'desafios',
      unlocked: false,
    },
  ];

  // Medallas secretas (aparecen después de desbloquear)
  const secretBadges: BadgeData[] = [
    {
      id: 19,
      name: 'Maestro de Sumas',
      description: 'Nivel 5 en sumas',
      icon: '➕',
      category: 'secretas',
      unlocked: false,
      isSecret: true,
    },
    {
      id: 20,
      name: 'Maestro de Restas',
      description: 'Nivel 5 en restas',
      icon: '➖',
      category: 'secretas',
      unlocked: false,
      isSecret: true,
    },
    {
      id: 21,
      name: 'Maestro de Multiplicación',
      description: 'Nivel 5 en multiplicación',
      icon: '✖️',
      category: 'secretas',
      unlocked: false,
      isSecret: true,
    },
    {
      id: 22,
      name: 'Maestro de División',
      description: 'Nivel 5 en división',
      icon: '➗',
      category: 'secretas',
      unlocked: false,
      isSecret: true,
    },
    {
      id: 23,
      name: 'Gran Maestro',
      description: 'Nivel 5 en todas las operaciones',
      icon: '🏅',
      category: 'secretas',
      unlocked: false,
      isSecret: true,
    },
    {
      id: 24,
      name: 'Coleccionista Supremo',
      description: 'Comprar todos los elementos de la tienda',
      icon: '💎',
      category: 'secretas',
      unlocked: false,
      isSecret: true,
    },
    {
      id: 25,
      name: 'Leyenda Matemática',
      description: 'Desbloquear todas las demás medallas',
      icon: '🔥',
      category: 'secretas',
      unlocked: false,
      isSecret: true,
    },
  ];

  const allBadges = [...badges, ...secretBadges.filter(b => b.unlocked || !b.isSecret)];
  const unlockedCount = allBadges.filter(b => b.unlocked).length;
  const totalCount = badges.length + secretBadges.length;

  const categoryNames = {
    aprendizaje: 'Por Aprendizaje',
    volumen: 'Por Volumen',
    exploracion: 'Por Exploración',
    desafios: 'Por Desafíos',
    secretas: 'Medallas Secretas',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-yellow-50 to-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-600" />
            <div>
              <h1 className="text-2xl font-bold">Medallero</h1>
              <p className="text-sm text-gray-600 font-normal">
                {unlockedCount} de {totalCount} medallas desbloqueadas
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-yellow-500 h-3 rounded-full transition-all"
              style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Medallas por categoría */}
      {Object.entries(categoryNames).map(([category, title]) => {
        const categoryBadges = category === 'secretas'
          ? secretBadges.filter(b => b.unlocked || !b.isSecret)
          : badges.filter(b => b.category === category);

        if (categoryBadges.length === 0) return null;

        return (
          <div key={category}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              {category === 'secretas' && <Star className="h-5 w-5 text-yellow-500" />}
              {title}
              <span className="text-sm font-normal text-gray-500">
                ({categoryBadges.filter(b => b.unlocked).length}/{categoryBadges.length})
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categoryBadges.map((badge) => (
                <Card
                  key={badge.id}
                  className={`transition-all ${
                    badge.unlocked
                      ? 'hover:shadow-lg border-2 border-yellow-200'
                      : 'opacity-60 grayscale'
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-4xl">{badge.icon}</span>
                      {badge.unlocked ? (
                        <Badge variant="default" className="bg-green-500">
                          Desbloqueada
                        </Badge>
                      ) : badge.isSecret ? (
                        <Badge variant="secondary" className="bg-purple-500">
                          <Lock className="h-3 w-3 mr-1" />
                          Secreta
                        </Badge>
                      ) : (
                        <Lock className="h-5 w-5 text-gray-400" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-bold text-lg mb-2">{badge.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
                    {badge.unlocked && badge.unlockedAt && (
                      <p className="text-xs text-gray-500">
                        Desbloqueada: {new Date(badge.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
