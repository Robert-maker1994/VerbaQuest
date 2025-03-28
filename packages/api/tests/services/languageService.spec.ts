import { LanguageCode } from "@verbaquest/types";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import translationService from "../../libs/services/translationService";

describe("translationService", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("get Text for LanguageCode.FRENCH", async () => {
		const translations = await translationService.getTranslations(
			LanguageCode.FRENCH,
		);
		expect(translations).toEqual({
			dashboard: "Tableau de bord",
			crossword: "Mots croisés",
			verb_conjugation: "Conjugaison des verbes",
			contact: "Contact",
			verbaquest: "Verbaquest",
			"user settings": "Paramètres utilisateur",
			logout: "Déconnexion",
			"here_are_the crosswords_you_have_previously_attempted:":
				"Voici les mots croisés que vous avez déjà essayés :",
			not_attempted_crosswords:
				"Vous n'avez pas encore essayé de mots croisés.",
			try_it_again: "Réessayez !",
			navigate_to_crossword: "Naviguer vers les mots croisés",
			"time:": "Temps:",
			play: "Jouer",
			"status:": "Statut:",
			"topics:": "Sujets:",
			saved_notification: "Ces modifications ont été enregistrées.",
			search_crosswords: "Rechercher des mots croisés",
			"difficulty:": "Difficulté:",
			completed: "Terminé",
			not_attempted: "Non tenté",
			crosswords: "Mots croisés",
			congratulations: "Félicitations!",
			"puzzle_completed!": "Puzzle terminé!",
			completed_crossword:
				"Vous avez résolu les mots croisés ! Excellent travail !",
			do_more_crosswords: "Faire plus de mots croisés",
			close: "Fermer",
			language: "Langue d'apprentissage préférée",
			app_language: "Langue de l'application",
			difficulty: "Difficulté préférée",
			done: "Terminé",
		});
	});

	it("get Text for LanguageCode.SPANISH", async () => {
		const translations = await translationService.getTranslations(
			LanguageCode.SPANISH,
		);
		expect(translations).toEqual({
			dashboard: "Tablero",
			crossword: "Crucigrama",
			verb_conjugation: "Conjugación de verbos",
			contact: "Contacto",
			verbaquest: "Verbaquest",
			"user settings": "Configuración de usuario",
			logout: "Cerrar sesión",
			"here_are_the crosswords_you_have_previously_attempted:":
				"Aquí están los crucigramas que has intentado anteriormente:",
			not_attempted_crosswords: "Aún no has intentado ningún crucigrama.",
			try_it_again: "¡Inténtalo de nuevo!",
			navigate_to_crossword: "Navegar a Crucigrama",
			"time:": "Tiempo:",
			play: "Jugar",
			saved_notification: "Estos cambios han sido guardados.",
			"status:": "Estado:",
			"topics:": "Temas:",
			"difficulty:": "Dificultad:",
			completed: "Completado",
			not_attempted: "No intentado",
			search_crosswords: "Buscar crucigramas",
			crosswords: "Crucigramas",
			congratulations: "¡Felicitaciones!",
			"puzzle_completed!": "¡Rompecabezas completado!",
			completed_crossword: "¡Resolviste el crucigrama! ¡Buen trabajo!",
			do_more_crosswords: "Hacer más crucigramas",
			close: "Cerrar",
			language: "Idioma de aprendizaje preferido",
			app_language: "Idioma de la aplicación",
			difficulty: "Dificultad preferida",
			done: "Hecho",
		});
	});

	it("get Text for LanguageCode.ENGLISH", async () => {
		const translations = await translationService.getTranslations(
			LanguageCode.ENGLISH,
		);
		expect(translations).toEqual({
			dashboard: "Dashboard",
			crossword: "Crossword",
			verb_conjugation: "Verb Conjugation",
			contact: "Contact",
			verbaquest: "Verbaquest",
			"user settings": "User Settings",
			logout: "Logout",
			"here_are_the crosswords_you_have_previously_attempted:":
				"Here are the crosswords you have previously attempted:",
			not_attempted_crosswords: "You haven't attempted any crosswords yet.",
			try_it_again: "Try again!",
			navigate_to_crossword: "Navigate to Crossword",
			"time:": "Time:",
			play: "Play",
			"status:": "Status:",
			"topics:": "Topics:",
			"difficulty:": "Difficulty:",
			completed: "Completed",
			not_attempted: "Not Attempted",
			search_crosswords: "Search crosswords",
			crosswords: "Crosswords",
			congratulations: "Congratulations!",
			"puzzle_completed!": "Puzzle Completed!",
			saved_notification: "These changes have been saved.",
			completed_crossword: "You solved the crossword! Great job!",
			do_more_crosswords: "Do more Crosswords",
			close: "Close",
			language: "Preferred Learning Language",
			app_language: "App Language",
			difficulty: "Preferred Difficulty",
			done: "Done",
		});
	});
});
