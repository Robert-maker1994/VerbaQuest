import { memo } from "react"
import { Box, Input } from "@mui/material";

interface CrosswordCellProps {
    value: string;
    displayNumbers: number[] | null;
    inputRef: React.Ref<HTMLInputElement>;
    backgroundColour: string;
    isSelected: boolean;
    onCellClick: () => void;
    onKeyCapture: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const CrosswordCellContainer: React.FC<CrosswordCellProps> = ({
    value,
    displayNumbers,
    onKeyCapture,
    inputRef,
    backgroundColour,
    onCellClick,
}) => {

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
                background: backgroundColour,
                position: "relative",
                width: "40px",
                height: "40px",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
            }}
        >
            {displayNumbers?.map((num, index) => (
                <Box
                    key={`${num}-${num * 1}`}
                    sx={{
                        position: "absolute",
                        top: index === 0 ? "0px" : "10px",
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
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                    if (e.key) {
                        onKeyCapture(e)

                    }
                }}
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

const CrosswordCell = memo(CrosswordCellContainer);

export default CrosswordCell;