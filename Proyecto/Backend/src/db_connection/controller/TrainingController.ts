import { Request, Response } from "express";
import { appDataSource } from "../config/dataSource";
import { Training } from "../entity/Training";
import { User } from "../entity/User";
import { Route } from "../entity/Route";
import { Coordinate } from "../entity/Coordinate";
import { calculateTrainingStats, calculatePace } from "../../services/trainingService";
import * as fs from 'fs';
import * as path from 'path';

const trainingRepository = appDataSource.getRepository(Training);
const userRepository = appDataSource.getRepository(User);
const routeRepository = appDataSource.getRepository(Route);
const coordinateRepository = appDataSource.getRepository(Coordinate);

export const calculateTraining = async (req: Request, res: Response) => {
	try {
		const { coordinates, userWeight } = req.body;

		if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 2) {
			return res.status(400).json({ error: "At least 2 coordinates are required" });
		}

		const stats = calculateTrainingStats(coordinates, userWeight || 70);
		const pace = calculatePace(stats.avgSpeed);

		return res.status(200).json({
			...stats,
			pace
		});
	} catch (error) {
		console.error("Error calculating training:", error);
		return res.status(500).json({ error: "Error calculating training stats" });
	}
};

export const saveTraining = async (req: Request, res: Response) => {
	try {
		const { userEmail, distance, duration, avgSpeed, maxSpeed, rithm, calories, elevationGain, trainingType, route, datetime } = req.body;
		// isGhost may be provided by the client (1) or defaults to 0
		const isGhost = req.body && req.body.isGhost ? Number(req.body.isGhost) : 0;

		if (!userEmail) {
			return res.status(400).json({ error: "userEmail is required" });
		}

		// Validate that we have either a route with at least 2 coordinates or a positive distance
		const hasValidRoute = route && Array.isArray(route) && route.length >= 2;
		const parsedDistance = Number(distance) || 0;
		if (!hasValidRoute && parsedDistance <= 0) {
			return res.status(400).json({ error: "Invalid training data: provide a route with at least 2 coordinates or a positive distance" });
		}

		// Buscar usuario
		const user = await userRepository.findOne({ where: { email: userEmail }});
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Crear las coordenadas primero
		const savedCoordinates: Coordinate[] = [];
		if (route && Array.isArray(route)) {
			for (const coord of route) {
				const newCoordinate = coordinateRepository.create({
					latitude: coord.latitude,
					longitude: coord.longitude,
					altitude: coord.altitude || 0
				});
				const savedCoord = await coordinateRepository.save(newCoordinate);
				savedCoordinates.push(savedCoord);
			}
		}

		// Crear ruta con las coordenadas
		const newRoute = routeRepository.create({
			distance: distance || 0,
			coordinates: savedCoordinates
		});
		await routeRepository.save(newRoute);

		// Handle training image (base64) and save to disk if provided
		let publicImageUrl: string | null = null;
		try {
			const rawImage = req.body.trainingImage;
			const imageName = req.body.imageName;
			if (rawImage && typeof rawImage === 'string') {
				const matches = rawImage.match(/^data:(image\/(\w+));base64,(.+)$/);
				let ext = 'png';
				let base64Data = rawImage;
				if (matches && matches.length === 4) {
					ext = matches[2];
					base64Data = matches[3];
				} else if (rawImage.startsWith('data:')) {
					const parts = rawImage.split(',');
					base64Data = parts[1] || parts[0];
				}

				let fileBase = (imageName && typeof imageName === 'string' && imageName.trim().length > 0) ? imageName.trim() : `training_${Date.now()}`;
				// sanitize
				fileBase = fileBase.replace(/[^a-zA-Z0-9-_]/g, '_');
				let fileName = `${fileBase}.${ext}`;
				const imagesDir = path.join(__dirname, '../../../Database/db_images');
				await fs.promises.mkdir(imagesDir, { recursive: true });
				let filePath = path.join(imagesDir, fileName);
				if (fs.existsSync(filePath)) {
					fileName = `${fileBase}_${Date.now()}.${ext}`;
					filePath = path.join(imagesDir, fileName);
				}
				await fs.promises.writeFile(filePath, base64Data, 'base64');
				publicImageUrl = `/images/${fileName}`;
			}
		} catch (err) {
			console.error('Error saving training image:', err);
			publicImageUrl = null;
		}

		// Crear entrenamiento
		const training = trainingRepository.create({
			userEmail: userEmail,
			routeId: newRoute.id,
			datetime: datetime ? new Date(datetime) : new Date(),
			duration: duration || "00:00:00",
			rithm: rithm || 0,
			maxSpeed: maxSpeed || avgSpeed || 0,
			avgSpeed: avgSpeed || 0,
			calories: calories || 0,
			elevationGain: elevationGain || 0,
			image: publicImageUrl ?? undefined,
			trainingType: trainingType || 'Running',
			isGhost: isGhost ? 1 : 0,
			user: user,
			route: newRoute
		});

		await trainingRepository.save(training);

		return res.status(201).json({
			message: "Training saved successfully",
			training: {
				counter: training.counter,
				distance: newRoute.distance,
				duration: training.duration,
				avgSpeed: training.avgSpeed,
				maxSpeed: training.maxSpeed,
				rithm: training.rithm,
				calories: training.calories,
				elevationGain: training.elevationGain,
				trainingType: training.trainingType,
				datetime: training.datetime,
				isGhost: training.isGhost,
				route: savedCoordinates.map(c => ({ latitude: c.latitude, longitude: c.longitude, altitude: c.altitude })),
				image: training.image || null
			}
		});
	} catch (error) {
		console.error("Error saving training:", error);
		return res.status(500).json({ error: "Error saving training" });
	}
};


