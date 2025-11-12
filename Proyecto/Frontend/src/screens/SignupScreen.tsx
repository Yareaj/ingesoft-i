import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../config/designSystem';
import GRButton from '../components/GRButton';

interface SignupScreenProps {
  onBack: () => void;
}

const SignupScreen = ({ onBack }: SignupScreenProps) => {
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const handleSignup = () => {
		// Lógica de registro aquí
		console.log('Signup:', email, username, password);
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

						<GRButton label="Create Account" variant="primary" onPress={handleSignup} style={styles.buttonSpacing} />
						<GRButton label="Back" variant="outline" onPress={onBack} style={styles.buttonSpacing} />
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: theme.colors.background },
	scrollContent: { flexGrow: 1 },
	content: { flex: 1, justifyContent: 'center', paddingHorizontal: theme.spacing.xl + 10, paddingVertical: theme.spacing.xl * 2 },
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

export default SignupScreen;
