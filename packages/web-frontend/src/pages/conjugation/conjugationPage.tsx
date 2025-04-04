import { Box, Button, Checkbox, Chip, CircularProgress, Grid2, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, tableRowClasses, Typography } from "@mui/material";
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

function VerbConjugationsPage() {
  const [verbs, setVerbs] = useState<VerbData[]>([]);
  const [selectedVerb, setSelectedVerb] = useState<VerbData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState("");

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



  return (
    <Box sx={{ fontFamily: "sans-serif", padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Verb Conjugations
      </Typography>

      <HoverBox>
        <VerbSearch verbs={verbs} inputValue={inputValue} onInputChange={handleVerbChange} selectedVerb={selectedVerb} />

        {loading && <CircularProgress />}

        {!selectedVerb && !loading && (
          <TableContainer>
            <Table sx={{ my: "10px" }} aria-label="simple table">
              <TableHead sx={{

              }}>
                <TableRow sx={{
                  [`&.${tableRowClasses.head}`]: {
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                  },
                }}>
                  <TableCell>Verb</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>My verbs</TableCell>
                  <TableCell>View</TableCell>
                </TableRow>
              </TableHead>
              {verbs.length > 0 && (
                <TableBody>
                  {verbs.map((verb) => (
                    <TableRow onClick={() => handleVerbChange(verb.word.word_text)} key={verb.verb_id} hover>
                      <TableCell>{verb.word.word_text}</TableCell>
                      <TableCell><Chip label={verb.irregular ? "Irregular" : "Regular"} color={verb.irregular ? "warning" : "success"} /></TableCell>
                      <TableCell>
                        <Checkbox
                          color="primary"
                          checked={false}
                          aria-label="Select favorite"
                        />
                      </TableCell>
                      <TableCell>
                        <Button variant="outlined">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        )}

        {verbs.length === 0 && !loading && (
          <Typography>No verbs found.</Typography>

        )}
      </HoverBox>

      <Box mt={4}>
        <VerbGroups />
      </Box>
    </Box>
  );
}
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';

function VerbGroups() {
  const [openNewGroup, setOpenNewGroup] = useState<boolean>(false);
  const [groups, setGroups] = useState<{
    title: string,
    groupId: number,
    verbIds: number[]
  }[]>([])

  useEffect(() => {

    setGroups([{
      groupId: 0,
      title: "My Verbs",
      verbIds: [1, 23, 4, 5, 534]
    }, {
      groupId: 2,
      title: "Irregular Verbs",
      verbIds: [1, 23, 4, 5, 534]
    }])

  }, []);
  const handlePlay = () => {
    console.log('Play clicked');
    // Add your play logic here
  };

  const handleDelete = () => {
    console.log('Delete clicked');
    // Add your delete logic here (often needs confirmation)
  };

  const handleEdit = () => {
    console.log('Edit clicked');
    // Add your edit logic here (e.g., open a modal or form)
  };
  return (
    <HoverBox>
      <Grid2 container spacing={2}>
        <Grid2 size={12} display={"flex"} justifyContent={"space-between"}>

          <Typography variant="h4" component="h1">
            Verb Groups
          </Typography>


          <Button variant="contained"
            disableElevation
            color="primary">
            Create New Group
          </Button>
        </Grid2>
        {
          groups.map((group) => {
            return <Grid2 p={2} sx={{
              border: "1px solid black",
              borderRadius: "5px"
            }} key={group.groupId} size={12} alignItems={"center"} justifyContent={"space-between"} display={"flex"} >
              <Box>

                <Typography variant="h6" component="h1" gutterBottom>
                  {group.title}
                </Typography>
                <Typography variant="body1" component="p" gutterBottom>
                  {`Contains ${group.verbIds.length} verbs`}
                </Typography>
              </Box>
              <Box>
                <Tooltip title="Play">
                  <IconButton aria-label="play" onClick={handlePlay} color="primary">
                    <PlayArrowIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Edit">
                  <IconButton aria-label="edit" onClick={handleEdit} color="secondary">
                    <EditIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete">
                  <IconButton aria-label="delete" onClick={handleDelete} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>

              </Box>

            </Grid2>
          })
        }
        <Grid2 size={12}>

        </Grid2>
      </Grid2>
      {/* <NewGroupDialog /> */}
    </HoverBox>
  )
}

export default VerbConjugationsPage;
