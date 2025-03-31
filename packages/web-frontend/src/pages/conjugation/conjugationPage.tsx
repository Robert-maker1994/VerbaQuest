import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  InputLabel,
  FormControl,
  CircularProgress,
  Autocomplete,
  TextField,
} from '@mui/material';
import backendEndpoints from '../../context/api/api';



interface Tense {
  tense: string;
  mood: string;
}

interface Conjugation {
  id: number;
  conjugation: string;
  is_irregular: boolean;
  verb: {
    verb_id: number;
  };
  tense: {
    tense_id: number;
    tense: string;
    mood: string;
  };
  form: {
    form: string;
    form_id: number;
  };
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
  { tense: 'presente', mood: 'indicativo' },
  { tense: 'presente', mood: 'subjuntivo' },
  { tense: 'pretérito indefinido', mood: 'indicativo' },
  { tense: 'present simple', mood: 'indicative' },
  { tense: 'past simple', mood: 'indicative' },
];

const forms: string[] = [
    'yo',
    'tú',
    'él/ella/usted',
    'nosotros/nosotras',
    'vosotros/vosotras',
    'ellos/ellas/ustedes',

  ];

function VerbConjugationsPage() {
  const [verbs, setVerbs] = useState<VerbData[]>([]);
  const [selectedVerb, setSelectedVerb] = useState<VerbData | null>(null);
  const [selectedCounterpart, setSelectedCounterpart] = useState<string>('');
  const [conjugations, setConjugations] = useState<Conjugation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const fetchVerbs = async () => {
      setLoading(true);
      try {
        const data = await backendEndpoints.allVerbs();
        setVerbs(data);
      } catch (error) {
        console.error('Error fetching verbs:', error);
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
          console.error('Error fetching conjugations:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchConjugations();
  }, [selectedVerb]);

  const handleVerbChange = async (event: string) => {
    const verb = verbs.find(v => v.word.word_text === event);
    setSelectedCounterpart('');
    try {
      if(!verb) return;
      setSelectedVerb(verb);
      setLoading(true)
      const data = await backendEndpoints.getVerbConjugation(verb.verb_id);
      setConjugations(data);
    } catch (error) {
      console.error('Error fetching conjugations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConjugation = (tense: string, mood: string, form: string): string | undefined => {
    const conjugation = conjugations.find(c => c.tense.tense === tense && c.tense.mood === mood && c.form.form === form);
    return conjugation?.conjugation;
  };


  return (
    <Box sx={{ fontFamily: 'sans-serif', padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Verb Conjugations
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        {verbs.length > 0 && (
          <Autocomplete
            id="verb-search"
            sx={{ width: 300 }}
            options={verbs}
            getOptionLabel={(option) => option.word.word_text}
            value={selectedVerb}
            inputValue={inputValue}
            onInputChange={(_event, newInputValue) => {
              setInputValue(newInputValue);
              handleVerbChange(newInputValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Search for a verb" variant="outlined" />
            )}
          />
        )}
      </Box>
      {selectedCounterpart && (
          <Typography variant="h6" component="h2" gutterBottom>
            Counterpart: {selectedCounterpart}
          </Typography>
        )}

      {loading && <CircularProgress />}

      {selectedVerb && !loading && (
        <Box sx={{ marginTop: 3 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Conjugations for: {selectedVerb.word.word_text}
          </Typography>

          {tenses.map((tense) => (
            <Box key={tense.tense} elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
              <Typography variant="h6" component="h3" gutterBottom>
                {tense.tense} ({tense.mood})
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Pronoun</TableCell>
                      <TableCell>Conjugation</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {forms.map((form) => (
                      <TableRow key={form}>
                        <TableCell>{form}</TableCell>
                        <TableCell>
                          {getConjugation(tense.tense, tense.mood, form)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default VerbConjugationsPage;
