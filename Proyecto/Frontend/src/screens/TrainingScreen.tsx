import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Modal } from 'react-native';
import MapView, { Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../config/designSystem';
import { commonStyles } from '../config/commonStyles';
import GRButton from '../components/GRButton';
import { apiUrl } from '../config/api';

interface Coordinate {
	latitude: number;
	longitude: number;
	timestamp: number;
	altitude?: number;
	isPause?: boolean;
}

interface TrainingScreenProps {
	userEmail?: string;
}

export default function TrainingScreen({ userEmail = 'test@example.com' }: TrainingScreenProps) {
	const navigation = useNavigation();
	const [isTracking, setIsTracking] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [showPauseModal, setShowPauseModal] = useState(false);
	const [duration, setDuration] = useState(0);
	const [currentSpeed, setCurrentSpeed] = useState(0);
	const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
	const [route, setRoute] = useState<Coordinate[]>([]);
	const [subscription, setSubscription] = useState<Location.LocationSubscription | null>(null);

	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (isTracking && !isPaused) {
			interval = setInterval(() => {
				setDuration(prev => prev + 1);
			}, 1000);
		}
		return () => clearInterval(interval);
	}, [isTracking, isPaused]);

	useEffect(() => {
		const startTracking = async () => {
			if (isTracking && !isPaused) {
				const sub = await Location.watchPositionAsync(
					{
						accuracy: Location.Accuracy.BestForNavigation,
						timeInterval: 1000,
						distanceInterval: 10
					},
					(location) => {
						const newPoint: Coordinate = {
							latitude: location.coords.latitude,
							longitude: location.coords.longitude,
							timestamp: Date.now(),
							altitude: location.coords.altitude || 0
						};
						setRoute(prev => [...prev, newPoint]);
						setCurrentLocation(location);
						const speed = (location.coords.speed || 0) * 3.6;
						setCurrentSpeed(speed);
					}
				);
				setSubscription(sub);
			}
		};
		startTracking();
		return () => {
			if (subscription) {
				subscription.remove();
			}
		};
	}, [isTracking, isPaused]);

	const formatTime = (seconds: number): string => {
		const hrs = Math.floor(seconds / 3600);
		const mins = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	};

	const handleStart = async () => {
		const { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== 'granted') {
			Alert.alert('Permission Required', 'Please enable GPS permissions');
			return;
		}
		const location = await Location.getCurrentPositionAsync({});
		setCurrentLocation(location);
		const startPoint: Coordinate = {
			latitude: location.coords.latitude,
			longitude: location.coords.longitude,
			timestamp: Date.now(),
			altitude: location.coords.altitude || 0
		};
		setRoute([startPoint]);
		setIsTracking(true);
		setIsPaused(false);
	};

	const handlePause = () => {
		setIsPaused(true);
		setShowPauseModal(true);
		if (route.length > 0) {
			const pausePoint: Coordinate = {
				...route[route.length - 1],
				isPause: true
			};
			setRoute(prev => [...prev, pausePoint]);
		}
	};

	const handleContinue = () => {
		setIsPaused(false);
		setShowPauseModal(false);
	};

	const handleFinish = async () => {
		setIsTracking(false);
		setShowPauseModal(false);
		if (route.length < 2) {
			Alert.alert('Error', 'Not enough data recorded');
			navigation.goBack();
			return;
		}
		try {
			const response = await fetch(apiUrl('/api/trainings/calculate'), {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					coordinates: route.filter(p => !p.isPause),
					userWeight: 70
				})
			});
			if (response.ok) {
				const stats = await response.json();
				navigation.reset({
					index: 1,
					routes: [
						{ name: 'Main' as never },
						{ name: 'ResumeTraining' as never, params: {
							...stats,
							route: route.filter(p => !p.isPause),
							userEmail
						} as never }
					]
				});
			} else {
				Alert.alert('Error', 'Failed to calculate training stats');
			}
		} catch (error) {
			console.error('Error calculating training:', error);
			Alert.alert('Error', 'Failed to process training data');
		}
	};

	return (
		<SafeAreaView style={commonStyles.container} edges={['top', 'bottom']}>
			<MapView
				style={styles.map}
				provider={PROVIDER_GOOGLE}
				initialRegion={{
					latitude: currentLocation?.coords.latitude || 37.78825,
					longitude: currentLocation?.coords.longitude || -122.4324,
					latitudeDelta: 0.01,
					longitudeDelta: 0.01
				}}
				showsUserLocation={true}
				followsUserLocation={true}
			>
				{route.length > 1 && (
					<Polyline
						coordinates={route.filter(p => !p.isPause)}
						strokeColor={theme.colors.primary}
						strokeWidth={4}
					/>
				)}

			</MapView>
			<View style={styles.statsPanel}>
				<View style={styles.statItem}>
					<Text style={styles.statLabel}>Duration</Text>
					<Text style={styles.statValue}>{formatTime(duration)}</Text>
				</View>
				<View style={styles.statItem}>
					<Text style={styles.statLabel}>Speed</Text>
					<Text style={styles.statValue}>{currentSpeed.toFixed(1)} km/h</Text>
				</View>
				<View style={styles.statItem}>
					<Text style={styles.statLabel}>Points</Text>
					<Text style={styles.statValue}>{route.length}</Text>
				</View>
			</View>
			<View style={styles.controls}>
				{!isTracking ? (
					<GRButton label="🏃 Start Training" variant="primary" onPress={handleStart} />
				) : (
					<View style={styles.trackingControls}>
						<GRButton
							label={isPaused ? "▶️ Continue" : "⏸️ Pause"}
							variant="secondary"
							onPress={isPaused ? handleContinue : handlePause}
							style={styles.controlButton}
						/>
						<GRButton
							label="🏁 Finish"
							variant="primary"
							onPress={handleFinish}
							style={styles.controlButton}
						/>
					</View>
				)}
			</View>
			<Modal visible={showPauseModal} transparent animationType="fade">
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>⏸️ Training Paused</Text>
						<Text style={styles.modalText}>Take a break and continue when ready</Text>
						<View style={styles.modalStats}>
							<Text style={styles.modalStat}>⏱️ {formatTime(duration)}</Text>
							<Text style={styles.modalStat}>📍 {route.length} points</Text>
						</View>
						<View style={styles.modalButtons}>
							<GRButton
								label="▶️ Continue"
								variant="primary"
								onPress={handleContinue}
								style={styles.modalButton}
							/>
							<GRButton
								label="🏁 Finish"
								variant="secondary"
								onPress={handleFinish}
								style={styles.modalButton}
							/>
						</View>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	map: { flex: 1 },
	statsPanel: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		padding: theme.spacing.l,
		backgroundColor: theme.colors.surface,
		borderTopWidth: 1,
		borderTopColor: theme.colors.border
	},
	statItem: { alignItems: 'center' },
	statLabel: {
		color: theme.colors.textSecondary,
		fontSize: theme.typography.size.s,
		marginBottom: theme.spacing.xs
	},
	statValue: {
		color: theme.colors.textPrimary,
		fontSize: theme.typography.size.xl,
		fontWeight: theme.typography.weight.bold
	},
	controls: { padding: theme.spacing.l, gap: theme.spacing.m },
	trackingControls: { flexDirection: 'row', gap: theme.spacing.m },
	controlButton: { flex: 1 },
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.8)',
		justifyContent: 'center',
		alignItems: 'center'
	},
	modalContent: {
		backgroundColor: theme.colors.surface,
		borderRadius: theme.radii.l,
		padding: theme.spacing.xxl,
		width: '85%',
		alignItems: 'center'
	},
	modalTitle: {
		color: theme.colors.textPrimary,
		fontSize: theme.typography.size.xxl,
		fontWeight: theme.typography.weight.bold,
		marginBottom: theme.spacing.m
	},
	modalText: {
		color: theme.colors.textSecondary,
		fontSize: theme.typography.size.m,
		textAlign: 'center',
		marginBottom: theme.spacing.xl
	},
	modalStats: { flexDirection: 'row', gap: theme.spacing.xl, marginBottom: theme.spacing.xl },
	modalStat: {
		color: theme.colors.textPrimary,
		fontSize: theme.typography.size.l,
		fontWeight: theme.typography.weight.semibold
	},
	modalButtons: { flexDirection: 'row', gap: theme.spacing.m, width: '100%' },
	modalButton: { flex: 1 }
});
