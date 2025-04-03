import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/auth";
import type { LoginData } from "../../context/auth/interfaces";

const Login = () => {
  const { login, error, isLoggedIn } = useAuth();
  const nav = useNavigate();
  const [data, setData] = useState<LoginData>({
    username: "",
    password: "",
    email: "",
  });
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login(data);
  };

  if (isLoggedIn) {
    nav("/");
  }
  return (
    <Container
      component={"main"}
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      maxWidth="xs"
    >
      <Typography component="h1" variant="h5">
        Login
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          error={!!error}
          autoComplete="email"
          autoFocus
          onChange={handleInputChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          error={!!error}
          id="password"
          autoComplete="current-password"
          onChange={handleInputChange}
        />
        {error && (
          <Typography justifySelf={"center"} color="error">
            {error}
          </Typography>
        )}
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Login
        </Button>
        <Box sx={{ justifyContent: "center", alignItems: "center" }}>
          <Link style={{ justifyItems: "center" }} to={"/register"}>
            Don't have an account? Register
          </Link>
        </Box>
      </Box>
    </Container>
  );
};
export default Login;
