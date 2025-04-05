import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Typography,
} from "@mui/material";
import { DataGrid, type GridColDef, type GridValueGetterParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import HoverBox from "../../components/hoverBox";
import backendEndpoints from "../../context/api/api";

import VerbSearch from "./components/verbSearch";
import { VerbGroups } from "./components/verbGroups";
import { useNavigate } from "react-router";

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

function VerbConjugationsPage() {
  const [verbs, setVerbs] = useState<VerbData[]>([]);
  const [selectedVerb, setSelectedVerb] = useState<VerbData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState("");
  const nav = useNavigate();

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

  const handleVerbChange = async (event: number) => {
    const verb = verbs.find((v) => v.verb_id === event);

    if (!verb) {
      throw new Error("Verb not found handle verb change");
    }
    nav(`/verbs/conjugations/${verb.verb_id}`)
    setInputValue(verb?.word.word_text);
    try {
      if (!verb) return;
      setSelectedVerb(verb);
    } catch (error) {
      console.error("Error fetching conjugations:", error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "word",
      headerName: "Verb",
      flex: 1, // Use flex: 1 to distribute space evenly
      valueGetter: (value) => value,
    },
    {
      field: "type",
      headerName: "Type",
      flex: 1, // Use flex: 1 to distribute space evenly
      renderCell: (params) => {
        return <Chip
          label={params.row.type ? "Irregular" : "Regular"}
          color={params.row.type ? "warning" : "success"}
        />
      }

    },
    {
      field: "view",
      headerName: "View",
      flex: 1, // Use flex: 1 to distribute space evenly
      renderCell: (params) => (
        <Button variant="outlined" onClick={(e) => {
          e.preventDefault();
          handleVerbChange(params.row.id)
        }}>
          View
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ fontFamily: "sans-serif", padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Verb Conjugations
      </Typography>

      <HoverBox>
        {/* <VerbSearch
          verbs={verbs}
          inputValue={inputValue}
          onInputChange={(e) => {
         
          }}
          selectedVerb={selectedVerb}
        /> */}

        {loading && <CircularProgress />}

        {!selectedVerb && !loading && verbs.length > 0 && (
          <Box my={2} >
            <DataGrid
              rows={verbs.map((verb) => ({ word: verb?.word?.word_text, type: verb.irregular, id: verb.verb_id }))} columns={columns}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              disableRowSelectionOnClick
            />
          </Box>
        )}

        {verbs.length === 0 && !loading && <Typography>No verbs found.</Typography>}
      </HoverBox>
      <Box mt={4}>
        <VerbGroups />
      </Box>
    </Box>
  );
}

export default VerbConjugationsPage;
