# Ghost Running - Frontend Setup

## Nueva Funcionalidad: HomeScreen con Mapa y Navegación

### 📦 Instalación de Dependencias

Después de los cambios, ejecuta en el directorio `Proyecto/Frontend`:

```bash
npm install
```

Esto instalará las nuevas dependencias:
- `expo-location` - Para obtener la ubicación GPS del usuario
- `react-native-maps` - Para mostrar el mapa interactivo
- `@react-navigation/native` - Sistema de navegación
- `@react-navigation/bottom-tabs` - Navegación por pestañas
- `react-native-screens` - Optimización de pantallas

### 🗺️ Configuración de Google Maps (Android)

Para que el mapa funcione en Android, necesitas una API Key de Google Maps:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto o selecciona uno existente
3. Habilita la API de "Maps SDK for Android"
4. Crea credenciales (API Key)
5. Copia la API Key generada
6. Pega la API Key en `app.json`:

```json
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "TU_API_KEY_AQUI"
    }
  }
}
```

### 🎨 Características Implementadas

#### HomeScreen (Pantalla Principal)
- ✅ Imagen de perfil del usuario con borde naranja (theme.colors.primary)
- ✅ Mensaje de bienvenida personalizado "Welcome back, {userName}!"
- ✅ Mapa interactivo con la ubicación actual del usuario
- ✅ Solicitud automática de permisos de ubicación al entrar
- ✅ Mensaje de error si se deniegan los permisos con botón para reintentarlo
- ✅ 3 Botones de acción con componente reutilizable `GRButton`:
  - 🏃 **Start New Training** (variant: primary)
  - 📍 **Saved Routes** (variant: secondary)
  - 📊 **History** (variant: secondary)

#### Navegación Bottom Tab
- 🏠 **Home** - Pantalla principal con mapa
- 📱 **Feed** - Pantalla de feed (placeholder)
- 👤 **Profile** - Pantalla de perfil con stats

#### FeedScreen
- Placeholder para futura implementación
- Usa `commonStyles` para header y layout base

#### ProfileScreen
- Imagen de perfil con borde naranja
- Nombre y email del usuario
- Tarjetas de estadísticas (Trainings, Distance, Time)
- Botones de acción implementados con `GRButton`

#### Sistema de diseño y estilos comunes
- Tokens de diseño en `src/config/designSystem.ts` (colors, spacing, radii, typography)
- Estilos compartidos en `src/config/commonStyles.ts` (container, header, headerText, center, placeholderText, etc.)
- Botón reutilizable en `src/components/GRButton.tsx` (variants: primary, secondary, outline)

### 🚀 Cómo Ejecutar

```bash
# Desde el directorio Frontend
npm start

# Para Android
npm run android

# Para iOS
npm run ios
```

### 📱 Permisos Requeridos

La app solicitará automáticamente:
- **Ubicación (GPS)** - Para rastrear entrenamientos y mostrar rutas

### 🎨 Paleta de Colores

- **Naranja Principal**: #FF6B00
- **Fondo Negro**: #000000
- **Fondo Secundario**: #1a1a1a
- **Texto Gris**: #888888
- **Texto Blanco**: #FFFFFF

### 📝 Notas Importantes

1. Los errores de TypeScript que ves en VSCode son temporales hasta que instales las dependencias con `npm install`
2. Para Android, DEBES configurar la Google Maps API Key
3. Para iOS, los permisos de ubicación ya están configurados en app.json
4. En el emulador, puedes simular ubicaciones GPS desde las herramientas del emulador

### 🔄 Próximos Pasos

Las funcionalidades de los botones actualmente muestran alerts. Necesitarás implementar:
- Pantalla de nuevo entrenamiento con tracking en tiempo real
- Lista de rutas guardadas
- Historial de entrenamientos con detalles

### 🐛 Troubleshooting

**Si el mapa no se muestra:**
- Verifica que instalaste las dependencias (`npm install`)
- Verifica la API Key de Google Maps en app.json
- Asegúrate de dar permisos de ubicación

**Si los permisos no funcionan:**
- En Android: Ve a Settings > Apps > Ghost Running > Permissions
- En iOS: Settings > Privacy > Location Services > Ghost Running

**Si la navegación no funciona:**
- Limpia la caché: `npm start --clear`
- Reinstala node_modules: `rm -rf node_modules && npm install`
