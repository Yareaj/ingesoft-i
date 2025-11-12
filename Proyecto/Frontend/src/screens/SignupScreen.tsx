import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../config/designSystem';
import { commonStyles } from '../config/commonStyles';
import GRButton from '../components/GRButton';
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

		console.log("Conectando a la IP:", apiUrl('/api/register'));

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
		<SafeAreaView style={commonStyles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<View style={styles.content}>
					<Text style={commonStyles.title}>Sign Up</Text>

					<View style={commonStyles.form}>
						<TextInput
							style={commonStyles.input}
							placeholder="Email"
							placeholderTextColor="#999"
							value={email}
							onChangeText={setEmail}
							keyboardType="email-address"
							autoCapitalize="none"
						/>

						<TextInput
							style={commonStyles.input}
							placeholder="Username"
							placeholderTextColor="#999"
							value={username}
							onChangeText={setUsername}
							autoCapitalize="none"
						/>

						<TextInput
							style={commonStyles.input}
							placeholder="Password"
							placeholderTextColor="#999"
							value={password}
							onChangeText={setPassword}
							secureTextEntry
						/>

						<TextInput
							style={commonStyles.input}
							placeholder="Confirm Password"
							placeholderTextColor="#999"
							value={confirmPassword}
							onChangeText={setConfirmPassword}
							secureTextEntry
						/>

						<GRButton label="Create Account" variant="primary" onPress={handleSignup} style={styles.buttonSpacing} />
						<GRButton label="Back" variant="outline" onPress={onBack} style={styles.buttonSpacing} />
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	scrollContent: { flexGrow: 1 },
	content: { flex: 1, justifyContent: 'center', paddingHorizontal: theme.spacing.xl + 10, paddingVertical: theme.spacing.xl * 2 },
	buttonSpacing: { width: '100%', marginTop: theme.spacing.s }
});

export default SignupScreen;
