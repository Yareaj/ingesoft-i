// src/controller/UserController.ts
import { Request, Response } from 'express';
import Database from '../db/Database'; // Usamos el singleton Database
import { User } from '../entity/User'; // Importamos la entidad

/**
 * Endpoint del tutorial "Hola Mundo".
 * Garantiza que existe un registro de usuario y lo devuelve,
 * demostrando la comunicación API -> Express -> TypeORM -> PostgreSQL.
 */
export const getFirstUser = async (req: Request, res: Response) => {
    try {
    // 1. Acceder al repositorio de la entidad User a través del singleton
    const userRepository = Database.getInstance().getRepository(User);

        // 2. Intentar buscar el primer registro con ID = 1
        let firstUser = await userRepository.findOne({ where: { id: 1 } });
        
        // 3. Si no existe, lo insertamos (setup de demostración)
        if (!firstUser) {
            const newUser = userRepository.create({
                username: "GhostRunner1",
                email: "ghost@running.com",
                password_hash: "hashed_password_demo" 
            });
            await userRepository.save(newUser);
            firstUser = newUser;
        }

        // 4. Devolver el registro de la BD
        res.status(200).json({
            message: "Hello World: User record fetched successfully",
            data: {
                id: firstUser.id,
                username: firstUser.username,
                email: firstUser.email
            }
        });

    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};