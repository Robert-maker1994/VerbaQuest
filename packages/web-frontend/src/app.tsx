import { Container } from "@mui/material";
import React, { lazy } from "react";
import { Route, Routes } from "react-router";
import Footer from "./components/footer";
import { useAuth } from "./context/auth";
import { TranslationProvider } from "./context/translationProvider";
import { CrosswordProvider } from "./pages/crossword/crosswordContext";
import Login from "./pages/login/login";
import Navbar from "./pages/navbar";

const Settings = lazy(() => import("./pages/settings/settings"));
const Crossword = lazy(() => import("./pages/crossword/crossword"));
const CrosswordPage = lazy(() => import("./pages/crossword/crosswordPage"));
const Dashboard = lazy(() => import("./pages/dashboard/dashboard"));
const PrivacyPolicy = lazy(() => import("./pages/privacyPolicy"));
const TermsOfService = lazy(() => import("./pages/termsOfService"));
const Register = lazy(() => import("./pages/login/register"));
const Loading = lazy(() => import("./pages/loadingPage"));

const routes = [
	{
		path: "/",
		element: <Dashboard />,
	},
	{
		path: "/crossword/:crosswordId",
		element: <Crossword />,
	},
	{
		path: "/crossword",
		element: <CrosswordPage />,
	},
	{
		path: "/dashboard",
		element: <Dashboard />,
	},
	{
		path: "/settings",
		element: <Settings />,
	},
	{
		path: "/register",
		element: <Register />,
	},
	{
		path: "/privacy",
		element: <PrivacyPolicy />,
	},
	{
		path: "/terms",
		element: <TermsOfService />,
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
		return <Loading />;
	}

	return (
		<React.Suspense fallback={<Loading />}>
			{isLoggedIn ? (
				<TranslationProvider>
					<Container
						maxWidth="lg"
						sx={{
							minHeight: "90vh",
						}}
					>
						<Navbar />
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
					<Footer />
				</TranslationProvider>
			) : (
				<Login />
			)}
		</React.Suspense>
	);
}

export default App;
