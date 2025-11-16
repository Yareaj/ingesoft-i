// src/index.ts
import "reflect-metadata"; // Debe ser la primera importación - necesaria para TypeORM
import express from "express"; // Framework web
import * as dotenv from "dotenv";  // Manejo de variables de entorno
import * as path from "path"; // Manejo de rutas de archivos
import { AppDataSource } from "./config/dataSource";  // Configuración de TypeORM
import Database from "./db/Database";
import { getFirstUser } from "./controller/UserController"; // Controlador de usuario


// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../.env') });
// ¡¡¡LÍNEA DE DEBUG!!!
console.log(`DEBUG: DB_PASSWORD leída: [${process.env.DB_PASSWORD}]`);

const app = express();
const PORT = process.env.PORT || 3000;

// Inicializar la Conexión a la Base de Datos usando el singleton Database
Database.initialize()
    .then(() => {
        console.log("✅ Conexión a la Base de Datos establecida con éxito (singleton).");

        app.use(express.json());  // Middleware para parsear JSON
        
        // Ruta de prueba
        app.get("/api/hello-user", getFirstUser);

        // Iniciar el Servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor Express corriendo en el puerto ${PORT}`);
            console.log(`Endpoint de prueba: http://localhost:${PORT}/api/hello-user`);
        });
    })
    .catch((error) => console.error("❌ Error al conectar la base de datos:", error));