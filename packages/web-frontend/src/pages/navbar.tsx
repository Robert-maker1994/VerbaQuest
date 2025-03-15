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
import { useAuth } from "../context/auth";
import { useTheme } from "../context/theme/useTheme";

export default function Navbar() {
	const nav = useNavigate();
	const { logout } = useAuth();
	const [value, setValue] = useState(0);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const { isDarkMode, toggleDarkMode } = useTheme();

	const open = Boolean(anchorEl);

	const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
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

	const handleUserSettings = () => {
		handleClose()
		nav("/settings");
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
					onClick={handleMenu}
					color="inherit"
				>
					<AccountCircle />
				</IconButton>
				<Menu
					id="menu-appbar"
					anchorEl={anchorEl}
					keepMounted
					open={open}
					onClose={handleClose}
				>
					<MenuItem onClick={handleUserSettings}>User Settings</MenuItem>
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
