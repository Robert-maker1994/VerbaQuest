import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  tableCellClasses,
} from "@mui/material";
import type React from "react";
import HoverBox from "../../../components/hoverBox";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import backendEndpoints from "../../../context/api/api";


export interface ApiVerb {
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

export interface ApiTense {
  tense_id: number;
  tense: string;
  mood: string;
}

export interface ApiForm {
  form: string;
  form_id: number;
}

export interface ApiTranslation {
  conjugationTranslationId: number;
  translation: string;
}

export interface ApiConjugation {
  id: number;
  conjugation: string;
  is_irregular: boolean;
  tense: ApiTense;
  translations: ApiTranslation[];
  form: ApiForm;
}

export interface ConjugationResponse {
  conjugation: ApiConjugation[];
  verb: ApiVerb;
  tenses: ApiTense[];
  forms: ApiForm[];
}

const ConjugationTable: React.FC = () => {
  const params = useParams();
  const [tenses, setTenses] = useState<ApiTense[]>([]);
  const [conjugations, setConjugations] = useState<ConjugationResponse | null>(null);



  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const fetchConjugations = async () => {
      if (params.id && !conjugations?.verb.verb_id) {
        try {
          const data = await backendEndpoints.getVerbConjugation(Number.parseInt(params.id));

          setConjugations(data);
          const matchTense = data?.tenses?.map((t) => {
            const match = data.conjugation.find((tense) => tense.tense.tense_id === t.tense_id)
            if (match) {
              return match.tense
            }
            return undefined;
          }).filter((f) => f !== undefined)

          setTenses(matchTense);

        } catch (error) {
          console.error("Error fetching conjugations:", error);
        }
      }
    };

    fetchConjugations();
  }, [params]);


  const getConjugation = (tense: string, mood: string, form: string): string | undefined => {
    return conjugations?.conjugation.find(
      (c) => c.tense.tense === tense && c.tense.mood === mood && c.form.form === form,
    )?.conjugation;
  };

  const getTranslations = (tense: string, mood: string, form: string): string[] => {
    return conjugations?.conjugation
      .find((c) => c.tense.tense === tense && c.tense.mood === mood && c.form.form === form)
      ?.translations.map((translation) => translation.translation) || [];
  };
  if (!conjugations) {
    return <Typography>Loading conjugations...</Typography>;
  }
  return (
    <Box>
      <HoverBox display={"flex"} justifyContent={"space-between"}>
        <Typography variant="h6" component="h2" gutterBottom>
          Conjugations for: {conjugations.verb?.word.word_text}
        </Typography>

        <Button variant="contained">
            Quiz {conjugations.verb?.word.word_text}
        </Button>

      </HoverBox>

      {tenses?.map((tense) => (
        <TableContainer
          key={tense.tense + tense.mood}
          component={HoverBox}
          sx={{
            marginTop: 2,
          }}
        >
           <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    [`&.${tableCellClasses.head}`]: {
                      backgroundColor: "primary.main",
                      color: "primary.contrastText",
                    },
                  }}
                >
                  Pronoun
                </TableCell>
                <TableCell
                  sx={{
                    [`&.${tableCellClasses.head}`]: {
                      backgroundColor: "primary.main",
                      color: "primary.contrastText",
                    },
                  }}
                >
                  Conjugation
                </TableCell>
                <TableCell
                  sx={{
                    [`&.${tableCellClasses.head}`]: {
                      backgroundColor: "primary.main",
                      color: "primary.contrastText",
                    },
                  }}
                >
                  Translation
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {conjugations.forms.map((form) => (
                <TableRow key={form.form} hover>
                  <TableCell>{form.form}</TableCell>
                  <TableCell>
                    {getConjugation(tense.tense.toLowerCase(), tense.mood.toLowerCase(), form.form)}
                  </TableCell>
                  <TableCell>
                    {getTranslations(tense.tense.toLowerCase(), tense.mood.toLowerCase(), form.form).join(", ")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table> 
        </TableContainer>
      ))}
    </Box>
  );
};

export default ConjugationTable;
