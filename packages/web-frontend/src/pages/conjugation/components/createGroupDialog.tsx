import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { StyledDeleteIcon } from "../../../components/styledComponents/styledDeleteIcon";
import backendEndpoints from "../../../context/api/api";
import type { ApiVerb } from "./conjugationTable";
import VerbSearch from "./verbSearch";

interface CreateGroupDialogProps {
  open: boolean;
  onClose: () => void;
  onGroupCreated: () => void;
  group?: {
    name: string;
    groupId: number;
    verbIds: number[];
  };
}

const CreateGroupDialog: React.FC<CreateGroupDialogProps> = ({ open, onClose, onGroupCreated, group }) => {
  const [groupName, setGroupName] = useState<string>("");
  const [selectedVerbs, setSelectedVerbs] = useState<ApiVerb[]>([]);
  const [error, setError] = useState<string | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (group && !groupName) {
      const fetchVerbs = async () => {
        const verbs = await backendEndpoints.getVerbsByIds(group.verbIds);
        setSelectedVerbs(verbs);
      };
      setGroupName(group.name);

      fetchVerbs();
    }
  }, [group]);

  const handleGroupNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(event.target.value);
    setError(null);
  };
  const columns: GridColDef[] = [
    {
      field: "word",
      headerName: "Verb",
      flex: 1, // Use flex: 1 to distribute space evenly
      valueGetter: (params) => params,
    },
    {
      field: "type",
      headerName: "Type",
      flex: 1, // Use flex: 1 to distribute space evenly
      renderCell: (params) => {
        return (
          <Chip label={params.row.type ? "Irregular" : "Regular"} color={params.row.type ? "warning" : "success"} />
        );
      },
    },
    {
      field: "remove",
      headerName: "Remove",
      flex: 1, // Use flex: 1 to distribute space evenly
      renderCell: (params) => (
        <StyledDeleteIcon
          handleDelete={() => {
            const newVerbs = selectedVerbs.filter((verb) => verb.verb_id !== params.row.id);
            setSelectedVerbs(newVerbs);
          }}
        />
      ),
    },
  ];
  const handleCreateGroup = async () => {
    try {
      const verbsIds = selectedVerbs.map((v) => v.verb_id);
      if (group) {
        await backendEndpoints.editGroup({
          verbsIds,
          title: groupName,
          groupId: group.groupId,
        });
      } else {
        await backendEndpoints.createNewGroup({
          verbsIds,
          title: groupName,
        });
      }

      onGroupCreated();
      onClose();
      setGroupName("");
    } catch (err) {
      console.error("Error creating group:", err);
      setError("Error creating group. Please try again.");
    }
  };
  return (
    <Dialog maxWidth="lg" open={open} onClose={onClose}>
      <DialogTitle>
        <TextField
          autoFocus
          margin="dense"
          id="groupName"
          label="Enter Group Name"
          type="text"
          fullWidth
          variant="outlined"
          value={groupName}
          onChange={handleGroupNameChange}
          error={!!error}
          helperText={error}
        />
        <VerbSearch
          onVerbSelected={(newVerb: ApiVerb) => {
            if (!selectedVerbs.find((verb) => verb.verb_id === newVerb.verb_id)) {
              setSelectedVerbs([...selectedVerbs, newVerb]);
            }
          }}
        />
      </DialogTitle>
      <DialogContent
        sx={{
          height: "500px",
        }}
      >
        <DataGrid
          rows={selectedVerbs.map((verb) => ({
            word: verb?.word?.word_text,
            type: verb.irregular,
            id: verb.verb_id,
            myVerbs: false,
          }))}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          disableRowSelectionOnClick
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onClose();
            setGroupName("");
            setSelectedVerbs([]);
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleCreateGroup}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateGroupDialog;
