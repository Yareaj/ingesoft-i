import { Request, Response } from "express";
import { appDataSource } from "../config/dataSource";
import { Training } from "../entity/Training";
import { User } from "../entity/User";
import { Route } from "../entity/Route";
import { Coordinate } from "../entity/Coordinate";
import { calculateTrainingStats, calculatePace } from "../../services/trainingService";

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

		if (!userEmail) {
			return res.status(400).json({ error: "userEmail is required" });
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
			trainingType: trainingType || 'Running',
			isGhost: 0,
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
				datetime: training.datetime
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
				distance: t.route.distance,
				duration: t.duration,
				avgSpeed: t.avgSpeed,
				maxSpeed: t.maxSpeed,
				rithm: t.rithm,
				calories: t.calories,
				elevationGain: t.elevationGain,
				trainingType: t.trainingType,
				datetime: t.datetime,
				route: t.route?.coordinates.map(c => ({
					latitude: c.latitude,
					longitude: c.longitude,
					altitude: c.altitude
				}))
			}))
		});
	} catch (error) {
		console.error("Error getting trainings:", error);
		return res.status(500).json({ error: "Error getting trainings" });
	}
};
