import { createTheme } from "@mui/material";
import { commonOptions, createColorPalette, getShadow } from "./common";

const darkPalette = {
	...createColorPalette("#4DD0E1", "#FFD54F"), // Bright Teal and Vibrant Yellow
	background: {
		default: "#121212",
		paper: "#1E1E1E",
	},
	text: {
		primary: "#E0E0E0",
		secondary: "#BDBDBD",
		disabled: "#757575",
	},
	error: {
		main: "#EF5350",
		light: "#EF9A9A",
		dark: "#C62828",
		contrastText: "#000000",
	},
	warning: {
		main: "#FF9800",
		light: "#FFB74D",
		dark: "#F57C00",
		contrastText: "#000000",
	},
	info: {
		main: "#42A5F5",
		light: "#90CAF9",
		dark: "#1565C0",
		contrastText: "#000000",
	},
	success: {
		main: "#4CAF50",
		light: "#A5D6A7",
		dark: "#2E7D32",
		contrastText: "#000000",
	},
	tonalOffset: 0.2,
	mode: "dark" as const,
};
export const darkTheme = createTheme({
	...commonOptions,
	palette: darkPalette,
	components: {
		MuiButton: {
			styleOverrides: {
				root: {},
				containedPrimary: {
					boxShadow: getShadow(darkPalette.primary.main),
				},
				containedSecondary: {
					boxShadow: getShadow(darkPalette.secondary.main),
				},
			},
		},
		
	},
});
