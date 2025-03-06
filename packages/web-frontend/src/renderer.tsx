import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { lazy } from 'react';
import Navbar from './pages/crossword/components/navbar';
import { BrowserRouter, Route, Routes } from "react-router";

import { theme } from './theme';

export const api = axios.create({
	baseURL: "http://localhost:3000",
	headers: {
		"Content-Type": "application/json",
	},
});

import "./index.css";
import { Container } from '@mui/material';

const Crossword = lazy(() => import('./pages/crossword/crossword'));
const Contact = lazy(() => import('./pages/contact/contact'));
const Dashboard = lazy(() => import('./pages/dashboard/dashboard'));
const VerbConjugation = lazy(() => import('./pages/verbconjugation/verbconjugation'));

const routes = [

	{
		path: "/",
		element:
			<Crossword />
	},

	{
		path: "/crossword",
		element: <Crossword />,
	},
	{
		path: "/contact",
		element: <Contact />,
	},
	{
		path: "/dashboard",
		element: <Dashboard />,
	},
	{
		path: "/verbconjugation",
		element: <VerbConjugation />,
	},

]

function Renderer() {
	return (
		<ThemeProvider theme={theme}>

			<BrowserRouter>
				<CssBaseline />
				<Navbar />
				<Container maxWidth="lg" >
					<Routes>
						{
							routes.map((r) => {
								return <Route key={r.path} path={r.path} element={r.element} />
							})
						}
					</Routes>
				</Container>

			</BrowserRouter>


		</ThemeProvider >
	);
}

export default Renderer;
