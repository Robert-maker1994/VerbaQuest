import EditIcon from "@mui/icons-material/Edit";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Box, Button, Grid2, IconButton, Typography } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { useCallback, useEffect, useState } from "react";
import HoverBox from "../../../components/hoverBox";
import backendEndpoints from "../../../context/api/api";

import { useNavigate } from "react-router";
import { StyledDeleteIcon } from "../../../components/styledComponents/styledDeleteIcon";
import CreateGroupDialog from "./createGroupDialog";

export function VerbGroups() {
  const [openNewGroup, setOpenNewGroup] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<
    | {
        name: string;
        groupId: number;
        verbIds: number[];
      }
    | undefined
  >(undefined);
  const [groups, setGroups] = useState<
    {
      name: string;
      groupId: number;
      verbIds: number[];
    }[]
  >([]);
  const nav = useNavigate();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!groups.length) {
      fetchGroups();
    }
  }, []);
  const fetchGroups = useCallback(async () => {
    try {
      const data: {
        group_id: number;
        group_name: string;
        userVerbGroups: {
          verb: {
            verb_id: number;
            word: {
              word_id: number;
              word_text: string;
            };
          };
        }[];
      }[] = await backendEndpoints.getGroups();
      setGroups(
        data.map((groups) => {
          return {
            name: groups.group_name,
            groupId: groups.group_id,
            verbIds: groups?.userVerbGroups.map((user_verb) => user_verb.verb.verb_id),
          };
        }),
      );
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  }, []);

  const handlePlay = (verbsId: number[]) => {
    if (!verbsId.length) return;
    nav(`/verbs/${verbsId.join("-")}`);
  };

  const handleDelete = async (groupId: number) => {
    await backendEndpoints.deleteGroup(groupId);
    fetchGroups();
  };

  const handleEdit = (group: {
    name: string;
    groupId: number;
    verbIds: number[];
  }) => {
    setSelectedGroup(group);
    setOpenNewGroup(true);
  };
  return (
    <HoverBox>
      <Grid2 container spacing={2}>
        <Grid2 size={12} display={"flex"} justifyContent={"space-between"}>
          <Typography variant="h4" component="h1">
            Verb Groups
          </Typography>

          <Button
            variant="contained"
            disableElevation
            onClick={() => {
              setSelectedGroup(undefined);
              setOpenNewGroup(!openNewGroup);
            }}
            color="primary"
          >
            Create New Group
          </Button>
        </Grid2>
        {groups?.map((group) => {
          return (
            <Grid2
              p={2}
              sx={{
                border: "1px solid black",
                borderRadius: "5px",
              }}
              key={group.groupId}
              size={12}
              alignItems={"center"}
              justifyContent={"space-between"}
              display={"flex"}
            >
              <Box>
                <Typography variant="h6" component="h1" gutterBottom>
                  {group.name}
                </Typography>
                <Typography variant="body1" component="p" gutterBottom>
                  {`Contains ${group.verbIds.length} verbs`}
                </Typography>
              </Box>
              <Box>
                <Tooltip title="Play">
                  <IconButton
                    aria-label="play"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePlay(group.verbIds);
                    }}
                    color="primary"
                  >
                    <PlayArrowIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Edit">
                  <IconButton aria-label="edit" onClick={() => handleEdit(group)} color="secondary">
                    <EditIcon />
                  </IconButton>
                </Tooltip>

                <StyledDeleteIcon handleDelete={() => handleDelete(group.groupId)} />
              </Box>
            </Grid2>
          );
        })}
        {!groups.length && <Typography>Create Verb groups</Typography>}
        <Grid2 size={12}></Grid2>
      </Grid2>
      <CreateGroupDialog
        open={openNewGroup}
        onClose={() => {
          fetchGroups();
          setOpenNewGroup(!openNewGroup);
        }}
        group={selectedGroup}
        onGroupCreated={fetchGroups}
      />{" "}
    </HoverBox>
  );
}
