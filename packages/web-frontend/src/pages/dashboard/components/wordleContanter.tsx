import { Box, Input } from "@mui/material";
import { StyledCell } from "../../../components";
import { useWordle } from "./useWordle";
import GameMessage from "./gameMessage";

const WordleContainer: React.FC = () => {
  const {
    guesses,
    currentRow,
    message,
    gameStatus,
    handleKeyPress,
    handleCellClick,
    activeCell
  } = useWordle();

  return (
    <Box>
      {Array.from({ length: guesses.length  }, (_, rowIndex) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <Box key={rowIndex} display="flex" justifyContent={"center"}>
          {Array.from({ length: guesses.length }, (_, colIndex) => {
            const active = activeCell?.row === rowIndex && activeCell.col === colIndex;

            return (
              <StyledCell
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={`${rowIndex}-${colIndex}`}
                cellState={guesses[rowIndex]?.evaluation[colIndex]}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                isActive={active}>
                {rowIndex <= currentRow && (
                  <Input
                    type="text"
                    value={guesses[rowIndex]?.word[colIndex] || ""}
                    onKeyDown={handleKeyPress}
                    inputProps={{ maxLength: 1, style: { textAlign: "center", textTransform: "uppercase", padding: '0px' } }}
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
