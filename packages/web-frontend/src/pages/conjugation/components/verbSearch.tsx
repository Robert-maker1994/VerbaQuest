import { Autocomplete, TextField } from "@mui/material";
import type React from "react";
import { useCallback, useState } from "react";
import backendEndpoints from "../../../context/api/api";
import type { ApiVerb } from "./conjugationTable";

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

interface VerbSearchProps {
  onVerbSelected: (verb: VerbData) => void;
}

/**
 * VerbSearch component for searching and selecting verbs.
 * @param {(event: VerbData) => void} props.onVerbSelected - A callback function that is called when the input value changes.
 * @returns {JSX.Element} The VerbSearch component.
 */
const VerbSearch: React.FC<VerbSearchProps> = ({ onVerbSelected }) => {
  const [inputValue, setInputValue] = useState("");
  const [verbs, setVerbs] = useState<ApiVerb[]>([]);

  const handleVerbChange = useCallback(async (inputValue: string) => {
    try {
      console.log(inputValue)
      const verbs = await backendEndpoints.searchVerbs(inputValue.trim());
      setVerbs(verbs);
      setInputValue(inputValue);
    } catch (err) {
      console.error("Error creating group:", err);
    }
  }, []);

  return <Autocomplete
    id="verb-search"
    sx={{
      my: "10px"
    }}
    options={verbs}
    getOptionLabel={(option) => option.word.word_text}
    inputValue={inputValue}
    onChange={(_event, newValue) => {
      if (newValue) {
        setInputValue(newValue.word.word_text);
        onVerbSelected(newValue);
      }
    }}
    onInputChange={(_event, newInputValue) => {
      handleVerbChange(newInputValue);
    }}
    renderInput={(params) => <TextField {...params} label="Search for a verb" variant="outlined" />}
  />
};

export default VerbSearch;
