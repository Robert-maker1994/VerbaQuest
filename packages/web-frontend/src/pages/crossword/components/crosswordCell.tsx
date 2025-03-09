import { Box, Input } from "@mui/material";


interface CrosswordCellProps {
    value: string;
    isCorrect: boolean;
    displayNumbers: number[] | null;
    onInputChange: (value: string) => void;
    inputRef: React.Ref<HTMLInputElement>;
    isCompleted: boolean;
    isSelected: boolean;
    onCellClick: () => void;
}

const CrosswordCell: React.FC<CrosswordCellProps> = ({
    value,
    isCorrect,
    displayNumbers,
    onInputChange,
    inputRef,
    isCompleted,
    isSelected,
    onCellClick,
}) => {
    const backgroundColor = isSelected
        ? "lightyellow"
        : isCompleted
            ? "lightgray"
            : isCorrect
                ? "lightgreen"
                : "linear-gradient(to bottom, #80deea, #4dd0e1)";

    return (
        <Box
            onClick={onCellClick}
            sx={{
                border: "1px solid black",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "1.2em",
                boxSizing: "border-box",
                borderRadius: "5px",
                background: backgroundColor,
                position: "relative",
                width: "40px",
                height: "40px",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
            }}
        >
            {displayNumbers?.map((num, index) => ( // Display multiple numbers
                <Box
                    key={index}
                    sx={{
                        position: "absolute",
                        top: index === 0 ? "0px" : "10px",  // Position subsequent numbers lower
                        left: "0px",
                        fontSize: "10px",
                    }}
                >
                    {num}
                </Box>
            ))}

            <Input
                type="text"
                value={value}
                onChange={(e) => onInputChange(e.target.value.slice(0, 1))}
                inputProps={{
                    maxLength: 1,
                    style: {
                        textAlign: "center",
                        textTransform: "uppercase",
                    },
                }}
                inputRef={inputRef}
                sx={{
                    textAlign: "center",
                    width: "100%",
                    padding: 0,
                    "& .MuiInput-input": {
                        padding: 0,
                        height: "100%",
                    },
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                        borderBottom: "none",
                    },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                }}
                disableUnderline
            />
        </Box>
    );
};

export default CrosswordCell;