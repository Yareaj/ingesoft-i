import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../config/designSystem';
import { commonStyles } from '../config/commonStyles';
import GRButton from '../components/GRButton';
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
				body: JSON.stringify({ email, password })
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
			<View style={styles.content}>
				<Text style={commonStyles.title}>Log In</Text>

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
						placeholder="Password"
						placeholderTextColor="#999"
						value={password}
						onChangeText={setPassword}
						secureTextEntry
					/>

					<GRButton label="Enter" variant="primary" onPress={handleLogin} style={styles.buttonSpacing} />
					<GRButton label="Back" variant="outline" onPress={onBack} style={styles.buttonSpacing} />
				</View>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	content: { flex: 1, justifyContent: 'center', paddingHorizontal: theme.spacing.xl + 10 },
	buttonSpacing: { width: '100%', marginTop: theme.spacing.s }
});

export default LoginScreen;
