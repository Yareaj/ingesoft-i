import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import MapView, { Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { theme } from '../config/designSystem';
import { commonStyles } from '../config/commonStyles';
import GRButton from '../components/GRButton';
import { apiUrl } from '../config/api';

interface RouteParams {
	distance: number;
	duration: string;
	rithm: number;
	maxSpeed: number;
	avgSpeed: number;
	calories: number;
	elevationGain: number;
	pace: string;
	route: Array<{ latitude: number; longitude: number; timestamp: number; altitude?: number }>;
	userEmail: string;
}

export default function ResumeTrainingScreen() {
	const route = useRoute();
	const navigation = useNavigation();
	const params = route.params as RouteParams || {};

	const trainingData: RouteParams = {
		distance: params.distance || 0,
		duration: params.duration || '00:00:00',
		rithm: params.rithm || 0,
		maxSpeed: params.maxSpeed || 0,
		avgSpeed: params.avgSpeed || 0,
		calories: params.calories || 0,
		elevationGain: params.elevationGain || 0,
		pace: params.pace || '0:00',
		route: params.route || [],
		userEmail: params.userEmail || 'test@example.com'
	};

	const handleSave = async () => {
		try {
			const response = await fetch(apiUrl('/api/trainings'), {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userEmail: trainingData.userEmail,
					distance: trainingData.distance,
					duration: trainingData.duration,
					avgSpeed: trainingData.avgSpeed,
					maxSpeed: trainingData.maxSpeed,
					rithm: trainingData.rithm,
					calories: trainingData.calories,
					elevationGain: trainingData.elevationGain,
					trainingType: 'Running',
					route: trainingData.route,
					datetime: new Date().toISOString()
				})
			});

			if (response.ok) {
				Alert.alert('Success', 'Training saved successfully');
				navigation.navigate('Main' as never);
			} else {
				Alert.alert('Error', 'Failed to save training');
			}
		} catch (error) {
			console.error('Error saving training:', error);
			Alert.alert('Error', 'No se pudo conectar con el servidor');
		}
	};

	const handleDiscard = () => {
		Alert.alert(
			'Discard Training',
			'Are you sure? This action cannot be undone.',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Discard',
					style: 'destructive',
					onPress: () => navigation.navigate('Main' as never)
				}
			]
		);
	};

	return (
		<SafeAreaView style={commonStyles.container} edges={['top', 'bottom']}>
			<ScrollView>
				<View style={commonStyles.header}>
					<Text style={commonStyles.headerText}>🎉 Training Completed!</Text>
				</View>

				{/* ===== MAPA CON RUTA COMPLETA ===== */}
				<View style={styles.mapContainer}>
					<MapView
						style={styles.map}
						provider={PROVIDER_GOOGLE}
						initialRegion={{
							latitude: trainingData.route[0]?.latitude || 37.78825,
							longitude: trainingData.route[0]?.longitude || -122.4324,
							latitudeDelta: 0.05,
							longitudeDelta: 0.05
						}}
					>
						{trainingData.route.length > 1 && (
							<Polyline
								coordinates={trainingData.route}
								strokeColor={theme.colors.primary}
								strokeWidth={4}
							/>
						)}
					</MapView>
				</View>

				{/* ===== ESTADÍSTICAS PRINCIPALES ===== */}
				<View style={styles.statsSection}>
					<View style={styles.mainStatsRow}>
						<View style={styles.mainStatCard}>
							<Text style={styles.mainStatValue}>{trainingData.distance.toFixed(2)}</Text>
							<Text style={styles.mainStatLabel}>Kilometers</Text>
						</View>

						<View style={styles.mainStatCard}>
							<Text style={styles.mainStatValue}>{trainingData.duration}</Text>
							<Text style={styles.mainStatLabel}>Time</Text>
						</View>
					</View>

					<View style={styles.divider} />

					{/* ===== ESTADÍSTICAS SECUNDARIAS ===== */}
					<View style={styles.secondaryStatsGrid}>
						<View style={styles.secondaryStatCard}>
							<Text style={styles.secondaryStatLabel}>Pace</Text>
							<Text style={styles.secondaryStatValue}>{trainingData.pace}</Text>
							<Text style={styles.secondaryStatUnit}>min/km</Text>
						</View>

						<View style={styles.secondaryStatCard}>
							<Text style={styles.secondaryStatLabel}>Avg Speed</Text>
							<Text style={styles.secondaryStatValue}>{trainingData.avgSpeed.toFixed(1)}</Text>
							<Text style={styles.secondaryStatUnit}>km/h</Text>
						</View>

						<View style={styles.secondaryStatCard}>
							<Text style={styles.secondaryStatLabel}>Calories</Text>
							<Text style={styles.secondaryStatValue}>{Math.round(trainingData.calories)}</Text>
							<Text style={styles.secondaryStatUnit}>kcal</Text>
						</View>

						<View style={styles.secondaryStatCard}>
							<Text style={styles.secondaryStatLabel}>Elevation</Text>
							<Text style={styles.secondaryStatValue}>{trainingData.elevationGain.toFixed(0)}</Text>
							<Text style={styles.secondaryStatUnit}>m</Text>
						</View>
					</View>
				</View>

				{/* ===== BOTONES DE ACCIÓN ===== */}
				<View style={styles.actions}>
					<GRButton
						label="💾 Guardar Entrenamiento"
						variant="primary"
						onPress={handleSave}
						style={styles.actionButton}
					/>

					<GRButton
						label="🗑️ Descartar"
						variant="outline"
						onPress={handleDiscard}
						style={styles.actionButton}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	mapContainer: {
		height: 250,
		margin: theme.spacing.l,
		borderRadius: theme.radii.l,
		overflow: 'hidden',
		backgroundColor: theme.colors.surface
	},
	map: {
		width: '100%',
		height: '100%'
	},
	statsSection: {
		marginHorizontal: theme.spacing.l,
		marginBottom: theme.spacing.l,
		backgroundColor: theme.colors.surface,
		borderRadius: theme.radii.l,
		padding: theme.spacing.l
	},
	mainStatsRow: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginBottom: theme.spacing.l
	},
	mainStatCard: {
		alignItems: 'center',
		flex: 1
	},
	mainStatValue: {
		color: theme.colors.primary,
		fontSize: 36,
		fontWeight: theme.typography.weight.bold,
		marginBottom: theme.spacing.xs
	},
	mainStatLabel: {
		color: theme.colors.textSecondary,
		fontSize: theme.typography.size.m
	},
	divider: {
		height: 1,
		backgroundColor: theme.colors.border,
		marginVertical: theme.spacing.l
	},
	secondaryStatsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		gap: theme.spacing.m
	},
	secondaryStatCard: {
		width: '48%',
		backgroundColor: theme.colors.background,
		borderRadius: theme.radii.m,
		padding: theme.spacing.m,
		alignItems: 'center'
	},
	secondaryStatLabel: {
		color: theme.colors.textSecondary,
		fontSize: theme.typography.size.s,
		marginBottom: theme.spacing.xs
	},
	secondaryStatValue: {
		color: theme.colors.textPrimary,
		fontSize: theme.typography.size.xxl,
		fontWeight: theme.typography.weight.bold,
		marginBottom: theme.spacing.xs
	},
	secondaryStatUnit: {
		color: theme.colors.textSecondary,
		fontSize: theme.typography.size.s
	},
	actions: {
		paddingHorizontal: theme.spacing.l,
		paddingBottom: theme.spacing.xl,
		gap: theme.spacing.m
	},
	actionButton: {
		width: '100%'
	}
});
