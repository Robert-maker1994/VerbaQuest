export interface LoginData {
	username: string;
	password: string;
}
export interface AuthProvider {
	login: (
		data: LoginData,
	) => Promise<{ success: boolean; message: string; user?: QuestUser }>;
	register: (
		data: LoginData,
	) => Promise<{ success: boolean; message?: string; user?: QuestUser }>;
	logout: () => Promise<{ success: boolean; message?: string }>;
	checkAuth: () => Promise<{ success: boolean; user?: QuestUser }>;
}
export interface AuthState {
	isLoggedIn: boolean;
	user: QuestUser | null; // Use QuestUser
	error: string | null;
	isLoading: boolean;
}
export interface QuestUser {
	email: string;
	user_id: number;
	token: string;
}

export enum AuthActionType {
	LOGIN_SUCCESS = "LOGIN_SUCCESS",
	LOGIN_FAILURE = "LOGIN_FAILURE",
	REGISTER_SUCCESS = "REGISTER_SUCCESS",
	REGISTER_FAILURE = "REGISTER_FAILURE",
	LOGOUT = "LOGOUT",
	CHECK_AUTH_SUCCESS = "CHECK_AUTH_SUCCESS",
	CHECK_AUTH_FAILURE = "CHECK_AUTH_FAILURE",
}

interface LoginFailureAction {
	type: AuthActionType.LOGIN_FAILURE;
	payload: string;
}

interface RegisterFailureAction {
	type: AuthActionType.REGISTER_FAILURE;
	payload: string;
}

interface LogoutAction {
	type: AuthActionType.LOGOUT;
}

export type AuthAction =
	| loginSuccessAction
	| LoginFailureAction
	| checkAuthSuccessAction
	| checkAuthFailureAction
	| registerSuccessAction
	| RegisterFailureAction
	| LogoutAction;

interface loginSuccessAction {
	type: AuthActionType.LOGIN_SUCCESS;
	payload: QuestUser;
}

interface checkAuthSuccessAction {
	type: AuthActionType.CHECK_AUTH_SUCCESS;
	payload: QuestUser;
}

interface checkAuthFailureAction {
	type: AuthActionType.CHECK_AUTH_FAILURE;
}

interface registerSuccessAction {
	type: AuthActionType.REGISTER_SUCCESS;
	payload: QuestUser;
}

export interface AuthState {
	isLoggedIn: boolean;
	user: QuestUser | null; // Use QuestUser
	error: string | null;
	isLoading: boolean;
}
