import { Request, Response } from 'express';
import Database from '../db/Database';
import { User } from '../entity/User';
import bcrypt from 'bcryptjs';


const userRepository = Database.getInstance().getRepository(User);
export const getFirstUser = async (req: Request, res: Response) => {
	try {

		const users = await userRepository.find({ order: { registrationDate: "ASC" }, take: 1 });
		let firstUser = users[0];

		if (!firstUser) {
			const hashedPassword = await bcrypt.hash("ruunerporlaUN", 10);
			const newUser = userRepository.create({
				email: "diegoghost@running.com",
				username: "Diego Cabrera",
				password: hashedPassword,
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

		const { username, email, Name, lastname, age, password } = req.body ?? {};
		if (!username || !email || !password || !Name || !lastname || !age) {
			console.warn("⚠️  Missing required fields in body", { username, email, name, lastname, age, passwordPresent: Boolean(password) });
			return res.status(400).json({ message: "Missing required fields: username, email, name, lastname, password" });
		}

		// TODO: insertar en DB si aplica. Por ahora respondemos éxito.
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = userRepository.create({
			email: email,
			username: username,
			password: hashedPassword,
			names: Name,
			lastNames: lastname,
			age: age
		});
		await userRepository.save(newUser);
		return res.status(201).json({ message: "User registered successfully", data: { username, email }});
	} catch (error) {
		console.error("Error registering user:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// Endpoint para login de usuario
export const loginUser = async (req: Request, res: Response) => {
	try {
		console.log("➡️  /api/login hit. Body:", req.body);
		const { email, password } = req.body ?? {};
		if (!email || !password) {
			console.warn("⚠️  Missing required fields in query", { email, passwordPresent: Boolean(password) });
			return res.status(400).json({ message: "Missing required fields: email, password" });
		}

		// TODO: Validar en DB si aplica. Por ahora respondemos éxito.
		const user = await userRepository.findOne({
			where: { email },
			select: ['email', 'username', 'names', 'lastNames', 'age', 'password']
		});
		if (!user) {
			console.warn("⚠️  User not found for email:", email);
			return res.status(401).json({ message: "Invalid credentials" });
		}
		console.log("Contraseña ingresada:", password);
		console.log("Hash guardado:", user.password);
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			console.warn("⚠️  Invalid password for email:", email);
			return res.status(401).json({ message: "Invalid credentials" });
		}

		return res.status(200).json({ message: "Login successful", data: { email }});
	} catch (error) {
		console.error("Error logging in user:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};