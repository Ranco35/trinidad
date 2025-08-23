import React, { useState, useEffect } from 'react';
import { Shuffle, RotateCcw, Trophy, Clock, Target, Users, Plus, Minus, Save, Database } from 'lucide-react';
import { guardarResultadoMemorice } from './supabase-memorice-config';

const JuegoMemoriceTablas = () => {
  const [nivel, setNivel] = useState(1);
  const [tamanoTablero, setTamanoTablero] = useState({filas: 4, columnas: 4});
  const [cartas, setCartas] = useState([]);
  const [cartasVolteadas, setCartasVolteadas] = useState([]);
  const [parejasEncontradas, setParejasEncontradas] = useState([]);
  const [jugadores, setJugadores] = useState([
    { id: 1, nombre: 'Jugador 1', color: 'bg-blue-500', parejas: 0, activo: true }
  ]);
  const [jugadorActual, setJugadorActual] = useState(0);
  const [intentos, setIntentos] = useState(0);
  const [tiempo, setTiempo] = useState(0);
  const [juegoActivo, setJuegoActivo] = useState(false);
  const [juegoIniciado, setJuegoIniciado] = useState(false);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [mostrarGuardar, setMostrarGuardar] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensajeGuardado, setMensajeGuardado] = useState('');

  // Colores disponibles para jugadores
  const coloresDisponibles = [
    'bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];

  // Configuración de niveles
  const niveles = {
    1: { nombre: "Tablas del 2 y 3", tablas: [2, 3], multiplicadores: [1, 2, 3, 4, 5] },
    2: { nombre: "Tablas del 4 y 5", tablas: [4, 5], multiplicadores: [1, 2, 3, 4, 5] },
    3: { nombre: "Tablas del 6 y 7", tablas: [6, 7], multiplicadores: [1, 2, 3, 4, 5] },
    4: { nombre: "Tablas del 8 y 9", tablas: [8, 9], multiplicadores: [1, 2, 3, 4, 5] },
    5: { nombre: "Tablas mixtas", tablas: [2, 3, 4, 5, 6, 7, 8, 9], multiplicadores: [2, 3, 4, 5] }
  };

  // Función para guardar resultados en Supabase
  const guardarResultados = async () => {
    if (!juegoTerminado) return;
    
    setGuardando(true);
    setMensajeGuardado('');
    
    try {
      const ganador = obtenerGanador();
      const datosJuego = {
        nivel: nivel,
        tamano_tablero: `${tamanoTablero.filas}x${tamanoTablero.columnas}`,
        tiempo_total: tiempo,
        intentos_totales: intentos,
        numero_jugadores: jugadores.length,
        ganador: ganador.nombre,
        parejas_ganador: ganador.parejas,
        jugadores: jugadores.map(j => ({
          nombre: j.nombre,
          parejas: j.parejas,
          color: j.color
        }))
      };

      // Guardar en Supabase
      await guardarResultadoMemorice(datosJuego);
      
      setMensajeGuardado('¡Resultados guardados exitosamente!');
      setMostrarGuardar(false);
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMensajeGuardado(''), 3000);
      
    } catch (error) {
      console.error('Error guardando resultados:', error);
      setMensajeGuardado('Error al guardar los resultados');
    } finally {
      setGuardando(false);
    }
  };

  // Agregar jugador
  const agregarJugador = () => {
    if (jugadores.length >= 8) return;
    
    const colorDisponible = coloresDisponibles.find(color => 
      !jugadores.some(j => j.color === color)
    );
    
    const nuevoJugador = {
      id: jugadores.length + 1,
      nombre: `Jugador ${jugadores.length + 1}`,
      color: colorDisponible || coloresDisponibles[jugadores.length % coloresDisponibles.length],
      parejas: 0,
      activo: false
    };
    
    setJugadores([...jugadores, nuevoJugador]);
  };

  // Quitar jugador
  const quitarJugador = (id) => {
    if (jugadores.length <= 1) return;
    setJugadores(jugadores.filter(j => j.id !== id));
    if (jugadorActual >= jugadores.length - 1) {
      setJugadorActual(0);
    }
  };

  // Cambiar nombre de jugador
  const cambiarNombreJugador = (id, nuevoNombre) => {
    setJugadores(jugadores.map(j => 
      j.id === id ? { ...j, nombre: nuevoNombre } : j
    ));
  };

  // Generar cartas para el nivel actual
  const generarCartas = () => {
    const configuracion = niveles[nivel];
    const parejas = [];
    const totalCasillas = tamanoTablero.filas * tamanoTablero.columnas;
    const totalParejas = Math.floor(totalCasillas / 2);

    // Generar todas las posibles multiplicaciones
    const todasMultiplicaciones = [];
    configuracion.tablas.forEach(tabla => {
      configuracion.multiplicadores.forEach(mult => {
        todasMultiplicaciones.push({
          operacion: `${tabla}×${mult}`,
          resultado: tabla * mult
        });
      });
    });

    // Tomar solo las que necesitamos según el tamaño del tablero
    const multiplicacionesSeleccionadas = todasMultiplicaciones
      .sort(() => Math.random() - 0.5)
      .slice(0, totalParejas);

    // Crear las cartas
    multiplicacionesSeleccionadas.forEach((mult, index) => {
      parejas.push({
        id: index * 2,
        tipo: 'operacion',
        contenido: mult.operacion,
        valor: mult.resultado,
        pareja: index * 2 + 1,
        jugadorPropietario: null
      });
      parejas.push({
        id: index * 2 + 1,
        tipo: 'resultado',
        contenido: mult.resultado.toString(),
        valor: mult.resultado,
        pareja: index * 2,
        jugadorPropietario: null
      });
    });

    // Mezclar cartas
    const cartasMezcladas = [...parejas].sort(() => Math.random() - 0.5);
    setCartas(cartasMezcladas);
    setCartasVolteadas([]);
    setParejasEncontradas([]);
    setIntentos(0);
    setTiempo(0);
    setJuegoIniciado(false);
    setJuegoTerminado(false);
    setMostrarGuardar(false);
    setMensajeGuardado('');
    
    // Reiniciar puntuaciones de jugadores
    setJugadores(jugadores.map((j, index) => ({ 
      ...j, 
      parejas: 0, 
      activo: index === 0 
    })));
    setJugadorActual(0);
  };

  // Inicializar juego
  useEffect(() => {
    generarCartas();
  }, [nivel, tamanoTablero]);

  // Timer del juego
  useEffect(() => {
    let interval;
    if (juegoIniciado && juegoActivo && !juegoTerminado) {
      interval = setInterval(() => {
        setTiempo(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [juegoIniciado, juegoActivo, juegoTerminado]);

  // Iniciar juego
  const iniciarJuego = () => {
    setJuegoIniciado(true);
    setJuegoActivo(true);
  };

  // Cambiar turno
  const cambiarTurno = () => {
    const siguienteJugador = (jugadorActual + 1) % jugadores.length;
    setJugadores(jugadores.map((j, index) => ({
      ...j,
      activo: index === siguienteJugador
    })));
    setJugadorActual(siguienteJugador);
  };

  // Manejar clic en carta
  const manejarClicCarta = (indice) => {
    if (!juegoIniciado || !juegoActivo) return;
    
    if (cartasVolteadas.length === 2) return;
    if (cartasVolteadas.includes(indice)) return;
    if (parejasEncontradas.includes(indice)) return;

    const nuevasVolteadas = [...cartasVolteadas, indice];
    setCartasVolteadas(nuevasVolteadas);

    if (nuevasVolteadas.length === 2) {
      setIntentos(prev => prev + 1);
      
      const carta1 = cartas[nuevasVolteadas[0]];
      const carta2 = cartas[nuevasVolteadas[1]];

      if (carta1.valor === carta2.valor && carta1.tipo !== carta2.tipo) {
        // Pareja correcta - asignar al jugador actual
        setTimeout(() => {
          const cartasActualizadas = cartas.map((carta, idx) => {
            if (nuevasVolteadas.includes(idx)) {
              return { ...carta, jugadorPropietario: jugadorActual };
            }
            return carta;
          });
          setCartas(cartasActualizadas);
          setParejasEncontradas(prev => [...prev, ...nuevasVolteadas]);
          setCartasVolteadas([]);
          
          // Incrementar puntuación del jugador actual
          setJugadores(jugadores.map((j, index) => 
            index === jugadorActual 
              ? { ...j, parejas: j.parejas + 1 }
              : j
          ));
          
          // El jugador que acierta sigue jugando
        }, 1000);
      } else {
        // Pareja incorrecta - cambiar turno
        setTimeout(() => {
          setCartasVolteadas([]);
          cambiarTurno();
        }, 1500);
      }
    }
  };

  // Verificar si el juego ha terminado
  useEffect(() => {
    if (parejasEncontradas.length === cartas.length && cartas.length > 0) {
      setJuegoTerminado(true);
      setJuegoActivo(false);
      setMostrarGuardar(true);
    }
  }, [parejasEncontradas, cartas]);

  // Obtener ganador
  const obtenerGanador = () => {
    return jugadores.reduce((ganador, jugador) => 
      jugador.parejas > ganador.parejas ? jugador : ganador
    );
  };

  // Formatear tiempo
  const formatearTiempo = (segundos) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Reiniciar juego
  const reiniciarJuego = () => {
    setJuegoActivo(false);
    setJuegoIniciado(false);
    generarCartas();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🧠 Memorice - Tablas de Multiplicar (Multijugador)
        </h1>
        <p className="text-gray-600">Encuentra las parejas: operación + resultado</p>
      </div>

      {/* Configuración del juego */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Configuración de nivel */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Nivel de dificultad:
            </label>
            <select
              value={nivel}
              onChange={(e) => setNivel(Number(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={juegoIniciado}
            >
              {Object.entries(niveles).map(([num, config]) => (
                <option key={num} value={num}>
                  {config.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Tamaño del tablero */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Tamaño del tablero:
            </label>
            <select
              value={`${tamanoTablero.filas}x${tamanoTablero.columnas}`}
              onChange={(e) => {
                const [filas, columnas] = e.target.value.split('x').map(Number);
                setTamanoTablero({filas, columnas});
              }}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={juegoIniciado}
            >
              <option value="2x4">2×4 (8 cartas - 4 parejas)</option>
              <option value="3x4">3×4 (12 cartas - 6 parejas)</option>
              <option value="4x4">4×4 (16 cartas - 8 parejas)</option>
              <option value="4x5">4×5 (20 cartas - 10 parejas)</option>
              <option value="4x6">4×6 (24 cartas - 12 parejas)</option>
              <option value="6x6">6×6 (36 cartas - 18 parejas)</option>
            </select>
          </div>

          {/* Estadísticas */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="font-mono">{formatearTiempo(tiempo)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4 text-green-600" />
                <span>Intentos: {intentos}</span>
              </div>
            </div>
            <div className="flex gap-2">
              {!juegoIniciado && !juegoTerminado && (
                <button
                  onClick={iniciarJuego}
                  className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors font-bold"
                >
                  🎮 JUGAR
                </button>
              )}
              <button
                onClick={reiniciarJuego}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reiniciar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Panel de jugadores */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Jugadores
          </h3>
          <div className="flex gap-2">
            <button
              onClick={agregarJugador}
              disabled={jugadores.length >= 8 || juegoIniciado}
              className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors disabled:bg-gray-400"
            >
              <Plus className="w-4 h-4" />
              Agregar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {jugadores.map((jugador, index) => (
            <div
              key={jugador.id}
              className={`border-2 rounded-lg p-3 transition-all ${
                jugador.activo && juegoActivo
                  ? 'border-yellow-400 bg-yellow-50 shadow-md'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-4 h-4 rounded-full ${jugador.color}`}></div>
                {jugador.activo && juegoActivo && (
                  <span className="text-xs bg-yellow-400 text-yellow-800 px-2 py-1 rounded">
                    TURNO
                  </span>
                )}
                {jugadores.length > 1 && !juegoIniciado && (
                  <button
                    onClick={() => quitarJugador(jugador.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                )}
              </div>
              <input
                type="text"
                value={jugador.nombre}
                onChange={(e) => cambiarNombreJugador(jugador.id, e.target.value)}
                className="w-full text-sm font-medium border border-gray-300 rounded px-2 py-1 mb-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={juegoIniciado}
              />
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Parejas: {jugador.parejas}</span>
                <Trophy className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mensaje de victoria */}
      {juegoTerminado && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-6 h-6" />
            <span className="text-xl font-bold">¡Juego Terminado!</span>
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${obtenerGanador().color} text-white`}>
            <Trophy className="w-5 h-5" />
            <span className="font-bold">{obtenerGanador().nombre} ganó con {obtenerGanador().parejas} parejas</span>
          </div>
          <p className="mt-2">Tiempo total: {formatearTiempo(tiempo)} | Intentos: {intentos}</p>
          
          {/* Botón para guardar resultados */}
          {mostrarGuardar && (
            <div className="mt-4">
              <button
                onClick={guardarResultados}
                disabled={guardando}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400 mx-auto"
              >
                <Database className="w-4 h-4" />
                {guardando ? 'Guardando...' : 'Guardar Resultados'}
              </button>
            </div>
          )}
          
          {/* Mensaje de guardado */}
          {mensajeGuardado && (
            <div className={`mt-2 text-sm ${mensajeGuardado.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {mensajeGuardado}
            </div>
          )}
        </div>
      )}

      {/* Tablero de cartas */}
      <div 
        className="grid gap-3 mx-auto justify-center"
        style={{
          gridTemplateColumns: `repeat(${tamanoTablero.columnas}, minmax(0, 1fr))`,
          maxWidth: `${tamanoTablero.columnas * 80}px`
        }}
      >
        {cartas.map((carta, indice) => {
          const estaVolteada = cartasVolteadas.includes(indice) || parejasEncontradas.includes(indice);
          const esPareja = parejasEncontradas.includes(indice);
          const propietario = carta.jugadorPropietario !== null ? jugadores[carta.jugadorPropietario] : null;
          
          return (
            <div
              key={indice}
              onClick={() => manejarClicCarta(indice)}
              className={`
                aspect-square rounded-lg shadow-md cursor-pointer transform transition-all duration-300 hover:scale-105
                ${estaVolteada 
                  ? esPareja 
                    ? propietario ? propietario.color : 'bg-green-500'
                    : carta.tipo === 'operacion' 
                      ? 'bg-gray-700' 
                      : 'bg-gray-800'
                  : 'bg-gray-600 hover:bg-gray-500'
                }
                text-white
              `}
            >
              <div className="h-full flex items-center justify-center p-2">
                {estaVolteada ? (
                  <span className={`font-bold text-center ${
                    carta.contenido.length > 3 ? 'text-xs' : tamanoTablero.columnas > 4 ? 'text-sm' : 'text-base'
                  }`}>
                    {carta.contenido}
                  </span>
                ) : (
                  <Shuffle className={`text-white opacity-50 ${tamanoTablero.columnas > 4 ? 'w-4 h-4' : 'w-6 h-6'}`} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Instrucciones */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-4">
        <h3 className="font-bold text-gray-800 mb-2">📋 Cómo jugar (Multijugador):</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Cada jugador tiene su propio color y contador de parejas</li>
          <li>• En tu turno, haz clic en 2 cartas para buscar una pareja</li>
          <li>• Si encuentras una pareja correcta, ganas un punto y sigues jugando</li>
          <li>• Si fallas, pasa el turno al siguiente jugador</li>
          <li>• Las cartas oscuras son operaciones, las más claras son resultados</li>
          <li>• Al final del juego, gana quien tenga más parejas</li>
          <li>• Puedes elegir el tamaño del tablero (siempre con número par de cartas) y el nivel de dificultad</li>
          <li>• Los resultados se guardan automáticamente al finalizar el juego</li>
        </ul>
      </div>
    </div>
  );
};

export default JuegoMemoriceTablas;
