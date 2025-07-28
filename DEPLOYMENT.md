# 🚀 Guía de Despliegue - MateMaster TWICE Edition

## 📋 Archivos Configurados

Los siguientes archivos han sido actualizados para garantizar que el servidor Node.js funcione correctamente en producción:

### ✅ Archivos Actualizados:

1. **`package.json`** - Scripts de inicio configurados
2. **`server.js`** - Servidor Node.js con endpoints `/health` y `/api/rankings`
3. **`vercel.json`** - Configurado para usar `@vercel/node`
4. **`railway.json`** - Configurado para usar `npm start` y healthcheck `/health`
5. **`railway.toml`** - Configuración de Railway con healthcheck correcto
6. **`Procfile`** - Para Heroku/Railway: `web: node server.js`

## 🔧 Para Redesplegar:

### 📌 **Vercel:**
```bash
# Los cambios se aplicarán automáticamente en el próximo push
git add .
git commit -m "🔧 Configurar servidor Node.js para producción"
git push origin main
```

### 📌 **Railway:**
```bash
# Railway redesplegará automáticamente
# O manualmente en el dashboard de Railway > Deploy
```

### 📌 **Heroku:**
```bash
git push heroku main
```

## 🧪 Cómo Verificar que Funciona:

1. **Local**: `npm run dev` → Test en `http://localhost:3000`
2. **Producción**: Visitar tu URL → Hacer clic en "🔧 Probar Servidor"

### ✅ Respuesta Exitosa:
```
✅ Servidor PRODUCCIÓN funcionando correctamente!
🔗 URL: https://tu-app.vercel.app
🌍 Entorno: PRODUCCIÓN
💚 Health: OK
📡 Content-Type: application/json
🏆 Niveles: 5
📊 Versión: 2.0
```

### ❌ Si Aún Da Error:

1. **Verificar logs** en tu plataforma de hosting
2. **Confirmar redeploy** después de los cambios
3. **Revisar que los archivos** de configuración estén actualizados

## 📊 Endpoints Disponibles:

- `GET /` - Página principal del juego
- `GET /health` - Health check del servidor
- `GET /api/rankings` - Obtener ranking global
- `POST /api/rankings` - Guardar estadísticas del jugador

## 🎯 Características:

- ✅ **5 Niveles** completos con ejercicios de operaciones combinadas
- ✅ **Ranking global** con persistencia en servidor
- ✅ **Responsive design** para móviles
- ✅ **Tema TWICE** en nivel experto
- ✅ **Sistema de progreso** con criterios específicos

---

**Creado por Trinidad Proboste** 👑  
*¡MateMaster TWICE Edition - Donde las matemáticas se vuelven divertidas!* 💖 