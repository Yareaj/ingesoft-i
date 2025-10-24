// scripts/create-db.js
const { Client } = require('pg');
const path = require('path');
const dotenv = require('dotenv');

// Carga el archivo .env usando la ruta corregida (tres niveles arriba)
const envPath = path.resolve(__dirname, '../.env');
const result = dotenv.config({ path: envPath });

// --- VERIFICACIÓN DE CARGA (Para referencia) ---
if (result.error) {
  console.error('❌ ERROR AL CARGAR .env:', result.error.message);
  console.log(`Ruta del .env intentada: ${envPath}`);
  process.exit(1);
}

console.log(`✅ .env cargado exitosamente. `);
console.log(`DB_HOST: ${process.env.DB_HOST}`);
console.log(`DB_USER: ${process.env.DB_USER}`);
console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD ? '*****' : '❌ UNDEFINED'}`);
console.log(`DB_NAME: ${process.env.DB_NAME}`);
// -----------------------------


const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: 'postgres', // Nos conectamos a la base default para poder crear la DB
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

(async () => {
  try {
    // 1. Conexión al servidor (usando la BD "postgres" temporalmente)
    await client.connect();

    // 2. Definición y uso de la variable de la base de datos (CORRECCIÓN)
    const dbName = process.env.DB_NAME; 
    
    // 3. Verificamos si la base de datos ya existe de forma segura
    const checkResult = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);

    if (checkResult.rowCount === 0) {
      // 4. Si no existe, la creamos
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Base de datos "${dbName}" creada exitosamente.`);
    } else {
      console.log(`ℹ️ La base de datos "${dbName}" ya existe.`);
    }
  } catch (err) {
    console.error('❌ Error creando la base de datos:', err);
  } finally {
    // 5. Cerramos la conexión
    await client.end();
  }
})();