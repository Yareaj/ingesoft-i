import { Client } from 'pg'; // importa cliente PostgreSQL para conexión directa
import dotenv from 'dotenv'; // Habilita variables de entorno
import { readFileSync } from 'fs';
import path from 'path';

dotenv.config(); // Carga variables de entorno

const createDatabase = async () => {
    const dbName = process.env.DB_NAME as string;

    const adminClient = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT)
    });

    try {
        await adminClient.connect();

        // Verificar si la base de datos existe
        const checkResult = await adminClient.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            [dbName]
        );

        if (checkResult.rows.length === 0) {
            // Crear base de datos si no existe
            await adminClient.query(`CREATE DATABASE "${dbName}"`);
            console.log(`Base de datos ${dbName} creada exitosamente`);
        } else {
            console.log(`Base de datos ${dbName} ya existe`);
        }

        await adminClient.end();


        const dbClient = new Client({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT),
            database: dbName
        });
        await dbClient.connect();

        const sqlScriptPath = path.join(__dirname, '../db/init.sql');
        const sqlScriptContent = readFileSync(sqlScriptPath, 'utf8');

        await dbClient.query(sqlScriptContent);
        console.log('Tablas creadas/existentes aplicadas correctamente');

        await dbClient.end();
    } catch (error) {
        console.error('Error al crear la base de datos o las tablas:', error);
        
    }
};

createDatabase();