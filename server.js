// Servidor simple para ranking global
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Archivo para almacenar rankings
const rankingsFile = 'rankings.json';

// Función para leer rankings
function readRankings() {
  try {
    if (fs.existsSync(rankingsFile)) {
      return JSON.parse(fs.readFileSync(rankingsFile, 'utf8'));
    }
    return {};
  } catch (error) {
    console.error('Error leyendo rankings:', error);
    return {};
  }
}

// Función para escribir rankings
function writeRankings(rankings) {
  try {
    fs.writeFileSync(rankingsFile, JSON.stringify(rankings, null, 2));
  } catch (error) {
    console.error('Error escribiendo rankings:', error);
  }
}

// Ruta para guardar estadísticas
app.post('/api/rankings', (req, res) => {
  try {
    const { playerName, level, stats } = req.body;
    const rankings = readRankings();
    
    if (!rankings[playerName]) {
      rankings[playerName] = {};
    }
    
    rankings[playerName][level] = {
      ...stats,
      timestamp: new Date().toISOString()
    };
    
    writeRankings(rankings);
    res.json({ success: true, message: 'Ranking guardado' });
  } catch (error) {
    res.status(500).json({ error: 'Error guardando ranking' });
  }
});

// Ruta para obtener ranking global
app.get('/api/rankings', (req, res) => {
  try {
    const rankings = readRankings();
    const globalRanking = [];
    
    Object.keys(rankings).forEach(playerName => {
      const playerData = rankings[playerName];
      let totalTime = 0;
      let totalCorrect = 0;
      let totalIncorrect = 0;
      let completedLevels = 0;
      
      for (let level = 1; level <= 4; level++) {
        const levelData = playerData[`level${level}`];
        if (levelData && levelData.completed) {
          totalTime += levelData.time;
          totalCorrect += levelData.correct;
          totalIncorrect += levelData.incorrect;
          completedLevels++;
        }
      }
      
      if (completedLevels > 0) {
        globalRanking.push({
          name: playerName,
          totalTime,
          totalCorrect,
          totalIncorrect,
          completedLevels
        });
      }
    });
    
    // Ordenar por tiempo total
    globalRanking.sort((a, b) => a.totalTime - b.totalTime);
    res.json(globalRanking);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo ranking' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor de ranking corriendo en http://localhost:${PORT}`);
  console.log(`API disponible en http://localhost:${PORT}/api/rankings`);
}); 