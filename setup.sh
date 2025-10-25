#!/bin/bash

echo "🚀 Iniciando setup completo del proyecto GhostRunning..."

# --- 1. Verificar Node.js ---
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Instálalo y vuelve a ejecutar este script."
    exit 1
fi

# --- 2. Verificar npm ---
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado. Instálalo y vuelve a ejecutar este script."
    exit 1
fi

# --- 3. Cargar variables del archivo .env (ubicado en Backend) ---
if [ -f "Proyecto/Backend/.env" ]; then
    export $(grep -v '^#' Proyecto/Backend/.env | xargs)
    echo "✅ Variables de entorno cargadas desde Proyecto/Backend/.env"
else
    echo "⚠️ No se encontró el archivo .env en Proyecto/Backend/"
fi

# --- 4. Instalar dependencias del Backend ---
echo "📦 Instalando dependencias del Backend..."
cd Proyecto/Backend || { echo "❌ No se encontró la carpeta Backend."; exit 1; }
npm install

# --- 5. Crear base de datos si no existe ---
echo "🗄️ Verificando o creando base de datos..."
npm run create-db

# --- 6. Volver a la raíz ---
cd ../..

# --- 7. Instalar dependencias del Frontend ---
echo "📱 Instalando dependencias del Frontend..."
cd Proyecto/Frontend/ghost-running-app || { echo "❌ No se encontró la carpeta del frontend."; exit 1; }
npm install

# --- 8. Levantar el servidor Backend ---
echo "🚀 Levantando el servidor Backend..."
cd Backend
npm start

echo "==============================================="
echo "✅ Setup completado con éxito."
echo "==============================================="