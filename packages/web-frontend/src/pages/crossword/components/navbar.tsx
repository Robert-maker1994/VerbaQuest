import AccountCircle from "@mui/icons-material/AccountCircle";
import {
	AppBar,
	IconButton,
	Menu,
	MenuItem,
	Switch,
	Tab,
	Tabs,
	Toolbar,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../context/auth";
import { useTheme } from "../../../context/theme/useTheme";

export default function Navbar() {
	const nav = useNavigate();
	const { logout } = useAuth();
	const [value, setValue] = useState(1); // Start with "Dashboard" selected.
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // State for the menu
	const { isDarkMode, toggleDarkMode } = useTheme(); // Get isDarkMode and toggleDarkMode

	const open = Boolean(anchorEl); // Check if the menu is open

	const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget); // Set the anchor element to the clicked element
	};

	const handleClose = () => {
		setAnchorEl(null); // Close the menu
	};

	const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	const handleClick = (string: string) => {
		nav(`/${string}`);
	};

	const handleLogout = async () => {
		await logout();
		nav("/login");
	};

	return (
		<AppBar
			position="static"
			color="default"
			elevation={1}
			sx={{
				borderRadius: 2,
				width: "80%",
				justifySelf: "center",
				marginBottom: "10px",
			}}
		>
			<Toolbar>
				<Typography
					variant="h6"
					component="div"
					sx={{
						flexGrow: 0,
						fontWeight: "bold",
						display: "flex",
						alignItems: "center",
					}}
				>
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
					sx={{ flexGrow: 1, ml: 3 }}
				>
					<Tab
						disableRipple
						label="Dashboard"
						onClick={() => handleClick("dashboard")}
					/>
					<Tab
						disableRipple
						label="Crossword"
						onClick={() => handleClick("crossword")}
					/>
					<Tab
						disableRipple
						label="Verb Conjugation"
						onClick={() => handleClick("verbconjugation")}
					/>
					<Tab
						disableRipple
						label="Contact"
						onClick={() => handleClick("contact")}
					/>
				</Tabs>

				<IconButton
					size="large"
					aria-label="account of current user"
					aria-controls="menu-appbar"
					aria-haspopup="true"
					onClick={handleMenu} // Open the menu on click
					color="inherit"
				>
					<AccountCircle />
				</IconButton>
				<Menu
					id="menu-appbar"
					anchorEl={anchorEl} // Set the anchor element
					keepMounted
					open={open} // Control the menu open state
					onClose={handleClose} // Close the menu
				>
					<MenuItem onClick={handleClose}>User Settings</MenuItem>
					<MenuItem onClick={handleLogout}>Logout</MenuItem>
					<Switch
						title="Light/Dark Mode"
						color="primary"
						checked={isDarkMode}
						onChange={toggleDarkMode}
					/>
				</Menu>
			</Toolbar>
		</AppBar>
	);
}
