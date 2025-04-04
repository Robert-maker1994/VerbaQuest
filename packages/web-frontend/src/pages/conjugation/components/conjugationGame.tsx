import { CancelOutlined, CheckCircleOutline } from "@mui/icons-material";
import { Box, Button, Grid2, Icon, TextField, Typography } from "@mui/material";
import type { Conjugation } from "@verbaquest/types";
import type React from "react";
import HoverBox from "../../../components/hoverBox";
import { useState } from "react";

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
// Component not in use
//  Handle the conjugation Game with the url params, we need to be able to post a verb is in or a verbgroup. 
const ConjugationGame: React.FC<ConjugationGameProps> = () => {
  const [gameMode, setGameMode] = useState<boolean>(false);
  const [currentRound, setCurrentRound] = useState<{ tense: Tense; form: string } | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);
  const [conjugations, setConjugations] = useState<Conjugation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  

  const getConjugation = (tense: string, mood: string, form: string): string | undefined => {
    const conjugation = conjugations.find(
      (c) => c.tense.tense === tense && c.tense.mood === mood && c.form.form === form,
    );
    return conjugation?.conjugation;
  };
  const handleStartGame = () => {
    setGameMode(true);
    setScore(0);
    setIsCorrect(null);
    startNewRound();
  };

  const startNewRound = () => {
    const randomTense = tenses[Math.floor(Math.random() * tenses.length)];
    const randomForm = forms[Math.floor(Math.random() * forms.length)];
    setCurrentRound({ tense: randomTense, form: randomForm });
    setUserAnswer("");
    setIsCorrect(null);
  };

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswer(event.target.value);
  };

  const checkAnswer = () => {
    if (!currentRound || !selectedVerb) return;
    const correctAnswer = getConjugation(
      currentRound.tense.tense.toLowerCase(),
      currentRound.tense.mood.toLowerCase(),
      currentRound.form,
    );
    if (correctAnswer === undefined) {
      setIsCorrect(false);
      return;
    }
    const isUserCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
    setIsCorrect(isUserCorrect);
    if (isUserCorrect) {
      setScore(score + 1);
    }
  };

  const handleNextRound = () => {
    startNewRound();
  };
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
