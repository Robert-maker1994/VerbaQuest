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
import { useTranslation } from "../context/translationProvider";

export default function Navbar() {
	const nav = useNavigate();
	const { logout } = useAuth();
	const [value, setValue] = useState<number>(0);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const { isDarkMode, toggleDarkMode } = useTheme();
	const { translate } = useTranslation();
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
		logout();
		nav("/login");
	};

	const handleUserSettings = () => {
		handleClose();
		nav("/settings");
	};

	return (
		<AppBar
			position="static"
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
						label={translate("dashboard")}
						onClick={() => handleClick("dashboard")}
					/>
					<Tab
						disableRipple
						label={translate("crossword")}
						onClick={() => handleClick("crossword")}
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
					<MenuItem onClick={handleUserSettings}>
						{translate("user settings")}
					</MenuItem>
					<MenuItem onClick={handleLogout}>{translate("logout")}</MenuItem>
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
