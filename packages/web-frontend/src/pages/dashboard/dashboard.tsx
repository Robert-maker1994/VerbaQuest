import { Box, Container, Typography } from "@mui/material";

export default function Dashboard() {
	return (
		<Container maxWidth="md">
			<Box sx={{ my: 4 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					Dashboard
				</Typography>
				<Typography variant="body1">
					Welcome to your dashboard! Here you can see your progress, access your
					courses, and manage your learning journey.
				</Typography>
				<Typography variant="body1">
					This section is currently under development. Stay tuned for updates!
				</Typography>
			</Box>
		</Container>
	);
}
