#!/bin/bash

echo "Iniciando setup completo del proyecto GhostRunning..."

# 1) Verificar Node.js
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js no esta instalado. Instalalo y vuelve a ejecutar este script."
  exit 1
fi

# 2) Verificar npm
if ! command -v npm >/dev/null 2>&1; then
  echo "npm no esta instalado. Instalalo y vuelve a ejecutar este script."
  exit 1
fi

# --- 3. Cargar variables del archivo .env (ubicado en Backend) ---
if [ -f "Proyecto/Backend/.env" ]; then
    export $(grep -v '^#' Proyecto/Backend/.env | xargs)
    echo " Variables de entorno cargadas desde Proyecto/Backend/.env"
else
    echo " No se encontro el archivo .env en Proyecto/Backend/"
fi

# 4) Instalar dependencias del Backend
echo "Instalando dependencias del Backend..."
cd Proyecto/Backend || { echo "No se encontro la carpeta Proyecto/Backend."; exit 1; }
npm install

# 5) Verificar o crear base de datos (ejecuta el script disponible)
echo "Verificando o creando base de datos..."
npm run setup-db

# 6) Volver a la raiz relativa del repo
cd ../.. || true

# 7) Instalar dependencias del Frontend
echo "Instalando dependencias del Frontend..."
cd Proyecto/Frontend/ghost-running-app || { echo "No se encontro la carpeta del frontend."; exit 1; }
npm install

# 8) Levantar el servidor Backend (bloqueante, como en el .bat)
echo "Levantando el servidor Backend..."
cd ../../Backend || { echo "No se encontro la carpeta Backend."; exit 1; }
npm start

echo "==============================================="
echo "Setup completado con exito."
echo "==============================================="