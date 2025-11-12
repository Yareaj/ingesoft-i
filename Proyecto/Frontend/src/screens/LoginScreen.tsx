import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiUrl } from '../config/api';

interface LoginScreenProps {
  onBack: () => void;
}

const LoginScreen = ({ onBack }: LoginScreenProps) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleLogin = async () => {
		// Lógica de login aquí
		try {
			const response = await fetch(apiUrl('/api/login'), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({email, password })
			});
		
			const data = await response.json();
			if (!response.ok) {
				throw new Error(data?.message || `Error ${response.status}`);
			}
			Alert.alert("Respuesta del servidor", data.message || "Registro exitoso");
		} catch (error) {
			console.error("Error en la solicitud:", error);
			Alert.alert("Error", "No se pudo conectar con el servidor");
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.title}>Log In</Text>

				<View style={styles.form}>
					<TextInput
						style={styles.input}
						placeholder="Email"
						placeholderTextColor="#999"
						value={email}
						onChangeText={setEmail}
						keyboardType="email-address"
						autoCapitalize="none"
					/>

					<TextInput
						style={styles.input}
						placeholder="Password"
						placeholderTextColor="#999"
						value={password}
						onChangeText={setPassword}
						secureTextEntry
					/>

					<TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
						<Text style={styles.loginButtonText}>Enter</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.backButton} onPress={onBack}>
						<Text style={styles.backButtonText}>Back</Text>
					</TouchableOpacity>
				</View>
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
		paddingHorizontal: 30
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		color: '#FFFFFF',
		marginBottom: 40,
		textAlign: 'center'
	},
	form: {
		width: '100%'
	},
	input: {
		backgroundColor: '#1A1A1A',
		borderWidth: 1,
		borderColor: '#FF8C00',
		borderRadius: 10,
		paddingVertical: 15,
		paddingHorizontal: 20,
		marginBottom: 15,
		color: '#FFFFFF',
		fontSize: 16
	},
	loginButton: {
		backgroundColor: '#FF8C00',
		paddingVertical: 15,
		borderRadius: 10,
		alignItems: 'center',
		marginTop: 10
	},
	loginButtonText: {
		color: '#FFFFFF',
		fontSize: 18,
		fontWeight: '600'
	},
	backButton: {
		backgroundColor: 'transparent',
		borderWidth: 2,
		borderColor: '#FF8C00',
		paddingVertical: 15,
		borderRadius: 10,
		alignItems: 'center',
		marginTop: 15
	},
	backButtonText: {
		color: '#FF8C00',
		fontSize: 18,
		fontWeight: '600'
	}
});

export default LoginScreen;
