import { api } from "../../api/api";
import type { AuthProvider, LoginData, QuestUser } from "../interfaces";

const DEFAULT_TOKEN = import.meta.env.VITE_DEFAULT_TOKEN;
localStorage.setItem("token", DEFAULT_TOKEN);

class DefaultUserAuthProvider implements AuthProvider {
	async login(_data: LoginData) {
		try {
			const defaultUser = await api.get<QuestUser>("/user", {
				headers: {
					Authorization: `Bearer ${DEFAULT_TOKEN}`,
				},
			});
			return {
				success: true,
				message: "Login successful!",
				user: { ...defaultUser.data, token: DEFAULT_TOKEN as string },
			};
		} catch (error) {
			console.error(error);
			return { success: false, message: "Login failed!" };
		}
	}

	async register(data: LoginData) {
		const newUser = await api.post<QuestUser>(
			"/user",
			{ ...data },
			{
				headers: {
					Authorization: `Bearer ${DEFAULT_TOKEN}`,
				},
			},
		);
		return { success: true, message: "Created new user!", newUser };
	}

	async logout() {
		return { success: true, message: "Logout successful!" };
	}

	async checkAuth() {
		try {
			const defaultUser = await api.get<QuestUser>("/user", {
				headers: {
					Authorization: `Bearer ${DEFAULT_TOKEN}`,
				},
			});
			return {
				success: true,
				message: "Login successful!",
				user: { ...defaultUser.data, token: String(DEFAULT_TOKEN) },
			};
		} catch (error) {
			console.error(error);
			return {
				success: false,
				message: "Login failed!",
			};
		}
	}
}

export const defaultUserAuthProvider = new DefaultUserAuthProvider();
