import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
import logo from '../../assets/logo.png';

type Screen = 'welcome' | 'login' | 'signup';

const WelcomeScreen = () => {
	const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');

	if (currentScreen === 'login') {
		return <LoginScreen onBack={() => setCurrentScreen('welcome')} />;
	}

	if (currentScreen === 'signup') {
		return <SignupScreen onBack={() => setCurrentScreen('welcome')} />;
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<Image
					source={logo}
					style={styles.logo}
					resizeMode="cover"
				/>
			</View>

			<Text style={styles.appName}>Ghost Running</Text>

			<View style={styles.spacer} />

			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={[styles.button, styles.loginButton]}
					onPress={() => setCurrentScreen('login')}
				>
					<Text style={styles.buttonText}>Log In</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.button, styles.signupButton]}
					onPress={() => setCurrentScreen('signup')}
				>
					<Text style={styles.buttonText}>Sign Up</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000000'
	},
	content: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 30
	},
	logoContainer: {
		width: 180,
		height: 180,
		borderWidth: 5,
		borderColor: '#FF8C00',
		borderRadius: 90,
		padding: 0,
		marginBottom: 30,
		overflow: 'hidden',
		justifyContent: 'center',
		alignItems: 'center'
	},
	logo: {
		width: 180,
		height: 180,
		borderRadius: 90
	},
	appName: {
		fontSize: 32,
		fontWeight: 'bold',
		color: '#FFFFFF',
		marginBottom: 20,
		letterSpacing: 1
	},
	spacer: {
		flex: 0.3
	},
	buttonContainer: {
		width: '100%',
		gap: 15
	},
	button: {
		width: '100%',
		paddingVertical: 15,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center'
	},
	loginButton: {
		backgroundColor: '#FF8C00'
	},
	signupButton: {
		backgroundColor: 'transparent',
		borderWidth: 2,
		borderColor: '#FF8C00'
	},
	buttonText: {
		color: '#FFFFFF',
		fontSize: 18,
		fontWeight: '600'
	}
});

export default WelcomeScreen;
