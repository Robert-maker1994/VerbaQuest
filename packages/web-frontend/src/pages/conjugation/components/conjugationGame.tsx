import { CancelOutlined, CheckCircleOutline } from "@mui/icons-material";
import { Box, Button, Grid2, Icon, TextField, Typography } from "@mui/material";
import type { Conjugation } from "@verbaquest/types";
import type React from "react";
import HoverBox from "../../../components/hoverBox";

interface Tense {
  tense: string;
  mood: string;
}

interface VerbData {
  verb_id: number;
  word: {
    word_id: number;
    word_text: string;
  };
  irregular: boolean;
  language: {
    language_code: string;
  };
}

interface ConjugationGameProps {
  selectedVerb: VerbData | null;
  conjugations: Conjugation[];
  score: number;
  currentRound: { tense: Tense; form: string } | null;
  userAnswer: string;
  isCorrect: boolean | null;
  handleAnswerChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checkAnswer: () => void;
  handleNextRound: () => void;
}

const ConjugationGame: React.FC<ConjugationGameProps> = ({
  selectedVerb,
  score,
  currentRound,
  userAnswer,
  isCorrect,
  handleAnswerChange,
  checkAnswer,
  handleNextRound,
}) => {
  return (
    <HoverBox sx={{ mt: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Conjugate: {selectedVerb?.word.word_text}
      </Typography>

      <Grid2 container spacing={2} alignItems="center">
        <Grid2 size={6}>
          <Typography variant="subtitle1">Pronoun:</Typography>
          <Typography variant="body1">{currentRound?.form}</Typography>
        </Grid2>
        <Grid2 size={6}>
          <Typography variant="subtitle1">Tense:</Typography>
          <Typography variant="body1">
            {currentRound?.tense.tense} ({currentRound?.tense.mood})
          </Typography>
        </Grid2>
      </Grid2>

      <Typography variant="h6" component="h3" gutterBottom sx={{ marginTop: 2 }}>
        Score: {score}
      </Typography>

      <TextField
        label="Enter Conjugation"
        variant="outlined"
        fullWidth
        value={userAnswer}
        onChange={handleAnswerChange}
        sx={{ marginTop: 2 }}
      />

      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <Button variant="contained" onClick={checkAnswer} sx={{ marginRight: 1 }}>
          Check
        </Button>
        {isCorrect !== null && (
          <Button variant="contained" onClick={handleNextRound}>
            Next Round
          </Button>
        )}
      </Box>

      {isCorrect !== null && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 2 }}>
          <Typography variant="h6" component="h3" sx={{ marginRight: 1 }}>
            {isCorrect ? "Correct!" : "Incorrect!"}
          </Typography>
          <Icon color={isCorrect ? "success" : "error"}>{isCorrect ? <CheckCircleOutline /> : <CancelOutlined />}</Icon>
        </Box>
      )}
    </HoverBox>
  );
};

export default ConjugationGame;
