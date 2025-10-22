// scripts/create-db.js
const { Client } = require('pg');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });


const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: 'postgres', // nos conectamos a la base default
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

(async () => {
  try {
    await client.connect();
    const dbName = process.env.DB_NAME;
    const result = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);
    if (result.rowCount === 0) {
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Base de datos "${dbName}" creada exitosamente.`);
    } else {
      console.log(`ℹ️ La base de datos "${dbName}" ya existe.`);
    }
  } catch (err) {
    console.error('❌ Error creando la base de datos:', err);
  } finally {
    await client.end();
  }
})();
