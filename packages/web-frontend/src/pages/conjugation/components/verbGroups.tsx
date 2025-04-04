
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import { Grid2, Typography, Button, Box, IconButton } from '@mui/material';
import { useState, useEffect } from 'react';
import HoverBox from '../../../components/hoverBox';

export function VerbGroups() {
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