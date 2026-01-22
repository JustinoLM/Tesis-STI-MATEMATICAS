/**
 * Sistema de Desbloqueables para la Tienda
 * Incluye temas narrativos, fondos, colores, música y efectos especiales
 */

export type CategoriaDesbloqueable =
  | 'tema'      // 6 narrativas (500 pts c/u, 1 gratis)
  | 'fondo'     // 3 fondos (75 pts c/u)
  | 'color'     // 12 colores (50 pts c/u)
  | 'musica'    // 3 músicas (100 pts c/u, req. nivel 3)
  | 'efecto';   // 5 efectos (100-150 pts)

export type RarezaItem = 'comun' | 'raro' | 'epico' | 'legendario';

export interface Desbloqueable {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: CategoriaDesbloqueable;
  precio: number; // En puntos de XP
  nivelRequerido: number; // Nivel del sistema adaptativo requerido
  rareza: RarezaItem;
  icono?: string; // URL o emoji
  preview?: string; // URL de preview
  estaDesbloqueado: boolean;
  esGratuito: boolean; // Para el tema inicial

  // Propiedades específicas por categoría
  config?: {
    // Para temas
    colorPrimario?: string;
    colorSecundario?: string;
    efectoVictoria?: string; // Nombre del efecto de victoria

    // Para fondos
    urlImagen?: string;
    patron?: 'solido' | 'gradiente' | 'patron';

    // Para colores
    colorHex?: string;
    aplicaA?: 'interfaz' | 'problemas' | 'ambos';

    // Para música
    urlAudio?: string;
    duracion?: number; // En segundos
    tipo?: 'energica' | 'concentracion' | 'aventura';

    // Para efectos
    animacion?: string; // Nombre de la animación
    duracionMs?: number;
    sonido?: string;
  };
}

// Temas narrativos (6 total, 1 gratis)
export const TEMAS: Desbloqueable[] = [
  {
    id: 'tema-clasico',
    nombre: 'Clásico Matemático',
    descripcion: 'El tema tradicional para aprender matemáticas',
    categoria: 'tema',
    precio: 0,
    nivelRequerido: 1,
    rareza: 'comun',
    icono: '📐',
    estaDesbloqueado: true,
    esGratuito: true,
    config: {
      colorPrimario: '#3B82F6',
      colorSecundario: '#1E40AF',
      efectoVictoria: 'estrellas',
    }
  },
  {
    id: 'tema-piratas',
    nombre: 'Piratas del Caribe',
    descripcion: 'Navega por los mares mientras resuelves problemas',
    categoria: 'tema',
    precio: 500,
    nivelRequerido: 1,
    rareza: 'raro',
    icono: '🏴‍☠️',
    estaDesbloqueado: false,
    esGratuito: false,
    config: {
      colorPrimario: '#92400E',
      colorSecundario: '#451A03',
      efectoVictoria: 'cannonballs',
    }
  },
  {
    id: 'tema-espacio',
    nombre: 'Explorador Espacial',
    descripcion: 'Viaja entre las estrellas resolviendo ecuaciones cósmicas',
    categoria: 'tema',
    precio: 500,
    nivelRequerido: 2,
    rareza: 'raro',
    icono: '🚀',
    estaDesbloqueado: false,
    esGratuito: false,
    config: {
      colorPrimario: '#7C3AED',
      colorSecundario: '#4C1D95',
      efectoVictoria: 'shooting-stars',
    }
  },
  {
    id: 'tema-medieval',
    nombre: 'Reino Medieval',
    descripcion: 'Conviértete en un caballero de las matemáticas',
    categoria: 'tema',
    precio: 500,
    nivelRequerido: 2,
    rareza: 'epico',
    icono: '⚔️',
    estaDesbloqueado: false,
    esGratuito: false,
    config: {
      colorPrimario: '#DC2626',
      colorSecundario: '#7F1D1D',
      efectoVictoria: 'sword-slash',
    }
  },
  {
    id: 'tema-laboratorio',
    nombre: 'Laboratorio Científico',
    descripcion: 'Experimenta con números como un científico loco',
    categoria: 'tema',
    precio: 500,
    nivelRequerido: 3,
    rareza: 'epico',
    icono: '🧪',
    estaDesbloqueado: false,
    esGratuito: false,
    config: {
      colorPrimario: '#059669',
      colorSecundario: '#064E3B',
      efectoVictoria: 'chemistry-explosion',
    }
  },
  {
    id: 'tema-futuro',
    nombre: 'Ciudad Futurista',
    descripcion: 'Vive en el futuro con hologramas matemáticos',
    categoria: 'tema',
    precio: 500,
    nivelRequerido: 4,
    rareza: 'legendario',
    icono: '🤖',
    estaDesbloqueado: false,
    esGratuito: false,
    config: {
      colorPrimario: '#06B6D4',
      colorSecundario: '#164E63',
      efectoVictoria: 'hologram-burst',
    }
  },
];

