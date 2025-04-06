import type {
  CreateCrosswordBody,
  CrosswordDetailsResponse,
  CrosswordResponse,
  Difficulty,
  GetAllVerbResponse,
  LanguageCode,
} from "@verbaquest/types";
import axios from "axios";
import type { ApiVerb, ConjugationResponse } from "../../pages/conjugation/components/conjugationTable";
export const api = axios.create({
  baseURL: "http://localhost:5001/",
  headers: {
    "Content-Type": "application/json",
  },
});

const backendEndpoints = {
  async editGroup(body: { verbsIds: number[]; title: string; groupId: number }) {
    const token = localStorage.getItem("token");

    const response = await api.patch<CrosswordDetailsResponse>("user-verb", body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
  async getVerbsByIds(ids: number[]) {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found");
    }
    const response = await api.get<ApiVerb[]>("/verb/", {
      params: {
        ids: ids.join(","),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.status) {
      throw new Error(`Failed to get verbs: ${response.statusText}`);
    }
    return response.data;
  },

  async getGroups() {
    const token = localStorage.getItem("token");

    const response = await api.get("user-verb", {
      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
  async deleteGroup(id: number) {
    const token = localStorage.getItem("token");

    const response = await api.delete(`user-verb/${id}`, {
      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
  async createNewGroup(body: { verbsIds: number[]; title: string }) {
    const token = localStorage.getItem("token");

    const response = await api.post<CrosswordDetailsResponse>("user-verb", body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
  async getCrosswordDetails(page?: number, search?: string): Promise<CrosswordDetailsResponse> {
    const token = localStorage.getItem("token");

    const params = {
      page,
      search,
    };
    const response = await api.get<CrosswordDetailsResponse>("crossword/details", {
      params,
      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async getSpecificCrossword(crosswordId: number) {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await api.get<CrosswordResponse>(`crossword/${crosswordId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async createCrosswordForLoginUser(crossword_id: number, grid_state: string[][]) {
    try {
      const token = localStorage.getItem("token");

      const response = await api.post<CreateCrosswordBody>(
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
    const { data } = await api.get("/usercrossword/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },

  async saveUserProgress(crosswordId: number, timeTaken: number, completed: boolean) {
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
          completed,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.status) {
        throw new Error(`Failed to save user progress: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error("Error saving user progress:", error);
      throw error;
    }
  },

  async getPageTranslations() {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found");
    }

    const response = await api.get("/translation", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.status) {
      throw new Error(`Failed to save user progress: ${response.statusText}`);
    }

    return response.data;
  },

  async getWorldWord() {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found");
    }

    const response = await api.get<string[]>("/wordle", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.status) {
      throw new Error(`Failed to get word: ${response.statusText}`);
    }
    return response.data;
  },

  async update(crosswordId: number, favorite: boolean) {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found");
    }

    const response = await api.post<string[]>(
      "/usercrossword/update",
      {
        crosswordId,
        favorite,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.status) {
      throw new Error(`Failed to update user progress: ${response.statusText}`);
    }
    return response.data;
  },
  async allVerbs() {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found");
    }
    const response = await api.get<GetAllVerbResponse[]>("/verb", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.status) {
      throw new Error(`Failed to get verbs: ${response.statusText}`);
    }
    return response.data;
  },
  async getVerbConjugation(verbId: number) {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found");
    }
    const response = await api.get<ConjugationResponse>(`/verb/conjugation/${verbId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.status) {
      throw new Error(`Failed to get verbs: ${response.statusText}`);
    }
    return response.data;
  },
  async searchVerbs(search: string) {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found");
    }
    const response = await api.get<ApiVerb[]>(`/verb/${search}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.status) {
      throw new Error(`Failed to get verbs: ${response.statusText}`);
    }
    return response.data;
  },
};

export default backendEndpoints;
