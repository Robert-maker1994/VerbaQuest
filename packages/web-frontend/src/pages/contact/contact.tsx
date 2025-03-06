import { Box, Container, Typography } from "@mui/material";

export default function Contact() {
    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Contact Us
                </Typography>
                <Typography variant="body1">
                    Welcome to Verbaquest! We're excited to have you here. This project is a monorepo, which means it's a single repository that contains multiple related projects.
                    Here's a little breakdown of what that means for us:
                </Typography>
                <Typography variant="body1">
                    <b>Packages:</b> Our code is organized into separate packages, each with its own specific purpose. This helps us keep things neat, organized, and easy to manage.
                </Typography>
                <Typography variant="body1" >
                    <b>Web-Frontend:</b> This package is where you'll find the code for our website's user interface. It's built with React and Material UI, providing a smooth and interactive experience.
                </Typography>
                <Typography variant="body1" >
                    <b>API:</b> The API package handles all the backend logic. It's built with Node.js and Express, and it's responsible for managing data, handling requests, and keeping everything running smoothly behind the scenes.
                </Typography>
                <Typography variant="body1">
                    If you have any questions, feedback, or just want to say hello, feel free to reach out to us!
                </Typography>
                <Typography variant="body1">
                    You can contact us at: <a href="mailto:verbaquest@example.com">verbaquest@example.com</a>
                </Typography>
            </Box>
        </Container>
    );
}
