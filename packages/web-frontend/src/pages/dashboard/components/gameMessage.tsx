import { Alert } from "@mui/material";
import type { GameStatus } from "./useWordle";

function GameMessage({ message, gameStatus }: { message: string; gameStatus: GameStatus }) {
  if (gameStatus === "won") {
    return <Alert severity="success">{message}</Alert>;
  }
  if (gameStatus === "lost") {
    return <Alert severity="error">{message}</Alert>;
  }
  if (gameStatus === "playing") {
    return <Alert severity="warning">{message}</Alert>;
  }
  return null;
}

export default GameMessage;
