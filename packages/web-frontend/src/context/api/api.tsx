import axios from "axios";
import type { WordData } from "../../interfaces";

export const api = axios.create({
    baseURL: "http://localhost:5001/",
});

export interface Topic {
    topic_name: string;
    topic_id: number;
    language: {
        language_code: string;
    }
}

export interface CrosswordDetails {
    title: string;
    crossword_id: number;
    is_Public: boolean;
    difficulty: number;
    topics: Topic[];

}

export interface CrosswordResponse {
    crossword: string[][];
    title: string;
    isComplete: boolean;
    metadata: WordData[];
    id: number;
}


const backendEndpoints = {

   async  getCrosswordDetails (): Promise<CrosswordDetails[]> {
        const response = await api.get<CrosswordDetails[]>("crossword/details");
        return response.data;
    },
    
    async getRandomCrossword(): Promise<CrosswordResponse>  {
        const response = await api.get<CrosswordResponse>("crossword/random");
        return response.data;
    },
    async getCrosswordOfTheDay(): Promise<CrosswordResponse>  {
        const response = await api.get<CrosswordResponse>("crossword/today");
        return response.data;
    },
    async getTopics(): Promise<Topic[]>  {
        const response = await api.get<Topic[]>("/topics");
        return response.data;
    },
    
    async getSpecificCrossword(crosswordId: number): Promise<CrosswordResponse>{
        const response = await api.get<CrosswordResponse>(`crossword/${crosswordId}`);
        return response.data;
    },
    
    async createCrosswordForLoginUser(
        crossword_id: number,
        grid_state: string[][],
        isComplete: boolean,
    ): Promise<CrosswordResponse> {
        try {
             const token = localStorage.getItem("token");

             const response = await api.post<CrosswordResponse>(
                "usercrossword",
                {
                    crossword_id,
                    grid_state,
                    isComplete,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error creating crossword:", error);
            throw error;
        }
    }
    
}

export default backendEndpoints;