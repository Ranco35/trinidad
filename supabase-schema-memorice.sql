-- Esquema SQL para Supabase - Tabla de Juegos de Memorice
-- Ejecutar este SQL en el SQL Editor de Supabase

-- Crear tabla de juegos de memorice
CREATE TABLE IF NOT EXISTS juegos_memorice (
    id BIGSERIAL PRIMARY KEY,
    tipo_juego TEXT NOT NULL DEFAULT 'memorice_tablas',
    nivel INTEGER NOT NULL,
    tamano_tablero TEXT NOT NULL,
    tiempo_total INTEGER NOT NULL,
    intentos_totales INTEGER NOT NULL,
    numero_jugadores INTEGER NOT NULL,
    ganador TEXT NOT NULL,
    parejas_ganador INTEGER NOT NULL,
    jugadores JSONB NOT NULL,
    fecha_juego TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_juegos_memorice_tipo ON juegos_memorice(tipo_juego);
CREATE INDEX IF NOT EXISTS idx_juegos_memorice_nivel ON juegos_memorice(nivel);
CREATE INDEX IF NOT EXISTS idx_juegos_memorice_fecha ON juegos_memorice(fecha_juego);
CREATE INDEX IF NOT EXISTS idx_juegos_memorice_ganador ON juegos_memorice(ganador);
CREATE INDEX IF NOT EXISTS idx_juegos_memorice_tiempo ON juegos_memorice(tiempo_total);

-- Habilitar Row Level Security (RLS)
ALTER TABLE juegos_memorice ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública
CREATE POLICY "Allow public read access" ON juegos_memorice
    FOR SELECT USING (true);

-- Política para permitir inserción/actualización
CREATE POLICY "Allow public insert/update" ON juegos_memorice
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
CREATE TRIGGER update_juegos_memorice_updated_at 
    BEFORE UPDATE ON juegos_memorice 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Vista para ranking de memorice por nivel
CREATE OR REPLACE VIEW ranking_memorice_nivel AS
SELECT 
    ganador,
    nivel,
    tamano_tablero,
    COUNT(*) as partidas_ganadas,
    AVG(tiempo_total) as tiempo_promedio,
    AVG(intentos_totales) as intentos_promedio,
    MAX(parejas_ganador) as max_parejas,
    MIN(tiempo_total) as mejor_tiempo
FROM juegos_memorice 
WHERE tipo_juego = 'memorice_tablas'
GROUP BY ganador, nivel, tamano_tablero
ORDER BY nivel, tiempo_promedio ASC;

-- Vista para ranking global de memorice
CREATE OR REPLACE VIEW ranking_memorice_global AS
SELECT 
    ganador,
    COUNT(*) as total_partidas_ganadas,
    SUM(tiempo_total) as tiempo_total_acumulado,
    AVG(tiempo_total) as tiempo_promedio,
    SUM(intentos_totales) as intentos_total_acumulado,
    AVG(intentos_totales) as intentos_promedio,
    SUM(parejas_ganador) as total_parejas_ganadas,
    AVG(parejas_ganador) as promedio_parejas_por_partida,
    MAX(fecha_juego) as ultima_partida
FROM juegos_memorice 
WHERE tipo_juego = 'memorice_tablas'
GROUP BY ganador
ORDER BY total_partidas_ganadas DESC, tiempo_promedio ASC;

-- Vista para estadísticas de jugadores por partida
CREATE OR REPLACE VIEW estadisticas_jugadores_memorice AS
SELECT 
    id,
    fecha_juego,
    nivel,
    tamano_tablero,
    tiempo_total,
    intentos_totales,
    numero_jugadores,
    ganador,
    parejas_ganador,
    jugadores,
    jsonb_array_length(jugadores) as num_jugadores_real
FROM juegos_memorice 
WHERE tipo_juego = 'memorice_tablas'
ORDER BY fecha_juego DESC;

-- Comentarios sobre la estructura
COMMENT ON TABLE juegos_memorice IS 'Tabla para almacenar resultados de juegos de memorice de tablas de multiplicar';
COMMENT ON COLUMN juegos_memorice.tipo_juego IS 'Tipo de juego (memorice_tablas)';
COMMENT ON COLUMN juegos_memorice.nivel IS 'Nivel de dificultad (1-5)';
COMMENT ON COLUMN juegos_memorice.tamano_tablero IS 'Tamaño del tablero (ej: 4x4, 6x6)';
COMMENT ON COLUMN juegos_memorice.tiempo_total IS 'Tiempo total en segundos para completar el juego';
COMMENT ON COLUMN juegos_memorice.intentos_totales IS 'Número total de intentos realizados';
COMMENT ON COLUMN juegos_memorice.numero_jugadores IS 'Número de jugadores que participaron';
COMMENT ON COLUMN juegos_memorice.ganador IS 'Nombre del jugador ganador';
COMMENT ON COLUMN juegos_memorice.parejas_ganador IS 'Número de parejas encontradas por el ganador';
COMMENT ON COLUMN juegos_memorice.jugadores IS 'Array JSON con información de todos los jugadores';
COMMENT ON COLUMN juegos_memorice.fecha_juego IS 'Fecha y hora cuando se jugó la partida';
