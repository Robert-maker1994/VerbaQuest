import type { Theme } from "@mui/material/styles";
import {
	type ReactNode,
	createContext,
	useContext,
	useMemo,
	useState,
} from "react"; // Import React context utilities
import { darkTheme } from "./darkTheme";
import { lightTheme } from "./lightTheme";

interface ThemeContextProps {
	theme: Theme;
	toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextProps>({
	theme: lightTheme,
	toggleTheme: () => {},
});

const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
	children: ReactNode;
}

const CustomThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
	const [isDarkMode, setIsDarkMode] = useState(false); // Start with light mode

	const theme = useMemo(() => {
		return isDarkMode ? darkTheme : lightTheme;
	}, [isDarkMode]);

	const toggleTheme = () => {
		setIsDarkMode((prevMode) => !prevMode);
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export { CustomThemeProvider, useTheme };