// Fondos (3 total)
export const FONDOS: Desbloqueable[] = [
  {
    id: 'fondo-papel',
    nombre: 'Papel Cuadriculado',
    descripcion: 'Un fondo clásico de cuaderno matemático',
    categoria: 'fondo',
    precio: 75,
    nivelRequerido: 1,
    rareza: 'comun',
    icono: '📄',
    estaDesbloqueado: false,
    esGratuito: false,
    config: {
      patron: 'patron',
      urlImagen: '/fondos/papel-cuadriculado.png',
    }
  },
  {
    id: 'fondo-pizarra',
    nombre: 'Pizarra Verde',
    descripcion: 'Como estar en un salón de clases',
    categoria: 'fondo',
    precio: 75,
    nivelRequerido: 1,
    rareza: 'comun',
    icono: '🟩',
    estaDesbloqueado: false,
    esGratuito: false,
    config: {
      patron: 'solido',
      colorHex: '#065F46',
    }
  },
  {
    id: 'fondo-galaxia',
    nombre: 'Galaxia Infinita',
    descripcion: 'Un fondo espacial con estrellas brillantes',
    categoria: 'fondo',
    precio: 75,
    nivelRequerido: 2,
    rareza: 'raro',
    icono: '🌌',
    estaDesbloqueado: false,
    esGratuito: false,
    config: {
      patron: 'gradiente',
      urlImagen: '/fondos/galaxia.jpg',
    }
  },
];

