import type { CrosswordResponse } from "@verbaquest/shared";
import { createContext, useCallback, useContext, useState } from "react";
import api from "../../context/api/api";

const defaultCrossword: CrosswordResponse = {
	crossword: [[]],
	title: "Loading Crossword...",
	metadata: [],
	isComplete: false,
	id: 0,
};
interface CrosswordContextProps {
	crosswordData: CrosswordResponse;
	getCrossword: (crosswordId: string) => Promise<void>;
	saveUserProgress: (crosswordId: number, timeTaken: number) => Promise<void>;
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

	const getCrossword = useCallback(async (crosswordId: string) => {
		try {
			if (crosswordId) {
				const data = await api.getSpecificCrossword(
					Number.parseInt(crosswordId),
				);
				setCrosswordData(data);
			}
		} catch (err) {
			console.error(err);
		}
	}, []);

	const saveUserProgress = useCallback(
		async (crosswordId: number, timeTaken: number) => {
			try {
				await api.saveUserProgress(crosswordId, timeTaken);
				console.log("User progress saved successfully!");
			} catch (err) {
				console.error("Error saving user progress:", err);
			}
		},
		[],
	);



	const value = { crosswordData, getCrossword, saveUserProgress };
	return (
		<CrosswordContext.Provider value={value}>
			{children}
		</CrosswordContext.Provider>
	);
};
