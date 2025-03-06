import { Box, Container, Typography } from "@mui/material";

export default function VerbConjugation() {
    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Verb Conjugation
                </Typography>
                <Typography variant="body1">
                    Welcome to the Verb Conjugation section! This is where you'll be able to study and practice verb conjugation.
                    We're working hard to bring you a comprehensive tool that will help you master verb tenses and forms.
                </Typography>
                <Typography variant="body1">
                    Stay tuned for updates as we add more features and content to this section.
                </Typography>
            </Box>
        </Container>
    );
}