// Colores (12 total)
export const COLORES: Desbloqueable[] = [
  // Colores básicos (Nivel 1)
  {
    id: 'color-azul',
    nombre: 'Azul Océano',
    descripcion: 'Un azul profundo y relajante',
    categoria: 'color',
    precio: 50,
    nivelRequerido: 1,
    rareza: 'comun',
    icono: '🔵',
    estaDesbloqueado: false,
    esGratuito: false,
    config: { colorHex: '#3B82F6', aplicaA: 'interfaz' }
  },
  {
    id: 'color-verde',
    nombre: 'Verde Bosque',
    descripcion: 'Natural y reconfortante',
    categoria: 'color',
    precio: 50,
    nivelRequerido: 1,
    rareza: 'comun',
    icono: '🟢',
    estaDesbloqueado: false,
    esGratuito: false,
    config: { colorHex: '#10B981', aplicaA: 'interfaz' }
  },
  {
    id: 'color-rojo',
    nombre: 'Rojo Energía',
    descripcion: 'Lleno de energía y pasión',
    categoria: 'color',
    precio: 50,
    nivelRequerido: 1,
    rareza: 'comun',
    icono: '🔴',
    estaDesbloqueado: false,
    esGratuito: false,
    config: { colorHex: '#EF4444', aplicaA: 'interfaz' }
  },
  {
    id: 'color-amarillo',
    nombre: 'Amarillo Sol',
    descripcion: 'Brillante y alegre',
    categoria: 'color',
    precio: 50,
    nivelRequerido: 1,
    rareza: 'comun',
    icono: '🟡',
    estaDesbloqueado: false,
    esGratuito: false,
    config: { colorHex: '#F59E0B', aplicaA: 'interfaz' }
  },
  {
    id: 'color-morado',
    nombre: 'Morado Místico',
    descripcion: 'Misterioso y mágico',
    categoria: 'color',
    precio: 50,
    nivelRequerido: 1,
    rareza: 'comun',
    icono: '🟣',
    estaDesbloqueado: false,
    esGratuito: false,
    config: { colorHex: '#8B5CF6', aplicaA: 'interfaz' }
  },
  {
    id: 'color-rosa',
    nombre: 'Rosa Dulce',
    descripcion: 'Suave y encantador',
    categoria: 'color',
    precio: 50,
    nivelRequerido: 1,
    rareza: 'comun',
    icono: '🌸',
    estaDesbloqueado: false,
    esGratuito: false,
    config: { colorHex: '#EC4899', aplicaA: 'interfaz' }
  },

  // Colores premium (Nivel 2)
  {
    id: 'color-turquesa',
    nombre: 'Turquesa Caribeño',
    descripcion: 'Como las aguas tropicales',
    categoria: 'color',
    precio: 50,
    nivelRequerido: 2,
    rareza: 'raro',
    icono: '💎',
    estaDesbloqueado: false,
    esGratuito: false,
    config: { colorHex: '#14B8A6', aplicaA: 'ambos' }
  },
  {
    id: 'color-naranja',
    nombre: 'Naranja Fuego',
    descripcion: 'Cálido y vibrante',
    categoria: 'color',
    precio: 50,
    nivelRequerido: 2,
    rareza: 'raro',
    icono: '🟠',
    estaDesbloqueado: false,
    esGratuito: false,
    config: { colorHex: '#F97316', aplicaA: 'ambos' }
  },
  {
    id: 'color-indigo',
    nombre: 'Índigo Nocturno',
    descripcion: 'Profundo como la noche',
    categoria: 'color',
    precio: 50,
    nivelRequerido: 2,
    rareza: 'raro',
    icono: '🌙',
    estaDesbloqueado: false,
    esGratuito: false,
    config: { colorHex: '#6366F1', aplicaA: 'ambos' }
  },
  {
    id: 'color-lima',
    nombre: 'Lima Fresca',
    descripcion: 'Refrescante y vivaz',
    categoria: 'color',
    precio: 50,
    nivelRequerido: 2,
    rareza: 'raro',
    icono: '🍋',
    estaDesbloqueado: false,
    esGratuito: false,
    config: { colorHex: '#84CC16', aplicaA: 'ambos' }
  },
  {
    id: 'color-oro',
    nombre: 'Oro Dorado',
    descripcion: 'Precioso y brillante',
    categoria: 'color',
    precio: 50,
    nivelRequerido: 2,
    rareza: 'epico',
    icono: '⭐',
    estaDesbloqueado: false,
    esGratuito: false,
    config: { colorHex: '#FBBF24', aplicaA: 'ambos' }
  },
  {
    id: 'color-arcoiris',
    nombre: 'Arcoíris Mágico',
    descripcion: 'Todos los colores en uno (gradiente)',
    categoria: 'color',
    precio: 50,
    nivelRequerido: 2,
    rareza: 'legendario',
    icono: '🌈',
    estaDesbloqueado: false,
    esGratuito: false,
    config: { colorHex: 'linear-gradient(90deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3)', aplicaA: 'ambos' }
  },
];

// Músicas (3 total, requieren nivel 3)
export const MUSICAS: Desbloqueable[] = [
  {
    id: 'musica-energia',
    nombre: 'Ritmo Energético',
    descripcion: 'Música animada para mantener la concentración activa',
    categoria: 'musica',
    precio: 100,
    nivelRequerido: 3,
    rareza: 'raro',
    icono: '⚡',
    estaDesbloqueado: false,
    esGratuito: false,
    config: {
      tipo: 'energica',
      duracion: 180,
      urlAudio: '/audio/energia.mp3',
    }
  },
  {
    id: 'musica-concentracion',
    nombre: 'Melodía Zen',
    descripcion: 'Sonidos relajantes para concentración profunda',
    categoria: 'musica',
    precio: 100,
    nivelRequerido: 3,
    rareza: 'raro',
    icono: '🧘',
    estaDesbloqueado: false,
    esGratuito: false,
    config: {
      tipo: 'concentracion',
      duracion: 240,
      urlAudio: '/audio/concentracion.mp3',
    }
  },
  {
    id: 'musica-aventura',
    nombre: 'Sinfonía de Aventura',
    descripcion: 'Épica y emocionante para grandes desafíos',
    categoria: 'musica',
    precio: 100,
    nivelRequerido: 3,
    rareza: 'epico',
    icono: '🎺',
    estaDesbloqueado: false,
    esGratuito: false,
    config: {
      tipo: 'aventura',
      duracion: 200,
      urlAudio: '/audio/aventura.mp3',
    }
  },
];

