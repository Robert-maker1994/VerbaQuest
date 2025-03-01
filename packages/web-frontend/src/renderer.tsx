import axios from "axios";
import App from "./App";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme";

export const api = axios.create({
	baseURL: "http://localhost:3000",
	headers: {
		"Content-Type": "application/json",
	},
});

function Renderer() {
	return <ThemeProvider theme={theme}>
		<CssBaseline />
		<App />
	</ThemeProvider>;
}

export default Renderer;
