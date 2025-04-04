import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  tableCellClasses,
} from "@mui/material";
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

interface ConjugationTableProps {
  conjugations: Conjugation[];
  selectedVerb: VerbData | null;
  tenses: Tense[];
  toolBar?: React.ReactNode;
}

const forms: string[] = ["yo", "tú", "él/ella/usted", "nosotros/nosotras", "vosotros/vosotras", "ellos/ellas/ustedes"];

const ConjugationTable: React.FC<ConjugationTableProps> = ({ conjugations, selectedVerb, tenses, toolBar }) => {
  const getConjugation = (tense: string, mood: string, form: string): string | undefined => {
    const conjugation = conjugations.find(
      (c) => c.tense.tense === tense && c.tense.mood === mood && c.form.form === form,
    );
    return conjugation?.conjugation;
  };

  return (
    <Box>
      <HoverBox>
        <Typography variant="h6" component="h2" gutterBottom>
          Conjugations for: {selectedVerb?.word.word_text}
        </Typography>
        {toolBar}
      </HoverBox>

      {tenses.map((tense) => (
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
              {forms.map((form) => (
                <TableRow key={form} hover>
                  <TableCell>{form}</TableCell>
                  <TableCell>{getConjugation(tense.tense.toLowerCase(), tense.mood.toLowerCase(), form)}</TableCell>
                  <TableCell>
                    {
                      conjugations
                        .find(
                          (c) =>
                            c.tense.tense === tense.tense.toLowerCase() &&
                            c.tense.mood === tense.mood &&
                            c.form.form === form,
                        )
                        ?.translations.map((translation) => translation.translation)
                    }
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
