import {
	Box,
	Container,
	Typography,
	List,
	ListItem,
	ListItemText,
	ListItemIcon,
	Chip,
	Divider,
	CircularProgress,
	ListItemButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import backendEndpoints from "../../context/api/api";
import { AccessTime, CheckCircleOutline } from "@mui/icons-material";
import { useNavigate } from "react-router";
import type { GetUserCrosswords } from "@verbaquest/shared";


export default function Dashboard() {
	const [userCrosswords, setUserCrosswords] = useState<
	GetUserCrosswords[] | null
	>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const nav = useNavigate();

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

	const formatTime = (timeInSeconds: number) => {
		const minutes = Math.floor(timeInSeconds / 60);
		const remainingSeconds = timeInSeconds % 60;
		return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
			.toString()
			.padStart(2, "0")}`;
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
						Dashboard
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
					Dashboard
				</Typography>
				<Typography variant="body1" gutterBottom>
					Here are the crosswords you've completed:
				</Typography>

				{userCrosswords && userCrosswords.length > 0 ? (
					<List>
						{userCrosswords.map((item, index) => (
							<Box key={`${item.crossword.crossword_id}-${index}`}>
								<ListItem alignItems="flex-start">
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
													{formatTime(item.completion_timer)}
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
									<ListItemButton onClick={(e) => {
										e.preventDefault();
										nav(`/crossword/${item.crossword.crossword_id}`);
									}}>
										Try it again!
									</ListItemButton>
								</ListItem>
								{index < userCrosswords.length - 1 && <Divider />}
							</Box>
						))}
					</List>
				) : (
					<Typography variant="body1">
						You haven't completed any crosswords yet.
					</Typography>
				)}
			</Box>
		</Container>
	);
}
