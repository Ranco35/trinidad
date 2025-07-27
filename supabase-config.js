// Configuración de Supabase para ranking global
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

// Inicializar Supabase
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Función para guardar estadísticas en Supabase
async function saveStatsToSupabase(playerName, level, stats) {
  try {
    const { data, error } = await supabase
      .from('rankings')
      .upsert({
        player_name: playerName,
        level: level,
        time: stats.time,
        correct: stats.correct,
        incorrect: stats.incorrect,
        score: stats.score,
        completed: stats.completed,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'player_name,level'
      });

    if (error) {
      console.error('Error guardando en Supabase:', error);
    } else {
      console.log('Estadísticas guardadas en Supabase');
    }
  } catch (error) {
    console.error('Error guardando en Supabase:', error);
  }
}

// Función para obtener ranking global
async function getGlobalRanking() {
  try {
    const { data, error } = await supabase
      .from('rankings')
      .select('*')
      .eq('completed', true);

    if (error) {
      console.error('Error obteniendo ranking:', error);
      return [];
    }

    // Procesar datos para crear ranking
    const playerStats = {};
    
    data.forEach(record => {
      const playerName = record.player_name;
      if (!playerStats[playerName]) {
        playerStats[playerName] = {
          name: playerName,
          totalTime: 0,
          totalCorrect: 0,
          totalIncorrect: 0,
          completedLevels: 0
        };
      }
      
      playerStats[playerName].totalTime += record.time;
      playerStats[playerName].totalCorrect += record.correct;
      playerStats[playerName].totalIncorrect += record.incorrect;
      playerStats[playerName].completedLevels++;
    });

    // Convertir a array y ordenar por tiempo
    const rankings = Object.values(playerStats)
      .filter(player => player.completedLevels > 0)
      .sort((a, b) => a.totalTime - b.totalTime);

    return rankings;
  } catch (error) {
    console.error('Error obteniendo ranking:', error);
    return [];
  }
}

// Función para obtener estadísticas de un jugador específico
async function getPlayerStats(playerName) {
  try {
    const { data, error } = await supabase
      .from('rankings')
      .select('*')
      .eq('player_name', playerName);

    if (error) {
      console.error('Error obteniendo estadísticas del jugador:', error);
      return {};
    }

    const playerStats = {};
    data.forEach(record => {
      playerStats[`level${record.level}`] = {
        time: record.time,
        correct: record.correct,
        incorrect: record.incorrect,
        score: record.score,
        completed: record.completed
      };
    });

    return playerStats;
  } catch (error) {
    console.error('Error obteniendo estadísticas del jugador:', error);
    return {};
  }
} 