@echo off
title 🚀 Iniciando setup del proyecto GhostRunning
cd /d "%~dp0"

echo ===============================================
echo     🚀 Setup automático del proyecto GhostRunning
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

:: --- 3. Cargar variables del archivo .env (ubicado en Backend) ---
if exist "Proyecto\Backend\.env" (
    for /f "usebackq tokens=1,2 delims==" %%A in (`findstr /v "^#" "Proyecto\Backend\.env"`) do (
        set %%A=%%B
    )
    echo ✅ Variables de entorno cargadas desde Proyecto\Backend\.env
) else (
    echo ⚠️ No se encontró el archivo .env en Proyecto\Backend\
)

:: --- 4. Instalar dependencias del Backend ---
echo.
echo 📦 Instalando dependencias del Backend...
cd Proyecto\Backend || (
    echo ❌ No se encontró la carpeta Proyecto\Backend.
    pause
    exit /b
)
npm install

:: --- 5. Crear la base de datos si no existe ---
echo.
echo 🗄️ Verificando o creando base de datos...
call npm run create-db

:: --- 6. Volver al directorio raíz ---
cd ..\..

:: --- 7. Instalar dependencias del Frontend ---
echo.
echo 📱 Instalando dependencias del Frontend...
cd Proyecto\Frontend\ghost-running-app || (
    echo ❌ No se encontró la carpeta del frontend.
    pause
    exit /b
)
npm install

:: --- 8. Levantar el servidor Backend ---
echo.
echo 🚀 Levantando el servidor Backend...
cd Backend
call npm start

echo.
echo ===============================================
echo ✅ Setup completado con éxito.
echo ===============================================

pause