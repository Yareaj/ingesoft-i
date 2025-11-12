import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../config/designSystem';
import { commonStyles } from '../config/commonStyles';
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
