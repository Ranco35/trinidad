# 🧠 Juego de Memorice - Tablas de Multiplicar

## Descripción

El **Juego de Memorice - Tablas de Multiplicar** es un juego educativo multijugador que combina la mecánica clásica del memorice con el aprendizaje de las tablas de multiplicar. Los jugadores deben encontrar parejas de cartas que contengan una operación matemática y su resultado correspondiente.

## Características Principales

### 🎮 Modo Multijugador
- Soporte para 1-8 jugadores simultáneos
- Sistema de turnos automático
- Colores únicos para cada jugador
- Contador individual de parejas encontradas

### 📚 Niveles de Dificultad
1. **Nivel 1**: Tablas del 2 y 3
2. **Nivel 2**: Tablas del 4 y 5
3. **Nivel 3**: Tablas del 6 y 7
4. **Nivel 4**: Tablas del 8 y 9
5. **Nivel 5**: Tablas mixtas (todas las tablas)

### 🎯 Tamaños de Tablero
- 2×4 (8 cartas - 4 parejas)
- 3×4 (12 cartas - 6 parejas)
- 4×4 (16 cartas - 8 parejas)
- 4×5 (20 cartas - 10 parejas)
- 4×6 (24 cartas - 12 parejas)
- 6×6 (36 cartas - 18 parejas)

### 📊 Sistema de Estadísticas
- Tiempo total de juego
- Número de intentos
- Parejas encontradas por jugador
- Guardado automático de resultados en base de datos

## Cómo Jugar

### Reglas Básicas
1. **Configuración**: Selecciona el nivel de dificultad y el tamaño del tablero
2. **Jugadores**: Agrega o quita jugadores (mínimo 1, máximo 8)
3. **Turnos**: Cada jugador tiene su turno para encontrar parejas
4. **Parejas**: Haz clic en 2 cartas para buscar una pareja (operación + resultado)
5. **Puntuación**: Si encuentras una pareja correcta, ganas un punto y sigues jugando
6. **Victoria**: Gana quien tenga más parejas al final

### Mecánicas del Juego
- **Cartas de Operación**: Muestran multiplicaciones (ej: "2×3")
- **Cartas de Resultado**: Muestran el número resultado (ej: "6")
- **Pareja Correcta**: Una operación y su resultado correspondiente
- **Turno**: Si fallas, pasa al siguiente jugador
- **Continuación**: Si aciertas, sigues jugando

## Archivos del Proyecto

### Componentes React
- `JuegoMemoriceTablas.jsx` - Componente principal del juego
- `MemoriceStats.jsx` - Componente de estadísticas y rankings

### Configuración de Base de Datos
- `supabase-schema-memorice.sql` - Esquema SQL para la tabla de juegos
- `supabase-memorice-config.js` - Funciones de configuración y API

### Documentación
- `README-MEMORICE.md` - Este archivo de documentación

## Configuración de Base de Datos

### Tabla: `juegos_memorice`
```sql
CREATE TABLE juegos_memorice (
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
    fecha_juego TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Vistas Disponibles
- `ranking_memorice_global` - Ranking general de jugadores
- `ranking_memorice_nivel` - Ranking por nivel de dificultad
- `estadisticas_jugadores_memorice` - Estadísticas detalladas por partida

## Instalación y Configuración

### 1. Dependencias
```bash
npm install @supabase/supabase-js lucide-react
```

### 2. Configuración de Supabase
1. Crea un proyecto en Supabase
2. Ejecuta el SQL de `supabase-schema-memorice.sql`
3. Actualiza las credenciales en `supabase-memorice-config.js`

### 3. Variables de Entorno
```env
SUPABASE_URL=tu_url_de_supabase
SUPABASE_ANON_KEY=tu_clave_anonima
```

## Funcionalidades de Estadísticas

### 📈 Rankings Disponibles
- **Ranking Global**: Mejores jugadores por partidas ganadas
- **Ranking por Nivel**: Mejores tiempos por nivel de dificultad
- **Mejores Tiempos**: Récords de velocidad por configuración
- **Historial**: Partidas recientes con detalles

### 📊 Métricas Registradas
- Tiempo total de cada partida
- Número de intentos realizados
- Número de jugadores participantes
- Parejas encontradas por cada jugador
- Fecha y hora de cada partida

## Características Técnicas

### Tecnologías Utilizadas
- **Frontend**: React.js con Hooks
- **Base de Datos**: Supabase (PostgreSQL)
- **Iconos**: Lucide React
- **Estilos**: Tailwind CSS

### Arquitectura
- **Componente Principal**: Maneja la lógica del juego
- **Configuración**: Separación de lógica de base de datos
- **Estadísticas**: Componente independiente para rankings
- **Persistencia**: Guardado automático en Supabase

## Mejoras Futuras

### Funcionalidades Planificadas
- [ ] Modo de práctica individual
- [ ] Diferentes temas visuales
- [ ] Sonidos y efectos
- [ ] Modo torneo
- [ ] Exportación de estadísticas
- [ ] Logros y badges
- [ ] Modo offline

### Optimizaciones Técnicas
- [ ] Caché de datos de estadísticas
- [ ] Lazy loading de componentes
- [ ] Optimización de consultas SQL
- [ ] PWA (Progressive Web App)

## Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature
3. Implementa los cambios
4. Añade tests si es necesario
5. Envía un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Contacto

Para preguntas o sugerencias sobre el juego de memorice, contacta al equipo de desarrollo.

---

**¡Disfruta aprendiendo las tablas de multiplicar de forma divertida! 🎮📚**
