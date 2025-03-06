import { styled, alpha, InputBase, AppBar, Toolbar, Typography, Tabs, Tab, IconButton } from "@mui/material";
import { useState } from "react";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router";

const Search = styled("div")(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    width: "80%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(1),
        width: "auto",
    },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            width: "12ch",
            "&:focus": {
                width: "20ch",
            },
        },
    },
}));

export default function Navbar() {
    const nav = useNavigate()
    const [value, setValue] = useState(1); // Start with "Dashboard" selected.

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleClick = (string: string) => {
        nav(`/${string}`)
    }


    return (
        <AppBar position="static" color="default" elevation={1} sx={{ borderRadius: 2, width: "80%", justifySelf: "center", marginBottom: "10px" }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 0, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    Verbaquest
                </Typography>

                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="inherit"
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="navigation tabs"
                    sx={{ flexGrow: 1, ml: 3 }} // Add margin to left for spacing
                >

                    <Tab disableRipple label="Dashboard" onClick={() => handleClick("dashboard")} />

                    <Tab disableRipple label="Crossword" onClick={() => handleClick("crossword")} />
                    <Tab disableRipple label="Verb Conjugation" onClick={() => handleClick("verbconjugation")} />
                    <Tab disableRipple label="Contact" onClick={() => handleClick("contact")} />
                </Tabs>

                <Search>
                    <StyledInputBase
                        placeholder="Search…"
                        inputProps={{ "aria-label": "search" }}
                    />
                </Search>

                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>



            </Toolbar>
        </AppBar>

    );
}