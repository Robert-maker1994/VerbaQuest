// src/context/auth/authContext.ts
import type React from "react";
import { type ReactNode, createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { checkAuth, login, logout, register } from "./authProvider";
import type { LoginData, QuestUser } from "./interfaces";

interface AuthContextType {
	isLoggedIn: boolean;
	user: QuestUser | null;
	error: string | null;
	isLoading: boolean;
	login: (data: LoginData) => void;
	register: (data: LoginData) => void;
	logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
	isLoggedIn: false,
	user: null,
	error: null,
	isLoading: true,
	login: () => {},
	register: () => {},
	logout: () => {},
});

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
	const [user, setUser] = useState<QuestUser | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const nav = useNavigate();
	const handleLogin = async (data: LoginData) => {
		const response = await login(data);
		if (response.success && response.user) {
			setIsLoggedIn(true);
			setUser(response.user);
			nav("/");
		} else {
			setError(response.message);
		}
	};

	const handleRegister = async (data: LoginData) => {
		const response = await register(data);
		if (response.success && response.user) {
			setIsLoggedIn(true);
			setUser(response.user);
		} else {
			setError(response.message || "Register failed!");
		}
	};

	const handleLogout = async () => {
		await logout();
		setIsLoggedIn(false);
		setUser(null);
	};

	useEffect(() => {
		const check = async () => {
			const response = await checkAuth();
			if (response.success && response.user) {
				setIsLoggedIn(true);
				setUser(response.user);
			}
			setIsLoading(false);
		};
		check();
	}, []);

	const value: AuthContextType = {
		isLoggedIn,
		user,
		error,
		isLoading,
		login: handleLogin,
		register: handleRegister,
		logout: handleLogout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthContext;
