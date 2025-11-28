import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TextInput, Image } from 'react-native';
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
	isGhost?: boolean;
	ghostCounter?: number;
	ghostDistance?: number;
	beatGhost?: boolean;
}

export default function ResumeTrainingScreen() {
	const route = useRoute();
	const navigation = useNavigation();
	const params = (route.params as RouteParams) || {};
	type MapWithSnapshot = MapView & { takeSnapshot?: (opts: { width: number; height: number; format: string; result: string }) => Promise<string> };
	const mapRef = useRef<MapWithSnapshot | null>(null);
	const [imageName, setImageName] = useState('');
	const [trainingName, setTrainingName] = useState('');
	const [savedImageUrl, setSavedImageUrl] = useState<string | null>(null);

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
 		userEmail: params.userEmail || 'test@example.com',
 		isGhost: params.isGhost || false
	};

	const handleSave = async () => {
		try {
			// Attempt to capture a snapshot of the map (base64 PNG)
			let snapshotBase64: string | undefined = undefined;
			try {
				if (mapRef.current && typeof mapRef.current.takeSnapshot === 'function') {
					const snap = await mapRef.current.takeSnapshot({ width: 800, height: 600, format: 'png', result: 'base64' });
					if (snap) {
						snapshotBase64 = `data:image/png;base64,${snap}`;
					}
				}
			} catch (err) {
				console.warn('Map snapshot failed:', err);
			}
			// If user beat their ghost, replace the old ghost with this new training
			if (params.beatGhost && params.ghostCounter) {
				const response = await fetch(apiUrl('/api/trainings/replace-ghost'), {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						oldGhostCounter: params.ghostCounter,
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
						trainingImage: snapshotBase64,
						imageName: imageName || undefined,
						datetime: new Date().toISOString()
					})
				});

				if (response.ok) {
					const data = await response.json();
					if (data?.newGhost?.image) {
						setSavedImageUrl(data.newGhost.image);
					}
					Alert.alert(
						'🎉 New Record!',
						`You got a new record in the distance ${(params.ghostDistance || 0).toFixed(2)} km!`,
						[
							{
								text: 'OK',
								onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Main' as never }] })
							}
						]
					);
				} else {
					Alert.alert('Error', 'Failed to save new ghost record');
				}
			} else if (params.ghostCounter && !params.beatGhost) {
				// If user didn't beat ghost but was racing, save as normal training
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
						trainingImage: snapshotBase64,
						imageName: imageName || undefined,
						datetime: new Date().toISOString(),
						// Save as regular training
						isGhost: 0
					})
				});

				if (response.ok) {
					const data = await response.json();
					if (data?.training?.image) {
						setSavedImageUrl(data.training.image);
					}
					Alert.alert('Keep training!', 'You almost beat yourself. Keep pushing!', [
						{ text: 'OK', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Main' as never }] }) }
					]);
				} else {
					Alert.alert('Error', 'Failed to save training');
				}
			} else {
				// Regular training save (not racing against ghost)
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
						trainingImage: snapshotBase64,
						imageName: imageName || undefined,
						datetime: new Date().toISOString(),
						isGhost: trainingData.isGhost ? 1 : 0
					})
				});

				if (response.ok) {
					const data = await response.json();
					if (data?.training?.image) {
						setSavedImageUrl(data.training.image);
					}
					Alert.alert('Success', 'Training saved successfully', [
						{ text: 'OK', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Main' as never }] }) }
					]);
				} else {
					Alert.alert('Error', 'Failed to save training');
				}
			}
		} catch (error) {
			console.error('Error saving training:', error);
			Alert.alert('Error', 'Could not connect to the server');
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
					onPress: () => navigation.reset({
						index: 0,
						routes: [{ name: 'Main' as never }]
					})
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

				{/* Ghost Race Result Banner */}
				{params.ghostCounter && (
					<View style={params.beatGhost ? styles.victoryBanner : styles.encouragementBanner}>
						<Text style={styles.bannerText}>
							{params.beatGhost
								? `🏆 New Record! You beat your ghost!`
								: `💪 Keep training, you almost beat yourself!`}
						</Text>
					</View>
				)}

				{/* ===== FULL ROUTE MAP ===== */}
				<View style={styles.mapContainer}>
					<MapView
						ref={mapRef}
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

				{/* ===== MAIN STATISTICS ===== */}
				<View style={styles.statsSection}>
					{trainingData.isGhost && (
						<View style={{ padding: theme.spacing.l, alignItems: 'center' }}>
							<Text style={{ color: theme.colors.primary, fontWeight: theme.typography.weight.bold }}>👻 Ghost Training</Text>
						</View>
					)}
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

					{/* ===== SECONDARY STATISTICS ===== */}
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

				{/* ===== ACTION BUTTONS ===== */}
				<View style={styles.nameInputSection}>
					<Text style={styles.nameInputLabel}>Training name (optional)</Text>
					<TextInput
						style={styles.nameInput}
						placeholder="e.g. Morning run"
						placeholderTextColor={theme.colors.textSecondary}
						value={trainingName}
						onChangeText={setTrainingName}
						maxLength={100}
					/>
					<Text style={styles.nameInputHint}>
						{trainingName.trim() ? `Will be saved as: "${trainingName.trim()}"` : 'If you don\'t enter a name, it will be assigned automatically'}
					</Text>

					<Text style={[styles.nameInputLabel, { marginTop: 12 }]}>Image filename (without extension)</Text>
					<TextInput
						style={styles.nameInput}
						placeholder="e.g. morning_run_2025-11-28"
						placeholderTextColor={theme.colors.textSecondary}
						value={imageName}
						onChangeText={setImageName}
						maxLength={80}
					/>
					<Text style={styles.nameInputHint}>The provided name will be used as the image filename (PNG).</Text>
					{savedImageUrl && (
						<View style={{ marginTop: 12, alignItems: 'center' }}>
							<Text style={{ marginBottom: 8 }}>Saved Image Preview:</Text>
							<Image source={{ uri: savedImageUrl }} style={{ width: 200, height: 120, borderRadius: 8 }} />
						</View>
					)}
				</View>

				<View style={styles.actions}>
					<GRButton
						label="💾 Save Training"
						variant="primary"
						onPress={handleSave}
						style={styles.actionButton}
					/>

					<GRButton
						label="🗑️ Discard"
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
	victoryBanner: {
		backgroundColor: '#4CAF50',
		padding: theme.spacing.l,
		marginHorizontal: theme.spacing.l,
		marginBottom: theme.spacing.m,
		borderRadius: theme.radii.m,
		alignItems: 'center'
	},
	encouragementBanner: {
		backgroundColor: '#FF9800',
		padding: theme.spacing.l,
		marginHorizontal: theme.spacing.l,
		marginBottom: theme.spacing.m,
		borderRadius: theme.radii.m,
		alignItems: 'center'
	},
	bannerText: {
		color: '#FFFFFF',
		fontSize: theme.typography.size.l,
		fontWeight: theme.typography.weight.bold,
		textAlign: 'center'
	},
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
	},
	nameInputSection: {
		marginHorizontal: theme.spacing.l,
		marginBottom: theme.spacing.l,
		padding: theme.spacing.l,
		backgroundColor: theme.colors.surface,
		borderRadius: theme.radii.l
	},
	nameInputLabel: {
		color: theme.colors.textPrimary,
		fontSize: theme.typography.size.m,
		marginBottom: theme.spacing.xs
	},
	nameInput: {
		borderWidth: 1,
		borderColor: theme.colors.border,
		borderRadius: theme.radii.m,
		padding: theme.spacing.s,
		color: theme.colors.textPrimary,
		backgroundColor: theme.colors.background
	},
	nameInputHint: {
		color: theme.colors.textSecondary,
		fontSize: theme.typography.size.s,
		marginTop: theme.spacing.xs
	}
});
