import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import type { WordData } from "../../interfaces";

interface CrosswordResponse {
	crossword: string[][];
	title: string;
	metadata: WordData[];
    id:number;
}

interface CrosswordContextProps {
	crosswordData: CrosswordResponse | undefined;
	setCrosswordData: (data: CrosswordResponse | undefined) => void;
	refreshCrossword:() => Promise<void>;
}

const CrosswordContext = createContext<CrosswordContextProps | undefined>(undefined);

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

export const CrosswordProvider: React.FC<CrosswordProviderProps> = ({
	children,
}) => {
	const [crosswordData, setCrosswordData] =
		useState<CrosswordResponse | undefined>(undefined);
	const refreshCrossword = async () => {
        try {
            const response = await axios.get<CrosswordResponse>(
                "http://localhost:5001/crossword/today",
            );
            setCrosswordData(response.data);
        } catch (error) {
            console.error("Error fetching crossword data:", error);
            setCrosswordData(undefined); // reset the data to undefined in case of error
        }
	};
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		refreshCrossword();
	}, []);

	const value = { crosswordData, setCrosswordData, refreshCrossword };
	return (
		<CrosswordContext.Provider value={value}>
			{children}
		</CrosswordContext.Provider>
	);
};
