import type React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    IconButton,
} from "@mui/material";
import { CheckCircleOutline, Close } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

interface CongratulationDialogProps {
    open: boolean;
    onClose: () => void;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper": {
        backgroundColor: "#f5f5f5", // Light background
        borderRadius: theme.spacing(2), // Rounded corners
        padding: theme.spacing(3), // Padding
        maxWidth: "400px", // Max width
    },
    "& .MuiDialogTitle-root": {
        textAlign: "center",
        paddingBottom: theme.spacing(2),
        borderBottom: `1px solid ${theme.palette.divider}`,
        position: "relative", // For absolute positioning of close button
    },
    "& .MuiIconButton-root": {
        position: "absolute",
        top: theme.spacing(1),
        right: theme.spacing(1),
        color: theme.palette.text.secondary,
    },
    "& .MuiDialogContent-root": {
        textAlign: "center",
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(3),
    },
    "& .MuiDialogActions-root": {
        justifyContent: "center",
        paddingTop: theme.spacing(2),
    },
    "& .MuiButton-contained": {
        backgroundColor: theme.palette.primary.main,
        color: "#fff",
        padding: theme.spacing(1, 3),
        "&:hover": {
            backgroundColor: theme.palette.primary.dark,
        },
    },
}));

const CongratulationDialog: React.FC<CongratulationDialogProps> = ({
    open,
    onClose,
}) => {
    return (
        <StyledDialog open={open} onClose={onClose}>
            <DialogTitle>
                Congratulations!
                <IconButton aria-label="close" onClick={onClose}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 2,
                    }}
                >
                    <CheckCircleOutline
                        sx={{
                            color: "success.main",
                            fontSize: 40,
                            marginRight: 1,
                        }}
                    />
                    <Typography variant="h6">Puzzle Completed!</Typography>
                </Box>

                <Typography variant="body1" color="text.secondary">
                    You solved the crossword! Great job!
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained">
                    Close
                </Button>
            </DialogActions>
        </StyledDialog>
    );
};

export default CongratulationDialog;
