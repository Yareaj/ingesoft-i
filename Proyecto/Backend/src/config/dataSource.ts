// src/config/dataSource.ts (Versión con HARDCODEO final)
import "reflect-metadata"; 
import { DataSource } from "typeorm";
import { User } from "../entity/User"; 

// Usamos el puerto (5432) y host (localhost) directamente, ya que el .env podría fallar
const dbPort = 5432; 

export const AppDataSource = new DataSource({
    type: "postgres", 
    host: "localhost",
    port: dbPort, 
    // FORZAMOS EL USUARIO Y LA CONTRASEÑA CORRECTOS
    username: "postgres", 
    password: "Werkzeuge_2357", 
    database: "ghost_running_db", // El nombre de la BD que ya creaste
    
    entities: [User], 
    synchronize: true, 
    logging: false, 
    migrations: [],
    subscribers: [],
});