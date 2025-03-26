import { AccessTime } from "@mui/icons-material";
import { Box, CircularProgress, Container, Typography, Divider, List, ListItem, Chip, Button } from "@mui/material";
import { formatRelative } from "date-fns";
import { es, fr, enUS } from "date-fns/locale";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import backendEndpoints from "../../../context/api/api";
import { useAuth } from "../../../context/auth";
import { useTranslation } from "../../../context/translationProvider";
import { CrosswordIcon } from "../../crossword/components/crosswordIcon";

function LatestCrosswords() {
	const [userCrosswords, setUserCrosswords] = useState<GetUserCrosswords[] | null>(null);
	const { translate } = useTranslation();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const nav = useNavigate();
	const { user } = useAuth(); // Replace with your auth hook

	const getLocale = () => {
		switch (user?.app_language) {
			case 'ES':
				return es;
			case 'FR':
				return fr;
			default:
				return enUS;
		}
	};

	const formatDate = (date: Date) => {
		return formatRelative(date, new Date(), {
			locale: getLocale(),
		});
	};

	useEffect(() => {
		const fetchUserCrosswords = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const data = await backendEndpoints.getUserCrosswords(); 
				setUserCrosswords(data);
			} catch (err) {
				setError('Failed to load user crosswords.');
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserCrosswords();
	}, []);

	if (isLoading) {
		return (
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
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
						{translate('dashboard')}
					</Typography>
					<Typography color="error" variant="body1">
						{error}
					</Typography>
				</Box>
			</Container>
		);
	}

	return (
		<Box sx={{ width: '100%', overflow: 'auto', bgcolor: 'primary' }}>
			<Typography variant="body1" gutterBottom>
				{translate('here_are_the crosswords_you_have_previously_attempted:')}
			</Typography>
			<Divider />
			{userCrosswords && userCrosswords.length > 0 ? (
				<List>
					{userCrosswords.map((item) => (
						<ListItem
							key={item.crossword.crossword_id}
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'flex-start',
								padding: '16px',
								borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
							}}>
							<Typography variant="h6" sx={{ marginBottom: '8px' }}>
								{item.crossword.title}
							</Typography>
							<Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
								{item.crossword.topics.map((topic) => (
									<Chip
										color="primary"
										variant="outlined"
										key={topic.topic_id}
										label={topic.topic_name}
										size="small"
										sx={{ marginRight: '8px' }}
									/>
								))}
							</Box>
							<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
								<Box sx={{ display: 'flex', alignItems: 'center' }}>
									<AccessTime sx={{ marginRight: '4px' }} />
									<Typography variant="caption">
										{formatDate(item.last_attempted)}
									</Typography>
								</Box>
								<CrosswordIcon isCompleted={item.completed} />
							</Box>
							<Box sx={{ marginTop: '16px', alignSelf: 'flex-end' }}>
								<Button
									variant="contained"
									size="small"
									onClick={(e) => {
										e.preventDefault();
										nav(`/crossword/${item.crossword.crossword_id}`);
									}}
								>
									{translate('try_it_again')}
								</Button>
							</Box>
						</ListItem>
					))}
				</List>
			) : (
				<Typography variant="body1" gutterBottom>
					{translate('not_attempted_crosswords')}
				</Typography>
			)}
		</Box>
	);
}

export default LatestCrosswords;