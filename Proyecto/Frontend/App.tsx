import React, { useState } from 'react';
import MainNavigator from './src/navigation/MainNavigator';
import WelcomeScreen from './src/screens/WelcomeScreen';

export default function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	if (isAuthenticated) {
		return <MainNavigator />;
	}

	return <WelcomeScreen onLoginSuccess={() => setIsAuthenticated(true)} />;
}
