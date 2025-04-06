import {
  Box,
  Button,
  Grid2,
  TextField,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import type React from "react";
import HoverBox from "../../../components/hoverBox";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import backendEndpoints from "../../../context/api/api";

import type { ApiConjugation, ApiForm, ApiTense, ApiVerb } from "./conjugationTable";

const VerbGame: React.FC = () => {
  const { id } = useParams();
  const [selectedVerb, setSelectedVerb] = useState<ApiVerb | null>(null);
  const [conjugations, setConjugations] = useState<ApiConjugation[]>([]);
  const [tenses, setTenses] = useState<ApiTense[]>([]);
  const [forms, setForms] = useState<ApiForm[]>([]);
  const [currentRound, setCurrentRound] = useState<{ tense: ApiTense; form: ApiForm } | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<{
    answer: string;
    state: boolean | null;
  }>({
    answer: "",
    state: null,
  });
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const fetchVerb = async () => {
      if (id) {
        try {
          const data = await backendEndpoints.getVerbConjugation(Number(id));
          setSelectedVerb(data.verb);
          const matchTense = data?.tenses?.map((t) => {
            const match = data.conjugation.find((tense) => tense.tense.tense_id === t.tense_id);
            if (match) {
              return match.tense;
            }
            return undefined;
          }).filter((f) => f !== undefined);
          const matchForm = data?.forms?.map((t) => {
            const match = data.conjugation.find((tense) => tense.form.form_id === t.form_id);
            if (match) {
              return match.form;
            }
            return undefined;
          }).filter((f) => f !== undefined);
          setTenses(matchTense);
          setForms(matchForm);
          setConjugations(data.conjugation);
        } catch (error) {
          console.error("Error fetching verb:", error);
        }
      }
    };

    fetchVerb();
  }, [id]);

  const getConjugation = (tense: string, mood: string, form: string): string | undefined => {
    const conjugation = conjugations.find(
      (c) => c.tense.tense === tense && c.tense.mood === mood && c.form.form === form,
    );
    return conjugation?.conjugation;
  };

  const startNewRound = () => {
    const randomTense = tenses[Math.floor(Math.random() * tenses.length)];
    const randomForm = forms[Math.floor(Math.random() * forms.length)];
    setCurrentRound({ tense: randomTense, form: randomForm });
    setUserAnswer("");
    setIsCorrect({
      answer: "",
      state: null,
    });
  };

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswer(event.target.value);
  };

  const checkAnswer = () => {
    if (!currentRound || !selectedVerb) return;
    const correctAnswer = getConjugation(
      currentRound.tense.tense.toLowerCase(),
      currentRound.tense.mood.toLowerCase(),
      currentRound.form.form,
    );

    if (correctAnswer === undefined) {
      setIsCorrect({
        answer: "",
        state: null,
      });
      return;
    }
    const isUserCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
    setIsCorrect({
      answer: correctAnswer,
      state: isUserCorrect,
    });
    if (isUserCorrect) {
      setScore(score + 1);
    }
  };

  const handleNextRound = () => {
    startNewRound();
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (selectedVerb) {
      startNewRound();
    }
  }, [selectedVerb]);

  if (!selectedVerb) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <HoverBox sx={{ mt: 2, p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom color="primary">
        Conjugate: {selectedVerb.word.word_text}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid2 container spacing={3} justifyContent="center" alignItems="center">
        <Grid2 size={6}>
          <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6" color="primary">
              Pronoun
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {currentRound?.form.form}
            </Typography>
          </Paper>
        </Grid2>
        <Grid2 size={6}>
          <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6" color="primary">
              Tense
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {currentRound?.tense.tense} ({currentRound?.tense.mood})
            </Typography>
          </Paper>
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
        <Button variant="contained" disabled={!!isCorrect.state} onClick={checkAnswer} sx={{ marginRight: 1 }}>
          Check
        </Button>
        {isCorrect.state !== null && (
          <Button variant="contained" onClick={handleNextRound}>
            Next Round
          </Button>
        )}
      </Box>

      {isCorrect.state !== null && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 2 }}>
          <Typography variant="h6" component="h3" color={isCorrect.state ? "success" : "error"} sx={{ marginRight: 1 }}>
            {isCorrect.state ? "Correct!" : `Incorrect! The correct answer is: ${isCorrect.answer}`}
          </Typography>
        </Box>
      )}
    </HoverBox>
  );
};

export default VerbGame;
