import { Tooltip, IconButton } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"

export const StyledDeleteIcon = ({ handleDelete }: { handleDelete: () => void }) => {
    return <Tooltip title="Delete">
        <IconButton aria-label="delete" onClick={handleDelete} color="error">
            <DeleteIcon />
        </IconButton>
    </Tooltip>
}
