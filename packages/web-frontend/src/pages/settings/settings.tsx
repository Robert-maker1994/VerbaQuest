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
import { useTranslation } from "../../context/translationProvider";
import { LanguageCode, Difficulty } from "@verbaquest/types";


interface SettingsFormData {
	preferred_learning_language: LanguageCode;
	preferred_difficulty: Difficulty;
	app_language: LanguageCode;
}

const SettingsPage = () => {
	const { user } = useAuth();
	const [formData, setFormData] = useState<SettingsFormData>({
		preferred_learning_language: LanguageCode.ENGLISH,
		preferred_difficulty: Difficulty.A1,
		app_language: LanguageCode.ENGLISH,
	});
	const [initialFormData, setInitialFormData] = useState<SettingsFormData>({
		preferred_learning_language: LanguageCode.ENGLISH,
		preferred_difficulty: Difficulty.A1,
		app_language: LanguageCode.ENGLISH,
	});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [isSaved, setIsSaved] = useState<boolean>(false);
	const { refreshTranslations, translate } = useTranslation();

	useEffect(() => {
		if (user) {
			setFormData({
				preferred_learning_language: user.preferred_learning_language,
				preferred_difficulty: user.preferred_difficulty,
				app_language: user.app_language,
			});
			setInitialFormData({
				preferred_learning_language: user.preferred_learning_language,
				preferred_difficulty: user.preferred_difficulty,
				app_language: user.app_language,
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
				refreshTranslations();
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
		formData.preferred_difficulty !== initialFormData.preferred_difficulty ||
		formData.app_language !== initialFormData.app_language;

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
			<Typography variant="h4">{translate("user settings")}</Typography>

			<FormControl fullWidth>
				<InputLabel id="learning-language-label">
					{translate("language")}
				</InputLabel>
				<Select
					labelId="learning-language-label"
					id="learning-language-select"
					value={formData.preferred_learning_language}
					label={translate("language")}
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
				<InputLabel id="difficulty-label">{translate("difficulty")}</InputLabel>
				<Select
					labelId="difficulty-label"
					id="difficulty-select"
					value={formData.preferred_difficulty}
					label={translate("difficulty")}
					onChange={(event) => handleChange(event, "preferred_difficulty")}
				>
					{Object.values(Difficulty).map((difficulty) => (
						<MenuItem key={difficulty} value={difficulty}>
							{difficulty}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			<FormControl fullWidth>
				<InputLabel id="difficulty-label">
					{translate("app_language")}
				</InputLabel>
				<Select
					labelId="app-language-label"
					id="app-language"
					value={formData.app_language}
					label={translate("app_language")}
					onChange={(event) => handleChange(event, "app_language")}
				>
					{Object.values(LanguageCode).map((code) => (
						<MenuItem key={code} value={code}>
							{code}
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
					{translate("saved_notification")}
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
				{isLoading ? <CircularProgress size={24} /> : translate("done")}
			</Button>
		</Box>
	);
};

export default SettingsPage;
