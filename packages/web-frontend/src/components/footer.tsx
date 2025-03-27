import React from "react";
import { Box, Typography, Link, Container, Grid2 } from "@mui/material";
import { styled } from "@mui/material/styles";

const FooterContainer = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.primary.light,
    padding: theme.spacing(4, 0),
    marginTop: theme.spacing(8),
    width: "100%",
}));

const FooterLink = styled(Link)(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    marginRight: theme.spacing(2),
    textDecoration: "none",
    "&:hover": {
        textDecoration: "underline",
    },
}));

const Footer: React.FC = () => {
    return (
        <FooterContainer >
            <Container maxWidth="lg">
                <Grid2 container spacing={3} justifyContent="space-between">
                    <Grid2 size={12}>
                        <Typography color="primary.contrastText" variant="h6" gutterBottom>
                            VerbaQuest
                        </Typography>
                        <Typography color="primary.contrastText" variant="body2">
                            Your journey to mastering new languages starts here.
                        </Typography>
                    </Grid2>
                    <Grid2 size={6}>
                        <Typography variant="h6" color="primary.contrastText" gutterBottom>
                            Explore
                        </Typography>
                        <Box>
                            <FooterLink href="/crossword">Crossword</FooterLink>
                            <FooterLink href="/wordle">Wordle</FooterLink>
                        </Box>
                    </Grid2>
                    <Grid2 size={6} >
                        <Typography color="primary.contrastText" variant="h6" gutterBottom>
                            Legal
                        </Typography>
                        <Box>
                            <FooterLink href="/privacy">Privacy Policy</FooterLink>
                            <FooterLink href="/terms">Terms of Service</FooterLink>
                        </Box>
                    </Grid2>
                </Grid2>
                <Box mt={4} textAlign="center">
                    <Typography color="primary.contrastText" variant="body2">
                        &copy; {new Date().getFullYear()} VerbaQuest. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </FooterContainer>
    );
};

export default Footer;
