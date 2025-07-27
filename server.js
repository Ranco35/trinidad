const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la raíz
app.use(express.static(path.join(__dirname)));

// Base de datos en memoria para el ranking
let rankings = [];

// Ruta principal - servir el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'math_game_page.html'));
});

// API para rankings
app.get('/api/rankings', (req, res) => {
    try {
        // Procesar rankings para calcular estadísticas
        const processedRankings = rankings.map(player => {
            let totalTime = 0;
            let totalCorrect = 0;
            let totalIncorrect = 0;
            let completedLevels = 0;
            
            // Calcular estadísticas basadas en los datos guardados
            for (let level = 1; level <= 4; level++) {
                const levelData = player.stats[`level${level}`];
                if (levelData && levelData.completed) {
                    totalTime += levelData.time;
                    totalCorrect += levelData.correct;
                    totalIncorrect += levelData.incorrect;
                    completedLevels++;
                }
            }
            
            return {
                name: player.playerName,
                totalTime,
                totalCorrect,
                totalIncorrect,
                completedLevels,
                levelDetails: player.stats
            };
        });
        
        // Ordenar por tiempo promedio (más rápido primero)
        const sortedRankings = processedRankings
            .filter(p => p.completedLevels > 0) // Solo jugadores que han completado al menos un nivel
            .sort((a, b) => {
                const avgTimeA = a.totalTime / a.completedLevels;
                const avgTimeB = b.totalTime / b.completedLevels;
                return avgTimeA - avgTimeB;
            });
        
        res.json(sortedRankings);
    } catch (error) {
        console.error('Error getting rankings:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.post('/api/rankings', (req, res) => {
    try {
        const { playerName, level, stats } = req.body;
        
        if (!playerName || !level || !stats) {
            return res.status(400).json({ error: 'Datos incompletos' });
        }
        
        // Buscar si el jugador ya existe
        let playerIndex = rankings.findIndex(p => p.playerName === playerName);
        
        if (playerIndex === -1) {
            // Nuevo jugador
            rankings.push({
                playerName,
                stats: {
                    [`level${level}`]: stats
                }
            });
        } else {
            // Actualizar jugador existente
            rankings[playerIndex].stats[`level${level}`] = stats;
        }
        
        console.log(`Estadísticas guardadas para ${playerName}, nivel ${level}`);
        res.json({ success: true, message: 'Estadísticas guardadas correctamente' });
    } catch (error) {
        console.error('Error saving rankings:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para servir archivos estáticos (CSS, JS, imágenes)
app.get('/static/*', (req, res) => {
    const filePath = path.join(__dirname, req.path);
    res.sendFile(filePath);
});

// Ruta para healthcheck
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'MateMaster server is running',
        timestamp: new Date().toISOString(),
        rankings: rankings.length 
    });
});

// Manejo de errores 404
app.use('*', (req, res) => {
    console.log('404 - Ruta no encontrada:', req.originalUrl);
    res.status(404).sendFile(path.join(__dirname, 'math_game_page.html'));
});

// Manejo de errores
app.use((error, req, res, next) => {
    console.error('Error del servidor:', error);
    res.status(500).json({ 
        error: 'Error interno del servidor',
        message: error.message 
    });
});

// Iniciar servidor
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎯 MateMaster server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Access at: http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${__dirname}`);
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
    console.log('Cerrando servidor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('Cerrando servidor...');
    process.exit(0);
}); 