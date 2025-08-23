import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Target, Users, TrendingUp, BarChart3, Calendar, Award } from 'lucide-react';
import { 
  obtenerRankingMemoriceGlobal, 
  obtenerRankingMemoriceNivel, 
  obtenerEstadisticasGeneralesMemorice,
  obtenerHistorialMemorice,
  obtenerMejoresTiemposMemorice
} from './supabase-memorice-config';

const MemoriceStats = () => {
  const [rankingGlobal, setRankingGlobal] = useState([]);
  const [rankingNivel, setRankingNivel] = useState([]);
  const [estadisticasGenerales, setEstadisticasGenerales] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [mejoresTiempos, setMejoresTiempos] = useState([]);
  const [nivelSeleccionado, setNivelSeleccionado] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [tabActivo, setTabActivo] = useState('general');

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos();
  }, []);

  // Cargar ranking por nivel cuando cambie el nivel seleccionado
  useEffect(() => {
    cargarRankingNivel();
  }, [nivelSeleccionado]);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [
        globalData,
        estadisticasData,
        historialData,
        tiemposData
      ] = await Promise.all([
        obtenerRankingMemoriceGlobal(),
        obtenerEstadisticasGeneralesMemorice(),
        obtenerHistorialMemorice(10),
        obtenerMejoresTiemposMemorice()
      ]);

      setRankingGlobal(globalData);
      setEstadisticasGenerales(estadisticasData);
      setHistorial(historialData);
      setMejoresTiempos(tiemposData);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setCargando(false);
    }
  };

  const cargarRankingNivel = async () => {
    try {
      const data = await obtenerRankingMemoriceNivel(nivelSeleccionado);
      setRankingNivel(data);
    } catch (error) {
      console.error('Error cargando ranking por nivel:', error);
    }
  };

  const formatearTiempo = (segundos) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (cargando) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          📊 Estadísticas - Memorice Tablas
        </h1>
        <p className="text-gray-600">Rankings y estadísticas del juego de memorice</p>
      </div>

      {/* Estadísticas generales */}
      {estadisticasGenerales && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Partidas</p>
                <p className="text-2xl font-bold text-blue-600">{estadisticasGenerales.totalPartidas}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tiempo Promedio</p>
                <p className="text-2xl font-bold text-green-600">{formatearTiempo(estadisticasGenerales.tiempoPromedio)}</p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Intentos Promedio</p>
                <p className="text-2xl font-bold text-purple-600">{estadisticasGenerales.intentosPromedio}</p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Nivel Más Jugado</p>
                <p className="text-2xl font-bold text-orange-600">{estadisticasGenerales.nivelMasJugado}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      )}

      {/* Tabs de navegación */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'general', nombre: 'Ranking Global', icon: Trophy },
              { id: 'nivel', nombre: 'Por Nivel', icon: Award },
              { id: 'historial', nombre: 'Historial', icon: Calendar },
              { id: 'tiempos', nombre: 'Mejores Tiempos', icon: Clock }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setTabActivo(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    tabActivo === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.nombre}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Tab: Ranking Global */}
          {tabActivo === 'general' && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">🏆 Ranking Global</h3>
              {rankingGlobal.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posición</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jugador</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partidas Ganadas</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiempo Promedio</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Parejas</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {rankingGlobal.map((jugador, index) => (
                        <tr key={jugador.ganador}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {index === 0 && <Trophy className="w-5 h-5 text-yellow-500 mr-2" />}
                              {index === 1 && <Trophy className="w-5 h-5 text-gray-400 mr-2" />}
                              {index === 2 && <Trophy className="w-5 h-5 text-orange-600 mr-2" />}
                              <span className="font-medium text-gray-900">{index + 1}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {jugador.ganador}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {jugador.total_partidas_ganadas}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatearTiempo(jugador.tiempo_promedio)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {jugador.total_parejas_ganadas}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
              )}
            </div>
          )}

          {/* Tab: Ranking por Nivel */}
          {tabActivo === 'nivel' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">🏅 Ranking por Nivel</h3>
                <select
                  value={nivelSeleccionado}
                  onChange={(e) => setNivelSeleccionado(Number(e.target.value))}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>Nivel 1 - Tablas del 2 y 3</option>
                  <option value={2}>Nivel 2 - Tablas del 4 y 5</option>
                  <option value={3}>Nivel 3 - Tablas del 6 y 7</option>
                  <option value={4}>Nivel 4 - Tablas del 8 y 9</option>
                  <option value={5}>Nivel 5 - Tablas mixtas</option>
                </select>
              </div>
              {rankingNivel.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jugador</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tablero</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partidas Ganadas</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiempo Promedio</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mejor Tiempo</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {rankingNivel.map((jugador, index) => (
                        <tr key={`${jugador.ganador}-${jugador.tamano_tablero}`}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {jugador.ganador}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {jugador.tamano_tablero}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {jugador.partidas_ganadas}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatearTiempo(jugador.tiempo_promedio)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatearTiempo(jugador.mejor_tiempo)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No hay datos disponibles para este nivel</p>
              )}
            </div>
          )}

          {/* Tab: Historial */}
          {tabActivo === 'historial' && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">📅 Historial de Partidas</h3>
              {historial.length > 0 ? (
                <div className="space-y-4">
                  {historial.map((partida) => (
                    <div key={partida.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {partida.ganador} ganó en nivel {partida.nivel}
                          </p>
                          <p className="text-sm text-gray-600">
                            Tablero: {partida.tamano_tablero} | {partida.numero_jugadores} jugadores
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatearTiempo(partida.tiempo_total)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {partida.intentos_totales} intentos
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatearFecha(partida.fecha_juego)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No hay partidas recientes</p>
              )}
            </div>
          )}

          {/* Tab: Mejores Tiempos */}
          {tabActivo === 'tiempos' && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">⚡ Mejores Tiempos</h3>
              {mejoresTiempos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mejoresTiempos.map((tiempo, index) => (
                    <div key={index} className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Nivel {tiempo.nivel}</span>
                        <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                          {tiempo.tamano_tablero}
                        </span>
                      </div>
                      <p className="text-2xl font-bold">{formatearTiempo(tiempo.tiempo_total)}</p>
                      <p className="text-sm opacity-90">{tiempo.ganador}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {formatearFecha(tiempo.fecha_juego)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No hay mejores tiempos registrados</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemoriceStats;
