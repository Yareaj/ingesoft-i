@echo off
title 🚀 Iniciando setup del proyecto Ingesoft-i
cd /d "%~dp0"
echo ===============================================
echo    🚀 Setup automático del proyecto Ingesoft-i
echo ===============================================

:: --- 1. Verificar Node.js ---
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado. Por favor instálalo y vuelve a ejecutar este script.
    pause
    exit /b
)

:: --- 2. Verificar npm ---
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm no está instalado. Por favor instálalo y vuelve a ejecutar este script.
    pause
    exit /b
)

:: --- 3. Cargar variables del archivo .env ---
if exist ".env" (
    for /f "usebackq tokens=1,2 delims==" %%A in (`findstr /v "^#" ".env"`) do (
        set %%A=%%B
    )
    echo ✅ Variables de entorno cargadas desde .env
) else (
    echo ⚠️ No se encontró el archivo .env en la raíz del proyecto.
)

:: --- 4. Instalar dependencias del Backend ---
echo.
echo 📦 Instalando dependencias del Backend...
cd Proyecto/Backend
call npm install

:: --- 5. Crear la base de datos si no existe ---
echo.
echo 🗄️ Verificando o creando base de datos...
call npm run create-db

:: --- 6. Volver al directorio raíz ---
cd ..

:: --- 7. Instalar dependencias del proyecto móvil (si existe) ---
if exist "mobile-app\" (
    echo.
    echo 📱 Instalando dependencias del proyecto móvil...
    cd Proeycto/mobile-app
    call npm install
    cd ..
) else (
    echo ℹ️ No se encontró la carpeta mobile-app.
    echo 💡 Puedes crearla más adelante con: npx create-expo-app mobile-app
)

:: --- 8. Levantar el servidor Backend ---
echo.
echo 🚀 Levantando el servidor Backend...
cd Backend
call npm start

echo.
echo ===============================================
echo ✅ Setup completado con éxito.
echo 🌐 Backend corriendo en: http://localhost:3000
echo 📱 Cuando crees la app móvil, podrás ejecutarla con: cd mobile-app && npx expo start
echo ===============================================

pause
