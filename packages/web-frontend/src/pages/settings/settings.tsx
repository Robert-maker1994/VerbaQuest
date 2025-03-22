import {
	Alert,
	Box,
	Button,
	CircularProgress,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	type SelectChangeEvent,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import backendEndpoints from "../../context/api/api";
import { useAuth } from "../../context/auth/useAuth";
enum LanguageCode {
	ENGLISH = "EN",
	SPANISH = "ES",
	FRENCH = "FR"
}

 enum Difficulty {
    A1 = "a1",
    A2 = "a2",
    B1 = "b1",
    B2 = "b2",
    C1 = "c1",
    C2 = "c2"
}
interface SettingsFormData {
	preferred_learning_language: LanguageCode;
	preferred_difficulty: Difficulty;
}

const SettingsPage = () => {
	const { user } = useAuth();
	const [formData, setFormData] = useState<SettingsFormData>({
		preferred_learning_language: LanguageCode.ENGLISH, // Default value
		preferred_difficulty: Difficulty.A1, // Default value
	});
	const [initialFormData, setInitialFormData] = useState<SettingsFormData>({
		preferred_learning_language: LanguageCode.ENGLISH, // Default value
		preferred_difficulty: Difficulty.A1, // Default value
	});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [isSaved, setIsSaved] = useState<boolean>(false);

	useEffect(() => {
		if (user) {
			setFormData({
				preferred_learning_language: user.preferred_learning_language,
				preferred_difficulty: user.preferred_difficulty,
			});
			setInitialFormData({
				preferred_learning_language: user.preferred_learning_language,
				preferred_difficulty: user.preferred_difficulty,
			});
		}
	}, [user]);

	const handleChange = (
		event: SelectChangeEvent,
		name: keyof SettingsFormData,
	) => {
		setFormData({
			...formData,
			[name]: event.target.value as LanguageCode | Difficulty,
		});
		setIsSaved(false);
	};

	const handleSubmit = async () => {
		if (!user?.user_id) return;
		setIsLoading(true);
		setError(null);
		setIsSaved(false);
		try {
			const updatedData = await backendEndpoints.patchUserSettings(
				user.user_id,
				formData,
			);

			if (updatedData) {
				setIsSaved(true);
				setInitialFormData(formData);
			} else {
				setError("Failed to update user settings.");
			}
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("An unexpected error occurred");
			}
		} finally {
			setIsLoading(false);
		}
	};

	const isFormChanged =
		formData.preferred_learning_language !==
			initialFormData.preferred_learning_language ||
		formData.preferred_difficulty !== initialFormData.preferred_difficulty;

	return (
		<Box
			component="form"
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				gap: 2,
				width: "80%",
				maxWidth: "500px",
				mx: "auto",
			}}
		>
			<Typography variant="h4">User Settings</Typography>

			<FormControl fullWidth>
				<InputLabel id="learning-language-label">
					Preferred Learning Language
				</InputLabel>
				<Select
					labelId="learning-language-label"
					id="learning-language-select"
					value={formData.preferred_learning_language}
					label="Preferred Learning Language"
					onChange={(event) =>
						handleChange(event, "preferred_learning_language")
					}
				>
					{Object.values(LanguageCode).map((code) => (
						<MenuItem key={code} value={code}>
							{code}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			<FormControl fullWidth>
				<InputLabel id="difficulty-label">Preferred Difficulty</InputLabel>
				<Select
					labelId="difficulty-label"
					id="difficulty-select"
					value={formData.preferred_difficulty}
					label="Preferred Difficulty"
					onChange={(event) => handleChange(event, "preferred_difficulty")}
				>
					{Object.values(Difficulty).map((difficulty) => (
						<MenuItem key={difficulty} value={difficulty}>
							{difficulty}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			{error && (
				<Alert severity="error" sx={{ width: "100%" }}>
					{error}
				</Alert>
			)}
			{isSaved && (
				<Alert severity="success" sx={{ width: "100%" }}>
					These changes have been saved.
				</Alert>
			)}

			<Button
				variant="contained"
				type="submit"
				onClick={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
				disabled={isLoading || !isFormChanged}
			>
				{isLoading ? <CircularProgress size={24} /> : "Done"}
			</Button>
		</Box>
	);
};

export default SettingsPage;
