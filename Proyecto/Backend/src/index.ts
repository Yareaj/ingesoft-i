import "reflect-metadata";
import express from "express";
import * as dotenv from "dotenv";
import * as path from "path";
import getLocalIP from "./db_connection/config/getLocalIp";
import Database from "./db_connection/db/Database";
import { getFirstUser, registerUser } from "./db_connection/controller/UserController";


dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const app = express();
const PORT = process.env.PORT || 3000;
const localIP = getLocalIP();

Database.initialize()
    .then(() => {
        console.log("✅ Conexión a la Base de Datos establecida con éxito (singleton).");
        
        app.use(express.json());  // Middleware para parsear JSON

        //Aqui definimos los endpoints
        app.get("/api/hello-user", getFirstUser);

        app.post("/api/register", registerUser);

        app.listen(PORT, () => {
            console.log(`🚀 Servidor Express corriendo en el puerto ${PORT}`);
            console.log(`Endpoint de prueba: http://${localIP}:${PORT}/api/hello-user`);
        });
    })
    .catch((error) => console.error("❌ Error al conectar la base de datos:", error));