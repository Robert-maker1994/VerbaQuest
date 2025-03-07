import firebaseAuthProvider from "./authProviders/firebaseAuthProvider";
import { defaultUserAuthProvider } from "./authProviders/localAuthProvider";
import type { AuthProvider } from "./interfaces";

const authProvider: AuthProvider =
	import.meta.env.VITE_AUTH_MODE === "LOCAL"
		? defaultUserAuthProvider
		: firebaseAuthProvider;

export const login = authProvider.login;
export const register = authProvider.register;
export const logout = authProvider.logout;
export const checkAuth = authProvider.checkAuth;
