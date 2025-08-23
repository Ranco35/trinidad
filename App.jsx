import React, { useState } from 'react';
import { Home, ArrowLeft, Settings } from 'lucide-react';
import GameSelector from './GameSelector';
import JuegoMemoriceTablas from './JuegoMemoriceTablas';
import MemoriceStats from './MemoriceStats';

const App = () => {
  const [currentView, setCurrentView] = useState('selector'); // 'selector', 'matemaster', 'memorice', 'memorice-stats'
  const [selectedGame, setSelectedGame] = useState(null);

  const handleGameSelect = (gameId) => {
    setSelectedGame(gameId);
    setCurrentView(gameId);
  };

  const handleBackToSelector = () => {
    setCurrentView('selector');
    setSelectedGame(null);
  };

  const handleNavigateToStats = () => {
    setCurrentView('memorice-stats');
  };

  const renderHeader = () => {
    if (currentView === 'selector') return null;

    return (
      <div className="bg-white shadow-md p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToSelector}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Menú
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-xl font-bold text-gray-800">
              {selectedGame === 'matemaster' && 'MateMaster TWICE Edition'}
              {selectedGame === 'memorice' && 'Memorice - Tablas de Multiplicar'}
              {currentView === 'memorice-stats' && 'Estadísticas - Memorice'}
            </h1>
          </div>
          
          {selectedGame === 'memorice' && (
            <button
              onClick={handleNavigateToStats}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              Estadísticas
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case 'selector':
        return <GameSelector onGameSelect={handleGameSelect} />;
      
      case 'matemaster':
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                🎯 MateMaster TWICE Edition
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                ¡Domina las divisiones y promedios con el poder de TWICE!
              </p>
              
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    🎮 Cómo Jugar
                  </h3>
                  <ul className="text-left space-y-2 text-gray-600">
                    <li>• Ingresa tu nombre en la pantalla de bienvenida</li>
                    <li>• Selecciona un nivel disponible</li>
                    <li>• Responde las 5 preguntas del nivel</li>
                    <li>• Pasa la pregunta decisiva para avanzar</li>
                    <li>• Obtén al menos 3 puntos para desbloquear el siguiente nivel</li>
                  </ul>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    📚 Niveles Disponibles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-800">Nivel 1: Operaciones Combinadas</h4>
                      <p className="text-sm text-gray-600">Paréntesis, multiplicación, división</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-800">Nivel 2: Divisiones Simples</h4>
                      <p className="text-sm text-gray-600">Divisiones exactas básicas</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-800">Nivel 3: Divisiones con Resto</h4>
                      <p className="text-sm text-gray-600">Divisiones no exactas</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-800">Nivel 4: Promedios</h4>
                      <p className="text-sm text-gray-600">Cálculo de promedios</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">
                    <strong>Nota:</strong> El juego original MateMaster está disponible en el archivo 
                    <code className="bg-yellow-100 px-2 py-1 rounded text-sm">math_game_page.html</code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'memorice':
        return <JuegoMemoriceTablas />;
      
      case 'memorice-stats':
        return <MemoriceStats />;
      
      default:
        return <GameSelector onGameSelect={handleGameSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderHeader()}
      {renderContent()}
    </div>
  );
};

export default App;
