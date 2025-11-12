import { Request, Response } from 'express';
import Database from '../db/Database';
import { User } from '../entity/User';

/**
 * Endpoint de demostración: devuelve (o crea) el primer usuario registrado.
 */

export const getFirstUser = async (req: Request, res: Response) => {
	try {

		const userRepository = Database.getInstance().getRepository(User);

		const users = await userRepository.find({ order: { registrationDate: "ASC" }, take: 1 });
		let firstUser = users[0];

		if (!firstUser) {
			const newUser = userRepository.create({
				email: "diegoghost@running.com",
				username: "Diego Cabrera",
				password: "ruunerporlaUN",
				names: "Diego",
				lastNames: "Cabrera",
				age: 30
			});
			await userRepository.save(newUser);
			firstUser = newUser;
		}

		res.status(200).json({
			message: "Hello World: User record fetched successfully",
			data: {
				email: firstUser.email,
				username: firstUser.username,
				names: firstUser.names,
				lastNames: firstUser.lastNames,
				registrationDate: firstUser.registrationDate
			}
		});

	} catch (error) {
		console.error("Error fetching user:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// Endpoint para registrar un nuevo usuario
export const registerUser = async (req: Request, res: Response) => {
	try {
		console.log("➡️  /api/register hit. Body:", req.body);

		const { username, email, password } = req.body ?? {};
		if (!username || !email || !password) {
			console.warn("⚠️  Missing required fields in body", { username, email, passwordPresent: Boolean(password) });
			return res.status(400).json({ message: "Faltan campos requeridos: username, email, password" });
		}

		// TODO: insertar en DB si aplica. Por ahora respondemos éxito.
		return res.status(201).json({ message: "Usuario registrado correctamente", data: { username, email } });
	} catch (error) {
		console.error("Error registering user:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};