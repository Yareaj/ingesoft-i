interface Coordinate {
	latitude: number;
	longitude: number;
	timestamp: number;
	altitude?: number;
}

interface TrainingCalculationResult {
	distance: number;
	duration: string;
	rithm: number;
	maxSpeed: number;
	avgSpeed: number;
	calories: number;
	elevationGain: number;
}

/**
 * Calcula la distancia entre dos coordenadas usando la fórmula de Haversine
 * @param latitudePointOne Latitud del punto 1
 * @param longitudePointOne Longitud del punto 1
 * @param latitudePointTwo Latitud del punto 2
 * @param longitudePointTwo Longitud del punto 2
 * @returns Distancia en kilómetros
 */
export const calculateDistance = (latitudePointOne: number, longitudePointOne: number, latitudePointTwo: number, longitudePointTwo: number): number => {
	// Radio de la Tierra en km
	const earthRadius = 6371;
	const diferenceLatitude = toRad(latitudePointTwo - latitudePointOne);
	const diferenceLongitude = toRad(longitudePointTwo - longitudePointOne);

	const step =
		Math.sin(diferenceLatitude / 2) * Math.sin(diferenceLatitude / 2) +
		Math.cos(toRad(latitudePointOne)) * Math.cos(toRad(latitudePointTwo)) * Math.sin(diferenceLongitude / 2) * Math.sin(diferenceLongitude / 2);

	const step2 = 2 * Math.atan2(Math.sqrt(step), Math.sqrt(1 - step));
	return earthRadius * step2;
};

/**
 * Convierte grados a radianes
 */
const toRad = (degrees: number): number => {
	return degrees * (Math.PI / 180);
};

/**
 * Calcula todas las estadísticas del entrenamiento
 * @param coordinates Array de coordenadas con timestamps
 * @param userWeight Peso del usuario en kg (opcional, default 70kg)
 * @returns Objeto con todas las estadísticas calculadas
 */
export const calculateTrainingStats = (
	coordinates: Coordinate[],
	userWeight: number = 70
): TrainingCalculationResult => {
	if (coordinates.length < 2) {
		return {
			distance: 0,
			duration: "00:00:00",
			rithm: 0,
			maxSpeed: 0,
			avgSpeed: 0,
			calories: 0,
			elevationGain: 0
		};
	}

	// Calcular distancia total
	let totalDistance = 0;
	const speeds: number[] = [];
	let maxAltitude = coordinates[0].altitude || 0;
	let minAltitude = coordinates[0].altitude || 0;

	for (let i = 1; i < coordinates.length; i++) {
		const prev = coordinates[i - 1];
		const curr = coordinates[i];

		// Distancia entre puntos
		const segmentDistance = calculateDistance(
			prev.latitude,
			prev.longitude,
			curr.latitude,
			curr.longitude
		);
		totalDistance += segmentDistance;

		// Calcular velocidad del segmento (km/h)
		// timeDiff en segundos
		const timeDiff = (curr.timestamp - prev.timestamp) / 1000;
		if (timeDiff > 0) {
			// speed en km/h
			const speed = (segmentDistance / timeDiff) * 3600;
			speeds.push(speed);
		}

		// Seguimiento de altitud
		if (curr.altitude) {
			maxAltitude = Math.max(maxAltitude, curr.altitude);
			minAltitude = Math.min(minAltitude, curr.altitude);
		}
	}

	// Duración total
	const totalSeconds = (coordinates[coordinates.length - 1].timestamp - coordinates[0].timestamp) / 1000;
	const duration = formatDuration(totalSeconds);

	// Velocidad promedio (km/h)
	const avgSpeed = speeds.length > 0 ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0;

	// Velocidad máxima (km/h)
	const maxSpeed = speeds.length > 0 ? Math.max(...speeds) : 0;

	// Ritmo (min/km) - inverso de la velocidad
	const rithm = avgSpeed > 0 ? 60 / avgSpeed : 0;

	// Calorías quemadas (fórmula básica: MET * peso * tiempo_en_horas)
	// MET para correr ~8-10 dependiendo de la velocidad
	const timeInHours = totalSeconds / 3600;
	const met = avgSpeed < 8 ? 8 : avgSpeed < 12 ? 10 : 12;
	const calories = met * userWeight * timeInHours;

	// Ganancia de elevación
	const elevationGain = Math.max(0, maxAltitude - minAltitude);

	return {
		distance: parseFloat(totalDistance.toFixed(2)),
		duration,
		rithm: parseFloat(rithm.toFixed(2)),
		maxSpeed: parseFloat(maxSpeed.toFixed(2)),
		avgSpeed: parseFloat(avgSpeed.toFixed(2)),
		calories: parseFloat(calories.toFixed(2)),
		elevationGain: parseFloat(elevationGain.toFixed(2))
	};
};

/**
 * Formatea la duración en segundos a formato HH:MM:SS
 */
const formatDuration = (seconds: number): string => {
	const hrs = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);

	return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Calcula el ritmo en formato min/km
 */
export const calculatePace = (avgSpeed: number): string => {
	if (avgSpeed === 0) {
		return "0:00";
	}
	const paceMinutes = 60 / avgSpeed;
	const mins = Math.floor(paceMinutes);
	const secs = Math.floor((paceMinutes - mins) * 60);
	return `${mins}:${secs.toString().padStart(2, '0')}`;
};
