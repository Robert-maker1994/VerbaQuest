import { createContext, useContext, useState } from "react";
import type { WordData } from "../../interfaces";

interface CrosswordResponse {
	crossword: string[][];
	title: string;
	isComplete: boolean;
	metadata: WordData[];
	id: number;
}
const defaultCrossword: CrosswordResponse = {
	crossword: [[]],
	isComplete: false,
	title: "Loading Crossword...",
	metadata: [],
	id: 0,
};
interface CrosswordContextProps {
	crosswordData: CrosswordResponse;
	setCrosswordData: (data: CrosswordResponse) => void;
}

const CrosswordContext = createContext<CrosswordContextProps | undefined>(
	undefined,
);

export const useCrossword = () => {
	const context = useContext(CrosswordContext);
	if (!context) {
		throw new Error("useCrossword must be used within a CrosswordProvider");
	}
	return context;
};

interface CrosswordProviderProps {
	children: React.ReactNode;
}
// TODO handle the error state in a Error context
export const CrosswordProvider: React.FC<CrosswordProviderProps> = ({
	children,
}) => {
	const [crosswordData, setCrosswordData] =
		useState<CrosswordResponse>(defaultCrossword);
	// const [isError, setIsError] = useState<boolean>(false);


	const value = { crosswordData, setCrosswordData };
	return (
		<CrosswordContext.Provider value={value}>
			{children}
		</CrosswordContext.Provider>
	);
};
