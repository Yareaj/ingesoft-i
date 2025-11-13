import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, Platform, Image, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from '../config/designSystem';
import { useAuth } from '../context/AuthContext';
import { apiUrl } from '../config/api';

import HomeScreen from '../screens/HomeScreen';
import FeedScreen from '../screens/FeedScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TrainingScreen from '../screens/TrainingScreen';
import ResumeTrainingScreen from '../screens/ResumeTrainingScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
	const { user } = useAuth();
	const profilePhotoUrl = user?.profilePhoto
		? apiUrl(`/images/${user.profilePhoto}`)
		: apiUrl('/images/nouserimage.png');

	return (
		<Tab.Navigator
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor: theme.colors.background,
					borderTopColor: theme.colors.border,
					borderTopWidth: 1,
					height: Platform.OS === 'ios' ? 85 : 65,
					paddingBottom: Platform.OS === 'ios' ? 25 : 10,
					paddingTop: 8
				},
				tabBarActiveTintColor: theme.colors.primary,
				tabBarInactiveTintColor: theme.colors.textSecondary,
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: 'bold'
				}
			}}
		>
			<Tab.Screen
				name="Home"
				component={HomeScreen}
				options={{
					tabBarIcon: ({ color }) => (
						<Text style={{ fontSize: 24, color }}>🏠</Text>
					)
				}}
			/>
			<Tab.Screen
				name="Feed"
				component={FeedScreen}
				options={{
					tabBarIcon: ({ color }) => (
						<Text style={{ fontSize: 24, color }}>📱</Text>
					)
				}}
			/>
			<Tab.Screen
				name="Profile"
				component={ProfileScreen}
				options={{
					tabBarIcon: ({ color, focused }) => (
						<View style={{
							width: 28,
							height: 28,
							borderRadius: 14,
							overflow: 'hidden',
							borderWidth: focused ? 2 : 0,
							borderColor: color
						}}>
							<Image
								source={{ uri: profilePhotoUrl }}
								style={{ width: '100%', height: '100%' }}
								resizeMode="cover"
							/>
						</View>
					)
				}}
			/>
		</Tab.Navigator>
	);
}

export default function MainNavigator() {
	return (
		<SafeAreaProvider>
			<NavigationContainer>
				<Stack.Navigator
					screenOptions={{
						headerShown: false
					}}
				>
					<Stack.Screen name="Main" component={TabNavigator} />
					<Stack.Screen name="Training" component={TrainingScreen} />
					<Stack.Screen name="ResumeTraining" component={ResumeTrainingScreen} />
				</Stack.Navigator>
			</NavigationContainer>
		</SafeAreaProvider>
	);
}
