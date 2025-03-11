import { Container } from "@mui/material";
import { lazy } from "react";
import { Route, Routes } from "react-router";

import { useAuth } from "./context/auth";
import Navbar from "./pages/crossword/components/navbar";
import { CrosswordProvider } from "./pages/crossword/crosswordContext";
import Login from "./pages/login/login";

const Crossword = lazy(() => import("./pages/crossword/crossword"));
const Contact = lazy(() => import("./pages/contact/contact"));
const Dashboard = lazy(() => import("./pages/dashboard/dashboard"));
const VerbConjugation = lazy(
	() => import("./pages/verbconjugation/verbconjugation"),
);
const Register = lazy(() => import("./pages/login/register"));

const routes = [
	{
		path: "/",
		element: <Crossword />,
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
	{
		path: "/register",
		element: <Register />,
	},
];
export const App = () => {
	const { isLoggedIn, isLoading } = useAuth();

	if (isLoading) return <></>;

	return (
		<>
			{isLoggedIn ? (
				<>
					<Navbar />
					<Container maxWidth="lg">
						<CrosswordProvider>
							<Routes>
								{routes.map((r) => {
									return (
										<Route key={r.path} path={r.path} element={r.element} />
									);
								})}
							</Routes>
						</CrosswordProvider>
					</Container>
				</>
			) : (
				<Login />
			)}
		</>
	);
};
