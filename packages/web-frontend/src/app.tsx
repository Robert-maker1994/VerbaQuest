import { Container } from "@mui/material";
import React, { lazy } from "react";
import { Route, Routes } from "react-router";
import { useAuth } from "./context/auth";
import { CrosswordProvider } from "./pages/crossword/crosswordContext";
import Login from "./pages/login/login";
import Navbar from "./pages/navbar";

const Settings = lazy(() => import("./pages/settings/settings"));
const Crossword = lazy(() => import("./pages/crossword/crossword"));
const CrosswordPage = lazy(() => import("./pages/crossword/crosswordPage"));
const Contact = lazy(() => import("./pages/contact/contact"));
const Dashboard = lazy(() => import("./pages/dashboard/dashboard"));
const VerbConjugation = lazy(
	() => import("./pages/verbconjugation/verbconjugation"),
);
const Register = lazy(() => import("./pages/login/register"));
const routes = [
	{
		path: "/",
		element: <Dashboard />,
	},
	{
		path: "/crossword/:crosswordId", // New route with :crosswordId parameter
		element: <Crossword />,
	},
	{
		path: "/crossword",
		element: <CrosswordPage />,
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
		path: "/settings",
		element: <Settings />,
	},
	{
		path: "/register",
		element: <Register />,
	},
];
function App() {
	return (
		<div className="App">
			<AppContent />
		</div>
	);
}

function AppContent() {
	const { isLoggedIn, isLoading } = useAuth();

	if (isLoading) {
		return <p>Loading...</p>;
	}

	return (
		<React.Suspense fallback={<p>Loading...</p>}>
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
		</React.Suspense>
	);
}

export default App;
