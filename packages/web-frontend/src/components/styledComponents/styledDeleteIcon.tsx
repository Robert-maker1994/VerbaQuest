import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";

export const StyledDeleteIcon = ({ handleDelete }: { handleDelete: () => void }) => {
  return (
    <Tooltip title="Delete">
      <IconButton aria-label="delete" onClick={handleDelete} color="error">
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  );
};
