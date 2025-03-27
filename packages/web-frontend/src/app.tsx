import { Container } from "@mui/material";
import React, { lazy } from "react";
import { Route, Routes } from "react-router";
import { useAuth } from "./context/auth";
import { TranslationProvider } from "./context/translationProvider";
import { CrosswordProvider } from "./pages/crossword/crosswordContext";
import Login from "./pages/login/login";
import Navbar from "./pages/navbar";
import Footer from "./components/footer";

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
		id: 1,
		path: "/",
		element: <Dashboard />,
	},
	{
		id: 2,
		path: "/crossword/:crosswordId",
		element: <Crossword />,
	},
	{
		id: 3,
		path: "/crossword",
		element: <CrosswordPage />,
	},
	{
		id: 4,
		path: "/dashboard",
		element: <Dashboard />,
	},
	{
		id: 5,
		path: "/settings",
		element: <Settings />,
	},
	{
		id: 9,
		path: "/register",
		element: <Register />,
	},
	{
		id: 6,
		path: "/privacy",
		element: <PrivacyPolicy />,
	},
	{
		id: 7,
		path: "/terms",
		element: <TermsOfService />,
	}
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
					<Container maxWidth="lg" sx={{
						minHeight: "90vh"
					}} >
						<Navbar />
						<CrosswordProvider>
							<Routes>
								{routes.map((r) => {
									return (
										<Route key={r.id} path={r.path} element={r.element} />
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
