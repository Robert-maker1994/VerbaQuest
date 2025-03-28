import { Container, Grid2, Typography } from "@mui/material";

import HoverBox from "../../components/hoverBox";
import { useTranslation } from "../../context/translationProvider";
import DashboardContent from "./components/dashboardCrossword";
import WordleContainer from "./components/wordleContanter";

export default function Dashboard() {
	const { translate } = useTranslation();

	return (
		<Container maxWidth="md">
			<Grid2 container spacing={2}>
				<Grid2 size={12}>
					<HoverBox margin={4}>
						<Typography variant="h4" component="h1" gutterBottom>
							{translate("dashboard")}
						</Typography>
					</HoverBox>
				</Grid2>
				<Grid2 size={6}>
					<HoverBox>
						<DashboardContent />
					</HoverBox>
				</Grid2>
				<Grid2 size={6}>
					<HoverBox>
						<Typography variant="h4" component="h4" gutterBottom>
							Wordle of the day
						</Typography>
						<WordleContainer />
					</HoverBox>
				</Grid2>
			</Grid2>
		</Container>
	);
}
