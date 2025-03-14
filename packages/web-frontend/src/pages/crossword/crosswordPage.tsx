import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    CircularProgress,
    Grid2,
    Typography,
    TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import type { CrosswordDetails } from "@verbaquest/shared";
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "../../context/api/api";


const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
    padding: theme.spacing(1, 3),
    "&:hover": {
        backgroundColor: theme.palette.primary.dark,
    },
}));

const CrosswordPage: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [crosswordData, setCrosswordData] = useState<CrosswordDetails[]>([]);
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

    const handleCrosswordOfTheDay = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.getCrosswordOfTheDay();
            nav(`/crossword/${data.id}`)
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    }

    const filteredCrosswords = crosswordData.filter((crossword) => {
        const titleMatch = crossword.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const topicMatch = crossword.topics.some((topic) =>
            topic.topic_name.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        return titleMatch || topicMatch;
    });
    return (
        <Box sx={{ p: 2 }}>
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <Box>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 2,
                        }}
                    >
                        <TextField

                            label="Search by Title or Topic"
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ marginBottom: 2 }}

                        />
                        <StyledButton onClick={handleCrosswordOfTheDay}>
                            View crossword of the day
                        </StyledButton>
                        <StyledButton onClick={() => {
                            console.log("hello")
                        }}>
                            Create you're own crossword
                        </StyledButton>
                    </Box>
                    <Grid2 container spacing={2} justifyContent={"center"}>
                        {filteredCrosswords.map((crossword) => (
                            <Grid2 size={5} key={crossword.crossword_id}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            {crossword.title}
                                        </Typography>

                                        <Box sx={{ mt: 1, display: "flex", justifyContent: "left", alignItems: "center" }}>
                                            <Typography variant="body1" component="div">
                                                Topics:
                                            </Typography>
                                            {crossword.topics.map((topic) => (
                                                <Chip
                                                    color="primary"
                                                    variant="outlined"
                                                    key={topic.topic_id}
                                                    label={topic.topic_name}
                                                    sx={{ m: 1 }}
                                                />
                                            ))}
                                        </Box>
                                        <Box sx={{ mt: 1, display: "flex", justifyContent: "left", alignItems: "center" }}>
                                            <Typography variant="body1" component="div">
                                                Difficulty
                                            </Typography>
                                            <Chip
                                                color="primary"
                                                variant="outlined"

                                                label={"A1"}
                                                sx={{
                                                    m: 1

                                                }}
                                            />
                                        </Box>
                                    </CardContent>
                                    <CardActions>
                                        <Button onClick={() => {
                                            nav(`/crossword/${crossword.crossword_id}`)
                                        }} variant="contained" disableElevation color="primary">
                                            Play
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid2>
                        ))}
                    </Grid2>
                </Box>
            )
            }
        </Box >
    );
};

export default CrosswordPage;
