-- Esquema SQL para Supabase - Tabla de Rankings
-- Ejecutar este SQL en el SQL Editor de Supabase

-- Crear tabla de rankings
CREATE TABLE IF NOT EXISTS rankings (
    id BIGSERIAL PRIMARY KEY,
    player_name TEXT NOT NULL,
    level INTEGER NOT NULL,
    time INTEGER NOT NULL,
    correct INTEGER NOT NULL DEFAULT 0,
    incorrect INTEGER NOT NULL DEFAULT 0,
    score INTEGER NOT NULL DEFAULT 0,
    completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice único para evitar duplicados
CREATE UNIQUE INDEX IF NOT EXISTS idx_player_level ON rankings(player_name, level);

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_player_name ON rankings(player_name);
CREATE INDEX IF NOT EXISTS idx_completed ON rankings(completed);
CREATE INDEX IF NOT EXISTS idx_time ON rankings(time);

-- Habilitar Row Level Security (RLS)
ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública
CREATE POLICY "Allow public read access" ON rankings
    FOR SELECT USING (true);

-- Política para permitir inserción/actualización
CREATE POLICY "Allow public insert/update" ON rankings
    FOR ALL USING (true);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_rankings_updated_at 
    BEFORE UPDATE ON rankings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Vista para ranking global
CREATE OR REPLACE VIEW global_ranking AS
SELECT 
    player_name,
    COUNT(*) as completed_levels,
    SUM(time) as total_time,
    SUM(correct) as total_correct,
    SUM(incorrect) as total_incorrect,
    AVG(time) as avg_time_per_level
FROM rankings 
WHERE completed = true
GROUP BY player_name
ORDER BY total_time ASC;

-- Comentarios sobre la estructura
COMMENT ON TABLE rankings IS 'Tabla para almacenar estadísticas de jugadores de MateMaster';
COMMENT ON COLUMN rankings.player_name IS 'Nombre del jugador';
COMMENT ON COLUMN rankings.level IS 'Nivel completado (1-4)';
COMMENT ON COLUMN rankings.time IS 'Tiempo en segundos para completar el nivel';
COMMENT ON COLUMN rankings.correct IS 'Número de respuestas correctas';
COMMENT ON COLUMN rankings.incorrect IS 'Número de respuestas incorrectas';
COMMENT ON COLUMN rankings.score IS 'Puntuación final del nivel';
COMMENT ON COLUMN rankings.completed IS 'Si el nivel fue completado exitosamente'; 