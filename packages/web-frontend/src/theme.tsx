"use client";
import { createTheme } from "@mui/material/styles";

const WHITE = "#FFFFFF";
const DEEP_PURPLE = "#6A0DAD";
const GOLD = "#FFD700";
const BLACK = "#000000";
const LIGHT_GRAY = "#D3D3D3";
const ROBOTO_FONT = "Roboto, sans-serif";

export const theme = createTheme({
	palette: {
		primary: {
			main: LIGHT_GRAY,
			contrastText: BLACK,
		},
		secondary: {
			main: DEEP_PURPLE,
			contrastText: WHITE,
		},
		warning: {
			main: GOLD,
			contrastText: BLACK,
		},
		background: {
			default: LIGHT_GRAY,
			paper: LIGHT_GRAY,
		},
		text: {
			primary: BLACK,
			secondary: BLACK,
		},
	},
	typography: {
		fontFamily: ROBOTO_FONT,
		h1: {
			fontSize: '2rem', 
		},
		h2: {
			fontSize: '1.5rem',
		},
		h3: {
			fontSize: '1.25rem',
		},
		h4: {
			fontSize: '1rem', 
		},
		h5: {
			fontSize: '0.875rem', 
		},
		h6: {
			fontSize: '0.75rem',
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					color: DEEP_PURPLE,
				},
			},
		},
	},
});
