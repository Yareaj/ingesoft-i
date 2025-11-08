import "reflect-metadata"; 
import express from "express";
import * as dotenv from "dotenv";
import * as path from "path";
import Database from "./db/Database";
import { getFirstUser } from "./controller/UserController";



dotenv.config({ path: path.resolve(__dirname, '../.env') });


const app = express();
const PORT = process.env.PORT || 3000;

// Inicializar la Conexión a la Base de Datos usando el singleton Database
Database.initialize()
    .then(() => {
        console.log("✅ Conexión a la Base de Datos establecida con éxito (singleton).");

        app.use(express.json());  // Middleware para parsear JSON
    

        app.get("/api/hello-user", getFirstUser);

        // Iniciar el Servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor Express corriendo en el puerto ${PORT}`);
            console.log(`Endpoint de prueba: http://localhost:${PORT}/api/hello-user`);
        });
    })
    .catch((error) => console.error("❌ Error al conectar la base de datos:", error));