export const getUserTrainings = async (req: Request, res: Response) => {
	try {
		const { userEmail } = req.params;

		if (!userEmail) {
			return res.status(400).json({ error: "userEmail is required" });
		}

		const trainings = await trainingRepository.find({
			where: { userEmail: userEmail },
			relations: ["route", "route.coordinates"],
			order: { datetime: "DESC" }
		});

		return res.json({
			trainings: trainings.map(t => ({
				counter: t.counter,
				distance: parseFloat(t.route.distance.toString()),
				duration: t.duration,
				avgSpeed: parseFloat(t.avgSpeed.toString()),
				maxSpeed: parseFloat(t.maxSpeed.toString()),
				rithm: parseFloat(t.rithm.toString()),
				calories: parseFloat(t.calories.toString()),
				elevationGain: parseFloat(t.elevationGain.toString()),
				trainingType: t.trainingType,
				datetime: t.datetime,
				isGhost: t.isGhost ?? 0,
				route: t.route?.coordinates.map(c => ({
					latitude: parseFloat(c.latitude.toString()),
					longitude: parseFloat(c.longitude.toString()),
					altitude: parseFloat(c.altitude.toString())
				})),
				image: t.image || null
			}))
		});
	} catch (error) {
		console.error("Error getting trainings:", error);
		return res.status(500).json({ error: "Error getting trainings" });
	}
};

export const replaceGhost = async (req: Request, res: Response) => {
	try {
		const { oldGhostCounter, userEmail, distance, duration, avgSpeed, maxSpeed, rithm, calories, elevationGain, trainingType, route, datetime } = req.body;

		if (!oldGhostCounter || !userEmail) {
			return res.status(400).json({ error: "oldGhostCounter and userEmail are required" });
		}

		// Find the old ghost training
		const oldGhost = await trainingRepository.findOne({
			where: { counter: oldGhostCounter, userEmail: userEmail, isGhost: 1 }
		});

		if (!oldGhost) {
			return res.status(404).json({ error: "Old ghost training not found" });
		}

		// Update old ghost to be a regular training
		oldGhost.isGhost = 0;
		await trainingRepository.save(oldGhost);

		// Create new ghost training (same logic as saveTraining)
		const user = await userRepository.findOne({ where: { email: userEmail }});
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Create coordinates
		const savedCoordinates: Coordinate[] = [];
		if (route && Array.isArray(route)) {
			for (const coord of route) {
				const newCoordinate = coordinateRepository.create({
					latitude: coord.latitude,
					longitude: coord.longitude,
					altitude: coord.altitude || 0
				});
				const savedCoord = await coordinateRepository.save(newCoordinate);
				savedCoordinates.push(savedCoord);
			}
		}

		// Create route
		const newRoute = routeRepository.create({
			distance: distance || 0,
			coordinates: savedCoordinates
		});
		await routeRepository.save(newRoute);

		// Create new ghost training
		const newGhost = trainingRepository.create({
			userEmail: userEmail,
			routeId: newRoute.id,
			datetime: datetime ? new Date(datetime) : new Date(),
			duration: duration || "00:00:00",
			rithm: rithm || 0,
			maxSpeed: maxSpeed || avgSpeed || 0,
			avgSpeed: avgSpeed || 0,
			calories: calories || 0,
			elevationGain: elevationGain || 0,
			trainingType: trainingType || 'Running',
			isGhost: 1,
			user: user,
			route: newRoute
		});

		await trainingRepository.save(newGhost);

		return res.status(201).json({
			message: "Ghost replaced successfully",
			newGhost: {
				counter: newGhost.counter,
				distance: newRoute.distance,
				duration: newGhost.duration,
				avgSpeed: newGhost.avgSpeed,
				maxSpeed: newGhost.maxSpeed,
				rithm: newGhost.rithm,
				calories: newGhost.calories,
				elevationGain: newGhost.elevationGain,
				trainingType: newGhost.trainingType,
				datetime: newGhost.datetime,
				isGhost: newGhost.isGhost
			}
		});
	} catch (error) {
		console.error("Error replacing ghost:", error);
		return res.status(500).json({ error: "Error replacing ghost" });
	}
};
