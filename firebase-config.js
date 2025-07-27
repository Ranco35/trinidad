// Configuración de Firebase para ranking global
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "matemaster-ranking.firebaseapp.com",
  projectId: "matemaster-ranking",
  storageBucket: "matemaster-ranking.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Función para guardar estadísticas en Firebase
async function saveStatsToFirebase(playerName, level, stats) {
  try {
    await db.collection('rankings').doc(playerName).set({
      [level]: stats,
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    console.log('Estadísticas guardadas en Firebase');
  } catch (error) {
    console.error('Error guardando en Firebase:', error);
  }
}

// Función para obtener ranking global
async function getGlobalRanking() {
  try {
    const snapshot = await db.collection('rankings').get();
    const rankings = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      let totalTime = 0;
      let totalCorrect = 0;
      let totalIncorrect = 0;
      let completedLevels = 0;
      
      for (let level = 1; level <= 4; level++) {
        const levelData = data[`level${level}`];
        if (levelData && levelData.completed) {
          totalTime += levelData.time;
          totalCorrect += levelData.correct;
          totalIncorrect += levelData.incorrect;
          completedLevels++;
        }
      }
      
      if (completedLevels > 0) {
        rankings.push({
          name: doc.id,
          totalTime,
          totalCorrect,
          totalIncorrect,
          completedLevels
        });
      }
    });
    
    return rankings.sort((a, b) => a.totalTime - b.totalTime);
  } catch (error) {
    console.error('Error obteniendo ranking:', error);
    return [];
  }
} 