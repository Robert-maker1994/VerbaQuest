import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	Chip,
	CircularProgress,
	Grid2,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import type { CrosswordDetailsResponse } from "@verbaquest/shared";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "../../context/api/api";
import backendEndpoints from "../../context/api/api";
import {
	CheckCircleOutline,
	RadioButtonUncheckedOutlined,
} from "@mui/icons-material";
import { useTranslation } from "../../context/translationProvider";

const crosswordMatchesSearchTerm = async (searchLowerCase: string) => {
	if (searchLowerCase === "") return [];

	return await backendEndpoints.getCrosswordDetails(searchLowerCase);
};

const CrosswordPage: React.FC = () => {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const {translate} = useTranslation();
	const [crosswordData, setCrosswordData] = useState<
		CrosswordDetailsResponse[]
	>([]);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const nav = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				setError(null);
				const data = await api.getCrosswordDetails();
				setCrosswordData(data);
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError("An unexpected error occurred");
				}
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const handleChange = useCallback(async (string: string) => {
		const searchLowerCase = string.toLowerCase();
		setTimeout(async () => {
			const matches = await crosswordMatchesSearchTerm(searchLowerCase);
			if (matches.length) {
				setCrosswordData(matches);
			}
		}, 1);
	}, []);

	return (
		<Box sx={{ p: 2 }}>
			{loading ? (
				<Box sx={{ display: "flex", justifyContent: "center" }}>
					<CircularProgress />
				</Box>
			) : error ? (
				<Typography color="error">{error}</Typography>
			) : (
				<Box>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-evenly",
							alignItems: "center",
							marginBottom: 2,
						}}
					>
						<Typography variant="h4">{translate("crosswords")}</Typography>
						<TextField
							label={translate("search_crosswords")}
							type="search"
							variant="outlined"
							value={searchTerm}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								handleChange(e.target.value);
								setSearchTerm(e.target.value);
							}}
							sx={{ marginBottom: 2 }}
						/>
					</Box>
					<Grid2 container spacing={2} justifyContent={"center"}>
						{crosswordData.map((crossword) => {
							return (
								<Grid2 size={5} key={crossword.crossword_id}>
									<Card>
										<CardContent>
											<Typography variant="h6" component="div">
												{crossword.title}
											</Typography>
											<Box sx={{ display: "flex", alignItems: "center", mt: 1, }}>
												<Typography variant="body1">
												{translate("status:")}
												</Typography>
												<Box sx={{ ml: 1 }}>
													{crossword.userCrosswords[0]?.completed ? (
														<Tooltip title="Completed">
															<CheckCircleOutline color="success" />
														</Tooltip>
													) : (
														<Tooltip title="Not Attempted">
															<RadioButtonUncheckedOutlined color="info" />
														</Tooltip>
													)}
												</Box>
											</Box>
											<Box sx={{ display: "flex", flexWrap: "wrap", mt: 1, alignItems: "center" }}>
												<Typography variant="body1" component="div">
												{translate("topics:")}
												</Typography>
												{crossword.topics.map((topic) => (
													<Chip
														color="primary"
														variant="outlined"
														key={topic.topic_id}
														label={topic.topic_name}
														sx={{ m: 0.5 }}
													/>
												))}
											</Box>
											<Box sx={{ display: "flex", flexWrap: "wrap", mt: 1, alignItems: "center" }}>

												<Typography variant="body1" component="div" >
												{translate("difficulty:")}
												</Typography>
												<Chip
													color="primary"
													variant="outlined"
													label={crossword.difficulty.toUpperCase()}
													sx={{ m: 0.5 }}
												/>
											</Box>
										</CardContent>
										<CardActions>
											<Button
												onClick={() => {
													nav(
														`/crossword/${crossword.crossword_id}`,
													);
												}}
												variant="contained"
												disableElevation
												color="primary"
											>
												Play
											</Button>
										</CardActions>
									</Card>
								</Grid2>
							);
						})}
					</Grid2>
				</Box>
			)}
		</Box>
	);
};

export default CrosswordPage;
