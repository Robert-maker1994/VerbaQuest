import { AccessTime } from "@mui/icons-material";
import { Box, Button, Chip, List, ListItem, Typography } from "@mui/material";
import type { GetUserCrosswords } from "@verbaquest/shared";
import { formatRelative } from "date-fns";
import { enGB, es, fr } from "date-fns/locale";
import { useNavigate } from "react-router";
import { useAuth } from "../../../context/auth";
import { useTranslation } from "../../../context/translationProvider";
import { CrosswordIcon } from "../../crossword/components/crosswordIcon";

interface CrosswordListProps {
	crosswords: GetUserCrosswords[];
	emptyMessage: string;
}

const CrosswordList: React.FC<CrosswordListProps> = ({
	crosswords,
	emptyMessage,
}) => {
	const { translate } = useTranslation();
	const nav = useNavigate();
	const { user } = useAuth();

	const getLocale = () => {
		switch (user?.app_language) {
			case "ES":
				return es;
			case "FR":
				return fr;
			default:
				return enGB;
		}
	};

	const formatDate = (date: Date) => {
		const relativeDate = formatRelative(date, new Date(), {
			locale: getLocale(),
		});
		return relativeDate.slice(0)[0].toLocaleUpperCase() + relativeDate.slice(1);
	};

	return crosswords.length > 0 ? (
		<List>
			{crosswords.map((item) => (
				<ListItem
					key={item.user_crossword_id}
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-start",
						borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
					}}
				>
					<Typography variant="h6" sx={{ marginBottom: "8px" }}>
						{item.crossword.title}
					</Typography>
					<Box
						sx={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
					>
						{item.crossword.topics.map((topic) => (
							<Chip
								color="primary"
								variant="outlined"
								key={topic.topic_id}
								label={topic.topic_name}
								size="small"
								sx={{ marginRight: "8px" }}
							/>
						))}
					</Box>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							width: "100%",
						}}
					>
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<AccessTime sx={{ marginRight: "4px" }} />
							<Typography variant="caption">
								{formatDate(item.last_attempted)}
							</Typography>
						</Box>
						<CrosswordIcon isCompleted={item.completed} />
					</Box>
					<Box sx={{ marginTop: "16px", alignSelf: "flex-end" }}>
						<Button
							variant="contained"
							size="small"
							onClick={(e) => {
								e.preventDefault();
								nav(`/crossword/${item.crossword.crossword_id}`);
							}}
						>
							{translate("try_it_again")}
						</Button>
					</Box>
				</ListItem>
			))}
		</List>
	) : (
		<Typography gutterBottom>{emptyMessage}</Typography>
	);
};

export default CrosswordList;
