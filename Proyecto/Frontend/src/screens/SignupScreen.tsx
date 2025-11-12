import React, { useState } from 'react';
import styles from '../styles/global-styles';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiUrl } from '../config/api';

interface SignupScreenProps {
  onBack: () => void;
}

const SignupScreen = ({ onBack }: SignupScreenProps) => {
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const handleSignup = async () => {
		if (password !== confirmPassword) {
			Alert.alert("Error", "Las contraseñas no contraseñean");
			return;
		}

		try {
			const response = await fetch(apiUrl('/api/register'), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, email, password })
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
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<View style={styles.content}>
					<Text style={styles.title}>Sign Up</Text>

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
							placeholder="Username"
							placeholderTextColor="#999"
							value={username}
							onChangeText={setUsername}
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

						<TextInput
							style={styles.input}
							placeholder="Confirm Password"
							placeholderTextColor="#999"
							value={confirmPassword}
							onChangeText={setConfirmPassword}
							secureTextEntry
						/>

						<TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
							<Text style={styles.signupButtonText}>Create Account</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.backButton} onPress={onBack}>
							<Text style={styles.backButtonText}>Back</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};


export default SignupScreen;
