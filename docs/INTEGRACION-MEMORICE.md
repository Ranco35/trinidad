# 📋 Documentación de Integración - Juego de Memorice

## Resumen de Implementación

El juego de memorice ha sido implementado como un módulo independiente que se integra con el sistema de base de datos existente de Supabase. Incluye funcionalidad completa de multijugador, sistema de rankings y estadísticas detalladas.

## Archivos Creados

### 1. Componentes React
```
JuegoMemoriceTablas.jsx     # Componente principal del juego
MemoriceStats.jsx           # Componente de estadísticas y rankings
```

### 2. Configuración de Base de Datos
```
supabase-schema-memorice.sql    # Esquema SQL para la nueva tabla
supabase-memorice-config.js     # Funciones de configuración y API
```

### 3. Documentación
```
README-MEMORICE.md              # Documentación del usuario
docs/INTEGRACION-MEMORICE.md    # Esta documentación técnica
```

## Estructura de Base de Datos

### Nueva Tabla: `juegos_memorice`

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
    fecha_juego TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Campos Principales
- `tipo_juego`: Identificador del tipo de juego ('memorice_tablas')
- `nivel`: Nivel de dificultad (1-5)
- `tamano_tablero`: Tamaño del tablero (ej: '4x4', '6x6')
- `tiempo_total`: Tiempo en segundos para completar el juego
- `intentos_totales`: Número total de intentos realizados
- `numero_jugadores`: Cantidad de jugadores que participaron
- `ganador`: Nombre del jugador ganador
- `parejas_ganador`: Número de parejas encontradas por el ganador
- `jugadores`: Array JSON con información de todos los jugadores

### Vistas Creadas

#### 1. `ranking_memorice_global`
Ranking general de jugadores ordenado por partidas ganadas y tiempo promedio.

#### 2. `ranking_memorice_nivel`
Ranking específico por nivel de dificultad y tamaño de tablero.

#### 3. `estadisticas_jugadores_memorice`
Vista detallada de todas las partidas con información completa.

## Funciones de API Implementadas

### En `supabase-memorice-config.js`

#### Guardado de Datos
```javascript
guardarResultadoMemorice(datosJuego)
```
Guarda los resultados de una partida en la base de datos.

#### Consultas de Estadísticas
```javascript
obtenerRankingMemoriceGlobal()
obtenerRankingMemoriceNivel(nivel)
obtenerEstadisticasGeneralesMemorice()
obtenerHistorialMemorice(limite)
obtenerMejoresTiemposMemorice()
```

## Integración con el Proyecto Principal

### 1. Configuración de Supabase

**Paso 1**: Ejecutar el esquema SQL
```sql
-- Ejecutar el contenido de supabase-schema-memorice.sql
-- en el SQL Editor de Supabase
```

**Paso 2**: Actualizar credenciales
```javascript
// En supabase-memorice-config.js
const SUPABASE_URL = 'tu_url_de_supabase';
const SUPABASE_ANON_KEY = 'tu_clave_anonima';
```

### 2. Instalación de Dependencias

```bash
npm install @supabase/supabase-js lucide-react
```

### 3. Importación de Componentes

```javascript
// En tu aplicación principal
import JuegoMemoriceTablas from './JuegoMemoriceTablas';
import MemoriceStats from './MemoriceStats';
```

### 4. Configuración de Rutas (si usas React Router)

```javascript
import { Routes, Route } from 'react-router-dom';

<Routes>
  <Route path="/memorice" element={<JuegoMemoriceTablas />} />
  <Route path="/memorice/stats" element={<MemoriceStats />} />
</Routes>
```

## Características del Juego

### Sistema Multijugador
- Soporte para 1-8 jugadores
- Colores únicos por jugador
- Sistema de turnos automático
- Contador individual de parejas

### Niveles de Dificultad
1. **Nivel 1**: Tablas del 2 y 3
2. **Nivel 2**: Tablas del 4 y 5
3. **Nivel 3**: Tablas del 6 y 7
4. **Nivel 4**: Tablas del 8 y 9
5. **Nivel 5**: Tablas mixtas

### Tamaños de Tablero
- 2×4, 3×4, 4×4, 4×5, 4×6, 6×6

## Funcionalidades de Estadísticas

### Rankings Disponibles
- **Global**: Mejores jugadores por partidas ganadas
- **Por Nivel**: Mejores tiempos por nivel específico
- **Mejores Tiempos**: Récords de velocidad
- **Historial**: Partidas recientes

### Métricas Registradas
- Tiempo total de partida
- Número de intentos
- Parejas por jugador
- Fecha y hora de partida

## Consideraciones de Seguridad

### Row Level Security (RLS)
- Habilitado en la tabla `juegos_memorice`
- Políticas públicas para lectura e inserción
- Permite acceso anónimo para funcionalidad básica

### Validación de Datos
- Validación en el frontend antes del envío
- Validación en la base de datos con constraints
- Sanitización de datos de entrada

## Optimizaciones Implementadas

### Base de Datos
- Índices en campos frecuentemente consultados
- Vistas materializadas para rankings
- Triggers para actualización automática de timestamps

### Frontend
- Lazy loading de componentes de estadísticas
- Caché de datos de rankings
- Optimización de re-renders con React.memo

## Testing y Validación

### Casos de Prueba Recomendados
1. **Funcionalidad Básica**
   - Crear partida con 1 jugador
   - Encontrar parejas correctas
   - Verificar guardado de resultados

2. **Multijugador**
   - Partida con múltiples jugadores
   - Cambio de turnos
   - Cálculo correcto de ganador

3. **Estadísticas**
   - Carga de rankings
   - Filtrado por nivel
   - Actualización en tiempo real

4. **Casos Extremos**
   - Tablero grande (6×6)
   - Nivel más difícil
   - Múltiples jugadores (8)

## Mantenimiento y Monitoreo

### Logs Recomendados
```javascript
// En las funciones de guardado
console.log('Resultado guardado:', data);
console.error('Error guardando:', error);

// En las consultas
console.log('Datos cargados:', data);
console.error('Error cargando:', error);
```

### Métricas a Monitorear
- Número de partidas por día
- Tiempo promedio de partida
- Nivel más jugado
- Errores de guardado

## Escalabilidad

### Consideraciones Futuras
- Particionamiento de tabla por fecha
- Caché Redis para rankings
- CDN para assets estáticos
- Compresión de datos JSON

### Límites Actuales
- Máximo 8 jugadores por partida
- Tablero máximo 6×6
- 5 niveles de dificultad
- Sin límite en número de partidas

## Soporte y Documentación

### Archivos de Referencia
- `README-MEMORICE.md`: Documentación completa del usuario
- `supabase-schema-memorice.sql`: Esquema de base de datos
- `supabase-memorice-config.js`: Funciones de API

### Contacto
Para soporte técnico o preguntas sobre la implementación, contactar al equipo de desarrollo.

---

**Estado**: ✅ Implementado y listo para producción
**Versión**: 1.0.0
**Última actualización**: [Fecha actual]
