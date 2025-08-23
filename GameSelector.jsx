import React, { useState } from 'react';
import { Brain, Calculator, Target, Users, Trophy, Star } from 'lucide-react';

const GameSelector = ({ onGameSelect }) => {
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    {
      id: 'matemaster',
      name: 'MateMaster TWICE Edition',
      description: '¡Domina las divisiones y promedios con el poder de TWICE!',
      icon: Calculator,
      color: 'from-purple-500 to-pink-500',
      features: [
        '5 niveles progresivos',
        'Divisiones y promedios',
        'Sistema de puntuación',
        'Preguntas decisivas'
      ],
      status: 'active'
    },
    {
      id: 'memorice',
      name: 'Memorice - Tablas de Multiplicar',
      description: 'Encuentra las parejas: operación + resultado',
      icon: Brain,
      color: 'from-blue-500 to-purple-500',
      features: [
        'Modo multijugador (1-8 jugadores)',
        '5 niveles de dificultad',
        '6 tamaños de tablero',
        'Rankings y estadísticas'
      ],
      status: 'new'
    }
  ];

  const handleGameSelect = (game) => {
    setSelectedGame(game.id);
    onGameSelect(game.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎮 Centro de Juegos Educativos
          </h1>
          <p className="text-xl text-gray-600">
            Selecciona el juego que quieres jugar
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <div
                key={game.id}
                onClick={() => handleGameSelect(game)}
                className={`
                  relative bg-white rounded-2xl shadow-lg p-8 cursor-pointer
                  transform transition-all duration-300 hover:scale-105
                  border-4 ${selectedGame === game.id ? 'border-blue-500' : 'border-transparent'}
                  hover:shadow-xl
                `}
              >
                {/* Status Badge */}
                {game.status === 'new' && (
                  <div className="absolute -top-3 -right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    ¡NUEVO!
                  </div>
                )}

                {/* Game Icon */}
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${game.color} flex items-center justify-center mb-6 mx-auto`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Game Info */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {game.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {game.description}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Características:
                  </h4>
                  <ul className="space-y-2">
                    {game.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Play Button */}
                <div className="mt-6">
                  <button
                    className={`
                      w-full py-3 px-6 rounded-lg font-bold text-white
                      bg-gradient-to-r ${game.color} hover:opacity-90
                      transform transition-all duration-200 hover:scale-105
                    `}
                  >
                    🎮 JUGAR AHORA
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Información General
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span>Juegos multijugador disponibles</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-500" />
              <span>Diferentes niveles de dificultad</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-500" />
              <span>Desarrollo de habilidades matemáticas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSelector;
