import type React from "react";
import { type ReactNode, createContext, useState } from "react";

interface ThemeProviderProps {
	children: ReactNode;
}
interface ThemeContextType {
	isDarkMode: boolean;
	toggleDarkMode: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
	isDarkMode: false,
	toggleDarkMode: () => {},
});

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
	const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

	const toggleDarkMode = () => {
		setIsDarkMode(!isDarkMode);
	};

	return (
		<ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
			<MuiThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
				{children}
			</MuiThemeProvider>
		</ThemeContext.Provider>
	);
};
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { darkTheme } from "./darkTheme";
import { lightTheme } from "./lightTheme";
