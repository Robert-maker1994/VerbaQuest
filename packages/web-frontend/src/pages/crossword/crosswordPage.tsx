import {
	CheckCircleOutline,
	RadioButtonUncheckedOutlined,
	Star,
	StarBorder,
} from "@mui/icons-material";
import EditOutlined from "@mui/icons-material/EditOutlined";
import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	Chip,
	CircularProgress,
	Container,
	Grid2,
	IconButton,
	Pagination,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import HoverBox from "../../components/hoverBox";
import api from "../../context/api/api";
import backendEndpoints from "../../context/api/api";
import { useTranslation } from "../../context/translationProvider";

export interface CrosswordDetailsResponse {
	crosswords: CrosswordDetails[];
	totalCount: number;
	currentPage: number;
	pageSize: number;
	totalPages: number;
}

export interface CrosswordDetails {
	title: string;
	crossword_id: number;
	is_Public: boolean;
	difficulty: string;
	topics: {
		topic_name: string;
		topic_id: number;
		language: {
			language_code: string;
		};
	}[];
	userCrosswords: {
		completed: boolean;
		completion_timer: number;
		user_crossword_id: number;
		is_favorite: boolean;
	}[];
}

const crosswordMatchesSearchTerm = async (searchLowerCase: string) => {
	if (searchLowerCase === "") return [];

	return await backendEndpoints.getCrosswordDetails(undefined, searchLowerCase);
};

function CrosswordIcon({ isCompleted }: { isCompleted: boolean | undefined }) {
	if (isCompleted === undefined) {
		return (
			<Tooltip title="Not Attempted">
				<RadioButtonUncheckedOutlined color="info" />
			</Tooltip>
		);
	}
	return isCompleted ? (
		<Tooltip title="Completed">
			<CheckCircleOutline color="success" />
		</Tooltip>
	) : (
		<Tooltip title="Not completed">
			<EditOutlined color="error" />
		</Tooltip>
	);
}
function FavoriteIcon({
	isFavorite,
	onToggleFavorite,
}: {
	isFavorite: boolean | undefined;
	onToggleFavorite: () => void;
}) {
	return (
		<IconButton onClick={onToggleFavorite} size="small">
			{isFavorite ? <Star color="warning" /> : <StarBorder color="action" />}
		</IconButton>
	);
}

const CrosswordPage = () => {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const { translate } = useTranslation();
	const [crosswordData, setCrosswordData] =
		useState<CrosswordDetailsResponse>();
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

	const handlePaginationChange = useCallback(async (page: number) => {
		setTimeout(async () => {
			const response = await api.getCrosswordDetails(page, undefined);

			if (response) {
				setCrosswordData(response);
			}
		}, 1);
	}, []);

	const handleToggleFavorite = useCallback(
		async (crosswordId: number, isFavorite: boolean) => {
			try {
				await backendEndpoints.update(crosswordId, !isFavorite);
				setCrosswordData((prevData) => {
					if (!prevData) return prevData;
					return {
						...prevData,
						crosswords: prevData.crosswords.map((crossword) => {
							if (crossword.crossword_id === crosswordId) {
								const handleNewFav = !crossword.userCrosswords.length;
								if (handleNewFav) {
									console.log("handleNewFav");

									return {
										...crossword,
										userCrosswords: [
											{
												user_crossword_id: Math.random(),
												is_favorite: true,
												completed: false,
												completion_timer: 0,
											},
										],
									};
								}
								return {
									...crossword,
									userCrosswords: crossword.userCrosswords.map(
										(userCrossword) => {
											console.log("helloddd");
											return {
												...userCrossword,
												is_favorite: !isFavorite,
											};
										},
									),
								};
							}
							return crossword;
						}),
					};
				});
			} catch (error) {
				console.error("Error toggling favorite:", error);
			}
		},
		[],
	);
	return (
		<Container maxWidth="md">
			{loading ? (
				<Box sx={{ display: "flex", justifyContent: "center" }}>
					<CircularProgress />
				</Box>
			) : error ? (
				<Typography color="error">{error}</Typography>
			) : (
				<Box fontWeight={"bold"} mb={4}>
					<Grid2 container spacing={2} justifyContent={"center"}>
						<Grid2 size={12}>
							<HoverBox
								m={5}
								maxWidth={"100%"}
								display={"flex"}
								alignItems={"center"}
								justifyContent={"space-between"}
								flexDirection={"row"}
							>
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
								<Box alignItems={"center"}>
									<Button
										onClick={() => {
											const crossword =
												crosswordData?.crosswords[
													Math.floor(
														Math.random() * crosswordData.crosswords.length,
													)
												];
											if (crossword === undefined) return;

											nav(`/crossword/${crossword?.crossword_id}`);
										}}
										variant="contained"
										disableElevation
										color="primary"
									>
										Random Crossword
									</Button>
								</Box>
							</HoverBox>
						</Grid2>
						<Box alignItems={"center"} flex={"flex"}>
							<Pagination
								onChange={(_: React.ChangeEvent<unknown>, page: number) => {
									handlePaginationChange(page);
								}}
								count={crosswordData?.totalPages || 0}
								page={crosswordData?.currentPage || 0}
							/>
						</Box>
						<Grid2 size={12}>
							<Grid2 container spacing={2} justifyContent={"center"}>
								{crosswordData?.crosswords?.map((crossword) => {
									if (crossword.crossword_id === 19) {
										console.log(
											"hello",
											crossword.userCrosswords[0]?.is_favorite,
										);
									}
									return (
										<Grid2
											size={4}
											height={"100%"}
											key={crossword.crossword_id}
										>
											<Card>
												<CardContent>
													<Box
														sx={{
															display: "flex",
															justifyContent: "space-between",
															alignItems: "center",
														}}
													>
														<Typography variant="h6" component="div">
															{crossword.title}
														</Typography>
														<FavoriteIcon
															isFavorite={
																crossword.userCrosswords[0]?.is_favorite
															}
															onToggleFavorite={() => {
																handleToggleFavorite(
																	crossword.crossword_id,
																	crossword.userCrosswords[0]?.is_favorite,
																);
															}}
														/>
													</Box>

													<Box
														sx={{
															display: "flex",
															alignItems: "center",
															mt: 1,
														}}
													>
														<Typography variant="body1">
															{translate("status:")}
														</Typography>

														<CrosswordIcon
															isCompleted={
																crossword.userCrosswords[0]?.completed
															}
														/>
													</Box>
													<Box
														sx={{
															display: "flex",
															flexWrap: "wrap",
															mt: 1,
															alignItems: "center",
														}}
													>
														<Typography variant="body1" component="div">
															{translate("topics:")}
														</Typography>
														{crossword.topics.map((topic) => (
															<Chip
																color="primary"
																variant="outlined"
																size="small"
																key={topic.topic_id}
																label={topic.topic_name}
																sx={{ m: 0.5 }}
															/>
														))}
													</Box>
													<Box
														sx={{
															display: "flex",
															flexWrap: "wrap",
															mt: 1,
															alignItems: "center",
														}}
													>
														<Typography variant="body1" component="div">
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
															nav(`/crossword/${crossword.crossword_id}`);
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
						</Grid2>
					</Grid2>
				</Box>
			)}
		</Container>
	);
};

export default CrosswordPage;
