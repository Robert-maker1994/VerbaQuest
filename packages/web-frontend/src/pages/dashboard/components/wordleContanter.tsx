import { Box, Input } from "@mui/material";
import { StyledCell } from "../../../components";
import GameMessage from "./gameMessage";
import { useWordle } from "./useWordle";

const WordleContainer: React.FC = () => {
  const { guesses, currentRow, message, gameStatus, handleKeyPress, handleCellClick, activeCell } = useWordle();

  return (
    <Box>
      {Array.from({ length: 5 }, (_, rowIndex) => (
        <Box key={crypto.randomUUID()} display="flex" justifyContent={"center"}>
          {Array.from({ length: 5 }, (_, colIndex) => {
            const active = activeCell?.row === rowIndex && activeCell.col === colIndex;
            const key = `${rowIndex}-${colIndex}`;
            return (
              <StyledCell
                key={key}
                state={guesses[rowIndex]?.evaluation[colIndex]}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                active={active}
              >
                {rowIndex <= currentRow && (
                  <Input
                    type="text"
                    value={guesses[rowIndex]?.word[colIndex] || ""}
                    onKeyDown={handleKeyPress}
                    inputProps={{
                      maxLength: 1,
                      style: {
                        textAlign: "center",
                        textTransform: "uppercase",
                        padding: "0px",
                      },
                    }}
                    disableUnderline
                    autoFocus={active}
                    disabled={rowIndex > currentRow || rowIndex < currentRow}
                  />
                )}
              </StyledCell>
            );
          })}
        </Box>
      ))}
      {message && <GameMessage message={message} gameStatus={gameStatus} />}
    </Box>
  );
};

export default WordleContainer;
