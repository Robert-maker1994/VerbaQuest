import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter } from "react-router";

import "./index.css";
import { App } from "./app";
import { AuthProvider } from "./context/auth/authContext";
import { ThemeProvider } from "./context/theme/themeContext";

function Renderer() {
	return (
		<ThemeProvider>
			<BrowserRouter>
				<AuthProvider>
					<App />
					<CssBaseline />
				</AuthProvider>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default Renderer;
