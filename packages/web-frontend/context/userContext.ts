import { createContext, useContext } from "react";

interface UserContextType {
	isLoggedIn: boolean;
	setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const UserContext = createContext<UserContextType>({
	isLoggedIn: false,
	setIsLoggedIn: () => {},
});

export const useUser = () => useContext(UserContext);

export default UserContext;
