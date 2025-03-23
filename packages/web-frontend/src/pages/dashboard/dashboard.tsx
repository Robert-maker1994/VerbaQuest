import { AccessTime, CheckCircleOutline } from "@mui/icons-material";
import {
	Box,
	Button,
	Chip,
	CircularProgress,
	Container,
	Divider,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Typography,
} from "@mui/material";
import type { GetUserCrosswords } from "@verbaquest/shared";
import { formatRelative } from "date-fns";
import { enUS, es, fr } from "date-fns/locale";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import backendEndpoints from "../../context/api/api";
import { useAuth } from "../../context/auth";
import { useTranslation } from "../../context/translationProvider";

export default function Dashboard() {
	const [userCrosswords, setUserCrosswords] = useState<
		GetUserCrosswords[] | null
	>(null);
	const { translate } = useTranslation();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const nav = useNavigate();
	const { user } = useAuth();

	const getLocale = () => {
		switch (user?.app_language) {
			case "ES":
				return es;
			case "FR":
				return fr;
			default:
				return enUS;
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const fetchUserCrosswords = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const data = await backendEndpoints.getUserCrosswords();
				setUserCrosswords(data);
			} catch (err) {
				setError("Failed to load user crosswords.");
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserCrosswords();
	}, []);

	const formatDate = (date: Date) => {
		return formatRelative(date, new Date(), {
			locale: getLocale(),
		});
	};

	if (isLoading) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Container maxWidth="md">
				<Box sx={{ my: 4 }}>
					<Typography variant="h4" component="h1" gutterBottom>
						{translate("dashboard")}
					</Typography>
					<Typography color="error" variant="body1">
						{error}
					</Typography>
				</Box>
			</Container>
		);
	}

	return (
		<Container maxWidth="md">
			<Box sx={{ my: 4 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					{translate("dashboard")}
				</Typography>
				<Typography variant="body1" gutterBottom>
					{translate("here_are_the crosswords_you_have_previously_attempted:")}
				</Typography>

				{userCrosswords && userCrosswords.length > 0 ? (
					<List>
						{userCrosswords.map((item, index) => (
							<Box key={item.crossword.crossword_id}>
								<ListItem alignItems="flex-start" disableGutters>
									<ListItemIcon>
										<CheckCircleOutline color="success" />
									</ListItemIcon>
									<ListItemText
										primary={item.crossword.title}
										secondary={
											<>
												<Typography
													sx={{ display: "inline" }}
													component="span"
													variant="body2"
													color="text.primary"
												>
													<AccessTime sx={{ marginRight: 0.5 }} />
													{formatDate(item.last_attempted)}
												</Typography>

												<Box sx={{ display: "flex", flexWrap: "wrap" }}>
													{item.crossword.topics.map((topic) => (
														<Chip
															key={topic.topic_id}
															label={topic.topic_name}
															size="small"
															sx={{ mr: 1, mt: 1 }}
														/>
													))}
												</Box>
											</>
										}
									/>
									<Button
										variant="contained"
										disableElevation
										color="primary"
										onClick={(e) => {
											e.preventDefault();
											nav(`/crossword/${item.crossword.crossword_id}`);
										}}
									>
										{translate("try_it_again")}
									</Button>
								</ListItem>
								{index < userCrosswords.length - 1 && <Divider />}
							</Box>
						))}
					</List>
				) : (
					<Typography variant="body1">
						{translate("not_attempted_crosswords")}
					</Typography>
				)}
			</Box>
		</Container>
	);
}
