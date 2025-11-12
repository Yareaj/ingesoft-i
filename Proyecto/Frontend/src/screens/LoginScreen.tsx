import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../config/designSystem';
import GRButton from '../components/GRButton';

interface LoginScreenProps {
  onBack: () => void;
}

const LoginScreen = ({ onBack }: LoginScreenProps) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleLogin = () => {
		// Lógica de login aquí
		console.log('Login:', email, password);
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

					<GRButton label="Enter" variant="primary" onPress={handleLogin} style={styles.buttonSpacing} />
					<GRButton label="Back" variant="outline" onPress={onBack} style={styles.buttonSpacing} />
				</View>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: theme.colors.background },
	content: { flex: 1, justifyContent: 'center', paddingHorizontal: theme.spacing.xl + 10 },
	title: { fontSize: 32, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: theme.spacing.xxl, textAlign: 'center' },
	form: { width: '100%' },
	input: {
		backgroundColor: theme.colors.surface,
		borderWidth: 1,
		borderColor: theme.colors.primary,
		borderRadius: theme.radii.m,
		paddingVertical: theme.spacing.l,
		paddingHorizontal: theme.spacing.l,
		marginBottom: theme.spacing.m,
		color: theme.colors.textPrimary,
		fontSize: theme.typography.size.l,
	},
	buttonSpacing: { width: '100%', marginTop: theme.spacing.s },
});

export default LoginScreen;
