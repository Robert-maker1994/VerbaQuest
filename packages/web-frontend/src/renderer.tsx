import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import Crossword from "./components/crossword";
import { theme } from "./theme";

export const api = axios.create({
	baseURL: "http://localhost:3000",
	headers: {
		"Content-Type": "application/json",
	},
});

function Renderer() {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Crossword />
		</ThemeProvider>
	);
}

export default Renderer;
