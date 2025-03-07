
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    type User as AUTHUSER,
} from "firebase/auth";
import type { LoginData, QuestUser, AuthProvider } from "../interfaces";
import { api } from "../../api/api";
import firebaseAuth from "./firebaseAuth"

class FirebaseAuthProvider implements AuthProvider {
    async login(data: LoginData) {
        try {
            const userCredential = await signInWithEmailAndPassword(
                firebaseAuth,
                data.username,
                data.password,
            );
            const token = await userCredential.user.getIdToken();

            const userDetails = await api.get<QuestUser>(
                "/user",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const user = {
                ...userDetails.data,
                token,
            };
            return { success: true, message: "Login successful!", user };
        } catch (error) {
            return {
                success: false,
                message: "Login failed!",
            };
        }
    }

    async register(data: LoginData) {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                firebaseAuth,
                data.username,
                data.password,
            );
            const token = await userCredential.user.getIdToken();

            const userDetails = await api.post<QuestUser>(
                "/user",
                {
                    email: userCredential.user.email,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const user = {
                ...userDetails.data,
                token,
            };
            return { success: true, message: "register successful!", user };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: "Register failed!",
            };
        }
    }

    async logout() {
        try {
            await signOut(firebaseAuth);
            return { success: true, message: "Logout successful!" };
        } catch (error) {
            console.error(error);

            return {
                success: false,
                message: "Logout failed!",
            };
        }
    }

    async checkAuth() {
        return new Promise<{ success: boolean; user?: QuestUser }>((resolve) => {
            const unsubscribe = onAuthStateChanged(firebaseAuth, async (user: AUTHUSER | null) => {
                unsubscribe();
                if (user) {
                    const token = await user.getIdToken();
                    try {
                        const userDetails = await api.get<QuestUser>(
                            "/user",
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            },
                        );

                        const userObj = {
                            ...userDetails.data,
                            token,
                        };
                        resolve({ success: true, user: userObj });
                    } catch (error) {
                        resolve({ success: false });
                    }
                }
                resolve({ success: false });
            });
        });
    }
}

export default new FirebaseAuthProvider();
