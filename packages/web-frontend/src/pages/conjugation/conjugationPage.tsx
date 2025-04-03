import { Box, Button, CircularProgress, List, ListItemButton, ListItemText, Typography } from "@mui/material";
import type { Conjugation } from "@verbaquest/types";
import type React from "react";
import { useEffect, useState } from "react";
import HoverBox from "../../components/hoverBox";
import backendEndpoints from "../../context/api/api";
import ConjugationGame from "./components/conjugationGame";
import ConjugationTable from "./components/conjugationTable";
import VerbSearch from "./components/verbSearch";

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

const tenses: Tense[] = [
  { tense: "Presente", mood: "indicativo" },
  { tense: "Presente", mood: "subjuntivo" },
  { tense: "Pretérito indefinido", mood: "indicativo" },
  { tense: "Present simple", mood: "indicative" },
  { tense: "Past simple", mood: "indicative" },
];

const forms = ["yo", "tú", "él/ella/usted", "nosotros/nosotras", "vosotros/vosotras", "ellos/ellas/ustedes"];

function VerbConjugationsPage() {
  const [verbs, setVerbs] = useState<VerbData[]>([]);
  const [selectedVerb, setSelectedVerb] = useState<VerbData | null>(null);
  const [conjugations, setConjugations] = useState<Conjugation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState("");
  const [gameMode, setGameMode] = useState<boolean>(false);
  const [currentRound, setCurrentRound] = useState<{ tense: Tense; form: string } | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const fetchVerbs = async () => {
      setLoading(true);
      try {
        const data = await backendEndpoints.allVerbs();
        setVerbs(data);
      } catch (error) {
        console.error("Error fetching verbs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVerbs();
  }, []);

  useEffect(() => {
    const fetchConjugations = async () => {
      if (selectedVerb) {
        setLoading(true);
        try {
          const data = await backendEndpoints.getVerbConjugation(selectedVerb.verb_id);
          setConjugations(data);
        } catch (error) {
          console.error("Error fetching conjugations:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchConjugations();
  }, [selectedVerb]);

  const handleVerbChange = async (event: string) => {
    const verb = verbs.find((v) => v.word.word_text === event);
    setInputValue(event);
    try {
      if (!verb) return;
      setSelectedVerb(verb);
    } catch (error) {
      console.error("Error fetching conjugations:", error);
    }
  };

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
    <Box sx={{ fontFamily: "sans-serif", padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Verb Conjugations
      </Typography>

      <VerbSearch verbs={verbs} inputValue={inputValue} onInputChange={handleVerbChange} selectedVerb={selectedVerb} />

      {loading && <CircularProgress />}

      {!selectedVerb && !loading && (
        <HoverBox>
          <List>
            {verbs.map((verb) => (
              <ListItemButton onClick={() => handleVerbChange(verb.word.word_text)} key={verb.verb_id}>
                <ListItemText primary={verb.word.word_text} />
                <ListItemText color={verb.irregular ? "error" : "success"}>
                  {verb.irregular ? "Irregular" : "Regular"}
                </ListItemText>
              </ListItemButton>
            ))}
          </List>
        </HoverBox>
      )}

      {selectedVerb && !loading && !gameMode && (
        <ConjugationTable
          conjugations={conjugations}
          selectedVerb={selectedVerb}
          tenses={tenses}
          toolBar={
            <Button variant="contained" onClick={handleStartGame}>
              Play Game
            </Button>
          }
        />
      )}
      {gameMode && selectedVerb && currentRound && (
        <ConjugationGame
          selectedVerb={selectedVerb}
          conjugations={conjugations}
          score={score}
          currentRound={currentRound}
          userAnswer={userAnswer}
          isCorrect={isCorrect}
          handleAnswerChange={handleAnswerChange}
          checkAnswer={checkAnswer}
          handleNextRound={handleNextRound}
        />
      )}
    </Box>
  );
}

export default VerbConjugationsPage;
