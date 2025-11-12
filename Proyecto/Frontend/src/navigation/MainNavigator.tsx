import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from '../screens/HomeScreen';
import FeedScreen from '../screens/FeedScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
	return (
		<SafeAreaProvider>
			<NavigationContainer>
				<Tab.Navigator
					screenOptions={{
						headerShown: false,
						tabBarStyle: {
							backgroundColor: '#000000',
							borderTopColor: '#1a1a1a',
							borderTopWidth: 1,
							height: Platform.OS === 'ios' ? 85 : 65,
							paddingBottom: Platform.OS === 'ios' ? 25 : 10,
							paddingTop: 8
						},
						tabBarActiveTintColor: '#FF6B00',
						tabBarInactiveTintColor: '#888888',
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
							tabBarIcon: ({ color }) => (
								<Text style={{ fontSize: 24, color }}>👤</Text>
							)
						}}
					/>
				</Tab.Navigator>
			</NavigationContainer>
		</SafeAreaProvider>
	);
}
