import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const HoverBox = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
	borderRadius: "8px",
	padding: "24px",
	margin: "0 auto",
}));

export default HoverBox;
