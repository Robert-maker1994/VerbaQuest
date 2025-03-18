import type {
	CrosswordDetails,
	CrosswordResponse,
	Difficulty,
	LanguageCode,
	Topic,
} from "@verbaquest/shared";
import axios from "axios";
export const api = axios.create({
	baseURL: "http://localhost:5001/",
	headers: {
		"Content-Type": "application/json",
	},
});

const backendEndpoints = {
	async getCrosswordDetails(): Promise<CrosswordDetails[]> {
		const response = await api.get<CrosswordDetails[]>("crossword/details");
		return response.data;
	},

	async searchCrosswords(search: string): Promise<CrosswordDetails[]> {
		const response = await api.get<CrosswordDetails[]>("crossword/details", {
			params: {
				search
			}
		});
		console.log(response)
		return response.data;
	},

	async getRandomCrossword(): Promise<CrosswordResponse> {
		const response = await api.get<CrosswordResponse>("crossword/random");
		return response.data;
	},
	async getCrosswordOfTheDay(): Promise<CrosswordResponse> {
		const response = await api.get<CrosswordResponse>("crossword/today");
		return response.data;
	},
	async getTopics(): Promise<Topic[]> {
		const response = await api.get<Topic[]>("/topics");
		return response.data;
	},

	async getSpecificCrossword(crosswordId: number): Promise<CrosswordResponse> {
		const response = await api.get<CrosswordResponse>(
			`crossword/${crosswordId}`,
		);
		return response.data;
	},

	async createCrosswordForLoginUser(
		crossword_id: number,
		grid_state: string[][],
	): Promise<CrosswordResponse> {
		try {
			const token = localStorage.getItem("token");

			const response = await api.post<CrosswordResponse>(
				"usercrossword",
				{
					crossword_id,
					grid_state,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			return response.data;
		} catch (error) {
			console.error("Error creating crossword:", error);
			throw error;
		}
	},

	async getUserSettings(userId: number) {
		const token = localStorage.getItem("token");
		if (!token) {
			throw new Error("No token found");
		}

		const { data } = await api.get(`user/${userId}/settings`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		return data;
	},

	async patchUserSettings(
		userId: number,
		data: Partial<{
			preferred_learning_language: LanguageCode;
			preferred_difficulty: Difficulty;
		}>,
	) {
		const token = localStorage.getItem("token");
		if (!token) {
			throw new Error("No token found");
		}

		const res = await api.patch(`user/${userId}/settings`, data, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return res.data;
	},

	async getUserCrosswords() {
		const token = localStorage.getItem("token");
		if (!token) {
			throw new Error("No token found");
		}
		const { data } = await api.get("/usercrossword", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return data;
	},



	async saveUserProgress(crosswordId: number, timeTaken: number) {
		try {
			const token = localStorage.getItem("token");
			
			if (!token) {
				throw new Error("No token found");
			}

			const response = await api.post(
				"/usercrossword",
				{
					crosswordId,
					timeTaken,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					}
				});

			if (!response.status) {
				throw new Error(`Failed to save user progress: ${response.statusText}`);
			}

			return true;
		} catch (error) {
			console.error("Error saving user progress:", error);
			throw error;
		}
	}
};

export default backendEndpoints;
