import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UserData {
	email: string;
	username: string;
	names: string;
	lastNames: string;
	profilePhoto?: string;
	description?: string;
	gender?: string;
}

interface AuthContextType {
	user: UserData | null
	setUser: (user: UserData | null) => void;
	isAuthenticated: boolean;
	logout: () => void;
}

const authContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<UserData | null>(null);

	const logout = () => {
		setUser(null);
	};

	return (
		<authContext.Provider value={{
			user,
			setUser,
			isAuthenticated: !!user,
			logout
		}}>
			{children}
		</authContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(authContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
