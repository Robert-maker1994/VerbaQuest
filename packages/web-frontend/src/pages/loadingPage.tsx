import { Box, CircularProgress, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import type React from "react";

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh", // Full viewport height
  width: "100vw", // Full viewport width
  backgroundColor: theme.palette.background.default, // Use the theme's background color
}));

const LoadingPage: React.FC = () => {
  return (
    <LoadingContainer>
      <CircularProgress size={80} thickness={4} />
      <Box mt={2}>
        <Typography variant="h6" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    </LoadingContainer>
  );
};

export default LoadingPage;
