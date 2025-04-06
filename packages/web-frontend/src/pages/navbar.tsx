import AccountCircle from "@mui/icons-material/AccountCircle";
import { AppBar, IconButton, Menu, MenuItem, Switch, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/auth";
import { useTheme } from "../context/theme/useTheme";
import { useTranslation } from "../context/translationProvider";

export default function Navbar() {
  const nav = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [value, setValue] = useState<number>(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { translate } = useTranslation();
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (location.pathname.includes("/dashboard")) {
      setValue(0);
    } else if (location.pathname.includes("/crossword")) {
      setValue(1);
    } else if (location.pathname.includes("/verbs")) {
      setValue(2);
    } else if (location.pathname.includes("/settings")) {
      setValue(0);
    } else {
      setValue(0);
    }
  }, [location.pathname]);

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

        justifySelf: "center",
        my: "12px",
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div">
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
          <Tab disableRipple label={translate("dashboard")} onClick={() => handleClick("dashboard")} />
          <Tab disableRipple label={translate("crossword")} onClick={() => handleClick("crossword")} />
          <Tab disableRipple label={translate("verb_conjugation")} onClick={() => handleClick("verbs")} />
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
        <Menu id="menu-appbar" anchorEl={anchorEl} keepMounted open={open} onClose={handleClose}>
          <MenuItem onClick={handleUserSettings}>{translate("user settings")}</MenuItem>
          <MenuItem onClick={handleLogout}>{translate("logout")}</MenuItem>
          <Switch title="Light/Dark Mode" color="primary" checked={isDarkMode} onChange={toggleDarkMode} />
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
