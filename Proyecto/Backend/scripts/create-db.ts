import { Client } from 'pg'; // importa cliente PosrgreSQL para conexión directa
import dotenv from 'dotenv'; // Habilita variables de entorno

dotenv.config(); // Carga variables de entorno

const createDatabase = async () => {
    const client = new Client({   // Configura conexión inicial a PostgreSQL
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_DEFAULT || 'postgres'
    });

    try { // Logica de verificación
        await client.connect();  // Establece la conección 
        const dbName = process.env.DB_NAME;

        // Verificar si la base de datos existe
        const checkResult = await client.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            [dbName]
        );

        if (checkResult.rows.length === 0) {
            // Crear base de datos si no existe
            await client.query(`CREATE DATABASE ${dbName}`);
            console.log(`Base de datos ${dbName} creada exitosamente`);
        } else {
            console.log(`Base de datos ${dbName} ya existe`);
        }
    } catch (error) {
        console.error('Error al crear la base de datos:', error);
    } finally {
        await client.end();
    }
};

createDatabase();