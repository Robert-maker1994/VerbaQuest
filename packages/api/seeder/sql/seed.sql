INSERT INTO languages (language_id, language_code, language_name) VALUES
    (1, 'EN', 'English'),
    (2, 'ES', 'Spanish'),
    (3, 'FR', 'French');

INSERT INTO crosswords (crossword_id, language_id, title, date_created, difficulty) VALUES 
	(1, 2, 'Días de la semana', CURRENT_DATE, 1),
	(2, 2, 'Fútbol', CURRENT_DATE, 1);

INSERT INTO words (word_id, language_id, word_text, definition) VALUES
    (1, 2, 'Lunes', 'Monday'),
    (2, 2, 'Martes', 'Tuesday'),
    (3, 2, 'Miércoles', 'Wednesday'),
    (4, 2, 'Jueves', 'Thursday'),
    (5, 2, 'Viernes', 'Friday'),
    (6, 2, 'Sábado', 'Saturday'),
    (7, 2, 'Domingo', 'Sunday'),
    (8, 1, 'Monday', 'Lunes'),
    (9, 1, 'Tuesday', 'Martes'), 
    (10, 1, 'Wednesday', 'Miércoles'), 
    (11, 1, 'Thursday', 'Jueves'),
    (12, 1, 'Friday', 'Viernes'),
    (13, 1, 'Saturday', 'Sábado'),
    (14, 1, 'Sunday', 'Domingo'),
    (15, 2, 'Fútbol', 'Football'),
    (16, 2, 'Portero', 'Goalkeeper'),
    (17, 2, 'Defensa', 'Defender'),
    (18, 2, 'Centrocampista', 'Midfielder'),
    (19, 2, 'Delantero', 'Forward/Striker'),
    (20, 2, 'Gol', 'Goal'),
    (21, 2, 'Penalti', 'Penalty'),
    (22, 2, 'Tarjeta roja', 'Red card'),
    (23, 2, 'Tarjeta amarilla', 'Yellow card'),
    (24, 2, 'Fuera de juego', 'Offside'),
    (25, 2, 'Córner', 'Corner kick'),
    (26, 2, 'Tiro libre', 'Free kick'),
    (27, 2, 'Cabezazo', 'Header'),
    (28, 2, 'Pase', 'Pass'),
    (29, 2, 'Regate', 'Dribble'),
    (30, 2, 'Entrada', 'Tackle'),
    (31, 2, 'Tiempo añadido', 'Injury time/Added time'),
    (32, 2, 'Árbitro', 'Referee'),
    (33, 2, 'Estadio', 'Stadium');

INSERT INTO tenses (tense_id, tense_name, language_id) VALUES
    (1,'Presente de Indicativo', 2),  -- Present Indicative
    (2,'Pretérito Perfecto Simple', 2), -- Preterite (Perfect Simple)
    (3,'Pretérito Imperfecto', 2),    -- Imperfect
    (4, 'Pretérito Pluscuamperfecto', 2),-- Pluperfect
    (5, 'Futuro Simple', 2),           -- Future Simple
    (6, 'Futuro Perfecto', 2),         -- Future Perfect
    (7, 'Condicional Simple', 2),      -- Conditional Simple
    (8, 'Condicional Compuesto', 2),   -- Conditional Perfect
    (9, 'Presente de Subjuntivo', 2),  -- Present Subjunctive
    (10, 'Pretérito Perfecto de Subjuntivo', 2), -- Perfect Subjunctive
    (11, 'Pretérito Imperfecto de Subjuntivo', 2), -- Imperfect Subjunctive (both forms)
    (12, 'Pretérito Pluscuamperfecto de Subjuntivo', 2), -- Pluperfect Subjunctive
    (13, 'Imperativo', 2),             -- Imperative
    (14, 'Negativo Imperativo', 2);

INSERT INTO topics (topic_id, topic_name, language_id) VALUES
    (1, 'Días de la semana', 2),
    (2, 'Fútbol', 2);

INSERT INTO crossword_words (crossword_id, word_id, clue) VALUES
    (1, 1, 'Monday'),
    (1, 2, 'Tuesday'),
    (1, 3, 'Wednesday'),
    (1, 4, 'Thursday'),
    (1, 5, 'Friday'),
    (1, 6, 'Saturday'),
    (1, 7, 'Sunday'),
    (2, 15,  'Football'),
    (2, 16, 'Goalkeeper'),
    (2, 17,  'Defender'),
    (2, 18,  'Midfielder'),
    (2, 19,'Forward/Striker'),
    (2, 20,  'Goal'),
    (2, 21, 'Penalty'),
    (2, 22, 'Red card'),
    (2, 23, 'Yellow card'),
    (2, 24,'Offside'),
    (2, 25, 'Corner kick'),
    (2, 26, 'Free kick'),
    (2, 27,  'Header'),
    (2, 28, 'Pass'),
    (2, 29, 'Dribble'),
    (2, 30,'Tackle'),
    (2, 31, 'Injury time/Added time'),
    (2, 32, 'Referee'),
    (2, 33,'Stadium');

-- Insert into verbs (Spanish)
INSERT INTO verbs (infinitive, english_translation, language_id) VALUES
    ('hablar', 'to speak', 2),
    ('comer', 'to eat', 2);

INSERT INTO crossword_topics (crossword_id, topic_id) VALUES
	(1, 1),
	(2, 2);


INSERT INTO conjugations (verb_id, tense_id, grammatical_person, conjugated_form, reflexive, language_id) VALUES
    (1, 1, 'yo', 'hablo', FALSE, 2),  
    (1, 1, 'tú', 'hablas', FALSE, 2),
    (1, 1, 'él/ella/usted', 'habla', FALSE, 2),
    (1, 1, 'nosotros/nosotras', 'hablamos', FALSE, 2),
    (1, 1, 'vosotros/vosotras', 'habláis', FALSE, 2),
    (1, 1, 'ellos/ellas/ustedes', 'hablan', FALSE, 2);

-- Insert into conjugations (Spanish - Example for "comer" - Present Indicative)
INSERT INTO conjugations (verb_id, tense_id, grammatical_person, conjugated_form, reflexive, language_id) VALUES
    (2, 1, 'yo', 'como', FALSE, 2), 
    (2, 1, 'tú', 'comes', FALSE, 2),
    (2, 1, 'él/ella/usted', 'come', FALSE, 2),
    (2, 1, 'nosotros/nosotras', 'comemos', FALSE, 2),
    (2, 1, 'vosotros/vosotras', 'coméis', FALSE, 2),
    (2, 1, 'ellos/ellas/ustedes', 'comen', FALSE, 2);


