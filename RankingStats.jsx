import React, { useState, useEffect } from 'react';

// Tipos para TypeScript
interface PlayerStats {
  name: string;
  totalTime: number;
  totalCorrect: number;
  totalIncorrect: number;
  completedLevels: number;
  averageTime: number;
  accuracy: number;
  levelDetails: {
    [key: string]: {
      time: number;
      correct: number;
      incorrect: number;
      score: number;
      completed: boolean;
    };
  };
}

interface RankingStatsProps {
  players: PlayerStats[];
}

const RankingStats: React.FC<RankingStatsProps> = ({ players }) => {
  const [sortBy, setSortBy] = useState<'time' | 'accuracy' | 'score' | 'levels'>('time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  // Calcular estadísticas adicionales
  const calculateStats = (player: PlayerStats) => {
    const totalQuestions = player.totalCorrect + player.totalIncorrect;
    const accuracy = totalQuestions > 0 ? (player.totalCorrect / totalQuestions) * 100 : 0;
    const averageTime = player.completedLevels > 0 ? player.totalTime / player.completedLevels : 0;
    
    return {
      ...player,
      accuracy: Math.round(accuracy),
      averageTime: Math.round(averageTime)
    };
  };

  // Ordenar jugadores
  const sortedPlayers = [...players].sort((a, b) => {
    const statsA = calculateStats(a);
    const statsB = calculateStats(b);
    
    let comparison = 0;
    switch (sortBy) {
      case 'time':
        comparison = statsA.averageTime - statsB.averageTime;
        break;
      case 'accuracy':
        comparison = statsA.accuracy - statsB.accuracy;
        break;
      case 'score':
        comparison = statsA.totalCorrect - statsB.totalCorrect;
        break;
      case 'levels':
        comparison = statsA.completedLevels - statsB.completedLevels;
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Formatear tiempo
  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  };

  // Obtener emoji de ranking
  const getRankEmoji = (index: number): string => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return '🏅';
    }
  };

  // Obtener color de precisión
  const getAccuracyColor = (accuracy: number): string => {
    if (accuracy >= 90) return '#48bb78';
    if (accuracy >= 80) return '#38a169';
    if (accuracy >= 70) return '#f6ad55';
    if (accuracy >= 60) return '#f56565';
    return '#e53e3e';
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f7fafc',
      borderRadius: '15px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        color: '#2d3748', 
        marginBottom: '20px',
        fontSize: '1.8em'
      }}>
        📊 Estadísticas Detalladas del Ranking
      </h2>

      {/* Controles de ordenamiento */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '10px', 
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          Ordenar por:
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              padding: '5px 10px',
              borderRadius: '5px',
              border: '1px solid #cbd5e0',
              marginLeft: '5px'
            }}
          >
            <option value="time">⏱️ Tiempo Promedio</option>
            <option value="accuracy">🎯 Precisión</option>
            <option value="score">✅ Respuestas Correctas</option>
            <option value="levels">🏆 Niveles Completados</option>
          </select>
        </label>
        
        <button 
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          style={{
            padding: '5px 10px',
            borderRadius: '5px',
            border: '1px solid #cbd5e0',
            backgroundColor: '#fff',
            cursor: 'pointer'
          }}
        >
          {sortOrder === 'asc' ? '⬆️ Ascendente' : '⬇️ Descendente'}
        </button>
      </div>

      {/* Tabla de estadísticas */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '10px', 
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#4a5568', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Rank</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Jugador</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>⏱️ Tiempo Promedio</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>🎯 Precisión</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>✅ Correctas</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>❌ Incorrectas</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>🏆 Niveles</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>📊 Detalles</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, index) => {
              const stats = calculateStats(player);
              return (
                <tr 
                  key={player.name}
                  style={{ 
                    borderBottom: '1px solid #e2e8f0',
                    backgroundColor: index % 2 === 0 ? '#f7fafc' : 'white',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedPlayer(selectedPlayer === player.name ? null : player.name)}
                >
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>
                    {getRankEmoji(index)} {index + 1}
                  </td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>
                    {player.name}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {formatTime(stats.averageTime)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{ 
                      color: getAccuracyColor(stats.accuracy),
                      fontWeight: 'bold'
                    }}>
                      {stats.accuracy}%
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', color: '#48bb78' }}>
                    {stats.totalCorrect}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', color: '#f56565' }}>
                    {stats.totalIncorrect}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {stats.completedLevels}/4
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button style={{
                      padding: '5px 10px',
                      borderRadius: '5px',
                      border: '1px solid #cbd5e0',
                      backgroundColor: '#fff',
                      cursor: 'pointer',
                      fontSize: '0.9em'
                    }}>
                      {selectedPlayer === player.name ? '👁️ Ocultar' : '👁️ Ver'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detalles del jugador seleccionado */}
      {selectedPlayer && (
        <div style={{ 
          marginTop: '20px',
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ 
            color: '#2d3748', 
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            📋 Detalles de {selectedPlayer}
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            {[1, 2, 3, 4].map(level => {
              const levelData = players.find(p => p.name === selectedPlayer)?.levelDetails[`level${level}`];
              if (!levelData) return null;
              
              return (
                <div key={level} style={{
                  backgroundColor: levelData.completed ? '#f0fff4' : '#fed7d7',
                  borderRadius: '8px',
                  padding: '15px',
                  border: `2px solid ${levelData.completed ? '#48bb78' : '#f56565'}`
                }}>
                  <h4 style={{ 
                    marginBottom: '10px',
                    color: levelData.completed ? '#38a169' : '#e53e3e'
                  }}>
                    🎯 Nivel {level} {levelData.completed ? '✅' : '❌'}
                  </h4>
                  
                  <div style={{ fontSize: '0.9em', lineHeight: '1.4' }}>
                    <p>⏱️ Tiempo: {formatTime(levelData.time)}</p>
                    <p>✅ Correctas: {levelData.correct}</p>
                    <p>❌ Incorrectas: {levelData.incorrect}</p>
                    <p>🏆 Puntuación: {levelData.score}/5</p>
                    <p>📊 Precisión: {levelData.correct + levelData.incorrect > 0 
                      ? Math.round((levelData.correct / (levelData.correct + levelData.incorrect)) * 100)
                      : 0}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Resumen general */}
      <div style={{ 
        marginTop: '20px',
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ 
          color: '#2d3748', 
          marginBottom: '15px',
          textAlign: 'center'
        }}>
          📈 Resumen General
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '15px',
          textAlign: 'center'
        }}>
          <div style={{ padding: '10px', backgroundColor: '#f0fff4', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#38a169' }}>
              {players.length}
            </div>
            <div style={{ fontSize: '0.9em', color: '#4a5568' }}>Total Jugadores</div>
          </div>
          
          <div style={{ padding: '10px', backgroundColor: '#fef5e7', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#d69e2e' }}>
              {Math.round(players.reduce((sum, p) => sum + p.totalCorrect, 0) / players.length)}
            </div>
            <div style={{ fontSize: '0.9em', color: '#4a5568' }}>Promedio Correctas</div>
          </div>
          
          <div style={{ padding: '10px', backgroundColor: '#fed7d7', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#e53e3e' }}>
              {Math.round(players.reduce((sum, p) => sum + p.totalIncorrect, 0) / players.length)}
            </div>
            <div style={{ fontSize: '0.9em', color: '#4a5568' }}>Promedio Incorrectas</div>
          </div>
          
          <div style={{ padding: '10px', backgroundColor: '#e6fffa', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#319795' }}>
              {formatTime(Math.round(players.reduce((sum, p) => sum + p.totalTime, 0) / players.length))}
            </div>
            <div style={{ fontSize: '0.9em', color: '#4a5568' }}>Tiempo Promedio</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingStats; 