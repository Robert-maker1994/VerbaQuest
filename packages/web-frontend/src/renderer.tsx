import axios from "axios";
import App from "./App.tsx";

export const api = axios.create({
	baseURL: "http://localhost:3000",
	headers: {
		"Content-Type": "application/json",
	},
});

function Renderer() {
	return <App />;
}

export default Renderer;