// Efectos especiales (5 total)
export const EFECTOS: Desbloqueable[] = [
  {
    id: 'efecto-estrellas',
    nombre: 'Lluvia de Estrellas',
    descripcion: 'Estrellas brillantes caen al resolver correctamente',
    categoria: 'efecto',
    precio: 100,
    nivelRequerido: 3,
    rareza: 'raro',
    icono: '✨',
    estaDesbloqueado: false,
    esGratuito: false,
    config: {
      animacion: 'stars-fall',
      duracionMs: 2000,
      sonido: 'twinkle.mp3',
    }
  },
  {
    id: 'efecto-confetti',
    nombre: 'Explosión de Confeti',
    descripcion: 'Celebra con una explosión de colores',
    categoria: 'efecto',
    precio: 100,
    nivelRequerido: 3,
    rareza: 'raro',
    icono: '🎉',
    estaDesbloqueado: false,
    esGratuito: false,
    config: {
      animacion: 'confetti-burst',
      duracionMs: 1500,
      sonido: 'celebration.mp3',
    }
  },
  {
    id: 'efecto-fuegos',
    nombre: 'Fuegos Artificiales',
    descripcion: 'Espectáculo pirotécnico por tu éxito',
    categoria: 'efecto',
    precio: 150,
    nivelRequerido: 4,
    rareza: 'epico',
    icono: '🎆',
    estaDesbloqueado: false,
    esGratuito: false,
    config: {
      animacion: 'fireworks',
      duracionMs: 3000,
      sonido: 'fireworks.mp3',
    }
  },
  {
    id: 'efecto-rayo',
    nombre: 'Poder del Rayo',
    descripcion: 'Un rayo eléctrico atraviesa la pantalla',
    categoria: 'efecto',
    precio: 150,
    nivelRequerido: 4,
    rareza: 'epico',
    icono: '⚡',
    estaDesbloqueado: false,
    esGratuito: false,
    config: {
      animacion: 'lightning-strike',
      duracionMs: 1000,
      sonido: 'thunder.mp3',
    }
  },
  {
    id: 'efecto-aurora',
    nombre: 'Aurora Boreal',
    descripcion: 'Luces del norte danzan en la pantalla',
    categoria: 'efecto',
    precio: 150,
    nivelRequerido: 5,
    rareza: 'legendario',
    icono: '🌌',
    estaDesbloqueado: false,
    esGratuito: false,
    config: {
      animacion: 'aurora-borealis',
      duracionMs: 4000,
      sonido: 'mystical.mp3',
    }
  },
];

// Función helper para obtener todos los desbloqueables
export function getTodosLosDesbloqueables(): Desbloqueable[] {
  return [...TEMAS, ...FONDOS, ...COLORES, ...MUSICAS, ...EFECTOS];
}

// Función helper para obtener desbloqueables por categoría
export function getDesbloqueablesPorCategoria(categoria: CategoriaDesbloqueable): Desbloqueable[] {
  switch (categoria) {
    case 'tema':
      return TEMAS;
    case 'fondo':
      return FONDOS;
    case 'color':
      return COLORES;
    case 'musica':
      return MUSICAS;
    case 'efecto':
      return EFECTOS;
    default:
      return [];
  }
}

// Función helper para filtrar por nivel
export function getDesbloquablesDisponibles(nivelEstudiante: number): Desbloqueable[] {
  return getTodosLosDesbloqueables().filter(
    item => item.nivelRequerido <= nivelEstudiante
  );
}
