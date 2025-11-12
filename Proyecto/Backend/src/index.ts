import "reflect-metadata";
import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import * as path from "path";
import { getFirstUser, registerUser, loginUser } from "./db_connection/controller/UserController";
import Database from "./db_connection/db/Database";

// Modulo para obtener la ip local
import getLocalIP from "./db_connection/config/getLocalIp";


dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const app = express();
const PORT = process.env.PORT || 3000;
const localIP = getLocalIP();

Database.initialize()
	.then(() => {
		console.log("✅ Conexión a la Base de Datos establecida con éxito (singleton).");

		// Middlewares
		app.use(cors());
		app.use(express.json());

		// Aqui definimos los endpoints
		app.get("/api/hello-user", getFirstUser);
		
		app.post("/api/login", loginUser);
		app.post("/api/register", registerUser);

		app.listen(PORT, () => {
			console.log(`🚀 Servidor Express corriendo en el puerto ${PORT}`);
			console.log(`Endpoint de prueba: http://${localIP}:${PORT}/api/hello-user`);
			console.log(`Endpoint de registro: http://${localIP}:${PORT}/api/register`);
		});
	})
	.catch((error) => console.error("❌ Error al conectar la base de datos:", error));