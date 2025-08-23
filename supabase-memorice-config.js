// Configuración de Supabase para el juego de Memorice
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

// Inicializar Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Función para guardar resultados del juego de memorice
export async function guardarResultadoMemorice(datosJuego) {
  try {
    const { data, error } = await supabase
      .from('juegos_memorice')
      .insert({
        tipo_juego: 'memorice_tablas',
        nivel: datosJuego.nivel,
        tamano_tablero: datosJuego.tamano_tablero,
        tiempo_total: datosJuego.tiempo_total,
        intentos_totales: datosJuego.intentos_totales,
        numero_jugadores: datosJuego.numero_jugadores,
        ganador: datosJuego.ganador,
        parejas_ganador: datosJuego.parejas_ganador,
        jugadores: datosJuego.jugadores,
        fecha_juego: new Date().toISOString()
      });

    if (error) {
      console.error('Error guardando resultado de memorice:', error);
      throw error;
    }

    console.log('Resultado de memorice guardado exitosamente:', data);
    return data;
  } catch (error) {
    console.error('Error guardando resultado de memorice:', error);
    throw error;
  }
}

// Función para obtener ranking global de memorice
export async function obtenerRankingMemoriceGlobal() {
  try {
    const { data, error } = await supabase
      .from('ranking_memorice_global')
      .select('*')
      .order('total_partidas_ganadas', { ascending: false });

    if (error) {
      console.error('Error obteniendo ranking de memorice:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error obteniendo ranking de memorice:', error);
    return [];
  }
}

// Función para obtener ranking de memorice por nivel
export async function obtenerRankingMemoriceNivel(nivel) {
  try {
    const { data, error } = await supabase
      .from('ranking_memorice_nivel')
      .select('*')
      .eq('nivel', nivel)
      .order('tiempo_promedio', { ascending: true });

    if (error) {
      console.error('Error obteniendo ranking por nivel:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error obteniendo ranking por nivel:', error);
    return [];
  }
}

// Función para obtener estadísticas de un jugador específico
export async function obtenerEstadisticasJugadorMemorice(nombreJugador) {
  try {
    const { data, error } = await supabase
      .from('juegos_memorice')
      .select('*')
      .eq('ganador', nombreJugador)
      .order('fecha_juego', { ascending: false });

    if (error) {
      console.error('Error obteniendo estadísticas del jugador:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error obteniendo estadísticas del jugador:', error);
    return [];
  }
}

// Función para obtener historial de partidas recientes
export async function obtenerHistorialMemorice(limite = 10) {
  try {
    const { data, error } = await supabase
      .from('estadisticas_jugadores_memorice')
      .select('*')
      .order('fecha_juego', { ascending: false })
      .limit(limite);

    if (error) {
      console.error('Error obteniendo historial:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    return [];
  }
}

// Función para obtener mejores tiempos por nivel y tamaño de tablero
export async function obtenerMejoresTiemposMemorice() {
  try {
    const { data, error } = await supabase
      .from('juegos_memorice')
      .select('ganador, nivel, tamano_tablero, tiempo_total, fecha_juego')
      .order('tiempo_total', { ascending: true });

    if (error) {
      console.error('Error obteniendo mejores tiempos:', error);
      return [];
    }

    // Agrupar por nivel y tamaño de tablero, tomando el mejor tiempo
    const mejoresTiempos = {};
    data.forEach(partida => {
      const clave = `${partida.nivel}-${partida.tamano_tablero}`;
      if (!mejoresTiempos[clave] || partida.tiempo_total < mejoresTiempos[clave].tiempo_total) {
        mejoresTiempos[clave] = partida;
      }
    });

    return Object.values(mejoresTiempos);
  } catch (error) {
    console.error('Error obteniendo mejores tiempos:', error);
    return [];
  }
}

// Función para obtener estadísticas generales del juego
export async function obtenerEstadisticasGeneralesMemorice() {
  try {
    const { data, error } = await supabase
      .from('juegos_memorice')
      .select('*');

    if (error) {
      console.error('Error obteniendo estadísticas generales:', error);
      return null;
    }

    if (data.length === 0) {
      return {
        totalPartidas: 0,
        tiempoPromedio: 0,
        intentosPromedio: 0,
        nivelMasJugado: null,
        tableroMasUsado: null
      };
    }

    // Calcular estadísticas
    const totalPartidas = data.length;
    const tiempoPromedio = data.reduce((sum, partida) => sum + partida.tiempo_total, 0) / totalPartidas;
    const intentosPromedio = data.reduce((sum, partida) => sum + partida.intentos_totales, 0) / totalPartidas;

    // Nivel más jugado
    const niveles = {};
    data.forEach(partida => {
      niveles[partida.nivel] = (niveles[partida.nivel] || 0) + 1;
    });
    const nivelMasJugado = Object.keys(niveles).reduce((a, b) => niveles[a] > niveles[b] ? a : b);

    // Tablero más usado
    const tableros = {};
    data.forEach(partida => {
      tableros[partida.tamano_tablero] = (tableros[partida.tamano_tablero] || 0) + 1;
    });
    const tableroMasUsado = Object.keys(tableros).reduce((a, b) => tableros[a] > tableros[b] ? a : b);

    return {
      totalPartidas,
      tiempoPromedio: Math.round(tiempoPromedio),
      intentosPromedio: Math.round(intentosPromedio),
      nivelMasJugado: parseInt(nivelMasJugado),
      tableroMasUsado
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas generales:', error);
    return null;
  }
}

export default supabase;
