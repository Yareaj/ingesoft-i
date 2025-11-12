import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { GRButton } from '../components/GRButton';
import { theme } from '../config/designSystem';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';

interface HomeScreenProps {
  userName?: string;
  userImage?: string;
}

export default function HomeScreen({ userName = 'Runner', userImage }: HomeScreenProps) {
	const [location, setLocation] = useState<Location.LocationObject | null>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);

	useEffect(() => {
		requestLocationPermission();
	}, []);

	const requestLocationPermission = async () => {
		try {
			const { status } = await Location.requestForegroundPermissionsAsync();

			if (status !== 'granted') {
				setHasPermission(false);
				setErrorMsg('Permission to access location was denied');
				return;
			}

			setHasPermission(true);

			// Get current location
			const currentLocation = await Location.getCurrentPositionAsync({});
			setLocation(currentLocation);

			// Watch position for real-time updates
			Location.watchPositionAsync(
				{
					accuracy: Location.Accuracy.High,
					timeInterval: 5000,
					distanceInterval: 10
				},
				(newLocation) => {
					setLocation(newLocation);
				}
			);
		} catch (error) {
			setErrorMsg('Error getting location');
			setHasPermission(false);
		}
	};

	const handleNewTraining = () => Alert.alert('New Training', 'Starting new training session...');
	const handleSavedRoutes = () => Alert.alert('Saved Routes', 'Opening saved routes...');
	const handleTrainingHistory = () => Alert.alert('Training History', 'Opening training history...');

	return (
		<SafeAreaView style={styles.container} edges={['top', 'bottom']}>
			{/* Header with user info */}
			<View style={styles.header}>
				<View style={styles.userInfoContainer}>
					<View style={styles.profileImageContainer}>
						{userImage ? (
							<Image source={{ uri: userImage }} style={styles.profileImage} />
						) : (
							<View style={styles.profileImagePlaceholder}>
								<Text style={styles.placeholderText}>
									{userName.charAt(0).toUpperCase()}
								</Text>
							</View>
						)}
					</View>
					<Text style={styles.welcomeText}>Welcome back, {userName}!</Text>
				</View>
			</View>

			{/* Map Section */}
			<View style={styles.mapContainer}>
				{hasPermission === false ? (
					<View style={styles.permissionDeniedContainer}>
						<Text style={styles.permissionDeniedText}>📍 Please enable GPS permissions</Text>
						<GRButton label="Enable Location" variant="primary" onPress={requestLocationPermission} />
					</View>
				) : location ? (
					<MapView
						style={styles.map}
						provider={PROVIDER_GOOGLE}
						initialRegion={{
							latitude: location.coords.latitude,
							longitude: location.coords.longitude,
							latitudeDelta: 0.01,
							longitudeDelta: 0.01
						}}
						showsUserLocation={true}
						showsMyLocationButton={true}
						followsUserLocation={true}
					>
						<Marker
							coordinate={{
								latitude: location.coords.latitude,
								longitude: location.coords.longitude
							}}
							title="Your Location"
						/>
					</MapView>
				) : (
					<View style={styles.loadingContainer}>
						<Text style={styles.loadingText}>Loading map...</Text>
					</View>
				)}
			</View>

			{/* Action Buttons */}
			<View style={styles.actionsWrapper}>
				<GRButton label="🏃 Start New Training" variant="primary" onPress={handleNewTraining} />
				<View style={styles.row}>
					<GRButton style={styles.flexButton} label="📍 Saved Routes" variant="secondary" onPress={handleSavedRoutes} />
					<GRButton style={styles.flexButton} label="📊 History" variant="secondary" onPress={handleTrainingHistory} />
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: theme.colors.background },
	header: { paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.l, backgroundColor: theme.colors.background },
	userInfoContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	profileImageContainer: { width: 60, height: 60, borderRadius: 30, borderWidth: 3, borderColor: theme.colors.primary, padding: 2, marginRight: theme.spacing.l },
	profileImage: {
		width: '100%',
		height: '100%',
		borderRadius: 27
	},
	profileImagePlaceholder: { width: '100%', height: '100%', borderRadius: 27, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center' },
	placeholderText: { color: theme.colors.textPrimary, fontSize: theme.typography.size.xl, fontWeight: theme.typography.weight.bold },
	welcomeText: { color: theme.colors.textPrimary, fontSize: theme.typography.size.xl, fontWeight: theme.typography.weight.bold, flex: 1 },
	mapContainer: { flex: 1, margin: theme.spacing.l, borderRadius: theme.radii.l, overflow: 'hidden', backgroundColor: theme.colors.surface },
	map: {
		width: '100%',
		height: '100%'
	},
	permissionDeniedContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20
	},
	permissionDeniedText: { color: theme.colors.textPrimary, fontSize: theme.typography.size.l, textAlign: 'center', marginBottom: theme.spacing.xl },

	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	loadingText: { color: theme.colors.textPrimary, fontSize: theme.typography.size.l },
	actionsWrapper: { padding: theme.spacing.l, gap: theme.spacing.m },
	row: { flexDirection: 'row', gap: theme.spacing.m },
	flexButton: { flex: 1 }
});
