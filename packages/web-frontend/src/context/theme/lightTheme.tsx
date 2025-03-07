import { alpha, createTheme } from "@mui/material";
import { commonOptions } from "./common";

const getShadow = (color: string) => `0 0 0 2px ${alpha(color, 0.4)}`;

const createColorPalette = (primaryColor: string, secondaryColor: string) => {
	const palette = {
		primary: {
			main: primaryColor,
			light: alpha(primaryColor, 0.7),
			dark: alpha(primaryColor, 0.9),
			contrastText: getContrastText(primaryColor),
		},
		secondary: {
			main: secondaryColor,
			light: alpha(secondaryColor, 0.7),
			dark: alpha(secondaryColor, 0.9),
			contrastText: getContrastText(secondaryColor),
		},
	};
	return palette;
};

const getContrastText = (color: string) => {
	const hexColor = color.replace("#", "");
	const r = Number.parseInt(hexColor.substring(0, 2), 16);
	const g = Number.parseInt(hexColor.substring(2, 4), 16);
	const b = Number.parseInt(hexColor.substring(4, 6), 16);
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
	return luminance > 0.5 ? "#000000" : "#FFFFFF";
};

const lightPalette = {
	...createColorPalette("#00796B", "#FFC107"), // Deep Teal and Amber
	background: {
		default: "#FAFAFA",
		paper: "#FFFFFF",
	},
	text: {
		primary: "#212121",
		secondary: "#757575",
		disabled: "#BDBDBD",
	},
	error: {
		main: "#D32F2F",
		light: "#EF5350",
		dark: "#C62828",
		contrastText: "#fff",
	},
	warning: {
		main: "#F57C00",
		light: "#FF9800",
		dark: "#E65100",
		contrastText: "#fff",
	},
	info: {
		main: "#1976D2",
		light: "#42A5F5",
		dark: "#1565C0",
		contrastText: "#fff",
	},
	success: {
		main: "#388E3C",
		light: "#4CAF50",
		dark: "#1B5E20",
		contrastText: "#fff",
	},
	tonalOffset: 0.2,
	mode: "light" as const,
};

export const lightTheme = createTheme({
	...commonOptions,
	palette: lightPalette,
	components: {
		MuiButton: {
			styleOverrides: {
				root: {},
				containedPrimary: {
					boxShadow: getShadow(lightPalette.primary.main),
				},
				containedSecondary: {
					boxShadow: getShadow(lightPalette.secondary.main),
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundImage: "none",
				},
			},
		},
	},
});
