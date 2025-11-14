import "reflect-metadata";
import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import * as path from "path";
import { getFirstUser, registerUser, loginUser, upload } from "./db_connection/controller/UserController";
import { saveTraining, getUserTrainings, calculateTraining } from "./db_connection/controller/TrainingController";
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

		// Serve static images
		app.use('/images', express.static(path.join(__dirname, '../../Database/db_images')));

		// Aqui definimos los endpoints
		app.get("/api/hello-user", getFirstUser);

		app.post("/api/login", loginUser);
		app.post("/api/register", upload.single('profilePhoto'), registerUser);

		// Endpoints de training
		app.post("/api/trainings/calculate", calculateTraining);
		app.post("/api/trainings", saveTraining);
		app.get("/api/trainings/:userEmail", getUserTrainings);

		app.listen(PORT, () => {
			console.log(`🚀 Servidor Express corriendo en el puerto ${PORT}`);
			console.log(`Endpoint de prueba: http://${localIP}:${PORT}/api/hello-user`);
			console.log(`Endpoint de registro: http://${localIP}:${PORT}/api/register`);
		});
	})
	.catch((error) => console.error("❌ Error al conectar la base de datos:", error));