import { Autocomplete, TextField } from "@mui/material";
import type React from "react";
import HoverBox from "../../../components/hoverBox";

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
  verbs: VerbData[];
  inputValue: string;
  onInputChange: (event: string) => void;
  selectedVerb: VerbData | null;
}

const VerbSearch: React.FC<VerbSearchProps> = ({ verbs, inputValue, onInputChange, selectedVerb }) => {
  return (
    <HoverBox>
      {verbs.length > 0 && (
        <Autocomplete
          id="verb-search"
          sx={{ width: 300 }}
          options={verbs}
          getOptionLabel={(option) => option.word.word_text}
          value={selectedVerb}
          inputValue={inputValue}
          onInputChange={(_event, newInputValue) => {
            onInputChange(newInputValue);
          }}
          renderInput={(params) => <TextField {...params} label="Search for a verb" variant="outlined" />}
        />
      )}
    </HoverBox>
  );
};

export default VerbSearch;
